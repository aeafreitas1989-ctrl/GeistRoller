import { useState, useMemo, useEffect } from "react";
import { Pencil, X, Plus, Info, Flame, Skull, Droplets, Wind, Bug, Mountain, Sparkles, Ghost, Zap, ChevronDown, ChevronRight, ChevronUp, ChevronLeft, Star, BookOpen, CalendarDays, Clock3, Cloud, Thermometer, Leaf, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
    CONDITION_DEFINITIONS, HAUNT_DEFINITIONS, KEY_DEFINITIONS, KEY_NAMES,
    MERIT_DEFINITIONS, MERIT_CATEGORIES, MERIT_CATEGORY_COLORS,
    CEREMONY_DEFINITIONS, CardTypeColors,
    PERSON_TYPE_OPTIONS, PERSON_SUBTYPE_OPTIONS,
    PLACE_STATUS_OPTIONS, PERSON_STATUS_OPTIONS, PERSON_RELATIONSHIP_OPTIONS,
} from "../data/cards-data";

import { ARCANA, PATH_ARCANA } from "../data/character-data";

import {
    MeritCard, CeremonyCard, PlacePersonCard, ConditionCard, HauntCard, KeyCard, ActiveSpellCard, CombatTrackerCard,
} from "./cards/CardComponents";

const DEFAULT_SCENE_TRACKER = {
    date: "",
    time: "",
    temperature: "15",
    cloud_cover: "clear",
    precipitation: "dry",
    intensity: "none",
    wind: "calm",
};

const CLOUD_COVER_OPTIONS = [
    { value: "clear", label: "☀ Clear" },
    { value: "partial", label: "⛅ Partial" },
    { value: "overcast", label: "☁ Overcast" },
    { value: "stormfront", label: "⛈ Stormfront" },
    { value: "fog", label: "🌫 Fog" },
];

const PRECIPITATION_OPTIONS = [
    { value: "dry", label: "∅ Dry" },
    { value: "drizzle", label: "💧 Drizzle" },
    { value: "rain", label: "🌧 Rain" },
    { value: "snow", label: "❄ Snow" },
    { value: "hail", label: "🧊 Hail" },
];

const INTENSITY_OPTIONS = [
    { value: "none", label: "– None" },
    { value: "light", label: "• Light" },
    { value: "moderate", label: "•• Moderate" },
    { value: "heavy", label: "••• Heavy" },
    { value: "violent", label: "‼ Violent" },
];

const WIND_OPTIONS = [
    { value: "calm", label: "≋ Calm" },
    { value: "light", label: "➝ Light" },
    { value: "moderate", label: "➝➝ Moderate" },
    { value: "strong", label: "➝➝➝ Strong" },
    { value: "gale", label: "🌀 Gale" },
];

const getTemperatureValue = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 15;
};

const getSeasonFromDate = (dateString) => {
    if (!dateString) return "—";

    const [, monthString] = dateString.split("-");
    const month = Number(monthString);

    if ([12, 1, 2].includes(month)) return "❄ Winter";
    if ([3, 4, 5].includes(month)) return "🌱 Spring";
    if ([6, 7, 8].includes(month)) return "☀ Summer";
    return "🍂 Autumn";
};

const getSeasonColorClass = (dateString) => {
    if (!dateString) return "border-zinc-800 bg-zinc-900/50 text-zinc-200";

    const [, monthString] = dateString.split("-");
    const month = Number(monthString);

    if ([12, 1, 2].includes(month)) return "border-blue-400/40 bg-blue-950/70 text-blue-300";
    if ([3, 4, 5].includes(month)) return "border-green-400/40 bg-green-950/50 text-green-300";
    if ([6, 7, 8].includes(month)) return "border-yellow-400/50 bg-yellow-950/60 text-yellow-300";
    return "border-red-400/40 bg-red-950/50 text-red-300";
};

const getTemperatureCondition = (temp) => {
    if (temp < 0) return "Freezing";
    if (temp <= 9) return "Cold";
    if (temp <= 14) return "Cool";
    if (temp <= 19) return "Mild";
    if (temp <= 29) return "Warm";
    if (temp <= 39) return "Hot";
    return "Harsh";
};

const getTemperatureColorClass = (temp) => {
    if (temp < 0) return "border-blue-400/40 bg-blue-950/90 text-blue-300";
    if (temp <= 9) return "border-cyan-400/40 bg-cyan-950/70 text-cyan-300";
    if (temp <= 14) return "border-teal-400/40 bg-teal-950/50 text-teal-300";
    if (temp <= 19) return "border-green-400/40 bg-green-950/50 text-green-300";
    if (temp <= 29) return "border-yellow-400/40 bg-yellow-950/50 text-yellow-300";
    if (temp <= 39) return "border-orange-400/50 bg-orange-950/70 text-orange-300";
    return "border-red-600 bg-red-950/90 text-red-500";
};

const getTemperatureIconClass = (temp) => {
    if (temp < 0) return "text-cyan-300";
    if (temp <= 9) return "text-blue-300";
    if (temp <= 14) return "text-teal-300";
    if (temp <= 19) return "text-green-300";
    if (temp <= 29) return "text-yellow-300";
    if (temp <= 39) return "text-orange-300";
    return "text-red-300";
};

const MAGE_SIGHT_DESCRIPTIONS = {
    Death: "Death Sight reveals the Anchor Condition, manifested ghosts, and related deathly phenomena. At a glance, the mage can tell whether a person has a soul and whether a body is truly dead.",
    Fate: "Fate Sight reveals when someone experiences a dramatic failure or exceptional success. It also reveals the presence and use of a Destiny, but not the details of that Destiny.",
    Forces: "Forces Sight reveals motion, environmental Tilts, fire, electricity, and other physical hazards. It also allows the mage to tell at a glance whether a device is powered.",
    Life: "Life Sight reveals signs of life and allows the mage to tell at a glance whether a body is alive and how badly a living being is injured. Toxins, diseases, and Personal Tilts are also apparent.",
    Matter: "Matter Sight reveals the Structure and Durability of an object, along with its value and quality.",
    Mind: "Mind Sight reveals the presence of thinking beings and allows the mage to tell at a glance whether someone is asleep, comatose, awake, meditating, or projecting into the Astral. It also reveals when an observed being gains or spends Willpower.",
    Prime: "Prime Sight reveals anything the mage can use as a Yantra, as well as the presence of Awakened spells and Attainment effects. It also allows the mage to recognize tass and determine when they are within a Hallow or Node.",
    Space: "Space Sight reveals distances, range bands, and cover, allowing the mage to judge situational bonuses and penalties before acting. It also reveals spatial distortions, scrying windows, and Irises.",
    Spirit: "Spirit Sight reveals the strength of the local Gauntlet, the presence and nature of the Resonance Condition, other sources of Essence, and manifested spirits and related phenomena.",
    Time: "Time Sight reveals subtle temporal changes, allowing the mage to know the Initiative of all combatants. It also reveals when someone is about to act, even reflexively, and detects temporal distortions and signs of travel into the past.",
};

