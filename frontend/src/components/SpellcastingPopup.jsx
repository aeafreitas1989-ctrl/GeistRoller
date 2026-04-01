import { useState, useEffect, useMemo } from "react";
import { X, Minus, Plus, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ARCANA_PRACTICES, GNOSIS_TABLE } from "@/data/character-data";

// Practice dot requirements
const PRACTICE_DOTS = {
    "Compelling": 1, "Knowing": 1, "Unveiling": 1,
    "Ruling": 2, "Shielding": 2, "Veiling": 2,
    "Fraying": 3, "Perfecting": 3, "Weaving": 3,
    "Patterning": 4, "Unravelling": 4,
    "Making": 5, "Unmaking": 5
};

// Get all practices as flat array with their dot requirements
const ALL_PRACTICES = Object.entries(PRACTICE_DOTS).map(([name, dots]) => ({ name, dots }));

// Casting time by Gnosis
const getCastingTime = (gnosis) => {
    if (gnosis <= 2) return "3 hours";
    if (gnosis <= 4) return "1 hour";
    if (gnosis <= 6) return "30 min";
    if (gnosis <= 8) return "10 min";
    return "1 min";
};

// Factor level descriptions
const FACTOR_LEVELS = {
    potency: {
        standard: [
            { level: 1, label: "Potency 1" },
            { level: 2, label: "Potency 2" },
            { level: 3, label: "Potency 3" },
            { level: 4, label: "Potency 4" },
            { level: 5, label: "Potency 5" },
        ],
        advanced: [
            { level: 1, label: "Potency 1 (+2 Withstand)" },
            { level: 2, label: "Potency 2 (+2 Withstand)" },
            { level: 3, label: "Potency 3 (+2 Withstand)" },
            { level: 4, label: "Potency 4 (+2 Withstand)" },
            { level: 5, label: "Potency 5 (+2 Withstand)" },
        ]
    },
    duration: {
        standard: [
            { level: 1, label: "1 turn" },
            { level: 2, label: "2 turns" },
            { level: 3, label: "3 turns" },
            { level: 4, label: "5 turns" },
            { level: 5, label: "10 turns" },
            { level: 6, label: "20 turns" },
            { level: 7, label: "30 turns" },
        ],
        advanced: [
            { level: 1, label: "1 hour" },
            { level: 2, label: "1 day" },
            { level: 3, label: "1 week" },
            { level: 4, label: "1 month" },
            { level: 5, label: "1 year" },
            { level: 6, label: "Indefinite (+1 Reach, 1 Mana)" },
        ]
    },
    scale: {
        standard: [
            { level: 1, label: "1 subject (Size 5) / 1m area" },
            { level: 2, label: "2 subjects (Size 6) / small room" },
            { level: 3, label: "4 subjects (Size 7) / large room" },
            { level: 4, label: "8 subjects (Size 8) / single floor" },
            { level: 5, label: "16 subjects (Size 9) / ballroom" },
        ],
        advanced: [
            { level: 1, label: "5 subjects (Size 5) / large house" },
            { level: 2, label: "10 subjects (Size 10) / small warehouse" },
            { level: 3, label: "20 subjects (Size 15) / supermarket" },
            { level: 4, label: "40 subjects (Size 20) / shopping mall" },
            { level: 5, label: "80 subjects (Size 25) / city block" },
            { level: 6, label: "160 subjects (Size 30) / neighbourhood" },
        ]
    }
};

