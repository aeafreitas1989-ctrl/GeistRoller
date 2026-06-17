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

const ARCANA_NAMES = [
    "Death", "Fate", "Forces", "Life", "Matter",
    "Mind", "Prime", "Space", "Spirit", "Time"
];

const WITHSTAND_TRAITS = [
    { value: "none", label: "None" },
    { value: "stamina", label: "Stamina" },
    { value: "resolve", label: "Resolve" },
    { value: "composure", label: "Composure" },
    { value: "defense", label: "Defense" },
    { value: "arcanum", label: "Arcanum" },
    { value: "custom", label: "Custom" },
];

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
            { level: 1, targets: "1 subject (Size 5)", area: "1m area" },
            { level: 2, targets: "2 subjects (Size 6)", area: "small room" },
            { level: 3, targets: "4 subjects (Size 7)", area: "large room" },
            { level: 4, targets: "8 subjects (Size 8)", area: "single floor" },
            { level: 5, targets: "16 subjects (Size 9)", area: "ballroom" },
        ],
        advanced: [
            { level: 1, targets: "5 subjects (Size 5)", area: "large house" },
            { level: 2, targets: "10 subjects (Size 10)", area: "small warehouse" },
            { level: 3, targets: "20 subjects (Size 15)", area: "supermarket" },
            { level: 4, targets: "40 subjects (Size 20)", area: "shopping mall" },
            { level: 5, targets: "80 subjects (Size 25)", area: "city block" },
            { level: 6, targets: "160 subjects (Size 30)", area: "neighbourhood" },
        ]
    }
};

