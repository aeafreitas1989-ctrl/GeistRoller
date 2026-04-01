import { useState, forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from "react";
import { Dices, X, ChevronUp, ChevronDown, Zap } from "lucide-react";
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
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const DiceRoller = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [pool, setPool] = useState(3);
    const [again, setAgain] = useState("10");
    const [rote, setRote] = useState(false);
    const [chance, setChance] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const [result, setResult] = useState(null);
    const [rollLabel, setRollLabel] = useState(null);
    const [pendingParadox, setPendingParadox] = useState(null);
    const [exceptionalTarget, setExceptionalTarget] = useState(5);

    // External roll trigger
    const pendingRollRef = useRef(null);
    const [triggerExternal, setTriggerExternal] = useState(0);

    const performRoll = useCallback(async (rollPool, rollAgain, rollRote, rollChance, rollExceptionalTarget) => {
        setIsRolling(true);
        setResult(null);
        try {
            const response = await axios.post(`${API}/dice/roll`, {
                pool: rollChance ? 1 : rollPool,
                again: parseInt(rollAgain),
                rote: rollRote,
                chance: rollChance,
                exceptional_target: rollExceptionalTarget || 5,
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            setResult(response.data);

            if (response.data.is_dramatic_failure) {
                toast.error("Dramatic Failure!", {
                    description: "The spirits turn against you...",
                });
            } else if (response.data.is_exceptional) {
                toast.success("Exceptional Success!", {
                    description: `${response.data.successes} successes!`,
                });
            }
        } catch (error) {
            toast.error("Failed to roll dice");
        } finally {
            setIsRolling(false);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        rollWithConfig: (config) => {
            pendingRollRef.current = config;
            setTriggerExternal(prev => prev + 1);
        }
    }));

    useEffect(() => {
        if (pendingRollRef.current) {
            const config = pendingRollRef.current;
            pendingRollRef.current = null;

            setPool(config.pool || 1);
            setChance(config.chance || false);
            setAgain(String(config.again || 10));
            setRote(config.rote || false);
            setRollLabel(config.label || null);
            setExceptionalTarget(config.exceptional_target || 5);
            setIsOpen(true);
            setIsMinimized(false);
            setResult(null);

            if (config.paradox) {
                setPendingParadox(config.paradox);
            } else {
                setPendingParadox(null);
            }

            performRoll(
                config.pool || 1,
                config.again || 10,
                config.rote || false,
                config.chance || false,
                config.exceptional_target || 5
            );
        }
    }, [triggerExternal, performRoll]);

    const rollParadox = () => {
        if (!pendingParadox) return;
        const pConfig = pendingParadox;
        setPool(pConfig.pool || 1);
        setChance(pConfig.chance || false);
        setAgain(String(pConfig.again || 10));
        setRote(pConfig.rote || false);
        setRollLabel(pConfig.label || "Paradox Roll");
        setResult(null);
        setPendingParadox(null);
        performRoll(
            pConfig.pool || 1,
            pConfig.again || 10,
            pConfig.rote || false,
            pConfig.chance || false
        );
    };

    const rollDice = () => {
        setRollLabel(null);
        setPendingParadox(null);
        setExceptionalTarget(5);
        performRoll(pool, parseInt(again), rote, chance, 5);
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-teal-900/50 border border-teal-500/50 hover:bg-teal-800/50 shadow-ectoplasm z-[60]"
                data-testid="open-dice-roller-btn"
            >
                <Dices className="w-6 h-6 text-teal-300" />
            </Button>
        );
    }

    return (
        <div
            className={`fixed bottom-6 right-6 w-80 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-md shadow-deep z-[60] transition-all ${
                isMinimized ? "h-12" : ""
            }`}
            data-testid="dice-roller-panel"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                    <Dices className="w-5 h-5 text-teal-400" />
                    <span className="font-heading text-lg text-zinc-200">Dice Roller</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="h-7 w-7 text-zinc-500 hover:text-zinc-300"
                        data-testid="minimize-dice-roller-btn"
                    >
                        {isMinimized ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setIsOpen(false); setPendingParadox(null); setRollLabel(null); }}
                        className="h-7 w-7 text-zinc-500 hover:text-zinc-300"
                        data-testid="close-dice-roller-btn"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {!isMinimized && (
                <div className="p-4 space-y-4">
                    {/* Roll Label */}
                    {rollLabel && (
                        <div className="px-2 py-1.5 bg-violet-900/30 border border-violet-500/30 rounded text-xs text-violet-300 text-center" data-testid="roll-label">
                            {rollLabel}
                        </div>
                    )}

                    {/* Dice Pool */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Dice Pool</label>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPool(Math.max(1, pool - 1))}
                                className="h-8 w-8 text-zinc-400"
                                disabled={chance}
                                data-testid="decrease-pool-btn"
                            >
                                -
                            </Button>
                            <Input
                                type="number"
                                value={chance ? 1 : pool}
                                onChange={(e) => setPool(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-16 text-center input-geist"
                                disabled={chance}
                                data-testid="dice-pool-input"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPool(pool + 1)}
                                className="h-8 w-8 text-zinc-400"
                                disabled={chance}
                                data-testid="increase-pool-btn"
                            >
                                +
                            </Button>
                        </div>
                    </div>

                    {/* Again */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Exploding Dice</label>
                        <Select value={again} onValueChange={setAgain} disabled={chance}>
                            <SelectTrigger className="w-32 bg-zinc-900/50 border-zinc-800" data-testid="again-select">
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
                        <Switch
                            checked={rote}
                            onCheckedChange={setRote}
                            disabled={chance}
                            data-testid="rote-switch"
                        />
                    </div>

                    {/* Chance Die */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Chance Die</label>
                        <Switch
                            checked={chance}
                            onCheckedChange={(checked) => {
                                setChance(checked);
                                if (checked) {
                                    setRote(false);
                                }
                            }}
                            data-testid="chance-switch"
                        />
                    </div>

                    {/* Roll Button */}
                    <Button
                        onClick={rollDice}
                        disabled={isRolling}
                        className="w-full btn-primary h-12 text-base"
                        data-testid="roll-dice-btn"
                    >
                        {isRolling ? (
                            <span className="flex items-center gap-2">
                                <Dices className="w-5 h-5 animate-dice-roll" />
                                Rolling...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Dices className="w-5 h-5" />
                                Roll {chance ? "Chance" : pool} {chance || pool === 1 ? "Die" : "Dice"}
                            </span>
                        )}
                    </Button>

                    {/* Result */}
                    {result && (
                        <div
                            className={`p-4 rounded-sm border animate-fade-in ${
                                result.is_dramatic_failure
                                    ? "bg-rose-950/30 border-rose-500/30"
                                    : result.is_exceptional
                                    ? "bg-teal-950/30 border-teal-500/30"
                                    : result.successes > 0
                                    ? "bg-zinc-800/50 border-zinc-700"
                                    : "bg-zinc-900/50 border-zinc-800"
                            }`}
                            data-testid="dice-result"
                        >
                            <div className="flex flex-wrap gap-2 justify-center mb-3">
                                {result.dice.map((die, index) => (
                                    <div
                                        key={index}
                                        className={`w-10 h-10 rounded-sm flex items-center justify-center font-mono text-lg font-bold transition-all ${
                                            die >= 8
                                                ? "bg-teal-900/50 border border-teal-500/50 text-teal-300"
                                                : die === 1 && result.is_dramatic_failure
                                                ? "bg-rose-900/50 border border-rose-500/50 text-rose-300"
                                                : "bg-zinc-800 border border-zinc-700 text-zinc-400"
                                        }`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                        data-testid={`die-${index}`}
                                    >
                                        {die}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="text-center">
                                <p
                                    className={`font-heading text-xl ${
                                        result.is_dramatic_failure
                                            ? "text-rose-400"
                                            : result.is_exceptional
                                            ? "text-teal-400"
                                            : result.successes > 0
                                            ? "text-zinc-200"
                                            : "text-zinc-500"
                                    }`}
                                >
                                    {result.successes} {result.successes === 1 ? "Success" : "Successes"}
                                </p>
                                <p className="text-xs text-zinc-500 mt-1">{result.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Paradox Roll Button */}
                    {pendingParadox && result && !isRolling && (
                        <Button
                            onClick={rollParadox}
                            className="w-full h-10 bg-red-900/50 hover:bg-red-800/50 border border-red-500/50 text-red-300"
                            data-testid="roll-paradox-btn"
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            Roll Paradox ({pendingParadox.chance ? "Chance Die" : `${pendingParadox.pool} dice`})
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
});

DiceRoller.displayName = "DiceRoller";
