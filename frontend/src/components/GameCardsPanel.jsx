import { lazyPanel } from "./LazyPanel";
import { useState, useMemo, useEffect, useRef } from "react";
import { Pencil, Plus, Info, Flame, Skull, Droplets, Wind, Bug, Mountain, Sparkles, Ghost, Zap, ChevronDown, ChevronRight, ChevronUp, ChevronLeft, Star, BookOpen, CalendarDays, Clock3, Cloud, Thermometer, Leaf, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
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
    CardTypeColors,
    PERSON_TYPE_OPTIONS, PERSON_SUBTYPE_OPTIONS,
    PLACE_STATUS_OPTIONS, PERSON_STATUS_OPTIONS, PERSON_RELATIONSHIP_OPTIONS,
} from "../data/cards-data";

import {
    ARCANA,
    PATH_ARCANA,
} from "../data/character-data";





import { MeritCard } from './cards/MeritCard';
import { CeremonyCard } from './cards/CeremonyCard';

import { SceneTrackerCard } from "./cards/SceneTrackerCard";
import { isSceneDurationEffect } from "../utils/sceneLifecycle";
import { getDoomedKeySources } from "../utils/geistKeys";
import { expireTimedEffects, isEffectExpired } from "../utils/effectDuration";
import { advanceNaturalHealing } from "../utils/naturalHealing";
import { makeWeatherConditions, exposurePenalty, temperatureExposure, environmentalTurnHazards, getEnvironmentalStats } from "../utils/environmentalTilts";
import { advanceEnvironmentalExposure } from "../utils/environmentalExposure";
import { restoreScouredAttributes } from "../utils/mageRecovery";

const PlacePersonCard = lazyPanel(() => import("./cards/PlacePersonCard"), "PlacePersonCard", "place or NPC");
const HauntCard = lazyPanel(() => import("./cards/HauntCard"), "HauntCard", "Haunt");
const KeyCard = lazyPanel(() => import("./cards/KeyCard"), "KeyCard", "Key");
const CombatTrackerCard = lazyPanel(() => import("./cards/CombatTrackerCard"), "CombatTrackerCard", "combat tracker");
const ConditionsSection = lazyPanel(() => import("./game-cards/ConditionsSection"), "ConditionsSection", "Conditions", "open");
const ActiveSpellsSection = lazyPanel(() => import("./game-cards/ActiveSpellsSection"), "ActiveSpellsSection", "active effects", "open");




const DEFAULT_SCENE_TRACKER = {
    location_name: "",
    location_type: "exterior",
    sheltered: false,
    shelter_temperature_adequate: true,
    date: "",
    time: "",
    temperature: "15",
    cloud_cover: "clear",
    precipitation: "dry",
    intensity: "none",
    wind: "calm",
    wind_grade: 0,
    flood_depth_feet: 0,
    snow_depth_inches: 0,
    icy_ground: false,
    earthquake_active: false,
    earthquake_severity: 0,
    earthquake_damage: 0,
    cold_gear_adequate: true,
    temperature_protected: false,
};

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

// All automatically generated weather hazards use the shared rules module.

