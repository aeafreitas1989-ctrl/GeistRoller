import { useState } from "react";
import { Plus, Trash2, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ARCANA, ORDER_ROTE_SKILLS, ARCANA_PRACTICES, SKILL_LIST } from "../../data/character-data";
import { isMageRulingArcanum, isMageInferiorArcanum } from "../../utils/mageCreationAudit";
import { StatDots, formatLabel } from "./StatComponents";
import { MageAttainmentsContent } from "./MageAttainmentsContent";

const getPracticesForDots = (dots = 1) => {
    const cappedDots = Math.max(1, dots || 1);
    const practices = [];

    for (let i = 1; i <= cappedDots; i += 1) {
        if (ARCANA_PRACTICES[i]) {
            practices.push(...ARCANA_PRACTICES[i]);
        }
    }

    return [...new Set(practices)];
};

const ALL_SPELL_PRACTICES = getPracticesForDots(5);

// Keep the required Arcana rating in saved Rote/Praxis data without a separate dot editor.
const requiredDotsForPractice = (practice) => {
    const entry = Object.entries(ARCANA_PRACTICES)
        .find(([, practices]) => practices.includes(practice));
    return entry ? Number(entry[0]) : 1;
};

// Primary Factor belongs to the spell; Scale is available only through Reach override.
const SpellPrimaryFactorSelect = ({ value, onChange, testId }) => (
    <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger
            className="h-6 w-[116px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0"
            aria-label="Primary Factor"
            title="Fixed Primary Factor of this spell"
            data-testid={testId}
        >
            <SelectValue placeholder="Primary Factor" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="potency" className="text-xs">Potency</SelectItem>
            <SelectItem value="duration" className="text-xs">Duration</SelectItem>
        </SelectContent>
    </Select>
);

// The spell's Withstand category is fixed; the target's rating is entered at casting.
const SPELL_WITHSTAND_TYPES = [
    { value: "resistance", label: "Resistance" },
    { value: "rank", label: "Rank" },
    { value: "gauntlet", label: "Gauntlet" },
    { value: "arcanum", label: "Arcanum" },
    { value: "other", label: "Other" },
];

