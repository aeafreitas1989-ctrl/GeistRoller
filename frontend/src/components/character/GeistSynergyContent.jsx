import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { SynergyTrack, HealthTrack, ResourceTrack } from "./StatComponents";

export const GeistSynergyContent = ({
    getValue, handleChange,
    currentSynergy, synergyData,
    healthBoxes, maxHealth, filledHealth, isDeadTrack, woundPenalty,
    handleHealthBoxClick,
    calculateWillpowerMax,
}) => {
    return (
        <>
            {/* Original Geist content */}
            <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Synergy</label>
                <SynergyTrack value={getValue("synergy") || 7} maxValue={getValue("synergy_max") || 10} onChangeValue={(v) => handleChange("synergy", v)} onChangeMax={(v) => handleChange("synergy_max", v)} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 bg-zinc-900/50 rounded-sm">
                    <span className="text-zinc-500">Trait Max:</span>
                    <span className="text-teal-400 ml-1 font-mono">{synergyData.traitMax}</span>
                </div>
                <div className="p-2 bg-zinc-900/50 rounded-sm">
                    <span className="text-zinc-500">Plasm/Turn:</span>
                    <span className="text-teal-400 ml-1 font-mono">{synergyData.perTurn}</span>
                </div>
            </div>

            <div className="p-2 bg-violet-900/20 border border-violet-500/30 rounded-sm">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-violet-400 uppercase tracking-wider">Liminal Aura</span>
                    <span className="text-xs font-mono text-violet-300">{synergyData.aura}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500">Condition:</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                        synergyData.auraCondition === "N/A" ? "bg-zinc-800 text-zinc-500" :
                        synergyData.auraCondition === "Anchor" ? "bg-amber-900/30 text-amber-400" :
                        synergyData.auraCondition === "Open" ? "bg-teal-900/30 text-teal-400" :
                        "bg-violet-900/30 text-violet-400"
                    }`}>{synergyData.auraCondition}</span>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Health</label>
                    <span className="text-[10px] text-zinc-600 font-mono" data-testid="health-count">{filledHealth}/{maxHealth}</span>
                </div>
                <div className="flex items-center gap-2">
                    {isDeadTrack && (
                        <span className="text-[10px] text-rose-400 font-mono" data-testid="health-dead-label">DEAD</span>
                    )}
                    <HealthTrack boxes={healthBoxes} max={maxHealth} onBoxClick={handleHealthBoxClick} />
                </div>
                {woundPenalty < 0 && (
                    <p className="text-[10px] text-rose-400 mt-1" data-testid="health-wound-penalty">
                        Wound Penalty {woundPenalty}
                    </p>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Willpower</label>
                    <span className="text-[10px] text-zinc-600 font-mono">{getValue("willpower") || 0}/{calculateWillpowerMax()}</span>
                </div>
                <ResourceTrack current={getValue("willpower") || 0} max={calculateWillpowerMax()} onChange={(v) => handleChange("willpower", v)} color="amber" testIdPrefix="willpower" />
                <div className="flex flex-wrap gap-1 mt-2">
                    <Button
                        size="sm"
                        className="h-5 px-2 text-[9px] bg-amber-900/30 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50"
                        onClick={() => {
                            const current = getValue("willpower") || 0;
                            const max = calculateWillpowerMax();
                            if (current < max) {
                                handleChange("willpower", Math.min(current + 1, max));
                                toast.success("Willpower +1 (Rest/Virtue/Vice)");
                            }
                        }}
                        disabled={(getValue("willpower") || 0) >= calculateWillpowerMax()}
                        data-testid="wp-restore-one"
                    >
                        +1 WP
                    </Button>
                    <Button
                        size="sm"
                        className="h-5 px-2 text-[9px] bg-amber-900/30 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50"
                        onClick={() => {
                            const max = calculateWillpowerMax();
                            handleChange("willpower", max);
                            toast.success("Willpower fully restored!");
                        }}
                        disabled={(getValue("willpower") || 0) >= calculateWillpowerMax()}
                        data-testid="wp-restore-full"
                    >
                        Full WP
                    </Button>
                </div>
                <p className="text-[9px] text-zinc-600 mt-1 leading-relaxed">
                    +1: Sleep, fulfill Virtue/Vice. Full: Virtue/Vice at great cost, Grave Goods (1/chapter).
                </p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Plasm</label>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-600 font-mono">{getValue("plasm") || 0}/{synergyData.maxPlasm}</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <span className="text-[10px] px-1 py-0.5 bg-teal-900/30 text-teal-400 rounded font-mono">{synergyData.perTurn}/turn</span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-900 border-zinc-700"><p className="text-xs">Max expenditure per turn</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <ResourceTrack current={getValue("plasm") || 0} max={Math.min(synergyData.maxPlasm, 20)} onChange={(v) => handleChange("plasm", v)} color="teal" testIdPrefix="plasm" />
                {synergyData.maxPlasm > 20 && <p className="text-[10px] text-zinc-600 mt-1">Showing first 20 of {synergyData.maxPlasm} max</p>}
            </div>
        </>
    );
};
