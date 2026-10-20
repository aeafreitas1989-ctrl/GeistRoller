import { useMemo, useState } from "react";
import { Pencil, Play, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ARCANA } from "../../data/character-data";

const PRACTICE_DOTS = {
    Compelling: 1,
    Knowing: 1,
    Unveiling: 1,
    Ruling: 2,
    Shielding: 2,
    Veiling: 2,
    Fraying: 3,
    Perfecting: 3,
    Weaving: 3,
    Patterning: 4,
    Unravelling: 4,
    Making: 5,
    Unmaking: 5,
};

const PRACTICES = Object.keys(PRACTICE_DOTS);

const DURATION_LEVELS = {
    standard: [
        "1 turn",
        "2 turns",
        "3 turns",
        "5 turns",
        "10 turns",
        "20 turns",
        "30 turns",
    ],
    advanced: [
        "1 hour",
        "1 day",
        "1 week",
        "1 month",
        "1 year",
        "Indefinite",
    ],
};

const SCALE_LEVELS = {
    standard: [
        "1 subject (Size 5) / 1m radius",
        "2 subjects (Size 6) / small room",
        "4 subjects (Size 7) / large room",
        "8 subjects (Size 8) / single floor",
        "16 subjects (Size 9) / ballroom",
    ],
    advanced: [
        "5 subjects (Size 5) / large house",
        "10 subjects (Size 10) / small warehouse",
        "20 subjects (Size 15) / supermarket",
        "40 subjects (Size 20) / shopping mall",
        "80 subjects (Size 25) / city block",
        "160 subjects (Size 30) / neighbourhood",
    ],
};

const makeId = () =>
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const createReach = () => ({
    casting_time: false,
    advanced_duration: false,
    advanced_scale: false,
    advanced_potency: false,
    option: false,
    option_text: "",
});

const createAdjustments = () => ({
    potency: 0,
    duration: 0,
    scale: 0,
});

const createEffect = ({ enabled = true, arcanum = "" } = {}) => ({
    enabled,
    spell: "",
    arcanum,
    practice: "",
    primary_factor: "potency",
    reach: createReach(),
    adjustments: createAdjustments(),
});

const createDefaultAttainment = () => ({
    id: makeId(),
    name: "",
    level: 1,
    replicates_praxis: "",
    tutored: true,
    primary_effect: createEffect({ enabled: true }),
    secondary_effect: createEffect({ enabled: false }),
});

const normalizeReach = (reach = {}) => ({
    ...createReach(),
    ...(reach || {}),
    option_text: reach?.option_text || "",
});

const normalizeAdjustments = (adjustments = {}) => ({
    ...createAdjustments(),
    ...(adjustments || {}),
    potency: Number(adjustments?.potency) || 0,
    duration: Number(adjustments?.duration) || 0,
    scale: Number(adjustments?.scale) || 0,
});

const normalizeEffect = (effect = {}, defaults = {}) => ({
    ...createEffect(defaults),
    ...(effect || {}),
    enabled: effect?.enabled ?? defaults.enabled ?? true,
    spell: effect?.spell || "",
    arcanum: effect?.arcanum || defaults.arcanum || "",
    practice: effect?.practice || "",
    primary_factor: ["potency", "duration"].includes(effect?.primary_factor)
        ? effect.primary_factor
        : "potency",
    reach: normalizeReach(effect?.reach),
    adjustments: normalizeAdjustments(effect?.adjustments),
});

const normalizeAttainment = (attainment, index) => {
    if (typeof attainment === "string") {
        return {
            ...createDefaultAttainment(),
            id: `legacy-attainment-${index}`,
            name: attainment,
        };
    }

    const safe = attainment || {};

    return {
        ...createDefaultAttainment(),
        ...safe,
        id: safe.id || `legacy-attainment-${index}`,
        name: safe.name || "",
        level: Math.min(5, Math.max(1, Number(safe.level) || 1)),
        replicates_praxis: safe.replicates_praxis || "",
        tutored: safe.tutored !== false,
        primary_effect: normalizeEffect(safe.primary_effect, { enabled: true }),
        secondary_effect: normalizeEffect(safe.secondary_effect, { enabled: false }),
    };
};

