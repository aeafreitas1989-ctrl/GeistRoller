import { useMemo, useState } from "react";
import { Dices, Plus, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ARCANA, MAGE_ATTAINMENTS, PATH_ARCANA } from "../../data/character-data";


const DEFAULT_ATTAINMENT = {
    name: "",
    level: 1,
    legacy: "",
    description: "",
    tutored: true,
};

const UTILITY_ATTAINMENTS = [
    { arcanum: "Death", name: "Eyes of the Dead" },
    { arcanum: "Forces", name: "Precise Force" },
    { arcanum: "Matter", name: "Permanence" },
];

const makeId = () =>
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const normalizeLearnedAttainment = (attainment, index) => {
    if (typeof attainment === "string") {
        return {
            id: `legacy-attainment-${index}`,
            ...DEFAULT_ATTAINMENT,
            name: attainment,
        };
    }

    return {
        id: attainment?.id || `legacy-attainment-${index}`,
        ...DEFAULT_ATTAINMENT,
        ...(attainment || {}),
        level: Math.min(5, Math.max(1, Number(attainment?.level) || 1)),
        tutored: attainment?.tutored !== false,
    };
};

const getUtilityDescription = (arcanum) =>
    MAGE_ATTAINMENTS?.[arcanum]?.[2]?.description || "";

