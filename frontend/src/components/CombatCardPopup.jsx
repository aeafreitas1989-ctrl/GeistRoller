import { useEffect, useMemo, useState } from "react";
import { Shield, Swords, TimerReset, Skull, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ATTACK_ATTRIBUTES = ["strength", "dexterity"];
const ATTACK_SKILLS = ["athletics", "brawl", "firearms", "weaponry"];
const DAMAGE_TYPES = ["bashing", "lethal", "aggravated"];
const DAMAGE_SOURCES = [
    { value: "general", label: "Mundane / General" },
    { value: "ballistic", label: "Ballistic" },
    { value: "supernatural", label: "Supernatural" },
    { value: "spirit", label: "Spirit / Ephemeral" },
    { value: "energy", label: "Energy" },
];

const formatLabel = (value) => value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export const CombatCardPopup = ({
    isOpen,
    onClose,
    getNestedValue,
    normalDefense,
    initiativeModifier,
    speed,
    armorGeneral,
    armorBallistic,
    activeMageArmorName,
    activeMageArmorDots,
    onTriggerDiceRoll,
    onApplyIncomingDamage,
}) => {
    const [currentDefense, setCurrentDefense] = useState(normalDefense);
    const [initiativeRoll, setInitiativeRoll] = useState(null);
    const [attackAttribute, setAttackAttribute] = useState("strength");
    const [attackSkill, setAttackSkill] = useState("brawl");
    const [targetDefense, setTargetDefense] = useState("0");
    const [attackModifier, setAttackModifier] = useState("0");
    const [incomingDamage, setIncomingDamage] = useState("1");
    const [incomingType, setIncomingType] = useState("bashing");
    const [incomingSource, setIncomingSource] = useState("general");

    const attackAttributeValue = getNestedValue("attributes", attackAttribute) || 0;
    const attackSkillValue = getNestedValue("skills", attackSkill) || 0;

    const outgoingPool = useMemo(() => {
        const defensePenalty = parseInt(targetDefense, 10) || 0;
        const modifier = parseInt(attackModifier, 10) || 0;
        return Math.max(0, attackAttributeValue + attackSkillValue + modifier - defensePenalty);
    }, [attackAttributeValue, attackSkillValue, targetDefense, attackModifier]);

    const rollInitiative = () => {
        const die = Math.floor(Math.random() * 10) + 1;
        setInitiativeRoll({
            die,
            modifier: initiativeModifier,
            total: die + initiativeModifier,
        });
    };

    useEffect(() => {
        if (!isOpen) return;
        setCurrentDefense(normalDefense);
        setAttackAttribute("strength");
        setAttackSkill("brawl");
        setTargetDefense("0");
        setAttackModifier("0");
        setIncomingDamage("1");
        setIncomingType("bashing");
        setIncomingSource("general");
        rollInitiative();
    }, [isOpen, normalDefense, initiativeModifier]);

    const handleDefenseClick = () => {
        setCurrentDefense((prev) => Math.max(0, prev - 1));
    };

    const handleDodge = () => {
        if (!onTriggerDiceRoll || currentDefense <= 0) return;

        onTriggerDiceRoll({
            pool: currentDefense * 2,
            label: `Dodge (${currentDefense} Defense × 2)`,
            dicePoolBreakdown: `Dodge ${currentDefense} × 2`,
            exceptional_target: 5,
        });
    };

    const handleOutgoingAttack = () => {
        if (!onTriggerDiceRoll) return;

        onTriggerDiceRoll({
            pool: outgoingPool <= 0 ? 1 : outgoingPool,
            chance: outgoingPool <= 0,
            label: `${formatLabel(attackAttribute)} + ${formatLabel(attackSkill)} Attack`,
            dicePoolBreakdown: `${formatLabel(attackAttribute)} ${attackAttributeValue} + ${formatLabel(attackSkill)} ${attackSkillValue} + Modifier ${parseInt(attackModifier, 10) || 0} - Target Defense ${parseInt(targetDefense, 10) || 0}`,
            exceptional_target: 5,
        });
    };

    const handleIncomingDamage = async () => {
        const amount = Math.max(0, parseInt(incomingDamage, 10) || 0);
        if (amount <= 0 || !onApplyIncomingDamage) return;

        await onApplyIncomingDamage({
            amount,
            damageType: incomingType,
            sourceProfile: incomingSource,
        });
    };

    const endTurn = () => {
        setCurrentDefense(normalDefense);
    };

    const currentInitiative = initiativeRoll ? initiativeRoll.total : initiativeModifier;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-rose-300 font-heading">
                        <Swords className="w-5 h-5" />
                        Combat Card
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <button
                            type="button"
                            onClick={handleDefenseClick}
                            className="p-2 rounded-sm bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 transition-colors text-left"
                            data-testid="combat-card-defense-btn"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Defense</span>
                                <span className="font-mono text-teal-400">{currentDefense}</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={handleDodge}
                            disabled={currentDefense <= 0}
                            className="p-2 rounded-sm bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
                            data-testid="combat-card-dodge-btn"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Dodge</span>
                                <span className="font-mono text-teal-400">{currentDefense * 2}</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={rollInitiative}
                            className="p-2 rounded-sm bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 transition-colors text-left"
                            data-testid="combat-card-initiative-btn"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Initiative</span>
                                <span className="font-mono text-teal-400">{currentInitiative}</span>
                            </div>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2 rounded-sm bg-zinc-900/30 border border-zinc-800">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Speed</span>
                                <span className="font-mono text-teal-400">{speed}</span>
                            </div>
                        </div>
                        <div className="p-2 rounded-sm bg-zinc-900/30 border border-zinc-800">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Armor</span>
                                <span className="font-mono text-teal-400">{armorGeneral}/{armorBallistic}</span>
                            </div>
                        </div>
                        <div className="p-2 rounded-sm bg-zinc-900/30 border border-zinc-800">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Current Init</span>
                                <span className="font-mono text-teal-400">{currentInitiative}</span>
                            </div>
                            {initiativeRoll && (
                                <div className="mt-1 text-[10px] text-zinc-600">d10 {initiativeRoll.die} + {initiativeRoll.modifier}</div>
                            )}
                        </div>
                    </div>

                    {activeMageArmorName && (
                        <div className="p-2 rounded-sm bg-violet-900/20 border border-violet-500/30 text-xs text-violet-200">
                            Mage Armor active: <span className="font-medium">{activeMageArmorName}</span> ({activeMageArmorDots})
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-sm bg-zinc-900/30 border border-zinc-800 space-y-3">
                            <div className="flex items-center gap-2 text-amber-300 text-sm font-medium">
                                <Zap className="w-4 h-4" />
                                Outgoing Attack
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Attribute</label>
                                    <Select value={attackAttribute} onValueChange={setAttackAttribute}>
                                        <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-700 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                            {ATTACK_ATTRIBUTES.map((value) => (
                                                <SelectItem key={value} value={value} className="text-xs">
                                                    {formatLabel(value)} ({getNestedValue("attributes", value) || 0})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Skill</label>
                                    <Select value={attackSkill} onValueChange={setAttackSkill}>
                                        <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-700 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                            {ATTACK_SKILLS.map((value) => (
                                                <SelectItem key={value} value={value} className="text-xs">
                                                    {formatLabel(value)} ({getNestedValue("skills", value) || 0})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Target Defense</label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={10}
                                        value={targetDefense}
                                        onChange={(e) => setTargetDefense(e.target.value)}
                                        className="h-8 bg-zinc-900/50 border-zinc-700 text-xs"
                                        data-testid="combat-card-target-defense"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Modifier</label>
                                    <Input
                                        type="number"
                                        value={attackModifier}
                                        onChange={(e) => setAttackModifier(e.target.value)}
                                        className="h-8 bg-zinc-900/50 border-zinc-700 text-xs"
                                        data-testid="combat-card-attack-modifier"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-sm bg-zinc-950/50 border border-zinc-800 px-3 py-2">
                                <span className="text-zinc-500 text-xs">Pool</span>
                                <span className="font-mono text-amber-300 text-sm">{outgoingPool}</span>
                            </div>

                            <Button
                                type="button"
                                className="w-full btn-primary"
                                onClick={handleOutgoingAttack}
                                data-testid="combat-card-outgoing-attack-btn"
                            >
                                Roll Attack
                            </Button>
                        </div>

                        <div className="p-3 rounded-sm bg-zinc-900/30 border border-zinc-800 space-y-3">
                            <div className="flex items-center gap-2 text-rose-300 text-sm font-medium">
                                <Skull className="w-4 h-4" />
                                Incoming Damage
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Amount</label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={incomingDamage}
                                        onChange={(e) => setIncomingDamage(e.target.value)}
                                        className="h-8 bg-zinc-900/50 border-zinc-700 text-xs"
                                        data-testid="combat-card-incoming-damage"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Type</label>
                                    <Select value={incomingType} onValueChange={setIncomingType}>
                                        <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-700 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                            {DAMAGE_TYPES.map((value) => (
                                                <SelectItem key={value} value={value} className="text-xs">
                                                    {formatLabel(value)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Source</label>
                                <Select value={incomingSource} onValueChange={setIncomingSource}>
                                    <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-700 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                        {DAMAGE_SOURCES.map((option) => (
                                            <SelectItem key={option.value} value={option.value} className="text-xs">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="button"
                                variant="destructive"
                                className="w-full"
                                onClick={handleIncomingDamage}
                                data-testid="combat-card-apply-damage-btn"
                            >
                                Apply Damage
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-zinc-700 text-zinc-300"
                            onClick={endTurn}
                            data-testid="combat-card-end-turn-btn"
                        >
                            <TimerReset className="w-4 h-4 mr-2" />
                            End Turn
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-rose-700 text-rose-300"
                            onClick={onClose}
                            data-testid="combat-card-end-combat-btn"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            End Combat
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