const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, Number(value) || min));

const getPracticeDots = (practice) => PRACTICE_DOTS[practice] || 0;

const getFixedReach = (attainmentLevel, practice) => {
    const practiceDots = getPracticeDots(practice);
    const level = Math.max(1, Number(attainmentLevel) || 1);

    if (!practiceDots || practiceDots > level) return 0;

    return 1 + Math.max(0, level - practiceDots);
};

const getReachUsed = (effect = {}) => {
    const reach = normalizeReach(effect.reach);

    return [
        reach.casting_time,
        reach.advanced_duration,
        reach.advanced_scale,
        reach.advanced_potency,
        reach.option,
    ].filter(Boolean).length;
};

const getFactorRanks = (effect, arcanumDots) => {
    const safeDots = Math.max(1, Number(arcanumDots) || 1);
    const secondaryRank = 1 + Math.floor(safeDots / 2);
    const primaryFactor = effect?.primary_factor === "duration" ? "duration" : "potency";
    const adjustments = normalizeAdjustments(effect?.adjustments);

    const potencyBase = primaryFactor === "potency" ? safeDots : secondaryRank;
    const durationBase = primaryFactor === "duration" ? safeDots : secondaryRank;
    const scaleBase = secondaryRank;

    return {
        potency: clamp(potencyBase + adjustments.potency, 1, 5),
        duration: clamp(durationBase + adjustments.duration, 1, 7),
        scale: clamp(scaleBase + adjustments.scale, 1, 6),
    };
};

const getDerivedEffect = ({ effect, attainmentLevel, arcanumDots }) => {
    const normalizedEffect = normalizeEffect(effect);
    const fixedReach = getFixedReach(attainmentLevel, normalizedEffect.practice);
    const reachUsed = getReachUsed(normalizedEffect);
    const ranks = getFactorRanks(normalizedEffect, arcanumDots);
    const durationMode = normalizedEffect.reach.advanced_duration ? "advanced" : "standard";
    const scaleMode = normalizedEffect.reach.advanced_scale ? "advanced" : "standard";
    const durationTable = DURATION_LEVELS[durationMode];
    const scaleTable = SCALE_LEVELS[scaleMode];
    const durationIndex = clamp(ranks.duration, 1, durationTable.length) - 1;
    const scaleIndex = clamp(ranks.scale, 1, scaleTable.length) - 1;

    return {
        castingTime: normalizedEffect.reach.casting_time
            ? "Instant action"
            : "1 scene preparation",
        potency: normalizedEffect.reach.advanced_potency
            ? `Potency ${ranks.potency} (+2 Withstand)`
            : `Potency ${ranks.potency}`,
        duration: durationTable[durationIndex],
        scale: scaleTable[scaleIndex],
        fixedReach,
        reachUsed,
        reachValid: fixedReach > 0 && reachUsed <= fixedReach,
        practiceValid:
            !!normalizedEffect.practice &&
            getPracticeDots(normalizedEffect.practice) <= Math.max(1, Number(attainmentLevel) || 1),
        optionText:
            normalizedEffect.reach.option && normalizedEffect.reach.option_text.trim()
                ? normalizedEffect.reach.option_text.trim()
                : "",
    };
};

const FactorAdjuster = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between gap-2 rounded-sm border border-zinc-800 bg-zinc-950/40 px-2 py-1.5">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
        <div className="flex items-center gap-1">
            <Button
                type="button"
                variant="outline"
                className="h-6 w-6 p-0 border-zinc-700 bg-zinc-900 text-zinc-300"
                onClick={() => onChange(Math.max(-4, Number(value || 0) - 1))}
            >
                −
            </Button>
            <span className="w-8 text-center text-xs font-mono text-amber-300">
                {Number(value || 0) > 0 ? `+${Number(value || 0)}` : Number(value || 0)}
            </span>
            <Button
                type="button"
                variant="outline"
                className="h-6 w-6 p-0 border-zinc-700 bg-zinc-900 text-zinc-300"
                onClick={() => onChange(Math.min(4, Number(value || 0) + 1))}
            >
                +
            </Button>
        </div>
    </div>
);