export const MageAttainmentsContent = ({
    getValue,
    handleChange,
    onTriggerDiceRoll,
}) => {
    const [addOpen, setAddOpen] = useState(false);
    const [draft, setDraft] = useState(DEFAULT_ATTAINMENT);

    const arcana = getValue("arcana") || {};
    const gnosis = Math.max(1, Number(getValue("gnosis")) || 1);
    const path = getValue("path") || "";
    const pathRuling = PATH_ARCANA[path]?.ruling || [];

    const rawLearnedAttainments = Array.isArray(getValue("attainments"))
        ? getValue("attainments")
        : [];

    const learnedAttainments = rawLearnedAttainments.map(normalizeLearnedAttainment);

    const counterspellArcana = ARCANA.filter(
        (arcanum) => (arcana[arcanum] || 0) >= 1
    );

    const targetedSummoningCombinations = useMemo(() => {
        const eligiblePrimaries = pathRuling.filter(
            (arcanum) => (arcana[arcanum] || 0) >= 3
        );
        const eligibleSecondaries = ARCANA.filter(
            (arcanum) => (arcana[arcanum] || 0) >= 3
        );

        return eligiblePrimaries.flatMap((primary) =>
            eligibleSecondaries
                .filter((secondary) => secondary !== primary)
                .map((secondary) => ({ primary, secondary }))
        );
    }, [arcana, pathRuling]);

    const unlockedUtilityAttainments = UTILITY_ATTAINMENTS.filter(
        ({ arcanum }) => (arcana[arcanum] || 0) >= 2
    );

    const updateLearnedAttainment = (index, patch) => {
        const next = [...rawLearnedAttainments];
        next[index] = {
            ...normalizeLearnedAttainment(rawLearnedAttainments[index], index),
            ...patch,
        };
        handleChange("attainments", next);
    };

    const removeLearnedAttainment = (index) => {
        handleChange(
            "attainments",
            rawLearnedAttainments.filter(
                (_, attainmentIndex) => attainmentIndex !== index
            )
        );
    };

    const addLearnedAttainment = () => {
        if (!draft.name.trim()) return;

        const nextAttainment = {
            id: makeId(),
            name: draft.name.trim(),
            level: Math.min(5, Math.max(1, Number(draft.level) || 1)),
            legacy: draft.legacy.trim(),
            description: draft.description.trim(),
            tutored: draft.tutored !== false,
        };

        handleChange("attainments", [
            ...rawLearnedAttainments,
            nextAttainment,
        ]);

        setDraft(DEFAULT_ATTAINMENT);
        setAddOpen(false);
    };

    const triggerCounterspell = (arcanum, universal = false) => {
        const rating = Math.max(1, Number(arcana[arcanum]) || 1);
        onTriggerDiceRoll?.({
            pool: gnosis + rating,
            again: 10,
            rote: false,
            chance: false,
            exceptional_target: 5,
            label: universal
                ? "Universal Counterspell (Prime)"
                : `Counterspell (${arcanum})`,
            dicePoolBreakdown: `Gnosis ${gnosis} + ${arcanum} ${rating}`,
            spellSummary: "Clash of Wills. Active Mage Sight is required.",
        });
    };

    const triggerTargetedSummoning = ({ primary, secondary }) => {
        const rating = Math.max(3, Number(arcana[primary]) || 3);
        onTriggerDiceRoll?.({
            pool: gnosis + rating,
            again: 10,
            rote: false,
            chance: false,
            exceptional_target: 5,
            label: `Targeted Summoning (${primary} + ${secondary})`,
            dicePoolBreakdown: `Gnosis ${gnosis} + ${primary} ${rating}`,
            spellSummary:
                `Extended Supernal summoning. ${primary} is the Path Ruling Arcanum; ` +
                `${secondary} is specified as the second Arcanum. Cost: 2 Mana.`,
        });
    };

    return (
        <div className="space-y-3" data-testid="mage-attainments">
            <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
                    Arcana Attainments
                </p>

                <div className="flex gap-4 items-start">
                    <div className="space-y-1.5 shrink-0">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={counterspellArcana.length === 0}
                                                    className="h-7 px-2.5 text-xs bg-violet-900/30 border-violet-500/40 text-violet-300 hover:bg-violet-800/40"
                                                    data-testid="counterspell-btn"
                                                >
                                                    <Dices className="w-3 h-3 mr-1.5" />
                                                    Counterspell
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                                                {counterspellArcana.map((arcanum) => (
                                                    <DropdownMenuItem
                                                        key={arcanum}
                                                        onSelect={() => triggerCounterspell(arcanum)}
                                                        className="text-xs text-zinc-200"
                                                    >
                                                        {arcanum} — Gnosis + {arcanum}
                                                    </DropdownMenuItem>
                                                ))}
                                                {(arcana.Prime || 0) >= 2 && (
                                                    <>
                                                        <DropdownMenuSeparator className="bg-zinc-700" />
                                                        <DropdownMenuItem
                                                            onSelect={() => triggerCounterspell("Prime", true)}
                                                            className="text-xs text-violet-300"
                                                        >
                                                            Universal Counterspell — Gnosis + Prime
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-900 border-zinc-700 max-w-xs">
                                    <p className="text-xs text-zinc-300">
                                        Choose the relevant Arcanum. Counterspell is a Clash of Wills
                                        using Gnosis + Arcanum and requires Active Mage Sight.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={targetedSummoningCombinations.length === 0}
                                                    className="h-7 px-2.5 text-xs bg-teal-900/30 border-teal-500/40 text-teal-300 hover:bg-teal-800/40"
                                                    data-testid="targeted-summoning-btn"
                                                >
                                                    <Zap className="w-3 h-3 mr-1.5" />
                                                    Targeted Summoning
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-zinc-900 border-zinc-700 max-h-64 overflow-y-auto">
                                                {targetedSummoningCombinations.map(({ primary, secondary }) => (
                                                    <DropdownMenuItem
                                                        key={`${primary}-${secondary}`}
                                                        onSelect={() =>
                                                            triggerTargetedSummoning({ primary, secondary })
                                                        }
                                                        className="text-xs text-zinc-200"
                                                    >
                                                        {primary} → secondary {secondary}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-900 border-zinc-700 max-w-sm">
                                    <p className="text-xs text-zinc-300">
                                        Supernal summoning uses Gnosis + a Path Ruling Arcanum at 3+.
                                        Targeted Summoning specifies another Arcanum you have at 3+ as
                                        the entity&apos;s second Arcanum and raises the cost to 2 Mana.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex flex-wrap gap-1 flex-1 content-start">
                        {unlockedUtilityAttainments.length === 0 ? (
                            <span className="text-[10px] text-zinc-600 italic">
                                Death 2, Forces 2, or Matter 2 unlocks the utility attainments shown here.
                            </span>
                        ) : (
                            unlockedUtilityAttainments.map(({ arcanum, name }) => (
                                <TooltipProvider key={arcanum}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] rounded bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 cursor-help">
                                                <span className="text-violet-400 font-mono">●●</span>
                                                {name}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-zinc-900 border-zinc-700 max-w-xs">
                                            <p className="text-xs font-medium text-violet-300">
                                                {arcanum} 2
                                            </p>
                                            <p className="text-xs text-zinc-300">
                                                {getUtilityDescription(arcanum)}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-1.5">
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                            Learned / Legacy Attainments
                        </p>
                        <p className="text-[9px] text-zinc-600">
                            Custom Attainments are stored separately from automatic Arcana Attainments.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setAddOpen(true)}
                        className="h-5 px-2 text-[10px] btn-secondary"
                        data-testid="add-attainment-btn"
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                    </Button>
                </div>

                {learnedAttainments.length === 0 ? (
                    <p className="text-[10px] text-zinc-600 italic">
                        No learned Attainments added.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {learnedAttainments.map((attainment, index) => (
                            <div
                                key={attainment.id || index}
                                className="p-2 rounded-sm bg-zinc-900/30 border border-zinc-800 space-y-2"
                                data-testid={`learned-attainment-${index}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={attainment.name}
                                        onChange={(event) =>
                                            updateLearnedAttainment(index, {
                                                name: event.target.value,
                                            })
                                        }
                                        placeholder="Attainment name"
                                        className="h-7 input-geist text-xs flex-1"
                                        data-testid={`attainment-${index}-name`}
                                    />
                                    <Select
                                        value={String(attainment.level)}
                                        onValueChange={(value) =>
                                            updateLearnedAttainment(index, {
                                                level: Number(value),
                                            })
                                        }
                                    >
                                        <SelectTrigger
                                            className="h-7 w-[92px] bg-zinc-900/50 border-zinc-700 text-xs"
                                            data-testid={`attainment-${index}-level`}
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <SelectItem
                                                    key={level}
                                                    value={String(level)}
                                                    className="text-xs"
                                                >
                                                    {"●".repeat(level)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLearnedAttainment(index)}
                                        className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400"
                                        data-testid={`attainment-${index}-delete`}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Input
                                        value={attainment.legacy}
                                        onChange={(event) =>
                                            updateLearnedAttainment(index, {
                                                legacy: event.target.value,
                                            })
                                        }
                                        placeholder="Legacy / source"
                                        className="h-7 input-geist text-xs flex-1"
                                        data-testid={`attainment-${index}-legacy`}
                                    />
                                    <label className="flex items-center gap-2 text-[10px] text-zinc-400 shrink-0">
                                        <Switch
                                            checked={attainment.tutored}
                                            onCheckedChange={(checked) =>
                                                updateLearnedAttainment(index, {
                                                    tutored: !!checked,
                                                })
                                            }
                                            data-testid={`attainment-${index}-tutored`}
                                        />
                                        Tutored
                                    </label>
                                </div>

                                <Textarea
                                    value={attainment.description}
                                    onChange={(event) =>
                                        updateLearnedAttainment(index, {
                                            description: event.target.value,
                                        })
                                    }
                                    placeholder="Effect / notes"
                                    className="input-geist min-h-[52px] text-xs"
                                    data-testid={`attainment-${index}-description`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-violet-300">
                            Add Learned Attainment
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            For a locked Mage, adding a Legacy Attainment uses the existing
                            advancement purchase flow.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                Name
                            </label>
                            <Input
                                value={draft.name}
                                onChange={(event) =>
                                    setDraft((previous) => ({
                                        ...previous,
                                        name: event.target.value,
                                    }))
                                }
                                className="h-8 input-geist text-sm mt-0.5"
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                    Attainment Level
                                </label>
                                <Select
                                    value={String(draft.level)}
                                    onValueChange={(value) =>
                                        setDraft((previous) => ({
                                            ...previous,
                                            level: Number(value),
                                        }))
                                    }
                                >
                                    <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-700 text-xs mt-0.5">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <SelectItem
                                                key={level}
                                                value={String(level)}
                                                className="text-xs"
                                            >
                                                {level} — {"●".repeat(level)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                    Legacy / Source
                                </label>
                                <Input
                                    value={draft.legacy}
                                    onChange={(event) =>
                                        setDraft((previous) => ({
                                            ...previous,
                                            legacy: event.target.value,
                                        }))
                                    }
                                    className="h-8 input-geist text-xs mt-0.5"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-zinc-950/40 border border-zinc-800 rounded-sm">
                            <div>
                                <p className="text-xs text-zinc-300">Tutored</p>
                                <p className="text-[10px] text-zinc-600">
                                    Determines which existing Legacy Attainment XP cost is used.
                                </p>
                            </div>
                            <Switch
                                checked={draft.tutored}
                                onCheckedChange={(checked) =>
                                    setDraft((previous) => ({
                                        ...previous,
                                        tutored: !!checked,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                Effect / Notes
                            </label>
                            <Textarea
                                value={draft.description}
                                onChange={(event) =>
                                    setDraft((previous) => ({
                                        ...previous,
                                        description: event.target.value,
                                    }))
                                }
                                className="input-geist min-h-[72px] text-xs mt-0.5"
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={addLearnedAttainment}
                            disabled={!draft.name.trim()}
                            className="btn-primary w-full"
                            data-testid="confirm-add-attainment-btn"
                        >
                            Add Attainment
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
