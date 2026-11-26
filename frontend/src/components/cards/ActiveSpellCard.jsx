import { Button } from "@/components/ui/button";
import { getEffectTimer, getGameTimestamp } from "../../utils/effectDuration";

export const ActiveSpellCard = ({ spell, sceneTracker, onStartTimer, onDispel, onRelinquish, onRelinquishSafely }) => {
    const timer = getEffectTimer(spell, sceneTracker);
    const expired = timer.kind === "expired";
    const isEffect = spell.kind === "effect";
    const subtitle = spell.subtitle || [spell.arcanum, spell.practice].filter(Boolean).join(" • ");
    const showStats = !!(spell.potency || spell.duration || spell.scale);

    return (
        <div className={`bg-zinc-950 border border-zinc-800 rounded-md p-3 space-y-2 ${expired ? "opacity-50 grayscale" : ""}`}>
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h4 className="text-sm font-medium text-zinc-100">{spell.name}</h4>
                    {subtitle && (
                        <p className="text-xs text-zinc-400">{subtitle}</p>
                    )}
                </div>
            </div>

            {timer.kind !== "untimed" && (
                <div className="flex items-center justify-between gap-2 text-xs" data-testid={`active-spell-timer-${spell.id}`}>
                    <span className={expired ? "font-semibold text-zinc-400" : "text-teal-300"}>
                        {timer.label}
                    </span>
                    {timer.kind === "untracked" && onStartTimer && (
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-[10px] border border-zinc-700"
                            disabled={getGameTimestamp(sceneTracker) === null}
                            onClick={onStartTimer}
                        >
                            Start Timer
                        </Button>
                    )}
                </div>
            )}

            {spell.description && (
                <div className="rounded-sm bg-zinc-900/40 border border-zinc-800 p-2">
                    <p className="text-xs text-zinc-300 whitespace-pre-line">{spell.description}</p>
                </div>
            )}

            {showStats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {spell.potency && (
                        <div className="rounded-sm bg-zinc-900/50 border border-zinc-800 p-2">
                            <span className="text-zinc-500">Potency:</span>{" "}
                            <span className="text-zinc-200">{spell.potency}</span>
                        </div>
                    )}
                    {spell.duration && (
                        <div className="rounded-sm bg-zinc-900/50 border border-zinc-800 p-2">
                            <span className="text-zinc-500">Duration:</span>{" "}
                            <span className="text-zinc-200">{spell.duration}</span>
                        </div>
                    )}
                    {spell.scale && (
                        <div className="rounded-sm bg-zinc-900/50 border border-zinc-800 p-2 sm:col-span-2">
                            <span className="text-zinc-500">Scale:</span>{" "}
                            <span className="text-zinc-200">{spell.scale}</span>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-wrap gap-1 pt-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                    onClick={() => onDispel?.(spell.id)}
                    data-testid={`active-spell-dispel-${spell.id}`}
                >
                    {expired ? "Remove" : isEffect ? "End Effect" : "Dispel"}
                </Button>

                {!expired && !isEffect && onRelinquish && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px] text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/20"
                        onClick={() => onRelinquish(spell.id)}
                        data-testid={`active-spell-relinquish-${spell.id}`}
                    >
                        Relinquish
                    </Button>
                )}

                {!expired && !isEffect && onRelinquishSafely && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px] text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/20"
                        onClick={() => onRelinquishSafely(spell.id)}
                        data-testid={`active-spell-relinquish-safely-${spell.id}`}
                    >
                        Relinquish Safely
                    </Button>
                )}
            </div>
        </div>
    );
};
