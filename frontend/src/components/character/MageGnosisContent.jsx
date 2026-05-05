import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GNOSIS_TABLE } from "../../data/character-data";
import { SynergyTrack, HealthTrack, ResourceTrack, getHealthCounts, buildHealthBoxes } from "./StatComponents";

export const MageGnosisContent = ({
    getValue, handleChange, getNestedValue, handleNestedChange,
    healthBoxes, maxHealth, filledHealth, isDeadTrack, woundPenalty,
    handleHealthBoxClick, handleHealthBoxesChange,
    calculateWillpowerMax,
    onRebuyWillpowerDot,
    onTriggerDiceRoll,
}) => {
    const [scourOpen, setScourOpen] = useState(false);

    const doScour = (choice) => {
        const gnosisLevel = getValue("gnosis") || 1;
        const gd = GNOSIS_TABLE[gnosisLevel] || GNOSIS_TABLE[1];
        const currentMana = getValue("mana") || 0;

        if (choice === "damage") {
            const counts = getHealthCounts(healthBoxes);
            counts.lethal += 1;
            const totalAfter = counts.aggravated + counts.lethal + counts.bashing;
            if (totalAfter > maxHealth) {
                if (counts.bashing > 0) { counts.bashing -= 1; }
            }
            const updatedBoxes = buildHealthBoxes(counts, maxHealth);
            handleHealthBoxesChange(updatedBoxes);
        } else {
            const scoured = getValue("scoured_attributes") || {};
            handleChange("scoured_attributes", { ...scoured, [choice]: (scoured[choice] || 0) + 1 });
            const currentVal = getNestedValue("attributes", choice) || 1;
            if (currentVal > 0) {
                handleNestedChange("attributes", choice, currentVal - 1);
            }
        }

        handleChange("mana", Math.min(gd.maxMana, currentMana + 3));
        setScourOpen(false);
    };

    return (
        <>
            {/* Gnosis for Mages */}
            <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Gnosis</label>
                <SynergyTrack value={getValue("gnosis") || 1} maxValue={10} onChangeValue={(v) => handleChange("gnosis", v)} onChangeMax={() => {}} />
            </div>

            <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Wisdom</label>
                <SynergyTrack
                    value={getValue("wisdom") ?? 7}
                    maxValue={10}
                    onChangeValue={(v) => handleChange("wisdom", v)}
                    onChangeMax={() => {}}
                />
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
                        <button
                            onClick={onRebuyWillpowerDot}
                            disabled={(getValue("experience") || 0) < 1 || (getValue("willpower_max_modifier") || 0) >= 0}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/30 text-emerald-400 hover:bg-emerald-800/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            data-testid="willpower-rebuy-btn"
                        >
                            Rebuy (1 XP)
                        </button>
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
                            onClick={() => setScourOpen(true)}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 hover:bg-red-800/40 transition-colors"
                            title="Reduce 1 Physical Attribute or deal 1 Lethal, gain 3 Mana"
                            data-testid="scour-pattern-btn"
                        >Scour Pattern</button>

                        <Dialog open={scourOpen} onOpenChange={setScourOpen}>
                            <DialogContent className="bg-zinc-900 border-zinc-700 max-w-xs">
                                <DialogHeader>
                                    <DialogTitle className="text-red-300 font-heading text-sm">Scour Pattern</DialogTitle>
                                </DialogHeader>
                                <p className="text-[10px] text-zinc-400 -mt-2">Choose what to sacrifice for 3 Mana:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {["strength", "dexterity", "stamina"].map((attr) => (
                                        <Button
                                            key={attr}
                                            size="sm"
                                            className="h-8 text-xs bg-red-900/30 border border-red-500/40 text-red-300 hover:bg-red-800/50 capitalize"
                                            onClick={() => doScour(attr)}
                                            data-testid={`scour-${attr}`}
                                        >
                                            {attr}
                                        </Button>
                                    ))}
                                    <Button
                                        size="sm"
                                        className="h-8 text-xs bg-zinc-800 border border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                                        onClick={() => doScour("damage")}
                                        data-testid="scour-damage"
                                    >
                                        Damage
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
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
                        {/* Nimbus for Mages */}
            <div className="p-2 bg-violet-900/20 border border-violet-500/30 rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] text-violet-400 uppercase tracking-wider">Nimbus</label>
                    <button
                        onClick={() => {
                            const currentMana = getValue("mana") || 0;
                            if (currentMana < 1) return;

                            const gnosis = getValue("gnosis") || 1;
                            const potentNimbusDots =
                                ((getValue("merits_list") || []).find((m) => (m?.name || "") === "Potent Nimbus")?.dots || 0);
                            const pool = gnosis + (potentNimbusDots * 2);

                            handleChange("mana", currentMana - 1);

                            if (onTriggerDiceRoll) {
                                onTriggerDiceRoll({
                                    pool,
                                    label: "Nimbus Flare",
                                    dicePoolBreakdown: `Gnosis ${gnosis}${potentNimbusDots > 0 ? ` + Potent Nimbus ${potentNimbusDots * 2}` : ""}`,
                                    exceptional_target: 5,
                                });
                            }
                        }}
                        disabled={(getValue("mana") || 0) < 1}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-400 hover:bg-violet-800/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        data-testid="nimbus-flare-btn"
                    >
                        Flare!
                    </button>
                </div>

                <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Long-Term</label>
                    <Textarea
                        value={getValue("nimbus_long_term") || ""}
                        onChange={(e) => handleChange("nimbus_long_term", e.target.value)}
                        className="input-geist text-xs min-h-[50px]"
                        placeholder="Long-term Nimbus..."
                        data-testid="mage-nimbus-long-term"
                    />
                </div>

                <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Immediate</label>
                    <Textarea
                        value={getValue("nimbus_immediate") || ""}
                        onChange={(e) => handleChange("nimbus_immediate", e.target.value)}
                        className="input-geist text-xs min-h-[50px]"
                        placeholder="Immediate Nimbus..."
                        data-testid="mage-nimbus-immediate"
                    />
                </div>

                <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Nimbus Tilt</label>
                    <Textarea
                        value={getValue("nimbus_tilt") || ""}
                        onChange={(e) => handleChange("nimbus_tilt", e.target.value)}
                        className="input-geist text-xs min-h-[40px]"
                        placeholder="Nimbus Tilt..."
                        data-testid="mage-nimbus-tilt"
                    />
                </div>

                <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Signature</label>
                    <Textarea
                        value={getValue("nimbus_signature") || ""}
                        onChange={(e) => handleChange("nimbus_signature", e.target.value)}
                        className="input-geist text-xs min-h-[50px]"
                        placeholder="Signature Nimbus..."
                        data-testid="mage-nimbus-signature"
                    />
                </div>
            </div>
        </>
    );
};
