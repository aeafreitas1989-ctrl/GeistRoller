import { useState, useMemo, useEffect } from "react";
import { Pencil, X, Plus, Info, Flame, Skull, Droplets, Wind, Bug, Mountain, Sparkles, Ghost, Zap, ChevronDown, ChevronRight, ChevronUp, ChevronLeft, Star, BookOpen } from "lucide-react";
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
import {
    MeritCard, CeremonyCard, PlacePersonCard, ConditionCard, HauntCard, KeyCard, ActiveSpellCard, CombatTrackerCard,
} from "./cards/CardComponents";

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
        combat: true,
    });
    const [showCeremonyRollDialog, setShowCeremonyRollDialog] = useState(false);
    const [selectedCeremony, setSelectedCeremony] = useState(null);
    const [ceremonyRollResult, setCeremonyRollResult] = useState(null);
    const [rollingCeremony, setRollingCeremony] = useState(false);
    const [generatingCaseTruth, setGeneratingCaseTruth] = useState(false);

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
    const meritsList = activeCharacter?.merits_list || [];
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
    const normalDefense = Math.min(dexterity, wits) + athletics + mageArmorDefenseBonus;
    const initiativeModifier = dexterity + composure;
    const speed = strength + dexterity + 5;

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
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleGenerateCaseTruth = async () => {
        if (!activeCharacter?.id || !onGenerateCaseTruth || generatingCaseTruth) return;

        try {
            setGeneratingCaseTruth(true);
            await onGenerateCaseTruth(activeCharacter.id);
        } finally {
            setGeneratingCaseTruth(false);
        }
    };

    const hauntCount = Object.values(haunts).filter((v) => v > 0).length;

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
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Cards</span>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {/* Case Truth Card */}
                    <Collapsible
                        open={openSections.caseTruth}
                        onOpenChange={() => toggleSection("caseTruth")}
                        className="mb-4 bg-purple-950/30 border border-purple-500/30 rounded-sm"
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
                            <Button
                                onClick={handleGenerateCaseTruth}
                                disabled={!activeCharacter?.id || generatingCaseTruth}
                                className="w-full btn-primary"
                                data-testid="generate-case-file-btn"
                            >
                                {generatingCaseTruth ? "Filling Empty Case File Slots..." : "Fill Empty Case File Slots"}
                            </Button>

                            <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
                                {activeCharacter?.case_truth?.trim() || "No case file has been generated for this character yet."}
                            </pre>
                        </CollapsibleContent>
                    </Collapsible>
                        <Collapsible
                            open={openSections.combat}
                            onOpenChange={() => toggleSection("combat")}
                            className="bg-zinc-900/40 border border-zinc-800 rounded-sm"
                            data-testid="cards-section-combat"
                        >
                            <CollapsibleTrigger className="w-full flex items-center justify-between p-3" data-testid="cards-section-combat-toggle">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Combat</span>
                                    <span className="text-[10px] text-zinc-500">1</span>
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
                                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Active Spells</span>
                                    <span className="text-[10px] text-zinc-500">{activeSpells.length}</span>
                                </div>
                                {openSections.activeSpells ? (
                                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                                )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-3 pb-3">
                                {activeSpells.length === 0 ? (
                                    <div className="text-center py-6">
                                        <p className="text-zinc-500 text-sm">No active spells</p>
                                        <p className="text-zinc-600 text-xs mt-1">Spells cast with Advanced Duration appear here</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2" data-testid="active-spells-list">
                                        {activeSpells.map((spell) => (
                                            <ActiveSpellCard
                                                key={spell.id || `${spell.name}-${spell.arcanum}-${spell.practice}`}
                                                spell={spell}
                                                onDispel={onDispelActiveSpell}
                                                onRelinquish={onRelinquishActiveSpell}
                                                onRelinquishSafely={onRelinquishActiveSpellSafely}
                                            />
                                        ))}
                                    </div>
                                )}
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