const WEATHER_CONDITION_ORIGIN = "Weather";

const buildWeatherConditions = (tracker) => {
    const temp = getTemperatureValue(tracker.temperature);
    const precipitation = tracker.precipitation || "dry";
    const intensity = tracker.intensity || "none";
    const wind = tracker.wind || "calm";

    const conditions = [];

    if (temp < 0) {
        conditions.push({
            name: "Extreme Cold",
            type: "tilt",
            description: "Sub-zero weather exposure.",
            resolution: "Leave the weather, gain shelter, or wait for conditions to improve.",
            origin: WEATHER_CONDITION_ORIGIN,
            weather_auto: true,
        });
    }

    if (temp > 40) {
        conditions.push({
            name: "Extreme Heat",
            type: "tilt",
            description: "Dangerous heat exposure.",
            resolution: "Leave the weather, gain shelter, cool down, or wait for conditions to improve.",
            origin: WEATHER_CONDITION_ORIGIN,
            weather_auto: true,
        });
    }

    if (precipitation === "rain" && intensity === "heavy") {
        conditions.push({
            name: "Heavy Rain",
            type: "tilt",
            description: "Visibility and movement are impaired by heavy rainfall.",
            resolution: "Leave the weather, gain shelter, or wait for conditions to improve.",
            origin: WEATHER_CONDITION_ORIGIN,
            weather_auto: true,
        });
    }

    if (precipitation === "rain" && intensity === "violent") {
        conditions.push({
            name: "Heavy Rain",
            type: "tilt",
            description: "Visibility and movement are impaired by violent rainfall.",
            resolution: "Leave the weather, gain shelter, or wait for conditions to improve.",
            origin: WEATHER_CONDITION_ORIGIN,
            weather_auto: true,
        });

        conditions.push({
            name: "Flooded",
            type: "tilt",
            description: "Water has begun to flood the area and interfere with movement.",
            resolution: "Leave the flooded area or wait for the water to recede.",
            origin: WEATHER_CONDITION_ORIGIN,
            weather_auto: true,
        });
    }

    if (precipitation === "snow" && (intensity === "heavy" || intensity === "violent")) {
        conditions.push({
            name: "Blizzard",
            type: "tilt",
            description: "Snow and wind severely reduce visibility and mobility.",
            resolution: "Leave the weather, gain shelter, or wait for conditions to improve.",
            origin: WEATHER_CONDITION_ORIGIN,
            weather_auto: true,
        });
    }

    if (wind === "strong" || wind === "gale") {
        conditions.push({
            name: "Heavy Winds",
            type: "tilt",
            description: "Strong winds interfere with movement, perception, and exposed actions.",
            resolution: "Leave the weather, gain shelter, or wait for conditions to improve.",
            origin: WEATHER_CONDITION_ORIGIN,
            weather_auto: true,
        });
    }

    return conditions;
};

const MageSightCard = ({
    activeCharacter,
    activeMageSight,
    onUpdateCharacter,
    onTriggerDiceRoll,
}) => {
    const currentPath = activeCharacter?.path;
    const rulingArcana = currentPath ? (PATH_ARCANA[currentPath]?.ruling || []) : [];
    const currentMana = activeCharacter?.mana || 0;
    const currentWillpower = activeCharacter?.willpower || 0;
    const activeSpells = activeCharacter?.active_spells || [];

    const activeArcana = activeMageSight
        ? (activeMageSight.arcanum || "")
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean)
        : rulingArcana;

    const availableExtraArcana = ARCANA.filter((arcanum) => {
        const dots = activeCharacter?.arcana?.[arcanum] || 0;
        return dots >= 1 && !activeArcana.includes(arcanum);
    });

    const [selectedArcanum, setSelectedArcanum] = useState(activeArcana[0] || "Death");
    const [opacity, setOpacity] = useState("0");
    const [target, setTarget] = useState("");
    const [obsessionApplies, setObsessionApplies] = useState(false);
    const [scrutinyActive, setScrutinyActive] = useState(false);
    const [scrutinySuccesses, setScrutinySuccesses] = useState(0);

    useEffect(() => {
        if (!activeArcana.includes(selectedArcanum) && activeArcana.length > 0) {
            setSelectedArcanum(activeArcana[0]);
        }
    }, [activeArcana, selectedArcanum]);

    const buildMageSightEffect = (nextArcana) => {
        const extraArcana = nextArcana.filter((name) => !rulingArcana.includes(name));
        const plusLabel = extraArcana.length > 0 ? ` + ${extraArcana.join(" + ")}` : "";

        return {
            id: activeMageSight?.id || Date.now(),
            kind: "effect",
            effect_key: "mage-sight",
            name: `Mage Sight: ${currentPath}${plusLabel}`,
            arcanum: nextArcana.join(", "),
            practice: "Mage Sight",
            subtitle: `${currentPath} • ${nextArcana.join(", ")}`,
            description: nextArcana
                .map((name) => `${name}: ${MAGE_SIGHT_DESCRIPTIONS[name]}`)
                .join("\n"),
            extra_arcana: extraArcana,
        };
    };

    const activateMageSight = async () => {
        if (!currentPath || rulingArcana.length === 0) return;

        await onUpdateCharacter?.({
            active_spells: [
                ...activeSpells.filter((spell) => spell.effect_key !== "mage-sight"),
                buildMageSightEffect(rulingArcana),
            ],
        });
    };

    const addArcanumToMageSight = async (arcanum) => {
        if (currentMana < 1) return;

        const nextArcana = [...new Set([...activeArcana, arcanum])];

        await onUpdateCharacter?.({
            mana: Math.max(0, currentMana - 1),
            active_spells: [
                ...activeSpells.filter((spell) => spell.effect_key !== "mage-sight"),
                buildMageSightEffect(nextArcana),
            ],
        });
    };

    const rollMageSight = async (mode) => {
        const gnosis = activeCharacter?.gnosis || 1;
        const arcanumDots = activeCharacter?.arcana?.[selectedArcanum] || 0;
        const opacityValue = Number.parseInt(opacity || "0", 10) || 0;
        const obsessionBonus = mode === "Scrutiny" && obsessionApplies ? 1 : 0;

        if (mode === "Scrutiny" && !scrutinyActive && currentWillpower < 1) return;

        if (mode === "Scrutiny" && !scrutinyActive) {
            await onUpdateCharacter?.({
                willpower: Math.max(0, currentWillpower - 1),
            });
            setScrutinyActive(true);
            setScrutinySuccesses(0);
        }

        const rawPool =
            mode === "Revelation"
                ? gnosis + arcanumDots - opacityValue
                : gnosis + arcanumDots + obsessionBonus;

        const chance = rawPool < 1;
        const pool = chance ? 1 : rawPool;
        const targetLine = target.trim() ? `Target: ${target.trim()}` : "Target: unspecified";

        onTriggerDiceRoll?.({
            pool,
            chance,
            again: 10,
            rote: false,
            exceptional_target: 5,
            label: `Mage Sight — ${mode} (${selectedArcanum})`,
            dicePoolBreakdown:
                mode === "Revelation"
                    ? `Gnosis ${gnosis} + ${selectedArcanum} ${arcanumDots} - Opacity ${opacityValue}`
                    : `Gnosis ${gnosis} + ${selectedArcanum} ${arcanumDots}${obsessionBonus ? " + Obsession 1" : ""}`,
            spellSummary:
                mode === "Scrutiny"
                    ? `${targetLine}\nFocused Mage Sight${!scrutinyActive ? "; costs 1 Willpower to begin" : " (ongoing)"}. Opacity: ${opacityValue}. Successes: ${scrutinySuccesses}.`
                    : `${targetLine}\nActive Mage Sight Revelation. Opacity: ${opacityValue}.`,
            onResult: mode === "Scrutiny" ? (result) => {
                const rolled = result?.successes || 0;
                if (rolled > 0) {
                    setScrutinySuccesses((prev) => {
                        const updated = prev + rolled;
                        const currentOpacity = Number.parseInt(opacity || "0", 10) || 0;
                        if (currentOpacity > 0 && updated >= currentOpacity) {
                            setOpacity(String(currentOpacity - 1));
                            return 0;
                        }
                        return updated;
                    });
                }
            } : undefined,
        });
    };

    const addScrutinyManaSuccess = async () => {
        if (currentMana < 1) return;
        const opacityValue = Number.parseInt(opacity || "0", 10) || 0;
        const newSuccesses = scrutinySuccesses + 1;

        await onUpdateCharacter?.({ mana: Math.max(0, currentMana - 1) });

        if (opacityValue > 0 && newSuccesses >= opacityValue) {
            const newOpacity = opacityValue - 1;
            setOpacity(String(newOpacity));
            setScrutinySuccesses(0);
        } else {
            setScrutinySuccesses(newSuccesses);
        }
    };

    const endScrutiny = () => {
        setScrutinyActive(false);
        setScrutinySuccesses(0);
    };

    return (
        <div className="bg-zinc-950 border border-blue-500/30 rounded-md p-3 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h4 className="text-sm font-medium text-blue-300">
                        Mage Sight{currentPath ? `: ${currentPath}` : ""}
                    </h4>
                    <p className="text-xs text-zinc-400">
                        {activeMageSight
                            ? activeArcana.join(", ")
                            : rulingArcana.length > 0
                                ? `${rulingArcana.join(", ")} available`
                                : "No Path selected"}
                    </p>
                </div>

                {!activeMageSight && (
                    <Button
                        type="button"
                        size="sm"
                        className="h-7 px-2 text-[10px] btn-secondary"
                        onClick={activateMageSight}
                        disabled={!currentPath || rulingArcana.length === 0}
                    >
                        Activate
                    </Button>
                )}
            </div>

            {activeMageSight?.description && (
                <div className="rounded-sm bg-zinc-900/40 border border-zinc-800 p-2">
                    <p className="text-xs text-zinc-300 whitespace-pre-line">
                        {activeMageSight.description}
                    </p>
                </div>
            )}

            {activeMageSight && availableExtraArcana.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {availableExtraArcana.map((arcanum) => (
                        <Button
                            key={arcanum}
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-[10px] text-blue-300 border border-zinc-700 hover:bg-blue-950/30"
                            onClick={() => addArcanumToMageSight(arcanum)}
                            disabled={currentMana < 1}
                        >
                            + {arcanum}
                        </Button>
                    ))}
                </div>
            )}

            {activeMageSight && (
                <div className="space-y-2 border-t border-zinc-800 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                Arcanum
                            </label>
                            <Select value={selectedArcanum} onValueChange={setSelectedArcanum}>
                                <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-800 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    {activeArcana.map((arcanum) => (
                                        <SelectItem key={arcanum} value={arcanum} className="text-xs">
                                            {arcanum}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                Opacity
                            </label>
                            <Input
                                value={opacity}
                                onChange={(e) => setOpacity(e.target.value)}
                                className="input-geist h-7 text-xs"
                                type="number"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                Target
                            </label>
                            <Input
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="input-geist h-7 text-xs"
                                placeholder="Object, person, room"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-zinc-400">
                        <input
                            type="checkbox"
                            checked={obsessionApplies}
                            onChange={(e) => setObsessionApplies(e.target.checked)}
                        />
                        Obsession applies to Scrutiny
                    </label>

                    <div className="flex flex-wrap gap-1">
                        <Button
                            type="button"
                            size="sm"
                            className="h-7 px-2 text-xs btn-secondary"
                            onClick={() => rollMageSight("Revelation")}
                        >
                            Revelation
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            className={`h-7 px-2 text-xs ${scrutinyActive ? "bg-amber-600/40 border-amber-500 text-amber-200 hover:bg-amber-600/60" : "btn-secondary"}`}
                            onClick={() => rollMageSight("Scrutiny")}
                            disabled={!scrutinyActive && currentWillpower < 1}
                            data-testid="scrutiny-btn"
                        >
                            Scrutiny{scrutinyActive ? " (Active)" : ""}
                        </Button>

                        {scrutinyActive && (
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs text-zinc-400 hover:text-rose-400"
                                onClick={endScrutiny}
                                data-testid="end-scrutiny-btn"
                            >
                                End Scrutiny
                            </Button>
                        )}
                    </div>

                    {scrutinyActive && (
                        <div className="p-2 rounded-sm bg-amber-950/30 border border-amber-500/30 space-y-2" data-testid="scrutiny-tracker">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-amber-400 uppercase tracking-wider">Scrutiny Tracker</span>
                                <span className="text-[10px] text-zinc-500">
                                    Opacity: <span className="text-amber-300 font-mono">{Number.parseInt(opacity || "0", 10) || 0}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-zinc-400">Successes:</span>
                                    <span className="text-sm font-mono text-amber-300 font-medium" data-testid="scrutiny-successes">{scrutinySuccesses}</span>
                                    <span className="text-xs text-zinc-600">/ {Number.parseInt(opacity || "0", 10) || 0}</span>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    className="h-6 px-2 text-[10px] bg-violet-900/40 border border-violet-500/40 text-violet-300 hover:bg-violet-800/50"
                                    onClick={addScrutinyManaSuccess}
                                    disabled={currentMana < 1}
                                    data-testid="scrutiny-mana-btn"
                                >
                                    +1 Success (1 Mana)
                                </Button>
                            </div>
                            {(Number.parseInt(opacity || "0", 10) || 0) === 0 && (
                                <p className="text-[10px] text-emerald-400">Opacity is 0 — mystery fully unveiled.</p>
                            )}
                        </div>
                    )}

                    {!scrutinyActive && currentWillpower < 1 && (
                        <p className="text-[10px] text-rose-400">
                            Scrutiny requires 1 Willpower.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export const GameCardsPanel = ({ 
    activeCharacter,
    activeConditions = [], 
    haunts = {},
    keys = [],
    onAddCondition,
    onRemoveCondition,
    onResolveCondition,
    onUpdateCondition,
    onUpdateHaunt,
    onToggleKey,
    onUpdatePlacesPeople,
    onDispelActiveSpell,
    onRelinquishActiveSpell,
    onRelinquishActiveSpellSafely,
    onGenerateCaseTruth,
    onTriggerDiceRoll,
    onApplyIncomingDamage,
    onUpdateCharacter,
    healthBoxes,
    maxHealth,
    filledHealth,
    isDeadTrack,
    woundPenalty,
    onHealHealthState,
    onPatternRestoration,
    patternRestorationDisabled,
    onEndTurn,
    onSleep,
}) => {
    const [showAddCondition, setShowAddCondition] = useState(false);
    const [customConditionName, setCustomConditionName] = useState("");
    const [customConditionDesc, setCustomConditionDesc] = useState("");
    const [conditionOrigin, setConditionOrigin] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddPlacePerson, setShowAddPlacePerson] = useState(false);
    const [newPlaceName, setNewPlaceName] = useState("");
    const [newPlaceType, setNewPlaceType] = useState("place");
    const [newPlaceDescription, setNewPlaceDescription] = useState("");
    const [newPlaceStatus, setNewPlaceStatus] = useState("");
    const [newPlaceRelationship, setNewPlaceRelationship] = useState("");
    const [newPersonType, setNewPersonType] = useState("Mundane");
    const [newPersonSubtype, setNewPersonSubtype] = useState("Aware");
    const [openSections, setOpenSections] = useState({
        sessionSummary: false,
        caseTruth: false,
        conditions: false,
        haunts: false,
        keys: false,
        ceremonies: false,
        activeSpells: false,
        merits: false,
        places: false,
        combat: false,
    });
    const [showCeremonyRollDialog, setShowCeremonyRollDialog] = useState(false);
    const [selectedCeremony, setSelectedCeremony] = useState(null);
    const [ceremonyRollResult, setCeremonyRollResult] = useState(null);
    const [rollingCeremony, setRollingCeremony] = useState(false);
    const [caseFileDraft, setCaseFileDraft] = useState("");
    const [sceneTracker, setSceneTracker] = useState(DEFAULT_SCENE_TRACKER);

    useEffect(() => {
        setCaseFileDraft(activeCharacter?.case_truth || "");
    }, [activeCharacter?.id, activeCharacter?.case_truth]);

    useEffect(() => {
        setSceneTracker({
            ...DEFAULT_SCENE_TRACKER,
            ...(activeCharacter?.scene_tracker || {}),
        });
    }, [activeCharacter?.id, activeCharacter?.scene_tracker]);

    const handleCeremonyActivate = async (name, ceremony) => {
    setSelectedCeremony({ name, ...ceremony });
    setCeremonyRollResult(null);
    setShowCeremonyRollDialog(true);

    try {
        setRollingCeremony(true);

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/roll-dice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dice_pool: ceremony.dicePool,
                title: name,
            }),
        });

        const data = await response.json();
        setCeremonyRollResult(data);

    } catch (error) {
        console.error("Ceremony roll failed:", error);
    } finally {
        setRollingCeremony(false);
    }
};

    const filteredConditions = Object.keys(CONDITION_DEFINITIONS).filter(
        (name) => name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddPredefinedCondition = (name) => {
        const condition = CONDITION_DEFINITIONS[name];
        const originOverride = conditionOrigin.trim();
        const fallbackOrigin = condition.origin || (condition.type === "tilt" ? "Tilt" : condition.type === "geist" ? "Geist" : "Condition");

        onAddCondition({
            name,
            type: condition.type,
            description: condition.description,
            resolution: condition.resolution,
            origin: originOverride || fallbackOrigin,
        });

        setShowAddCondition(false);
        setSearchTerm("");
        setConditionOrigin("");
    };

    const handleAddCustomCondition = () => {
        if (customConditionName.trim()) {
            onAddCondition({
                name: customConditionName.trim(),
                type: "custom",
                description: customConditionDesc.trim() || "Custom condition",
                resolution: "",
                origin: conditionOrigin.trim() || "Custom",
            });
            setCustomConditionName("");
            setCustomConditionDesc("");
            setShowAddCondition(false);
            setConditionOrigin("");
        }
    };

    const placesPeople = activeCharacter?.places_people || [];
    const sortedPlacesPeople = [...placesPeople].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    const characterType = activeCharacter?.character_type || "geist";
    const isMage = characterType === "mage";
    const activeSpells = [...(activeCharacter?.active_spells || [])].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    const activeMageSight = activeSpells.find((spell) => spell.effect_key === "mage-sight") || null;
    const meritsList = activeCharacter?.merits_list || [];
    const activeConditionNames = new Set((activeCharacter?.conditions || []).map((condition) => (condition?.name || "").toLowerCase()));
    const hasCondition = (name) => activeConditionNames.has(name.toLowerCase());
    const dexterity = activeCharacter?.attributes?.dexterity || 1;
    const wits = activeCharacter?.attributes?.wits || 1;
    const athletics = activeCharacter?.skills?.athletics || 0;
    const composure = activeCharacter?.attributes?.composure || 1;
    const strength = activeCharacter?.attributes?.strength || 1;
    const activeMageArmorName = isMage ? (activeCharacter?.active_mage_armor || null) : null;
    const activeMageArmorDots = activeMageArmorName ? (activeCharacter?.arcana?.[activeMageArmorName] || 0) : 0;
    const mageArmorDefenseBonus = (() => {
        if (!activeMageArmorName) return 0;
        if (["Fate", "Mind", "Space", "Time"].includes(activeMageArmorName)) return activeMageArmorDots;
        if (activeMageArmorName === "Life") return Math.ceil(activeMageArmorDots / 2);
        return 0;
    })();
    const mageArmorGeneralBonus = (() => {
        if (!activeMageArmorName) return 0;
        if (["Forces", "Matter"].includes(activeMageArmorName)) return activeMageArmorDots;
        if (activeMageArmorName === "Life") return Math.ceil(activeMageArmorDots / 2);
        return 0;
    })();
    const equippedArmor = (activeCharacter?.inventory_items || []).find((it) => it?.type === "armor" && !!it?.equipped) || null;
    const armorGeneral = (equippedArmor?.armor?.general ?? 0) + mageArmorGeneralBonus;
    const armorBallistic = equippedArmor?.armor?.ballistic ?? 0;
    const baseDefense = Math.min(dexterity, wits) + athletics + mageArmorDefenseBonus;
    const normalDefense = hasCondition("Blinded") ? Math.max(0, Math.floor(baseDefense / 2)) : baseDefense;
    const initiativeModifier = dexterity + composure;
    const baseSpeed = strength + dexterity + 5;
    const speed = hasCondition("Leg Wrack") ? Math.max(1, Math.floor(baseSpeed / 2)) : baseSpeed;

    // Get character's merits with dots > 0
    const characterMerits = useMemo(() => {
        const merits = activeCharacter?.merits_list || [];
        return merits
            .filter(m => m.dots > 0)
            .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }, [activeCharacter?.merits_list]);

    const handleAddPlacePerson = () => {
        if (!newPlaceName.trim()) return;
        const newEntry = {
            id: Date.now(),
            name: newPlaceName.trim(),
            type: newPlaceType,
            description: newPlaceDescription.trim(),
            status: newPlaceStatus.trim(),
            relationship: newPlaceType === "person" ? newPlaceRelationship : "",
            person_type: newPlaceType === "person" ? newPersonType : "",
            person_subtype: newPlaceType === "person" ? newPersonSubtype : "",
        };
        const updated = [...placesPeople, newEntry].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        onUpdatePlacesPeople(updated);
        setNewPlaceName("");
        setNewPlaceType("place");
        setNewPlaceDescription("");
        setNewPlaceStatus("");
        setNewPlaceRelationship("");
        setNewPersonType("Mundane");
        setNewPersonSubtype("Aware");
        setShowAddPlacePerson(false);
    };

    const handleUpdatePlacePerson = (id, updates) => {
        const updated = placesPeople
            .map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
            .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        onUpdatePlacesPeople(updated);
    };

    const handleDeletePlacePerson = (id) => {
        const updated = placesPeople.filter((entry) => entry.id !== id);
        onUpdatePlacesPeople(updated);
    };

    const toggleSection = (section) => {
        setOpenSections((prev) => {
            const shouldOpen = !prev[section];

            if (!shouldOpen) {
                return { ...prev, [section]: false };
            }

            return Object.fromEntries(
                Object.keys(prev).map((key) => [key, key === section])
            );
        });
    };

    const handleSaveCaseFile = async () => {
        if (!activeCharacter?.id || !onUpdateCharacter) return;

        await onUpdateCharacter({
            case_truth: caseFileDraft,
        });
    };

    const updateSceneTracker = async (updates) => {
        const nextTracker = {
            ...sceneTracker,
            ...updates,
        };

        if (nextTracker.precipitation === "dry") {
            nextTracker.intensity = "none";
        }

        setSceneTracker(nextTracker);

        if (!activeCharacter?.id || !onUpdateCharacter) return;

        const currentConditions = activeCharacter?.conditions || [];
        const preservedConditions = currentConditions.filter((condition) => !condition?.weather_auto);
        const weatherConditions = buildWeatherConditions(nextTracker);

        await onUpdateCharacter({
            scene_tracker: nextTracker,
            conditions: [...preservedConditions, ...weatherConditions],
        });
    };

    const hauntCount = Object.values(haunts).filter((v) => v > 0).length;

    const sceneTemperature = getTemperatureValue(sceneTracker.temperature);

    const sceneSeason = getSeasonFromDate(sceneTracker.date);

    const characterKey = activeCharacter?.innate_key;
    const geistKey = activeCharacter?.geist_innate_key;
    const mementoKeys = (activeCharacter?.mementos || [])
        .map((memento) => memento.key)
        .filter(Boolean);

    const doomedKeySources = useMemo(() => {
        const sources = {};
        const conditions = activeCharacter?.conditions || [];
        conditions.forEach((condition) => {
            const name = condition?.name || "";
            const origin = condition?.origin || "";
            if (name.toLowerCase().startsWith("doomed")) {
                KEY_NAMES.forEach((key) => {
                    if (name.includes(key) || origin.includes(key)) {
                        sources[key] = origin || name;
                    }
                });
            }
        });
        return sources;
    }, [activeCharacter?.conditions]);

    const doomedKeys = new Set(Object.keys(doomedKeySources));

    const availableKeys = Array.from(new Set([
        ...keys,
        characterKey,
        geistKey,
        ...mementoKeys,
    ].filter(Boolean)));

    const keySourceMap = availableKeys.reduce((acc, key) => {
        acc[key] = {
            isCharacterKey: key === characterKey,
            isGeistKey: key === geistKey,
            isMementoKey: mementoKeys.includes(key),
            isManual: keys.includes(key),
            isDoomed: doomedKeys.has(key),
            doomSource: doomedKeySources[key],
        };
        return acc;
    }, {});


    return (
        <div className="h-full flex flex-col" data-testid="game-cards-panel">
            <div className="px-4 py-3 border-b border-zinc-800/50">
                <h2 className="font-heading text-lg text-zinc-200">Cards</h2>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-sm px-3 py-2.5 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3" /> Date
                                </label>
                                <Input
                                    type="date"
                                    value={sceneTracker.date}
                                    onChange={(e) => updateSceneTracker({ date: e.target.value })}
                                    className="input-geist h-8"
                                    data-testid="scene-date-input"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <Clock3 className="w-3 h-3" /> Time
                                </label>
                                <Input
                                    type="time"
                                    value={sceneTracker.time}
                                    onChange={(e) => updateSceneTracker({ time: e.target.value })}
                                    className="input-geist h-8"
                                    data-testid="scene-time-input"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <Leaf className="w-3 h-3" />
                                    Season
                                </label>

                                <div
                                    className={`h-8 rounded-sm border flex items-center justify-center text-xs font-medium ${getSeasonColorClass(sceneTracker.date)}`}
                                    data-testid="scene-season-display"
                                >
                                    {sceneSeason}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <Thermometer className={`w-3 h-3 ${getTemperatureIconClass(sceneTemperature)}`} />
                                    Temp (°C)
                                </label>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-5 text-zinc-400 text-sm"
                                        onClick={() =>
                                            updateSceneTracker({
                                                temperature: String(Math.max(-20, sceneTemperature - 1)),
                                            })
                                        }
                                        disabled={sceneTemperature <= -20}
                                        data-testid="scene-temperature-decrease"
                                    >
                                        <span className="leading-none">−</span>
                                    </Button>

                                    <div className={`flex-1 h-8 rounded-sm border flex items-center justify-center text-xs font-medium ${getTemperatureColorClass(sceneTemperature)}`}>
                                        {sceneTemperature} · {getTemperatureCondition(sceneTemperature)}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-5 text-zinc-400 text-sm"
                                        onClick={() =>
                                            updateSceneTracker({
                                                temperature: String(Math.min(45, sceneTemperature + 1)),
                                            })
                                        }
                                        disabled={sceneTemperature >= 45}
                                        data-testid="scene-temperature-increase"
                                    >
                                        <span className="leading-none">+</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <Cloud className="w-3 h-3" /> Cloud
                                </label>
                                <Select
                                    value={sceneTracker.cloud_cover}
                                    onValueChange={(value) => updateSceneTracker({ cloud_cover: value })}
                                >
                                    <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-800 text-xs" data-testid="scene-cloud-select">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {CLOUD_COVER_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value} className="text-xs text-zinc-200">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <Droplets className="w-3 h-3" /> Precipitation
                                </label>
                                <Select
                                    value={sceneTracker.precipitation}
                                    onValueChange={(value) => updateSceneTracker({ precipitation: value })}
                                >
                                    <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-800 text-xs" data-testid="scene-precipitation-select">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {PRECIPITATION_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value} className="text-xs text-zinc-200">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <Gauge className="w-3 h-3" />
                                    Intensity
                                </label>
                                <Select
                                    value={sceneTracker.precipitation === "dry" ? "none" : sceneTracker.intensity}
                                    onValueChange={(value) => updateSceneTracker({ intensity: value })}
                                    disabled={sceneTracker.precipitation === "dry"}
                                >
                                    <SelectTrigger
                                        className={`h-8 bg-zinc-900/50 border-zinc-800 text-xs ${
                                            sceneTracker.precipitation === "dry" ? "opacity-50" : ""
                                        }`}
                                        data-testid="scene-intensity-select"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {INTENSITY_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value} className="text-xs text-zinc-200">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                    <Wind className="w-3 h-3" /> Wind
                                </label>
                                <Select
                                    value={sceneTracker.wind}
                                    onValueChange={(value) => updateSceneTracker({ wind: value })}
                                >
                                    <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-800 text-xs" data-testid="scene-wind-select">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {WIND_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value} className="text-xs text-zinc-200">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                        <Collapsible
                            open={openSections.combat}
                            onOpenChange={() => toggleSection("combat")}
                            className="bg-zinc-900/40 border border-zinc-800 rounded-sm"
                            data-testid="cards-section-combat"
                        >
                            <CollapsibleTrigger className="w-full flex items-center justify-between p-3" data-testid="cards-section-combat-toggle">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Combat</span>
                                </div>
                                {openSections.combat ? (
                                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                                )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-3 pb-3">
                                <CombatTrackerCard
                                    activeCharacter={activeCharacter}
                                    normalDefense={normalDefense}
                                    initiativeModifier={initiativeModifier}
                                    speed={speed}
                                    armorGeneral={armorGeneral}
                                    armorBallistic={armorBallistic}
                                    activeMageArmorName={activeMageArmorName}
                                    activeMageArmorDots={activeMageArmorDots}
                                    onTriggerDiceRoll={onTriggerDiceRoll}
                                    onApplyIncomingDamage={onApplyIncomingDamage}
                                    onUpdateCharacter={onUpdateCharacter}
                                    healthBoxes={healthBoxes}
                                    maxHealth={maxHealth}
                                    filledHealth={filledHealth}
                                    isDeadTrack={isDeadTrack}
                                    woundPenalty={woundPenalty}
                                    onHealHealthState={onHealHealthState}
                                    onPatternRestoration={onPatternRestoration}
                                    patternRestorationDisabled={patternRestorationDisabled}
                                    isMage={isMage}
                                    onEndTurn={onEndTurn}
                                    onSleep={onSleep}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                    {/* Session Summary Card */}
                    <Collapsible
                        open={openSections.conditions}
                        onOpenChange={() => toggleSection("conditions")}
                        className="bg-zinc-900/40 border border-zinc-800 rounded-sm"
                        data-testid="cards-section-conditions"
                    >
                        <CollapsibleTrigger className="w-full flex items-center justify-between p-3" data-testid="cards-section-conditions-toggle">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Conditions</span>
                                <span className="text-[10px] text-zinc-500">{activeConditions.length}</span>
                            </div>
                            {openSections.conditions ? (
                                <ChevronDown className="w-4 h-4 text-zinc-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-zinc-500" />
                            )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-3 pb-3">
                            <div className="space-y-3">
                                <Dialog open={showAddCondition} onOpenChange={setShowAddCondition}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full btn-secondary" data-testid="add-condition-btn">
                                            <Plus className="w-4 h-4 mr-2" /> Add Condition
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle className="text-zinc-100 font-heading">Add Condition</DialogTitle>
                                            <DialogDescription className="text-zinc-400">
                                                Select a predefined condition or create a custom one.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-3">
                                            <Input
                                                placeholder="Search conditions..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="input-geist"
                                                data-testid="search-conditions-input"
                                            />
                                            <Input
                                                placeholder="Origin/source (e.g., Liminal Aura, Boneyard, Beasts (Geist))"
                                                value={conditionOrigin}
                                                onChange={(e) => setConditionOrigin(e.target.value)}
                                                className="input-geist"
                                                data-testid="condition-origin-input"
                                            />
                                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                                {filteredConditions.map((name) => (
                                                    <button
                                                        key={name}
                                                        onClick={() => handleAddPredefinedCondition(name)}
                                                        className="w-full text-left p-2 rounded-sm bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                                        data-testid={`condition-option-${name.toLowerCase().replace(/\s+/g, '-')}`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${CardTypeColors[CONDITION_DEFINITIONS[name]?.type || "custom"].badge} ${CardTypeColors[CONDITION_DEFINITIONS[name]?.type || "custom"].text}`}>
                                                                {(CONDITION_DEFINITIONS[name]?.type || "custom").toUpperCase()}
                                                            </span>
                                                            <span className="text-xs text-zinc-200">{name}</span>
                                                        </div>
                                                        <p className="text-[10px] text-zinc-500 line-clamp-2">
                                                            {CONDITION_DEFINITIONS[name]?.description}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="border-t border-zinc-800 pt-3">
                                                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Or Create Custom</h4>
                                                <div className="space-y-2">
                                                    <Input
                                                        placeholder="Condition name"
                                                        value={customConditionName}
                                                        onChange={(e) => setCustomConditionName(e.target.value)}
                                                        className="input-geist"
                                                        data-testid="custom-condition-name"
                                                    />
                                                    <Textarea
                                                        placeholder="Description (optional)"
                                                        value={customConditionDesc}
                                                        onChange={(e) => setCustomConditionDesc(e.target.value)}
                                                        className="input-geist min-h-[60px]"
                                                        data-testid="custom-condition-description"
                                                    />
                                                    <Button
                                                        onClick={handleAddCustomCondition}
                                                        className="w-full btn-primary"
                                                        disabled={!customConditionName.trim()}
                                                        data-testid="add-custom-condition-btn"
                                                    >
                                                        Add Custom Condition
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {activeConditions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-zinc-500 text-sm">No active conditions</p>
                                        <p className="text-zinc-600 text-xs mt-1">Add conditions to track status effects</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {activeConditions.map((condition, idx) => (
                                            <ConditionCard
                                                key={`${condition.name}-${idx}`}
                                                conditionIndex={idx}
                                                name={condition.name}
                                                type={condition.type || "custom"}
                                                description={condition.description}
                                                resolution={condition.resolution}
                                                origin={condition.origin}
                                                onRemove={onRemoveCondition}
                                                onResolve={onResolveCondition}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {!isMage && (
                        <>
                            {/* Haunts Section */}
                            <Collapsible
                                open={openSections.haunts}
                                onOpenChange={() => toggleSection("haunts")}
                                className="bg-zinc-900/40 border border-zinc-800 rounded-sm"
                                data-testid="cards-section-haunts"
                            >
                                <CollapsibleTrigger className="w-full flex items-center justify-between p-3" data-testid="cards-section-haunts-toggle">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Haunts</span>
                                        <span className="text-[10px] text-zinc-500">{hauntCount}</span>
                                    </div>
                                    {openSections.haunts ? (
                                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                                    )}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-3 pb-3">
                                    <div className="space-y-2" data-testid="haunts-list">
                                        {Object.entries(HAUNT_DEFINITIONS).map(([name, definition]) => (
                                            <HauntCard
                                                key={name}
                                                name={name}
                                                rating={haunts[name] || 0}
                                                definition={definition}
                                                onUpdateRating={onUpdateHaunt}
                                            />
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </>
                    )}

                    {!isMage && (
                        <>
                            {/* Keys Section */}
                            <Collapsible
                                open={openSections.keys}
                                onOpenChange={() => toggleSection("keys")}
                                className="bg-zinc-900/40 border border-zinc-800 rounded-sm"
                                data-testid="cards-section-keys"
                            >
                                <CollapsibleTrigger className="w-full flex items-center justify-between p-3" data-testid="cards-section-keys-toggle">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Keys</span>
                                        <span className="text-[10px] text-zinc-500">{availableKeys.length}</span>
                                    </div>
                                    {openSections.keys ? (
                                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                                    )}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-3 pb-3">
                                    <div className="space-y-2" data-testid="keys-list">
                                        <div className="text-[11px] text-zinc-500 mb-2">
                                            Keys are unlocked from character creation, Geist, Mementos, and manual selection. 
                                            Doomed Keys are hidden here and unavailable in dice pools unless the doom effect says otherwise.
                                        </div>
                                        {Object.entries(KEY_DEFINITIONS)
                                            .filter(([name]) => availableKeys.includes(name))
                                            .map(([name, def]) => {
                                                const source = keySourceMap[name] || {};
                                                const locked = source.isCharacterKey || source.isGeistKey || source.isMementoKey || source.isDoomed;
                                                const badges = [];
                                                if (source.isCharacterKey) badges.push("C");
                                                if (source.isGeistKey) badges.push("G");
                                                if (source.isMementoKey) badges.push("M");
                                                if (source.isDoomed) badges.push("D");
                                                return (
                                                    <KeyCard
                                                        key={name}
                                                        name={name}
                                                        active={availableKeys.includes(name)}
                                                        definition={def}
                                                        onToggle={onToggleKey}
                                                        locked={locked}
                                                        sourceBadges={badges}
                                                        isDoomed={source.isDoomed}
                                                        doomSource={source.doomSource}
                                                    />
                                                );
                                            })}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </>
                    )}

                    {!isMage && (
                        <>
                            {/* Ceremonies Section */}
                            <Collapsible
                                open={openSections.ceremonies}
                                onOpenChange={() => toggleSection("ceremonies")}
                                className="bg-zinc-900/40 border border-zinc-800 rounded-sm"
                                data-testid="cards-section-ceremonies"
                            >
                                <CollapsibleTrigger className="w-full flex items-center justify-between p-3" data-testid="cards-section-ceremonies-toggle">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Ceremonies</span>
                                        <span className="text-[10px] text-zinc-500">{Object.keys(CEREMONY_DEFINITIONS).length}</span>
                                    </div>
                                    {openSections.ceremonies ? (
                                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                                    )}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-3 pb-3">
                                    <div className="space-y-2" data-testid="ceremonies-list">
                                        {Object.entries(CEREMONY_DEFINITIONS).map(([name, ceremony]) => (
                                            <CeremonyCard
                                                key={name}
                                                name={name}
                                                ceremony={ceremony}
                                                onActivate={handleCeremonyActivate}
                                            />
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </>
                    )}

                    {isMage && (
                        <Collapsible
                            open={openSections.activeSpells}
                            onOpenChange={() => toggleSection("activeSpells")}
                            className="bg-zinc-900/40 border border-zinc-800 rounded-sm"
                            data-testid="cards-section-active-spells"
                        >
                            <CollapsibleTrigger className="w-full flex items-center justify-between p-3" data-testid="cards-section-active-spells-toggle">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Active Spells & Effects</span>
                                    <span className="text-[10px] text-zinc-500">{activeSpells.length}</span>
                                </div>
                                {openSections.activeSpells ? (
                                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                                )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-3 pb-3">
                                <div className="space-y-2" data-testid="active-spells-list">
                                    <MageSightCard
                                        activeCharacter={activeCharacter}
                                        activeMageSight={activeMageSight}
                                        onUpdateCharacter={onUpdateCharacter}
                                        onTriggerDiceRoll={onTriggerDiceRoll}
                                    />

                                    {activeSpells
                                        .filter((spell) => spell.effect_key !== "mage-sight")
                                        .map((spell) => (
                                            <ActiveSpellCard
                                                key={spell.id || `${spell.name}-${spell.arcanum}-${spell.practice}`}
                                                spell={spell}
                                                onDispel={onDispelActiveSpell}
                                                onRelinquish={onRelinquishActiveSpell}
                                                onRelinquishSafely={onRelinquishActiveSpellSafely}
                                            />
                                        ))}

                                    {activeSpells.filter((spell) => spell.effect_key !== "mage-sight").length === 0 && (
                                        <div className="text-center py-4">
                                            <p className="text-zinc-500 text-sm">No active spells or effects</p>
                                            <p className="text-zinc-600 text-xs mt-1">Spells cast with Advanced Duration appear here</p>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                    {/* Merits Section */}
                    <Collapsible
                        open={openSections.merits}
                        onOpenChange={() => toggleSection("merits")}
                        className="bg-zinc-900/40 border border-zinc-800 rounded-sm"
                        data-testid="cards-section-merits"
                    >
                        <CollapsibleTrigger className="w-full flex items-center justify-between p-3" data-testid="cards-section-merits-toggle">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Merits</span>
                                <span className="text-[10px] text-zinc-500">{characterMerits.length}</span>
                            </div>
                            {openSections.merits ? (
                                <ChevronDown className="w-4 h-4 text-zinc-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-zinc-500" />
                            )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-3 pb-3">
                            {characterMerits.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-zinc-500 text-sm">No merits selected</p>
                                    <p className="text-zinc-600 text-xs mt-1">Add merits in the Character tab</p>
                                </div>
                            ) : (
                                <div className="space-y-2" data-testid="merits-list">
                                    {characterMerits.map((merit) => (
                                        <MeritCard
                                            key={merit.name}
                                            merit={merit}
                                            definition={MERIT_DEFINITIONS[merit.name]}
                                        />
                                    ))}
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible
                        open={openSections.places}
                        onOpenChange={() => toggleSection("places")}
                        className="bg-zinc-900/40 border border-zinc-800 rounded-sm"
                        data-testid="cards-section-places"
                    >
                        <CollapsibleTrigger className="w-full flex items-center justify-between p-3" data-testid="cards-section-places-toggle">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Places & People</span>
                                <span className="text-[10px] text-zinc-500">{placesPeople.length}</span>
                            </div>
                            {openSections.places ? (
                                <ChevronDown className="w-4 h-4 text-zinc-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-zinc-500" />
                            )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-3 pb-3">
                            <div className="space-y-3">
                                <Dialog open={showAddPlacePerson} onOpenChange={setShowAddPlacePerson}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full btn-secondary" data-testid="add-place-person-btn">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Place or Person
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle className="text-zinc-100 font-heading">Add Place or Person</DialogTitle>
                                            <DialogDescription className="text-zinc-400">
                                                Track important locations and NPCs.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-3">
                                            <Input
                                                placeholder="Name"
                                                value={newPlaceName}
                                                onChange={(e) => setNewPlaceName(e.target.value)}
                                                className="input-geist"
                                                data-testid="place-person-name-input"
                                            />
                                            <Select value={newPlaceType} onValueChange={setNewPlaceType}>
                                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800" data-testid="place-person-type-select">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                                    <SelectItem value="place" className="text-zinc-200">Place</SelectItem>
                                                    <SelectItem value="person" className="text-zinc-200">Person</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {newPlaceType === "person" && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Type</label>
                                                        <Select
                                                            value={newPersonType}
                                                            onValueChange={(v) => {
                                                                setNewPersonType(v);
                                                                setNewPersonSubtype(PERSON_SUBTYPE_OPTIONS[v]?.[0] || "");
                                                            }}
                                                        >
                                                            <SelectTrigger className="bg-zinc-900/50 border-zinc-800" data-testid="place-person-person-type-select">
                                                                <SelectValue placeholder="Type" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                                {PERSON_TYPE_OPTIONS.map((option) => (
                                                                    <SelectItem key={option} value={option} className="text-zinc-200">
                                                                        {option}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Subtype</label>
                                                        <Select value={newPersonSubtype} onValueChange={setNewPersonSubtype}>
                                                            <SelectTrigger className="bg-zinc-900/50 border-zinc-800" data-testid="place-person-person-subtype-select">
                                                                <SelectValue placeholder="Subtype" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                                {(PERSON_SUBTYPE_OPTIONS[newPersonType] || []).map((option) => (
                                                                    <SelectItem key={option} value={option} className="text-zinc-200">
                                                                        {option}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}
                                            <Textarea
                                                placeholder="Description"
                                                value={newPlaceDescription}
                                                onChange={(e) => setNewPlaceDescription(e.target.value)}
                                                className="input-geist min-h-[60px]"
                                                data-testid="place-person-description-input"
                                            />
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Status</label>
                                                <Select value={newPlaceStatus} onValueChange={setNewPlaceStatus}>
                                                    <SelectTrigger className="bg-zinc-900/50 border-zinc-800" data-testid="place-person-status-select">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                                        {(newPlaceType === "place" ? PLACE_STATUS_OPTIONS : PERSON_STATUS_OPTIONS).map((option) => (
                                                            <SelectItem key={option} value={option} className="text-zinc-200">
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {newPlaceType === "person" && (
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Relationship</label>
                                                    <Select value={newPlaceRelationship} onValueChange={setNewPlaceRelationship}>
                                                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800" data-testid="place-person-relationship-select">
                                                            <SelectValue placeholder="Select relationship" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                                            {PERSON_RELATIONSHIP_OPTIONS.map((option) => (
                                                                <SelectItem key={option} value={option} className="text-zinc-200">
                                                                    {option}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                            <Button
                                                onClick={handleAddPlacePerson}
                                                className="w-full btn-primary"
                                                disabled={!newPlaceName.trim()}
                                                data-testid="place-person-save-btn"
                                            >
                                                Add Entry
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {sortedPlacesPeople.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-zinc-500 text-sm">No places or people yet</p>
                                        <p className="text-zinc-600 text-xs mt-1">Add notable NPCs and locations</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2" data-testid="places-people-list">
                                        {sortedPlacesPeople.map((entry) => (
                                            <PlacePersonCard
                                                key={entry.id || entry.name}
                                                entry={entry}
                                                onUpdate={(updates) => handleUpdatePlacePerson(entry.id, updates)}
                                                onDelete={() => handleDeletePlacePerson(entry.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                    {/* Case Truth Card */}
                    <Collapsible
                        open={openSections.caseTruth}
                        onOpenChange={() => toggleSection("caseTruth")}
                        className="bg-purple-950/30 border border-purple-500/30 rounded-sm"
                    >
                        <CollapsibleTrigger className="w-full flex items-center justify-between p-3">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                                    Case File
                                </span>
                            </div>
                            {openSections.caseTruth ? (
                                <ChevronDown className="w-4 h-4 text-purple-400" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-purple-400" />
                            )}
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-3 pb-3 space-y-3">
                            <Textarea
                                value={caseFileDraft}
                                onChange={(e) => setCaseFileDraft(e.target.value)}
                                placeholder="Write the Case File here..."
                                className="min-h-[220px] bg-zinc-900/50 border-zinc-700 text-zinc-200"
                                data-testid="case-file-textarea"
                            />

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-zinc-700 text-zinc-300"
                                    onClick={() => setCaseFileDraft(activeCharacter?.case_truth || "")}
                                >
                                    Reset
                                </Button>

                                <Button
                                    type="button"
                                    className="btn-primary"
                                    onClick={handleSaveCaseFile}
                                    disabled={!activeCharacter?.id}
                                    data-testid="save-case-file-btn"
                                >
                                    Save Case File
                                </Button>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </ScrollArea>

            {/* Ceremony Roll Dialog */}
            <Dialog open={showCeremonyRollDialog} onOpenChange={setShowCeremonyRollDialog}>
                <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-fuchsia-300">
                            {selectedCeremony?.name}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Roll {selectedCeremony?.dicePool}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="text-sm text-zinc-300">
                            <p><span className="text-zinc-500">Duration:</span> {selectedCeremony?.duration}</p>
                            <p className="mt-2 text-zinc-400">{selectedCeremony?.description}</p>
                        </div>
                        <div className="bg-zinc-800/50 rounded p-3 text-center">
                            <p className="text-xs text-zinc-500 mb-2">Dice Pool</p>
                            <p className="text-lg text-fuchsia-300 font-mono">{selectedCeremony?.dicePool}</p>
                            {rollingCeremony && (
                                <p className="text-xs text-zinc-400 mt-3">Rolling...</p>
                            )}

                            {ceremonyRollResult && (
                                <div className="mt-3 text-sm text-zinc-300">
                                    <p className="text-xs text-zinc-500">Result</p>
                                    <pre className="text-fuchsia-300 font-mono text-xs mt-1">
                                        {JSON.stringify(ceremonyRollResult, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                        <Button 
                            className="w-full btn-secondary"
                            onClick={() => setShowCeremonyRollDialog(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};