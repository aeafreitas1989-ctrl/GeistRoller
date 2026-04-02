import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GNOSIS_TABLE } from "../../data/character-data";
import { SynergyTrack, HealthTrack, ResourceTrack, getHealthCounts, buildHealthBoxes } from "./StatComponents";

export const MageGnosisContent = ({
    getValue, handleChange, getNestedValue,
    healthBoxes, maxHealth, filledHealth, isDeadTrack, woundPenalty,
    handleHealthBoxClick, handleHealthBoxesChange,
    calculateWillpowerMax,
}) => {
    return (
        <>
            {/* Gnosis for Mages */}
            <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Gnosis</label>
                <SynergyTrack value={getValue("gnosis") || 1} maxValue={10} onChangeValue={(v) => handleChange("gnosis", v)} onChangeMax={() => {}} />
            </div>

            {(() => {
                const gnosisLevel = getValue("gnosis") || 1;
                const gnosisData = GNOSIS_TABLE[gnosisLevel] || GNOSIS_TABLE[1];
                return (
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 bg-zinc-900/50 rounded-sm">
                            <span className="text-zinc-500">Trait Max:</span>
                            <span className="text-violet-400 ml-1 font-mono">{gnosisData.traitMax}</span>
                        </div>
                        <div className="p-2 bg-zinc-900/50 rounded-sm">
                            <span className="text-zinc-500">Mana/Turn:</span>
                            <span className="text-violet-400 ml-1 font-mono">{gnosisData.perTurn}</span>
                        </div>
                        <div className="p-2 bg-zinc-900/50 rounded-sm">
                            <span className="text-zinc-500">Ritual Interval:</span>
                            <span className="text-violet-400 ml-1 font-mono">{gnosisData.ritualInterval}</span>
                        </div>
                        <div className="p-2 bg-zinc-900/50 rounded-sm">
                            <span className="text-zinc-500">Yantras:</span>
                            <span className="text-violet-400 ml-1 font-mono">{gnosisData.yantras}</span>
                        </div>
                    </div>
                );
            })()}

            {/* Nimbus for Mages */}
            <div className="p-2 bg-violet-900/20 border border-violet-500/30 rounded-sm">
                <label className="text-[10px] text-violet-400 uppercase tracking-wider block mb-1">Nimbus</label>
                <Textarea 
                    value={getValue("nimbus") || ""} 
                    onChange={(e) => handleChange("nimbus", e.target.value)} 
                    className="input-geist text-xs min-h-[60px]" 
                    placeholder="Describe your Nimbus manifestation..."
                    data-testid="mage-nimbus-input"
                />
            </div>

            {/* Health */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Health</label>
                        <button
                            onClick={() => {
                                const currentMana = getValue("mana") || 0;
                                if (currentMana < 3) return;
                                const counts = getHealthCounts(healthBoxes);
                                if (counts.lethal > 0) {
                                    counts.lethal -= 1;
                                } else if (counts.bashing > 0) {
                                    counts.bashing -= 1;
                                } else return;
                                handleChange("mana", currentMana - 3);
                                const updatedBoxes = buildHealthBoxes(counts, maxHealth);
                                handleHealthBoxesChange(updatedBoxes);
                            }}
                            disabled={(getValue("mana") || 0) < 3 || (() => { const c = getHealthCounts(healthBoxes); return c.lethal + c.bashing === 0; })()}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-400 hover:bg-violet-800/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Spend 3 Mana to heal 1 Lethal or Bashing"
                            data-testid="pattern-restoration-btn"
                        >
                            Pattern Restoration
                        </button>
                    </div>
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

            {/* Willpower */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Willpower</label>
                        <button
                            onClick={() => {
                                const current = getValue("willpower") || 0;
                                const max = calculateWillpowerMax();
                                if (current < max) handleChange("willpower", current + 1);
                            }}
                            disabled={(getValue("willpower") || 0) >= calculateWillpowerMax()}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400 hover:bg-amber-800/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            data-testid="willpower-plus-btn"
                        >+1</button>
                        <button
                            onClick={() => handleChange("willpower", calculateWillpowerMax())}
                            disabled={(getValue("willpower") || 0) >= calculateWillpowerMax()}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400 hover:bg-amber-800/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            data-testid="willpower-full-btn"
                        >Full</button>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">{getValue("willpower") || 0}/{calculateWillpowerMax()}</span>
                </div>
                <ResourceTrack current={getValue("willpower") || 0} max={calculateWillpowerMax()} onChange={(v) => handleChange("willpower", v)} color="amber" testIdPrefix="willpower" />
            </div>

            {/* Mana for Mages */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Mana</label>
                        <button
                            onClick={() => {
                                const counts = getHealthCounts(healthBoxes);
                                counts.lethal += 1;
                                const totalAfter = counts.aggravated + counts.lethal + counts.bashing;
                                if (totalAfter > maxHealth) {
                                    if (counts.bashing > 0) { counts.bashing -= 1; }
                                }
                                const updatedBoxes = buildHealthBoxes(counts, maxHealth);
                                handleHealthBoxesChange(updatedBoxes);
                                const gnosisLevel = getValue("gnosis") || 1;
                                const gd = GNOSIS_TABLE[gnosisLevel] || GNOSIS_TABLE[1];
                                const currentMana = getValue("mana") || 0;
                                handleChange("mana", Math.min(gd.maxMana, currentMana + 3));
                            }}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 hover:bg-red-800/40 transition-colors"
                            title="Deal 1 Lethal damage, gain 3 Mana"
                            data-testid="pattern-scourge-btn"
                        >Pattern Scourge</button>
                        <button
                            onClick={() => {
                                const gnosisLevel = getValue("gnosis") || 1;
                                const gd = GNOSIS_TABLE[gnosisLevel] || GNOSIS_TABLE[1];
                                const currentMana = getValue("mana") || 0;
                                handleChange("mana", Math.min(gd.maxMana, currentMana + 1));
                            }}
                            disabled={(() => { const gl = getValue("gnosis") || 1; const gd = GNOSIS_TABLE[gl] || GNOSIS_TABLE[1]; return (getValue("mana") || 0) >= gd.maxMana; })()}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-400 hover:bg-violet-800/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Gain 1 Mana from Hallow"
                            data-testid="hallow-btn"
                        >Hallow</button>
                    </div>
                    <div className="flex items-center gap-2">
                        {(() => {
                            const gnosisLevel = getValue("gnosis") || 1;
                            const gnosisData = GNOSIS_TABLE[gnosisLevel] || GNOSIS_TABLE[1];
                            return (
                                <>
                                    <span className="text-[10px] text-zinc-600 font-mono">{getValue("mana") || 0}/{gnosisData.maxMana}</span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <span className="text-[10px] px-1 py-0.5 bg-violet-900/30 text-violet-400 rounded font-mono">{gnosisData.perTurn}/turn</span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-900 border-zinc-700"><p className="text-xs">Max expenditure per turn</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </>
                            );
                        })()}
                    </div>
                </div>
                {(() => {
                    const gnosisLevel = getValue("gnosis") || 1;
                    const gnosisData = GNOSIS_TABLE[gnosisLevel] || GNOSIS_TABLE[1];
                    return (
                        <>
                            <ResourceTrack current={getValue("mana") || 0} max={Math.min(gnosisData.maxMana, 20)} onChange={(v) => handleChange("mana", v)} color="violet" testIdPrefix="mana" />
                            {gnosisData.maxMana > 20 && <p className="text-[10px] text-zinc-600 mt-1">Showing first 20 of {gnosisData.maxMana} max</p>}
                        </>
                    );
                })()}
            </div>
        </>
    );
};
