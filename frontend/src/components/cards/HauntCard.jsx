import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTypeColors } from "../../data/cards-data";

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
