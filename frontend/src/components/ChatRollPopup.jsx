import { useState } from "react";
import { Dices, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const ChatRollPopup = ({ open, onOpenChange, rollData, onRollResult }) => {
    const [pool, setPool] = useState(1);
    const [again, setAgain] = useState("10");
    const [rote, setRote] = useState(false);
    const [chance, setChance] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const [result, setResult] = useState(null);

    const label = rollData?.label || "Custom Roll";

    // Sync state when rollData changes (new roll button clicked)
    const [prevRollData, setPrevRollData] = useState(null);
    if (rollData !== prevRollData) {
        setPrevRollData(rollData);
        if (rollData) {
            setPool(rollData.pool || 1);
            setAgain(String(rollData.again || 10));
            setRote(rollData.rote || false);
            setChance(false);
            setResult(null);
        }
    }

    const handleRoll = async () => {
        setIsRolling(true);
        setResult(null);
        try {
            const response = await axios.post(`${API}/dice/roll`, {
                pool: chance ? 1 : pool,
                again: parseInt(again),
                rote,
                chance,
            });
            await new Promise(resolve => setTimeout(resolve, 400));
            setResult(response.data);

            if (onRollResult) {
                const outcome = response.data.is_dramatic_failure
                    ? "Dramatic Failure"
                    : response.data.is_exceptional
                    ? "Exceptional Success"
                    : response.data.successes > 0
                    ? "Success"
                    : "Failure";

                onRollResult(
                    `[ROLL RESULT] ${label} | Outcome: ${outcome} | Successes: ${response.data.successes} | Dice: [${response.data.dice.join(", ")}]`
                );
            }

            if (response.data.is_dramatic_failure) {
                toast.error("Dramatic Failure!", { description: "The spirits turn against you..." });
            } else if (response.data.is_exceptional) {
                toast.success("Exceptional Success!", { description: `${response.data.successes} successes!` });
            }
        } catch {
            toast.error("Failed to roll dice");
        } finally {
            setIsRolling(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-950 border-zinc-800 max-w-sm" data-testid="chat-roll-popup">
                <DialogHeader>
                    <DialogTitle className="text-zinc-200 flex items-center gap-2 text-base">
                        <Dices className="w-5 h-5 text-teal-400" />
                        {label}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 pt-1">
                    {/* Dice Pool */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Dice Pool</label>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setPool(Math.max(1, pool - 1))} className="h-7 w-7 text-zinc-400" disabled={chance}>-</Button>
                            <Input
                                type="number"
                                value={chance ? 1 : pool}
                                onChange={(e) => setPool(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-14 h-7 text-center input-geist text-sm"
                                disabled={chance}
                                data-testid="chat-roll-pool-input"
                            />
                            <Button variant="ghost" size="icon" onClick={() => setPool(pool + 1)} className="h-7 w-7 text-zinc-400" disabled={chance}>+</Button>
                        </div>
                    </div>

                    {/* Again */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Exploding</label>
                        <Select value={again} onValueChange={setAgain} disabled={chance}>
                            <SelectTrigger className="w-28 h-7 bg-zinc-900/50 border-zinc-800 text-sm" data-testid="chat-roll-again-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem value="10" className="text-zinc-200">10-again</SelectItem>
                                <SelectItem value="9" className="text-zinc-200">9-again</SelectItem>
                                <SelectItem value="8" className="text-zinc-200">8-again</SelectItem>
                                <SelectItem value="11" className="text-zinc-200">No again</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Rote */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Rote Quality</label>
                        <Switch checked={rote} onCheckedChange={setRote} disabled={chance} data-testid="chat-roll-rote-switch" />
                    </div>

                    {/* Chance Die */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Chance Die</label>
                        <Switch
                            checked={chance}
                            onCheckedChange={(v) => { setChance(v); if (v) setRote(false); }}
                            data-testid="chat-roll-chance-switch"
                        />
                    </div>

                    {/* Roll Button */}
                    <Button
                        onClick={handleRoll}
                        disabled={isRolling}
                        className="w-full btn-primary h-10"
                        data-testid="chat-roll-btn"
                    >
                        {isRolling ? (
                            <span className="flex items-center gap-2">
                                <Dices className="w-4 h-4 animate-dice-roll" /> Rolling...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Dices className="w-4 h-4" /> Roll {chance ? "Chance" : pool} {chance || pool === 1 ? "Die" : "Dice"}
                            </span>
                        )}
                    </Button>

                    {/* Result */}
                    {result && (
                        <div
                            className={`p-3 rounded-sm border animate-fade-in ${
                                result.is_dramatic_failure
                                    ? "bg-rose-950/30 border-rose-500/30"
                                    : result.is_exceptional
                                    ? "bg-teal-950/30 border-teal-500/30"
                                    : result.successes > 0
                                    ? "bg-zinc-800/50 border-zinc-700"
                                    : "bg-zinc-900/50 border-zinc-800"
                            }`}
                            data-testid="chat-roll-result"
                        >
                            <div className="flex flex-wrap gap-1.5 justify-center mb-2">
                                {result.dice.map((die, i) => (
                                    <div
                                        key={i}
                                        className={`w-8 h-8 rounded-sm flex items-center justify-center font-mono text-sm font-bold ${
                                            die >= 8
                                                ? "bg-teal-900/50 border border-teal-500/50 text-teal-300"
                                                : die === 1 && result.is_dramatic_failure
                                                ? "bg-rose-900/50 border border-rose-500/50 text-rose-300"
                                                : "bg-zinc-800 border border-zinc-700 text-zinc-400"
                                        }`}
                                    >
                                        {die}
                                    </div>
                                ))}
                            </div>
                            <div className="text-center">
                                <p className={`font-heading text-lg ${
                                    result.is_dramatic_failure ? "text-rose-400"
                                    : result.is_exceptional ? "text-teal-400"
                                    : result.successes > 0 ? "text-zinc-200"
                                    : "text-zinc-500"
                                }`}>
                                    {result.successes} {result.successes === 1 ? "Success" : "Successes"}
                                </p>
                                <p className="text-[10px] text-zinc-500 mt-0.5">{result.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChatRollPopup;