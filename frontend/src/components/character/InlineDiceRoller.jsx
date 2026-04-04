import { useState, useMemo, useEffect } from "react";
import { Dices, ChevronDown, ChevronRight, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import axios from "axios";
import { toast } from "sonner";
import { HAUNTS, HAUNT_ENHANCEMENTS, ATTRIBUTE_LIST, SKILL_LIST, KEY_UNLOCK_ATTRIBUTES } from "../../data/character-data";
import { formatLabel } from "./StatComponents";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const InlineDiceRoller = ({
    getValue,
    getNestedValue,
    availableKeys = [],
    doomedKeys = new Set(),
    onSpendWillpower,
    onAwardBeat,
    onSpendPlasm,
    onAddCondition,
    onDiceRollResult,
    geistRank = 1,
    woundPenalty = 0,
    currentPlasm = 0,
    preset = null,
    forceExpanded = false,
    isMage = false,
    onOpenSpellcasting,
}) => {
    const [rollType, setRollType] = useState("attr-attr");
    const [primaryAttr, setPrimaryAttr] = useState("wits");
    const [secondaryAttr, setSecondaryAttr] = useState("composure");
    const [skill, setSkill] = useState("investigation");
    const [haunt, setHaunt] = useState(HAUNTS[0]);
    const [spellArcanum, setSpellArcanum] = useState("");
    const [key, setKey] = useState("__none__");
    const [useSpecialty, setUseSpecialty] = useState(false);
    const [useRemembrance, setUseRemembrance] = useState(false);
    const [spendWillpower, setSpendWillpower] = useState(false);
    const [againRule, setAgainRule] = useState("10");
    const [useRote, setUseRote] = useState(false);
    const [diceModifier, setDiceModifier] = useState(0);
    const [selectedEquipKey, setSelectedEquipKey] = useState("__none__");
    const [isRolling, setIsRolling] = useState(false);
    const [result, setResult] = useState(null);
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        if (forceExpanded) setExpanded(true);
    }, [forceExpanded]);
    useEffect(() => {
        if (!preset) return;
        setExpanded(true);

        if (preset.type === "attribute") {
            setRollType("attr-attr");
            setPrimaryAttr(preset.key);
            return;
        }

        if (preset.type === "skill") {
            setRollType("attr-skill");
            setSkill(preset.key);
            return;
        }

        if (preset.type === "perception") {
            setRollType("attr-attr");
            setPrimaryAttr("wits");
            setSecondaryAttr("composure");
            return;
        }

        if (preset.type === "chat") {
            const rawFormula = (preset.formula || preset.label || "").trim();
            const formula = rawFormula.split("(")[0].trim();
            const parts = formula.split("+").map((part) => part.trim().toLowerCase());

            const inferredSpecialty =
                !!preset.specialty ||
                /specialt(y|ies)\s*:|specialt(y|ies)\b/i.test(rawFormula);

            setAgainRule(String(preset.again || 10));
            setUseRote(!!preset.rote);
            setUseSpecialty(inferredSpecialty);
            setUseRemembrance(false);
            setSpendWillpower(false);
            setSelectedEquipKey("__none__");

            if (parts.length === 2) {
                const left = parts[0];
                const right = parts[1];

                if (ATTRIBUTE_LIST.includes(left) && ATTRIBUTE_LIST.includes(right)) {
                    setRollType("attr-attr");
                    setPrimaryAttr(left);
                    setSecondaryAttr(right);

                    const basePool =
                        (getNestedValue("attributes", left) || 0) +
                        (getNestedValue("attributes", right) || 0);

                    setDiceModifier((preset.pool || basePool) - basePool);
                    return;
                }

                if (ATTRIBUTE_LIST.includes(left) && SKILL_LIST.includes(right)) {
                    setRollType("attr-skill");
                    setPrimaryAttr(left);
                    setSkill(right);

                    const specialtyBonus = inferredSpecialty ? 1 : 0;
                    const basePool =
                        (getNestedValue("attributes", left) || 0) +
                        (getNestedValue("skills", right) || 0) +
                        specialtyBonus;

                    setDiceModifier((preset.pool || basePool) - basePool);
                    return;
                }
            }

            setDiceModifier(0);
        }
    }, [preset, getNestedValue]);
    
    // Haunt-specific options
    const [plasmSpent, setPlasmSpent] = useState(1);
    const [selectedEnhancements, setSelectedEnhancements] = useState([]);
    const [avoidDoom, setAvoidDoom] = useState(true);

    const attributeValue = (attr) => getNestedValue("attributes", attr) || 0;
    const skillValue = (skillKey) => getNestedValue("skills", skillKey) || 0;
    const hauntRating = getNestedValue("haunts", haunt) || 0;
    const synergy = getValue("synergy") || 0;
    const currentWillpower = getValue("willpower") || 0;
    const characterInnateKey = getValue("innate_key") || "";
    const geistInnateKey = getValue("geist_innate_key") || "";
    const mementos = getValue("mementos") || [];
    const arcana = getValue("arcana") || {};
    const availableArcana = useMemo(() => {
        return Object.entries(arcana)
            .filter(([, dots]) => (dots || 0) > 0)
            .map(([name]) => name);
    }, [arcana]);
    const meritsList = getValue("merits_list") || [];
    const trainedObserver = (meritsList || []).find((m) => m?.name === "Trained Observer");
    const trainedObserverDots = trainedObserver?.dots || 0;
    const trainedObserverAgainRule = trainedObserverDots >= 3 ? "8" : (trainedObserverDots >= 1 ? "9" : null);

    const trainedObserverApplies =
        rollType === "attr-attr" &&
        primaryAttr === "wits" &&
        secondaryAttr === "composure" &&
        !!trainedObserverAgainRule;
    const hasSmallFramed = (meritsList || []).some((m) => (m?.name || "") === "Small-Framed");
    const smallFramedStealthBonus = (rollType === "attr-skill" && skill === "stealth" && hasSmallFramed) ? 2 : 0;
    const professionalTraining = meritsList.find((m) => m?.name === "Professional Training");
    const professionalTrainingDots = professionalTraining?.dots || 0;
    const professionalTrainingAssetSkills = Array.isArray(professionalTraining?.assetSkills)
        ? professionalTraining.assetSkills.filter((s) => s && s !== "__none__")
        : [];
    const professionalTrainingApplies =
        rollType === "attr-skill" &&
        professionalTrainingDots >= 3 &&
        professionalTrainingAssetSkills.includes(skill);
    const inventoryItems = getValue("inventory_items") || [];
    
    const equippedEquipmentOptions = inventoryItems
        .map((it, idx) => ({ it, idx }))
        .filter(({ it }) => it?.type === "equipment" && !!it?.equipped)
        .map(({ it, idx }) => {
            const bonus = it?.equipment?.bonus ?? 0;
            return {
                key: String(idx),
                label: `${it?.name || "Equipment"} (+${bonus})`,
                bonus,
            };
        });

    const selectedEquipBonus = selectedEquipKey === "__none__"
        ? 0
        : (equippedEquipmentOptions.find((o) => o.key === selectedEquipKey)?.bonus ?? 0);

    // Get available enhancements based on haunt rating
    const availableEnhancements = useMemo(() => {
        const enhancements = [];
        const hauntEnhData = HAUNT_ENHANCEMENTS[haunt] || {};
        for (let level = 2; level <= hauntRating; level++) {
            if (hauntEnhData[level]) {
                enhancements.push(...hauntEnhData[level].map(e => ({ ...e, level })));
            }
        }
        return enhancements;
    }, [haunt, hauntRating]);

    // Reset enhancements when haunt changes
    useEffect(() => {
        setSelectedEnhancements([]);
    }, [haunt]);

    useEffect(() => {
        if (!isMage) return;

        if (availableArcana.length === 0) {
            setSpellArcanum("");
            return;
        }

        if (!availableArcana.includes(spellArcanum)) {
            setSpellArcanum(availableArcana[0]);
        }
    }, [isMage, availableArcana, spellArcanum]);

    // Calculate total enhancement cost
    const enhancementCost = selectedEnhancements.reduce((sum, enhName) => {
        const enh = availableEnhancements.find(e => e.name === enhName);
        return sum + (enh?.cost || 0);
    }, 0);

    const keyBonus = (key && key !== "__none__") ? attributeValue(KEY_UNLOCK_ATTRIBUTES[key]) : 0;
    const primaryAttrValue = attributeValue(primaryAttr);
    const secondaryAttrValue = attributeValue(secondaryAttr);
    const selectedSkillValue = skillValue(skill);
    const remembranceBonus = useRemembrance ? geistRank : 0;
    const willpowerBonus = spendWillpower ? 3 : 0;
    const manualMod =
        (rollType === "attr-attr" || rollType === "attr-skill")
            ? (parseInt(diceModifier, 10) || 0)
            : 0;

    const equipMod =
        (rollType === "attr-attr" || rollType === "attr-skill")
            ? (parseInt(selectedEquipBonus, 10) || 0)
            : 0;

    const modifierBonus = manualMod + equipMod;

    // Calculate net Plasm cost for Haunt (base + enhancements - key unlock attribute)
    const netPlasmCost = rollType === "haunt" 
        ? Math.max(0, plasmSpent + enhancementCost - keyBonus)
        : 0;

    const basePool = (() => {
        if (rollType === "attr-attr") {
            return primaryAttrValue + secondaryAttrValue;
        }
        if (rollType === "attr-skill") {
            return (
                primaryAttrValue +
                selectedSkillValue +
                (useSpecialty ? 1 : 0) +
                remembranceBonus +
                smallFramedStealthBonus
            );
        }
        if (rollType === "haunt") {
            return synergy + hauntRating + keyBonus;
        }
        return 1;
    })();

    const displayedAgainRule = trainedObserverApplies
        ? trainedObserverAgainRule
        : (professionalTrainingApplies ? "9" : againRule);

    const againIsForced = trainedObserverApplies || professionalTrainingApplies;

    const poolTotal = rollType === "chance"
        ? 1
        : Math.max(0, basePool + modifierBonus + willpowerBonus + woundPenalty);

    const rollDice = async () => {
        if (rollType === "spellcasting") {
            if (!spellArcanum) {
                toast.error("Choose an Arcanum first");
                return;
            }

            if (typeof onOpenSpellcasting === "function") {
                onOpenSpellcasting(spellArcanum);
            }
            return;
        }
        // Handle Willpower spending (for +3 bonus OR avoiding doom)
        const needsWillpowerForBonus = spendWillpower;
        const needsWillpowerForDoom = rollType === "haunt" && key !== "__none__" && avoidDoom;
        const totalWillpowerNeeded = (needsWillpowerForBonus ? 1 : 0) + (needsWillpowerForDoom ? 1 : 0);
        
        if (totalWillpowerNeeded > 0) {
            if (currentWillpower < totalWillpowerNeeded) {
                toast.error(`Not enough Willpower (need ${totalWillpowerNeeded}, have ${currentWillpower})`);
                return;
            }
            for (let i = 0; i < totalWillpowerNeeded; i++) {
                const spent = await onSpendWillpower();
                if (!spent) {
                    toast.error("Failed to spend Willpower");
                    return;
                }
            }
        }

        // Handle Plasm spending for Haunt
        if (rollType === "haunt" && netPlasmCost > 0) {
            if (currentPlasm < netPlasmCost) {
                toast.error(`Not enough Plasm (need ${netPlasmCost}, have ${currentPlasm})`);
                return;
            }
            const plasmaSpent = await onSpendPlasm(netPlasmCost);
            if (!plasmaSpent) {
                toast.error("Failed to spend Plasm");
                return;
            }
        }

        // Add Doomed condition if not avoiding doom
        if (rollType === "haunt" && key !== "__none__" && !avoidDoom) {
            await onAddCondition({
                name: "Doomed",
                type: "geist",
                description: `You have embraced your Key's doom. The next time you would resolve this Key's doom effect, it triggers automatically.`,
                origin: key,
            });
            toast.warning(`Gained Doomed condition for ${key}`);
        }

        setIsRolling(true);
        setResult(null);

        try {
            const response = await axios.post(`${API}/dice/roll`, {
                pool: rollType === "chance" ? 1 : Math.max(1, poolTotal),
                again: (rollType === "attr-attr" || rollType === "attr-skill") ? parseInt(displayedAgainRule, 10) : 10,
                rote: (rollType === "attr-attr" || rollType === "attr-skill") ? useRote : false,
                chance: rollType === "chance",
            });

            await new Promise(resolve => setTimeout(resolve, 300));
            setResult(response.data);

            // Build roll description for chat
            let rollDescription = "";
            if (rollType === "haunt") {
                rollDescription = `**${haunt}** (${hauntRating}●)`;
                if (key !== "__none__") {
                    rollDescription += ` unlocked with **${key}**`;
                }
                if (selectedEnhancements.length > 0) {
                    rollDescription += `\nEnhancements: ${selectedEnhancements.join(", ")}`;
                }
            } else if (rollType === "attr-skill") {
                rollDescription = `${formatLabel(primaryAttr)} + ${formatLabel(skill)}`;
            } else if (rollType === "attr-attr") {
                rollDescription = `${formatLabel(primaryAttr)} + ${formatLabel(secondaryAttr)}`;
            } else {
                rollDescription = "Chance Die";
            }
            if ((rollType === "attr-skill" || rollType === "attr-attr") && modifierBonus !== 0) {
                rollDescription += ` (mod ${modifierBonus > 0 ? "+" : ""}${modifierBonus})`;
            }

            // Determine result type
            let resultType = "";
            let resultEmoji = "";
            const successes = response.data.successes;
            
            if (response.data.is_dramatic_failure) {
                resultType = "**DRAMATIC FAILURE**";
                resultEmoji = "💀";
            } else if (successes === 0) {
                resultType = "**Failure**";
                resultEmoji = "❌";
            } else if (response.data.is_exceptional) {
                resultType = "**EXCEPTIONAL SUCCESS!**";
                resultEmoji = "✨";
            } else {
                resultType = `**Success** (${successes})`;
                resultEmoji = "✅";
            }

            // Send to chat
            const diceStr = response.data.dice.join(", ");
            const chatMessage = `${resultEmoji} **Dice Roll:** ${rollDescription}\n*Pool:* ${poolTotal} dice → [${diceStr}]\n*Result:* ${resultType}`;
            
            if (onDiceRollResult) {
                onDiceRollResult(chatMessage);
            }

            if (response.data.beat_awarded) {
                await onAwardBeat();
                toast.warning("Dramatic Failure: Beat gained");
            } else if (response.data.is_dramatic_failure) {
                toast.error("Dramatic Failure!");
            } else if (response.data.is_exceptional) {
                toast.success(`Exceptional! ${response.data.successes} successes`);
            }
        } catch (error) {
            toast.error("Failed to roll dice");
        } finally {
            setIsRolling(false);
        }
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm" data-testid="inline-dice-roller">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-2 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400 hover:bg-zinc-800/50"
                data-testid="inline-dice-roller-toggle"
            >
                <span className="flex items-center gap-2">
                    <Dices className="w-4 h-4 text-teal-500" />
                    Dice Roller
                </span>
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {expanded && (
                <div className="p-3 border-t border-zinc-800 space-y-3">
                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Roll Type</label>
                        <Select value={rollType} onValueChange={setRollType}>
                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid="dice-roll-type-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                <SelectItem value="attr-attr" className="text-xs">Attribute + Attribute</SelectItem>
                                <SelectItem value="attr-skill" className="text-xs">Attribute + Skill</SelectItem>
                                {isMage ? (
                                    <SelectItem value="spellcasting" className="text-xs">Spellcasting</SelectItem>
                                ) : (
                                    <SelectItem value="haunt" className="text-xs">Haunt Activation</SelectItem>
                                )}
                                <SelectItem value="chance" className="text-xs">Chance Die</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {rollType === "attr-attr" && (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Attribute</label>
                                <Select value={primaryAttr} onValueChange={setPrimaryAttr}>
                                    <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid="dice-primary-attribute">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                        {ATTRIBUTE_LIST.map((attr) => (
                                            <SelectItem key={attr} value={attr} className="text-xs">{formatLabel(attr)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Attribute</label>
                                <Select value={secondaryAttr} onValueChange={setSecondaryAttr}>
                                    <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid="dice-secondary-attribute">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                        {ATTRIBUTE_LIST.map((attr) => (
                                            <SelectItem key={attr} value={attr} className="text-xs">{formatLabel(attr)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {rollType === "attr-skill" && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Attribute</label>
                                    <Select value={primaryAttr} onValueChange={setPrimaryAttr}>
                                        <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid="dice-attr-skill-attribute">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                            {ATTRIBUTE_LIST.map((attr) => (
                                                <SelectItem key={attr} value={attr} className="text-xs">{formatLabel(attr)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Skill</label>
                                    <Select value={skill} onValueChange={setSkill}>
                                        <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid="dice-skill-select">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                            {SKILL_LIST.map((skillKey) => (
                                                <SelectItem key={skillKey} value={skillKey} className="text-xs">{formatLabel(skillKey)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                <span>Specialty</span>
                                <Switch checked={useSpecialty} onCheckedChange={setUseSpecialty} data-testid="dice-specialty-toggle" />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                <span>Remembrance</span>
                                <Switch checked={useRemembrance} onCheckedChange={setUseRemembrance} data-testid="dice-remembrance-toggle" />
                            </div>
                            {useRemembrance && (
                                <p className="text-[10px] text-teal-400" data-testid="dice-remembrance-bonus">
                                    Remembrance bonus +{geistRank} (Geist Rank)
                                </p>
                            )}
                            {(getValue("remembrance_trait") || getValue("remembrance_trait_type")) && (
                                <p className="text-[10px] text-zinc-600">
                                    Remembrance Trait: {getValue("remembrance_trait") || "Unset"} ({getValue("remembrance_trait_type") || ""})
                                </p>
                            )}
                        </div>
                    )}

                    {rollType === "haunt" && (
                        <div className="space-y-2">
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Synergy</label>
                                <div className="text-xs text-zinc-200 font-mono" data-testid="dice-synergy-value">{synergy}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Haunt</label>
                                    <Select value={haunt} onValueChange={setHaunt}>
                                        <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid="dice-haunt-select">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                            {HAUNTS.map((hauntName) => (
                                                <SelectItem key={hauntName} value={hauntName} className="text-xs">{hauntName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-zinc-600 mt-1">Rating: {hauntRating}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Unlock Key</label>
                                    <Select value={key} onValueChange={setKey}>
                                        <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid="dice-key-select">
                                            <SelectValue placeholder="Select key..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                            <SelectItem value="__none__" className="text-xs">None</SelectItem>
                                            {availableKeys.map((k) => {
                                                let label = k;

                                                if (k === characterInnateKey) {
                                                    label = `Innate (${k})`;
                                                } else if (k === geistInnateKey) {
                                                    label = `Geist (${k})`;
                                                } else {
                                                    const memento = mementos.find((m) => m.key === k);
                                                    if (memento) {
                                                        label = `${memento.name} (${k})`;
                                                    }
                                                }
                                            
                                                return (
                                                    <SelectItem key={k} value={k} className="text-xs">
                                                        {label}
                                                    </SelectItem>
                                                );
                                            })}
                                            {Array.from(doomedKeys).map((keyName) => (
                                                <SelectItem key={`doomed-${keyName}`} value={keyName} disabled className="text-xs text-zinc-500">{keyName} (Doomed)</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {key && key !== "__none__" && (
                                        <p className="text-[10px] text-teal-400 mt-1">+{keyBonus} dice, +{keyBonus} Plasm</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Plasm and Enhancements */}
                            <div className="pt-2 border-t border-zinc-800 space-y-3">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Base Plasm</label>
                                    <Select value={plasmSpent.toString()} onValueChange={(v) => setPlasmSpent(parseInt(v))}>
                                        <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid="dice-plasm-select">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <SelectItem key={n} value={n.toString()} className="text-xs">{n} Plasm</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Enhancement Checkboxes */}
                                {availableEnhancements.length > 0 && (
                                    <div>
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Enhancements</label>
                                        <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                                            {availableEnhancements.map((enh) => (
                                                <label 
                                                    key={enh.name}
                                                    className={`flex items-center gap-2 p-1.5 rounded text-xs cursor-pointer transition-colors ${
                                                        selectedEnhancements.includes(enh.name)
                                                            ? "bg-teal-900/40 border border-teal-500/40"
                                                            : "bg-zinc-800/50 border border-transparent hover:border-zinc-700"
                                                    }`}
                                                >
                                                    <Checkbox
                                                        checked={selectedEnhancements.includes(enh.name)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedEnhancements([...selectedEnhancements, enh.name]);
                                                            } else {
                                                                setSelectedEnhancements(selectedEnhancements.filter(n => n !== enh.name));
                                                            }
                                                        }}
                                                        className="h-3 w-3"
                                                        data-testid={`enhancement-${enh.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                    />
                                                    <span className="flex-1 text-zinc-300">{enh.name}</span>
                                                    <span className="text-cyan-400 text-[10px]">{enh.cost}P</span>
                                                    <span className="text-zinc-600 text-[10px]">●{enh.level}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {availableEnhancements.length === 0 && hauntRating < 2 && (
                                            <p className="text-[10px] text-zinc-600 italic mt-1">Enhancements require Haunt ●●+</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Net Plasm Cost */}
                            <div className="bg-zinc-800/50 rounded p-2 text-center">
                                <div className="text-[10px] text-zinc-500">Net Plasm Cost</div>
                                <div className="text-sm font-mono">
                                    <span className="text-zinc-400">{plasmSpent}</span>
                                    {enhancementCost > 0 && <span className="text-cyan-400"> + {enhancementCost}</span>}
                                    {key !== "__none__" && <span className="text-teal-400"> - {keyBonus}</span>}
                                    <span className="text-zinc-300"> = </span>
                                    <span className={netPlasmCost > currentPlasm ? "text-red-400" : "text-cyan-300"}>{netPlasmCost}</span>
                                </div>
                                {selectedEnhancements.length > 0 && (
                                    <div className="text-[10px] text-zinc-500 mt-1">
                                        {selectedEnhancements.join(", ")}
                                    </div>
                                )}
                                <div className="text-[10px] text-zinc-500 mt-1">Current Plasm: {currentPlasm}</div>
                            </div>

                            {/* Avoid Doom Option */}
                            {key && key !== "__none__" && (
                                <div className="bg-amber-950/30 border border-amber-500/30 rounded p-2 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] text-amber-300 uppercase tracking-wider">Avoid Key's Doom</span>
                                            <p className="text-[10px] text-zinc-500">Spend 1 Willpower to avoid the Doomed condition</p>
                                        </div>
                                        <Switch checked={avoidDoom} onCheckedChange={setAvoidDoom} data-testid="dice-avoid-doom-toggle" />
                                    </div>
                                    {!avoidDoom && (
                                        <p className="text-[10px] text-amber-400 italic">You will gain the Doomed condition for {key}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {(rollType === "attr-attr" || rollType === "attr-skill") && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                <span>Modifier</span>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={selectedEquipKey}
                                        onValueChange={setSelectedEquipKey}
                                    >
                                        <SelectTrigger className="w-48 h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                            <SelectValue placeholder="Equipment bonus..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                            <SelectItem value="__none__" className="text-xs">None</SelectItem>
                                            {equippedEquipmentOptions.map((o) => (
                                                <SelectItem key={o.key} value={o.key} className="text-xs">
                                                    {o.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        type="number"
                                        value={diceModifier}
                                        onChange={(e) => setDiceModifier(parseInt(e.target.value, 10) || 0)}
                                        className="w-20 h-7 bg-zinc-900/50 border-zinc-700 text-xs font-mono text-zinc-200"
                                        data-testid="dice-modifier-input"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                <span>Again</span>
                                <Select value={displayedAgainRule} onValueChange={setAgainRule} disabled={againIsForced}>
                                    <SelectTrigger
                                        className="w-24 h-7 bg-zinc-900/50 border-zinc-700 text-xs"
                                        data-testid="dice-again-select"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                        <SelectItem value="10" className="text-xs">10-again</SelectItem>
                                        <SelectItem value="9" className="text-xs">9-again</SelectItem>
                                        <SelectItem value="8" className="text-xs">8-again</SelectItem>
                                        <SelectItem value="11" className="text-xs">None</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                <span>Rote</span>
                                <Switch
                                    checked={useRote}
                                    onCheckedChange={setUseRote}
                                    data-testid="dice-rote-toggle"
                                />
                            </div>
                        </div>
                    )}
                    {rollType === "spellcasting" && (
                        <div className="space-y-2">
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Arcanum</label>
                                <Select value={spellArcanum} onValueChange={setSpellArcanum}>
                                    <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid="dice-spell-arcanum-select">
                                        <SelectValue placeholder="Select Arcanum" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                        {availableArcana.length === 0 ? (
                                            <div className="p-2 text-xs text-zinc-500">No Arcana rated above 0</div>
                                        ) : (
                                            availableArcana.map((name) => (
                                                <SelectItem key={name} value={name} className="text-xs">
                                                    {name} ({getNestedValue("arcana", name) || 0})
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={rollDice}
                                disabled={!spellArcanum}
                                className="btn-primary h-7 px-3 text-xs w-full"
                                data-testid="inline-spellcasting-open-btn"
                            >
                                Open Spellcasting
                            </Button>

                            <p className="text-[10px] text-zinc-500">
                                Opens the Mage spellcasting popup for the selected Arcanum.
                            </p>
                        </div>
                    )}

                    {rollType !== "spellcasting" && (
                        <>
                    {rollType === "chance" && (
                        <div className="text-[10px] text-zinc-500">
                            Chance die: roll 1d10 with no rerolls. 10 = success, 2-9 = failure, 1 = dramatic failure + Beat.
                        </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Spend 1 Willpower</span>
                        <Switch checked={spendWillpower} onCheckedChange={setSpendWillpower} data-testid="dice-willpower-toggle" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Current Willpower</span>
                        <span className="font-mono text-zinc-300" data-testid="dice-current-willpower">{currentWillpower}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500">
                        {spendWillpower && rollType !== "chance" && (
                            <span data-testid="dice-willpower-bonus">Willpower +3</span>
                        )}
                        {woundPenalty < 0 && (
                            <span data-testid="dice-wound-penalty">Wound Penalty {woundPenalty}</span>
                        )}
                        {(rollType === "attr-attr" || rollType === "attr-skill") && (parseInt(diceModifier, 10) || 0) !== 0 && (
                            <span data-testid="dice-modifier-display">
                                Modifier {(parseInt(diceModifier, 10) || 0) > 0 ? "+" : ""}{parseInt(diceModifier, 10) || 0}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Pool</div>
                        <div className="text-xs font-mono text-zinc-200" data-testid="dice-pool-total">{poolTotal}</div>
                        <Button onClick={rollDice} disabled={isRolling} className="btn-primary h-7 px-3 text-xs flex-1" data-testid="inline-dice-roll-btn">
                            {isRolling ? "..." : "Roll"}
                        </Button>
                    </div>
                        </>
                    )}
                    {result && (
                        <div className={`p-2 rounded-sm border ${
                            result.is_dramatic_failure ? "bg-rose-950/30 border-rose-500/30" :
                            result.is_exceptional ? "bg-teal-950/30 border-teal-500/30" :
                            result.successes > 0 ? "bg-zinc-800/50 border-zinc-700" :
                            "bg-zinc-900/50 border-zinc-800"
                        }`} data-testid="inline-dice-result">
                            <div className="flex flex-wrap gap-1 justify-center mb-2" data-testid="inline-dice-rolls">
                                {result.dice.slice(0, 20).map((die, index) => (
                                    <span
                                        key={index}
                                        className={`w-6 h-6 rounded-sm flex items-center justify-center font-mono text-xs ${
                                            die >= 8 ? "bg-teal-900/50 border border-teal-500/50 text-teal-300" :
                                            die === 1 && result.is_dramatic_failure ? "bg-rose-900/50 border border-rose-500/50 text-rose-300" :
                                            "bg-zinc-800 border border-zinc-700 text-zinc-400"
                                        }`}
                                        data-testid={`inline-die-${index}`}
                                    >
                                        {die}
                                    </span>
                                ))}
                                {result.dice.length > 20 && <span className="text-zinc-500 text-xs" data-testid="inline-dice-overflow">+{result.dice.length - 20}</span>}
                            </div>
                            <p className={`text-center font-heading ${
                                result.is_dramatic_failure ? "text-rose-400" :
                                result.is_exceptional ? "text-teal-400" :
                                result.successes > 0 ? "text-zinc-200" : "text-zinc-500"
                            }`} data-testid="inline-dice-successes">
                                {result.successes} {result.successes === 1 ? "Success" : "Successes"}
                            </p>
                            <p className="text-[10px] text-zinc-500 text-center mt-1" data-testid="inline-dice-description">
                                {result.description}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
