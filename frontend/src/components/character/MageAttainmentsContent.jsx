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
import { toast } from "sonner";
import { ARCANA, MAGE_ATTAINMENTS, PATH_ARCANA } from "../../data/character-data";
import { LegacyAttainmentsSection } from "./LegacyAttainmentsSection";

const UTILITY_ATTAINMENTS = [
    { arcanum: "Death", name: "Eyes of the Dead" },
    { arcanum: "Fate", name: "Conditional Duration" },
    { arcanum: "Forces", name: "Precise Force" },
    { arcanum: "Life", name: "Improved Pattern Restoration" },
    { arcanum: "Matter", name: "Permanence" },
    { arcanum: "Mind", name: "Mind's Eye" },
    { arcanum: "Prime", name: "Universal Counterspell" },
    { arcanum: "Space", name: "Sympathetic Range" },
    { arcanum: "Spirit", name: "Spirit Eyes" },
    { arcanum: "Time", name: "Temporal Sympathy" },
];

const UTILITY_DESCRIPTIONS = {
    Death:
        "Peripheral Death Sight reacts to ghosts and deathly Twilight. Active Death Sight automatically sees souls and ghosts in Twilight. Spend 1 Mana to interact with ghosts for the scene.",
    Forces:
        "After spending a full turn calculating the action, gain 9-Again on an applicable physical attack or projectile/aimed kinetic force. Against a stationary object, ignore 2 Durability and a successful hit inflicts +2 Structure damage; against a stationary armored target, a successful strike destroys and ignores 1/1 armor.",
    Life:
        "Pattern Restoration improves to 1 Mana per bashing wound and 2 Mana per lethal wound. Scouring a Physical Attribute no longer reduces derived traits based on that Attribute.",
    Mind:
        "Peripheral Mind Sight reacts to Goetia, Astral beings, and Twilight projections. Active Mind Sight automatically sees Goetia and projecting beings in Twilight. Spend 1 Mana to interact with Goetia for the scene.",
    Spirit:
        "Peripheral Spirit Sight reacts to spirits and spiritual Twilight. Active Spirit Sight automatically sees spirits and projecting beings in Twilight. Spend 1 Mana to interact with spirits for the scene.",
};

const getUtilityDescription = (arcanum) =>
    UTILITY_DESCRIPTIONS[arcanum] ||
    MAGE_ATTAINMENTS?.[arcanum]?.[2]?.description ||
    "";