const SpellWithstandSelect = ({ value, onChange, testId }) => (
    <div className="flex items-center gap-2">
        <Select value={value || undefined} onValueChange={onChange}>
            <SelectTrigger className="h-6 w-[116px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0" aria-label="Withstand" data-testid={testId}>
                <SelectValue placeholder="Withstand" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
                {SPELL_WITHSTAND_TYPES.map(({ value: id, label }) => (
                    <SelectItem key={id} value={id} className="text-xs">{label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        {value && <Button type="button" variant="ghost" size="sm" className="h-6 px-1 text-[10px]" onClick={() => onChange(null)} title="Not Withstood">Clear</Button>}
    </div>
);
const makePraxisId = () =>
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const createPraxisDraft = () => ({
    id: makePraxisId(),
    spell: "",
    arcanum: "Death",
    dots: 1,
    practice: getPracticesForDots(1)[0] || "",
    primary_factor: null,
    withstand_type: null,
});

export const MageArcanaContent = ({
    getValue, getNestedValue, handleChange, handleNestedChange,
    openSpellcastingPopup, onTriggerDiceRoll, onUpdateCharacter,
    onAddRecentRoll,
}) => {
    const [praxisDraft, setPraxisDraft] = useState(null);
    const [editingRotePrimaryFactor, setEditingRotePrimaryFactor] = useState(null);
    const [editingPraxisPrimaryFactor, setEditingPraxisPrimaryFactor] = useState(null);

    const learnedPraxes = Array.isArray(getValue("praxes"))
        ? getValue("praxes")
        : [];

    /*
     * Once the purchase is confirmed, the Praxis with this ID
     * appears in the character's actual Praxis list. At that point
     * the local draft is considered finished automatically.
     *
     * If the XP purchase is cancelled, it does NOT appear there,
     * so the draft remains available for another attempt.
     */
    const activePraxisDraft =
        praxisDraft &&
        !learnedPraxes.some(
            (praxis) =>
                praxis?.id &&
                praxis.id === praxisDraft.id
        )
            ? praxisDraft
            : null;

    const updatePraxisDraft = (patch) => {
        setPraxisDraft((current) =>
            current
                ? {
                      ...current,
                      ...patch,
                  }
                : current
        );
    };

    const learnPraxisDraft = () => {
        if (!activePraxisDraft) return;
        if (!activePraxisDraft.spell.trim()) return;
        if (!["potency", "duration"].includes(activePraxisDraft.primary_factor)) return;
        if (requiredDotsForPractice(activePraxisDraft.practice) > Number((getValue("arcana") || {})[activePraxisDraft.arcanum] || 0)) return;

        handleChange("praxes", [
            ...learnedPraxes,
            {
                ...activePraxisDraft,
                spell: activePraxisDraft.spell.trim(),
            },
        ]);
    };

    return (
        <>
            {/* Arcana for Mages */}
            <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Arcana
                    {getValue("path") && (
                        <span className="ml-2 text-[9px] font-normal">
                            <span className="text-blue-400">● Ruling</span>
                            <span className="text-red-400 ml-2">● Inferior</span>
                        </span>
                    )}
                </p>
                <div className="space-y-1">
                    {ARCANA.map((arcanum) => {
                        const arcanumRating = getNestedValue("arcana", arcanum) || 0;
                        const mageClassification = {
                            path: getValue("path") || "",
                            legacy_ruling_arcanum: getValue("legacy_ruling_arcanum") || "",
                        };
                        const isRuling = isMageRulingArcanum(mageClassification, arcanum);
                        const isInferior = isMageInferiorArcanum(mageClassification, arcanum);

                        let labelColor = arcanumRating > 0 ? "text-zinc-400" : "text-zinc-600";
                        if (isRuling) labelColor = "text-blue-400 font-medium";
                        if (isInferior) labelColor = "text-red-400";

                        let dotColor = "violet";
                        if (isRuling) dotColor = "blue";
                        if (isInferior) dotColor = "red";

                        const unlockedPractices = [];
                        for (let i = 1; i <= arcanumRating; i++) {
                            if (ARCANA_PRACTICES[i]) {
                                unlockedPractices.push(...ARCANA_PRACTICES[i]);
                            }
                        }

                        return (
                            <div key={arcanum} className="flex items-center justify-between group py-0.5">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <button
                                        onClick={() => arcanumRating > 0 && openSpellcastingPopup(arcanum)}
                                        disabled={arcanumRating === 0}
                                        className={`text-xs shrink-0 ${labelColor} ${arcanumRating > 0 ? 'hover:text-violet-300 cursor-pointer' : 'cursor-default'}`}
                                        data-testid={`arcanum-${arcanum.toLowerCase()}-cast`}
                                    >
                                        {arcanum}
                                        {isRuling && <span className="ml-1 text-[9px] text-blue-500">(R)</span>}
                                        {isInferior && <span className="ml-1 text-[9px] text-red-500">(I)</span>}
                                    </button>
                                    {arcanumRating > 0 && (
                                        <div className="flex flex-wrap gap-0.5 overflow-hidden">
                                            {unlockedPractices.map((practice, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => openSpellcastingPopup(arcanum, practice)}
                                                    className="text-[8px] px-1 py-0.5 rounded bg-violet-900/30 text-violet-400 hover:bg-violet-800/50 hover:text-violet-300 transition-colors"
                                                    data-testid={`arcanum-${arcanum.toLowerCase()}-practice-${practice.toLowerCase()}-cast`}
                                                >
                                                    {practice}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <StatDots value={arcanumRating} max={5} onChange={(v) => handleNestedChange("arcana", arcanum, v)} color={dotColor} size="small" testIdPrefix={`arcanum-${arcanum.toLowerCase()}`} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Rotes for Mages */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Rotes</p>
                    <Button 
                        size="sm" 
                        onClick={() => {
                            const rotes = getValue("rotes") || [];
                            handleChange("rotes", [...rotes, { spell: "", arcanum: "Death", dots: 1, practice: getPracticesForDots(1)[0] || "", skill: "occult", primary_factor: null, withstand_type: null, created_by_caster: false }]);
                            setEditingRotePrimaryFactor(rotes.length);
                        }} 
                        className="h-5 px-2 text-[10px] btn-secondary" 
                        data-testid="add-rote-btn"
                    >
                        <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                </div>
                <div className="space-y-2">
                    {(getValue("rotes") || []).length === 0 ? (
                        <p className="text-[10px] text-zinc-600 italic">No rotes learned</p>
                    ) : (
                        (getValue("rotes") || []).map((rote, index) => {
                            const currentOrder = getValue("order");
                            const roteIsOrderSkill = currentOrder && (ORDER_ROTE_SKILLS[currentOrder] || []).includes(rote.skill);
                            const rotePracticeOptions = ALL_SPELL_PRACTICES;
                            const roteArcanumDots = Number((getValue("arcana") || {})[rote.arcanum] || 0);
                            const rotePractice = rote.practice || rotePracticeOptions[0] || "";
                            return (
                            <div key={index} className="grid min-w-0 items-center gap-1.5 p-1.5 bg-zinc-900/30 border border-zinc-800 rounded-sm" style={{ gridTemplateColumns: "minmax(0, 1fr) 80px 110px 90px 24px 24px 24px" }}>
                                <Input
                                    value={rote.spell || ""}
                                    onChange={(e) => {
                                        const rotes = [...(getValue("rotes") || [])];
                                        rotes[index] = { ...rotes[index], spell: e.target.value };
                                        handleChange("rotes", rotes);
                                    }}
                                    placeholder="Spell"
                                    className="input-geist h-6 w-full min-w-0 flex-1 text-xs"
                                    data-testid={`rote-${index}-spell`}
                                />
                                <Select value={rote.arcanum || "Death"} onValueChange={(v) => {
                                    const rotes = [...(getValue("rotes") || [])];
                                    rotes[index] = { ...rotes[index], arcanum: v };
                                    handleChange("rotes", rotes);
                                }}>
                                    <SelectTrigger className="h-6 w-[80px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0" data-testid={`rote-${index}-arcanum`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {ARCANA.map(a => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Select value={rotePractice} onValueChange={(v) => {
                                    const rotes = [...(getValue("rotes") || [])];
                                    rotes[index] = { ...rotes[index], practice: v, dots: requiredDotsForPractice(v) };
                                    handleChange("rotes", rotes);
                                }}>
                                    <SelectTrigger className="h-6 w-[110px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0" data-testid={`rote-${index}-practice`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {rotePracticeOptions.map((practice) => (
                                            <SelectItem key={practice} value={practice} disabled={requiredDotsForPractice(practice) > roteArcanumDots} className="text-xs">
                                                {practice}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={rote.skill || "occult"} onValueChange={(v) => {
                                    const rotes = [...(getValue("rotes") || [])];
                                    rotes[index] = { ...rotes[index], skill: v };
                                    handleChange("rotes", rotes);
                                }}>
                                    <SelectTrigger className={`h-6 w-[90px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0 ${roteIsOrderSkill ? "text-amber-400" : ""}`} data-testid={`rote-${index}-skill`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[200px]">
                                        {SKILL_LIST.map(s => {
                                            const sIsOrder = currentOrder && (ORDER_ROTE_SKILLS[currentOrder] || []).includes(s);
                                            return <SelectItem key={s} value={s} className={`text-xs capitalize ${sIsOrder ? "text-amber-400" : ""}`}>{formatLabel(s)}</SelectItem>;
                                        })}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingRotePrimaryFactor((current) => current === index ? null : index)}
                                    className="h-6 px-1.5 text-[10px] text-zinc-400 hover:text-violet-300 shrink-0"
                                    title={rote.primary_factor ? `Edit Primary Factor (${rote.primary_factor})` : "Set Primary Factor"}
                                    aria-label="Edit Rote Primary Factor"
                                    data-testid={`rote-${index}-edit-primary-factor`}
                                >
                                    <Pencil className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" disabled={!rote.primary_factor || requiredDotsForPractice(rotePractice) > roteArcanumDots} title={!rote.primary_factor ? "Set Primary Factor before casting" : requiredDotsForPractice(rotePractice) > roteArcanumDots ? "Requires higher Arcanum" : "Cast Rote"} onClick={() => openSpellcastingPopup(rote.arcanum, rotePractice, "rote", rote.skill, rote.spell || "", rote.primary_factor, rote.withstand_type, rote.created_by_caster ? "creator" : "memory")} className="h-6 px-1.5 text-[10px] text-violet-400 hover:text-violet-300 shrink-0" data-testid={`rote-${index}-cast`}>
                                    <Sparkles className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { const rotes = (getValue("rotes") || []).filter((_, i) => i !== index); handleChange("rotes", rotes); setEditingRotePrimaryFactor(null); }} className="h-6 w-6 text-zinc-400 hover:text-red-400 shrink-0" data-testid={`rote-${index}-delete`}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                                {editingRotePrimaryFactor === index && (
                                    <div className="col-span-full flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-1.5 mt-1">
                                        <span className="text-[10px] text-zinc-400">Primary Factor (required)</span>
                                        <SpellPrimaryFactorSelect
                                            value={rote.primary_factor}
                                            onChange={(primary_factor) => {
                                                const rotes = [...(getValue("rotes") || [])];
                                                rotes[index] = { ...rotes[index], primary_factor };
                                                handleChange("rotes", rotes);

                                            }}
                                            testId={`rote-${index}-primary-factor`}
                                        />
                                        <span className="text-[10px] text-zinc-400">Withstand (optional)</span>
                                        <SpellWithstandSelect value={rote.withstand_type} onChange={(withstand_type) => {
                                            const rotes = [...(getValue("rotes") || [])];
                                            rotes[index] = { ...rotes[index], withstand_type };
                                            handleChange("rotes", rotes);
                                        }} testId={`rote-${index}-withstand`} />
                                        <label className="flex items-center gap-1 text-[10px] text-zinc-300" data-testid={`rote-${index}-creator-editor`}>
                                            <input type="checkbox" checked={!!rote.created_by_caster} onChange={(event) => {
                                                const rotes = [...(getValue("rotes") || [])];
                                                rotes[index] = { ...rotes[index], created_by_caster: event.target.checked };
                                                handleChange("rotes", rotes);
                                            }} /> Creator?
                                        </label>
                                        <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setEditingRotePrimaryFactor(null)}>Done</Button>
                                    </div>
                                )}
                            </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* GRIMOIRE: shown only when the Grimoire Merit is owned; actual spell data belongs to that Merit. */}
            {(() => {
                const merits = getValue("merits_list") || [];
                const meritIndex = merits.findIndex((merit) => merit.name === "Grimoire");
                if (meritIndex < 0) return null;
                const merit = merits[meritIndex];
                const grimoireRotes = Array.isArray(merit.grimoire_rotes) ? merit.grimoire_rotes : [];
                const capacity = Math.max(0, Number(merit.dots) || 0) * 2;
                const updateGrimoire = (next) => {
                    const updated = [...merits];
                    updated[meritIndex] = { ...merit, grimoire_rotes: next };
                    handleChange("merits_list", updated);
                };
                const updateEntry = (index, patch) => updateGrimoire(grimoireRotes.map((entry, itemIndex) => itemIndex === index ? { ...entry, ...patch } : entry));
                return (
                    <div data-testid="grimoire-section">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Grimoire <span className="text-zinc-600">({grimoireRotes.length}/{capacity})</span></p>
                            <Button type="button" size="sm" className="h-5 px-2 text-[10px] btn-secondary" disabled={grimoireRotes.length >= capacity} onClick={() => updateGrimoire([...grimoireRotes, { spell: "", arcanum: "Death", practice: "Compelling", dots: 1, skill: "occult", primary_factor: null, withstand_type: null }])} data-testid="add-grimoire-rote"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                        </div>
                        <p className="text-[10px] text-zinc-600 mb-1">Only Rotes cast from this Grimoire or marked Creator gain rote-quality rerolls. Grimoire casting is ritual-only.</p>
                        <div className="space-y-2">
                            {grimoireRotes.map((rote, index) => {
                                const dots = Number((getValue("arcana") || {})[rote.arcanum] || 0);
                                const practiceDots = requiredDotsForPractice(rote.practice);
                                const valid = !!rote.spell?.trim() && !!rote.primary_factor && practiceDots <= dots;
                                return <div key={index} className="grid min-w-0 items-center gap-1 p-1.5 border border-zinc-800 bg-zinc-900/30 rounded-sm" style={{ gridTemplateColumns: 'minmax(0,1fr) 80px 108px 80px 24px 24px' }}>
                                    <Input value={rote.spell || ""} onChange={(e) => updateEntry(index, { spell: e.target.value })} placeholder="Rote name" className="input-geist h-6 w-full min-w-0 text-xs" data-testid={`grimoire-rote-${index}-name`} />
                                    <Select value={rote.arcanum || "Death"} onValueChange={(value) => updateEntry(index, { arcanum: value })}><SelectTrigger className="h-6 w-[80px] border-zinc-800 bg-zinc-900 text-[10px]"><SelectValue /></SelectTrigger><SelectContent className="bg-zinc-900 border-zinc-800">{ARCANA.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select>
                                    <Select value={rote.practice || "Compelling"} onValueChange={(value) => updateEntry(index, { practice: value, dots: requiredDotsForPractice(value) })}><SelectTrigger className="h-6 w-[108px] border-zinc-800 bg-zinc-900 text-[10px]"><SelectValue /></SelectTrigger><SelectContent className="bg-zinc-900 border-zinc-800">{ALL_SPELL_PRACTICES.map((practice) => <SelectItem key={practice} value={practice} disabled={requiredDotsForPractice(practice) > dots}>{practice}</SelectItem>)}</SelectContent></Select>
                                    <Select value={rote.skill || "occult"} onValueChange={(value) => updateEntry(index, { skill: value })}><SelectTrigger className="h-6 w-[80px] border-zinc-800 bg-zinc-900 text-[10px]"><SelectValue /></SelectTrigger><SelectContent className="bg-zinc-900 border-zinc-800">{SKILL_LIST.map((skill) => <SelectItem key={skill} value={skill}>{formatLabel(skill)}</SelectItem>)}</SelectContent></Select>
                                    <Button type="button" size="sm" variant="ghost" disabled={!valid} title={valid ? 'Cast Rote from Grimoire' : 'Complete Rote details and meet Arcanum requirement'} onClick={() => openSpellcastingPopup(rote.arcanum, rote.practice, 'rote', rote.skill, rote.spell, rote.primary_factor, rote.withstand_type, 'grimoire')} className="h-6 w-6 p-0 text-violet-400" data-testid={`grimoire-rote-${index}-cast`}><Sparkles className="w-3 h-3" /></Button>
                                    <Button type="button" size="sm" variant="ghost" title="Remove from Grimoire" onClick={() => updateGrimoire(grimoireRotes.filter((_, i) => i !== index))} className="h-6 w-6 p-0 text-zinc-400"><Trash2 className="w-3 h-3" /></Button>
                                    <div className="col-span-full flex flex-wrap items-center gap-2 text-[10px] text-zinc-400">
                                        <span>Primary Factor</span><SpellPrimaryFactorSelect value={rote.primary_factor} onChange={(primary_factor) => updateEntry(index, { primary_factor })} testId={`grimoire-rote-${index}-primary-factor`} />
                                        <span>Withstand</span><SpellWithstandSelect value={rote.withstand_type} onChange={(withstand_type) => updateEntry(index, { withstand_type })} testId={`grimoire-rote-${index}-withstand`} />
                                    </div>
                                </div>;
                            })}
                        </div>
                    </div>
                );
            })()}

            {/* Praxes for Mages */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Praxes</p>
                    <Button
                        size="sm"
                        onClick={() =>
                            setPraxisDraft(createPraxisDraft())
                        }
                        disabled={!!activePraxisDraft}
                        className="h-5 px-2 text-[10px] btn-secondary"
                        data-testid="add-praxis-btn"
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                    </Button>
                </div>
                <div className="space-y-2">
                    {activePraxisDraft && (() => {
                        const draftPracticeOptions = ALL_SPELL_PRACTICES;

                        const draftPractice =
                            activePraxisDraft.practice ||
                            draftPracticeOptions[0] ||
                            "";

                        return (
                            <div
                                className="p-2 bg-violet-950/20 border border-violet-700/50 rounded-sm space-y-2"
                                data-testid="praxis-draft"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-wider text-violet-300">
                                        New Praxis
                                    </span>

                                    <span className="text-[9px] text-zinc-500">
                                        Configure before purchasing
                                    </span>
                                </div>

                                <div className="flex min-w-0 flex-nowrap items-center gap-1.5">
                                    <Input
                                        value={activePraxisDraft.spell}
                                        onChange={(e) =>
                                            updatePraxisDraft({
                                                spell: e.target.value,
                                            })
                                        }
                                        placeholder="Spell"
                                        className="input-geist h-6 w-full min-w-0 flex-1 text-xs"
                                        data-testid="praxis-draft-spell"
                                    />

                                    <Select
                                        value={
                                            activePraxisDraft.arcanum ||
                                            "Death"
                                        }
                                        onValueChange={(value) =>
                                            updatePraxisDraft({
                                                arcanum: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger
                                            className="h-6 w-[80px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0"
                                            data-testid="praxis-draft-arcanum"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            {ARCANA.map((arcanum) => (
                                                <SelectItem
                                                    key={arcanum}
                                                    value={arcanum}
                                                    className="text-xs"
                                                >
                                                    {arcanum}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>


                                    <Select
                                        value={draftPractice}
                                        onValueChange={(practice) =>
                                            updatePraxisDraft({
                                                practice,
                                                dots: requiredDotsForPractice(practice),
                                            })
                                        }
                                    >
                                        <SelectTrigger
                                            className="h-6 w-[110px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0"
                                            data-testid="praxis-draft-practice"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            {draftPracticeOptions.map(
                                                (practice) => (
                                                    <SelectItem
                                                        disabled={requiredDotsForPractice(practice) > Number((getValue("arcana") || {})[activePraxisDraft.arcanum] || 0)}
                                                        key={practice}
                                                        value={practice}
                                                        className="text-xs"
                                                    >
                                                        {practice}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] text-zinc-400">Primary Factor (required)</label>
                                    <SpellPrimaryFactorSelect
                                        value={activePraxisDraft.primary_factor}
                                        onChange={(primary_factor) => updatePraxisDraft({ primary_factor })}
                                        testId="praxis-draft-primary-factor"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] text-zinc-400">Withstand (optional)</label>
                                    <SpellWithstandSelect value={activePraxisDraft.withstand_type} onChange={(withstand_type) => updatePraxisDraft({ withstand_type })} testId="praxis-draft-withstand" />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                                        onClick={() =>
                                            setPraxisDraft(null)
                                        }
                                        data-testid="cancel-praxis-draft-btn"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="button"
                                        size="sm"
                                        className="h-6 px-2 text-[10px] bg-violet-800 hover:bg-violet-700 text-white"
                                        disabled={
                                            !activePraxisDraft.spell.trim() ||
                                            !activePraxisDraft.practice ||
                                             !activePraxisDraft.primary_factor
                                        }
                                        onClick={learnPraxisDraft}
                                        data-testid="learn-praxis-btn"
                                    >
                                        Learn Praxis
                                    </Button>
                                </div>
                            </div>
                        );
                    })()}
                    {learnedPraxes.length === 0 && !activePraxisDraft ? (
                        <p className="text-[10px] text-zinc-600 italic">
                            No praxes learned
                        </p>
                    ) : (
                        learnedPraxes.map((praxis, index) => {
                            const praxisPracticeOptions = ALL_SPELL_PRACTICES;
                            const praxisArcanumDots = Number((getValue("arcana") || {})[praxis.arcanum] || 0);
                            const praxisPractice = praxis.practice || praxisPracticeOptions[0] || "";

                            return (
                            <div key={index} className="grid min-w-0 items-center gap-1.5 p-1.5 bg-zinc-900/30 border border-zinc-800 rounded-sm" style={{ gridTemplateColumns: "minmax(0, 1fr) 80px 110px 24px 24px 24px" }}>
                                <Input
                                    value={praxis.spell || ""}
                                    onChange={(e) => {
                                        const praxes = [...(getValue("praxes") || [])];
                                        praxes[index] = { ...praxes[index], spell: e.target.value };
                                        handleChange("praxes", praxes);
                                    }}
                                    placeholder="Spell"
                                    className="input-geist h-6 w-full min-w-0 flex-1 text-xs"
                                    data-testid={`praxis-${index}-spell`}
                                />
                                <Select value={praxis.arcanum || "Death"} onValueChange={(v) => {
                                    const praxes = [...(getValue("praxes") || [])];
                                    praxes[index] = { ...praxes[index], arcanum: v };
                                    handleChange("praxes", praxes);
                                }}>
                                    <SelectTrigger className="h-6 w-[80px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0" data-testid={`praxis-${index}-arcanum`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {ARCANA.map(a => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Select value={praxisPractice} onValueChange={(v) => {
                                    const praxes = [...(getValue("praxes") || [])];
                                    praxes[index] = { ...praxes[index], practice: v, dots: requiredDotsForPractice(v) };
                                    handleChange("praxes", praxes);
                                }}>
                                    <SelectTrigger className="h-6 w-[110px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0" data-testid={`praxis-${index}-practice`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {praxisPracticeOptions.map((practice) => (
                                            <SelectItem key={practice} value={practice} disabled={requiredDotsForPractice(practice) > praxisArcanumDots} className="text-xs">
                                                {practice}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingPraxisPrimaryFactor((current) => current === index ? null : index)}
                                    className="h-6 px-1.5 text-[10px] text-zinc-400 hover:text-teal-300 shrink-0"
                                    title={praxis.primary_factor ? `Edit Primary Factor (${praxis.primary_factor})` : "Set Primary Factor"}
                                    aria-label="Edit Praxis Primary Factor"
                                    data-testid={`praxis-${index}-edit-primary-factor`}
                                >
                                    <Pencil className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" disabled={!praxis.primary_factor || requiredDotsForPractice(praxisPractice) > praxisArcanumDots} title={!praxis.primary_factor ? "Set Primary Factor before casting" : requiredDotsForPractice(praxisPractice) > praxisArcanumDots ? "Requires higher Arcanum" : "Cast Praxis"} onClick={() => openSpellcastingPopup(praxis.arcanum, praxisPractice, "praxis", null, praxis.spell || "", praxis.primary_factor, praxis.withstand_type)} className="h-6 px-1.5 text-[10px] text-teal-400 hover:text-teal-300 shrink-0" data-testid={`praxis-${index}-cast`}>
                                    <Sparkles className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { const praxes = (getValue("praxes") || []).filter((_, i) => i !== index); handleChange("praxes", praxes); setEditingPraxisPrimaryFactor(null); }} className="h-6 w-6 text-zinc-400 hover:text-red-400 shrink-0" data-testid={`praxis-${index}-delete`}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                                {editingPraxisPrimaryFactor === index && (
                                    <div className="col-span-full flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-1.5 mt-1">
                                        <span className="text-[10px] text-zinc-400">Primary Factor (required)</span>
                                        <SpellPrimaryFactorSelect
                                            value={praxis.primary_factor}
                                            onChange={(primary_factor) => {
                                                const praxes = [...(getValue("praxes") || [])];
                                                praxes[index] = { ...praxes[index], primary_factor };
                                                handleChange("praxes", praxes);

                                            }}
                                            testId={`praxis-${index}-primary-factor`}
                                        />
                                        <span className="text-[10px] text-zinc-400">Withstand (optional)</span>
                                        <SpellWithstandSelect value={praxis.withstand_type} onChange={(withstand_type) => {
                                            const praxes = [...(getValue("praxes") || [])];
                                            praxes[index] = { ...praxes[index], withstand_type };
                                            handleChange("praxes", praxes);
                                        }} testId={`praxis-${index}-withstand`} />
                                        <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setEditingPraxisPrimaryFactor(null)}>Done</Button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                </div>
            </div>

            {/* Attainments */}
            <MageAttainmentsContent
                getValue={getValue}
                handleChange={handleChange}
                onTriggerDiceRoll={onTriggerDiceRoll}
                onUpdateCharacter={onUpdateCharacter}
                onAddRecentRoll={onAddRecentRoll}
            />
        </>
    );
};
