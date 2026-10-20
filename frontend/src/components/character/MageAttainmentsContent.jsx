import { useMemo } from "react";
import { Dices, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ARCANA, MAGE_ATTAINMENTS, PATH_ARCANA } from "../../data/character-data";
import { LegacyAttainmentsSection } from "./LegacyAttainmentsSection";

const UTILITY_ATTAINMENTS = [
    { arcanum: "Death", name: "Eyes of the Dead" },
    { arcanum: "Forces", name: "Precise Force" },
    { arcanum: "Matter", name: "Permanence" },
];

const getUtilityDescription = (arcanum) =>
    MAGE_ATTAINMENTS?.[arcanum]?.[2]?.description || "";

export const MageAttainmentsContent = ({
    getValue,
    handleChange,
    onTriggerDiceRoll,
}) => {
    const arcana = getValue("arcana") || {};
    const gnosis = Math.max(1, Number(getValue("gnosis")) || 1);
    const path = getValue("path") || "";
    const pathRuling = PATH_ARCANA[path]?.ruling || [];

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
                <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">
                    Arcana Attainments
                </p>

                <div className="flex items-start gap-4">
                    <div className="shrink-0 space-y-1.5">
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
                                                    className="h-7 border-violet-500/40 bg-violet-900/30 px-2.5 text-xs text-violet-300 hover:bg-violet-800/40"
                                                    data-testid="counterspell-btn"
                                                >
                                                    <Dices className="mr-1.5 h-3 w-3" />
                                                    Counterspell
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="border-zinc-700 bg-zinc-900">
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
                                <TooltipContent className="max-w-xs border-zinc-700 bg-zinc-900">
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
                                                    className="h-7 border-teal-500/40 bg-teal-900/30 px-2.5 text-xs text-teal-300 hover:bg-teal-800/40"
                                                    data-testid="targeted-summoning-btn"
                                                >
                                                    <Zap className="mr-1.5 h-3 w-3" />
                                                    Targeted Summoning
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="max-h-64 overflow-y-auto border-zinc-700 bg-zinc-900">
                                                {targetedSummoningCombinations.map(({ primary, secondary }) => (
                                                    <DropdownMenuItem
                                                        key={`${primary}-${secondary}`}
                                                        onSelect={() => triggerTargetedSummoning({ primary, secondary })}
                                                        className="text-xs text-zinc-200"
                                                    >
                                                        {primary} → secondary {secondary}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm border-zinc-700 bg-zinc-900">
                                    <p className="text-xs text-zinc-300">
                                        Supernal summoning uses Gnosis + a Path Ruling Arcanum at 3+.
                                        Targeted Summoning specifies another Arcanum you have at 3+ as
                                        the entity&apos;s second Arcanum and raises the cost to 2 Mana.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex flex-1 flex-wrap content-start gap-1">
                        {unlockedUtilityAttainments.length === 0 ? (
                            <span className="text-[10px] italic text-zinc-600">
                                Death 2, Forces 2, or Matter 2 unlocks the utility attainments shown here.
                            </span>
                        ) : (
                            unlockedUtilityAttainments.map(({ arcanum, name }) => (
                                <TooltipProvider key={arcanum}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="inline-flex cursor-help items-center gap-1 rounded border border-zinc-700/50 bg-zinc-800/50 px-2 py-1 text-[10px] text-zinc-300">
                                                <span className="font-mono text-violet-400">●●</span>
                                                {name}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs border-zinc-700 bg-zinc-900">
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

            <LegacyAttainmentsSection
                getValue={getValue}
                handleChange={handleChange}
            />
        </div>
    );
};