export const MageAttainmentsContent = ({
    getValue,
    handleChange,
    onTriggerDiceRoll,
    onUpdateCharacter,
    onAddRecentRoll,
}) => {
    const arcana = getValue("arcana") || {};
    const gnosis = Math.max(1, Number(getValue("gnosis")) || 1);
    const path = getValue("path") || "";
    const pathRuling = PATH_ARCANA[path]?.ruling || [];
    const currentMana = Math.max(0, Number(getValue("mana")) || 0);
    const activeSpells = Array.isArray(getValue("active_spells"))
        ? getValue("active_spells")
        : [];

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

    const hasActiveEffect = (effectKey) =>
        activeSpells.some((effect) => effect?.effect_key === effectKey);

    const commitImmediate = async (patch) => {
        if (typeof onUpdateCharacter === "function") {
            await onUpdateCharacter(patch);
            return;
        }

        Object.entries(patch).forEach(([field, value]) => {
            handleChange(field, value);
        });
    };

    const activateTwilightInteraction = async ({
        effectKey,
        name,
        arcanum,
        targetLabel,
    }) => {
        if (hasActiveEffect(effectKey)) return;

        if (currentMana < 1) {
            toast.error("Not enough Mana.");
            return;
        }

        const effect = {
            id: `attainment-${effectKey}-${Date.now()}`,
            kind: "effect",
            effect_key: effectKey,
            name: `${name} — Interaction`,
            subtitle: `${arcanum} 2 Attainment`,
            duration: "Scene",
            description:
                `You can speak with, touch, and strike ${targetLabel} for the rest of the scene. ` +
                `This also leaves you vulnerable to their interaction.`,
        };

        await commitImmediate({
            mana: currentMana - 1,
            active_spells: [...activeSpells, effect],
        });

        toast.success(`${name} interaction activated for the scene.`);
    };

    const preparePreciseForce = async () => {
        const effectKey = "precise-force-prepared";

        if (hasActiveEffect(effectKey)) return;

        const effect = {
            id: `attainment-${effectKey}-${Date.now()}`,
            kind: "effect",
            effect_key: effectKey,
            name: "Precise Force — Prepared",
            subtitle: "Forces 2 Attainment",
            duration: "Next applicable attack",
            description:
                "A full turn has been spent calculating the action. The next applicable physical attack " +
                "uses 9-Again. Against a stationary object, ignore 2 Durability and a successful hit deals " +
                "+2 Structure damage. Against a stationary armored target, a successful strike destroys " +
                "and ignores 1/1 armor.",
        };

        await commitImmediate({
            active_spells: [...activeSpells, effect],
        });

        toast.success("Precise Force prepared.");
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

    const renderUtilityAttainment = ({ arcanum, name }) => {
        const isEyesOfDead = arcanum === "Death";
        const isPreciseForce = arcanum === "Forces";
        const isPatternRestoration = arcanum === "Life";
        const isMindsEye = arcanum === "Mind";
        const isSpiritEyes = arcanum === "Spirit";

        const deathActive = hasActiveEffect("eyes-of-the-dead-interaction");
        const mindActive = hasActiveEffect("minds-eye-interaction");
        const spiritActive = hasActiveEffect("spirit-eyes-interaction");
        const precisePrepared = hasActiveEffect("precise-force-prepared");

        let action = null;

        if (isEyesOfDead) {
            action = {
                label: deathActive ? "Active" : "Interact · 1 Mana",
                disabled: deathActive || currentMana < 1,
                onClick: () =>
                    activateTwilightInteraction({
                        effectKey: "eyes-of-the-dead-interaction",
                        name,
                        arcanum,
                        targetLabel: "ghosts and souls in Twilight",
                    }),
            };
        }

        if (isMindsEye) {
            action = {
                label: mindActive ? "Active" : "Interact · 1 Mana",
                disabled: mindActive || currentMana < 1,
                onClick: () =>
                    activateTwilightInteraction({
                        effectKey: "minds-eye-interaction",
                        name,
                        arcanum,
                        targetLabel: "Goetia and projecting beings in Mental Twilight",
                    }),
            };
        }

        if (isSpiritEyes) {
            action = {
                label: spiritActive ? "Active" : "Interact · 1 Mana",
                disabled: spiritActive || currentMana < 1,
                onClick: () =>
                    activateTwilightInteraction({
                        effectKey: "spirit-eyes-interaction",
                        name,
                        arcanum,
                        targetLabel: "spirits and projecting beings in spiritual Twilight",
                    }),
            };
        }

        if (isPreciseForce) {
            action = {
                label: precisePrepared ? "Prepared" : "Prepare",
                disabled: precisePrepared,
                onClick: preparePreciseForce,
            };
        }

        return (
            <TooltipProvider key={arcanum}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="inline-flex items-center gap-1 rounded border border-zinc-700/50 bg-zinc-800/50 px-2 py-1 text-[10px] text-zinc-300">
                            <span className="font-mono text-violet-400">●●</span>
                            <span>{name}</span>

                            {action && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="ml-1 h-5 px-1.5 text-[9px] text-teal-300 hover:bg-teal-950/30 hover:text-teal-200 disabled:opacity-40"
                                    disabled={action.disabled}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        action.onClick();
                                    }}
                                    data-testid={`utility-attainment-${arcanum.toLowerCase()}-action`}
                                >
                                    {action.label}
                                </Button>
                            )}

                            {isPatternRestoration && (
                                <span className="ml-1 text-[9px] text-emerald-400">
                                    Combat
                                </span>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm border-zinc-700 bg-zinc-900">
                        <p className="text-xs font-medium text-violet-300">
                            {arcanum} 2 — {name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-300">
                            {getUtilityDescription(arcanum)}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
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
                                Raise an Arcanum to 2 dots to unlock its Lesser Utility Attainment.
                            </span>
                        ) : (
                            unlockedUtilityAttainments.map(renderUtilityAttainment)
                        )}
                    </div>
                </div>
            </div>

            <LegacyAttainmentsSection
                getValue={getValue}
                handleChange={handleChange}
                onUpdateCharacter={onUpdateCharacter}
                onAddRecentRoll={onAddRecentRoll}
            />
        </div>
    );
};
