import { needsParadoxSuccesses, validParadoxSuccesses } from "../../utils/abyssalSpellcasting";
import { remainingScourings } from "../../utils/mageRecovery";
import { toast } from "sonner";
import { isAbyssalTaint, isAbyssalCondition } from "../../utils/abyssalConditions";
import { useEffect, useMemo, useState } from "react";
import { Plus, ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { ConditionCard } from "../cards/ConditionCard";
import { getDisplayedConditionRules } from "../../utils/condition-display";
import { shelterMitigatesTilt } from "../../utils/environmentalTilts";
import { getEffectTimer, isEffectExpired } from "../../utils/effectDuration";

import {
    CONDITION_DEFINITIONS,
    CONDITION_FILTER_OPTIONS,
    CardTypeColors,
} from "../../data/cards-data";


const CONDITION_GROUP_ORDER = {
    condition: 0,
    "tilt-environmental": 1,
    "tilt-personal": 2,
};

const CONDITION_GROUP_LABELS = {
    condition: "Conditions",
    "tilt-environmental": "Environmental Tilts",
    "tilt-personal": "Personal Tilts",
};

const SHELTER_MITIGATED_TILTS = new Set([
    "Extreme Cold",
    "Extreme Heat",
    "Heavy Rain",
    "Heavy Winds",
    "Blizzard",
]);

export const ConditionsSection = ({
    open,
    onToggle,
    navMode = false,
    activeCharacter,
    activeConditions = [],
    onAddCondition,
    onRemoveCondition,
    onResolveCondition,
    onScourAbyssal,
    onSetAbyssalSuccesses,
}) => {
    const [showAddCondition, setShowAddCondition] = useState(false);
    const [customConditionName, setCustomConditionName] = useState("");
    const [customConditionDesc, setCustomConditionDesc] = useState("");
    const [conditionOrigin, setConditionOrigin] = useState("");
    const [conditionBeatType, setConditionBeatType] = useState("regular");
    const [conditionDuration, setConditionDuration] = useState("none");
    const [paradoxSuccesses, setParadoxSuccesses] = useState("");
    const [conditionTarget, setConditionTarget] = useState("character");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);

    useEffect(() => {
        setConditionTarget("character");
    }, [activeCharacter?.id]);

    const familiar =
        activeCharacter?.familiar || {};

    const familiarMerit =
        (activeCharacter?.merits_list || []).find(
            (merit) =>
                (merit?.name || "") === "Familiar" &&
                Number(merit?.dots) >= 2
        );

    const hasFamiliar =
        Boolean(familiarMerit);

    const familiarName =
        familiar?.name?.trim() ||
        "Familiar";

    const bondedNpcs =
        (activeCharacter?.places_people || [])
            .filter(
                (entry) =>
                    (
                        entry?.type === "person" ||
                        entry?.type === "animal"
                    ) &&
                    entry?.relationship === "Bonded"
            )
            .sort(
                (a, b) =>
                    (a?.name || "").localeCompare(
                        b?.name || ""
                    )
            );

    const toggleFilter = (filter) => {
        setSelectedFilters((current) => {
            if (current.includes(filter)) {
                return current.filter(
                    (item) => item !== filter
                );
            }

            return [
                ...current,
                filter,
            ];
        });
    };

    const filteredConditions =
        useMemo(() => {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            return Object.entries(
                CONDITION_DEFINITIONS
            )
                .filter(
                    ([
                        definitionKey,
                        definition,
                    ]) => {
                        const displayName =
                            definition?.name ||
                            definitionKey;

                        const searchableText =
                            [
                                definitionKey,
                                displayName,
                                definition?.splat || "",
                                definition?.type || "",
                                definition?.group || "",
                                definition?.effect || "",
                                definition?.description || "",
                                definition?.resolution || "",
                            ]
                                .join(" ")
                                .toLowerCase();

                        const matchesSearch =
                            !search ||
                            searchableText.includes(
                                search
                            );

                        const definitionFilters =
                            definition?.filters ||
                            [];

                        const matchesFilters =
                            selectedFilters.length ===
                                0 ||
                            selectedFilters.every(
                                (filter) =>
                                    definitionFilters.includes(
                                        filter
                                    )
                            );

                        return (
                            matchesSearch &&
                            matchesFilters
                        );
                    }
                )
                .sort(
                    ([
                        keyA,
                        definitionA,
                    ], [
                        keyB,
                        definitionB,
                    ]) => {
                        const groupA =
                            definitionA?.group ||
                            (
                                definitionA?.type ===
                                "tilt"
                                    ? "tilt-personal"
                                    : "condition"
                            );

                        const groupB =
                            definitionB?.group ||
                            (
                                definitionB?.type ===
                                "tilt"
                                    ? "tilt-personal"
                                    : "condition"
                            );

                        const groupCompare =
                            (
                                CONDITION_GROUP_ORDER[
                                    groupA
                                ] ?? 99
                            ) -
                            (
                                CONDITION_GROUP_ORDER[
                                    groupB
                                ] ?? 99
                            );

                        if (
                            groupCompare !== 0
                        ) {
                            return groupCompare;
                        }

                        const nameA =
                            definitionA?.name ||
                            keyA;

                        const nameB =
                            definitionB?.name ||
                            keyB;

                        const nameCompare =
                            nameA.localeCompare(
                                nameB
                            );

                        if (
                            nameCompare !== 0
                        ) {
                            return nameCompare;
                        }

                        return (
                            definitionA?.splat ||
                            ""
                        ).localeCompare(
                            definitionB?.splat ||
                            ""
                        );
                    }
                );
        }, [
            searchTerm,
            selectedFilters,
        ]);

    const groupedConditions =
        useMemo(() => {
            const groups = [];

            for (
                const [
                    definitionKey,
                    definition,
                ] of filteredConditions
            ) {
                const group =
                    definition?.group ||
                    (
                        definition?.type ===
                        "tilt"
                            ? "tilt-personal"
                            : "condition"
                    );

                let existing =
                    groups.find(
                        (entry) =>
                            entry.group ===
                            group
                    );

                if (!existing) {
                    existing = {
                        group,
                        items: [],
                    };

                    groups.push(
                        existing
                    );
                }

                existing.items.push([
                    definitionKey,
                    definition,
                ]);
            }

            return groups;
        }, [filteredConditions]);

        const getSceneTarget = () => {
            const tracker =
                activeCharacter?.scene_tracker ||
                {};

            return {
                target_type: "scene",

                target_id: "scene",

                target_name:
                    tracker.location_name?.trim() ||
                    "Current Location",
            };
        };

        const getSelectedTarget = () => {
        if (
            conditionTarget === "familiar" &&
            hasFamiliar
        ) {
            return {
                target_type: "familiar",
                target_id: "familiar",
                target_name: familiarName,
            };
        }

        if (
            conditionTarget.startsWith("npc:")
        ) {
            const targetId =
                conditionTarget.slice(4);

            const npc =
                bondedNpcs.find(
                    (entry) =>
                        String(
                            entry?.id ??
                            entry?.name ??
                            ""
                        ) === targetId
                );

            if (npc) {
                return {
                    target_type: "npc",
                    target_id:
                        String(
                            npc?.id ??
                            npc?.name ??
                            ""
                        ),
                    target_name:
                        npc?.name ||
                        "NPC",
                };
            }
        }

        return {
            target_type: "character",
            target_id:
                activeCharacter?.id ||
                "character",
            target_name:
                activeCharacter?.name ||
                "Character",
        };
    };

    const resetConditionForm = () => {
        setSearchTerm("");
        setSelectedFilters([]);
        setConditionOrigin("");
        setConditionBeatType("regular");
        setConditionDuration("none");
        setParadoxSuccesses("");
        setConditionTarget("character");
        setCustomConditionName("");
        setCustomConditionDesc("");
    };

    const handleAddPredefinedCondition =
        (definitionKey) => {
            const condition =
                CONDITION_DEFINITIONS[
                    definitionKey
                ];

            if (!condition) {
                return;
            }

            const displayName =
                condition.name ||
                definitionKey;

            if (needsParadoxSuccesses(condition) && !validParadoxSuccesses(paradoxSuccesses)) {
                toast.error('Record the originating Paradox successes before adding this Condition.'); return;
            }
            const originOverride =
                conditionOrigin.trim();

            const fallbackOrigin =
                condition.origin ||
                condition.splat ||
                (
                    condition.type === "tilt"
                        ? "Tilt"
                        : condition.type === "geist"
                        ? "Geist"
                        : "Condition"
                );

            const isEnvironmentalTilt =
                condition.group ===
                "tilt-environmental";

            const target =
                isEnvironmentalTilt
                    ? getSceneTarget()
                    : getSelectedTarget();

            const mitigatedByShelter = isEnvironmentalTilt &&
                shelterMitigatesTilt(activeCharacter, activeCharacter?.scene_tracker || {}, displayName);

            const effect =
                condition.effect ||
                condition.description ||
                "";

            onAddCondition({
                name: displayName,
                ...(needsParadoxSuccesses(condition) ? {paradox_successes:Number(paradoxSuccesses)} : {}),
                definition_key:
                    definitionKey,

                type:
                    condition.type ||
                    "condition",

                group:
                    condition.group ||
                    "condition",

                persistent:
                    Boolean(
                        condition.persistent
                    ),

                beat_type: conditionBeatType,
                ...(conditionDuration !== "none" ? { duration: conditionDuration } : {}),

                splat:
                    condition.splat ||
                    "",

                effect,

                description:
                    condition.description || effect,

                resolution:
                    condition.resolution ||
                    "",

                shelter_mitigates:
                    isEnvironmentalTilt &&
                    SHELTER_MITIGATED_TILTS.has(
                        displayName
                    ),

                mitigated_by_shelter:
                    mitigatedByShelter,

                origin:
                    originOverride ||
                    fallbackOrigin,

                ...target,
            });

            setShowAddCondition(false);
            resetConditionForm();
        };

    const handleAddCustomCondition =
        () => {
            if (
                !customConditionName.trim()
            ) {
                return;
            }

            const target =
                getSelectedTarget();

            onAddCondition({
                name:
                    customConditionName.trim(),

                type: "custom",
                group: "condition",
                persistent: false,
                beat_type: conditionBeatType,
                ...(conditionDuration !== "none" ? { duration: conditionDuration } : {}),
                splat: "Custom",

                effect:
                    customConditionDesc.trim() ||
                    "Custom condition",

                description:
                    customConditionDesc.trim() ||
                    "Custom condition",

                resolution: "",

                origin:
                    conditionOrigin.trim() ||
                    "Custom",

                ...target,
            });

            setShowAddCondition(false);
            resetConditionForm();
        };

    return (
        <Collapsible
            open={open}
            onOpenChange={onToggle}
            className={navMode && !open ? "hidden" : "bg-zinc-900/40 border border-zinc-800 rounded-sm"}
            data-testid="cards-section-conditions"
        >
            <CollapsibleTrigger
                className={`${navMode ? "!hidden " : ""}w-full flex items-center justify-between p-3`}
                data-testid="cards-section-conditions-toggle"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                        Conditions
                    </span>

                    <span className="text-[10px] text-zinc-500">
                        {activeConditions.length}
                    </span>
                </div>

                {open ? (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                )}
            </CollapsibleTrigger>

            <CollapsibleContent className="px-3 pt-3 pb-3">
                <div className="space-y-3">

                    <Dialog
                        open={showAddCondition}
                        onOpenChange={(nextOpen) => {
                            setShowAddCondition(nextOpen);

                            if (!nextOpen) {
                                resetConditionForm();
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button
                                className="w-full btn-secondary"
                                data-testid="add-condition-btn"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Condition
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-zinc-100 font-heading">
                                    Add Condition
                                </DialogTitle>

                                <DialogDescription className="text-zinc-400">
                                    Select a Condition or Tilt, its source, and its target.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3">

                                <div className="space-y-1">
                                    <label htmlFor="add-condition-search" className="text-[10px] uppercase tracking-wider text-zinc-400">
                                        Search Conditions &amp; Tilts
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                        <Input
                                            id="add-condition-search"
                                            type="text"
                                            placeholder="Search name, effect or resolution..."
                                            value={searchTerm}
                                            onChange={(event) => setSearchTerm(event.target.value)}
                                            className="input-geist pl-9 pr-9"
                                            data-testid="search-conditions-input"
                                        />
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchTerm("")}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-zinc-400 hover:text-zinc-100"
                                                aria-label="Clear Condition search"
                                                data-testid="condition-search-clear"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-zinc-500" role="status">
                                        {filteredConditions.length} matching Conditions and Tilts
                                    </p>
                                </div>

                                {/* Filters */}
                                <div className="rounded-sm border border-zinc-800 bg-zinc-950/40 p-2">
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                                            Filters
                                        </span>

                                        {selectedFilters.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedFilters(
                                                        []
                                                    )
                                                }
                                                className="text-[10px] text-zinc-500 hover:text-zinc-200"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {CONDITION_FILTER_OPTIONS.map(
                                            (filter) => {
                                                const selected =
                                                    selectedFilters.includes(
                                                        filter
                                                    );

                                                return (
                                                    <button
                                                        key={
                                                            filter
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            toggleFilter(
                                                                filter
                                                            )
                                                        }
                                                        className={`px-2 py-1 rounded border text-[10px] transition-colors ${
                                                            selected
                                                                ? "bg-cyan-900/50 border-cyan-500/50 text-cyan-200"
                                                                : "bg-zinc-900/70 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                                                        }`}
                                                        data-testid={`condition-filter-${filter
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )}`}
                                                    >
                                                        {
                                                            filter
                                                        }
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>

                                    <p className="text-[9px] text-zinc-600 mt-2">
                                        Multiple filters show only entries shared by all selected filters.
                                    </p>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                        Origin / Source
                                    </label>

                                    <Input
                                        placeholder="e.g., Spellcasting, Exceptional Success, Lunacy"
                                        value={conditionOrigin}
                                        onChange={(event) =>
                                            setConditionOrigin(
                                                event.target.value
                                            )
                                        }
                                        className="input-geist mt-1"
                                        data-testid="condition-origin-input"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                        Beat Awarded on Resolve
                                    </label>

                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setConditionBeatType("regular")}
                                            className={`h-8 text-xs ${
                                                conditionBeatType === "regular"
                                                    ? "bg-amber-900/40 border-amber-500 text-amber-200"
                                                    : "bg-zinc-900 border-zinc-700 text-zinc-400"
                                            }`}
                                        >
                                            Regular
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setConditionBeatType("arcane")}
                                            className={`h-8 text-xs ${
                                                conditionBeatType === "arcane"
                                                    ? "bg-violet-900/40 border-violet-500 text-violet-200"
                                                    : "bg-zinc-900 border-zinc-700 text-zinc-400"
                                            }`}
                                        >
                                            Arcane
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                        Personal Target
                                    </label>

                                    <Select
                                        value={conditionTarget}
                                        onValueChange={
                                            setConditionTarget
                                        }
                                    >
                                        <SelectTrigger
                                            className="bg-zinc-900/50 border-zinc-800 mt-1"
                                            data-testid="condition-target-select"
                                        >
                                            <SelectValue placeholder="Select target" />
                                        </SelectTrigger>

                                        <SelectContent className="bg-zinc-900 border-zinc-800">

                                            <SelectItem
                                                value="character"
                                                className="text-zinc-200"
                                            >
                                                Character —{" "}
                                                {activeCharacter?.name ||
                                                    "Character"}
                                            </SelectItem>

                                            {hasFamiliar && (
                                                <SelectItem
                                                    value="familiar"
                                                    className="text-zinc-200"
                                                >
                                                    Familiar —{" "}
                                                    {familiarName}
                                                </SelectItem>
                                            )}

                                            {bondedNpcs.map(
                                                (npc) => {
                                                    const npcId =
                                                        String(
                                                            npc?.id ??
                                                            npc?.name ??
                                                            ""
                                                        );

                                                    const npcType =
                                                        npc?.type === "animal"
                                                            ? "Animal"
                                                            : "Person";

                                                    return (
                                                        <SelectItem
                                                            key={npcId}
                                                            value={`npc:${npcId}`}
                                                            className="text-zinc-200"
                                                        >
                                                            Bonded NPC —{" "}
                                                            {npc.name}{" "}
                                                            ({npcType})
                                                        </SelectItem>
                                                    );
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[9px] text-zinc-600 mt-1">
                                        Environmental Tilts automatically affect the current Location.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-wider text-zinc-400">Duration (optional)</label>
                                    <Select value={conditionDuration} onValueChange={setConditionDuration}>
                                        <SelectTrigger className="h-8 border-zinc-700 bg-zinc-900 text-xs" data-testid="condition-duration-select"><SelectValue /></SelectTrigger>
                                        <SelectContent className="border-zinc-700 bg-zinc-950">
                                            {['none', 'Scene', '1 turn', '2 turns', '3 turns', '5 turns', '1 minute', '10 minutes', '1 hour', '1 day', '1 week'].map((duration) => (
                                                <SelectItem key={duration} value={duration}>{duration === 'none' ? 'No automatic expiry' : duration}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-zinc-500">Normal expiry awards no Beat. Abyssal Conditions instead use Wisdom-based duration and award an Arcane Beat on lapse.</p>
                                </div>

                                {activeCharacter?.character_type === 'mage' && <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-wider text-zinc-400">Originating Paradox successes (Backlash / Imago)</label>
                                    <Input type="number" min="1" step="1" value={paradoxSuccesses} onChange={e=>setParadoxSuccesses(e.target.value)} placeholder="Required for Backlash or Imago" data-testid="abyssal-successes-input" className="h-8 text-xs" />
                                </div>}
                                {/* Sorted catalogue */}
                                <div className="max-h-[300px] overflow-y-auto pr-1">
                                    {groupedConditions.length === 0 ? (
                                        <div className="text-center py-6">
                                            <p className="text-xs text-zinc-500">
                                                No matching Conditions or Tilts.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {groupedConditions.map(
                                                ({
                                                    group,
                                                    items,
                                                }) => (
                                                    <div
                                                        key={
                                                            group
                                                        }
                                                    >
                                                        <div className="sticky top-0 z-10 bg-zinc-900/95 py-1 mb-1 border-b border-zinc-800">
                                                            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                                                                {CONDITION_GROUP_LABELS[
                                                                    group
                                                                ] ||
                                                                    group}
                                                            </span>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {items.map(
                                                                ([
                                                                    definitionKey,
                                                                    definition,
                                                                ]) => {
                                                                    const displayName =
                                                                        definition?.name ||
                                                                        definitionKey;

                                                                    const colors =
                                                                        CardTypeColors[
                                                                            definition?.type ||
                                                                            "custom"
                                                                        ] ||
                                                                        CardTypeColors.custom;

                                                                    return (
                                                                        <button
                                                                            key={
                                                                                definitionKey
                                                                            }
                                                                            onClick={() =>
                                                                                handleAddPredefinedCondition(
                                                                                    definitionKey
                                                                                )
                                                                            }
                                                                            className="w-full text-left p-2 rounded-sm bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                                                            data-testid={`condition-option-${definitionKey
                                                                                .toLowerCase()
                                                                                .replace(
                                                                                    /\s+/g,
                                                                                    "-"
                                                                                )}`}
                                                                        >
                                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                                <span
                                                                                    className={`text-[10px] px-1.5 py-0.5 rounded ${colors.badge} ${colors.text}`}
                                                                                >
                                                                                    {definition?.type ===
                                                                                    "tilt"
                                                                                        ? "TILT"
                                                                                        : "CONDITION"}
                                                                                </span>

                                                                                <span className="text-xs text-zinc-200">
                                                                                    {displayName}
                                                                                </span>

                                                                                {definition?.persistent && (
                                                                                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-amber-600/40 bg-amber-950/30 text-amber-300 uppercase tracking-wider">
                                                                                        Persistent
                                                                                    </span>
                                                                                )}

                                                                                {definition?.splat && (
                                                                                    <span className="text-[9px] text-zinc-500">
                                                                                        {definition.splat}
                                                                                    </span>
                                                                                )}
                                                                            </div>

                                                                            <p className="text-[10px] text-zinc-500 line-clamp-2">
                                                                                {definition?.effect ||
                                                                                    definition?.description}
                                                                            </p>
                                                                        </button>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Custom Condition */}
                                <div className="border-t border-zinc-800 pt-3">
                                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                                        Or Create Custom
                                    </h4>

                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Condition name"
                                            value={customConditionName}
                                            onChange={(event) =>
                                                setCustomConditionName(
                                                    event.target.value
                                                )
                                            }
                                            className="input-geist"
                                            data-testid="custom-condition-name"
                                        />

                                        <Textarea
                                            placeholder="Description (optional)"
                                            value={customConditionDesc}
                                            onChange={(event) =>
                                                setCustomConditionDesc(
                                                    event.target.value
                                                )
                                            }
                                            className="input-geist min-h-[60px]"
                                            data-testid="custom-condition-description"
                                        />

                                        <Button
                                            onClick={
                                                handleAddCustomCondition
                                            }
                                            className="w-full btn-primary"
                                            disabled={
                                                !customConditionName.trim()
                                            }
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
                            <p className="text-zinc-500 text-sm">
                                No active conditions
                            </p>

                            <p className="text-zinc-600 text-xs mt-1">
                                Add conditions to track status effects
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {activeConditions.map(
                                (condition, idx) => (
                                    <ConditionCard
                                        key={`${condition.name}-${idx}`}
                                        conditionIndex={idx}
                                        timer={getEffectTimer(condition, activeCharacter?.scene_tracker)}
                                        expired={isEffectExpired(condition, activeCharacter?.scene_tracker)}
                                        name={condition.name}
                                        beatType={isAbyssalTaint(condition) ? "none" : isAbyssalCondition(condition) ? "arcane-lapse" : condition.beat_type || "regular"}
                                        type={
                                            condition.type ||
                                            "custom"
                                        }
                                        persistent={
                                            Boolean(
                                                condition.persistent
                                            )
                                        }
                                        group={
                                            condition.group ||
                                            ""
                                        }
                                        mitigatedByShelter={condition.group === 'tilt-environmental' &&
                                            shelterMitigatesTilt(activeCharacter, activeCharacter?.scene_tracker || {}, condition.name)}
                                        splat={
                                            condition.splat ||
                                            ""
                                        }
                                        description={getDisplayedConditionRules(condition, CONDITION_DEFINITIONS).effect}
                                        resolution={getDisplayedConditionRules(condition, CONDITION_DEFINITIONS).resolution}
                                        sourceCitation={getDisplayedConditionRules(condition, CONDITION_DEFINITIONS).source}
                                        origin={
                                            condition.origin
                                        }
                                        targetName={
                                            condition.target_name ||
                                            activeCharacter?.name ||
                                            "Character"
                                        }
                                        onRemove={condition.weather_auto || isAbyssalTaint(condition) ? undefined : onRemoveCondition}
                                        onResolve={condition.weather_auto || isAbyssalTaint(condition) ? undefined : onResolveCondition}
                                        onScour={activeCharacter?.character_type === 'mage' && (isAbyssalCondition(condition)||isAbyssalTaint(condition)) && onScourAbyssal ? ()=>onScourAbyssal(condition) : undefined}
                                        scourDisabled={remainingScourings(activeCharacter?.pattern_scouring,activeCharacter?.gnosis,activeCharacter?.scene_tracker) <= 0}
                                        paradoxSuccesses={condition.paradox_successes}
                                        backlashSpent={condition.backlash_spent}
                                        onSetParadoxSuccesses={activeCharacter?.character_type === 'mage' && isAbyssalCondition(condition) && needsParadoxSuccesses(condition) && onSetAbyssalSuccesses ? value=>onSetAbyssalSuccesses(condition,value) : undefined}
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
