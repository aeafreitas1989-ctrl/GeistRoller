import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTypeColors } from "../../data/cards-data";

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
