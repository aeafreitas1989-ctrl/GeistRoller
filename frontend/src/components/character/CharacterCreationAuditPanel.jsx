import { Lock, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    MAGE_ATTRIBUTE_CATEGORIES,
    MAGE_SKILL_CATEGORIES,
    MAGE_CREATION_RULES,
    getBlankMageCreationChoices,
    validateMageCreation,
} from "@/utils/mageCreationAudit";

const categoryLabel = (category) => category ? category[0].toUpperCase() + category.slice(1) : "Unset";

const ProgressLine = ({ label, spent, expected }) => {
    const isExact = expected !== null && spent === expected;
    const isOver = expected !== null && spent > expected;

    return (
        <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-400 capitalize">{label}</span>
            <span className={`font-mono ${isExact ? "text-emerald-400" : isOver ? "text-rose-400" : "text-amber-400"}`}>
                {spent}{expected !== null ? ` / ${expected}` : " / —"}
            </span>
        </div>
    );
};

const PrioritySelect = ({ label, value, onChange, testId }) => (
    <div className="space-y-1">
        <div className="text-[9px] text-zinc-500 uppercase tracking-wider">{label}</div>
        <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className="h-7 bg-zinc-900/60 border-zinc-800 text-[11px]" data-testid={testId}>
                <SelectValue placeholder="Unset" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
                {["mental", "physical", "social"].map((category) => (
                    <SelectItem key={category} value={category} className="text-xs">
                        {categoryLabel(category)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

export const CharacterCreationAuditPanel = ({ character, getValue, handleChange, onLockCharacter }) => {
    const choices = getValue("creation_choices") || getBlankMageCreationChoices();
    const validation = validateMageCreation({
        ...character,
        creation_choices: choices,
        ruling_arcana: character?.path ? undefined : character?.ruling_arcana,
        inferior_arcanum: character?.path ? undefined : character?.inferior_arcanum,
    });

    const setChoice = (patch) => {
        handleChange("creation_choices", {
            ...getBlankMageCreationChoices(),
            ...choices,
            ...patch,
        });
    };

    const setAttributePriority = (priority, value) => {
        setChoice({
            attribute_priorities: {
                ...(choices.attribute_priorities || {}),
                [priority]: value,
            },
        });
    };

    const setSkillPriority = (priority, value) => {
        setChoice({
            skill_priorities: {
                ...(choices.skill_priorities || {}),
                [priority]: value,
            },
        });
    };

    const attributeReport = validation.reports.attributes;
    const skillReport = validation.reports.skills;
    const meritsReport = validation.reports.merits;
    const arcanaReport = validation.reports.arcana;
    const obsessionReport = validation.reports.obsessions;

    return (
        <div className="p-3 bg-violet-950/20 border border-violet-700/40 rounded-sm space-y-3" data-testid="mage-creation-audit-panel">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-violet-300">Character Creation Mode</span>
                        {validation.valid ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                        Build freely here. Once locked, XP-relevant trait changes use the purchase ledger.
                    </p>
                </div>
                <Button
                    size="sm"
                    className="h-7 px-2 text-[10px] bg-violet-800 hover:bg-violet-700 text-white"
                    onClick={() => onLockCharacter(validation)}
                    disabled={!validation.valid}
                    data-testid="lock-mage-character-btn"
                >
                    <Lock className="w-3 h-3 mr-1" /> Lock
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Attribute Priorities</div>
                    <div className="grid grid-cols-3 gap-2">
                        <PrioritySelect label="Primary 5" value={choices.attribute_priorities?.primary || ""} onChange={(v) => setAttributePriority("primary", v)} testId="attribute-primary-select" />
                        <PrioritySelect label="Secondary 4" value={choices.attribute_priorities?.secondary || ""} onChange={(v) => setAttributePriority("secondary", v)} testId="attribute-secondary-select" />
                        <PrioritySelect label="Tertiary 3" value={choices.attribute_priorities?.tertiary || ""} onChange={(v) => setAttributePriority("tertiary", v)} testId="attribute-tertiary-select" />
                    </div>
                    <div className="space-y-1 p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                        {Object.keys(MAGE_ATTRIBUTE_CATEGORIES).map((category) => (
                            <ProgressLine
                                key={category}
                                label={`${category} attributes`}
                                spent={attributeReport[category]?.spent ?? 0}
                                expected={attributeReport[category]?.expected}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Skill Priorities</div>
                    <div className="grid grid-cols-3 gap-2">
                        <PrioritySelect label="Primary 11" value={choices.skill_priorities?.primary || ""} onChange={(v) => setSkillPriority("primary", v)} testId="skill-primary-select" />
                        <PrioritySelect label="Secondary 7" value={choices.skill_priorities?.secondary || ""} onChange={(v) => setSkillPriority("secondary", v)} testId="skill-secondary-select" />
                        <PrioritySelect label="Tertiary 4" value={choices.skill_priorities?.tertiary || ""} onChange={(v) => setSkillPriority("tertiary", v)} testId="skill-tertiary-select" />
                    </div>
                    <div className="space-y-1 p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                        {Object.keys(MAGE_SKILL_CATEGORIES).map((category) => (
                            <ProgressLine
                                key={category}
                                label={`${category} skills`}
                                spent={skillReport[category]?.spent ?? 0}
                                expected={skillReport[category]?.expected}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="space-y-1">
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Resistance Dot</div>
                    <Select
                        value={choices.resistance_attribute_bonus || ""}
                        onValueChange={(value) => setChoice({ resistance_attribute_bonus: value })}
                    >
                        <SelectTrigger className="h-7 bg-zinc-900/60 border-zinc-800 text-[11px]" data-testid="resistance-bonus-select">
                            <SelectValue placeholder="Unset" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="resolve" className="text-xs">Resolve</SelectItem>
                            <SelectItem value="composure" className="text-xs">Composure</SelectItem>
                            <SelectItem value="stamina" className="text-xs">Stamina</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                    <ProgressLine label="Arcana" spent={arcanaReport.spent} expected={arcanaReport.expected} />
                    <ProgressLine label="Rotes" spent={(character.rotes || []).length} expected={MAGE_CREATION_RULES.rotes} />
                </div>

                <div className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                    <ProgressLine label="Praxes" spent={(character.praxes || []).length} expected={getValue("gnosis") || 1} />
                    <ProgressLine label="Obsessions" spent={obsessionReport.current} expected={obsessionReport.expected} />
                </div>

                <div className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                    <ProgressLine label="Merits" spent={meritsReport.spent} expected={meritsReport.available} />
                    <ProgressLine label="Specialties" spent={(character.specialties || []).length} expected={MAGE_CREATION_RULES.specialties} />
                </div>
            </div>

            {(validation.errors.length > 0 || validation.warnings.length > 0) && (
                <div className="space-y-1">
                    {validation.errors.slice(0, 8).map((error, index) => (
                        <div key={`error-${index}`} className="flex gap-2 text-[10px] text-rose-300 bg-rose-950/20 border border-rose-900/40 rounded-sm p-1.5">
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    ))}
                    {validation.errors.length > 8 && (
                        <div className="text-[10px] text-rose-400">+{validation.errors.length - 8} more errors</div>
                    )}
                    {validation.warnings.slice(0, 4).map((warning, index) => (
                        <div key={`warning-${index}`} className="flex gap-2 text-[10px] text-amber-300 bg-amber-950/20 border border-amber-900/40 rounded-sm p-1.5">
                            <Info className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>{warning}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