export const GameCardsPanel = ({
    activeCharacter,
    activeConditions = [],
    haunts = {},
    keys = [],
    onAddCondition,
    onRemoveCondition,
    onResolveCondition,
    onUpdateCondition,
    onScourAbyssal,
    onSetAbyssalSuccesses,
    onUpdateHaunt,
    onToggleKey,
    onUpdatePlacesPeople,
    onDispelActiveSpell,
    onRelinquishActiveSpell,
    onRelinquishActiveSpellSafely,
    onGenerateCaseTruth,
    onAddRecentRoll,
    onTriggerDiceRoll,
    onApplyIncomingDamage,
    onUpdateCharacter,
    healthBoxes,
    maxHealth,
    filledHealth,
    isDeadTrack,
    woundPenalty,
    onHealHealthState,
    onToggleResistantWound,
    onPatternRestoration,
    patternRestorationDisabled,
    onEndTurn,
    onSleep,
    onEndScene,
    onRollCeremony,
}) => {
    const cardsScrollAreaRef = useRef(null);
    const [showAddPlacePerson, setShowAddPlacePerson] = useState(false);
    const [newPlaceName, setNewPlaceName] = useState("");
    const [newPlaceType, setNewPlaceType] = useState("place");
    const [newPlaceDescription, setNewPlaceDescription] = useState("");
    const [newPlaceStatus, setNewPlaceStatus] = useState("");
    const [newPlaceRelationship, setNewPlaceRelationship] = useState("");
    const [newPersonType, setNewPersonType] = useState("Mundane");
    const [newPersonSubtype, setNewPersonSubtype] = useState("Aware");
    const [newAnimalSpecies, setNewAnimalSpecies] = useState("");
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
    const [caseFileDraft, setCaseFileDraft] = useState("");
    const [sceneTracker, setSceneTracker] = useState(DEFAULT_SCENE_TRACKER);
    const [endSceneOpen, setEndSceneOpen] = useState(false);
    const [endingScene, setEndingScene] = useState(false);
    const [pendingHeaderAction, setPendingHeaderAction] = useState(null);
    const [defenseResetToken, setDefenseResetToken] = useState(0);

    useEffect(() => {
        setCaseFileDraft(activeCharacter?.case_truth || "");
    }, [activeCharacter?.id, activeCharacter?.case_truth]);

    useEffect(() => {
        setSceneTracker({
            ...DEFAULT_SCENE_TRACKER,
            ...(activeCharacter?.scene_tracker || {}),
        });
    }, [activeCharacter?.id, activeCharacter?.scene_tracker]);

    const placesPeople =
        activeCharacter?.places_people || [];

    const sortedPlacesPeople =
        [...placesPeople].sort(
            (a, b) =>
                (a.name || "").localeCompare(
                    b.name || ""
                )
        );

    const scenePlaceOptions =
        placesPeople
            .filter(
                (entry) =>
                    entry?.type === "place"
            )
            .sort(
                (a, b) =>
                    (a.name || "").localeCompare(
                        b.name || ""
                    )
            );
    const characterType = activeCharacter?.character_type || "geist";
    const isMage = characterType === "mage";
    const gameClock = activeCharacter?.scene_tracker || {};
    const activeSpells = useMemo(() => [...(activeCharacter?.active_spells || [])]
        .sort((a, b) => (a.name || "").localeCompare(b.name || "")), [activeCharacter?.active_spells]);
    const activeEffectsCount = activeSpells.filter((effect) => !isEffectExpired(effect, gameClock)).length;
    const sceneEffectsToExpire = activeSpells.filter((effect) =>
        !isEffectExpired(effect, gameClock) && isSceneDurationEffect(effect)
    ).length;
    const sceneParadoxRolls = Math.max(0, Number(activeCharacter?.scene_paradox_rolls) || 0);
    const temporaryPlasmToLose = Math.min(
        Math.max(0, Number(activeCharacter?.plasm) || 0),
        Math.max(0, Number(activeCharacter?.temporary_plasm) || 0)
    );
    const activeMageSight = activeSpells.find((spell) => spell.effect_key === "mage-sight" && !isEffectExpired(spell, gameClock)) || null;
    const meritsList = activeCharacter?.merits_list || [];
    const activeConditionNames = new Set((activeCharacter?.conditions || [])
        .filter((condition) => condition?.status !== "expired" && (!condition?.target_type || condition.target_type === "character"))
        .map((condition) => (condition?.name || "").toLowerCase()));
    const hasCondition = (name) => activeConditionNames.has(name.toLowerCase());
    const getAttributeForDerivedTrait = (attr, fallback = 1) => {
        const rawValue = activeCharacter?.attributes?.[attr];
        const currentValue = Number.isFinite(Number(rawValue)) ? Number(rawValue) : fallback;

        if (!["strength", "dexterity", "stamina"].includes(attr)) return currentValue;

        const hasLifeTwo = (activeCharacter?.arcana?.Life || 0) >= 2;
        if (!hasLifeTwo) return currentValue;

        const scoured = activeCharacter?.scoured_attributes || {};
        return currentValue + Math.max(0, Number(scoured[attr]) || 0);
    };
    const dexterity = getAttributeForDerivedTrait("dexterity", 1);
    const wits = activeCharacter?.attributes?.wits || 1;
    const athletics = activeCharacter?.skills?.athletics || 0;
    const composure = activeCharacter?.attributes?.composure || 1;
    const strength = getAttributeForDerivedTrait("strength", 1);
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
    const environmentStats = getEnvironmentalStats(activeCharacter, sceneTracker);
    const normalDefense = Math.max(0, (hasCondition('Blinded') ? Math.floor(baseDefense / 2) : baseDefense) + environmentStats.defensePenalty);

    const initiativeModifier = dexterity + composure;
    const baseSpeed = strength + dexterity + 5;
    const speedBeforeIce = hasCondition('Leg Wrack') ? Math.max(1, Math.floor(baseSpeed / 2)) : baseSpeed;
    const speed = Math.max(0, Math.floor(speedBeforeIce * environmentStats.speedMultiplier));

    const learnedCeremonies = useMemo(() => [...(activeCharacter?.ceremonies_list || [])].filter(c => c?.name).sort((a,b)=>(Number(a.dots)||1)-(Number(b.dots)||1) || a.name.localeCompare(b.name)), [activeCharacter?.ceremonies_list]);

    // Get character's merits with dots > 0
    const characterMerits = useMemo(() => {
        const merits = activeCharacter?.merits_list || [];
        return merits
            .filter(m => m.dots > 0)
            .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }, [activeCharacter?.merits_list]);

    const handleAddPlacePerson = () => {
        if (!newPlaceName.trim()) {
            return;
        }

        const isPerson =
            newPlaceType === "person";

        const isAnimal =
            newPlaceType === "animal";

        const isNpc =
            isPerson || isAnimal;

        const newEntry = {
            id: Date.now(),

            name:
                newPlaceName.trim(),

            type:
                newPlaceType,

            description:
                newPlaceDescription.trim(),

            status:
                newPlaceStatus.trim(),

            relationship:
                isNpc
                    ? newPlaceRelationship
                    : "",

            person_type:
                isPerson
                    ? newPersonType
                    : "",

            person_subtype:
                isPerson
                    ? newPersonSubtype
                    : "",

            species:
                isAnimal
                    ? newAnimalSpecies.trim()
                    : "",
        };

        const updated = [
            ...placesPeople,
            newEntry,
        ].sort(
            (a, b) =>
                (a.name || "").localeCompare(
                    b.name || ""
                )
        );

        onUpdatePlacesPeople(updated);

        setNewPlaceName("");
        setNewPlaceType("place");
        setNewPlaceDescription("");
        setNewPlaceStatus("");
        setNewPlaceRelationship("");
        setNewPersonType("Mundane");
        setNewPersonSubtype("Aware");
        setNewAnimalSpecies("");
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
            return Object.fromEntries(
                Object.keys(prev).map((key) => [key, key === section && shouldOpen])
            );
        });
        // Navigation stays visible; reset just the Cards content scroll.
        const viewport = cardsScrollAreaRef.current?.querySelector(
            '[data-radix-scroll-area-viewport]'
        );
        if (viewport) viewport.scrollTop = 0;
    };

    const handleSaveCaseFile = async () => {
        if (!activeCharacter?.id || !onUpdateCharacter) return;

        await onUpdateCharacter({
            case_truth: caseFileDraft,
        });
    };

    const updateSceneTracker = async (updates) => {
        const requestedTracker = { ...sceneTracker, ...updates };
        if (requestedTracker.precipitation === 'dry') requestedTracker.intensity = 'none';
        const current = activeCharacter || {};
        const exposure = advanceEnvironmentalExposure(current, requestedTracker, healthBoxes, current.resistant_wounds);
        const nextTracker = exposure.tracker;
        setSceneTracker(nextTracker);
        if (!current.id || !onUpdateCharacter) return;
        const preserved = (current.conditions || []).filter((condition) => !condition?.weather_auto);
        const generated = makeWeatherConditions(nextTracker).filter((auto) =>
            !preserved.some((manual) => manual.name === auto.name && manual.status !== 'expired'));
        const conditions = expireTimedEffects([...preserved, ...generated], nextTracker);
        const spells = current.active_spells || [];
        const expiredSpells = expireTimedEffects(spells, nextTracker);
        const restoredAttributes = restoreScouredAttributes(current, nextTracker);
        await onUpdateCharacter({
            scene_tracker: nextTracker, ...restoredAttributes, conditions,
            natural_healing: exposure.recovery,
            health_boxes: exposure.boxes, resistant_wounds: exposure.resistant_wounds,
            health: exposure.boxes.filter((state) => state !== 'empty').length,
            ...(expiredSpells !== spells ? { active_spells: expiredSpells } : {}),
        }, { kind: "clock", healing: exposure });
    };

    const hauntCount = Object.values(haunts).filter((v) => v > 0).length;

    const sceneTemperature = getTemperatureValue(sceneTracker.temperature);

    const sceneSeason = getSeasonFromDate(sceneTracker.date);

    const characterKey = activeCharacter?.innate_key;
    const geistKey = activeCharacter?.geist_innate_key;
    const mementoKeys = (activeCharacter?.mementos || [])
        .map((memento) => memento.key)
        .filter(Boolean);

    const doomedKeySources = useMemo(() => getDoomedKeySources(activeCharacter || {}), [activeCharacter]);

    const doomedKeys = new Set(KEY_NAMES.filter((name) => !!doomedKeySources[name]));

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


    // Header actions retain the Combat Tracker callbacks and reset the temporary
    // (per-turn) Defense value, just as the original buttons did.
    const runHeaderAction = async (kind) => {
        const handler = kind === 'turn' ? onEndTurn : onSleep;
        if (!activeCharacter || typeof handler !== 'function' || pendingHeaderAction || endingScene) return;
        if (kind === 'turn' && !activeCharacter.combat_active) return;
        setPendingHeaderAction(kind);
        setDefenseResetToken((previous) => previous + 1);
        try {
            await handler();
        } catch (error) {
            console.error('Cards header action failed:', error);
            toast.error(kind === 'turn' ? 'Could not end the turn.' : 'Could not process sleep.');
        } finally {
            setPendingHeaderAction(null);
        }
    };

    const confirmEndScene = async () => {
        if (!onEndScene || !activeCharacter || endingScene) return;
        setEndingScene(true);
        try {
            const completed = await onEndScene();
            if (completed) setEndSceneOpen(false);
        } catch (error) {
            toast.error("Could not end the scene.");
        } finally {
            setEndingScene(false);
        }
    };

    // Same one-at-a-time navigation pattern as Character Sheet.
    const cardNavigationItems = isMage
        ? [
            { id: "combat", label: "Combat" },
            { id: "conditions", label: "Conditions", count: activeConditions.filter(condition=>!isEffectExpired(condition,gameClock)).length },
            { id: "activeSpells", label: "Active Spells & Abilities", count: activeEffectsCount },
            { id: "merits", label: "Merits" },
            { id: "places", label: "Places & NPCs" },
            { id: "caseTruth", label: "Case File" },
        ]
        : [
            { id: "combat", label: "Combat" },
            { id: "conditions", label: "Conditions", count: activeConditions.filter(condition=>!isEffectExpired(condition,gameClock)).length },
            { id: "haunts", label: "Haunts" },
            { id: "keys", label: "Keys" },
            { id: "ceremonies", label: "Ceremonies" },
            { id: "activeSpells", label: "Effects", count: activeEffectsCount },
            { id: "merits", label: "Merits" },
            { id: "places", label: "Places & NPCs" },
            { id: "caseTruth", label: "Case File" },
        ];

    return (
        <div className="h-full min-h-0 flex flex-col" data-testid="game-cards-panel">
            <div className="px-4 py-3 border-b border-zinc-800/50 shrink-0 flex items-center justify-between gap-3">
                <h2 className="font-heading text-lg text-zinc-200">Cards</h2>
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button
                        type="button"
                        size="sm"
                        className="h-8 btn-secondary text-xs"
                        onClick={() => runHeaderAction('turn')}
                        disabled={!activeCharacter?.combat_active || !onEndTurn || !!pendingHeaderAction || endingScene}
                        data-testid="combat-card-end-turn-btn"
                    >
                        End Turn
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        className="h-8 btn-secondary text-xs"
                        onClick={() => runHeaderAction('sleep')}
                        disabled={!activeCharacter || !onSleep || !!pendingHeaderAction || endingScene}
                        data-testid="combat-card-sleep-btn"
                    >
                        Sleep
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 border-zinc-700 bg-zinc-900/40 text-zinc-200 hover:text-white"
                        onClick={() => setEndSceneOpen(true)}
                        disabled={!activeCharacter || !onEndScene || !!pendingHeaderAction}
                        data-testid="cards-end-scene-btn"
                    >
                        End Scene
                    </Button>
                </div>
                <Dialog open={endSceneOpen} onOpenChange={(open) => { if (!endingScene) setEndSceneOpen(open); }}>
                    <DialogContent className="bg-zinc-950 border-zinc-700 text-zinc-100 max-w-md" data-testid="end-scene-dialog">
                        <DialogHeader>
                            <DialogTitle>End the current scene?</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                Confirm when the fiction moves to a new dramatic situation. Time and location will not change.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 text-xs text-zinc-300">
                            <p>Scene-duration spells and effects expiring: <strong>{sceneEffectsToExpire}</strong></p>
                                    <p>Conditions to remove: <strong>{activeConditions.filter(condition=>isEffectExpired(condition,gameClock)||isSceneDurationEffect(condition)).length}</strong>. Pending Abyssal lapses are finalized.</p>
                            {isMage && <p>Paradox roll counter resetting: <strong>{sceneParadoxRolls}</strong> → 0</p>}
                            {!isMage && <p>Temporary Key Plasm expiring: <strong>{temporaryPlasmToLose}</strong></p>}
                            {activeCharacter?.combat_active && (
                                <p className="text-amber-300" data-testid="end-scene-combat-warning">
                                    Combat is still active. Ending this scene will not end combat or expire turn-based effects.
                                </p>
                            )}
                            <p className="text-zinc-500">Longer-duration effects, game date, time, location and combat state are preserved.</p>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" disabled={endingScene}
                                onClick={() => setEndSceneOpen(false)} data-testid="end-scene-cancel">Cancel</Button>
                            <Button type="button" variant="secondary" disabled={endingScene}
                                onClick={confirmEndScene} data-testid="end-scene-confirm">
                                {endingScene ? "Ending..." : "End Scene"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="px-4 py-3 shrink-0" data-testid="cards-section-scene">
                <SceneTrackerCard
                    sceneTracker={sceneTracker}
                    updateSceneTracker={updateSceneTracker}
                    turnHazards={environmentalTurnHazards(activeCharacter, sceneTracker)}
                    exposureStatus={temperatureExposure(activeCharacter, sceneTracker) ?
                        temperatureExposure(activeCharacter, sceneTracker) + ': ' + exposurePenalty(activeCharacter, sceneTracker) + ' dice to all rolls' : ''}
                    placeOptions={scenePlaceOptions}
                    sceneTemperature={sceneTemperature}
                    sceneSeason={sceneSeason}
                    getSeasonColorClass={getSeasonColorClass}
                    getTemperatureIconClass={getTemperatureIconClass}
                    getTemperatureColorClass={getTemperatureColorClass}
                    getTemperatureCondition={getTemperatureCondition}
                />
            </div>

            <nav
                aria-label="Cards sections"
                className="shrink-0 border-b border-zinc-800 bg-zinc-950/95 px-3 py-2"
                data-testid="cards-top-navigation"
            >
                <div className="grid grid-cols-3 gap-1.5">
                    {cardNavigationItems.map(({ id, label, count }) => (
                        <Button
                            key={id}
                            type="button"
                            size="sm"
                            variant="outline"
                            aria-pressed={!!openSections[id]}
                            onClick={() => toggleSection(id)}
                            data-testid={`cards-nav-${id}`}
                            className={`h-auto min-h-8 min-w-0 whitespace-normal px-1.5 py-1.5 text-[10px] leading-tight sm:text-xs ${
                                openSections[id]
                                    ? "border-teal-500/60 bg-teal-900/40 text-teal-200 hover:bg-teal-800/40"
                                    : "border-zinc-700 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                            }`}
                        >
                            <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
                                <span>{label}</span>
                                {typeof count === "number" && (
                                    <span
                                        data-testid={`cards-nav-count-${id}`}
                                        className={`inline-flex min-w-5 items-center justify-center rounded-full border px-1.5 py-0.5 font-mono text-[10px] leading-none ${
                                            count > 0
                                                ? "border-teal-500/50 bg-teal-900/40 text-teal-200"
                                                : "border-zinc-700 bg-zinc-800/60 text-zinc-400"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </span>
                        </Button>
                    ))}
                </div>
            </nav>

            <ScrollArea ref={cardsScrollAreaRef} className="flex-1 min-h-0">
                <div className="p-4 space-y-4">

                        <Collapsible
                            open={openSections.combat}
                            onOpenChange={() => toggleSection("combat")}
                            className={openSections.combat ? "bg-zinc-900/40 border border-zinc-800 rounded-sm" : "hidden"}
                            data-testid="cards-section-combat"
                        >
                            <CollapsibleTrigger className="!hidden w-full flex items-center justify-between p-3" data-testid="cards-section-combat-toggle">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Combat</span>
                                </div>
                                {openSections.combat ? (
                                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                                )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-3 pt-3 pb-3">
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
                                    onAddRecentRoll={onAddRecentRoll}
                                    onApplyIncomingDamage={onApplyIncomingDamage}
                                    onUpdateCharacter={onUpdateCharacter}
                                    healthBoxes={healthBoxes}
                                    maxHealth={maxHealth}
                                    filledHealth={filledHealth}
                                    isDeadTrack={isDeadTrack}
                                    woundPenalty={woundPenalty}
                                    onHealHealthState={onHealHealthState}
                                    onToggleResistantWound={onToggleResistantWound}
                                    onPatternRestoration={onPatternRestoration}
                                    patternRestorationDisabled={patternRestorationDisabled}
                                    isMage={isMage}
                                    defenseResetToken={defenseResetToken}
                                />
                            </CollapsibleContent>
                        </Collapsible>

                    {/* Conditions Section */}
                    <ConditionsSection
                        navMode
                        open={openSections.conditions}
                        onToggle={() => toggleSection("conditions")}
                        activeCharacter={activeCharacter}
                        activeConditions={activeConditions}
                        onAddCondition={onAddCondition}
                        onRemoveCondition={onRemoveCondition}
                        onResolveCondition={onResolveCondition}
                        onScourAbyssal={onScourAbyssal}
                        onSetAbyssalSuccesses={onSetAbyssalSuccesses}
                    />

                    {!isMage && (
                        <>
                            {/* Haunts Section */}
                            <Collapsible
                                open={openSections.haunts}
                                onOpenChange={() => toggleSection("haunts")}
                                className={openSections.haunts ? "bg-zinc-900/40 border border-zinc-800 rounded-sm" : "hidden"}
                                data-testid="cards-section-haunts"
                            >
                                <CollapsibleTrigger className="!hidden w-full flex items-center justify-between p-3" data-testid="cards-section-haunts-toggle">
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
                                <CollapsibleContent className="px-3 pt-3 pb-3">
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
                                className={openSections.keys ? "bg-zinc-900/40 border border-zinc-800 rounded-sm" : "hidden"}
                                data-testid="cards-section-keys"
                            >
                                <CollapsibleTrigger className="!hidden w-full flex items-center justify-between p-3" data-testid="cards-section-keys-toggle">
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
                                <CollapsibleContent className="px-3 pt-3 pb-3">
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
                                className={openSections.ceremonies ? "bg-zinc-900/40 border border-zinc-800 rounded-sm" : "hidden"}
                                data-testid="cards-section-ceremonies"
                            >
                                <CollapsibleTrigger className="!hidden w-full flex items-center justify-between p-3" data-testid="cards-section-ceremonies-toggle">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Ceremonies</span>
                                        <span className="text-[10px] text-zinc-500">{learnedCeremonies.length}</span>
                                    </div>
                                    {openSections.ceremonies ? (
                                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                                    )}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-3 pt-3 pb-3">
                                    <div className="space-y-2" data-testid="ceremonies-list">
                                        {learnedCeremonies.length === 0 ? <p className="text-xs text-zinc-500 text-center py-4">No ceremonies learned</p> : learnedCeremonies.map((ceremony,index) => (
                                            <CeremonyCard key={ceremony.id || ceremony.name+'-'+index} ceremony={ceremony} onActivate={onRollCeremony}/>
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </>
                    )}

                    {
                        <ActiveSpellsSection
                            navMode
                            open={openSections.activeSpells}
                            onToggle={() => toggleSection("activeSpells")}
                            activeCharacter={activeCharacter}
                            activeSpells={activeSpells}
                            activeMageSight={activeMageSight}
                            isMage={isMage}
                            onUpdateCharacter={onUpdateCharacter}
                            onTriggerDiceRoll={onTriggerDiceRoll}
                            onDispelActiveSpell={onDispelActiveSpell}
                            onRelinquishActiveSpell={onRelinquishActiveSpell}
                            onRelinquishActiveSpellSafely={onRelinquishActiveSpellSafely}
                        />
                    }

                    {/* Merits Section */}
                    <Collapsible
                        open={openSections.merits}
                        onOpenChange={() => toggleSection("merits")}
                        className={openSections.merits ? "bg-zinc-900/40 border border-zinc-800 rounded-sm" : "hidden"}
                        data-testid="cards-section-merits"
                    >
                        <CollapsibleTrigger className="!hidden w-full flex items-center justify-between p-3" data-testid="cards-section-merits-toggle">
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
                        <CollapsibleContent className="px-3 pt-3 pb-3">
                            {characterMerits.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-zinc-500 text-sm">No merits selected</p>
                                    <p className="text-zinc-600 text-xs mt-1">Add merits in the Character tab</p>
                                </div>
                            ) : (
                                <div className="space-y-2" data-testid="merits-list">
                                    {characterMerits.map((merit, index) => (
                                        <MeritCard
                                            key={
                                                merit.id ||
                                                `${merit.name}-${merit.specialty || "default"}-${index}`
                                            }
                                            merit={merit}
                                        />
                                    ))}
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible
                        open={openSections.places}
                        onOpenChange={() =>
                            toggleSection("places")
                        }
                        className={openSections.places ? "bg-zinc-900/40 border border-zinc-800 rounded-sm" : "hidden"}
                        data-testid="cards-section-places"
                    >
                        <CollapsibleTrigger
                            className="!hidden w-full flex items-center justify-between p-3"
                            data-testid="cards-section-places-toggle"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                                    Places & NPCs
                                </span>

                                <span className="text-[10px] text-zinc-500">
                                    {placesPeople.length}
                                </span>
                            </div>

                            {openSections.places ? (
                                <ChevronDown className="w-4 h-4 text-zinc-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-zinc-500" />
                            )}
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-3 pt-3 pb-3">
                            <div className="space-y-3">

                                <Dialog
                                    open={
                                        showAddPlacePerson
                                    }
                                    onOpenChange={
                                        setShowAddPlacePerson
                                    }
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            className="w-full btn-secondary"
                                            data-testid="add-place-person-btn"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Place or NPC
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle className="text-zinc-100 font-heading">
                                                Add Place or NPC
                                            </DialogTitle>

                                            <DialogDescription className="text-zinc-400">
                                                Track important locations,
                                                people, and animals.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-3">

                                            {/* Name */}
                                            <Input
                                                placeholder="Name"
                                                value={
                                                    newPlaceName
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setNewPlaceName(
                                                        event.target
                                                            .value
                                                    )
                                                }
                                                className="input-geist"
                                                data-testid="place-person-name-input"
                                            />

                                            {/* Entry Type */}
                                            <Select
                                                value={
                                                    newPlaceType
                                                }
                                                onValueChange={(
                                                    value
                                                ) => {
                                                    setNewPlaceType(
                                                        value
                                                    );

                                                    setNewPlaceStatus(
                                                        ""
                                                    );

                                                    setNewPlaceRelationship(
                                                        ""
                                                    );
                                                }}
                                            >
                                                <SelectTrigger
                                                    className="bg-zinc-900/50 border-zinc-800"
                                                    data-testid="place-person-type-select"
                                                >
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>

                                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                                    <SelectItem
                                                        value="place"
                                                        className="text-zinc-200"
                                                    >
                                                        Place
                                                    </SelectItem>

                                                    <SelectItem
                                                        value="person"
                                                        className="text-zinc-200"
                                                    >
                                                        Person
                                                    </SelectItem>

                                                    <SelectItem
                                                        value="animal"
                                                        className="text-zinc-200"
                                                    >
                                                        Animal
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {/* Person Type / Subtype */}
                                            {newPlaceType ===
                                                "person" && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                                            Type
                                                        </label>

                                                        <Select
                                                            value={
                                                                newPersonType
                                                            }
                                                            onValueChange={(
                                                                value
                                                            ) => {
                                                                setNewPersonType(
                                                                    value
                                                                );

                                                                setNewPersonSubtype(
                                                                    PERSON_SUBTYPE_OPTIONS[
                                                                        value
                                                                    ]?.[0] ||
                                                                        ""
                                                                );
                                                            }}
                                                        >
                                                            <SelectTrigger
                                                                className="bg-zinc-900/50 border-zinc-800"
                                                                data-testid="place-person-person-type-select"
                                                            >
                                                                <SelectValue placeholder="Type" />
                                                            </SelectTrigger>

                                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                                {PERSON_TYPE_OPTIONS.map(
                                                                    (
                                                                        option
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option
                                                                            }
                                                                            value={
                                                                                option
                                                                            }
                                                                            className="text-zinc-200"
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                                            Subtype
                                                        </label>

                                                        <Select
                                                            value={
                                                                newPersonSubtype
                                                            }
                                                            onValueChange={
                                                                setNewPersonSubtype
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className="bg-zinc-900/50 border-zinc-800"
                                                                data-testid="place-person-person-subtype-select"
                                                            >
                                                                <SelectValue placeholder="Subtype" />
                                                            </SelectTrigger>

                                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                                {(
                                                                    PERSON_SUBTYPE_OPTIONS[
                                                                        newPersonType
                                                                    ] ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        option
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option
                                                                            }
                                                                            value={
                                                                                option
                                                                            }
                                                                            className="text-zinc-200"
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Animal Species */}
                                            {newPlaceType ===
                                                "animal" && (
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                                        Species
                                                    </label>

                                                    <Input
                                                        value={
                                                            newAnimalSpecies
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setNewAnimalSpecies(
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="e.g., Dog, Cat, Horse"
                                                        className="input-geist mt-0.5"
                                                        data-testid="place-animal-species-input"
                                                    />
                                                </div>
                                            )}

                                            {/* Description */}
                                            <Textarea
                                                placeholder="Description"
                                                value={
                                                    newPlaceDescription
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setNewPlaceDescription(
                                                        event.target
                                                            .value
                                                    )
                                                }
                                                className="input-geist min-h-[60px]"
                                                data-testid="place-person-description-input"
                                            />

                                            {/* Status */}
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                                    Status
                                                </label>

                                                <Select
                                                    value={
                                                        newPlaceStatus
                                                    }
                                                    onValueChange={
                                                        setNewPlaceStatus
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className="bg-zinc-900/50 border-zinc-800"
                                                        data-testid="place-person-status-select"
                                                    >
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>

                                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                                        {(
                                                            newPlaceType ===
                                                            "place"
                                                                ? PLACE_STATUS_OPTIONS
                                                                : PERSON_STATUS_OPTIONS
                                                        ).map(
                                                            (
                                                                option
                                                            ) => (
                                                                <SelectItem
                                                                    key={
                                                                        option
                                                                    }
                                                                    value={
                                                                        option
                                                                    }
                                                                    className="text-zinc-200"
                                                                >
                                                                    {
                                                                        option
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Relationship — Person / Animal */}
                                            {newPlaceType !==
                                                "place" && (
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                                        Relationship
                                                    </label>

                                                    <Select
                                                        value={
                                                            newPlaceRelationship
                                                        }
                                                        onValueChange={
                                                            setNewPlaceRelationship
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            className="bg-zinc-900/50 border-zinc-800"
                                                            data-testid="place-person-relationship-select"
                                                        >
                                                            <SelectValue placeholder="Select relationship" />
                                                        </SelectTrigger>

                                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                                            {PERSON_RELATIONSHIP_OPTIONS.map(
                                                                (
                                                                    option
                                                                ) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option
                                                                        }
                                                                        value={
                                                                            option
                                                                        }
                                                                        className="text-zinc-200"
                                                                    >
                                                                        {
                                                                            option
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            <Button
                                                onClick={
                                                    handleAddPlacePerson
                                                }
                                                className="w-full btn-primary"
                                                disabled={
                                                    !newPlaceName.trim()
                                                }
                                                data-testid="place-person-save-btn"
                                            >
                                                Add Entry
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {sortedPlacesPeople.length ===
                                0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-zinc-500 text-sm">
                                            No places or NPCs yet
                                        </p>

                                        <p className="text-zinc-600 text-xs mt-1">
                                            Add notable people,
                                            animals, and locations
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className="space-y-2"
                                        data-testid="places-people-list"
                                    >
                                        {sortedPlacesPeople.map(
                                            (entry) => (
                                                <PlacePersonCard
                                                    key={
                                                        entry.id ||
                                                        entry.name
                                                    }
                                                    entry={
                                                        entry
                                                    }
                                                    onUpdate={(
                                                        updates
                                                    ) =>
                                                        handleUpdatePlacePerson(
                                                            entry.id,
                                                            updates
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        handleDeletePlacePerson(
                                                            entry.id
                                                        )
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                    {/* Case Truth Card */}
                    <Collapsible
                        open={openSections.caseTruth}
                        onOpenChange={() => toggleSection("caseTruth")}
                        className={openSections.caseTruth ? "bg-purple-950/30 border border-purple-500/30 rounded-sm" : "hidden"}
                    >
                        <CollapsibleTrigger className="!hidden w-full flex items-center justify-between p-3">
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

                        <CollapsibleContent className="px-3 pt-3 pb-3 space-y-3">
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
        </div>
    );
};
