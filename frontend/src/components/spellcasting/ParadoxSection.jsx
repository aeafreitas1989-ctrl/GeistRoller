import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, Zap, Shield, Eye } from "lucide-react";

/**
 * The full Paradox section of the SpellcastingPopup.
 * Handles base Reach-Paradox display, modifiers, mana mitigation,
 * the final paradox pool display, and the Release/Contain selector.
 */
export const ParadoxSection = ({
    selectedPractice,
    paradoxTriggered,
    reachBeyondFree,
    paradoxDiePerReach,
    gnosis,
    baseParadoxDice,
    paradoxInured,
    setParadoxInured,
    sleeperWitnesses,
    setSleeperWitnesses,
    hasDedicatedTool,
    scenePreviousParadoxRolls,
    onPrevParadoxIncrease,
    onPrevParadoxDecrease,
    onPrevParadoxReset,
    paradoxAfterModifiers,
    paradoxModifiers,
    maxManaMitigation,
    manaMitigation,
    setManaMitigation,
    actualManaMitigation,
    paradoxIsChanceDie,
    finalParadoxPool,
    paradoxRollQuality,
    paradoxMode,
    setParadoxMode,
}) => {
    if (!selectedPractice) return null;

    return (
        <div className={`p-3 rounded space-y-3 border ${
            paradoxTriggered
                ? "bg-red-950/20 border-red-500/40"
                : "bg-zinc-800/30 border-zinc-700/50"
        }`}>
            <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 ${paradoxTriggered ? "text-red-400" : "text-zinc-500"}`} />
                <p className={`text-xs uppercase font-bold ${paradoxTriggered ? "text-red-400" : "text-zinc-500"}`}>
                    Paradox
                </p>
            </div>

            <div className="text-xs text-zinc-400">
                {reachBeyondFree > 0 ? (
                    <span>
                        <span className="text-red-400 font-mono">{reachBeyondFree}</span> Reach over
                        {" x "}<span className="font-mono">{paradoxDiePerReach}</span> die/Reach (Gnosis {gnosis})
                        {" = "}<span className="text-red-400 font-mono font-bold">{baseParadoxDice}</span> base dice
                    </span>
                ) : (
                    <span className="text-zinc-500">No Reach beyond free - no Paradox risk</span>
                )}
            </div>

            {paradoxTriggered && (
                <>
                    <div className="space-y-1.5">
                        <p className="text-[10px] text-zinc-500 uppercase">Modifiers</p>
                        <div className="grid grid-cols-2 gap-1.5">
                            <label className="flex items-center gap-2 text-xs cursor-pointer" data-testid="paradox-inured">
                                <Checkbox
                                    checked={paradoxInured}
                                    onCheckedChange={setParadoxInured}
                                    className="border-zinc-600 data-[state=checked]:bg-red-600 h-3.5 w-3.5"
                                />
                                <span className="text-zinc-300">Inured to spell</span>
                                <span className="text-red-400 font-mono ml-auto">+2</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs cursor-pointer" data-testid="paradox-sleepers">
                                <Checkbox
                                    checked={sleeperWitnesses !== "none"}
                                    onCheckedChange={(checked) => setSleeperWitnesses(checked ? "few" : "none")}
                                    className="border-zinc-600 data-[state=checked]:bg-red-600 h-3.5 w-3.5"
                                />
                                <span className="text-zinc-300">Sleeper witnesses</span>
                                <span className="text-red-400 font-mono ml-auto">+1</span>
                            </label>
                        </div>

                        {sleeperWitnesses !== "none" && (
                            <div className="flex items-center gap-2 pl-6">
                                <Eye className="w-3 h-3 text-zinc-500" />
                                <Select value={sleeperWitnesses} onValueChange={setSleeperWitnesses}>
                                    <SelectTrigger className="h-7 w-40 text-xs bg-zinc-900/50 border-zinc-700" data-testid="sleeper-scale-select">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700 z-[200]">
                                        <SelectItem value="few" className="text-xs text-zinc-200">Few (9-again)</SelectItem>
                                        <SelectItem value="large" className="text-xs text-zinc-200">Large group (8-again)</SelectItem>
                                        <SelectItem value="crowd" className="text-xs text-zinc-200">Full crowd (Rote)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-[10px] text-zinc-500">on Paradox roll</span>
                            </div>
                        )}

                        {hasDedicatedTool && (
                            <div className="flex items-center gap-2 text-xs pl-1">
                                <Shield className="w-3 h-3 text-teal-500" />
                                <span className="text-zinc-300">Dedicated Magical Tool</span>
                                <span className="text-teal-400 font-mono ml-auto">-2</span>
                                <span className="text-[10px] text-zinc-500">(from Yantras)</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-zinc-400">Previous Paradox rolls this scene:</span>
                            <div className="flex items-center gap-1 ml-auto">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-zinc-400"
                                    onClick={onPrevParadoxDecrease}
                                    disabled={scenePreviousParadoxRolls <= 0}
                                    data-testid="prev-paradox-decrease"
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>

                                <span className="font-mono text-red-400 w-4 text-center">
                                    {scenePreviousParadoxRolls}
                                </span>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-zinc-400"
                                    onClick={onPrevParadoxIncrease}
                                    data-testid="prev-paradox-increase"
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 px-2 text-[10px] text-zinc-500 hover:text-zinc-200"
                                    onClick={onPrevParadoxReset}
                                    disabled={scenePreviousParadoxRolls <= 0}
                                    data-testid="prev-paradox-reset"
                                >
                                    Reset
                                </Button>

                                {scenePreviousParadoxRolls > 0 && (
                                    <span className="text-red-400 font-mono">+{scenePreviousParadoxRolls}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-zinc-400 pt-1 border-t border-zinc-700/50">
                        Pool before Mana: <span className="font-mono text-red-400">{Math.max(0, paradoxAfterModifiers)}</span>
                        {paradoxAfterModifiers < baseParadoxDice && (
                            <span className="text-zinc-500 ml-1">
                                ({baseParadoxDice}{paradoxModifiers >= 0 ? "+" : ""}{paradoxModifiers})
                            </span>
                        )}
                    </div>

                    <div className="p-2 bg-zinc-900/50 rounded space-y-1.5" data-testid="mana-mitigation-section">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-300 font-medium">Spend Mana to mitigate Paradox</span>
                            <span className="text-[10px] text-zinc-500">
                                -1 die per Mana (max {maxManaMitigation}/turn)
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400"
                                onClick={() => setManaMitigation(Math.max(0, manaMitigation - 1))}
                                disabled={manaMitigation <= 0}
                                data-testid="mana-mitigation-decrease"
                            ><Minus className="w-3 h-3" /></Button>
                            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-violet-500 transition-all"
                                    style={{ width: maxManaMitigation > 0 ? `${(actualManaMitigation / maxManaMitigation) * 100}%` : "0%" }}
                                />
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400"
                                onClick={() => setManaMitigation(Math.min(maxManaMitigation, manaMitigation + 1))}
                                disabled={manaMitigation >= maxManaMitigation || maxManaMitigation <= 0}
                                data-testid="mana-mitigation-increase"
                            ><Plus className="w-3 h-3" /></Button>
                            <span className="font-mono text-violet-400 text-sm w-8 text-right">{actualManaMitigation}</span>
                        </div>
                    </div>

                    <div className={`p-2 rounded text-center ${
                        paradoxIsChanceDie ? "bg-amber-900/30 border border-amber-500/40" : "bg-red-900/30 border border-red-500/40"
                    }`} data-testid="final-paradox-display">
                        {paradoxIsChanceDie ? (
                            <div>
                                <p className="text-amber-400 font-bold text-sm">CHANCE DIE</p>
                                <p className="text-[10px] text-amber-300/70">
                                    Paradox was triggered - reduced to 0 by Mana, rolls as Chance Die
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-red-400 font-bold text-sm">
                                    {finalParadoxPool} Paradox {finalParadoxPool === 1 ? "Die" : "Dice"}
                                </p>
                                {sleeperWitnesses !== "none" && (
                                    <p className="text-[10px] text-red-300/70">
                                        Paradox roll quality: {paradoxRollQuality.desc}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-2 bg-zinc-900/50 rounded space-y-2" data-testid="paradox-mode-section">
                        <p className="text-xs text-zinc-300 font-medium">Resolve Paradox before the spell roll</p>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant={paradoxMode === "release" ? "default" : "outline"}
                                onClick={() => setParadoxMode("release")}
                                className={paradoxMode === "release"
                                    ? "bg-red-600 hover:bg-red-500 text-white"
                                    : "border-zinc-700 text-zinc-300"}
                                data-testid="paradox-mode-release"
                            >
                                Release
                            </Button>

                            <Button
                                type="button"
                                variant={paradoxMode === "contain" ? "default" : "outline"}
                                onClick={() => setParadoxMode("contain")}
                                className={paradoxMode === "contain"
                                    ? "bg-amber-600 hover:bg-amber-500 text-black"
                                    : "border-zinc-700 text-zinc-300"}
                                data-testid="paradox-mode-contain"
                            >
                                Contain
                            </Button>
                        </div>

                        {paradoxMode === "release" && (
                            <p className="text-[11px] text-zinc-500">
                                Roll Paradox first. Each Paradox success gives -1 die to the spell.
                            </p>
                        )}

                        {paradoxMode === "contain" && (
                            <p className="text-[11px] text-zinc-500">
                                Roll Paradox vs Wisdom. Each Wisdom success cancels one Paradox success and deals 1 Bashing. Any Paradox success left gives Paradox Taint.
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
