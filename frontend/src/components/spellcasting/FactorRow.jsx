import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

/**
 * A single row inside the Spell Factors table.
 * Renders one of: Casting Time, Range, Potency, Duration, Scale.
 *
 * The row is heavily-coupled to the parent SpellcastingPopup state — that
 * coupling is preserved here intentionally: the component takes the props it
 * needs without trying to re-derive any of that state internally.
 */
export const FactorRow = ({
    factorName,
    label,
    hasLevels,
    factor,
    displayedLevel,
    description,
    paidLevels,
    freeLevelsFromPrimary,
    isSelectedPrimary,
    isEffectivePrimary,
    hasPrimary,
    canTogglePrimary,
    onSelectPrimary,
    overridePrimaryFactor,
    onToggleStandard,
    onToggleAdvanced,
    onDecreaseLevel,
    onIncreaseLevel,
    canDecreaseLevel,
    canIncreaseLevel,
    standardDisabled,
    advancedDisabled,
    levelDisabled,
    // Casting-time ritual bonus (only rendered when factorName === "casting" and standard)
    ritualCastingBonus,
    onDecreaseRitualBonus,
    onIncreaseRitualBonus,
    canDecreaseRitualBonus,
    canIncreaseRitualBonus,
    // Duration extras
    lastingDuration,
    onToggleLasting,
    canUseFateDuration,
    fateDurationBonus,
    onSetFateDurationBonus,
    canUseMatterDurationMana,
    matterDurationMana,
    onToggleMatterDurationMana,
    arcanum,
    // Range extras
    canUseSpaceSympathetic,
    canUseTimeSympathetic,
    specialRangeMode,
    onActivateSpecialRange,
    sympatheticWithstand,
    onDecreaseSympatheticWithstand,
    onIncreaseSympatheticWithstand,
}) => {
    const isCasting = factorName === "casting";
    const isRange = factorName === "range";
    const isDuration = factorName === "duration";

    return (
        <div className="grid grid-cols-[20px_170px_50px_50px_50px_1fr] gap-1.5 items-center p-2 bg-zinc-800/30 rounded text-sm">
            {hasPrimary ? (
                <Checkbox
                    checked={isSelectedPrimary}
                    disabled={!canTogglePrimary}
                    onCheckedChange={(checked) => {
                        if (checked) onSelectPrimary(factorName);
                    }}
                    className="border-zinc-600 data-[state=checked]:bg-teal-600 h-3.5 w-3.5"
                    data-testid={`primary-${factorName}`}
                />
            ) : (
                <span />
            )}

            <div className="text-xs">
                <div className="text-zinc-300">
                    {label}
                    {isEffectivePrimary && (
                        <span className="text-teal-400 text-[9px] ml-1">
                            {overridePrimaryFactor ? "PFO" : "P"}
                        </span>
                    )}
                </div>

                {isDuration && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        <button
                            type="button"
                            onClick={onToggleLasting}
                            className={`px-1.5 py-0.5 rounded border text-[9px] ${
                                lastingDuration
                                    ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-300"
                                    : "bg-zinc-900/40 border-zinc-700 text-zinc-400"
                            }`}
                            data-testid="duration-lasting"
                        >
                            Lasting
                        </button>
                        {canUseFateDuration && [0, 1, 2, 3].map((bonus) => (
                            <button
                                key={`fate-duration-${bonus}`}
                                type="button"
                                onClick={() => onSetFateDurationBonus(bonus)}
                                className={`px-1.5 py-0.5 rounded border text-[9px] ${
                                    fateDurationBonus === bonus
                                        ? "bg-blue-900/40 border-blue-500/50 text-blue-300"
                                        : "bg-zinc-900/40 border-zinc-700 text-zinc-400"
                                }`}
                                data-testid={`fate-duration-${bonus}`}
                            >
                                F{bonus === 0 ? "0" : `+${bonus}`}
                            </button>
                        ))}

                        {canUseMatterDurationMana && (
                            <button
                                type="button"
                                onClick={onToggleMatterDurationMana}
                                className={`px-1.5 py-0.5 rounded border text-[9px] ${
                                    matterDurationMana
                                        ? "bg-amber-900/40 border-amber-500/50 text-amber-300"
                                        : "bg-zinc-900/40 border-zinc-700 text-zinc-400"
                                }`}
                                data-testid="matter-duration-mana"
                            >
                                Matter 2
                            </button>
                        )}
                    </div>
                )}

                {isRange && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {canUseSpaceSympathetic && (
                            <button
                                type="button"
                                onClick={() => onActivateSpecialRange("space")}
                                className={`px-1.5 py-0.5 rounded border text-[9px] ${
                                    specialRangeMode === "space"
                                        ? "bg-blue-900/40 border-blue-500/50 text-blue-300"
                                        : "bg-zinc-900/40 border-zinc-700 text-zinc-400"
                                }`}
                                data-testid="space-sympathetic-range"
                            >
                                Space 2
                            </button>
                        )}

                        {canUseTimeSympathetic && (
                            <button
                                type="button"
                                onClick={() => onActivateSpecialRange("time")}
                                className={`px-1.5 py-0.5 rounded border text-[9px] ${
                                    specialRangeMode === "time"
                                        ? "bg-blue-900/40 border-blue-500/50 text-blue-300"
                                        : "bg-zinc-900/40 border-zinc-700 text-zinc-400"
                                }`}
                                data-testid="time-sympathetic-time"
                            >
                                Time 2
                            </button>
                        )}

                        {specialRangeMode !== "none" && (
                            <div className="flex items-center gap-0.5">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 text-zinc-400"
                                    onClick={onDecreaseSympatheticWithstand}
                                    disabled={sympatheticWithstand <= 0}
                                >
                                    <Minus className="w-2.5 h-2.5" />
                                </Button>
                                <span className="w-4 text-center text-[10px] font-mono text-violet-300">
                                    {sympatheticWithstand}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 text-zinc-400"
                                    onClick={onIncreaseSympatheticWithstand}
                                    disabled={sympatheticWithstand >= 5}
                                >
                                    <Plus className="w-2.5 h-2.5" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-center">
                <Checkbox
                    checked={!factor.advanced && !(isDuration && lastingDuration)}
                    onCheckedChange={onToggleStandard}
                    className="border-zinc-600 data-[state=checked]:bg-violet-600"
                    disabled={standardDisabled}
                    data-testid={`factor-${factorName}-std`}
                />
            </div>

            <div className="flex justify-center">
                <Checkbox
                    checked={factor.advanced && !(isDuration && lastingDuration)}
                    onCheckedChange={onToggleAdvanced}
                    className="border-zinc-600 data-[state=checked]:bg-amber-600"
                    disabled={advancedDisabled}
                    data-testid={`factor-${factorName}-adv`}
                />
            </div>

            {hasLevels ? (
                <div className="flex items-center justify-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-zinc-400"
                        onClick={onDecreaseLevel}
                        disabled={!canDecreaseLevel || levelDisabled}
                    >
                        <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-mono text-violet-300 w-4 text-center">
                        {isDuration && lastingDuration ? "—" : displayedLevel}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-zinc-400"
                        onClick={onIncreaseLevel}
                        disabled={!canIncreaseLevel || levelDisabled}
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
            ) : isCasting && !factor.advanced ? (
                <div className="flex items-center justify-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-zinc-400"
                        onClick={onDecreaseRitualBonus}
                        disabled={!canDecreaseRitualBonus}
                        data-testid="ritual-casting-decrease"
                    >
                        <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-mono text-violet-300 w-4 text-center">{ritualCastingBonus}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-zinc-400"
                        onClick={onIncreaseRitualBonus}
                        disabled={!canIncreaseRitualBonus}
                        data-testid="ritual-casting-increase"
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
            ) : (
                <span className="text-center text-zinc-500">-</span>
            )}

            <span className="text-xs text-zinc-400 truncate">
                {description}
                {factor.advanced && !isDuration && <span className="text-amber-400 ml-1">(+1R)</span>}
                {factor.advanced && isDuration && !matterDurationMana && <span className="text-amber-400 ml-1">(+1R)</span>}
                {factor.advanced && isDuration && matterDurationMana && arcanum === "Matter" && <span className="text-blue-400 ml-1">(+1 Mana)</span>}
                {isRange && specialRangeMode !== "none" && <span className="text-blue-400 ml-1">(+1 Mana, +1 Reach)</span>}
                {isDuration && fateDurationBonus > 0 && <span className="text-blue-400 ml-1">(+{fateDurationBonus} lvl, +1 Mana)</span>}
                {isCasting && !factor.advanced && ritualCastingBonus > 0 && <span className="text-teal-400 ml-1">(+{ritualCastingBonus}d)</span>}
                {hasLevels && paidLevels > 0 && <span className="text-red-400 ml-1">(-{paidLevels * 2}d)</span>}
                {hasLevels && freeLevelsFromPrimary > 0 && factor.level > 1 && <span className="text-teal-400 ml-1">(+{Math.min(freeLevelsFromPrimary, factor.level - 1)}free)</span>}
            </span>
        </div>
    );
};