const ReachToggle = ({ label, checked, onCheckedChange }) => (
    <label className="flex items-center gap-2 text-[10px] text-zinc-300">
        <Checkbox checked={!!checked} onCheckedChange={(value) => onCheckedChange(!!value)} />
        {label}
    </label>
);

const DerivedBox = ({ effect, level, arcanumDots }) => {
    const derived = getDerivedEffect({ effect, attainmentLevel: level, arcanumDots });

    return (
        <div className="rounded-sm border border-violet-800/40 bg-violet-950/10 p-2">
            <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider text-violet-300">
                    Derived Factors
                </span>
                <span
                    className={`text-[10px] font-mono ${
                        derived.reachValid ? "text-emerald-300" : "text-red-300"
                    }`}
                >
                    Reach {derived.reachUsed}/{derived.fixedReach || "—"}
                </span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-zinc-300">
                <div>Casting Time: <span className="text-zinc-100">{derived.castingTime}</span></div>
                <div>Potency: <span className="text-zinc-100">{derived.potency}</span></div>
                <div>Duration: <span className="text-zinc-100">{derived.duration}</span></div>
                <div>Scale: <span className="text-zinc-100">{derived.scale}</span></div>
            </div>
            {derived.optionText && (
                <div className="mt-1.5 text-[10px] text-amber-300">
                    Reach option: {derived.optionText}
                </div>
            )}
            {!derived.practiceValid && effect?.practice && (
                <div className="mt-1.5 text-[10px] text-red-300">
                    This Practice requires more Arcanum dots than the selected Attainment level allows.
                </div>
            )}
            {!derived.reachValid && derived.fixedReach > 0 && (
                <div className="mt-1.5 text-[10px] text-red-300">
                    Too much Reach is assigned to this effect.
                </div>
            )}
        </div>
    );
};

