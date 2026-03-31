import { useState } from "react";
import { X, Plus, Info, Pencil, Flame, Skull, Droplets, Wind, Bug, Mountain, Sparkles, Ghost, Zap, ChevronDown, ChevronRight, Star, Dices, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    CardTypeColors, MERIT_CATEGORY_COLORS,
    PERSON_TYPE_OPTIONS, PERSON_SUBTYPE_OPTIONS,
    PERSON_TYPE_STYLES, PERSON_SUBTYPE_STYLES, SUPERNATURAL_SUBTYPE_STYLES, EPHEMERAL_SUBTYPE_STYLES,
    PLACE_STATUS_OPTIONS, PLACE_STATUS_STYLES, PERSON_STATUS_OPTIONS, PERSON_STATUS_STYLES,
    PERSON_RELATIONSHIP_OPTIONS, PERSON_RELATIONSHIP_STYLES,
    HAUNT_DEFINITIONS, KEY_DEFINITIONS,
} from "../../data/cards-data";

export const MeritCard = ({ merit, definition }) => {
    const [expanded, setExpanded] = useState(false);
    const categoryColor = MERIT_CATEGORY_COLORS[definition?.category] || MERIT_CATEGORY_COLORS["Social"];
    const dots = merit.dots || 0;
    
    return (
        <div 
            className={`rounded-sm border p-2 transition-all cursor-pointer ${CardTypeColors.merit.bg} ${CardTypeColors.merit.border}`}
            onClick={() => setExpanded(!expanded)}
            data-testid={`merit-card-${merit.name?.toLowerCase().replace(/\s+/g, '-')}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-medium ${CardTypeColors.merit.text}`}>{merit.name}</h4>
                        <span className="text-amber-400 text-xs tracking-tight">
                            {"●".repeat(dots)}{"○".repeat((definition?.maxDots || 5) - dots)}
                        </span>
                    </div>
                    {definition?.category && (
                        <span className={`inline-block mt-1 px-1.5 py-0.5 text-[9px] uppercase tracking-wider rounded border ${categoryColor}`}>
                            {definition.category}
                        </span>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </div>
            
            {expanded && definition?.description && (
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {definition.description}
                </p>
            )}
        </div>
    );
};

// Ceremony Card component
export const CeremonyCard = ({ name, ceremony, onActivate }) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
        <div 
            className={`rounded-sm border p-2 transition-all ${CardTypeColors.ceremony.bg} ${CardTypeColors.ceremony.border}`}
            data-testid={`ceremony-card-${name?.toLowerCase().replace(/\s+/g, '-')}`}
        >
            <div 
                className="flex items-start justify-between gap-2 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-medium ${CardTypeColors.ceremony.text}`}>{name}</h4>
                        <span className="text-fuchsia-400 text-xs tracking-tight">
                            {"●".repeat(ceremony.dots)}
                        </span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">
                        {ceremony.dicePool}
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </div>
            
            {expanded && (
                <div className="mt-2 space-y-2">
                    <div className="text-[10px] text-zinc-400">
                        <span className="text-zinc-500">Duration:</span> {ceremony.duration}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        {ceremony.description}
                    </p>
                    <Button 
                        size="sm" 
                        className="w-full btn-secondary text-xs h-7"
                        onClick={(e) => {
                            e.stopPropagation();
                            onActivate(name, ceremony);
                        }}
                        data-testid={`ceremony-roll-${name?.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                        <Sparkles className="w-3 h-3 mr-1" /> Roll Ceremony
                    </Button>
                </div>
            )}
        </div>
    );
};

export const PlacePersonCard = ({ entry, onUpdate, onDelete }) => {
    const entryId = entry.id || entry.name || "entry";
    const isPerson = entry.type === "person";
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [editData, setEditData] = useState({
        name: entry.name || "",
        type: entry.type || "place",
        description: entry.description || "",
        status: entry.status || "",
        relationship: entry.relationship || "",
        person_type: entry.person_type || "Mundane",
        person_subtype: entry.person_subtype || "Aware",
    });

    const typeLabel = entry.type === "person" ? "Person" : "Place";
    const badgeClasses = entry.type === "person"
        ? "bg-indigo-900/40 border-indigo-500/40 text-indigo-300"
        : "bg-amber-900/40 border-amber-500/40 text-amber-300";

    const handleSave = () => {
        onUpdate({
            name: editData.name.trim(),
            type: editData.type,
            description: editData.description.trim(),
            status: editData.status.trim(),
            relationship: editData.type === "person" ? editData.relationship.trim() : "",
            person_type: editData.type === "person" ? editData.person_type : "",
            person_subtype: editData.type === "person" ? editData.person_subtype : "",
        });
        setIsEditing(false);
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-3" data-testid={`place-person-card-${entryId.toString().toLowerCase().replace(/\s+/g, '-')}`}>
            {isEditing ? (
                <div className="space-y-2">
                    <Select value={editData.type} onValueChange={(v) => setEditData({ ...editData, type: v })}>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs" data-testid={`place-person-${entryId}-type-select`}>
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="place" className="text-zinc-200">Place</SelectItem>
                            <SelectItem value="person" className="text-zinc-200">Person</SelectItem>
                        </SelectContent>
                    </Select>
                    {editData.type === "person" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Type</label>
                                <Select
                                    value={editData.person_type}
                                    onValueChange={(v) =>
                                        setEditData({
                                            ...editData,
                                            person_type: v,
                                            person_subtype: PERSON_SUBTYPE_OPTIONS[v]?.[0] || "",
                                        })
                                    }
                                >
                                    <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs" data-testid={`place-person-${entryId}-person-type-select`}>
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
                                {editData.type === "person" && (
                                    <Select
                                        value={editData.person_subtype}
                                        onValueChange={(v) => setEditData({ ...editData, person_subtype: v })}
                                    >
                                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs" data-testid={`place-person-${entryId}-person-subtype-select`}>
                                            <SelectValue placeholder="Subtype" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            {(PERSON_SUBTYPE_OPTIONS[editData.person_type] || []).map((option) => (
                                                <SelectItem key={option} value={option} className="text-zinc-200">
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                    )}
                    <Textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        placeholder="Description"
                        className="input-geist min-h-[50px] text-xs"
                        data-testid={`place-person-${entryId}-description-input`}
                    />
                    <Select
                        value={editData.status}
                        onValueChange={(v) => setEditData({ ...editData, status: v })}
                    >
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {(editData.type === "place" ? PLACE_STATUS_OPTIONS : PERSON_STATUS_OPTIONS).map((option) => (
                                <SelectItem key={option} value={option} className="text-zinc-200">
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={editData.relationship}
                        onValueChange={(v) => setEditData({ ...editData, relationship: v })}
                    >
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs">
                            <SelectValue placeholder="Relationship" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {PERSON_RELATIONSHIP_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option} className="text-zinc-200">
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave} className="btn-primary text-xs h-6 flex-1" data-testid={`place-person-${entryId}-save`}>
                            Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="text-xs h-6" data-testid={`place-person-${entryId}-cancel`}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {/* Top line: [Place/Person tag] Name (buttons aligned with this line) */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${badgeClasses}`}>
                                    {typeLabel}
                                </span>

                                <h4
                                    className="text-sm text-zinc-100 font-heading"
                                    data-testid={`place-person-${entryId}-name`}
                                >
                                    {entry.name}
                                </h4>
                            </div>

                            {/* Second line: all other tags under the name */}
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                                {entry.type === "person" && entry.person_subtype && (
                                    <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded border ${entry.person_type === "Mundane" ? (PERSON_SUBTYPE_STYLES[entry.person_subtype] || "bg-zinc-800/60 border-zinc-600/40 text-zinc-200") : entry.person_type === "Supernatural" ? (SUPERNATURAL_SUBTYPE_STYLES[entry.person_subtype] || "bg-zinc-800/60 border-zinc-600/40 text-zinc-200") : entry.person_type === "Ephemeral" ? (EPHEMERAL_SUBTYPE_STYLES[entry.person_subtype] || "bg-zinc-800/60 border-zinc-600/40 text-zinc-200") : "bg-zinc-800/60 border-zinc-600/40 text-zinc-200"}`}
                                        data-testid={`place-person-${entryId}-person-subtype`}
                                    >
                                        {entry.person_subtype}
                                    </span>
                                )}

                                {entry.status && (
                                    <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded border ${entry.type === "place" ? (PLACE_STATUS_STYLES[entry.status] || "bg-zinc-900/60 border-zinc-700/40 text-zinc-300") : (PERSON_STATUS_STYLES[entry.status] || "bg-zinc-900/60 border-zinc-700/40 text-zinc-300")}`}                                        data-testid={`place-person-${entryId}-status`}
                                    >
                                        {entry.status}
                                    </span>
                                )}

                                {entry.type === "person" && entry.relationship && (
                                    <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded border ${PERSON_RELATIONSHIP_STYLES[entry.relationship] || "bg-zinc-800/60 border-zinc-600/40 text-zinc-200"}`}
                                        data-testid={`place-person-${entryId}-relationship`}
                                    >
                                        {entry.relationship}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Buttons aligned with name line */}
                        <div className="flex items-center gap-1 ml-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setIsExpanded((prev) => !prev)}
                                className="h-6 w-6 text-zinc-500 hover:text-amber-400"
                                data-testid={`place-person-${entryId}-edit`}
                            >
                                <Info className="w-3 h-3" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setIsEditing(true)}
                                className="h-6 w-6 text-zinc-500 hover:text-cyan-400"
                                data-testid={`place-person-${entryId}-edit-mode`}
                            >
                                <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={onDelete}
                                className="h-6 w-6 text-zinc-500 hover:text-red-400"
                                data-testid={`place-person-${entryId}-delete`}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    {isExpanded && entry.description && (
                        <p
                            className="text-xs text-zinc-400"
                            data-testid={`place-person-${entryId}-description`}
                        >
                            {entry.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export const ConditionCard = ({ name, type, description, resolution, origin, onRemove, onResolve, conditionIndex }) => {
    const colors = CardTypeColors[type] || CardTypeColors.custom;
    const safeName = typeof name === "string" ? name : String(name);
    const originLabel = origin || (type === "tilt" ? "Tilt" : type === "geist" ? "Geist" : type === "condition" ? "Condition" : "Custom");
    
    return (
        <div 
            className={`${colors.bg} ${colors.border} border rounded-sm p-3 relative group transition-all hover:scale-[1.02]`}
            data-testid={`condition-card-${safeName.toLowerCase().replace(/\s+/g, '-')}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${colors.badge} ${colors.text} font-mono uppercase`}>
                            {type}
                        </span>
                        <h4 className={`font-heading text-sm font-semibold ${colors.text} truncate`}>
                            {name}
                        </h4>
                    </div>
                    <p className="text-[10px] text-zinc-500 mb-1" data-testid={`condition-origin-${safeName.toLowerCase().replace(/\s+/g, '-')}`}>
                        from {originLabel}
                    </p>
                    <p className="text-xs text-zinc-400 line-clamp-2">{description}</p>
                    {resolution && (
                        <p className="text-xs text-zinc-500 mt-1 italic">
                            Resolution: {resolution}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                    {onResolve && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onResolve(conditionIndex)}
                            className="h-6 px-2 text-[10px] text-amber-400 hover:text-amber-300 hover:bg-amber-900/30 border border-transparent hover:border-amber-500/30"
                            data-testid={`resolve-condition-${safeName.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            <Star className="w-3 h-3 mr-1" />
                            Resolve
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(conditionIndex)}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 self-end"
                        data-testid={`remove-condition-${safeName.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
};



export const HauntCard = ({
    name,
    rating,
    definition,
    onRatingChange,
    activeCondition,
    conditionIndex,
    onUpdateCondition,
    onRemoveCondition,
}) => {
    const colors = CardTypeColors.haunt;
    const [expanded, setExpanded] = useState(false);

    const charges = Number(activeCondition?.charges);
    const hasChargeTrack = Number.isFinite(charges) && charges >= 0;
    const safeHauntKey = name.toLowerCase().replace(/\s+/g, '-');

    const spendCharge = async () => {
        if (!onUpdateCondition || conditionIndex === undefined || conditionIndex === null) return;
        if (!Number.isFinite(charges) || charges <= 0) return;
        await onUpdateCondition(conditionIndex, { charges: charges - 1 });
    };
    
    return (
        <div 
            className={`${colors.bg} ${colors.border} border rounded-sm p-3 transition-all`}
            data-testid={`haunt-card-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-heading text-sm font-semibold ${colors.text}`}>
                            {name}
                        </h4>
                        {definition.burden !== "Any" && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-900/30 text-cyan-400 font-mono">
                                {definition.burden}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{definition.activation}</p>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-zinc-500 hover:text-cyan-400"
                    onClick={() => setExpanded(!expanded)}
                    data-testid={`haunt-expand-${name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                    <Info className="w-3 h-3" />
                </Button>
            </div>
            
            <p className="text-xs text-zinc-400 mb-2">{definition.description}</p>

            {/* Charge Counters (when the corresponding Haunt Condition is active) */}
            {activeCondition && hasChargeTrack && (
                <div className="mb-2" data-testid={`haunt-${safeHauntKey}-charges`}>
                    {charges > 0 ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Charges</span>
                            <div className="flex flex-wrap gap-1">
                                {Array.from({ length: charges }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={spendCharge}
                                        className="h-4 w-4 rounded-full bg-amber-900/40 border border-amber-500/40 hover:bg-amber-900/60"
                                        title="Spend 1 charge"
                                        data-testid={`haunt-${safeHauntKey}-charge-${i}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] text-zinc-600">(click to spend)</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 rounded-sm p-2">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Charges spent</span>
                            {onRemoveCondition && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-[10px] text-amber-400 hover:text-amber-300 hover:bg-amber-900/30 border border-transparent hover:border-amber-500/30"
                                    onClick={() => onRemoveCondition(conditionIndex)}
                                    data-testid={`haunt-${safeHauntKey}-end-condition`}
                                >
                                    End Condition
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => onRatingChange(name, i + 1 === rating ? i : i + 1)}
                        className={`w-7 h-7 rounded-sm border transition-all text-xs font-mono flex items-center justify-center ${
                            i < rating
                                ? "bg-cyan-500/30 border-cyan-500/50 text-cyan-300"
                                : "bg-zinc-900 border-zinc-700 text-zinc-600 hover:border-zinc-600"
                        }`}
                        data-testid={`haunt-dot-${name.toLowerCase().replace(/\s+/g, '-')}-${i}`}
                    >
                        {"•".repeat(i + 1)}
                    </button>
                ))}
            </div>
            
            {expanded && (
                <div className="mt-3 pt-3 border-t border-cyan-500/20 space-y-1">
                    {definition.abilities.map((ability, i) => (
                        <p key={i} className="text-xs text-zinc-400">{ability}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export const KeyCard = ({ name, active, definition, onToggle, locked = false, sourceBadges = [], isDoomed = false, doomSource = "" }) => {
    const colors = CardTypeColors.key;
    const [expanded, setExpanded] = useState(false);
    
    return (
        <div
            className={`w-full text-left p-3 rounded-sm border transition-all ${
                active
                    ? `${colors.bg} ${colors.border}`
                    : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
            } ${isDoomed ? "ring-1 ring-rose-500/40" : ""}`}
            data-testid={`key-card-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
            <div className="flex items-center justify-between mb-1">
                <button 
                    onClick={() => !locked && onToggle(name)}
                    className="flex items-center gap-2 flex-1"
                    data-testid={`key-toggle-${name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                    <div className={`w-4 h-4 rounded-full border-2 transition-all flex-shrink-0 ${
                        active ? "bg-amber-500 border-amber-400" : "border-zinc-600"
                    }`} />
                    <h4 className={`font-heading text-sm font-semibold ${active ? colors.text : "text-zinc-500"}`}>
                        {definition.fullName}
                    </h4>
                    {sourceBadges.length > 0 && (
                        <span className="text-[9px] text-amber-200">[{sourceBadges.join("+")}]</span>
                    )}
                    {locked && (
                        <span className="text-[9px] text-rose-300 uppercase">Locked</span>
                    )}
                </button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-zinc-500 hover:text-amber-400"
                    onClick={() => setExpanded(!expanded)}
                    data-testid={`key-info-${name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                    <Info className="w-3 h-3" />
                </Button>
            </div>
            
            <p className={`text-xs mb-1 ${active ? "text-zinc-400" : "text-zinc-600"}`}>
                <span className="font-mono text-amber-400/70">Unlock:</span> {definition.unlockAttribute}
            </p>
            <p className={`text-xs ${active ? "text-zinc-500" : "text-zinc-600"}`}>
                {definition.description}
            </p>
            {isDoomed && (
                <p className="text-xs text-rose-400 mt-1" data-testid={`key-doomed-${name.toLowerCase().replace(/\s+/g, '-')}`}>
                    Doomed: {doomSource || "Source locked"}
                </p>
            )}
            
            {expanded && (
                <div className={`mt-3 pt-3 border-t ${active ? "border-amber-500/20" : "border-zinc-800"} space-y-2 text-xs`}>
                    <div>
                        <span className="font-mono text-amber-400/70">Resonance:</span>
                        <span className="text-zinc-400 ml-1">{definition.resonance}</span>
                    </div>
                    <div>
                        <span className="font-mono text-rose-400/70">Doom:</span>
                        <span className="text-zinc-400 ml-1">{definition.doom}</span>
                    </div>
                    <div>
                        <span className="font-mono text-cyan-400/70">Haunt Effect:</span>
                        <span className="text-zinc-400 ml-1">{definition.hauntEffect}</span>
                    </div>
                    <div>
                        <span className="font-mono text-teal-400/70">Plasm:</span>
                        <span className="text-zinc-400 ml-1">{definition.plasm}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