const YantraSingleCheckbox = ({ name, label, bonus, checked, disabled, onToggle }) => (
    <label
        className={`flex items-center gap-2 text-xs cursor-pointer p-1.5 rounded ${
            checked ? "bg-teal-900/20 border border-teal-500/30" : "border border-transparent hover:bg-zinc-800/50"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
        <Checkbox
            checked={checked}
            onCheckedChange={() => !disabled && onToggle(name)}
            disabled={disabled}
            className="border-zinc-600 data-[state=checked]:bg-teal-600 h-3.5 w-3.5"
            data-testid={`yantra-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        />
        <span className="flex-1 text-zinc-300">{label}</span>
        <span className="text-teal-400 font-mono">+{bonus}</span>
    </label>
);

const YantraRatingPicker = ({
    groupLabel, variants, testIdPrefix, current, isOn, disabled, blockUncheck, onPickVariant, onClear,
}) => (
    <div
        className={`p-1.5 rounded space-y-1 ${
            isOn ? "bg-teal-900/20 border border-teal-500/30" : "border border-transparent hover:bg-zinc-800/50"
        } ${disabled ? "opacity-40" : ""}`}
    >
        <label className="flex items-center gap-2 text-xs cursor-pointer">
            <Checkbox
                checked={isOn}
                onCheckedChange={(checked) => {
                    if (disabled) return;
                    if (!checked) {
                        if (blockUncheck) return;
                        onClear();
                    } else {
                        onPickVariant(variants[0].name);
                    }
                }}
                disabled={disabled}
                className="border-zinc-600 data-[state=checked]:bg-teal-600 h-3.5 w-3.5"
                data-testid={`${testIdPrefix}-toggle`}
            />
            <span className="flex-1 text-zinc-300">{groupLabel}</span>
            {current && (
                <span className="text-teal-400 font-mono">+{current.bonus}</span>
            )}
        </label>
        {isOn && (
            <div className="flex gap-1 pl-6">
                {variants.map((v) => (
                    <button
                        key={v.name}
                        type="button"
                        onClick={() => onPickVariant(v.name)}
                        className={`px-2 py-0.5 rounded border text-[10px] ${
                            current?.name === v.name
                                ? "bg-teal-700 border-teal-500 text-white"
                                : "bg-zinc-900/40 border-zinc-700 text-zinc-400 hover:text-zinc-200"
                        }`}
                        data-testid={`${testIdPrefix}-rating-${v.bonus}`}
                    >
                        {v.shortLabel} +{v.bonus}
                    </button>
                ))}
            </div>
        )}
    </div>
);

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
    onAwardSpellcastingExceptionalSuccess,
    onResolveParadoxContainment,
    activeSpellCount = 0,
    orderRoteSkills,
    spellType,
    roteSkillDots,
    isRoteOrderSkill,
    defaultPrimaryFactor = null,
    allArcana = {},
    athleticsDots = 0,
    firearmsDots = 0,
    previousParadoxRolls = 0,
    onPreviousParadoxRollsChange,
    onResetPreviousParadoxRolls
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
    const [lastingDuration, setLastingDuration] = useState(false);

    // Paradox state
    const [paradoxInured, setParadoxInured] = useState(false);
    const [sleeperWitnesses, setSleeperWitnesses] = useState("none");
    const [manaMitigation, setManaMitigation] = useState(0);
    const [paradoxMode, setParadoxMode] = useState("");

    // Yantras state
    const [selectedYantras, setSelectedYantras] = useState([]);

    // Primary factor state (default: potency)
    const [primaryFactor, setPrimaryFactor] = useState(defaultPrimaryFactor);
    const [overridePrimaryFactor, setOverridePrimaryFactor] = useState(false);
    const [spellReach, setSpellReach] = useState(0);
    const [fateDurationBonus, setFateDurationBonus] = useState(0);
    const [matterDurationMana, setMatterDurationMana] = useState(false);
    const [specialRangeMode, setSpecialRangeMode] = useState("none"); // none | space | time
    const [sympatheticWithstand, setSympatheticWithstand] = useState(0);
    const [withstandTrait, setWithstandTrait] = useState("none");
    const [withstandValue, setWithstandValue] = useState(0);
    const [aimedTargetDefense, setAimedTargetDefense] = useState(0);
    const [scaleMode, setScaleMode] = useState("targets"); // targets | area
    const [ritualCastingBonus, setRitualCastingBonus] = useState(0);
    const [additionalMana, setAdditionalMana] = useState(0);
    const [combinedSpellCount, setCombinedSpellCount] = useState(0);
    const [combinedSpellArcana, setCombinedSpellArcana] = useState([]);

    const effectiveSpellType = spellType || "improvised";
    const scenePreviousParadoxRolls = Math.max(0, Number(previousParadoxRolls) || 0);

    const setPreviousParadoxRolls = (valueOrUpdater) => {
        if (!onPreviousParadoxRollsChange) return;

        if (typeof valueOrUpdater === "function") {
            onPreviousParadoxRollsChange(valueOrUpdater);
            return;
        }

        onPreviousParadoxRollsChange(Math.max(0, Number(valueOrUpdater) || 0));
    };

    const resetPreviousParadoxRolls = () => {
        if (onResetPreviousParadoxRolls) {
            onResetPreviousParadoxRolls();
            return;
        }

        setPreviousParadoxRolls(0);
    };

    const registerParadoxRollForScene = (paradoxResult = {}) => {
        if (paradoxResult?.is_dramatic_failure) {
            toast.info("Paradox dramatic failure: previous Paradox roll counter does not increase.");
            return;
        }

        setPreviousParadoxRolls((current) => current + 1);
    };

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
            setLastingDuration(false);
            setParadoxInured(false);
            setSleeperWitnesses("none");
            setManaMitigation(0);
            setParadoxMode("");
            setSelectedYantras(
                Array.from(
                    {
                        length: Math.max(
                            0,
                            (GNOSIS_TABLE[gnosis] || GNOSIS_TABLE[1]).yantras -
                                (effectiveSpellType === "rote" && Math.max(0, Number(roteSkillDots) || 0) > 0 ? 1 : 0)
                        ),
                    },
                    () => ""
                )
            );
            setPrimaryFactor(defaultPrimaryFactor);
            setOverridePrimaryFactor(false);
            setSpellReach(0);
            setFateDurationBonus(0);
            setMatterDurationMana(false);
            setSpecialRangeMode("none");
            setSympatheticWithstand(0);
            setWithstandTrait("none");
            setWithstandValue(0);
            setAimedTargetDefense(0);
            setScaleMode("targets");
            setRitualCastingBonus(0);
            setAdditionalMana(0);
            setCombinedSpellCount(0);
            setCombinedSpellArcana([]);
        }
    }, [isOpen, arcanum, initialPractice, defaultPrimaryFactor, gnosis, effectiveSpellType, roteSkillDots]);

    useEffect(() => {
        if (!overridePrimaryFactor && primaryFactor === "scale") {
            setPrimaryFactor(null);
        }
    }, [overridePrimaryFactor, primaryFactor]);

    // Gnosis-derived data
    const gnosisData = GNOSIS_TABLE[gnosis] || GNOSIS_TABLE[1];
    const maxYantras = gnosisData.yantras;
    const roteMudraBonus = effectiveSpellType === "rote" ? Math.max(0, Number(roteSkillDots) || 0) : 0;
    const usesRoteMudra = effectiveSpellType === "rote" && roteMudraBonus > 0;
    const yantraSlotLimit = Math.max(0, maxYantras - (usesRoteMudra ? 1 : 0));

    useEffect(() => {
        setSelectedYantras((prev) =>
            Array.from({ length: yantraSlotLimit }, (_, index) => prev[index] || "")
        );
    }, [yantraSlotLimit]);
    const paradoxDiePerReach = gnosisData.paradoxDie;
    const manaPerTurn = gnosisData.perTurn;

    const fateDots = allArcana?.Fate || 0;
    const matterDots = allArcana?.Matter || 0;
    const spaceDots = allArcana?.Space || 0;
    const timeDots = allArcana?.Time || 0;

    const canUseFateDuration = fateDots >= 2;
    const canUseMatterDurationMana = matterDots >= 2 && arcanum === "Matter";
    const canUseSpaceSympathetic = spaceDots >= 2;
    const canUseTimeSympathetic = timeDots >= 2;

    const maxCombinedSpellCount = Math.max(0, Math.floor((Number(gnosis) || 0) / 2));

    const getArcanaDotsForCombinedSpell = (arcanaName) => {
        if (arcanaName === arcanum) return Number(arcanumDots) || 0;
        return Number(allArcana?.[arcanaName]) || 0;
    };

    const availableCombinedArcana = ARCANA_NAMES
        .map((arcanaName) => ({
            name: arcanaName,
            dots: getArcanaDotsForCombinedSpell(arcanaName),
        }))
        .filter((arcanaData) => arcanaData.dots > 0);

    useEffect(() => {
        if (combinedSpellCount > maxCombinedSpellCount) {
            setCombinedSpellCount(maxCombinedSpellCount);
        }
    }, [combinedSpellCount, maxCombinedSpellCount]);

    useEffect(() => {
        setCombinedSpellArcana((prev) =>
            Array.from({ length: combinedSpellCount }, (_, index) => prev[index] || arcanum)
        );
    }, [combinedSpellCount, arcanum]);

    const selectedCombinedArcana = combinedSpellArcana.slice(0, combinedSpellCount);
    const selectedCombinedArcanaDots = selectedCombinedArcana.map(getArcanaDotsForCombinedSpell);
    const combinedLowestArcanumDots = selectedCombinedArcanaDots.length > 0
        ? Math.min(Number(arcanumDots) || 0, ...selectedCombinedArcanaDots)
        : Number(arcanumDots) || 0;
    const combinedSpellPenalty = combinedSpellCount * -2;
    const baseArcanumDots = combinedSpellCount > 0 ? combinedLowestArcanumDots : Number(arcanumDots) || 0;

    const availablePractices = useMemo(() => {
        return ALL_PRACTICES.filter(p => p.dots <= arcanumDots);
    }, [arcanumDots]);

    const practiceDots = selectedPractice ? PRACTICE_DOTS[selectedPractice] : 0;
    const reachArcanumDots = effectiveSpellType === "rote" ? 5 : baseArcanumDots;
    const freeReach = selectedPractice ? Math.max(0, reachArcanumDots - practiceDots + 1) : 0;
    const advancedReachUsed = Object.entries(factors).reduce((sum, [key, value]) => {
        if (!value.advanced) return sum;
        if (key === "duration" && lastingDuration) return sum;
        if (key === "duration" && matterDurationMana && arcanum === "Matter") return sum;
        return sum + 1;
    }, 0);
    const indefiniteReach = (!lastingDuration && factors.duration.advanced && factors.duration.level === 6) ? 1 : 0;

    // Current Active Spells increase the Reach cost of any spell cast.
    // At Active Spells = Gnosis, the next spell costs +1 Reach.
    // Each Active Spell above Gnosis adds another +1 Reach.
    const activeSpellReachSurcharge = Math.max(0, activeSpellCount - gnosis + 1);

    const changePrimaryReach = overridePrimaryFactor && !!primaryFactor ? 1 : 0;
    const specialRangeReach = specialRangeMode !== "none" ? 1 : 0;
    const totalReachUsed = advancedReachUsed + indefiniteReach + changePrimaryReach + activeSpellReachSurcharge + spellReach + specialRangeReach;
    const reachRemaining = freeReach - totalReachUsed;

    // Primary factor gives free levels = spell Arcanum dots - 1. Combined spells use the lowest Arcanum.
    const primaryFreeLevels = Math.max(0, baseArcanumDots - 1);
    const effectivePrimaryFactor = primaryFactor;

    // Dice penalty from factor levels (accounting for primary free levels)
    const calculatePenalty = () => {
        let penalty = 0;

        const potencyPaid = Math.max(
            0,
            factors.potency.level - 1 - (effectivePrimaryFactor === "potency" ? primaryFreeLevels : 0)
        );
        penalty += potencyPaid * -2;

        const durationPaid = lastingDuration ? 0 : Math.max(
            0,
            factors.duration.level - 1 - (effectivePrimaryFactor === "duration" ? primaryFreeLevels : 0)
        );
        penalty += durationPaid * -2;

        penalty += (factors.scale.level - 1) * -2;

        return penalty;
    };

    const dicePenalty = calculatePenalty();

    // Yantras calculation
    const selectedYantraData = useMemo(() => {
        return selectedYantras
            .map((name) => YANTRAS.find((y) => y.name === name))
            .filter(Boolean);
    }, [selectedYantras]);

    const selectedYantraNames = selectedYantraData.map((y) => y.name);

    const hasDedicatedTool = selectedYantraNames.includes("Dedicated Tool");

    const selectedYantraBonus = selectedYantraData.reduce((sum, y) => sum + y.bonus, 0);
    const rawYantraBonus = selectedYantraBonus + roteMudraBonus;
    const yantraBonusCap = 5 + Math.abs(Math.min(0, dicePenalty));
    const yantraBonus = Math.min(rawYantraBonus, yantraBonusCap);
    const yantraBonusWasCapped = rawYantraBonus > yantraBonus;
    const selectedYantraLabels = [
        ...selectedYantraNames,
        ...(usesRoteMudra ? [`Rote Mudra +${roteMudraBonus}`] : []),
    ];
    const yantraCount = selectedYantraNames.length + (usesRoteMudra ? 1 : 0);

    // Dice pool
    const ritualBonus = factors.casting.advanced ? 0 : ritualCastingBonus;
    const baseDicePool = gnosis + baseArcanumDots;
    const finalDicePool = Math.max(0, baseDicePool + dicePenalty + yantraBonus + ritualBonus + combinedSpellPenalty);

    // Spell Mana cost
    const getManaCost = () => {
        let cost = 0;

        if (effectiveSpellType === "improvised" && !isRuling) cost += 1;
        if (!lastingDuration && factors.duration.advanced && factors.duration.level === 6) cost += 1;
        if (!lastingDuration && fateDurationBonus > 0) cost += 1;
        if (!lastingDuration && matterDurationMana && arcanum === "Matter" && factors.duration.advanced) cost += 1;
        if (specialRangeMode !== "none") cost += 1;

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
    paradoxModifiers += scenePreviousParadoxRolls;

    const paradoxAfterModifiers = baseParadoxDice + paradoxModifiers;

    const committedSpellManaCost = manaCost + additionalMana;

    // Max mana for mitigation: can't exceed perTurn total (including spell cost), can't exceed available mana
    const maxManaMitigation = Math.max(0, Math.min(
        manaPerTurn - committedSpellManaCost,
        currentMana - committedSpellManaCost,
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
    const totalManaCost = committedSpellManaCost + actualManaMitigation;

    const manualWithstandValue = withstandTrait === "none" ? 0 : Math.max(0, Number(withstandValue) || 0);
    const sympatheticWithstandValue = specialRangeMode !== "none" ? Math.max(0, Number(sympatheticWithstand) || 0) : 0;
    const withstandRatings = [manualWithstandValue, sympatheticWithstandValue].filter((value) => value > 0);
    const effectiveWithstand = withstandRatings.length > 0
        ? Math.max(...withstandRatings) + Math.max(0, withstandRatings.length - 1)
        : 0;
    const basePotency = Number(factors.potency.level) || 1;
    const effectivePotency = Math.max(0, basePotency - effectiveWithstand);
    const withstandLabel = withstandTrait === "none"
        ? "None"
        : WITHSTAND_TRAITS.find((entry) => entry.value === withstandTrait)?.label || "Custom";

    const aimedAthletics = Number(athleticsDots) || 0;
    const aimedFirearms = Number(firearmsDots) || 0;
    const aimedSkillName = aimedAthletics >= aimedFirearms ? "Athletics" : "Firearms";
    const aimedSkillDots = Math.max(aimedAthletics, aimedFirearms);
    const aimedDefense = Math.max(0, Number(aimedTargetDefense) || 0);
    const aimedSpellPoolRaw = (Number(gnosis) || 0) + aimedSkillDots - aimedDefense;
    const aimedRangeBands = {
        short: (Number(gnosis) || 0) * 10,
        medium: (Number(gnosis) || 0) * 20,
        long: (Number(gnosis) || 0) * 40,
    };
    const isTouchSelfRange = !factors.range.advanced && specialRangeMode === "none";

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

    const getDisplayedDurationLevel = () => {
        const max = FACTOR_LEVELS.duration[factors.duration.advanced ? "advanced" : "standard"]?.length || 1;
        return Math.min(max, factors.duration.level + fateDurationBonus);
    };

    const activateSpecialRange = (mode) => {
        setSpecialRangeMode((prev) => (prev === mode ? "none" : mode));
    };

    const getPrimaryFactorLabel = (factorName) => {
        if (factorName === "potency") return "Potency";
        if (factorName === "duration") return "Duration";
        if (factorName === "scale") return "Scale";
        return "Primary Factor";
    };

    const getFactorDescription = (factorName) => {
        const factor = factors[factorName];
        if (!factor) return "";

        if (factorName === "casting") {
            if (factor.advanced) {
                const turns = Math.max(1, yantraCount);
                return `${turns} turn${turns === 1 ? "" : "s"}`;
            }
            return `${getCastingTime(gnosis)} Ritual`;
        }

        if (factorName === "range") {
            return factor.advanced ? "Sensory Range" : "Touch Range / Self";
        }

        if (factorName === "duration" && lastingDuration) {
            return "Lasting";
        }

        const levels = FACTOR_LEVELS[factorName]?.[factor.advanced ? "advanced" : "standard"];
        const levelData = levels?.[factor.level - 1];

        if (factorName === "scale") {
            const scaleDescription =
                scaleMode === "area"
                    ? levelData?.area || ""
                    : levelData?.targets || "";

            return `up to ${scaleDescription}`;
        }

        const baseDescription = levelData?.label || "";
        return baseDescription;
    };

    const setYantraSlot = (index, value) => {
        setSelectedYantras((prev) => {
            const next = [...prev];
            const currentValue = next[index];
            const nextValue = value === "__none__" ? "" : value;

            if (specialRangeMode !== "none" && currentValue === "Sympathy" && nextValue === "") {
                return prev;
            }

            next[index] = nextValue;
            return next;
        });
    };

    // Set of currently-selected yantra names (excluding empty slots).
    const selectedNameSet = useMemo(() => new Set(selectedYantras.filter(Boolean)), [selectedYantras]);

    // Toggle a yantra by name. If it would put the user over the slot limit, the
    // earliest selected yantra (other than the one we're toggling) is replaced.
    const toggleYantraName = (name) => {
        setSelectedYantras((prev) => {
            const filled = prev.filter(Boolean);
            const isOn = filled.includes(name);

            if (isOn) {
                // Removing — but Sympathy cannot be removed while a Sympathetic range is active.
                if (specialRangeMode !== "none" && name.startsWith("Sympathy:")) {
                    return prev;
                }
                const nextFilled = filled.filter((n) => n !== name);
                return [
                    ...nextFilled,
                    ...Array.from({ length: Math.max(0, yantraSlotLimit - nextFilled.length) }, () => ""),
                ];
            }

            // Adding — enforce capacity.
            const nextFilled = [...filled, name];
            if (nextFilled.length > yantraSlotLimit) {
                // Drop the oldest one to make room.
                nextFilled.shift();
            }
            return [
                ...nextFilled,
                ...Array.from({ length: Math.max(0, yantraSlotLimit - nextFilled.length) }, () => ""),
            ];
        });
    };

    // For Sympathy/Sacrament rating selectors: replaces any current rating with the new one.
    const setMutuallyExclusiveYantra = (group, name) => {
        // group is array of names; name is the chosen one (or null to clear)
        setSelectedYantras((prev) => {
            const filled = prev.filter(Boolean);
            const withoutGroup = filled.filter((n) => !group.includes(n));
            const nextFilled = name ? [...withoutGroup, name] : withoutGroup;
            const trimmed = nextFilled.length > yantraSlotLimit
                ? nextFilled.slice(nextFilled.length - yantraSlotLimit)
                : nextFilled;
            return [
                ...trimmed,
                ...Array.from({ length: Math.max(0, yantraSlotLimit - trimmed.length) }, () => ""),
            ];
        });
    };

    const getYantraOptionsForSlot = (index) => {
        const currentValue = selectedYantras[index];

        return YANTRAS.filter((yantra) => {
            const alreadyUsedElsewhere = selectedYantras.some(
                (selectedName, selectedIndex) =>
                    selectedIndex !== index && selectedName === yantra.name
            );

            return !alreadyUsedElsewhere || yantra.name === currentValue;
        });
    };

    const SYMPATHY_VARIANTS = ["Sympathy: Material", "Sympathy: Representational", "Sympathy: Symbolic"];

    useEffect(() => {
        setSelectedYantras((prev) => {
            const hasSympathy = prev.some((name) => SYMPATHY_VARIANTS.includes(name));

            if (specialRangeMode === "none") {
                if (!hasSympathy) return prev;

                // Note: leave any user-chosen Sympathy variant alone when special range turns off.
                return prev;
            }

            if (hasSympathy) return prev;

            const emptyIndex = prev.findIndex((name) => !name);
            if (emptyIndex >= 0) {
                const next = [...prev];
                next[emptyIndex] = "Sympathy: Symbolic";
                return next;
            }

            toast.error("No free Yantra slot for Sympathy.");
            setSpecialRangeMode("none");
            return prev;
        });
    }, [specialRangeMode]);

    const handleRollAimedSpell = () => {
        if (!onRollDice) return;

        if (!isTouchSelfRange) {
            toast.error("Aimed Spell rolls are only available for Touch/Self Range spells.");
            return;
        }

        const adjustedPool = Math.max(0, aimedSpellPoolRaw);

        onRollDice({
            pool: adjustedPool <= 0 ? 1 : adjustedPool,
            chance: adjustedPool <= 0,
            label: "Aimed Spell",
            exceptional_target: 5,
            dicePoolBreakdown: `Gnosis ${gnosis} + ${aimedSkillName} ${aimedSkillDots} - Target Defense ${aimedDefense}`,
            spellSummary: `Roll after successful spellcasting when using Touch/Self Range without touching the target. Range bands: short ${aimedRangeBands.short}, medium ${aimedRangeBands.medium}, long ${aimedRangeBands.long}.`,
        });
        onClose();
    };

    const handleCastSpell = () => {
        if (!effectivePrimaryFactor) {
            toast.error("Select a Primary Spell Factor before casting.");
            return;
        }

        if (totalManaCost > 0 && currentMana < totalManaCost) return;
        if (!lastingDuration && factors.duration.advanced && !spellName.trim()) return;
        if (paradoxTriggered && !paradoxMode) return;

        if (totalManaCost > 0) {
            onSpendMana(totalManaCost);
        }

        const activeSpellData = !lastingDuration && factors.duration.advanced && onCreateActiveSpell
            ? {
                id: Date.now(),
                kind: "spell",
                name: spellName.trim(),
                arcanum,
                practice: selectedPractice,
                potency: getFactorDescription("potency"),
                effectivePotency: effectiveWithstand > 0 ? `Potency ${effectivePotency}` : undefined,
                duration: getFactorDescription("duration"),
                scale: getFactorDescription("scale"),
                combined: combinedSpellCount > 0 ? `${combinedSpellCount + 1} spells` : undefined,
            }
            : null;

        const factorSummary = [
            getFactorDescription("casting"),
            getFactorDescription("range"),
            getFactorDescription("potency"),
            getFactorDescription("duration"),
            getFactorDescription("scale"),
        ].join("; ");

        const selectedYantrasSummary = selectedYantraLabels.length > 0
            ? `Yantras: ${selectedYantraLabels.join(", ")}${yantraBonusWasCapped ? `; raw +${rawYantraBonus}, capped at +${yantraBonus}` : ""}`
            : "";

        const ritualSummary = ritualBonus > 0
            ? `Ritual Casting: +${ritualBonus} dice`
            : "";

        const combinedSpellSummary = combinedSpellCount > 0
            ? `Combined Spell: ${combinedSpellCount + 1} spells (${[arcanum, ...selectedCombinedArcana].join(", ")}); lowest Arcanum ${combinedLowestArcanumDots}; ${combinedSpellPenalty} dice`
            : "";

        const arcanaManaSurchargeSummary = effectiveSpellType === "improvised" && !isRuling
            ? (isInferior ? "Inferior Arcanum" : "Common Arcanum")
            : "";

        const spentSpellManaSummary = committedSpellManaCost > 0
            ? `Spent Mana: ${committedSpellManaCost}${
                arcanaManaSurchargeSummary ? ` (${arcanaManaSurchargeSummary})` : ""
            }`
            : "";

        // Build Reach breakdown — only categories actually used.
        const reachCategories = [];
        if (advancedReachUsed > 0) reachCategories.push(`Advanced Factors +${advancedReachUsed}`);
        if (indefiniteReach > 0) reachCategories.push(`Indefinite Duration +${indefiniteReach}`);
        if (changePrimaryReach > 0) {
            const newPrimaryLabel = getPrimaryFactorLabel(primaryFactor);
            reachCategories.push(`Primary Factor Override → ${newPrimaryLabel} +${changePrimaryReach}`);
        }
        if (spellReach > 0) reachCategories.push(`Spell Options +${spellReach}`);
        if (specialRangeReach > 0) reachCategories.push(`Sympathetic Casting +${specialRangeReach}`);
        if (activeSpellReachSurcharge > 0) reachCategories.push(`Active Spell surcharge +${activeSpellReachSurcharge}`);

        const reachBreakdownLine = reachCategories.length > 0
            ? `Reach: ${reachCategories.join(", ")}`
            : "";

        const spellReachSummary = `Spell Reach: ${totalReachUsed} / ${freeReach} free${
            reachBeyondFree > 0 ? `; ${reachBeyondFree} over free` : ""
        }`;

        const withstandSummary = effectiveWithstand > 0
            ? `Withstand: ${effectiveWithstand} total; effective Potency ${effectivePotency}${effectivePotency <= 0 ? " (spell active, no effect)" : ""}`
            : "";

        const spellNameSummary = spellName.trim() ? `Spell: ${spellName.trim()}` : "";

        const spellSummary = [
            ...(spellNameSummary ? [spellNameSummary] : []),
            spellReachSummary,
            ...(reachBreakdownLine ? [reachBreakdownLine] : []),
            ...(spentSpellManaSummary ? [spentSpellManaSummary] : []),
            ...(selectedYantrasSummary ? [selectedYantrasSummary] : []),
            ...(ritualSummary ? [ritualSummary] : []),
            ...(combinedSpellSummary ? [combinedSpellSummary] : []),
            ...(withstandSummary ? [withstandSummary] : []),
            factorSummary,
        ].join("\n");

        const castLabel = `${arcanum} ${effectiveSpellType === "praxis" ? "Praxis" : effectiveSpellType === "rote" ? "Rote" : "Spell"} (${selectedPractice})`;

        const buildSpellRollConfig = (poolModifier = 0) => {
            const adjustedPool = Math.max(0, finalDicePool + poolModifier);

            const dicePoolBreakdownParts = [
                `Gnosis ${gnosis}`,
                combinedSpellCount > 0
                    ? `Lowest Arcanum ${combinedLowestArcanumDots}${selectedPractice ? ` (${selectedPractice})` : ""}`
                    : `${arcanum} ${arcanumDots}${selectedPractice ? ` (${selectedPractice})` : ""}`,
                ...(yantraBonus > 0 ? [`Yantras ${yantraBonus}${yantraBonusWasCapped ? ` (raw ${rawYantraBonus}, capped)` : ""}`] : []),
                ...(ritualBonus > 0 ? [`Ritual +${ritualBonus}`] : []),
                ...(combinedSpellPenalty !== 0 ? [`Combined Spell ${combinedSpellPenalty}`] : []),
                ...(dicePenalty !== 0 ? [`Factors ${dicePenalty}`] : []),
                ...(poolModifier < 0 ? [`Release Penalty ${poolModifier}`] : []),
            ];

            return {
                pool: adjustedPool <= 0 ? 1 : adjustedPool,
                chance: adjustedPool <= 0,
                label: castLabel,
                summaryKey: "spell",
                summaryLabel: castLabel,
                exceptional_target: effectiveSpellType === "praxis" ? 3 : 5,
                dicePoolBreakdown: dicePoolBreakdownParts.join(" + "),
                spellSummary,
                requiresSpellExceptionalChoice: true,
                spellExceptionalManaSpent: totalManaCost,
                spellPrimaryFactor: effectivePrimaryFactor,
                spellPrimaryFactorLabel: getPrimaryFactorLabel(effectivePrimaryFactor),
                onResult: (rollResult, exceptionalChoice = null) => {
                    const spellSucceeded = (rollResult?.successes || 0) >= 1;

                    if (rollResult?.is_exceptional && onAwardSpellcastingExceptionalSuccess) {
                        onAwardSpellcastingExceptionalSuccess({
                            manaSpent: totalManaCost,
                            choiceId: exceptionalChoice?.id || null,
                        });
                    }

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
            paradoxSummary: `Spent Mana on Paradox: ${actualManaMitigation}`,
            spellSummary: `Spent Mana on Paradox: ${actualManaMitigation}`,
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
                    registerParadoxRollForScene(paradoxResult);

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
                    registerParadoxRollForScene(paradoxResult);

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
        const hasPrimary = factorName === "potency" || factorName === "duration" || factorName === "scale";
        const isSelectedPrimary = hasPrimary && primaryFactor === factorName;
        const isEffectivePrimary = hasPrimary && effectivePrimaryFactor === factorName;
        const freeLevelsFromPrimary = isEffectivePrimary ? primaryFreeLevels : 0;
        const displayedLevel = factorName === "duration" ? getDisplayedDurationLevel() : f.level;

        let description = "";
        if (isCasting) {
            description = f.advanced ? "Instant" : `${castingTimeStandard} Ritual`;
        } else if (isRange) {
            description = getFactorDescription("range");
        } else {
            description = getFactorDescription(factorName);
        }

        const paidLevels = hasLevels
            ? Math.max(0, f.level - 1 - freeLevelsFromPrimary)
            : 0;

        return (
            <div key={factorName} className="grid grid-cols-[20px_170px_50px_50px_50px_1fr] gap-1.5 items-center p-2 bg-zinc-800/30 rounded text-sm">
                {hasPrimary ? (
                    <Checkbox
                        checked={isSelectedPrimary}
                        disabled={
                            isSelectedPrimary ||
                            (factorName === "scale" && !overridePrimaryFactor) ||
                            (defaultPrimaryFactor && !overridePrimaryFactor)
                        }
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

                <div className="text-xs">
                    <div className="text-zinc-300">
                        {label}
                        {isEffectivePrimary && (
                            <span className="text-teal-400 text-[9px] ml-1">
                                {overridePrimaryFactor ? "PFO" : "P"}
                            </span>
                        )}
                    </div>

                    {factorName === "duration" && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setLastingDuration((prev) => {
                                        const next = !prev;
                                        if (next) {
                                            setFateDurationBonus(0);
                                            setMatterDurationMana(false);
                                            updateFactor("duration", { advanced: false, level: 1 });
                                        }
                                        return next;
                                    });
                                }}
                                className={`px-1.5 py-0.5 rounded border text-[9px] ${
                                    lastingDuration
                                        ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-300"
                                        : "bg-zinc-900/40 border-zinc-700 text-zinc-400"
                                }`}
                                data-testid="duration-lasting"
                            >
                                Lasting
                            </button>
                            {canUseFateDuration && [0, 1, 2, 3].map((bonus) => (
                                <button
                                    key={`fate-duration-${bonus}`}
                                    type="button"
                                    onClick={() => setFateDurationBonus(bonus)}
                                    className={`px-1.5 py-0.5 rounded border text-[9px] ${
                                        fateDurationBonus === bonus
                                            ? "bg-blue-900/40 border-blue-500/50 text-blue-300"
                                            : "bg-zinc-900/40 border-zinc-700 text-zinc-400"
                                    }`}
                                    data-testid={`fate-duration-${bonus}`}
                                >
                                    F{bonus === 0 ? "0" : `+${bonus}`}
                                </button>
                            ))}

                            {canUseMatterDurationMana && (
                                <button
                                    type="button"
                                    onClick={() => setMatterDurationMana((prev) => !prev)}
                                    className={`px-1.5 py-0.5 rounded border text-[9px] ${
                                        matterDurationMana
                                            ? "bg-amber-900/40 border-amber-500/50 text-amber-300"
                                            : "bg-zinc-900/40 border-zinc-700 text-zinc-400"
                                    }`}
                                    data-testid="matter-duration-mana"
                                >
                                    Matter 2
                                </button>
                            )}
                        </div>
                    )}

                    {factorName === "range" && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {canUseSpaceSympathetic && (
                                <button
                                    type="button"
                                    onClick={() => activateSpecialRange("space")}
                                    className={`px-1.5 py-0.5 rounded border text-[9px] ${
                                        specialRangeMode === "space"
                                            ? "bg-blue-900/40 border-blue-500/50 text-blue-300"
                                            : "bg-zinc-900/40 border-zinc-700 text-zinc-400"
                                    }`}
                                    data-testid="space-sympathetic-range"
                                >
                                    Space 2
                                </button>
                            )}

                            {canUseTimeSympathetic && (
                                <button
                                    type="button"
                                    onClick={() => activateSpecialRange("time")}
                                    className={`px-1.5 py-0.5 rounded border text-[9px] ${
                                        specialRangeMode === "time"
                                            ? "bg-blue-900/40 border-blue-500/50 text-blue-300"
                                            : "bg-zinc-900/40 border-zinc-700 text-zinc-400"
                                    }`}
                                    data-testid="time-sympathetic-time"
                                >
                                    Time 2
                                </button>
                            )}

                            {specialRangeMode !== "none" && (
                                <div className="flex items-center gap-0.5">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 text-zinc-400"
                                        onClick={() => setSympatheticWithstand(Math.max(0, sympatheticWithstand - 1))}
                                        disabled={sympatheticWithstand <= 0}
                                    >
                                        <Minus className="w-2.5 h-2.5" />
                                    </Button>
                                    <span className="w-4 text-center text-[10px] font-mono text-violet-300">
                                        {sympatheticWithstand}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 text-zinc-400"
                                        onClick={() => setSympatheticWithstand(Math.min(5, sympatheticWithstand + 1))}
                                        disabled={sympatheticWithstand >= 5}
                                    >
                                        <Plus className="w-2.5 h-2.5" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <Checkbox
                        checked={!f.advanced && !(factorName === "duration" && lastingDuration)}
                        onCheckedChange={() => {
                            if (factorName === "duration") setLastingDuration(false);
                            updateFactor(factorName, { advanced: false, ...(hasLevels ? { level: 1 } : {}) });
                        }}
                        className="border-zinc-600 data-[state=checked]:bg-violet-600"
                        disabled={(factorName === "range" && specialRangeMode !== "none") || (factorName === "duration" && lastingDuration)}
                    />
                </div>

                <div className="flex justify-center">
                    <Checkbox
                        checked={f.advanced && !(factorName === "duration" && lastingDuration)}
                        onCheckedChange={() => {
                            if (factorName === "duration") setLastingDuration(false);
                            updateFactor(factorName, { advanced: true, ...(hasLevels ? { level: 1 } : {}) });
                        }}
                        className="border-zinc-600 data-[state=checked]:bg-amber-600"
                        disabled={(factorName === "range" && specialRangeMode !== "none") || (factorName === "duration" && lastingDuration)}
                    />
                </div>

                {hasLevels ? (
                    <div className="flex items-center justify-center gap-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-zinc-400"
                            onClick={() => updateFactor(factorName, { level: Math.max(1, f.level - 1) })}
                            disabled={f.level <= 1 || (factorName === "duration" && lastingDuration)}
                        >
                            <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-mono text-violet-300 w-4 text-center">
                            {factorName === "duration" && lastingDuration ? "—" : displayedLevel}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-zinc-400"
                            onClick={() => updateFactor(factorName, { level: Math.min(getMaxLevel(factorName, f.advanced), f.level + 1) })}
                            disabled={f.level >= getMaxLevel(factorName, f.advanced) || (factorName === "duration" && lastingDuration)}
                        >
                            <Plus className="w-3 h-3" />
                        </Button>
                    </div>
                ) : isCasting && !f.advanced ? (
                    <div className="flex items-center justify-center gap-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-zinc-400"
                            onClick={() => setRitualCastingBonus(Math.max(0, ritualCastingBonus - 1))}
                            disabled={ritualCastingBonus <= 0}
                            data-testid="ritual-casting-decrease"
                        >
                            <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-mono text-violet-300 w-4 text-center">{ritualCastingBonus}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-zinc-400"
                            onClick={() => setRitualCastingBonus(Math.min(5, ritualCastingBonus + 1))}
                            disabled={ritualCastingBonus >= 5}
                            data-testid="ritual-casting-increase"
                        >
                            <Plus className="w-3 h-3" />
                        </Button>
                    </div>
                ) : (
                    <span className="text-center text-zinc-500">-</span>
                )}

                <span className="text-xs text-zinc-400 truncate">
                    {description}
                    {f.advanced && factorName !== "duration" && <span className="text-amber-400 ml-1">(+1R)</span>}
                    {f.advanced && factorName === "duration" && !matterDurationMana && <span className="text-amber-400 ml-1">(+1R)</span>}
                    {f.advanced && factorName === "duration" && matterDurationMana && arcanum === "Matter" && <span className="text-blue-400 ml-1">(+1 Mana)</span>}
                    {factorName === "range" && specialRangeMode !== "none" && <span className="text-blue-400 ml-1">(+1 Mana, +1 Reach)</span>}
                    {factorName === "duration" && fateDurationBonus > 0 && <span className="text-blue-400 ml-1">(+{fateDurationBonus} lvl, +1 Mana)</span>}
                    {isCasting && !f.advanced && ritualCastingBonus > 0 && <span className="text-teal-400 ml-1">(+{ritualCastingBonus}d)</span>}
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
                                {arcanum} {effectiveSpellType === "rote" ? "Rote" : effectiveSpellType === "praxis" ? "Praxis" : "Spellcasting"}
                            </h2>
                            <p className="text-xs text-zinc-500">
                                {isRuling && <span className="text-blue-400">Ruling Arcanum</span>}
                                {isInferior && <span className="text-red-400">Inferior Arcanum</span>}
                                {!isRuling && !isInferior && <span className="text-zinc-400">Common Arcanum</span>}
                                {" · "}{arcanumDots} dot{arcanumDots !== 1 && "s"} · Gnosis {gnosis}
                                {effectiveSpellType === "rote" && <span className="text-amber-400">{" · "}Rote Mudra +{roteMudraBonus}</span>}
                                {effectiveSpellType === "praxis" && <span className="text-teal-400">{" · "}Exceptional on 3</span>}
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
                        {!lastingDuration && factors.duration.advanced && !spellName.trim() && (
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

                    {/* Combined Spell */}
                    {selectedPractice && maxCombinedSpellCount > 0 && (
                        <div className="p-2 bg-zinc-800/30 rounded space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase">Combined Spell</p>
                                    <p className="text-[11px] text-zinc-600">
                                        Add extra spells. Each extra spell is -2 dice. Base pool uses the lowest Arcanum used.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-zinc-400"
                                        onClick={() => setCombinedSpellCount(Math.max(0, combinedSpellCount - 1))}
                                        disabled={combinedSpellCount <= 0}
                                        data-testid="combined-spell-decrease"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="font-mono text-amber-400 w-12 text-center">
                                        {combinedSpellCount}/{maxCombinedSpellCount}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-zinc-400"
                                        onClick={() => setCombinedSpellCount(Math.min(maxCombinedSpellCount, combinedSpellCount + 1))}
                                        disabled={combinedSpellCount >= maxCombinedSpellCount}
                                        data-testid="combined-spell-increase"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            {combinedSpellCount > 0 && (
                                <div className="space-y-2 pt-2 border-t border-zinc-700/50">
                                    {Array.from({ length: combinedSpellCount }).map((_, index) => {
                                        const selectedArcanaName = selectedCombinedArcana[index] || arcanum;
                                        const selectedDots = getArcanaDotsForCombinedSpell(selectedArcanaName);

                                        return (
                                            <div key={`combined-spell-${index}`} className="flex items-center gap-2">
                                                <span className="w-20 text-[10px] uppercase tracking-wider text-zinc-500">
                                                    Spell {index + 2}
                                                </span>
                                                <Select
                                                    value={selectedArcanaName}
                                                    onValueChange={(value) => {
                                                        setCombinedSpellArcana((prev) => {
                                                            const next = [...prev];
                                                            next[index] = value;
                                                            return next;
                                                        });
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        className="flex-1 h-8 text-xs bg-zinc-900/50 border-zinc-700"
                                                        data-testid={`combined-spell-arcana-${index + 1}`}
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-zinc-700 z-[200]">
                                                        {availableCombinedArcana.map((arcanaData) => (
                                                            <SelectItem
                                                                key={arcanaData.name}
                                                                value={arcanaData.name}
                                                                className="text-xs text-zinc-200"
                                                            >
                                                                {arcanaData.name} {arcanaData.dots}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <span className="w-12 text-right text-xs font-mono text-violet-300">
                                                    {selectedDots} dot{selectedDots === 1 ? "" : "s"}
                                                </span>
                                            </div>
                                        );
                                    })}

                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-500">Combined penalty</span>
                                        <span className="font-mono text-red-400">{combinedSpellPenalty} dice</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-500">Lowest Arcanum used</span>
                                        <span className="font-mono text-violet-300">{combinedLowestArcanumDots}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reach Display */}
                    {selectedPractice && (
                        <div className="p-2 bg-zinc-800/50 rounded text-sm space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-400">
                                    Free Reach: <span className="text-teal-400 font-mono">{freeReach}</span>
                                    <span className="text-zinc-600 ml-1">({reachArcanumDots} - {practiceDots} + 1{effectiveSpellType === "rote" ? "; Rote uses 5" : ""})</span>
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

                                    {specialRangeReach > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Sympathetic Casting</span>
                                            <span className="font-mono text-amber-400">+{specialRangeReach} Reach</span>
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
                                        Extra Reach required by this spell&apos;s own options
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

                    {/* Additional Mana */}
                    {selectedPractice && (
                        <div className="p-2 bg-zinc-800/30 rounded space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase">Add Mana</p>
                                    <p className="text-[11px] text-zinc-600">
                                        Manual Mana for spell options, aggravated damage, or other extra costs
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-zinc-400"
                                        onClick={() => setAdditionalMana(Math.max(0, additionalMana - 1))}
                                        disabled={additionalMana <= 0}
                                        data-testid="additional-mana-decrease"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="font-mono text-violet-400 w-8 text-center">
                                        {additionalMana}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-zinc-400"
                                        onClick={() => setAdditionalMana(additionalMana + 1)}
                                        disabled={committedSpellManaCost >= currentMana}
                                        data-testid="additional-mana-increase"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Primary Factor Override */}
                    {selectedPractice && (
                        <div className="p-2 bg-zinc-800/30 rounded space-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase">Primary Factor Override</p>
                                    <p className="text-[11px] text-zinc-600">
                                        Spend 1 Reach to override the spell&apos;s normal primary factor
                                    </p>
                                </div>
                                <Checkbox
                                    checked={overridePrimaryFactor}
                                    onCheckedChange={(checked) => {
                                        setOverridePrimaryFactor(!!checked);
                                        if (!checked) {
                                            // Restore default primary on un-toggle.
                                            setPrimaryFactor(defaultPrimaryFactor);
                                        } else {
                                            // Pre-select a non-default option if the current primary
                                            // still equals the default (so the user sees something selected).
                                            if (primaryFactor === defaultPrimaryFactor) {
                                                const fallback =
                                                    defaultPrimaryFactor === "potency" ? "duration" :
                                                    defaultPrimaryFactor === "duration" ? "potency" :
                                                    "potency";
                                                setPrimaryFactor(fallback);
                                            }
                                        }
                                    }}
                                    className="border-zinc-600 data-[state=checked]:bg-amber-600"
                                    data-testid="override-primary-factor"
                                />
                            </div>

                            {overridePrimaryFactor && (
                                <div className="space-y-1">
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">New Primary Factor</p>
                                    <div className="flex gap-1.5" data-testid="pfo-selector">
                                        {["potency", "duration", "scale"]
                                            .filter((f) => f !== defaultPrimaryFactor)
                                            .map((f) => {
                                                const active = primaryFactor === f;
                                                return (
                                                    <button
                                                        key={f}
                                                        type="button"
                                                        onClick={() => setPrimaryFactor(f)}
                                                        className={`px-2 py-1 rounded border text-[11px] capitalize ${
                                                            active
                                                                ? "bg-amber-700 border-amber-500 text-white"
                                                                : "bg-zinc-900/40 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                                        }`}
                                                        data-testid={`pfo-${f}`}
                                                    >
                                                        {f}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                    {defaultPrimaryFactor && (
                                        <p className="text-[10px] text-zinc-600">
                                            Default primary: <span className="capitalize text-zinc-400">{defaultPrimaryFactor}</span>. Scale can never be a default primary.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Spell Factors */}
                    <div className="space-y-1">
                        <p className="text-xs text-zinc-500 uppercase">Spell Factors</p>
                        <div className="grid grid-cols-[20px_170px_50px_50px_50px_1fr] gap-1.5 items-center p-2 bg-zinc-800/30 rounded text-sm">
                            <span />
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

                        {selectedPractice && !effectivePrimaryFactor && (
                            <p className="text-[11px] text-amber-400">
                                Select Potency, Duration, or Scale as the Primary Spell Factor before casting.
                            </p>
                        )}

                        <div className="mt-2 p-2 bg-zinc-800/30 rounded space-y-1.5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase">Scale Mode</p>
                                    <p className="text-[11px] text-zinc-600">
                                        Choose whether Scale applies to Targets or Area
                                    </p>
                                </div>

                                <div
                                    className="inline-flex rounded-md border border-zinc-700 bg-zinc-900/50 p-1"
                                    data-testid="scale-mode-toggle"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setScaleMode("targets")}
                                        className={`px-3 py-1 text-xs rounded transition-all ${
                                            scaleMode === "targets"
                                                ? "bg-teal-600 text-white"
                                                : "text-zinc-400 hover:text-zinc-200"
                                        }`}
                                        data-testid="scale-mode-targets"
                                    >
                                        Targets
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setScaleMode("area")}
                                        className={`px-3 py-1.5 text-xs rounded transition-all ${
                                            scaleMode === "area"
                                                ? "bg-teal-600 text-white"
                                                : "text-zinc-400 hover:text-zinc-200"
                                        }`}
                                        data-testid="scale-mode-area"
                                    >
                                        Area
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Withstand */}
                    <div className="p-2 bg-zinc-800/30 rounded space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs text-zinc-500 uppercase">Withstand</p>
                                <p className="text-[11px] text-zinc-600">
                                    Manual tracker. Withstand reduces Potency, not the casting pool.
                                </p>
                            </div>
                            <div className="text-right text-xs">
                                <div className="text-zinc-500">Effective Potency</div>
                                <div className={`font-mono ${effectivePotency > 0 ? "text-teal-400" : "text-red-400"}`}>
                                    {effectivePotency}/{basePotency}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-[1fr_90px] gap-2 items-center">
                            <Select value={withstandTrait} onValueChange={setWithstandTrait}>
                                <SelectTrigger className="h-8 text-xs bg-zinc-900/50 border-zinc-700" data-testid="withstand-trait-select">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700 z-[200]">
                                    {WITHSTAND_TRAITS.map((trait) => (
                                        <SelectItem key={trait.value} value={trait.value} className="text-xs text-zinc-200">
                                            {trait.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                type="number"
                                min="0"
                                value={withstandValue}
                                onChange={(event) => setWithstandValue(Math.max(0, Number(event.target.value) || 0))}
                                disabled={withstandTrait === "none"}
                                className="h-8 text-xs bg-zinc-900/50 border-zinc-700 text-right font-mono"
                                data-testid="withstand-value-input"
                            />
                        </div>

                        {(effectiveWithstand > 0 || sympatheticWithstandValue > 0) && (
                            <div className="space-y-1 text-xs">
                                {manualWithstandValue > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">{withstandLabel}</span>
                                        <span className="font-mono text-amber-400">{manualWithstandValue}</span>
                                    </div>
                                )}
                                {sympatheticWithstandValue > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Sympathetic Withstand</span>
                                        <span className="font-mono text-amber-400">{sympatheticWithstandValue}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-1 border-t border-zinc-700/50">
                                    <span className="text-zinc-400">Total Withstand</span>
                                    <span className="font-mono text-amber-400">{effectiveWithstand}</span>
                                </div>
                                {effectivePotency <= 0 && (
                                    <p className="text-[11px] text-red-400">
                                        Potency is reduced to 0: the spell may be active but has no effect.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Aimed Spell */}
                    {isTouchSelfRange && (
                        <div className="p-2 bg-zinc-800/30 rounded space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase">Aimed Spell</p>
                                    <p className="text-[11px] text-zinc-600">
                                        Use only for Touch/Self Range spells thrown or fired at a target.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    className="h-7 px-2 text-xs bg-violet-700 hover:bg-violet-600"
                                    onClick={handleRollAimedSpell}
                                    data-testid="roll-aimed-spell-btn"
                                >
                                    Roll Aimed Spell
                                </Button>
                            </div>

                            <div className="grid grid-cols-[1fr_90px] gap-2 items-center">
                                <div className="text-xs text-zinc-400">
                                    Pool: <span className="font-mono text-violet-300">Gnosis {gnosis} + {aimedSkillName} {aimedSkillDots} - Defense</span>
                                </div>
                                <Input
                                    type="number"
                                    min="0"
                                    value={aimedTargetDefense}
                                    onChange={(event) => setAimedTargetDefense(Math.max(0, Number(event.target.value) || 0))}
                                    className="h-8 text-xs bg-zinc-900/50 border-zinc-700 text-right font-mono"
                                    data-testid="aimed-target-defense-input"
                                />
                            </div>

                            <div className="flex justify-between text-xs text-zinc-500">
                                <span>Short {aimedRangeBands.short}</span>
                                <span>Medium {aimedRangeBands.medium}</span>
                                <span>Long {aimedRangeBands.long}</span>
                                <span className={`font-mono ${aimedSpellPoolRaw > 0 ? "text-teal-400" : "text-amber-400"}`}>
                                    {aimedSpellPoolRaw > 0 ? `${aimedSpellPoolRaw} dice` : "Chance Die"}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Yantras Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-500 uppercase flex items-center gap-1">
                                <Wrench className="w-3 h-3" /> Yantras
                            </p>
                            <span className="text-xs text-zinc-500">
                                {yantraCount}/{maxYantras} used
                                {yantraBonus > 0 && <span className="text-teal-400 ml-1">(+{yantraBonus} dice)</span>}
                            </span>
                        </div>

                        {usesRoteMudra && (
                            <div className="p-2 bg-amber-950/20 border border-amber-500/30 rounded text-xs flex items-center justify-between">
                                <span className="text-amber-300">Rote Mudra uses 1 Yantra slot</span>
                                <span className="font-mono text-amber-300">+{roteMudraBonus}</span>
                            </div>
                        )}

                        {yantraBonusWasCapped && (
                            <p className="text-[11px] text-amber-400">
                                Yantra bonus raw +{rawYantraBonus} is capped at +{yantraBonus}. Cap is +5 after offsetting spell factor penalties.
                            </p>
                        )}

                        {(() => {
                            const slotsFull = selectedNameSet.size >= yantraSlotLimit;

                            const sympathyVariants = [
                                { name: "Sympathy: Symbolic", shortLabel: "Symbolic", bonus: 0 },
                                { name: "Sympathy: Representational", shortLabel: "Repr.", bonus: 1 },
                                { name: "Sympathy: Material", shortLabel: "Material", bonus: 2 },
                            ];
                            const sacramentVariants = [
                                { name: "Sacrament: Minor", shortLabel: "Minor", bonus: 1 },
                                { name: "Sacrament: Major", shortLabel: "Major", bonus: 2 },
                                { name: "Sacrament: Mystic", shortLabel: "Mystic", bonus: 3 },
                            ];

                            const sympathyCurrent = sympathyVariants.find((v) => selectedNameSet.has(v.name)) || null;
                            const sacramentCurrent = sacramentVariants.find((v) => selectedNameSet.has(v.name)) || null;

                            const renderSingle = (name, label, bonus) => (
                                <YantraSingleCheckbox
                                    key={name}
                                    name={name}
                                    label={label}
                                    bonus={bonus}
                                    checked={selectedNameSet.has(name)}
                                    disabled={!selectedNameSet.has(name) && slotsFull}
                                    onToggle={toggleYantraName}
                                />
                            );

                            return (
                                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                                    {/* Left Column */}
                                    <div className="space-y-0.5">
                                        {renderSingle("High Speech", "High Speech", 2)}
                                        {renderSingle("Concentration", "Concentration", 2)}
                                        <YantraRatingPicker
                                            groupLabel="Sympathy"
                                            variants={sympathyVariants}
                                            testIdPrefix="yantra-sympathy"
                                            current={sympathyCurrent}
                                            isOn={!!sympathyCurrent}
                                            disabled={!sympathyCurrent && slotsFull}
                                            blockUncheck={specialRangeMode !== "none"}
                                            onPickVariant={(name) => setMutuallyExclusiveYantra(sympathyVariants.map((v) => v.name), name)}
                                            onClear={() => setMutuallyExclusiveYantra(sympathyVariants.map((v) => v.name), null)}
                                        />
                                        {renderSingle("Runes", "Runes", 2)}
                                        <YantraRatingPicker
                                            groupLabel="Sacrament"
                                            variants={sacramentVariants}
                                            testIdPrefix="yantra-sacrament"
                                            current={sacramentCurrent}
                                            isOn={!!sacramentCurrent}
                                            disabled={!sacramentCurrent && slotsFull}
                                            blockUncheck={false}
                                            onPickVariant={(name) => setMutuallyExclusiveYantra(sacramentVariants.map((v) => v.name), name)}
                                            onClear={() => setMutuallyExclusiveYantra(sacramentVariants.map((v) => v.name), null)}
                                        />
                                        {renderSingle("Persona", "Persona", 2)}
                                        {renderSingle("Environment", "Environment", 1)}
                                        {renderSingle("Demesne/Verge", "Demesne/Verge", 2)}
                                    </div>
                                    {/* Right Column */}
                                    <div className="space-y-0.5">
                                        {renderSingle("Dedicated Tool", "Dedicated Tool", 1)}
                                        {renderSingle("Order Tool", "Order Tool", 1)}
                                        {renderSingle("Path Tool: Coin", "Path Tool: Coin", 1)}
                                        {renderSingle("Path Tool: Cup", "Path Tool: Cup", 1)}
                                        {renderSingle("Path Tool: Mirror", "Path Tool: Mirror", 1)}
                                        {renderSingle("Path Tool: Rod", "Path Tool: Rod", 1)}
                                        {renderSingle("Path Tool: Weapon", "Path Tool: Weapon", 1)}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Dice Pool Display */}
                    <div className="p-3 bg-violet-900/20 border border-violet-500/30 rounded">
                        <p className="text-xs text-zinc-500 uppercase mb-1">Spellcasting Dice Pool</p>
                        <p className="text-base font-mono text-violet-300">
                            Gnosis ({gnosis}) + {combinedSpellCount > 0 ? "Lowest Arcanum" : arcanum} ({baseArcanumDots})
                            {yantraBonus > 0 && <span className="text-teal-400"> + Yantras ({yantraBonus}{yantraBonusWasCapped ? ` / raw ${rawYantraBonus}` : ""})</span>}
                            {ritualBonus > 0 && <span className="text-teal-400"> + Ritual ({ritualBonus})</span>}
                            {combinedSpellPenalty !== 0 && <span className="text-red-400"> {combinedSpellPenalty}</span>}
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
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 text-zinc-400"
                                                    onClick={() => setPreviousParadoxRolls((current) => Math.max(0, current - 1))}
                                                    disabled={scenePreviousParadoxRolls <= 0}
                                                    data-testid="prev-paradox-decrease"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>

                                                <span className="font-mono text-red-400 w-4 text-center">
                                                    {scenePreviousParadoxRolls}
                                                </span>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 text-zinc-400"
                                                    onClick={() => setPreviousParadoxRolls((current) => current + 1)}
                                                    data-testid="prev-paradox-increase"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-5 px-2 text-[10px] text-zinc-500 hover:text-zinc-200"
                                                    onClick={resetPreviousParadoxRolls}
                                                    disabled={scenePreviousParadoxRolls <= 0}
                                                    data-testid="prev-paradox-reset"
                                                >
                                                    Reset
                                                </Button>

                                                {scenePreviousParadoxRolls > 0 && (
                                                    <span className="text-red-400 font-mono">+{scenePreviousParadoxRolls}</span>
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
                        {additionalMana > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Additional Mana:</span>
                                <span className="font-mono text-violet-400">{additionalMana}</span>
                            </div>
                        )}
                        {effectiveWithstand > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Effective Potency:</span>
                                <span className={`font-mono ${effectivePotency > 0 ? "text-teal-400" : "text-red-400"}`}>
                                    {effectivePotency}/{basePotency}
                                </span>
                            </div>
                        )}
                        {ritualBonus > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Ritual bonus:</span>
                                <span className="font-mono text-teal-400">+{ritualBonus} dice</span>
                            </div>
                        )}
                        {combinedSpellCount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Combined Spell:</span>
                                <span className="font-mono text-red-400">{combinedSpellPenalty} dice</span>
                            </div>
                        )}
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
                            !effectivePrimaryFactor ||
                            totalManaCost > currentMana ||
                            (!lastingDuration && factors.duration.advanced && !spellName.trim()) ||
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
