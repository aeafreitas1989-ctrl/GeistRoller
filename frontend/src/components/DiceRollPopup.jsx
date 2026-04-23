import { useState, useEffect, useMemo } from "react";
import { Dices, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HAUNTS = [
    "The Boneyard", "The Caul", "The Curse", "The Dirge",
    "The Marionette", "The Memoria", "The Oracle", "The Rage",
    "The Shroud", "The Tomb"
];

const KEY_UNLOCK_ATTRIBUTES = {
    "Beasts": "wits",
    "Blood": "presence",
    "Chance": "dexterity",
    "Cold Wind": "resolve",
    "Deep Waters": "manipulation",
    "Disease": "stamina",
    "Grave Dirt": "strength",
    "Pyre Flame": "intelligence",
    "Stillness": "composure",
};

// Plasm per turn = Synergy (Geist 2e rule)
const getPlasmaPerTurn = (synergy) => {
    return Math.max(1, synergy || 1);
};

// Positive part only (for per-turn SPEND tracking)
const positive = (n) => Math.max(0, Number(n) || 0);

// Signed display string (allows negative)
const formatSigned = (n) => {
    const v = Number(n) || 0;
    return v > 0 ? `-${v}` : v < 0 ? `+${Math.abs(v)}` : "0";
};

const formatLabel = (str) => {
    if (!str) return "";
    return str
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const formatOutcomeLine = (rollResult) => {
    const successes = rollResult?.successes || 0;

    if (rollResult?.is_dramatic_failure) {
        return `${successes} Success${successes === 1 ? "" : "es"} = Dramatic Failure`;
    }

    if (rollResult?.is_exceptional) {
        return `${successes} Success${successes === 1 ? "" : "es"} = Exceptional Success`;
    }

    if (successes > 0) {
        return `${successes} Success${successes === 1 ? "" : "es"} = Success`;
    }

    return "0 Successes = Failure";
};

const HAUNT_BASE_PLASM_LABELS = {
    "The Boneyard": { unit: "area", label: "Area" },
    "The Caul": { unit: "charges", label: "Charges" },
    "The Curse": { unit: "charges", label: "Charges" },
    "The Memoria": { unit: "charges", label: "Charges" },
    "The Oracle": { unit: "charges", label: "Charges" },
    "The Shroud": { unit: "charges", label: "Charges" },
    "The Dirge": { unit: "targets", label: "Targets" },
    "The Marionette": { unit: "size", label: "Target Size" },
    "The Tomb": { unit: "size", label: "Target Size" },
    "The Rage": { unit: "damage", label: "Damage" },
};

const BONEYARD_AREA_TABLE_LOW = {
    1: "Several rooms, or a single floor of a house",
    2: "A ballroom or small house",
    3: "A large house or building",
};

const BONEYARD_AREA_TABLE_HIGH = {
    1: "A small warehouse or parking lot",
    2: "A large warehouse or supermarket",
    3: "A small factory or shopping mall",
    4: "A large factory or city block",
    5: "A university campus, small town, or city neighborhood",
};

const getBasePlasmOptionLabel = (hauntName, n, hauntRating) => {
    if (hauntName === "The Boneyard") {
        const rating = Number(hauntRating) || 0;
        const table = rating >= 3 ? BONEYARD_AREA_TABLE_HIGH : BONEYARD_AREA_TABLE_LOW;
        const text = table[n];
        if (!text) return null;
        return `Area ${n}: ${text}`;
    }

    const meta = HAUNT_BASE_PLASM_LABELS[hauntName];
    if (!meta) return `${n} Plasm`;

    switch (meta.unit) {
        case "charges":
            return `${n} charge${n === 1 ? "" : "s"}`;
        case "targets":
            return `${n} target${n === 1 ? "" : "s"}`;
        case "size":
            return `Size ${n}`;
        case "damage":
            return `${n} damage`;
        default:
            return `${n} Plasm`;
    }
};

const getAvailablePlasmOptions = (hauntName, hauntRating) => {
    if (hauntName === "The Boneyard") {
        const rating = Number(hauntRating) || 0;
        return rating >= 3 ? [1, 2, 3, 4, 5] : [1, 2, 3];
    }
    return [1, 2, 3, 4, 5];
};

const getBasePlasmHelpText = (hauntName, hauntRating) => {
    const meta = HAUNT_BASE_PLASM_LABELS[hauntName];
    if (!meta) return null;
    if (meta.unit === "area") {
        const rating = Number(hauntRating) || 0;
        const cap = rating >= 3 ? 5 : 3;
        return `Area (choose 1–${cap} Plasm based on Boneyard rating)`;
    }
    if (meta.unit === "charges") return "Select how many charges you are creating";
    if (meta.unit === "targets") return "Select how many targets are affected";
    if (meta.unit === "size") return "Select the target's Size";
    if (meta.unit === "damage") return "Select damage";
    return null;
};

const HAUNT_CONDITION_BY_HAUNT = {
    "The Boneyard": { name: "Boneyard", usesCharges: false },
    "The Caul": { name: "Caul", usesCharges: true },
    "The Curse": { name: "Curse", usesCharges: true },
    "The Dirge": { name: "Dirge", usesCharges: false },
    "The Marionette": { name: "Marionette", usesCharges: false },
    "The Memoria": { name: "Memoria", usesCharges: true },
    "The Oracle": { name: "Oracle", usesCharges: true },
    "The Rage": { name: "Rage", usesCharges: false },
    "The Shroud": { name: "Shroud", usesCharges: true },
    "The Tomb": { name: "Tomb", usesCharges: false },
};

export const DiceRollPopup = ({
    isOpen,
    onClose,
    rollType, // 'haunt' | 'ceremony'
    initialHaunt,
    character,
    availableKeys = [],
    doomedKeys = new Set(),
    onSpendWillpower,
    onSpendPlasm,
    onAddCondition,
    onAwardBeat,
    onDiceRollResult,
    onAddRecentRoll,
    hauntEnhancements = {},
}) => {
    const [haunt, setHaunt] = useState(initialHaunt || HAUNTS[0]);
    const [key, setKey] = useState("__none__");
    const [keyResonant, setKeyResonant] = useState(false);
    const [plasmSpent, setPlasmSpent] = useState(1);
    const [selectedEnhancements, setSelectedEnhancements] = useState([]);
    const [enhancementCosts, setEnhancementCosts] = useState({});
    const [avoidDoom, setAvoidDoom] = useState(false);
    const [spendWillpower, setSpendWillpower] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const [result, setResult] = useState(null);

    // Reset state when popup opens or haunt changes
    useEffect(() => {
        if (isOpen) {
            setSelectedEnhancements([]);
            setEnhancementCosts({});
            setResult(null);
            setKeyResonant(false);
            if (initialHaunt) setHaunt(initialHaunt);
        }
    }, [isOpen, initialHaunt]);

    useEffect(() => {
        setSelectedEnhancements([]);
        setEnhancementCosts({});
        setKeyResonant(false);
    }, [haunt]);

    const hauntRating = character?.haunts?.[haunt] || 0;
    const synergy = character?.synergy || 0;
    const currentWillpower = character?.willpower || 0;
    const currentPlasm = character?.plasm || 0;
    const plasmPerTurn = getPlasmaPerTurn(synergy);

    // Get available enhancements based on haunt rating
    const availableEnhancements = useMemo(() => {
        const enhancements = [];
        const hauntEnhData = hauntEnhancements[haunt] || {};
        for (let level = 2; level <= hauntRating; level++) {
            if (hauntEnhData[level]) {
                enhancements.push(...hauntEnhData[level].map(e => ({ ...e, level, isVariable: e.costMin !== undefined })));
            }
        }
        return enhancements;
    }, [haunt, hauntRating, hauntEnhancements]);

    // Calculate key bonus
    const actualKey =
        key?.startsWith("innate::")
            ? key.split("::")[1]
            : key?.startsWith("geist::")
            ? key.split("::")[1]
            : key?.startsWith("memento::")
            ? character?.mementos?.[parseInt(key.split("::")[1])]?.key
            : null;
    const keyAttr = actualKey ? KEY_UNLOCK_ATTRIBUTES[actualKey] : null;
    const keyBonus = (actualKey && keyAttr)
        ? (character?.attributes?.[keyAttr] || 0) 
        : 0;
    const doomOrigin =
        key?.startsWith("memento::")
            ? (character?.mementos?.[parseInt(key.split("::")[1], 10)]?.name || actualKey)
            : actualKey;

    // Calculate total enhancement cost
    const totalEnhancementCost = selectedEnhancements.reduce((sum, enhName) => {
        const customCost = enhancementCosts[enhName];
        if (customCost !== undefined) return sum + customCost;
        const enh = availableEnhancements.find(e => e.name === enhName);
        if (enh?.isVariable) return sum + (enh.costMin || 1);
        return sum + (typeof enh?.cost === 'number' ? enh.cost : 0);
    }, 0);

    // Net Plasm change for the action (can be negative if Key free Plasm exceeds cost)
    const netPlasmChange = (plasmSpent + totalEnhancementCost) - keyBonus; // spend if >0, gain if <0

    // Plasm spent that counts toward per-turn limit (Key free Plasm is exempt)
    const plasmCountingTowardLimit = plasmSpent + totalEnhancementCost;
    const turnsToResolve = Math.ceil(plasmCountingTowardLimit / plasmPerTurn);
    const exceedsPerTurnLimit = plasmCountingTowardLimit > plasmPerTurn;

    // Willpower constraints - can only spend 1 per action
    const willpowerUseOption = spendWillpower ? "bonus" : (key !== "__none__" && !avoidDoom ? "doom" : "none");
    const canUseWillpowerForBonus = currentWillpower > 0 && !(key !== "__none__" && !avoidDoom);
    const canAvoidDoom = currentWillpower > 0 && !spendWillpower;

    // Dice pool
    const dicePool = synergy + hauntRating + keyBonus;

    const handleEnhancementToggle = (enhName, checked) => {
        if (checked) {
            setSelectedEnhancements([...selectedEnhancements, enhName]);
            // Set default cost for variable enhancements
            const enh = availableEnhancements.find(e => e.name === enhName);
            if (enh?.isVariable) {
                setEnhancementCosts({ ...enhancementCosts, [enhName]: enh.costMin || 1 });
            }
        } else {
            setSelectedEnhancements(selectedEnhancements.filter(n => n !== enhName));
            const newCosts = { ...enhancementCosts };
            delete newCosts[enhName];
            setEnhancementCosts(newCosts);
        }
    };

    const handleVariableCostChange = (enhName, cost) => {
        setEnhancementCosts({ ...enhancementCosts, [enhName]: cost });
    };

    // When +3 bonus is toggled on, force avoidDoom off (since only 1 WP per action)
    const handleWillpowerBonusToggle = (checked) => {
        setSpendWillpower(checked);
        if (checked && key !== "__none__") {
            // Can't use WP for both, so turn off avoiding doom
            setAvoidDoom(false);
        }
    };

    // When avoidDoom is toggled on, turn off +3 bonus
    const handleAvoidDoomToggle = (checked) => {
        setAvoidDoom(checked);
        if (checked) {
            setSpendWillpower(false);
        }
    };

    const rollDice = async () => {
        // Only 1 Willpower can be spent per action
        const willpowerNeeded = spendWillpower ? 1 : (key !== "__none__" && avoidDoom ? 1 : 0);

        if (willpowerNeeded > 0 && currentWillpower < willpowerNeeded) {
            toast.error(`Not enough Willpower (need ${willpowerNeeded}, have ${currentWillpower})`);
            return;
        }

        if (netPlasmChange > 0 && currentPlasm < netPlasmChange) {
            toast.error(`Not enough Plasm (need ${netPlasmChange}, have ${currentPlasm})`);
            return;
        }

        setIsRolling(true);

        try {
            // Spend Willpower (only 1 per action)
            if (willpowerNeeded > 0) {
                await onSpendWillpower();
            }

            // Apply net Plasm change (can be negative to GAIN Plasm from Key)
            if (netPlasmChange !== 0) {
                await onSpendPlasm(netPlasmChange);
            }

            // Add Doomed condition if not avoiding (and not using WP for +3)
            if (key !== "__none__" && !avoidDoom && !spendWillpower) {
                await onAddCondition({
                    name: "Doomed",
                    type: "geist",
                    description: `Embraced ${actualKey}'s doom. The next doom effect triggers automatically.`,
                    origin: doomOrigin,
                });
                toast.warning(`Gained Doomed condition for ${actualKey} (${doomOrigin})`);
            }

            // Roll dice
            const poolTotal = Math.max(1, dicePool + (spendWillpower ? 3 : 0));
            const response = await axios.post(`${API}/dice/roll`, {
                pool: poolTotal,
                again: 10,
                rote: false,
                chance: false,
            });

            await new Promise(resolve => setTimeout(resolve, 300));
            const base = response.data;
            const resonantExceptional =
                key !== "__none__" &&
                keyResonant &&
                !base.is_dramatic_failure &&
                base.successes >= 3;
            const patchedResult = {
                ...base,
                is_exceptional: base.is_exceptional || resonantExceptional,
            };

            setResult(patchedResult);

            // On a successful Haunt activation, add the appropriate Haunt Condition.
            // For charge-based Haunts, store charges to enable charge counters in the Cards → Haunts section.
            const successesForCondition = patchedResult.successes;
            if (rollType === "haunt" && patchedResult.successes > 0 && onAddCondition) {
                const meta = HAUNT_CONDITION_BY_HAUNT[haunt];
                if (meta?.name) {
                    const existing = (character?.conditions || []).some((c) => (c?.name || "") === meta.name);
                    if (!existing) {
                        const basePurpose = HAUNT_BASE_PLASM_LABELS[haunt]?.label;
                        const baseSelectLabel = getBasePlasmOptionLabel(haunt, plasmSpent, hauntRating);
                        const conditionDescription =
                            meta.usesCharges
                                ? `${meta.name} is active with ${plasmSpent} charge${plasmSpent === 1 ? "" : "s"}.`
                                : `${meta.name} is active. ${basePurpose ? `${basePurpose}: ${baseSelectLabel}.` : ""}`;
                        await onAddCondition({
                            name: meta.name,
                            type: "geist",
                            origin: haunt,
                            description: conditionDescription,
                            ...(meta.usesCharges ? { charges: plasmSpent } : {}),
                        });
                    }
                }
            }

            // Build chat message
            let rollDescription = `**${haunt}** (${hauntRating}●)`;
            if (key !== "__none__") {
                rollDescription += ` unlocked with **${actualKey}**`;
            }
            if (selectedEnhancements.length > 0) {
                rollDescription += `\nEnhancements: ${selectedEnhancements.join(", ")}`;
            }

            let resultType = "";
            let resultEmoji = "";
            const successes = patchedResult.successes;

            if (patchedResult.is_dramatic_failure) {
                resultType = "**DRAMATIC FAILURE**";
                resultEmoji = "💀";
            } else if (successes === 0) {
                resultType = "**Failure**";
                resultEmoji = "❌";
            } else if (patchedResult.is_exceptional) {
                resultType = "**EXCEPTIONAL SUCCESS!**";
                resultEmoji = "✨";
            } else {
                resultType = `**Success** (${successes})`;
                resultEmoji = "✅";
            }

            const diceStr = patchedResult.dice.join(", ");
            const plasmLine =
                key !== "__none__"
                    ? `*Plasm:* ${formatSigned(netPlasmChange)} (includes +${keyBonus} free from ${actualKey})`
                    : `*Plasm:* ${formatSigned(netPlasmChange)}`;

            const header =
                rollType === "ceremony"
                    ? "**Ceremony Roll:**"
                    : "**Haunt Activation:**";
            const chatMessage = `${resultEmoji} ${header} ${rollDescription}\n*Pool:* ${poolTotal} dice → [${diceStr}]\n${plasmLine}\n*Result:* ${resultType}`;

            if (onDiceRollResult) {
                onDiceRollResult(chatMessage);
            }

            const cleanRollDescription = rollDescription.replace(/\*\*/g, "");
            const transcript = [
                `Rolled ${cleanRollDescription} = ${poolTotal} dice [10!]`,
                plasmLine.replace(/\*/g, ""),
                formatOutcomeLine(patchedResult),
                patchedResult.dice.join(" "),
            ].join("\n");

            onAddRecentRoll?.({
                title: rollType === "ceremony" ? "Ceremony" : haunt,
                transcript,
                outcome: formatOutcomeLine(patchedResult),
            });

            if (patchedResult.beat_awarded) {
                await onAwardBeat();
                toast.warning("Dramatic Failure: Beat gained");
            } else if (patchedResult.is_dramatic_failure) {
                toast.error("Dramatic Failure!");
            } else if (patchedResult.is_exceptional) {
                toast.success(`Exceptional! ${patchedResult.successes} successes`);
            }

        } catch (error) {
            toast.error("Failed to roll dice");
        } finally {
            setIsRolling(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-teal-300 font-heading">
                        <Dices className="w-5 h-5" />
                        Haunt Activation
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Haunt Selection */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Haunt</label>
                            <Select value={haunt} onValueChange={setHaunt}>
                                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700">
                                    {HAUNTS.map((h) => (
                                        <SelectItem key={h} value={h}>{h}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[10px] text-zinc-600 mt-1">Rating: {hauntRating}● | Synergy: {synergy}</p>
                        </div>
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Unlock Key</label>
                            <Select value={key} onValueChange={setKey}>
                                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700">
                                    <SelectItem value="__none__">None</SelectItem>
                                {(() => {
                                    const options = [];
                                    // 1. Character Innate Key
                                    if (character?.innate_key) {
                                        options.push({
                                            value: `innate::${character.innate_key}`,
                                            keyName: character.innate_key,
                                            label: `Innate (${character.innate_key})`,
                                        });
                                    }
                                    // 2. Geist Innate Key
                                    if (character?.geist_innate_key) {
                                        options.push({
                                            value: `geist::${character.geist_innate_key}`,
                                            keyName: character.geist_innate_key,
                                            label: `Geist (${character.geist_innate_key})`,
                                        });
                                    }
                                    // 3. Mementos (each one separately, even if same Key)
                                    (character?.mementos || []).forEach((m, index) => {
                                        if (!m?.key) return;
                                        options.push({
                                            value: `memento::${index}`,
                                            keyName: m.key,
                                            label: `${m.name} (${m.key})`,
                                        });
                                    });
                                    return options.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                            disabled={doomedKeys.has(opt.keyName)}
                                        >
                                            {opt.label} {doomedKeys.has(opt.keyName) ? "(Doomed)" : ""}
                                        </SelectItem>
                                    ));
                                })()}
                                </SelectContent>
                            </Select>
                            {key !== "__none__" && (
                                <div className="mt-1 space-y-2">
                                        <p className="text-[10px] text-teal-400">+{keyBonus} dice, +{keyBonus} Plasm</p>
                                        <div className="flex items-center justify-between bg-zinc-800/50 rounded px-2 py-1">
                                            <div>
                                                <p className="text-[10px] text-fuchsia-300 uppercase tracking-wider">Resonant</p>
                                                <p className="text-[10px] text-zinc-500">Exceptional success at 3+ successes</p>
                                            </div>
                                            <Switch
                                                checked={keyResonant}
                                                onCheckedChange={setKeyResonant}
                                                data-testid="key-resonant-toggle"
                                            />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Base Plasm */}
                    <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Base Plasm</label>
                        {getBasePlasmHelpText(haunt, hauntRating) && (
                            <p className="text-[10px] text-zinc-600 mt-1">
                                {getBasePlasmHelpText(haunt, hauntRating)}
                            </p>
                        )}
                        <Select value={plasmSpent.toString()} onValueChange={(v) => setPlasmSpent(parseInt(v))}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                {getAvailablePlasmOptions(haunt, hauntRating).map((n) => {
                                    const label = getBasePlasmOptionLabel(haunt, n, hauntRating);
                                    if (!label) return null;

                                    return (
                                        <SelectItem key={n} value={n.toString()}>
                                            {label}
                                            <span className="text-zinc-600"> ({n} Plasm)</span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Enhancements */}
                    {availableEnhancements.length > 0 && (
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Enhancements</label>
                            <div className="mt-1 space-y-1 max-h-40 overflow-y-auto bg-zinc-800/50 rounded p-2">
                                {availableEnhancements.map((enh) => (
                                    <div key={enh.name} className="space-y-1">
                                        <label 
                                            className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                                                selectedEnhancements.includes(enh.name)
                                                    ? "bg-teal-900/40 border border-teal-500/40"
                                                    : "bg-zinc-900/50 border border-transparent hover:border-zinc-700"
                                            }`}
                                        >
                                            <Checkbox
                                                checked={selectedEnhancements.includes(enh.name)}
                                                onCheckedChange={(checked) => handleEnhancementToggle(enh.name, checked)}
                                                className="h-4 w-4"
                                            />
                                            <div className="flex-1">
                                                <span className="text-zinc-200">{enh.name}</span>
                                                <p className="text-[10px] text-zinc-500">{enh.description}</p>
                                            </div>
                                            <span className="text-cyan-400 text-xs">
                                                {enh.isVariable ? `${enh.costMin}-${enh.costMax}P` : `${enh.cost}P`}
                                            </span>
                                            <span className="text-zinc-600 text-[10px]">●{enh.level}</span>
                                        </label>
                                        {/* Variable cost selector */}
                                        {enh.isVariable && selectedEnhancements.includes(enh.name) && (
                                            <div className="ml-6 flex items-center gap-2">
                                                <span className="text-[10px] text-zinc-500">Plasm:</span>
                                                <Select 
                                                    value={(enhancementCosts[enh.name] || enh.costMin).toString()} 
                                                    onValueChange={(v) => handleVariableCostChange(enh.name, parseInt(v))}
                                                >
                                                    <SelectTrigger className="h-6 w-20 bg-zinc-800 border-zinc-700 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                                        {Array.from({ length: enh.costMax - enh.costMin + 1 }, (_, i) => enh.costMin + i).map((n) => (
                                                            <SelectItem key={n} value={n.toString()} className="text-xs">{n}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {hauntRating < 2 && (
                        <p className="text-[10px] text-zinc-600 italic text-center">Enhancements require Haunt ●● or higher</p>
                    )}

                    {/* Net Plasm Change */}
                    <div className="bg-zinc-800/70 rounded p-3 text-center">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Net Plasm Change</div>
                        <div className="text-lg font-mono mt-1">
                            <span className="text-zinc-400">{plasmSpent}</span>
                            {totalEnhancementCost > 0 && <span className="text-cyan-400"> + {totalEnhancementCost}</span>}
                            {key !== "__none__" && <span className="text-teal-400"> - {keyBonus}</span>}
                            <span className="text-zinc-300"> = </span>
                            <span
                                className={
                                    netPlasmChange > 0 && netPlasmChange > currentPlasm
                                        ? "text-red-400"
                                        : netPlasmChange < 0
                                        ? "text-teal-300"
                                        : "text-cyan-300"
                                }
                            >
                                {netPlasmChange}
                            </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-1">
                            Interpretation: {netPlasmChange > 0 ? `Spend ${netPlasmChange}` : netPlasmChange < 0 ? `Gain ${Math.abs(netPlasmChange)}` : "No change"}
                        </div>
                        {selectedEnhancements.length > 0 && (
                            <div className="text-[10px] text-zinc-500 mt-1">{selectedEnhancements.join(", ")}</div>
                        )}
                        <div className="text-[10px] text-zinc-600 mt-1">Current: {currentPlasm} Plasm</div>
                    </div>

                    {/* Plasm Per-Turn Warning */}
                    {exceedsPerTurnLimit && (
                        <div className="bg-amber-950/30 border border-amber-500/30 rounded p-3 flex items-start gap-2" data-testid="plasm-turn-warning">
                            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-amber-300">Exceeds per-turn Plasm limit</p>
                                <p className="text-[10px] text-zinc-400">
                                    Spending {plasmCountingTowardLimit}P but limit is {plasmPerTurn}P/turn (Synergy {synergy}).
                                    This will take <span className="text-amber-300 font-mono">{turnsToResolve} turns</span> to spend.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Avoid Doom */}
                    {key !== "__none__" && (
                        <div className="bg-amber-950/30 border border-amber-500/30 rounded p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm text-amber-300">Avoid Key's Doom</span>
                                    <p className="text-[10px] text-zinc-500">Spend 1 Willpower to avoid Doomed condition</p>
                                    {spendWillpower && (
                                        <p className="text-[10px] text-rose-400 mt-0.5">Cannot use: WP already spent for +3 dice</p>
                                    )}
                                </div>
                                <Switch
                                    checked={avoidDoom}
                                    onCheckedChange={handleAvoidDoomToggle}
                                    disabled={!canAvoidDoom}
                                    data-testid="avoid-doom-toggle"
                                />
                            </div>
                            {!avoidDoom && !spendWillpower && (
                                <p className="text-[10px] text-amber-400 italic mt-2">You will gain the Doomed condition for {key}</p>
                            )}
                        </div>
                    )}

                    {/* Willpower Bonus */}
                    <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded">
                        <div>
                            <span className="text-sm text-zinc-300">Spend Willpower (+3 dice)</span>
                            <p className="text-[10px] text-zinc-600">Current: {currentWillpower}</p>
                            {key !== "__none__" && avoidDoom && (
                                <p className="text-[10px] text-rose-400 mt-0.5">Cannot use: WP already spent to Avoid Doom</p>
                            )}
                        </div>
                        <Switch
                            checked={spendWillpower}
                            onCheckedChange={handleWillpowerBonusToggle}
                            disabled={!canUseWillpowerForBonus}
                            data-testid="willpower-bonus-toggle"
                        />
                    </div>

                    {/* Dice Pool Summary */}
                    <div className="bg-teal-900/20 border border-teal-500/30 rounded p-3 text-center">
                        <div className="text-[10px] text-teal-400 uppercase tracking-wider">Dice Pool</div>
                        <div className="text-2xl font-mono text-teal-300 mt-1">
                            {dicePool + (spendWillpower ? 3 : 0)}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-1">
                            Synergy ({synergy}) + {haunt} ({hauntRating}){keyBonus > 0 && ` + ${actualKey} (${keyBonus})`}{spendWillpower && " + WP (3)"}
                        </div>
                    </div>

                    {/* Result Display */}
                    {result && (
                        <div className={`p-4 rounded text-center ${
                            result.is_dramatic_failure ? "bg-red-950/50 border border-red-500/50" :
                            result.successes === 0 ? "bg-zinc-800/50 border border-zinc-600/50" :
                            result.is_exceptional ? "bg-amber-950/50 border border-amber-500/50" :
                            "bg-teal-950/50 border border-teal-500/50"
                        }`}>
                            <div className="text-sm text-zinc-400 mb-2">
                                [{result.dice.join(", ")}]
                            </div>
                            <div className={`text-xl font-bold ${
                                result.is_dramatic_failure ? "text-red-400" :
                                result.successes === 0 ? "text-zinc-400" :
                                result.is_exceptional ? "text-amber-400" :
                                "text-teal-400"
                            }`}>
                                {result.is_dramatic_failure ? "DRAMATIC FAILURE" :
                                 result.successes === 0 ? "Failure" :
                                 result.is_exceptional ? `EXCEPTIONAL! ${result.successes} Successes` :
                                 `${result.successes} Success${result.successes > 1 ? "es" : ""}`}
                            </div>
                        </div>
                    )}

                    {/* Roll Button */}
                    <Button
                        className="w-full btn-primary"
                        onClick={rollDice}
                        disabled={isRolling || hauntRating === 0}
                    >
                        {isRolling ? (
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 animate-spin" /> Rolling...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Dices className="w-4 h-4" /> ROLL {dicePool + (spendWillpower ? 3 : 0)} DICE
                            </span>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DiceRollPopup;