const EffectEditor = ({
    title,
    effect,
    onChange,
    level,
    arcanumDots,
    primaryArcanum,
    secondary = false,
}) => {
    const updateReach = (key, value) =>
        onChange({
            ...effect,
            reach: {
                ...normalizeReach(effect.reach),
                [key]: value,
            },
        });

    const updateAdjustment = (key, value) =>
        onChange({
            ...effect,
            adjustments: {
                ...normalizeAdjustments(effect.adjustments),
                [key]: value,
            },
        });

    return (
        <div className="space-y-2 rounded-sm border border-zinc-800 bg-zinc-950/30 p-2.5">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <div className="text-xs font-medium text-violet-300">{title}</div>
                    {!secondary && (
                        <div className="text-[10px] text-zinc-600">
                            Arcanum: {primaryArcanum || "Set the Legacy Ruling Arcanum in Character Info"}
                        </div>
                    )}
                </div>
                {secondary && (
                    <label className="flex items-center gap-2 text-[10px] text-zinc-400">
                        <Switch
                            checked={!!effect.enabled}
                            onCheckedChange={(checked) => onChange({ ...effect, enabled: !!checked })}
                        />
                        Include Secondary Effect
                    </label>
                )}
            </div>

            {(!secondary || effect.enabled) && (
                <>
                    <div className={`grid gap-2 ${secondary ? "grid-cols-3" : "grid-cols-2"}`}>
                        {secondary && (
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                    Arcanum
                                </label>
                                <Select
                                    value={effect.arcanum || "__none__"}
                                    onValueChange={(value) =>
                                        onChange({
                                            ...effect,
                                            arcanum: value === "__none__" ? "" : value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="mt-0.5 h-8 border-zinc-700 bg-zinc-900/50 text-xs">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent className="border-zinc-700 bg-zinc-900">
                                        <SelectItem value="__none__" className="text-zinc-400">None</SelectItem>
                                        {ARCANA.map((arcanum) => (
                                            <SelectItem key={arcanum} value={arcanum} className="text-xs">
                                                {arcanum}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                Spell
                            </label>
                            <Input
                                value={effect.spell || ""}
                                onChange={(event) => onChange({ ...effect, spell: event.target.value })}
                                className="mt-0.5 h-8 input-geist text-xs"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                Practice
                            </label>
                            <Select
                                value={effect.practice || "__none__"}
                                onValueChange={(value) =>
                                    onChange({
                                        ...effect,
                                        practice: value === "__none__" ? "" : value,
                                    })
                                }
                            >
                                <SelectTrigger className="mt-0.5 h-8 border-zinc-700 bg-zinc-900/50 text-xs">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-64 border-zinc-700 bg-zinc-900">
                                    <SelectItem value="__none__" className="text-zinc-400">None</SelectItem>
                                    {PRACTICES.map((practice) => (
                                        <SelectItem key={practice} value={practice} className="text-xs">
                                            {practice} ({PRACTICE_DOTS[practice]})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                            Primary Factor
                        </label>
                        <Select
                            value={effect.primary_factor || "potency"}
                            onValueChange={(value) => onChange({ ...effect, primary_factor: value })}
                        >
                            <SelectTrigger className="mt-0.5 h-8 border-zinc-700 bg-zinc-900/50 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-zinc-700 bg-zinc-900">
                                <SelectItem value="potency" className="text-xs">Potency</SelectItem>
                                <SelectItem value="duration" className="text-xs">Duration</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                Reach
                            </label>
                            <span className="text-[10px] text-zinc-600">
                                Fixed by Attainment level and Practice
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-sm border border-zinc-800 bg-zinc-950/30 p-2">
                            <ReachToggle
                                label="Casting Time (Instant)"
                                checked={effect.reach?.casting_time}
                                onCheckedChange={(checked) => updateReach("casting_time", checked)}
                            />
                            <ReachToggle
                                label="Advanced Duration"
                                checked={effect.reach?.advanced_duration}
                                onCheckedChange={(checked) => updateReach("advanced_duration", checked)}
                            />
                            <ReachToggle
                                label="Advanced Scale"
                                checked={effect.reach?.advanced_scale}
                                onCheckedChange={(checked) => updateReach("advanced_scale", checked)}
                            />
                            <ReachToggle
                                label="Advanced Potency"
                                checked={effect.reach?.advanced_potency}
                                onCheckedChange={(checked) => updateReach("advanced_potency", checked)}
                            />
                            <div className="flex min-w-[260px] flex-1 items-center gap-2">
                                <ReachToggle
                                    label="Option"
                                    checked={effect.reach?.option}
                                    onCheckedChange={(checked) => updateReach("option", checked)}
                                />
                                <Input
                                    value={effect.reach?.option_text || ""}
                                    onChange={(event) => updateReach("option_text", event.target.value)}
                                    disabled={!effect.reach?.option}
                                    placeholder="Describe the Reach option"
                                    className="h-7 input-geist text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">
                            Manual Factor Adjustment
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <FactorAdjuster
                                label="Potency"
                                value={effect.adjustments?.potency}
                                onChange={(value) => updateAdjustment("potency", value)}
                            />
                            <FactorAdjuster
                                label="Duration"
                                value={effect.adjustments?.duration}
                                onChange={(value) => updateAdjustment("duration", value)}
                            />
                            <FactorAdjuster
                                label="Scale"
                                value={effect.adjustments?.scale}
                                onChange={(value) => updateAdjustment("scale", value)}
                            />
                        </div>
                        <p className="mt-1 text-[9px] text-amber-500/80">
                            These +/− controls are manual overrides for atypical or table-specific Legacy designs;
                            increases are not automatically granted by the standard Legacy rules.
                        </p>
                    </div>

                    <DerivedBox effect={effect} level={level} arcanumDots={arcanumDots} />
                </>
            )}
        </div>
    );
};

const ActivationEffectSummary = ({ title, effect, level, arcanumDots, arcanum }) => {
    const derived = getDerivedEffect({ effect, attainmentLevel: level, arcanumDots });

    return (
        <div className="rounded-sm border border-zinc-800 bg-zinc-950/40 p-2.5">
            <div className="text-xs font-medium text-violet-300">{title}</div>
            <div className="mt-1 text-[10px] text-zinc-500">
                {effect.spell || "Unnamed effect"} · {arcanum || "No Arcanum"} · {effect.practice || "No Practice"}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-zinc-300">
                <div>Casting Time: <span className="text-zinc-100">{derived.castingTime}</span></div>
                <div>{derived.potency}</div>
                <div>Duration: <span className="text-zinc-100">{derived.duration}</span></div>
                <div>Scale: <span className="text-zinc-100">{derived.scale}</span></div>
            </div>
            {derived.optionText && (
                <div className="mt-2 text-xs text-amber-300">Reach option: {derived.optionText}</div>
            )}
        </div>
    );
};

export const LegacyAttainmentsSection = ({ getValue, handleChange }) => {
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [draft, setDraft] = useState(createDefaultAttainment);
    const [activation, setActivation] = useState(null);

    const arcana = getValue("arcana") || {};
    const legacyName = getValue("legacy") || "";
    const legacyRulingArcanum = getValue("legacy_ruling_arcanum") || "";
    const praxes = Array.isArray(getValue("praxes")) ? getValue("praxes") : [];
    const rawAttainments = Array.isArray(getValue("attainments")) ? getValue("attainments") : [];
    const attainments = rawAttainments.map(normalizeAttainment);

    const selectedPraxisIndex = useMemo(() => {
        if (!draft.replicates_praxis) return "__none__";
        const index = praxes.findIndex((praxis) => (praxis?.spell || "") === draft.replicates_praxis);
        return index >= 0 ? String(index) : "__none__";
    }, [draft.replicates_praxis, praxes]);

    const openAdd = () => {
        setEditingIndex(null);
        setDraft(createDefaultAttainment());
        setEditorOpen(true);
    };

    const openEdit = (index) => {
        setEditingIndex(index);
        setDraft(normalizeAttainment(rawAttainments[index], index));
        setEditorOpen(true);
    };

    const updateDraftEffect = (key, nextEffect) =>
        setDraft((previous) => ({ ...previous, [key]: nextEffect }));

    const selectPraxis = (value) => {
        if (value === "__none__") {
            setDraft((previous) => ({ ...previous, replicates_praxis: "" }));
            return;
        }

        const praxis = praxes[Number(value)];
        if (!praxis) return;

        setDraft((previous) => ({
            ...previous,
            replicates_praxis: praxis.spell || `Praxis ${Number(value) + 1}`,
            primary_effect: {
                ...previous.primary_effect,
                spell: praxis.spell || previous.primary_effect.spell,
                practice: praxis.practice || previous.primary_effect.practice,
            },
        }));
    };

    const primaryArcanumDots = Math.max(0, Number(arcana[legacyRulingArcanum]) || 0);
    const draftPrimaryDerived = getDerivedEffect({
        effect: draft.primary_effect,
        attainmentLevel: draft.level,
        arcanumDots: primaryArcanumDots || draft.level,
    });
    const draftSecondaryArcanum = draft.secondary_effect?.arcanum || "";
    const draftSecondaryArcanumDots = Math.max(0, Number(arcana[draftSecondaryArcanum]) || 0);
    const draftSecondaryDerived = getDerivedEffect({
        effect: draft.secondary_effect,
        attainmentLevel: draft.level,
        arcanumDots: draftSecondaryArcanumDots || draft.level,
    });

    const primaryConfigured =
        !!draft.name.trim() &&
        !!legacyRulingArcanum &&
        !!draft.primary_effect?.spell?.trim() &&
        !!draft.primary_effect?.practice &&
        draftPrimaryDerived.practiceValid &&
        draftPrimaryDerived.reachValid;

    const secondaryConfigured =
        !draft.secondary_effect?.enabled ||
        (
            !!draft.secondary_effect?.spell?.trim() &&
            !!draftSecondaryArcanum &&
            !!draft.secondary_effect?.practice &&
            draftSecondaryDerived.practiceValid &&
            draftSecondaryDerived.reachValid
        );

    const canSave = primaryConfigured && secondaryConfigured;

    const saveAttainment = () => {
        if (!canSave) return;

        const nextAttainment = normalizeAttainment(
            {
                ...draft,
                id: draft.id || makeId(),
                name: draft.name.trim(),
                level: Math.min(5, Math.max(1, Number(draft.level) || 1)),
                replicates_praxis: draft.replicates_praxis || "",
                tutored: draft.tutored !== false,
                primary_effect: normalizeEffect(draft.primary_effect, { enabled: true }),
                secondary_effect: normalizeEffect(draft.secondary_effect, { enabled: false }),
            },
            editingIndex ?? rawAttainments.length
        );

        if (editingIndex === null) {
            handleChange("attainments", [...rawAttainments, nextAttainment]);
        } else {
            const next = [...rawAttainments];
            next[editingIndex] = nextAttainment;
            handleChange("attainments", next);
        }

        setEditorOpen(false);
        setEditingIndex(null);
        setDraft(createDefaultAttainment());
    };

    const removeAttainment = (index) => {
        handleChange(
            "attainments",
            rawAttainments.filter((_, attainmentIndex) => attainmentIndex !== index)
        );
    };

    const getActivationState = (attainment) => {
        const primaryDots = Math.max(0, Number(arcana[legacyRulingArcanum]) || 0);
        const secondaryArcanum = attainment.secondary_effect?.arcanum || "";
        const secondaryDots = Math.max(0, Number(arcana[secondaryArcanum]) || 0);
        const primaryDerived = getDerivedEffect({
            effect: attainment.primary_effect,
            attainmentLevel: attainment.level,
            arcanumDots: primaryDots || attainment.level,
        });
        const secondaryDerived = getDerivedEffect({
            effect: attainment.secondary_effect,
            attainmentLevel: attainment.level,
            arcanumDots: secondaryDots || attainment.level,
        });

        const primaryReady =
            !!legacyRulingArcanum &&
            primaryDots >= attainment.level &&
            !!attainment.primary_effect?.spell &&
            primaryDerived.practiceValid &&
            primaryDerived.reachValid;

        const secondaryReady =
            primaryReady &&
            !!attainment.secondary_effect?.enabled &&
            !!secondaryArcanum &&
            secondaryDots >= attainment.level &&
            !!attainment.secondary_effect?.spell &&
            secondaryDerived.practiceValid &&
            secondaryDerived.reachValid;

        return {
            primaryReady,
            secondaryReady,
            primaryDots,
            secondaryDots,
            secondaryArcanum,
        };
    };

    const activate = (attainment, includeSecondary) => {
        const state = getActivationState(attainment);
        if (!state.primaryReady) return;
        if (includeSecondary && !state.secondaryReady) return;

        setActivation({
            attainment,
            includeSecondary,
            ...state,
        });
    };

    return (
        <div className="pt-2 border-t border-zinc-800" data-testid="legacy-attainments-section">
            <div className="mb-1.5 flex items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Legacy Attainments
                    </p>
                    <p className="text-[9px] text-zinc-600">
                        {legacyName || "No Legacy selected"}
                        {legacyRulingArcanum ? ` · Ruling Arcanum: ${legacyRulingArcanum}` : " · No Legacy Ruling Arcanum selected"}
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={openAdd}
                    className="h-5 px-2 text-[10px] btn-secondary"
                    data-testid="add-attainment-btn"
                >
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                </Button>
            </div>

            {attainments.length === 0 ? (
                <p className="text-[10px] italic text-zinc-600">No Legacy Attainments added.</p>
            ) : (
                <div className="space-y-2">
                    {attainments.map((attainment, index) => {
                        const state = getActivationState(attainment);

                        return (
                            <div
                                key={attainment.id || index}
                                className="rounded-sm border border-zinc-800 bg-zinc-900/30 p-2"
                                data-testid={`legacy-attainment-${index}`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-medium text-zinc-200">
                                                {attainment.name || "Unnamed Attainment"}
                                            </span>
                                            <span className="text-[10px] font-mono text-violet-300">
                                                {"●".repeat(attainment.level)}
                                            </span>
                                            <span className="text-[9px] uppercase tracking-wider text-zinc-600">
                                                {attainment.tutored ? "Tutored" : "Untutored"}
                                            </span>
                                        </div>
                                        {attainment.replicates_praxis && (
                                            <div className="mt-0.5 text-[10px] text-zinc-500">
                                                Replicates Praxis: {attainment.replicates_praxis}
                                            </div>
                                        )}
                                        <div className="mt-1 text-[10px] text-zinc-400">
                                            Primary: {attainment.primary_effect?.spell || "—"}
                                            {attainment.primary_effect?.practice
                                                ? ` · ${attainment.primary_effect.practice}`
                                                : ""}
                                        </div>
                                        {attainment.secondary_effect?.enabled && (
                                            <div className="text-[10px] text-zinc-400">
                                                Secondary: {attainment.secondary_effect?.spell || "—"}
                                                {attainment.secondary_effect?.arcanum
                                                    ? ` · ${attainment.secondary_effect.arcanum}`
                                                    : ""}
                                                {attainment.secondary_effect?.practice
                                                    ? ` · ${attainment.secondary_effect.practice}`
                                                    : ""}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-zinc-400 hover:text-violet-300"
                                            onClick={() => openEdit(index)}
                                            data-testid={`legacy-attainment-${index}-edit`}
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400"
                                            onClick={() => removeAttainment(index)}
                                            data-testid={`legacy-attainment-${index}-delete`}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        disabled={!state.primaryReady}
                                        onClick={() => activate(attainment, false)}
                                        className="h-7 bg-violet-900/40 px-2 text-[10px] text-violet-200 hover:bg-violet-800/50 disabled:opacity-40"
                                        data-testid={`legacy-attainment-${index}-activate-primary`}
                                    >
                                        <Play className="mr-1 h-3 w-3" />
                                        Activate Primary
                                    </Button>

                                    {attainment.secondary_effect?.enabled && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            disabled={!state.secondaryReady}
                                            onClick={() => activate(attainment, true)}
                                            className="h-7 bg-fuchsia-900/40 px-2 text-[10px] text-fuchsia-200 hover:bg-fuchsia-800/50 disabled:opacity-40"
                                            data-testid={`legacy-attainment-${index}-activate-combined`}
                                        >
                                            <Play className="mr-1 h-3 w-3" />
                                            Primary + Secondary
                                        </Button>
                                    )}

                                    {!state.primaryReady && (
                                        <span className="self-center text-[9px] text-red-300">
                                            Requires {legacyRulingArcanum || "Legacy Ruling Arcanum"} {attainment.level}.
                                        </span>
                                    )}
                                    {state.primaryReady && attainment.secondary_effect?.enabled && !state.secondaryReady && (
                                        <span className="self-center text-[9px] text-amber-300">
                                            Secondary requires {state.secondaryArcanum || "an Arcanum"} {attainment.level}.
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-zinc-700 bg-zinc-900">
                    <DialogHeader>
                        <DialogTitle className="text-violet-300">
                            {editingIndex === null ? "Add Legacy Attainment" : "Edit Legacy Attainment"}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Configure the fixed Reach and derived spell factors for this Attainment.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                Name
                            </label>
                            <Input
                                value={draft.name}
                                onChange={(event) =>
                                    setDraft((previous) => ({ ...previous, name: event.target.value }))
                                }
                                className="mt-0.5 h-8 input-geist text-sm"
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                    Attainment Level
                                </label>
                                <Select
                                    value={String(draft.level)}
                                    onValueChange={(value) =>
                                        setDraft((previous) => ({ ...previous, level: Number(value) }))
                                    }
                                >
                                    <SelectTrigger className="mt-0.5 h-8 border-zinc-700 bg-zinc-900/50 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="border-zinc-700 bg-zinc-900">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <SelectItem key={level} value={String(level)} className="text-xs">
                                                {level} — {"●".repeat(level)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                    Replicates Praxis
                                </label>
                                <Select value={selectedPraxisIndex} onValueChange={selectPraxis}>
                                    <SelectTrigger className="mt-0.5 h-8 border-zinc-700 bg-zinc-900/50 text-xs">
                                        <SelectValue placeholder="None / custom" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-64 border-zinc-700 bg-zinc-900">
                                        <SelectItem value="__none__" className="text-zinc-400">
                                            None / custom
                                        </SelectItem>
                                        {praxes.map((praxis, index) => (
                                            <SelectItem key={`${praxis?.spell || "praxis"}-${index}`} value={String(index)} className="text-xs">
                                                {praxis?.spell || `Praxis ${index + 1}`}
                                                {praxis?.arcanum ? ` — ${praxis.arcanum}` : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {draft.replicates_praxis && (() => {
                            const praxis = praxes[Number(selectedPraxisIndex)];
                            if (!praxis?.arcanum || !legacyRulingArcanum || praxis.arcanum === legacyRulingArcanum) return null;
                            return (
                                <div className="rounded-sm border border-amber-800/50 bg-amber-950/20 p-2 text-[10px] text-amber-300">
                                    The selected Praxis uses {praxis.arcanum}, while this Legacy&apos;s Ruling Arcanum is {legacyRulingArcanum}.
                                </div>
                            );
                        })()}

                        <div className="flex items-center justify-between rounded-sm border border-zinc-800 bg-zinc-950/40 p-2">
                            <div>
                                <p className="text-xs text-zinc-300">Tutored</p>
                                <p className="text-[10px] text-zinc-600">
                                    Uses the existing tutored/untutored Legacy Attainment XP cost.
                                </p>
                            </div>
                            <Switch
                                checked={draft.tutored}
                                onCheckedChange={(checked) =>
                                    setDraft((previous) => ({ ...previous, tutored: !!checked }))
                                }
                            />
                        </div>

                        <EffectEditor
                            title="Primary Effect"
                            effect={draft.primary_effect}
                            onChange={(effect) => updateDraftEffect("primary_effect", effect)}
                            level={draft.level}
                            arcanumDots={primaryArcanumDots || draft.level}
                            primaryArcanum={legacyRulingArcanum}
                        />

                        <EffectEditor
                            title="Secondary Effect"
                            effect={draft.secondary_effect}
                            onChange={(effect) => updateDraftEffect("secondary_effect", effect)}
                            level={draft.level}
                            arcanumDots={draftSecondaryArcanumDots || draft.level}
                            primaryArcanum={legacyRulingArcanum}
                            secondary
                        />

                        {!legacyRulingArcanum && (
                            <div className="rounded-sm border border-red-800/50 bg-red-950/20 p-2 text-[10px] text-red-300">
                                Select the Legacy Ruling Arcanum in Character Info before saving an Attainment.
                            </div>
                        )}

                        <Button
                            type="button"
                            onClick={saveAttainment}
                            disabled={!canSave}
                            className="w-full btn-primary"
                            data-testid="confirm-add-attainment-btn"
                        >
                            {editingIndex === null ? "Add Attainment" : "Save Attainment"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!activation} onOpenChange={(open) => !open && setActivation(null)}>
                <DialogContent className="max-w-lg border-zinc-700 bg-zinc-900">
                    <DialogHeader>
                        <DialogTitle className="text-violet-300">
                            {activation?.attainment?.name || "Legacy Attainment"} Activated
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Legacy Attainments activate automatically; no spellcasting roll is made.
                        </DialogDescription>
                    </DialogHeader>

                    {activation && (
                        <div className="space-y-2">
                            <ActivationEffectSummary
                                title="Primary Effect"
                                effect={activation.attainment.primary_effect}
                                level={activation.attainment.level}
                                arcanumDots={activation.primaryDots}
                                arcanum={legacyRulingArcanum}
                            />

                            {activation.includeSecondary && (
                                <ActivationEffectSummary
                                    title="Secondary Effect"
                                    effect={activation.attainment.secondary_effect}
                                    level={activation.attainment.level}
                                    arcanumDots={activation.secondaryDots}
                                    arcanum={activation.secondaryArcanum}
                                />
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
