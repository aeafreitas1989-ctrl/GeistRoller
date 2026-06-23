import { useState, useEffect, useMemo } from "react";
import { X, Minus, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GNOSIS_TABLE, YANTRAS } from "@/data/character-data";
import { YantrasGrid } from "./spellcasting/YantrasGrid";
import { PrimaryFactorOverride } from "./spellcasting/PrimaryFactorOverride";
import { FactorRow } from "./spellcasting/FactorRow";
import { ParadoxSection } from "./spellcasting/ParadoxSection";
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
    defaultSpellName = "",
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
            setSpellName(defaultSpellName || "");
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
    }, [isOpen, arcanum, initialPractice, defaultPrimaryFactor, gnosis, effectiveSpellType, roteSkillDots, defaultSpellName]);

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

    // Advanced (Instant) Casting Time additional time, by yantra.
    //   - The first yantra used on a casting does NOT add a turn (it is "free").
    //   - High Speech is exempt from the free rule and always adds 1 turn,
    //     even if it is the only yantra used.
    //   - Runes adds the mage's ritual interval (e.g. "1 hour" at Gnosis 3)
    //     in addition to any turns.
    //   - Rote Mudra counts as a non-HS, non-Runes yantra.
    const hasHighSpeechYantra = selectedYantraNames.includes("High Speech");
    const hasRunesYantra = selectedYantraNames.includes("Runes");
    const nonHsYantraCount = yantraCount - (hasHighSpeechYantra ? 1 : 0);
    const nonHsTurns = Math.max(0, nonHsYantraCount - 1);

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
                // Base Instant casting always takes 1 turn. Each yantra after the
                // first adds 1 turn; High Speech is exempt from the "first free"
                // rule and always adds 1 extra turn.
                const totalTurns = 1 + nonHsTurns + (hasHighSpeechYantra ? 1 : 0);
                const turnsLabel = `Instant (${totalTurns} turn${totalTurns === 1 ? "" : "s"})`;
                if (hasRunesYantra) {
                    return `${turnsLabel} + ${gnosisData.ritualInterval}`;
                }
                return turnsLabel;
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

        const spellNameTrimmed = spellName.trim();

        const spellSummary = [
            spellReachSummary,
            ...(reachBreakdownLine ? [reachBreakdownLine] : []),
            ...(spentSpellManaSummary ? [spentSpellManaSummary] : []),
            ...(selectedYantrasSummary ? [selectedYantrasSummary] : []),
            ...(ritualSummary ? [ritualSummary] : []),
            ...(combinedSpellSummary ? [combinedSpellSummary] : []),
            ...(withstandSummary ? [withstandSummary] : []),
            factorSummary,
        ].join("\n");

        const baseCastLabel = `${arcanum} ${effectiveSpellType === "praxis" ? "Praxis" : effectiveSpellType === "rote" ? "Rote" : "Spell"} (${selectedPractice})`;
        const defaultSpellNameTrimmed = (defaultSpellName || "").trim();
        const castLabel = spellNameTrimmed || defaultSpellNameTrimmed || baseCastLabel;

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

    // Helper to render a factor row using the FactorRow component
    const renderFactorRow = (factorName, label, hasLevels) => {
        const f = factors[factorName];
        const hasPrimary = factorName === "potency" || factorName === "duration" || factorName === "scale";
        const isSelectedPrimary = hasPrimary && primaryFactor === factorName;
        const isEffectivePrimary = hasPrimary && effectivePrimaryFactor === factorName;
        const freeLevelsFromPrimary = isEffectivePrimary ? primaryFreeLevels : 0;
        const displayedLevel = factorName === "duration" ? getDisplayedDurationLevel() : f.level;
        const description = getFactorDescription(factorName);

        const paidLevels = hasLevels
            ? Math.max(0, f.level - 1 - freeLevelsFromPrimary)
            : 0;

        const isDuration = factorName === "duration";
        const isRange = factorName === "range";

        const canTogglePrimary = !(
            isSelectedPrimary ||
            (factorName === "scale" && !overridePrimaryFactor) ||
            (defaultPrimaryFactor && !overridePrimaryFactor)
        );

        const standardOrAdvancedDisabled =
            (isRange && specialRangeMode !== "none") || (isDuration && lastingDuration);

        return (
            <FactorRow
                key={factorName}
                factorName={factorName}
                label={label}
                hasLevels={hasLevels}
                factor={f}
                displayedLevel={displayedLevel}
                description={description}
                paidLevels={paidLevels}
                freeLevelsFromPrimary={freeLevelsFromPrimary}
                isSelectedPrimary={isSelectedPrimary}
                isEffectivePrimary={isEffectivePrimary}
                hasPrimary={hasPrimary}
                canTogglePrimary={canTogglePrimary}
                onSelectPrimary={setPrimaryFactor}
                overridePrimaryFactor={overridePrimaryFactor}
                onToggleStandard={() => {
                    if (isDuration) setLastingDuration(false);
                    updateFactor(factorName, { advanced: false, ...(hasLevels ? { level: 1 } : {}) });
                }}
                onToggleAdvanced={() => {
                    if (isDuration) setLastingDuration(false);
                    updateFactor(factorName, { advanced: true, ...(hasLevels ? { level: 1 } : {}) });
                }}
                onDecreaseLevel={() => updateFactor(factorName, { level: Math.max(1, f.level - 1) })}
                onIncreaseLevel={() => updateFactor(factorName, { level: Math.min(getMaxLevel(factorName, f.advanced), f.level + 1) })}
                canDecreaseLevel={f.level > 1}
                canIncreaseLevel={f.level < getMaxLevel(factorName, f.advanced)}
                standardDisabled={standardOrAdvancedDisabled}
                advancedDisabled={standardOrAdvancedDisabled}
                levelDisabled={isDuration && lastingDuration}
                ritualCastingBonus={ritualCastingBonus}
                onDecreaseRitualBonus={() => setRitualCastingBonus(Math.max(0, ritualCastingBonus - 1))}
                onIncreaseRitualBonus={() => setRitualCastingBonus(Math.min(5, ritualCastingBonus + 1))}
                canDecreaseRitualBonus={ritualCastingBonus > 0}
                canIncreaseRitualBonus={ritualCastingBonus < 5}
                lastingDuration={lastingDuration}
                onToggleLasting={() => {
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
                canUseFateDuration={canUseFateDuration}
                fateDurationBonus={fateDurationBonus}
                onSetFateDurationBonus={setFateDurationBonus}
                canUseMatterDurationMana={canUseMatterDurationMana}
                matterDurationMana={matterDurationMana}
                onToggleMatterDurationMana={() => setMatterDurationMana((prev) => !prev)}
                arcanum={arcanum}
                canUseSpaceSympathetic={canUseSpaceSympathetic}
                canUseTimeSympathetic={canUseTimeSympathetic}
                specialRangeMode={specialRangeMode}
                onActivateSpecialRange={activateSpecialRange}
                sympatheticWithstand={sympatheticWithstand}
                onDecreaseSympatheticWithstand={() => setSympatheticWithstand(Math.max(0, sympatheticWithstand - 1))}
                onIncreaseSympatheticWithstand={() => setSympatheticWithstand(Math.min(5, sympatheticWithstand + 1))}
            />
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
                    <PrimaryFactorOverride
                        selectedPractice={selectedPractice}
                        overridePrimaryFactor={overridePrimaryFactor}
                        setOverridePrimaryFactor={setOverridePrimaryFactor}
                        primaryFactor={primaryFactor}
                        setPrimaryFactor={setPrimaryFactor}
                        defaultPrimaryFactor={defaultPrimaryFactor}
                    />

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
                    <YantrasGrid
                        yantraCount={yantraCount}
                        maxYantras={maxYantras}
                        yantraSlotLimit={yantraSlotLimit}
                        yantraBonus={yantraBonus}
                        rawYantraBonus={rawYantraBonus}
                        yantraBonusWasCapped={yantraBonusWasCapped}
                        usesRoteMudra={usesRoteMudra}
                        roteMudraBonus={roteMudraBonus}
                        selectedNameSet={selectedNameSet}
                        specialRangeMode={specialRangeMode}
                        toggleYantraName={toggleYantraName}
                        setMutuallyExclusiveYantra={setMutuallyExclusiveYantra}
                    />

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
                    <ParadoxSection
                        selectedPractice={selectedPractice}
                        paradoxTriggered={paradoxTriggered}
                        reachBeyondFree={reachBeyondFree}
                        paradoxDiePerReach={paradoxDiePerReach}
                        gnosis={gnosis}
                        baseParadoxDice={baseParadoxDice}
                        paradoxInured={paradoxInured}
                        setParadoxInured={setParadoxInured}
                        sleeperWitnesses={sleeperWitnesses}
                        setSleeperWitnesses={setSleeperWitnesses}
                        hasDedicatedTool={hasDedicatedTool}
                        scenePreviousParadoxRolls={scenePreviousParadoxRolls}
                        onPrevParadoxIncrease={() => setPreviousParadoxRolls((current) => current + 1)}
                        onPrevParadoxDecrease={() => setPreviousParadoxRolls((current) => Math.max(0, current - 1))}
                        onPrevParadoxReset={resetPreviousParadoxRolls}
                        paradoxAfterModifiers={paradoxAfterModifiers}
                        paradoxModifiers={paradoxModifiers}
                        maxManaMitigation={maxManaMitigation}
                        manaMitigation={manaMitigation}
                        setManaMitigation={setManaMitigation}
                        actualManaMitigation={actualManaMitigation}
                        paradoxIsChanceDie={paradoxIsChanceDie}
                        finalParadoxPool={finalParadoxPool}
                        paradoxRollQuality={paradoxRollQuality}
                        paradoxMode={paradoxMode}
                        setParadoxMode={setParadoxMode}
                    />

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
