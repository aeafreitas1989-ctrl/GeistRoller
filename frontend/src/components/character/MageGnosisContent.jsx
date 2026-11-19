import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GNOSIS_TABLE as BASE_GNOSIS_TABLE } from "../../data/character-data";
import { SynergyTrack, ResourceTrack, getHealthCounts, buildHealthBoxes } from "./StatComponents";
import { restartNaturalHealing } from "../../utils/naturalHealing";
import { addWoundDamage } from "../../utils/resistantWounds";
import { getGameTimestamp } from "../../utils/effectDuration";
import { remainingScourings, registerScouring, hallowManaRemaining, recordHallowMana } from "../../utils/mageRecovery";
import { toast } from "sonner";
import { MageManaControls } from "./MageManaControls";

const GNOSIS_TABLE = BASE_GNOSIS_TABLE;

export const MageGnosisContent = ({
    getValue, handleChange, getNestedValue, handleNestedChange,
    healthBoxes, maxHealth, filledHealth, isDeadTrack, woundPenalty,
    handleHealthBoxClick, handleHealthBoxesChange,
    calculateWillpowerMax,
    onRebuyWillpowerDot,
    onTriggerDiceRoll,
    onAdvanceTime,
    onCommitCharacterUpdate,
    onOpenChannelMana,
}) => {
    const [scourOpen, setScourOpen] = useState(false);
    const applyScourUpdates = (updates) => {
        if (onCommitCharacterUpdate) {
            onCommitCharacterUpdate(updates);
            return;
        }

        Object.entries(updates).forEach(([field, value]) => {
            handleChange(field, value);
        });
    };

    const doScour = (choice) => {
        const gnosisLevel = getValue("gnosis") || 1;
        const gd = GNOSIS_TABLE[gnosisLevel] || GNOSIS_TABLE[1];
        const currentMana = getValue("mana") || 0;
        const tracker = getValue("scene_tracker") || {};
        const attr = choice === "damage" ? null : choice;
        const recorded = registerScouring(getValue("pattern_scouring"), gnosisLevel, tracker, attr);
        if (!recorded) { toast.error("Scouring unavailable: set the game clock or wait for the Gnosis-based 24-hour allowance."); return; }
        if (attr && (Number(getNestedValue("attributes", attr)) || 0) < 1) { toast.error("Cannot Scour an Attribute below zero."); return; }
        const updates = {
            mana: Math.min(gd.maxMana, currentMana + 3),
            pattern_scouring: recorded,
        };

        if (choice === "damage") {
            const damage = addWoundDamage(healthBoxes, getValue("resistant_wounds"), "lethal", 1, true);
            if (damage.applied === 0) return;
            updates.health_boxes = damage.boxes;
            updates.resistant_wounds = damage.resistant_wounds;
            updates.health = damage.boxes.filter((state) => state !== "empty").length;
            updates.natural_healing = restartNaturalHealing(damage.boxes, getValue("scene_tracker"));
        } else {
            const scoured = getValue("scoured_attributes") || {};
            const attributes = getValue("attributes") || {};
            const currentVal = getNestedValue("attributes", choice) || 1;

            updates.scoured_attributes = {
                ...scoured,
                [choice]: (scoured[choice] || 0) + 1,
            };
            updates.attributes = {
                ...attributes,
                [choice]: Math.max(0, currentVal - 1),
            };
        }

        applyScourUpdates(updates);
        setScourOpen(false);
    };

    return (
        <>
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

            <div>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Mana</label>
                        <button
                            onClick={() => setScourOpen(true)}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 hover:bg-red-800/40 transition-colors"
                             title="Reduce 1 Physical Attribute for 24 in-game hours or take 1 Resistant Lethal; gain 3 Mana (Gnosis limit per day)"
                            data-testid="scour-pattern-btn"
                        >Scour Pattern</button>
                        <MageManaControls
                            getValue={getValue}
                            getNestedValue={getNestedValue}
                            onTriggerDiceRoll={onTriggerDiceRoll}
                            onAdvanceTime={onAdvanceTime}
                            onCommitCharacterUpdate={onCommitCharacterUpdate}
                            onOpenChannelMana={onOpenChannelMana}
                        />

                        <Dialog open={scourOpen} onOpenChange={setScourOpen}>
                            <DialogContent className="bg-zinc-900 border-zinc-700 max-w-xs">
                                <DialogHeader>
                                    <DialogTitle className="text-red-300 font-heading text-sm">Scour Pattern</DialogTitle>
                                </DialogHeader>
                                <p className="text-[10px] text-zinc-400 -mt-2">Choose what to sacrifice for 3 Mana. Attribute dots recover after 24 in-game hours.</p>
                                <p className="text-[10px] text-zinc-400">Remaining Scourings: {remainingScourings(getValue("pattern_scouring"), getValue("gnosis"), getValue("scene_tracker")) ?? "Set game clock"}</p>
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
                                        disabled={healthBoxes.length > 0 && healthBoxes.every((state) => state === "aggravated")}
                                    >
                                        Resistant Lethal
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

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

            <div className="p-2 bg-violet-900/20 border border-violet-500/30 rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] text-violet-400 uppercase tracking-wider">Nimbus</label>
                    <button
                        onClick={() => {
                            const currentMana = getValue("mana") || 0;
                            if (currentMana < 1) return;

                            const gnosis = getValue("gnosis") || 1;
                            const potentNimbusDots = ((getValue("merits_list") || []).find((m) => (m?.name || "") === "Potent Nimbus")?.dots || 0);
                            const pool = gnosis + potentNimbusDots * 2;

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
