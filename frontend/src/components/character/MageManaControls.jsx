import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GNOSIS_TABLE } from "../../data/character-data";
import { getGameTimestamp } from "../../utils/effectDuration";
import { hallowManaRemaining, recordHallowMana } from "../../utils/mageRecovery";
import { toast } from "sonner";

const nonnegative = (value) => Math.max(0, Math.floor(Number(value) || 0));

// The two Tass pools represent units physically available to this character.
// Edible Tass can be consumed. Other Tass requires Prime 3 Channel Mana.
export const MageManaControls = ({ getValue, getNestedValue, onTriggerDiceRoll,
    onAdvanceTime, onCommitCharacterUpdate, onOpenChannelMana }) => {
    const [oblationOpen, setOblationOpen] = useState(false);
    const [oblationSource, setOblationSource] = useState("hallow");
    const [hallowRating, setHallowRating] = useState(1);
    const [oblationBusy, setOblationBusy] = useState(false);
    const [oblationResult, setOblationResult] = useState(null);
    const [channelOpen, setChannelOpen] = useState(false);
    const [channelSource, setChannelSource] = useState("hallow");
    const [channelAmount, setChannelAmount] = useState(1);
    const [channelIgnoreLimit, setChannelIgnoreLimit] = useState(false);
    const [channelHallowRating, setChannelHallowRating] = useState(1);
    const [tassBusy, setTassBusy] = useState(false);

    const gnosis = nonnegative(getValue("gnosis")) || 1;
    const gnosisData = GNOSIS_TABLE[gnosis] || GNOSIS_TABLE[1];
    const currentMana = nonnegative(getValue("mana"));
    const primeDots = nonnegative((getValue("arcana") || {}).Prime);
    const merits = getValue("merits_list") || [];
    const hallowMerit = merits.find((entry) => (entry?.name || "").toLowerCase() === "hallow");
    const hallowMeritDots = nonnegative(hallowMerit?.dots);
    const actualHallowRating = hallowMeritDots || hallowRating;
    const legacyArcanum = String(getValue("legacy_ruling_arcanum") || "");
    const legacyDots = legacyArcanum ? nonnegative((getValue("arcana") || {})[legacyArcanum]) : 0;
    const tracker = getValue("scene_tracker") || {};
    const clockSet = getGameTimestamp(tracker) !== null;
    const edible = nonnegative(getValue("tass_edible"));
    const other = nonnegative(getValue("tass_other"));
    const sourceHistory = oblationSource === "legacy" ? "oblation_legacy" : "oblation_hallow";
    const sourceRating = oblationSource === "legacy" ? legacyDots : actualHallowRating;
    const remaining = clockSet ? hallowManaRemaining(getValue(sourceHistory), sourceRating, tracker) : null;
    const channelRating = hallowMeritDots || channelHallowRating;
    const channelRemaining = clockSet ? hallowManaRemaining(getValue("oblation_hallow"), channelRating, tracker) : null;

    const adjustTass = async (field, amount) => {
        if (!onCommitCharacterUpdate || tassBusy) return;
        const next = Math.min(999, nonnegative(amount));
        setTassBusy(true);
        try { await onCommitCharacterUpdate({ [field]: next }); }
        finally { setTassBusy(false); }
    };

    const consumeEdibleTass = async () => {
        if (!onCommitCharacterUpdate || tassBusy || edible < 1 || currentMana >= gnosisData.maxMana) return;
        setTassBusy(true);
        try {
            await onCommitCharacterUpdate({ tass_edible: edible - 1, mana: currentMana + 1 });
            toast.success("Consumed 1 edible Tass; gained 1 Mana.");
        } finally { setTassBusy(false); }
    };

    const rollOblation = () => {
        if (oblationBusy || !onTriggerDiceRoll) return;
        if (!clockSet) { toast.error("Set an in-game date and time before Oblation."); return; }
        if (oblationSource === "legacy" && (!legacyArcanum || !legacyDots)) {
            toast.error("Configure a Legacy Ruling Arcanum first."); return;
        }
        if (!remaining) { toast.error("No Mana remains available from this source in the current 24-hour window."); return; }
        const composure = nonnegative(getNestedValue("attributes", "composure")) || 1;
        const sourceName = oblationSource === "legacy" ? "Legacy" : "Hallow";
        setOblationBusy(true);
        onTriggerDiceRoll({
            pool: gnosis + composure,
            label: `${sourceName} Oblation`,
            dicePoolBreakdown: `Gnosis ${gnosis} + Composure ${composure}`,
            spellSummary: `1 Mana per success, up to ${remaining} remaining in 24 hours. One in-game hour.`,
            onResult: async (result) => {
                try {
                    const successes = nonnegative(result?.successes);
                    const mana = nonnegative(getValue("mana"));
                    const gained = Math.max(0, Math.min(successes, remaining, gnosisData.maxMana - mana));
                    const updates = {
                        mana: mana + gained,
                        [sourceHistory]: recordHallowMana(getValue(sourceHistory), gained, tracker),
                    };
                    if (onAdvanceTime) await onAdvanceTime(1, 0, updates);
                    else if (onCommitCharacterUpdate) await onCommitCharacterUpdate(updates);
                    setOblationResult({ sourceName, successes, gained });
                } catch (error) {
                    toast.error("Could not record Oblation results.");
                } finally { setOblationBusy(false); }
            },
        });
    };

    const beginChannel = () => {
        if (!onOpenChannelMana || primeDots < 3) return;
        if (channelSource === "hallow" && (!clockSet || !channelRemaining)) {
            toast.error("The Hallow has no available Mana, or the game clock is unset."); return;
        }
        if (channelSource === "tass" && other < 1) { toast.error("No non-edible Tass is recorded."); return; }
        onOpenChannelMana({
            source: channelSource,
            amount: Math.min(999, Math.max(1, nonnegative(channelAmount))),
            hallowRating: channelRating,
            ignorePerTurn: channelIgnoreLimit,
        });
        setChannelOpen(false);
    };

    return (
        <div className="mt-2 rounded-sm border border-zinc-800 bg-zinc-900/30 p-2 space-y-2" data-testid="mage-mana-actions">
            <div className="flex flex-wrap items-center gap-1.5">
                <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[10px] border-violet-700/50 text-violet-200"
                    onClick={() => { setOblationResult(null); setOblationSource("hallow"); setOblationOpen(true); }}
                    data-testid="oblation-btn">Oblation</Button>
                <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[10px] border-violet-700/50 text-violet-200"
                    disabled={primeDots < 3 || !onOpenChannelMana} onClick={() => setChannelOpen(true)}
                    title="Cast Prime 3 • Channel Mana" data-testid="channel-mana-btn">Channel Mana</Button>
                <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[10px] border-violet-700/50 text-violet-200"
                    disabled={!edible || tassBusy || currentMana >= gnosisData.maxMana}
                    onClick={consumeEdibleTass} data-testid="consume-tass-btn">Consume Tass (+1)</Button>
            </div>
            <p className="text-[10px] text-zinc-500">Enter Tass quantities; click outside a field to save.</p>
            <div className="grid grid-cols-2 gap-2">
                <label className="text-[10px] text-zinc-400">Edible Tass (units)
                    <Input type="number" inputMode="numeric" min={0} max={999} defaultValue={edible} key={"edible-" + edible}
                        onBlur={(event) => { void adjustTass("tass_edible", event.target.value); }}
                        className="mt-1 h-7 bg-zinc-950 text-xs" data-testid="tass-edible-count" />
                </label>
                <label className="text-[10px] text-zinc-400">Other Tass (units)
                    <Input type="number" inputMode="numeric" min={0} max={999} defaultValue={other} key={"other-" + other}
                        onBlur={(event) => { void adjustTass("tass_other", event.target.value); }}
                        className="mt-1 h-7 bg-zinc-950 text-xs" data-testid="tass-other-count" />
                </label>
            </div>

            <Dialog open={oblationOpen} onOpenChange={setOblationOpen}>
                <DialogContent className="max-w-sm border-zinc-700 bg-zinc-950 text-zinc-100" data-testid="oblation-dialog">
                    <DialogHeader><DialogTitle>Oblation</DialogTitle></DialogHeader>
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                            {(["hallow", "legacy"]).map((source) => (
                                <Button type="button" key={source} size="sm" variant={oblationSource === source ? "default" : "outline"}
                                    onClick={() => { setOblationSource(source); setOblationResult(null); }}
                                    data-testid={`oblation-choice-${source}`}>{source === "hallow" ? "Hallow" : "Legacy"}</Button>
                            ))}
                        </div>
                        {oblationSource === "hallow" ? (
                            hallowMeritDots ? (
                                <p className="text-violet-200" data-testid="hallow-merit-rating">Hallow Merit: {hallowMeritDots} dots</p>
                            ) : (
                                <label className="block text-zinc-400">Hallow rating
                                    <div className="mt-1 flex gap-1">{[1,2,3,4,5].map((n) => (
                                        <Button type="button" key={n} size="sm" variant={hallowRating === n ? "default" : "outline"}
                                            onClick={() => setHallowRating(n)} className="h-7 w-8 px-0 text-xs" data-testid={`hallow-rating-${n}`}>{n}</Button>
                                    ))}</div>
                                </label>
                            )
                        ) : (
                            <p data-testid="legacy-oblation-limit" className="text-violet-200">
                                Legacy Ruling Arcanum: {legacyArcanum || "Not configured"} ({legacyDots} dots).
                                {legacyDots === 0 && <span className="block text-rose-300">Choose a Legacy Ruling Arcanum in Character Info.</span>}
                            </p>
                        )}
                        <p className="text-zinc-400">Roll Gnosis + Composure. Recover 1 Mana per success, limited to {sourceRating} Mana per 24 hours; the ceremony lasts 1 hour.</p>
                        <p className="text-zinc-400">Remaining allowance: {remaining === null ? "Set game clock" : remaining} Mana</p>
                        {oblationResult && <p className="rounded border border-violet-700/40 bg-violet-950/30 p-2" data-testid="oblation-result">
                            {oblationResult.sourceName}: {oblationResult.successes} successes, {oblationResult.gained} Mana recovered. Time advanced 1 hour.
                        </p>}
                        <div className="flex justify-end gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => setOblationOpen(false)}>Close</Button>
                            <Button type="button" size="sm" disabled={oblationBusy || !clockSet || !remaining || currentMana >= gnosisData.maxMana}
                                onClick={rollOblation} data-testid="oblation-roll-btn">{oblationBusy ? "Rolling..." : "Roll Oblation"}</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={channelOpen} onOpenChange={setChannelOpen}>
                <DialogContent className="max-w-sm border-zinc-700 bg-zinc-950 text-zinc-100" data-testid="channel-mana-dialog">
                    <DialogHeader><DialogTitle>Channel Mana · Prime 3</DialogTitle></DialogHeader>
                    <div className="space-y-3 text-xs text-zinc-400">
                        <p>Choose an available source, then cast Channel Mana with the regular Spellcasting roller. Transfer is limited by Potency, Mana per turn, and available Mana.</p>
                        <label className="block">Source
                            <Select value={channelSource} onValueChange={setChannelSource}>
                                <SelectTrigger className="mt-1 h-8 border-zinc-700 bg-zinc-900" data-testid="channel-mana-source"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-zinc-700">
                                    <SelectItem value="hallow">Hallow</SelectItem>
                                    <SelectItem value="tass">Other (non-edible) Tass</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                        {channelSource === "hallow" && (
                            hallowMeritDots ? <p>Hallow rating {hallowMeritDots}; available now: {channelRemaining ?? "set game clock"}</p> :
                            <label className="block">Hallow rating
                                <Input type="number" min={1} max={5} value={channelHallowRating} className="mt-1 h-8 bg-zinc-900"
                                    onChange={(event) => setChannelHallowRating(Math.min(5, Math.max(1, nonnegative(event.target.value))))} />
                            </label>
                        )}
                        {channelSource === "tass" && <p>Available other Tass: {other} units.</p>}
                        <label className="block">Requested Mana to transfer
                            <Input type="number" min={1} max={999} value={channelAmount} className="mt-1 h-8 bg-zinc-900"
                                onChange={(event) => setChannelAmount(Math.min(999, Math.max(1, nonnegative(event.target.value))))}
                                data-testid="channel-mana-amount" />
                        </label>
                        <label className="flex items-start gap-2 rounded border border-zinc-700 p-2">
                            <input type="checkbox" checked={channelIgnoreLimit}
                                onChange={(event) => setChannelIgnoreLimit(event.target.checked)}
                                className="mt-0.5" data-testid="channel-mana-ignore-turn-limit" />
                            <span>Spend +1 Reach to exceed the normal Mana-per-turn transfer limit.</span>
                        </label>
                        <p>Normal Mana-per-turn limit: {gnosisData.perTurn}. Spellcasting, Reach and Paradox use the standard roller.</p>
                        <Button type="button" className="w-full" onClick={beginChannel} data-testid="channel-mana-cast">Open Spellcasting</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