export const SpellcastingPopup = ({ 
    isOpen, 
    onClose, 
    arcanum, 
    arcanumDots,
    gnosis,
    isRuling,
    isInferior,
    currentMana,
    initialPractice,
    onSpendMana,
    onRollDice
}) => {
    // Spell configuration state
    const [selectedPractice, setSelectedPractice] = useState("");
    const [factors, setFactors] = useState({
        casting: { advanced: false, level: 1 },
        range: { advanced: false, level: 1 },
        potency: { advanced: false, level: 1 },
        duration: { advanced: false, level: 1 },
        scale: { advanced: false, level: 1 }
    });

    // Reset when popup opens with new arcanum
    useEffect(() => {
        if (isOpen) {
            // Set initial practice if provided, otherwise reset
            setSelectedPractice(initialPractice || "");
            setFactors({
                casting: { advanced: false, level: 1 },
                range: { advanced: false, level: 1 },
                potency: { advanced: false, level: 1 },
                duration: { advanced: false, level: 1 },
                scale: { advanced: false, level: 1 }
            });
        }
    }, [isOpen, arcanum, initialPractice]);

    // Get available practices based on arcanum dots
    const availablePractices = useMemo(() => {
        return ALL_PRACTICES.filter(p => p.dots <= arcanumDots);
    }, [arcanumDots]);

    // Calculate practice dots required
    const practiceDots = selectedPractice ? PRACTICE_DOTS[selectedPractice] : 0;

    // Calculate Free Reach = Arcanum - Practice + 1
    const freeReach = selectedPractice ? Math.max(0, arcanumDots - practiceDots + 1) : 0;

    // Calculate Reach used from Advanced factors
    const advancedReachUsed = Object.values(factors).filter(f => f.advanced).length;
    
    // Additional reach for Indefinite duration
    const indefiniteReach = (factors.duration.advanced && factors.duration.level === 6) ? 1 : 0;

    // Total Reach used
    const totalReachUsed = advancedReachUsed + indefiniteReach;

    // Reach remaining (negative means Paradox risk)
    const reachRemaining = freeReach - totalReachUsed;

    // Calculate dice penalty from factor levels
    const calculatePenalty = () => {
        let penalty = 0;
        // Potency: -2 per level above 1
        penalty += (factors.potency.level - 1) * -2;
        // Duration (standard): -2 per level above 5 (for extra turns)
        if (!factors.duration.advanced && factors.duration.level > 5) {
            penalty += (factors.duration.level - 5) * -2;
        }
        // Duration (advanced): -2 per level above 1
        if (factors.duration.advanced) {
            penalty += (factors.duration.level - 1) * -2;
        }
        // Scale: -2 per level above 1
        penalty += (factors.scale.level - 1) * -2;
        return penalty;
    };

    const dicePenalty = calculatePenalty();

    // Calculate base dice pool: Gnosis + Arcanum
    const baseDicePool = gnosis + arcanumDots;
    const finalDicePool = Math.max(0, baseDicePool + dicePenalty);

    // Calculate Mana cost
    const getManaCost = () => {
        let cost = 0;
        // Non-ruling arcana cost 1 mana
        if (!isRuling) cost += 1;
        // Indefinite duration costs 1 mana
        if (factors.duration.advanced && factors.duration.level === 6) cost += 1;
        return cost;
    };

    const manaCost = getManaCost();

    // Update factor
    const updateFactor = (factorName, updates) => {
        setFactors(prev => ({
            ...prev,
            [factorName]: { ...prev[factorName], ...updates }
        }));
    };

    // Get max level for a factor
    const getMaxLevel = (factorName, isAdvanced) => {
        if (factorName === "casting" || factorName === "range") return 1;
        const levels = FACTOR_LEVELS[factorName]?.[isAdvanced ? "advanced" : "standard"];
        return levels?.length || 1;
    };

    // Handle cast spell
    const handleCastSpell = () => {
        if (manaCost > 0 && currentMana < manaCost) {
            alert("Not enough Mana!");
            return;
        }
        
        if (manaCost > 0) {
            onSpendMana(manaCost);
        }

        // Roll the dice
        onRollDice({
            pool: finalDicePool,
            label: `${arcanum} Spell (${selectedPractice})`,
            reachUsed: totalReachUsed,
            freeReach: freeReach,
            paradoxRisk: reachRemaining < 0 ? Math.abs(reachRemaining) : 0
        });

        onClose();
    };

    if (!isOpen) return null;

    const castingTimeStandard = getCastingTime(gnosis);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]" onClick={onClose}>
            <div 
                className="bg-zinc-900 border border-violet-500/50 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-violet-400" />
                        <div>
                            <h2 className="font-heading text-lg text-zinc-100">
                                {arcanum} Spellcasting
                            </h2>
                            <p className="text-xs text-zinc-500">
                                {isRuling && <span className="text-blue-400">Ruling Arcanum</span>}
                                {isInferior && <span className="text-red-400">Inferior Arcanum</span>}
                                {!isRuling && !isInferior && <span className="text-zinc-400">Common Arcanum</span>}
                                {" · "}{arcanumDots} dot{arcanumDots !== 1 && "s"}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-zinc-100">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Dice Pool Display */}
                    <div className="flex items-center justify-between p-3 bg-violet-900/20 border border-violet-500/30 rounded">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase">Dice Pool</p>
                            <p className="text-lg font-mono text-violet-300">
                                Gnosis ({gnosis}) + {arcanum} ({arcanumDots}) = {baseDicePool}
                                {dicePenalty !== 0 && <span className="text-red-400"> {dicePenalty}</span>}
                                {dicePenalty !== 0 && <span className="text-zinc-400"> = </span>}
                                {dicePenalty !== 0 && <span className="text-teal-400 font-bold">{finalDicePool}</span>}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-zinc-500 uppercase">Mana Cost</p>
                            <p className={`text-lg font-mono ${manaCost > 0 ? (currentMana >= manaCost ? "text-violet-300" : "text-red-400") : "text-teal-400"}`}>
                                {manaCost} {!isRuling && <span className="text-[10px] text-zinc-500">(non-ruling)</span>}
                            </p>
                        </div>
                    </div>

                    {/* Practice Selection */}
                    <div>
                        <label className="text-xs text-zinc-500 uppercase block mb-1">Practice</label>
                        <Select value={selectedPractice} onValueChange={setSelectedPractice}>
                            <SelectTrigger className="bg-zinc-900/50 border-zinc-700">
                                <SelectValue placeholder="Select a Practice..." />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700 z-[200]">
                                {availablePractices.length === 0 ? (
                                    <div className="p-2 text-xs text-zinc-500">No practices available (need Arcanum dots)</div>
                                ) : (
                                    availablePractices.map(p => (
                                        <SelectItem key={p.name} value={p.name} className="text-zinc-200">
                                            <span className="text-violet-400 mr-2">{"●".repeat(p.dots)}</span>
                                            {p.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reach Display */}
                    {selectedPractice && (
                        <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded text-sm">
                            <span className="text-zinc-400">
                                Free Reach: <span className="text-teal-400 font-mono">{freeReach}</span>
                                <span className="text-zinc-600 ml-1">({arcanumDots} - {practiceDots} + 1)</span>
                            </span>
                            <span className={`font-mono ${reachRemaining >= 0 ? "text-teal-400" : "text-red-400"}`}>
                                {reachRemaining >= 0 ? `${reachRemaining} Reach remaining` : `${Math.abs(reachRemaining)} Paradox dice!`}
                            </span>
                        </div>
                    )}

                    {/* Spell Factors */}
                    <div className="space-y-2">
                        <p className="text-xs text-zinc-500 uppercase">Spell Factors</p>
                        
                        {/* Header Row */}
                        <div className="grid grid-cols-[140px,70px,70px,60px,1fr] gap-2 text-[10px] text-zinc-500 uppercase px-2">
                            <span>Factor</span>
                            <span className="text-center">Standard</span>
                            <span className="text-center">Advanced</span>
                            <span className="text-center">Level</span>
                            <span>Description</span>
                        </div>

                        {/* Casting Time */}
                        <div className="grid grid-cols-[140px,70px,70px,60px,1fr] gap-2 items-center p-2 bg-zinc-800/30 rounded">
                            <span className="text-sm text-zinc-300">Casting Time</span>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={!factors.casting.advanced}
                                    onCheckedChange={() => updateFactor("casting", { advanced: false })}
                                    className="border-zinc-600 data-[state=checked]:bg-violet-600"
                                />
                            </div>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={factors.casting.advanced}
                                    onCheckedChange={() => updateFactor("casting", { advanced: true })}
                                    className="border-zinc-600 data-[state=checked]:bg-amber-600"
                                />
                            </div>
                            <span className="text-center text-zinc-500">-</span>
                            <span className="text-xs text-zinc-400">
                                {factors.casting.advanced ? "Instant" : castingTimeStandard}
                                {factors.casting.advanced && <span className="text-amber-400 ml-1">(+1 Reach)</span>}
                            </span>
                        </div>

                        {/* Range */}
                        <div className="grid grid-cols-[140px,70px,70px,60px,1fr] gap-2 items-center p-2 bg-zinc-800/30 rounded">
                            <span className="text-sm text-zinc-300">Range</span>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={!factors.range.advanced}
                                    onCheckedChange={() => updateFactor("range", { advanced: false })}
                                    className="border-zinc-600 data-[state=checked]:bg-violet-600"
                                />
                            </div>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={factors.range.advanced}
                                    onCheckedChange={() => updateFactor("range", { advanced: true })}
                                    className="border-zinc-600 data-[state=checked]:bg-amber-600"
                                />
                            </div>
                            <span className="text-center text-zinc-500">-</span>
                            <span className="text-xs text-zinc-400">
                                {factors.range.advanced ? "Sensory Range" : "Touch / Self"}
                                {factors.range.advanced && <span className="text-amber-400 ml-1">(+1 Reach)</span>}
                            </span>
                        </div>

                        {/* Potency */}
                        <div className="grid grid-cols-[140px,70px,70px,60px,1fr] gap-2 items-center p-2 bg-zinc-800/30 rounded">
                            <span className="text-sm text-zinc-300">Potency</span>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={!factors.potency.advanced}
                                    onCheckedChange={() => updateFactor("potency", { advanced: false })}
                                    className="border-zinc-600 data-[state=checked]:bg-violet-600"
                                />
                            </div>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={factors.potency.advanced}
                                    onCheckedChange={() => updateFactor("potency", { advanced: true })}
                                    className="border-zinc-600 data-[state=checked]:bg-amber-600"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 text-zinc-400"
                                    onClick={() => updateFactor("potency", { level: Math.max(1, factors.potency.level - 1) })}
                                    disabled={factors.potency.level <= 1}
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-sm font-mono text-violet-300 w-4 text-center">{factors.potency.level}</span>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 text-zinc-400"
                                    onClick={() => updateFactor("potency", { level: Math.min(5, factors.potency.level + 1) })}
                                    disabled={factors.potency.level >= 5}
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                            <span className="text-xs text-zinc-400">
                                Potency {factors.potency.level}
                                {factors.potency.advanced && " (+2 Withstand)"}
                                {factors.potency.level > 1 && <span className="text-red-400 ml-1">(-{(factors.potency.level - 1) * 2} dice)</span>}
                                {factors.potency.advanced && <span className="text-amber-400 ml-1">(+1 Reach)</span>}
                            </span>
                        </div>

                        {/* Duration */}
                        <div className="grid grid-cols-[140px,70px,70px,60px,1fr] gap-2 items-center p-2 bg-zinc-800/30 rounded">
                            <span className="text-sm text-zinc-300">Duration</span>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={!factors.duration.advanced}
                                    onCheckedChange={() => updateFactor("duration", { advanced: false, level: 1 })}
                                    className="border-zinc-600 data-[state=checked]:bg-violet-600"
                                />
                            </div>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={factors.duration.advanced}
                                    onCheckedChange={() => updateFactor("duration", { advanced: true, level: 1 })}
                                    className="border-zinc-600 data-[state=checked]:bg-amber-600"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 text-zinc-400"
                                    onClick={() => updateFactor("duration", { level: Math.max(1, factors.duration.level - 1) })}
                                    disabled={factors.duration.level <= 1}
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-sm font-mono text-violet-300 w-4 text-center">{factors.duration.level}</span>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 text-zinc-400"
                                    onClick={() => updateFactor("duration", { level: Math.min(getMaxLevel("duration", factors.duration.advanced), factors.duration.level + 1) })}
                                    disabled={factors.duration.level >= getMaxLevel("duration", factors.duration.advanced)}
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                            <span className="text-xs text-zinc-400">
                                {FACTOR_LEVELS.duration[factors.duration.advanced ? "advanced" : "standard"][factors.duration.level - 1]?.label || "1 turn"}
                                {factors.duration.advanced && factors.duration.level < 6 && <span className="text-amber-400 ml-1">(+1 Reach)</span>}
                                {factors.duration.advanced && factors.duration.level > 1 && factors.duration.level < 6 && <span className="text-red-400 ml-1">(-{(factors.duration.level - 1) * 2} dice)</span>}
                            </span>
                        </div>

                        {/* Scale */}
                        <div className="grid grid-cols-[140px,70px,70px,60px,1fr] gap-2 items-center p-2 bg-zinc-800/30 rounded">
                            <span className="text-sm text-zinc-300">Scale</span>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={!factors.scale.advanced}
                                    onCheckedChange={() => updateFactor("scale", { advanced: false, level: 1 })}
                                    className="border-zinc-600 data-[state=checked]:bg-violet-600"
                                />
                            </div>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={factors.scale.advanced}
                                    onCheckedChange={() => updateFactor("scale", { advanced: true, level: 1 })}
                                    className="border-zinc-600 data-[state=checked]:bg-amber-600"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 text-zinc-400"
                                    onClick={() => updateFactor("scale", { level: Math.max(1, factors.scale.level - 1) })}
                                    disabled={factors.scale.level <= 1}
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-sm font-mono text-violet-300 w-4 text-center">{factors.scale.level}</span>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 text-zinc-400"
                                    onClick={() => updateFactor("scale", { level: Math.min(getMaxLevel("scale", factors.scale.advanced), factors.scale.level + 1) })}
                                    disabled={factors.scale.level >= getMaxLevel("scale", factors.scale.advanced)}
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                            <span className="text-xs text-zinc-400">
                                {FACTOR_LEVELS.scale[factors.scale.advanced ? "advanced" : "standard"][factors.scale.level - 1]?.label || "1 subject"}
                                {factors.scale.advanced && <span className="text-amber-400 ml-1">(+1 Reach)</span>}
                                {factors.scale.level > 1 && <span className="text-red-400 ml-1">(-{(factors.scale.level - 1) * 2} dice)</span>}
                            </span>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="p-3 bg-zinc-800/50 rounded space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Final Dice Pool:</span>
                            <span className="font-mono text-teal-400 font-bold">{finalDicePool} dice</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Reach Used / Free:</span>
                            <span className={`font-mono ${reachRemaining >= 0 ? "text-teal-400" : "text-red-400"}`}>
                                {totalReachUsed} / {freeReach}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Mana Cost:</span>
                            <span className={`font-mono ${manaCost > currentMana ? "text-red-400" : "text-violet-400"}`}>
                                {manaCost} (you have {currentMana})
                            </span>
                        </div>
                        {reachRemaining < 0 && (
                            <div className="p-2 bg-red-900/30 border border-red-500/50 rounded text-xs text-red-300">
                                <Zap className="w-3 h-3 inline mr-1" />
                                Warning: {Math.abs(reachRemaining)} Paradox dice will be rolled!
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-800 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} className="border-zinc-700 text-zinc-300">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleCastSpell}
                        disabled={!selectedPractice || (manaCost > currentMana)}
                        className="bg-violet-600 hover:bg-violet-500 text-white"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Cast Spell ({finalDicePool} dice)
                    </Button>
                </div>
            </div>
        </div>
    );
};
