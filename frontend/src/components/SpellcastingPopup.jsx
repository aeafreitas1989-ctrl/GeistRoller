import { useState, useEffect, useMemo } from "react";
import { X, Minus, Plus, Sparkles, Zap, Shield, Eye, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GNOSIS_TABLE, YANTRAS } from "@/data/character-data";
import { toast } from "sonner";

// Practice dot requirements
const PRACTICE_DOTS = {
    "Compelling": 1, "Knowing": 1, "Unveiling": 1,
    "Ruling": 2, "Shielding": 2, "Veiling": 2,
    "Fraying": 3, "Perfecting": 3, "Weaving": 3,
    "Patterning": 4, "Unravelling": 4,
    "Making": 5, "Unmaking": 5
};

const ALL_PRACTICES = Object.entries(PRACTICE_DOTS).map(([name, dots]) => ({ name, dots }));

const getCastingTime = (gnosis) => {
    if (gnosis <= 2) return "3 hours";
    if (gnosis <= 4) return "1 hour";
    if (gnosis <= 6) return "30 min";
    if (gnosis <= 8) return "10 min";
    return "1 min";
};

const FACTOR_LEVELS = {
    potency: {
        standard: [
            { level: 1, label: "Potency 1" },
            { level: 2, label: "Potency 2" },
            { level: 3, label: "Potency 3" },
            { level: 4, label: "Potency 4" },
            { level: 5, label: "Potency 5" },
        ],
        advanced: [
            { level: 1, label: "Potency 1 (+2 Withstand)" },
            { level: 2, label: "Potency 2 (+2 Withstand)" },
            { level: 3, label: "Potency 3 (+2 Withstand)" },
            { level: 4, label: "Potency 4 (+2 Withstand)" },
            { level: 5, label: "Potency 5 (+2 Withstand)" },
        ]
    },
    duration: {
        standard: [
            { level: 1, label: "1 turn" },
            { level: 2, label: "2 turns" },
            { level: 3, label: "3 turns" },
            { level: 4, label: "5 turns" },
            { level: 5, label: "10 turns" },
            { level: 6, label: "20 turns" },
            { level: 7, label: "30 turns" },
        ],
        advanced: [
            { level: 1, label: "1 hour" },
            { level: 2, label: "1 day" },
            { level: 3, label: "1 week" },
            { level: 4, label: "1 month" },
            { level: 5, label: "1 year" },
            { level: 6, label: "Indefinite (+1 Reach, 1 Mana)" },
        ]
    },
    scale: {
        standard: [
            { level: 1, label: "1 subject (Size 5) / 1m area" },
            { level: 2, label: "2 subjects (Size 6) / small room" },
            { level: 3, label: "4 subjects (Size 7) / large room" },
            { level: 4, label: "8 subjects (Size 8) / single floor" },
            { level: 5, label: "16 subjects (Size 9) / ballroom" },
        ],
        advanced: [
            { level: 1, label: "5 subjects (Size 5) / large house" },
            { level: 2, label: "10 subjects (Size 10) / small warehouse" },
            { level: 3, label: "20 subjects (Size 15) / supermarket" },
            { level: 4, label: "40 subjects (Size 20) / shopping mall" },
            { level: 5, label: "80 subjects (Size 25) / city block" },
            { level: 6, label: "160 subjects (Size 30) / neighbourhood" },
        ]
    }
};

export const SpellcastingPopup = ({ 
    isOpen, 
    onClose, 
    arcanum, 
    arcanumDots,
    gnosis,
    isRuling,
    isInferior,
    currentMana,
    currentWisdom = 7,
    initialPractice,
    onSpendMana,
    onRollDice,
    onCreateActiveSpell,
    onResolveParadoxContainment,
    activeSpellCount = 0,
    orderRoteSkills,
    spellType,
    roteSkillDots,
    isRoteOrderSkill,
    defaultPrimaryFactor = null,
}) => {
    const [selectedPractice, setSelectedPractice] = useState("");
    const [spellName, setSpellName] = useState("");
    const [factors, setFactors] = useState({
        casting: { advanced: false, level: 1 },
        range: { advanced: false, level: 1 },
        potency: { advanced: false, level: 1 },
        duration: { advanced: false, level: 1 },
        scale: { advanced: false, level: 1 }
    });

    // Paradox state
    const [paradoxInured, setParadoxInured] = useState(false);
    const [sleeperWitnesses, setSleeperWitnesses] = useState("none");
    const [previousParadoxRolls, setPreviousParadoxRolls] = useState(0);
    const [manaMitigation, setManaMitigation] = useState(0);
    const [paradoxMode, setParadoxMode] = useState("");

    // Yantras state
    const [activeYantras, setActiveYantras] = useState(new Set());
    const [yantraValues, setYantraValues] = useState({});

    // Primary factor state (default: potency)
    const [primaryFactor, setPrimaryFactor] = useState(defaultPrimaryFactor);
    const [overridePrimaryFactor, setOverridePrimaryFactor] = useState(false);
    const [spellReach, setSpellReach] = useState(0);

    // Reset when popup opens
    useEffect(() => {
        if (isOpen) {
            setSelectedPractice(initialPractice || "");
            setSpellName("");
            setFactors({
                casting: { advanced: false, level: 1 },
                range: { advanced: false, level: 1 },
                potency: { advanced: false, level: 1 },
                duration: { advanced: false, level: 1 },
                scale: { advanced: false, level: 1 }
            });
            setParadoxInured(false);
            setSleeperWitnesses("none");
            setPreviousParadoxRolls(0);
            setManaMitigation(0);
            setParadoxMode("");
            setActiveYantras(new Set());
            setYantraValues({});
            setPrimaryFactor(defaultPrimaryFactor);
            setOverridePrimaryFactor(false);
            setSpellReach(0);
        }
    }, [isOpen, arcanum, initialPractice, defaultPrimaryFactor]);

    // Gnosis-derived data
    const gnosisData = GNOSIS_TABLE[gnosis] || GNOSIS_TABLE[1];
    const maxYantras = gnosisData.yantras;
    const paradoxDiePerReach = gnosisData.paradoxDie;
    const manaPerTurn = gnosisData.perTurn;

    const availablePractices = useMemo(() => {
        return ALL_PRACTICES.filter(p => p.dots <= arcanumDots);
    }, [arcanumDots]);

    const practiceDots = selectedPractice ? PRACTICE_DOTS[selectedPractice] : 0;
    const freeReach = selectedPractice ? Math.max(0, arcanumDots - practiceDots + 1) : 0;
    const advancedReachUsed = Object.values(factors).filter(f => f.advanced).length;
    const indefiniteReach = (factors.duration.advanced && factors.duration.level === 6) ? 1 : 0;

    // Current Active Spells increase the Reach cost of any spell cast.
    // At Active Spells = Gnosis, the next spell costs +1 Reach.
    // Each Active Spell above Gnosis adds another +1 Reach.
    const activeSpellReachSurcharge = Math.max(0, activeSpellCount - gnosis + 1);

    const changePrimaryReach = overridePrimaryFactor && !!primaryFactor ? 1 : 0;
    const totalReachUsed = advancedReachUsed + indefiniteReach + changePrimaryReach + activeSpellReachSurcharge + spellReach;
    const reachRemaining = freeReach - totalReachUsed;

    // Primary factor gives free levels = arcanumDots - 1
    const primaryFreeLevels = Math.max(0, arcanumDots - 1);
    const effectivePrimaryFactor =
    overridePrimaryFactor && primaryFactor
        ? (primaryFactor === "potency" ? "duration" : "potency")
        : primaryFactor;

    // Dice penalty from factor levels (accounting for primary free levels)
    const calculatePenalty = () => {
        let penalty = 0;
    
        const potencyPaid = Math.max(
            0,
            factors.potency.level - 1 - (effectivePrimaryFactor === "potency" ? primaryFreeLevels : 0)
        );
        penalty += potencyPaid * -2;
    
        const durationPaid = Math.max(
            0,
            factors.duration.level - 1 - (effectivePrimaryFactor === "duration" ? primaryFreeLevels : 0)
        );
        penalty += durationPaid * -2;
    
        penalty += (factors.scale.level - 1) * -2;
    
        return penalty;
    };
    const dicePenalty = calculatePenalty();

    // Yantras calculation
    const hasDedicatedTool = activeYantras.has("Dedicated Tool");
    const getYantraBonus = (yantra) => {
        if (!yantra.variableBonus) return yantra.bonus;
        return yantraValues[yantra.name] ?? yantra.bonus;
    };
    const yantraBonus = useMemo(() => {
        return YANTRAS.reduce((sum, y) => {
            if (!activeYantras.has(y.name)) return sum;
            return sum + getYantraBonus(y);
        }, 0);
    }, [activeYantras, yantraValues]);

    // Dice pool
    const baseDicePool = gnosis + arcanumDots;
    const roteBonus = spellType === "rote" ? (roteSkillDots || 0) : 0;
    const orderSkillBonus = (spellType === "rote" && isRoteOrderSkill) ? 1 : 0;
    const finalDicePool = Math.max(0, baseDicePool + dicePenalty + yantraBonus + roteBonus + orderSkillBonus);

    // Spell Mana cost
    const getManaCost = () => {
        let cost = 0;
        if (!isRuling) cost += 1;
        if (factors.duration.advanced && factors.duration.level === 6) cost += 1;
        return cost;
    };
    const manaCost = getManaCost();

    // Paradox calculation
    const reachBeyondFree = Math.max(0, totalReachUsed - freeReach);
    const baseParadoxDice = reachBeyondFree * paradoxDiePerReach;
    const paradoxTriggered = baseParadoxDice > 0;

    let paradoxModifiers = 0;
    if (paradoxInured) paradoxModifiers += 2;
    if (sleeperWitnesses !== "none") paradoxModifiers += 1;
    if (hasDedicatedTool) paradoxModifiers -= 2;
    paradoxModifiers += previousParadoxRolls;

    const paradoxAfterModifiers = baseParadoxDice + paradoxModifiers;

    // Max mana for mitigation: can't exceed perTurn total (including spell cost), can't exceed available mana
    const maxManaMitigation = Math.max(0, Math.min(
        manaPerTurn - manaCost,
        currentMana - manaCost,
        Math.max(0, paradoxAfterModifiers)
    ));

    // Clamp mana mitigation if max changed
    useEffect(() => {
        if (manaMitigation > maxManaMitigation) {
            setManaMitigation(Math.max(0, maxManaMitigation));
        }
    }, [maxManaMitigation, manaMitigation]);

    const actualManaMitigation = Math.min(manaMitigation, maxManaMitigation);
    const finalParadoxPool = Math.max(0, paradoxAfterModifiers - actualManaMitigation);
    const paradoxIsChanceDie = paradoxTriggered && finalParadoxPool <= 0;

    // Sleeper witness effect on paradox ROLL quality (separate from dice count)
    const getParadoxRollQuality = () => {
        if (sleeperWitnesses === "few") return { again: 9, rote: false, desc: "9-again" };
        if (sleeperWitnesses === "large") return { again: 8, rote: false, desc: "8-again" };
        if (sleeperWitnesses === "crowd") return { again: 10, rote: true, desc: "Rote quality" };
        return { again: 10, rote: false, desc: "10-again" };
    };
    const paradoxRollQuality = getParadoxRollQuality();

    // Total mana
    const totalManaCost = manaCost + actualManaMitigation;

    const updateFactor = (factorName, updates) => {
        setFactors(prev => ({
            ...prev,
            [factorName]: { ...prev[factorName], ...updates }
        }));
    };

    const getMaxLevel = (factorName, isAdvanced) => {
        if (factorName === "casting" || factorName === "range") return 1;
        const levels = FACTOR_LEVELS[factorName]?.[isAdvanced ? "advanced" : "standard"];
        return levels?.length || 1;
    };

    const toggleYantra = (name) => {
        setActiveYantras(prev => {
            const next = new Set(prev);
            if (next.has(name)) {
                next.delete(name);
            } else if (next.size < maxYantras) {
                next.add(name);
            }
            return next;
        });
    };

    const getFactorDescription = (factorName) => {
        const factor = factors[factorName];
        if (!factor) return "";

        if (factorName === "casting") {
            return factor.advanced ? "Instant" : `${getCastingTime(gnosis)} Ritual`;
        }

        if (factorName === "range") {
            return factor.advanced ? "Sensory Range" : "Touch Range / Self";
        }

        const levels = FACTOR_LEVELS[factorName]?.[factor.advanced ? "advanced" : "standard"];
        const baseDescription = levels?.[factor.level - 1]?.label || "";

        if (factorName === "scale") {
            return `up to ${baseDescription}`;
        }

        return baseDescription;
    };

    const adjustYantraValue = (name, delta) => {
        const yantra = YANTRAS.find(y => y.name === name);
        if (!yantra?.variableBonus || !activeYantras.has(name)) return;

        setYantraValues(prev => {
            const currentValue = prev[name] ?? yantra.bonus;
            const nextValue = Math.max(
                yantra.minBonus ?? yantra.bonus,
                Math.min(yantra.maxBonus ?? yantra.bonus, currentValue + delta)
            );
            return { ...prev, [name]: nextValue };
        });
    };

    const getYantraTestId = (name) => `yantra-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

    const handleCastSpell = () => {
        if (totalManaCost > 0 && currentMana < totalManaCost) return;
        if (factors.duration.advanced && !spellName.trim()) return;
        if (paradoxTriggered && !paradoxMode) return;

        if (totalManaCost > 0) {
            onSpendMana(totalManaCost);
        }

        const activeSpellData = factors.duration.advanced && onCreateActiveSpell
            ? {
                id: Date.now(),
                name: spellName.trim(),
                arcanum,
                practice: selectedPractice,
                potency: getFactorDescription("potency"),
                duration: getFactorDescription("duration"),
                scale: getFactorDescription("scale"),
            }
            : null;

        const spellSummary = [
            getFactorDescription("casting"),
            getFactorDescription("range"),
            getFactorDescription("potency"),
            getFactorDescription("duration"),
            getFactorDescription("scale"),
        ].join("; ");

        const castLabel = `${arcanum} ${spellType === "praxis" ? "Praxis" : spellType === "rote" ? "Rote" : "Spell"} (${selectedPractice})`;

        const buildSpellRollConfig = (poolModifier = 0) => {
            const adjustedPool = Math.max(0, finalDicePool + poolModifier);

            const dicePoolBreakdownParts = [
                `Gnosis ${gnosis}`,
                `${arcanum} ${arcanumDots}`,
                ...(roteBonus > 0 ? [`Rote Skill ${roteBonus}`] : []),
                ...(orderSkillBonus > 0 ? [`Order Skill ${orderSkillBonus}`] : []),
                ...(yantraBonus > 0 ? [`Yantras ${yantraBonus}`] : []),
                ...(dicePenalty !== 0 ? [`${dicePenalty}`] : []),
                ...(poolModifier < 0 ? [`Release Penalty ${poolModifier}`] : []),
            ];

            return {
                pool: adjustedPool <= 0 ? 1 : adjustedPool,
                chance: adjustedPool <= 0,
                label: castLabel,
                exceptional_target: spellType === "praxis" ? 3 : 5,
                dicePoolBreakdown: dicePoolBreakdownParts.join(" + "),
                spellSummary,
                onResult: (rollResult) => {
                    const spellSucceeded = (rollResult?.successes || 0) >= 1;
                    if (spellSucceeded && activeSpellData) {
                        onCreateActiveSpell(activeSpellData);
                    }
                },
            };
        };

        const paradoxConfig = paradoxTriggered ? {
            pool: paradoxIsChanceDie ? 1 : finalParadoxPool,
            chance: paradoxIsChanceDie,
            again: paradoxRollQuality.again,
            rote: paradoxRollQuality.rote,
            label: `Paradox (${paradoxIsChanceDie ? "Chance Die" : `${finalParadoxPool} dice`})`,
        } : null;

        const rollSpell = (poolModifier = 0, summaryOptions = null) => {
            const spellConfig = buildSpellRollConfig(poolModifier);
            onRollDice(summaryOptions ? { ...spellConfig, ...summaryOptions } : spellConfig);
        };

        if (!paradoxConfig) {
            rollSpell(0);
            onClose();
            return;
        }

        if (paradoxMode === "release") {
            onRollDice({
                ...paradoxConfig,
                resetSummary: true,
                summaryKey: "paradox",
                summaryLabel: "Paradox",
                onResult: (paradoxResult) => {
                    const penalty = paradoxResult?.successes || 0;

                    if (penalty > 0) {
                        toast.info(
                            `Release: ${penalty} Paradox success${penalty === 1 ? "" : "es"} = -${penalty} die${penalty === 1 ? "" : "s"} to the spell.`
                        );
                    }

                    rollSpell(-penalty, {
                        appendToSummary: true,
                        summaryKey: "spell",
                        summaryLabel: "Spell",
                    });
                },
            });

            onClose();
            return;
        }

        if (paradoxMode === "contain") {
            onRollDice({
                ...paradoxConfig,
                resetSummary: true,
                summaryKey: "paradox",
                summaryLabel: "Paradox",
                onResult: (paradoxResult) => {
                    const paradoxSuccesses = paradoxResult?.successes || 0;

                    onRollDice({
                        pool: currentWisdom > 0 ? currentWisdom : 1,
                        chance: currentWisdom <= 0,
                        label: `Contain Paradox (Wisdom ${currentWisdom})`,
                        dicePoolBreakdown: currentWisdom <= 0 ? "Wisdom chance die" : `Wisdom ${currentWisdom}`,
                        appendToSummary: true,
                        summaryKey: "wisdom",
                        summaryLabel: "Wisdom",
                        onResult: async (wisdomResult) => {
                            const wisdomSuccesses = wisdomResult?.successes || 0;
                            const cancelled = Math.min(paradoxSuccesses, wisdomSuccesses);
                            const remaining = Math.max(0, paradoxSuccesses - wisdomSuccesses);

                            if (onResolveParadoxContainment) {
                                await onResolveParadoxContainment({
                                    cancelled,
                                    remaining,
                                    wisdomExceptional: !!wisdomResult?.is_exceptional,
                                });
                            }

                            toast.info(
                                `Contain: ${cancelled} cancelled, ${remaining} remaining${cancelled > 0 ? `, ${cancelled} Bashing dealt` : ""}.`
                            );

                            rollSpell(0, {
                                appendToSummary: true,
                                summaryKey: "spell",
                                summaryLabel: "Spell",
                            });
                        },
                    });
                },
            });

            onClose();
        }
    };

    if (!isOpen) return null;

    const castingTimeStandard = getCastingTime(gnosis);

    // Helper to render a factor row
    const renderFactorRow = (factorName, label, hasLevels) => {
        const f = factors[factorName];
        const isRange = factorName === "range";
        const isCasting = factorName === "casting";
        const hasPrimary = factorName === "potency" || factorName === "duration";
        const isSelectedPrimary = hasPrimary && primaryFactor === factorName;
        const isEffectivePrimary = hasPrimary && effectivePrimaryFactor === factorName;
        const freeLevelsFromPrimary = isEffectivePrimary ? primaryFreeLevels : 0;

        let description = "";
        if (isCasting) {
            description = f.advanced ? "Instant" : `${castingTimeStandard} Ritual`;
        } else if (isRange) {
            description = f.advanced ? "Sensory Range" : "Touch Range / Self";
        } else {
            const levels = FACTOR_LEVELS[factorName]?.[f.advanced ? "advanced" : "standard"];
            const baseDescription = levels?.[f.level - 1]?.label || "";
            description = factorName === "scale" ? `up to ${baseDescription}` : baseDescription;
        }

        const paidLevels = hasLevels ? Math.max(0, f.level - 1 - freeLevelsFromPrimary) : 0;

        return (
            <div key={factorName} className="grid grid-cols-[20px,120px,50px,50px,50px,1fr] gap-1.5 items-center p-2 bg-zinc-800/30 rounded text-sm">
                {hasPrimary ? (
                    <Checkbox
                        checked={isSelectedPrimary}
                        disabled={isSelectedPrimary}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setPrimaryFactor(factorName);
                            }
                        }}
                        className="border-zinc-600 data-[state=checked]:bg-teal-600 h-3.5 w-3.5"
                        data-testid={`primary-${factorName}`}
                    />
                ) : (
                    <span />
                )}
                <span className="text-zinc-300 text-xs">
                    {label}
                    {isEffectivePrimary && (
                        <span className="text-teal-400 text-[9px] ml-1">
                            {overridePrimaryFactor ? "PFO" : "P"}
                        </span>
                    )}
                </span>
                <div className="flex justify-center">
                    <Checkbox
                        checked={!f.advanced}
                        onCheckedChange={() => updateFactor(factorName, { advanced: false, ...(hasLevels ? { level: 1 } : {}) })}
                        className="border-zinc-600 data-[state=checked]:bg-violet-600"
                    />
                </div>
                <div className="flex justify-center">
                    <Checkbox
                        checked={f.advanced}
                        onCheckedChange={() => updateFactor(factorName, { advanced: true, ...(hasLevels ? { level: 1 } : {}) })}
                        className="border-zinc-600 data-[state=checked]:bg-amber-600"
                    />
                </div>
                {hasLevels ? (
                    <div className="flex items-center justify-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-zinc-400"
                            onClick={() => updateFactor(factorName, { level: Math.max(1, f.level - 1) })}
                            disabled={f.level <= 1}
                        ><Minus className="w-3 h-3" /></Button>
                        <span className="text-sm font-mono text-violet-300 w-4 text-center">{f.level}</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-zinc-400"
                            onClick={() => updateFactor(factorName, { level: Math.min(getMaxLevel(factorName, f.advanced), f.level + 1) })}
                            disabled={f.level >= getMaxLevel(factorName, f.advanced)}
                        ><Plus className="w-3 h-3" /></Button>
                    </div>
                ) : (
                    <span className="text-center text-zinc-500">-</span>
                )}
                <span className="text-xs text-zinc-400 truncate">
                    {description}
                    {f.advanced && <span className="text-amber-400 ml-1">(+1R)</span>}
                    {hasLevels && paidLevels > 0 && <span className="text-red-400 ml-1">(-{paidLevels * 2}d)</span>}
                    {hasLevels && freeLevelsFromPrimary > 0 && f.level > 1 && <span className="text-teal-400 ml-1">(+{Math.min(freeLevelsFromPrimary, f.level - 1)}free)</span>}
                </span>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]" onClick={onClose}>
            <div
                className="bg-zinc-900 border border-violet-500/50 rounded-lg w-[640px] max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900 z-10">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-violet-400" />
                        <div>
                            <h2 className="font-heading text-lg text-zinc-100" data-testid="spellcasting-title">
                                {arcanum} {spellType === "rote" ? "Rote" : spellType === "praxis" ? "Praxis" : "Spellcasting"}
                            </h2>
                            <p className="text-xs text-zinc-500">
                                {isRuling && <span className="text-blue-400">Ruling Arcanum</span>}
                                {isInferior && <span className="text-red-400">Inferior Arcanum</span>}
                                {!isRuling && !isInferior && <span className="text-zinc-400">Common Arcanum</span>}
                                {" · "}{arcanumDots} dot{arcanumDots !== 1 && "s"} · Gnosis {gnosis}
                                {spellType === "rote" && <span className="text-amber-400">{" · "}Rote Skill +{roteSkillDots}{isRoteOrderSkill ? " (Order +1)" : ""}</span>}
                                {spellType === "praxis" && <span className="text-teal-400">{" · "}Exceptional on 3</span>}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-zinc-100">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Spell Name */}
                    <div>
                        <label className="text-xs text-zinc-500 uppercase block mb-1">Name</label>
                        <Input
                            value={spellName}
                            onChange={(e) => setSpellName(e.target.value)}
                            placeholder="Spell name"
                            className="bg-zinc-900/50 border-zinc-700"
                            data-testid="spell-name-input"
                        />
                        {factors.duration.advanced && !spellName.trim() && (
                            <p className="text-[11px] text-amber-400 mt-1">
                                Advanced Duration spells need a name to become an Active Spell card.
                            </p>
                        )}
                    </div>

                    {/* Practice Selection */}
                    <div>
                        <label className="text-xs text-zinc-500 uppercase block mb-1">Practice</label>
                        <Select value={selectedPractice} onValueChange={setSelectedPractice}>
                            <SelectTrigger className="bg-zinc-900/50 border-zinc-700" data-testid="practice-select">
                                <SelectValue placeholder="Select a Practice..." />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700 z-[200]">
                                {availablePractices.length === 0 ? (
                                    <div className="p-2 text-xs text-zinc-500">No practices available</div>
                                ) : (
                                    availablePractices.map(p => (
                                        <SelectItem key={p.name} value={p.name} className="text-zinc-200">
                                            <span className="text-violet-400 mr-2">{"●".repeat(p.dots)}</span>
                                            {p.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reach Display */}
                    {selectedPractice && (
                        <div className="p-2 bg-zinc-800/50 rounded text-sm space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-400">
                                    Free Reach: <span className="text-teal-400 font-mono">{freeReach}</span>
                                    <span className="text-zinc-600 ml-1">({arcanumDots} - {practiceDots} + 1)</span>
                                </span>
                                <span className={`font-mono ${reachRemaining >= 0 ? "text-teal-400" : "text-red-400"}`}>
                                    {reachRemaining >= 0 ? `${reachRemaining} remaining` : `${Math.abs(reachRemaining)} over`}
                                </span>
                            </div>

                            {(advancedReachUsed > 0 || indefiniteReach > 0 || changePrimaryReach > 0 || activeSpellReachSurcharge > 0 || spellReach > 0) && (
                                <div className="pt-1 border-t border-zinc-700/50 space-y-1 text-xs">
                                    {advancedReachUsed > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Advanced Factors</span>
                                            <span className="font-mono text-amber-400">+{advancedReachUsed} Reach</span>
                                        </div>
                                    )}

                                    {indefiniteReach > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Indefinite Duration</span>
                                            <span className="font-mono text-amber-400">+{indefiniteReach} Reach</span>
                                        </div>
                                    )}

                                    {changePrimaryReach > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Override Primary Factor </span>
                                            <span className="font-mono text-amber-400">+{changePrimaryReach} Reach</span>
                                        </div>
                                    )}

                                    {spellReach > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Spell Reach</span>
                                            <span className="font-mono text-amber-400">+{spellReach} Reach</span>
                                        </div>
                                    )}

                                    {activeSpellReachSurcharge > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Active Spell surcharge</span>
                                            <span className="font-mono text-amber-400">+{activeSpellReachSurcharge} Reach</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-1 border-t border-zinc-700/50">
                                        <span className="text-zinc-400">Total Reach Used</span>
                                        <span className="font-mono text-zinc-200">{totalReachUsed}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Spell Reach */}
                    {selectedPractice && (
                        <div className="p-2 bg-zinc-800/30 rounded space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase">Spell Reach</p>
                                    <p className="text-[11px] text-zinc-600">
                                        Extra Reach required by this spell's own options
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-zinc-400"
                                        onClick={() => setSpellReach(Math.max(0, spellReach - 1))}
                                        disabled={spellReach <= 0}
                                        data-testid="spell-reach-decrease"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="font-mono text-amber-400 w-8 text-center">
                                        {spellReach}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-zinc-400"
                                        onClick={() => setSpellReach(spellReach + 1)}
                                        data-testid="spell-reach-increase"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Primary Factor Override */}
                    {selectedPractice && (
                        <div className="p-2 bg-zinc-800/30 rounded space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase">Primary Factor Override</p>
                                    <p className="text-[11px] text-zinc-600">
                                        Spend 1 Reach to override the spell's normal primary factor
                                    </p>
                                </div>
                                <Checkbox
                                    checked={overridePrimaryFactor}
                                    onCheckedChange={setOverridePrimaryFactor}
                                    className="border-zinc-600 data-[state=checked]:bg-amber-600"
                                    data-testid="override-primary-factor"
                                />
                            </div>
                        </div>
                    )}

                    {/* Spell Factors */}
                    <div className="space-y-1">
                        <p className="text-xs text-zinc-500 uppercase">Spell Factors</p>
                        <div className="grid grid-cols-[130px,60px,60px,60px,1fr] gap-2 text-[10px] text-zinc-500 uppercase px-2">
                            <span>Factor</span>
                            <span className="text-center">Std</span>
                            <span className="text-center">Adv</span>
                            <span className="text-center">Lvl</span>
                            <span>Effect</span>
                        </div>
                        {renderFactorRow("casting", "Casting Time", false)}
                        {renderFactorRow("range", "Range", false)}
                        {renderFactorRow("potency", "Potency", true)}
                        {renderFactorRow("duration", "Duration", true)}
                        {renderFactorRow("scale", "Scale", true)}
                    </div>

                    {/* Yantras Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-500 uppercase flex items-center gap-1">
                                <Wrench className="w-3 h-3" /> Yantras
                            </p>
                            <span className="text-xs text-zinc-500">
                                {activeYantras.size}/{maxYantras} used
                                {yantraBonus > 0 && <span className="text-teal-400 ml-1">(+{yantraBonus} dice)</span>}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 max-h-[140px] overflow-y-auto pr-1">
                            {YANTRAS.map(yantra => {
                                const isActive = activeYantras.has(yantra.name);
                                const atMax = !isActive && activeYantras.size >= maxYantras;
                                const currentBonus = getYantraBonus(yantra);
                                const canDecrease = isActive && yantra.variableBonus && currentBonus > (yantra.minBonus ?? yantra.bonus);
                                const canIncrease = isActive && yantra.variableBonus && currentBonus < (yantra.maxBonus ?? yantra.bonus);
                                return (
                                    <div
                                        key={yantra.name}
                                        className={`flex items-center gap-2 p-1.5 rounded text-xs cursor-pointer transition-colors ${
                                            isActive ? "bg-violet-900/30 border border-violet-500/30" : "bg-zinc-800/30 border border-transparent hover:border-zinc-700"
                                        } ${atMax ? "opacity-40 cursor-not-allowed" : ""}`}
                                        onClick={() => !atMax && toggleYantra(yantra.name)}
                                        title={yantra.description}
                                        data-testid={getYantraTestId(yantra.name)}
                                    >
                                        <Checkbox
                                            checked={isActive}
                                            disabled={atMax}
                                            onCheckedChange={() => toggleYantra(yantra.name)}
                                            className="border-zinc-600 data-[state=checked]:bg-violet-600 h-3.5 w-3.5"
                                        />
                                        <span className={`flex-1 ${isActive ? "text-zinc-200" : "text-zinc-400"}`}>
                                            {yantra.name}
                                        </span>
                                        {yantra.variableBonus ? (
                                            <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 text-zinc-400"
                                                    onClick={() => adjustYantraValue(yantra.name, -1)}
                                                    disabled={!canDecrease}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className={`font-mono w-6 text-center ${isActive ? "text-teal-400" : "text-zinc-600"}`}>
                                                    +{currentBonus}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 text-zinc-400"
                                                    onClick={() => adjustYantraValue(yantra.name, 1)}
                                                    disabled={!canIncrease}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className={`font-mono ${isActive ? "text-teal-400" : "text-zinc-600"}`}>
                                                {yantra.bonus > 0 ? `+${yantra.bonus}` : "+0"}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dice Pool Display */}
                    <div className="p-3 bg-violet-900/20 border border-violet-500/30 rounded">
                        <p className="text-xs text-zinc-500 uppercase mb-1">Spellcasting Dice Pool</p>
                        <p className="text-base font-mono text-violet-300">
                            Gnosis ({gnosis}) + {arcanum} ({arcanumDots})
                            {roteBonus > 0 && <span className="text-amber-400"> + Rote Skill ({roteBonus})</span>}
                            {orderSkillBonus > 0 && <span className="text-amber-400"> + Order Skill ({orderSkillBonus})</span>}
                            {yantraBonus > 0 && <span className="text-teal-400"> + Yantras ({yantraBonus})</span>}
                            {dicePenalty !== 0 && <span className="text-red-400"> {dicePenalty}</span>}
                            <span className="text-zinc-400"> = </span>
                            <span className="text-teal-400 font-bold text-lg">{finalDicePool}</span>
                        </p>
                    </div>

                    {/* Paradox Section */}
                    {selectedPractice && (
                        <div className={`p-3 rounded space-y-3 border ${
                            paradoxTriggered
                                ? "bg-red-950/20 border-red-500/40"
                                : "bg-zinc-800/30 border-zinc-700/50"
                        }`}>
                            <div className="flex items-center gap-2">
                                <Zap className={`w-4 h-4 ${paradoxTriggered ? "text-red-400" : "text-zinc-500"}`} />
                                <p className={`text-xs uppercase font-bold ${paradoxTriggered ? "text-red-400" : "text-zinc-500"}`}>
                                    Paradox
                                </p>
                            </div>

                            {/* Base paradox from Reach */}
                            <div className="text-xs text-zinc-400">
                                {reachBeyondFree > 0 ? (
                                    <span>
                                        <span className="text-red-400 font-mono">{reachBeyondFree}</span> Reach over
                                        {" x "}<span className="font-mono">{paradoxDiePerReach}</span> die/Reach (Gnosis {gnosis})
                                        {" = "}<span className="text-red-400 font-mono font-bold">{baseParadoxDice}</span> base dice
                                    </span>
                                ) : (
                                    <span className="text-zinc-500">No Reach beyond free - no Paradox risk</span>
                                )}
                            </div>

                            {/* Modifiers */}
                            {paradoxTriggered && (
                                <>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] text-zinc-500 uppercase">Modifiers</p>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <label className="flex items-center gap-2 text-xs cursor-pointer" data-testid="paradox-inured">
                                                <Checkbox
                                                    checked={paradoxInured}
                                                    onCheckedChange={setParadoxInured}
                                                    className="border-zinc-600 data-[state=checked]:bg-red-600 h-3.5 w-3.5"
                                                />
                                                <span className="text-zinc-300">Inured to spell</span>
                                                <span className="text-red-400 font-mono ml-auto">+2</span>
                                            </label>
                                            <label className="flex items-center gap-2 text-xs cursor-pointer" data-testid="paradox-sleepers">
                                                <Checkbox
                                                    checked={sleeperWitnesses !== "none"}
                                                    onCheckedChange={(checked) => setSleeperWitnesses(checked ? "few" : "none")}
                                                    className="border-zinc-600 data-[state=checked]:bg-red-600 h-3.5 w-3.5"
                                                />
                                                <span className="text-zinc-300">Sleeper witnesses</span>
                                                <span className="text-red-400 font-mono ml-auto">+1</span>
                                            </label>
                                        </div>

                                        {/* Sleeper witness scale */}
                                        {sleeperWitnesses !== "none" && (
                                            <div className="flex items-center gap-2 pl-6">
                                                <Eye className="w-3 h-3 text-zinc-500" />
                                                <Select value={sleeperWitnesses} onValueChange={setSleeperWitnesses}>
                                                    <SelectTrigger className="h-7 w-40 text-xs bg-zinc-900/50 border-zinc-700" data-testid="sleeper-scale-select">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-zinc-700 z-[200]">
                                                        <SelectItem value="few" className="text-xs text-zinc-200">Few (9-again)</SelectItem>
                                                        <SelectItem value="large" className="text-xs text-zinc-200">Large group (8-again)</SelectItem>
                                                        <SelectItem value="crowd" className="text-xs text-zinc-200">Full crowd (Rote)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <span className="text-[10px] text-zinc-500">on Paradox roll</span>
                                            </div>
                                        )}

                                        {/* Dedicated tool indicator */}
                                        {hasDedicatedTool && (
                                            <div className="flex items-center gap-2 text-xs pl-1">
                                                <Shield className="w-3 h-3 text-teal-500" />
                                                <span className="text-zinc-300">Dedicated Magical Tool</span>
                                                <span className="text-teal-400 font-mono ml-auto">-2</span>
                                                <span className="text-[10px] text-zinc-500">(from Yantras)</span>
                                            </div>
                                        )}

                                        {/* Previous Paradox rolls */}
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-zinc-400">Previous Paradox rolls this scene:</span>
                                            <div className="flex items-center gap-1 ml-auto">
                                                <Button variant="ghost" size="icon" className="h-5 w-5 text-zinc-400"
                                                    onClick={() => setPreviousParadoxRolls(Math.max(0, previousParadoxRolls - 1))}
                                                    disabled={previousParadoxRolls <= 0}
                                                    data-testid="prev-paradox-decrease"
                                                ><Minus className="w-3 h-3" /></Button>
                                                <span className="font-mono text-red-400 w-4 text-center">{previousParadoxRolls}</span>
                                                <Button variant="ghost" size="icon" className="h-5 w-5 text-zinc-400"
                                                    onClick={() => setPreviousParadoxRolls(previousParadoxRolls + 1)}
                                                    data-testid="prev-paradox-increase"
                                                ><Plus className="w-3 h-3" /></Button>
                                                {previousParadoxRolls > 0 && (
                                                    <span className="text-red-400 font-mono">+{previousParadoxRolls}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Paradox pool before mana */}
                                    <div className="text-xs text-zinc-400 pt-1 border-t border-zinc-700/50">
                                        Pool before Mana: <span className="font-mono text-red-400">{Math.max(0, paradoxAfterModifiers)}</span>
                                        {paradoxAfterModifiers < baseParadoxDice && (
                                            <span className="text-zinc-500 ml-1">
                                                ({baseParadoxDice}{paradoxModifiers >= 0 ? "+" : ""}{paradoxModifiers})
                                            </span>
                                        )}
                                    </div>

                                    {/* Mana mitigation */}
                                    <div className="p-2 bg-zinc-900/50 rounded space-y-1.5" data-testid="mana-mitigation-section">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-300 font-medium">Spend Mana to mitigate Paradox</span>
                                            <span className="text-[10px] text-zinc-500">
                                                -1 die per Mana (max {maxManaMitigation}/turn)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400"
                                                onClick={() => setManaMitigation(Math.max(0, manaMitigation - 1))}
                                                disabled={manaMitigation <= 0}
                                                data-testid="mana-mitigation-decrease"
                                            ><Minus className="w-3 h-3" /></Button>
                                            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-violet-500 transition-all"
                                                    style={{ width: maxManaMitigation > 0 ? `${(actualManaMitigation / maxManaMitigation) * 100}%` : "0%" }}
                                                />
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400"
                                                onClick={() => setManaMitigation(Math.min(maxManaMitigation, manaMitigation + 1))}
                                                disabled={manaMitigation >= maxManaMitigation || maxManaMitigation <= 0}
                                                data-testid="mana-mitigation-increase"
                                            ><Plus className="w-3 h-3" /></Button>
                                            <span className="font-mono text-violet-400 text-sm w-8 text-right">{actualManaMitigation}</span>
                                        </div>
                                    </div>

                                    {/* Final Paradox */}
                                    <div className={`p-2 rounded text-center ${
                                        paradoxIsChanceDie ? "bg-amber-900/30 border border-amber-500/40" : "bg-red-900/30 border border-red-500/40"
                                    }`} data-testid="final-paradox-display">
                                        {paradoxIsChanceDie ? (
                                            <div>
                                                <p className="text-amber-400 font-bold text-sm">CHANCE DIE</p>
                                                <p className="text-[10px] text-amber-300/70">
                                                    Paradox was triggered - reduced to 0 by Mana, rolls as Chance Die
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-red-400 font-bold text-sm">
                                                    {finalParadoxPool} Paradox {finalParadoxPool === 1 ? "Die" : "Dice"}
                                                </p>
                                                {sleeperWitnesses !== "none" && (
                                                    <p className="text-[10px] text-red-300/70">
                                                        Paradox roll quality: {paradoxRollQuality.desc}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {paradoxTriggered && (
                                        <div className="p-2 bg-zinc-900/50 rounded space-y-2" data-testid="paradox-mode-section">
                                            <p className="text-xs text-zinc-300 font-medium">Resolve Paradox before the spell roll</p>

                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    type="button"
                                                    variant={paradoxMode === "release" ? "default" : "outline"}
                                                    onClick={() => setParadoxMode("release")}
                                                    className={paradoxMode === "release"
                                                        ? "bg-red-600 hover:bg-red-500 text-white"
                                                        : "border-zinc-700 text-zinc-300"}
                                                    data-testid="paradox-mode-release"
                                                >
                                                    Release
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant={paradoxMode === "contain" ? "default" : "outline"}
                                                    onClick={() => setParadoxMode("contain")}
                                                    className={paradoxMode === "contain"
                                                        ? "bg-amber-600 hover:bg-amber-500 text-black"
                                                        : "border-zinc-700 text-zinc-300"}
                                                    data-testid="paradox-mode-contain"
                                                >
                                                    Contain
                                                </Button>
                                            </div>

                                            {paradoxMode === "release" && (
                                                <p className="text-[11px] text-zinc-500">
                                                    Roll Paradox first. Each Paradox success gives -1 die to the spell.
                                                </p>
                                            )}

                                            {paradoxMode === "contain" && (
                                                <p className="text-[11px] text-zinc-500">
                                                    Roll Paradox vs Wisdom. Each Wisdom success cancels one Paradox success and deals 1 Bashing. Any Paradox success left gives Paradox Taint.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Summary */}
                    <div className="p-3 bg-zinc-800/50 rounded space-y-1.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Final Dice Pool:</span>
                            <span className="font-mono text-teal-400 font-bold" data-testid="final-dice-pool">{finalDicePool} dice</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Reach Used / Free:</span>
                            <span className={`font-mono ${reachRemaining >= 0 ? "text-teal-400" : "text-red-400"}`}>
                                {totalReachUsed} / {freeReach}
                            </span>
                        </div>
                        {activeSpellReachSurcharge > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Active Spell surcharge:</span>
                                <span className="font-mono text-amber-400">{activeSpellReachSurcharge}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Spell Mana:</span>
                            <span className="font-mono text-violet-400">{manaCost}</span>
                        </div>
                        {actualManaMitigation > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Paradox Mitigation Mana:</span>
                                <span className="font-mono text-violet-400">{actualManaMitigation}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm border-t border-zinc-700/50 pt-1">
                            <span className="text-zinc-400">Total Mana Cost:</span>
                            <span className={`font-mono font-bold ${totalManaCost > currentMana ? "text-red-400" : "text-violet-400"}`}>
                                {totalManaCost} <span className="text-zinc-500 font-normal">(have {currentMana})</span>
                            </span>
                        </div>
                        {paradoxTriggered && (
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Paradox:</span>
                                <span className={`font-mono ${paradoxIsChanceDie ? "text-amber-400" : "text-red-400"}`}>
                                    {paradoxIsChanceDie ? "Chance Die" : `${finalParadoxPool} dice`}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-800 flex justify-end gap-2 sticky bottom-0 bg-zinc-900">
                    <Button variant="outline" onClick={onClose} className="border-zinc-700 text-zinc-300" data-testid="spell-cancel-btn">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCastSpell}
                        disabled={
                            !selectedPractice ||
                            totalManaCost > currentMana ||
                            (factors.duration.advanced && !spellName.trim()) ||
                            (paradoxTriggered && !paradoxMode)
                        }
                        className="bg-violet-600 hover:bg-violet-500 text-white"
                        data-testid="cast-spell-btn"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Cast Spell ({finalDicePool} dice)
                    </Button>
                </div>
            </div>
        </div>
    );
};
