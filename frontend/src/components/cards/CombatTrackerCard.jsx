import { useEffect, useState } from "react";
import { X, Skull, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthTrack } from "../character/StatComponents";
import { getNaturalHealingLabel } from "../../utils/naturalHealing";
import { hasHealableWound } from "../../utils/resistantWounds";
import { normalizeSkillSpecialty } from "../../utils/skillSpecialties";
import { isEffectExpired, expireCombatEffects } from "../../utils/effectDuration";

export const CombatTrackerCard = ({
    activeCharacter,
    normalDefense,
    initiativeModifier,
    speed,
    armorGeneral,
    armorBallistic,
    activeMageArmorName,
    activeMageArmorDots,
    onTriggerDiceRoll,
    onAddRecentRoll,
    onApplyIncomingDamage,
    onUpdateCharacter,
    healthBoxes,
    maxHealth,
    filledHealth,
    isDeadTrack,
    woundPenalty,
    onHealHealthState,
    onToggleResistantWound,
    onPatternRestoration,
    patternRestorationDisabled,
    isMage,
    defenseResetToken = 0,
}) => {
    const [currentDefense, setCurrentDefense] = useState(normalDefense);
    // End Turn and Sleep live in the Cards header; reset the local Defense counter
    // when either action is invoked, including when Combat is collapsed.
    useEffect(() => {
        setCurrentDefense(normalDefense);
    }, [defenseResetToken, normalDefense]);
    const [initiativeRoll, setInitiativeRoll] = useState(null);
    const [selectedWeaponKey, setSelectedWeaponKey] = useState("__unarmed__");
    const [attackMode, setAttackMode] = useState("unarmed");
    const [targetDefense, setTargetDefense] = useState("0");
    const [attackModifier, setAttackModifier] = useState("0");
    const [attackRangeYards, setAttackRangeYards] = useState("0");
    const [useAttackSpecialty, setUseAttackSpecialty] = useState(false);
    const [useAttackWillpower, setUseAttackWillpower] = useState(false);
    const [incomingDamage, setIncomingDamage] = useState("1");
    const [incomingType, setIncomingType] = useState("bashing");
    const [incomingSource, setIncomingSource] = useState("general");

    const formatLabel = (value) => value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const getValue = (parent, field) => activeCharacter?.[parent]?.[field] || 0;
    const meritsList = activeCharacter?.merits_list || [];
    const activeConditionNames = new Set((activeCharacter?.conditions || []).filter((entry) => entry?.status !== "expired")
        .filter((condition) => !condition?.target_type || condition.target_type === "character")
        .map((condition) => (condition?.name || "").toLowerCase()));
    const hasCondition = (name) => activeConditionNames.has(name.toLowerCase());
    const hasGiant = meritsList.some((m) => (m?.name || "") === "Giant");
    const hasSmallFramed = meritsList.some((m) => (m?.name || "") === "Small-Framed");
    const size = 5 + (hasGiant ? 1 : 0) + (hasSmallFramed ? -1 : 0);
    const currentWillpower = activeCharacter?.willpower || 0;
    const currentMana = activeCharacter?.mana || 0;

    const preciseForceEffect = (activeCharacter?.active_spells || []).find(
        (effect) => effect?.effect_key === "precise-force-prepared" && !isEffectExpired(effect, activeCharacter?.scene_tracker)
    );

    const preciseForcePrepared = !!preciseForceEffect;

    const equippedArmor =
        (activeCharacter?.inventory_items || []).find((it) => it?.type === "armor" && !!it?.equipped) || null;
    const equippedArmorName = equippedArmor?.name || null;

    const armorSourceParts = [];
    if (equippedArmorName) armorSourceParts.push(equippedArmorName);
    if (activeMageArmorName && ["Death", "Forces", "Matter", "Life"].includes(activeMageArmorName)) {
        armorSourceParts.push(`${activeMageArmorName} Armor`);
    }
    const armorSourceLabel = armorSourceParts.length > 0 ? armorSourceParts.join(" + ") : null;

    const arcanaWithArmor =
        activeCharacter?.character_type === "mage"
            ? Object.entries(activeCharacter?.arcana || {})
                .filter(([, dots]) => (dots || 0) >= 2)
                .map(([name]) => name)
            : [];
    const inventoryItems = activeCharacter?.inventory_items || [];

    const equippedWeaponOptions = inventoryItems
        .map((it, idx) => ({ it, idx }))
        .filter(({ it }) => it?.type === "weapon" && !!it?.equipped)
        .map(({ it, idx }) => ({
            key: String(idx),
            idx,
            label: it?.name || `Weapon ${idx + 1}`,
            weapon: it?.weapon || {},
        }));

    const selectedWeaponOption =
        selectedWeaponKey === "__unarmed__"
            ? null
            : equippedWeaponOptions.find((w) => w.key === selectedWeaponKey) || null;

    const selectedWeapon = selectedWeaponOption?.weapon || null;
    const selectedWeaponName = selectedWeaponOption?.label || "Unarmed";
    const selectedWeaponDamage = selectedWeapon?.damage ?? 0;
    const selectedWeaponIndex = selectedWeaponOption?.idx ?? -1;

    // Weapon Initiative applies only when that weapon is selected in Outgoing Attack.
    const selectedWeaponInitiativeModifier = selectedWeaponOption
        ? Number(selectedWeapon?.initiative) || 0
        : 0;

    const baseInitiativeModifier = Number(initiativeModifier) || 0;
    const effectiveInitiativeModifier = baseInitiativeModifier + selectedWeaponInitiativeModifier;

    const formatSignedMathTerm = (value) => {
        const numeric = Number(value) || 0;
        return numeric >= 0 ? `+ ${numeric}` : `- ${Math.abs(numeric)}`;
    };

    const formatNamedModifierTerm = (name, value) => {
        const numeric = Number(value) || 0;
        const sign = numeric >= 0 ? "+" : "-";
        return `+ ${name} ${sign}${Math.abs(numeric)}`;
    };

    const canThrowSelectedWeapon =
        !!selectedWeapon &&
        (selectedWeapon.kind ?? "melee") === "melee" &&
        (selectedWeapon.size ?? 1) === 1;

    const formatSignedModifier = (value) =>
        value >= 0 ? `+${value}` : `${value}`;

    const rollInitiative = () => {
        const die = Math.floor(Math.random() * 10) + 1;
        const total = die + effectiveInitiativeModifier;

        const hasSelectedWeaponInitiative =
            !!selectedWeaponOption && selectedWeaponInitiativeModifier !== 0;

        const rollBreakdown = [
            "d10",
            formatSignedMathTerm(baseInitiativeModifier),
            ...(hasSelectedWeaponInitiative
                ? [formatNamedModifierTerm(selectedWeaponName, selectedWeaponInitiativeModifier)]
                : []),
        ].join(" ");

        const resultBreakdown = [
            String(die),
            formatSignedMathTerm(baseInitiativeModifier),
            ...(hasSelectedWeaponInitiative
                ? [formatSignedMathTerm(selectedWeaponInitiativeModifier)]
                : []),
        ].join(" ");

        setInitiativeRoll({
            die,
            modifier: effectiveInitiativeModifier,
            baseModifier: baseInitiativeModifier,
            weaponModifier: selectedWeaponInitiativeModifier,
            weaponName: hasSelectedWeaponInitiative ? selectedWeaponName : null,
            total,
        });

        onAddRecentRoll?.({
            title: "Initiative",
            transcript: [
                `Roll: ${rollBreakdown}`,
                `Result: ${resultBreakdown} = ${total}`,
            ].join("\n"),
            outcome: `Current Initiative ${total}`,
        });
    };

    const handleToggleMageArmor = async (arcanum) => {
        if (!onUpdateCharacter || !activeCharacter) return;

        const isActive = activeMageArmorName === arcanum;

        // Clicking the active armor turns it off for free
        if (isActive) {
            await onUpdateCharacter({
                active_mage_armor: null,
            });
            return;
        }

        // Activating a new Mage Armor costs 1 Mana
        const currentMana = activeCharacter?.mana || 0;
        if (currentMana < 1) return;

        await onUpdateCharacter({
            mana: currentMana - 1,
            active_mage_armor: arcanum,
        });
    };

    useEffect(() => {
        setCurrentDefense(normalDefense);
        setInitiativeRoll(null);
        setSelectedWeaponKey("__unarmed__");
        setAttackMode("unarmed");
        setTargetDefense("0");
        setAttackModifier("0");
        setAttackRangeYards("0");
        setUseAttackSpecialty(false);
        setUseAttackWillpower(false);
        setIncomingDamage("1");
        setIncomingType("bashing");
        setIncomingSource("general");
    }, [activeCharacter?.id, normalDefense, initiativeModifier]);

    useEffect(() => {
        if (!selectedWeaponOption) {
            setAttackMode("unarmed");
            return;
        }

        const kind = selectedWeapon?.kind ?? "melee";
        if (kind === "ranged") {
            setAttackMode("ranged");
            return;
        }

        if (attackMode !== "thrown") {
            setAttackMode("melee");
        }
    }, [selectedWeaponOption, selectedWeaponKey]);

    useEffect(() => {
        setInitiativeRoll((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                modifier: effectiveInitiativeModifier,
                baseModifier: baseInitiativeModifier,
                weaponModifier: selectedWeaponInitiativeModifier,
                weaponName:
                    selectedWeaponOption && selectedWeaponInitiativeModifier !== 0
                        ? selectedWeaponName
                        : null,
                total: prev.die + effectiveInitiativeModifier,
            };
        });
    }, [
        effectiveInitiativeModifier,
        baseInitiativeModifier,
        selectedWeaponInitiativeModifier,
        selectedWeaponKey,
        selectedWeaponName,
    ]);

    const attackProfile = (() => {
        if (!selectedWeaponOption) {
            return {
                label: "Unarmed",
                attribute: "strength",
                skill: "brawl",
                appliesDefense: true,
                unequipAfterAttack: false,
            };
        }

        if ((selectedWeapon.kind ?? "melee") === "ranged") {
            return {
                label: selectedWeaponName,
                attribute: "dexterity",
                skill: "firearms",
                appliesDefense: false,
                unequipAfterAttack: false,
            };
        }

        if (attackMode === "thrown" && canThrowSelectedWeapon) {
            return {
                label: `${selectedWeaponName} (Thrown)`,
                attribute: "dexterity",
                skill: "athletics",
                appliesDefense: true,
                unequipAfterAttack: true,
            };
        }

        return {
            label: selectedWeaponName,
            attribute: "strength",
            skill: "weaponry",
            appliesDefense: true,
            unequipAfterAttack: false,
        };
    })();

    const matchingAttackSpecialties = (activeCharacter?.specialties || [])
        .map(normalizeSkillSpecialty)
        .filter((entry) =>
            entry.skill === attackProfile.skill && !!entry.name
        );

    const hasAttackSpecialty = matchingAttackSpecialties.length > 0;

    const attackSpecialtyBonus =
        hasAttackSpecialty && useAttackSpecialty ? 1 : 0;

    const attackWillpowerBonus =
        useAttackWillpower && currentWillpower > 0 ? 3 : 0;

    useEffect(() => {
        setUseAttackSpecialty(false);
    }, [attackProfile.skill]);

    const attackAttributeValue = getValue("attributes", attackProfile.attribute) || 0;
    const attackSkillValue = getValue("skills", attackProfile.skill) || 0;
    const attackUntrainedPenalty = attackSkillValue > 0 ? 0 : -1;
    const defensePenalty = attackProfile.appliesDefense ? (parseInt(targetDefense, 10) || 0) : 0;
    const modifierValue = parseInt(attackModifier, 10) || 0;
    const attackConditionPenalty =
        (hasCondition("Arm Wrack") ? -2 : 0) +
        (hasCondition("Exhausted") ? -2 : 0) +
        (hasCondition("Sick") ? -1 : 0);
    const attackConditionBreakdown = [
        hasCondition("Arm Wrack") ? "Arm Wrack -2" : null,
        hasCondition("Exhausted") ? "Exhausted -2" : null,
        hasCondition("Sick") ? "Sick -1" : null,
    ].filter(Boolean);

    const attackPool = Math.max(
        0,
        attackAttributeValue +
        attackSkillValue +
        attackUntrainedPenalty +
        attackSpecialtyBonus +
        attackWillpowerBonus +
        modifierValue +
        attackConditionPenalty +
        Math.min(0, Number(woundPenalty) || 0) -
        defensePenalty
    );

    return (
        <div className="space-y-3" data-testid="combat-tracker-card">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                <div className="min-w-0 flex-1 space-y-1" data-testid="combat-health-header">
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[10px]">
                        <span className="font-semibold uppercase tracking-wider text-zinc-400">Health</span>
                        <span className="font-mono text-zinc-300">{filledHealth}/{maxHealth}</span>
                        {isDeadTrack && <span className="font-semibold text-rose-400">DEAD</span>}
                        {activeCharacter?.combat_active && <span className="text-teal-400">Combat active</span>}
                    </div>
                    <HealthTrack
                        boxes={healthBoxes}
                        max={maxHealth}
                        onBoxClick={() => {}}
                        testIdPrefix="combat-health"
                        resistant={activeCharacter?.resistant_wounds || []}
                        onToggleResistance={onToggleResistantWound}
                    />
                </div>
                <Button type="button" size="sm" variant="outline" className="h-7 text-xs border-zinc-700" data-testid="combat-toggle-active"
                    onClick={async () => {
                        if (!onUpdateCharacter || !activeCharacter) return;
                        const starting = !activeCharacter.combat_active;
                        await onUpdateCharacter({
                            combat_active: starting,
                            ...(!starting ? {
                                active_spells: expireCombatEffects(activeCharacter.active_spells || []),
                                conditions: expireCombatEffects(activeCharacter.conditions || []),
                            } : {}),
                        }, starting ? {} : { kind: "combat" });
                    }}>
                    {activeCharacter?.combat_active ? "End Combat" : "Start Combat"}
                </Button>
            </div>
            <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                        type="button"
                        onClick={() => setCurrentDefense((prev) => Math.max(0, prev - 1))}
                        className="rounded-sm border p-2 text-left transition-all bg-zinc-900/50 border-zinc-800 hover:border-zinc-600"
                        data-testid="combat-card-defense-btn"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Defense</span>
                            <span className="font-mono text-teal-400">{currentDefense}</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={async () => {
                            if (!onTriggerDiceRoll || currentDefense <= 0) return;
                            onTriggerDiceRoll({
                                pool: currentDefense * 2,
                                environmentContext: { physical: true, defenseBased: true },
                                label: `Dodge (${currentDefense} Defense × 2)`,
                                dicePoolBreakdown: `Dodge ${currentDefense} × 2`,
                                exceptional_target: 5,
                                again: preciseForcePrepared ? 9 : 10,
                            });
                            if (
                                preciseForcePrepared &&
                                preciseForceEffect?.id &&
                                typeof onUpdateCharacter === "function"
                            ) {
                                await onUpdateCharacter({
                                    active_spells: (activeCharacter?.active_spells || []).filter(
                                        (effect) => effect.id !== preciseForceEffect.id
                                    ),
                                });
                            }
                        }}
                        disabled={currentDefense <= 0}
                        className="rounded-sm border p-2 text-left transition-all bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed"
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
                        className="rounded-sm border p-2 text-left transition-all bg-zinc-900/50 border-zinc-800 hover:border-zinc-600"
                        data-testid="combat-card-initiative-btn"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Initiative</span>
                            <span className="font-mono text-teal-400">{effectiveInitiativeModifier}</span>
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-sm border p-2 bg-zinc-900/30 border-zinc-800">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Size</span>
                            <span className="font-mono text-teal-400">{size}</span>
                        </div>
                    </div>

                    <div className="rounded-sm border p-2 bg-zinc-900/30 border-zinc-800">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Speed</span>
                            <span className="font-mono text-teal-400">{speed}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setInitiativeRoll(null)}
                        className="rounded-sm border p-2 text-left transition-all bg-zinc-900/30 border-zinc-800 hover:border-zinc-600"
                        data-testid="combat-card-current-initiative-btn"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Current Initiative</span>
                            <span className="font-mono text-teal-400">{initiativeRoll?.total ?? ""}</span>
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-sm border p-2 bg-zinc-900/30 border-zinc-800">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">
                                {armorSourceLabel ? `Armor (${armorSourceLabel})` : "Armor"}
                            </span>
                            <span className="font-mono text-teal-400">{armorGeneral}/{armorBallistic}</span>
                        </div>
                    </div>

                    <div className="rounded-sm border p-2 bg-zinc-900/30 border-zinc-800">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Willpower</span>
                            <span className="font-mono text-teal-400">{currentWillpower}</span>
                        </div>
                    </div>

                    <div className="rounded-sm border p-2 bg-zinc-900/30 border-zinc-800">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Mana</span>
                            <span className="font-mono text-teal-400">{currentMana}</span>
                        </div>
                    </div>
                </div>

                {activeCharacter?.character_type === "mage" && arcanaWithArmor.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {arcanaWithArmor.map((a) => {
                            const isActive = activeMageArmorName === a;
                            return (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => handleToggleMageArmor(a)}
                                    disabled={!isActive && (activeCharacter?.mana || 0) < 1}
                                    className={`px-2.5 py-1 text-xs rounded border transition-all ${
                                        isActive
                                            ? "bg-violet-600/40 border-violet-500 text-violet-200 shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                                            : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                                    data-testid={`combat-card-mage-armor-${a.toLowerCase()}`}
                                >
                                    {a} Armor
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <div className="rounded-sm border p-3 bg-zinc-900/30 border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-300">
                        <Zap className="w-4 h-4" />
                        Outgoing Attack
                    </div>

                    <div className="space-y-2">
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Weapon</label>
                            <Select value={selectedWeaponKey} onValueChange={setSelectedWeaponKey}>
                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="__unarmed__" className="text-zinc-200 text-xs">
                                        Unarmed
                                    </SelectItem>
                                    {equippedWeaponOptions.map((option) => (
                                        <SelectItem key={option.key} value={option.key} className="text-zinc-200 text-xs">
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedWeaponOption && canThrowSelectedWeapon && (
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Use As</label>
                                <Select value={attackMode} onValueChange={setAttackMode}>
                                    <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="melee" className="text-zinc-200 text-xs">
                                            Melee
                                        </SelectItem>
                                        <SelectItem value="thrown" className="text-zinc-200 text-xs">
                                            Thrown
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="rounded-sm border px-3 py-2 bg-zinc-950/50 border-zinc-800 text-[10px] text-zinc-500">
                            <div>
                                {formatLabel(attackProfile.attribute)} {attackAttributeValue}
                                {" + "}
                                {formatLabel(attackProfile.skill)} {attackSkillValue}
                                {attackUntrainedPenalty !== 0 ? ` + Untrained ${attackUntrainedPenalty}` : ""}
                                {attackSpecialtyBonus > 0 ? ` + Specialty ${attackSpecialtyBonus}` : ""}
                                {attackWillpowerBonus > 0 ? ` + Willpower ${attackWillpowerBonus}` : ""}
                                {modifierValue !== 0 ? ` + Modifier ${modifierValue}` : ""}
                                {attackConditionBreakdown.length > 0 ? ` ${attackConditionBreakdown.map((entry) => `+ ${entry}`).join(" ")}` : ""}
                                {attackProfile.appliesDefense ? ` - Defense ${defensePenalty}` : ""}
                            </div>
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
                                className="input-geist h-7 text-xs"
                                data-testid="combat-card-target-defense"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Modifier</label>
                            <Input
                                type="number"
                                value={attackModifier}
                                onChange={(e) => setAttackModifier(e.target.value)}
                                className="input-geist h-7 text-xs"
                                data-testid="combat-card-attack-modifier"
                            />
                        </div>
                    </div>
                    {(attackProfile.skill === 'firearms' || attackProfile.unequipAfterAttack) && (
                         <label className="block text-[10px] text-zinc-500 mt-2">Attack distance (yards) — for Blizzard visibility
                             <Input type="number" min={0} max={1000} value={attackRangeYards}
                                 onChange={(event) => setAttackRangeYards(String(Math.max(0, Math.min(1000, Number(event.target.value)||0))))}
                                 className="input-geist h-7 text-xs mt-1" data-testid="combat-card-attack-range" />
                         </label>
                     )}

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!hasAttackSpecialty}
                            aria-pressed={hasAttackSpecialty && useAttackSpecialty}
                            onClick={() => setUseAttackSpecialty((current) => !current)}
                            title={
                                hasAttackSpecialty
                                    ? `Available: ${matchingAttackSpecialties.map((entry) => entry.name).join(", ")}`
                                    : `No Specialty in ${formatLabel(attackProfile.skill)}`
                            }
                            data-testid="combat-card-attack-specialty"
                            className={`h-8 text-xs ${
                                hasAttackSpecialty && useAttackSpecialty
                                    ? "border-teal-500 bg-teal-900/40 text-teal-200"
                                    : "border-zinc-700 bg-zinc-900/40 text-zinc-400"
                            } disabled:cursor-not-allowed disabled:opacity-40`}
                        >
                            Specialty +1
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={currentWillpower < 1 || !onUpdateCharacter}
                            aria-pressed={attackWillpowerBonus > 0}
                            onClick={() => setUseAttackWillpower((current) => !current)}
                            title="Spend 1 Willpower when rolling for +3 dice"
                            data-testid="combat-card-attack-willpower"
                            className={`h-8 text-xs ${
                                attackWillpowerBonus > 0
                                    ? "border-amber-500 bg-amber-900/40 text-amber-200"
                                    : "border-zinc-700 bg-zinc-900/40 text-zinc-400"
                            } disabled:cursor-not-allowed disabled:opacity-40`}
                        >
                            Willpower +3
                        </Button>
                    </div>

                    <div className="flex items-center justify-between rounded-sm border px-3 py-2 bg-zinc-950/50 border-zinc-800">
                        <span className="text-zinc-500 text-xs">Pool</span>
                        <span className="font-mono text-amber-300 text-sm">{attackPool}</span>
                    </div>

                    <Button
                        size="sm"
                        className="w-full btn-secondary text-xs h-7"
                        onClick={async () => {
                            if (!onTriggerDiceRoll) return;

                            const spendAttackWillpower = attackWillpowerBonus > 0;

                            const attackUpdates = {};

                            if (spendAttackWillpower) {
                                if (currentWillpower < 1 || !onUpdateCharacter) return;
                                attackUpdates.willpower = currentWillpower - 1;
                            }

                            const isThrownAttack =
                                attackProfile.unequipAfterAttack &&
                                selectedWeaponIndex >= 0;

                            if (isThrownAttack && onUpdateCharacter) {
                                attackUpdates.inventory_items = inventoryItems.map(
                                    (item, idx) =>
                                        idx === selectedWeaponIndex
                                            ? { ...item, equipped: false }
                                            : item
                                );
                            }

                            const breakdown = [
                                `${formatLabel(attackProfile.attribute)} ${attackAttributeValue}`,
                                `+ ${formatLabel(attackProfile.skill)} ${attackSkillValue}`,
                                ...(attackUntrainedPenalty !== 0
                                    ? [`+ Untrained ${attackUntrainedPenalty}`]
                                    : []),
                                ...(attackSpecialtyBonus > 0
                                    ? [`+ Specialty ${attackSpecialtyBonus}`]
                                    : []),
                                ...(attackWillpowerBonus > 0
                                    ? [`+ Willpower ${attackWillpowerBonus}`]
                                    : []),
                                `+ Modifier ${modifierValue}`,
                                ...attackConditionBreakdown.map((entry) => `+ ${entry}`),
                                ...(woundPenalty < 0 ? [`+ Wound Penalty ${woundPenalty}`] : []),
                                `- Target Defense ${defensePenalty}`,
                            ].join(" ");

                            onTriggerDiceRoll({
                                pool: attackPool <= 0 ? 1 : attackPool,
                                chance: attackPool <= 0,
                                label: `${formatLabel(attackProfile.attribute)} + ${formatLabel(attackProfile.skill)} Attack`,
                                dicePoolBreakdown: breakdown,
                                isAttack: true,
                                environmentContext: { physical: true, dexterity: attackProfile.attribute === 'dexterity',
                                    ranged: attackProfile.skill === 'firearms' || attackProfile.unequipAfterAttack,
                                    distanceYards: Math.max(0, Number(attackRangeYards) || 0) },
                                weaponDamage: Math.max(0, Number(selectedWeaponDamage) || 0),
                                weaponDamageType: selectedWeaponOption
                                    ? (selectedWeapon?.damage_type || "lethal")
                                    : "bashing",
                                hasWeapon: !!selectedWeaponOption,
                                exceptional_target: 5,
                            });

                            setUseAttackWillpower(false);

                            if (Object.keys(attackUpdates).length > 0 && onUpdateCharacter) {
                                await onUpdateCharacter(attackUpdates);
                            }

                            if (isThrownAttack) {
                                setSelectedWeaponKey("__unarmed__");
                                setAttackMode("unarmed");
                            }
                        }}
                        data-testid="combat-card-outgoing-attack-btn"
                    >
                        Roll Attack
                    </Button>
                </div>

                <div className="rounded-sm border p-3 bg-zinc-900/30 border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-rose-300">
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
                                className="input-geist h-7 text-xs"
                                data-testid="combat-card-incoming-damage"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Type</label>
                            <Select value={incomingType} onValueChange={setIncomingType}>
                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    {["bashing", "lethal", "aggravated"].map((value) => (
                                        <SelectItem key={value} value={value} className="text-zinc-200 text-xs">
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
                            <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem value="general" className="text-zinc-200 text-xs">Mundane / General</SelectItem>
                                <SelectItem value="ballistic" className="text-zinc-200 text-xs">Ballistic</SelectItem>
                                <SelectItem value="supernatural" className="text-zinc-200 text-xs">Supernatural</SelectItem>
                                <SelectItem value="spirit" className="text-zinc-200 text-xs">Spirit / Ephemeral</SelectItem>
                                <SelectItem value="energy" className="text-zinc-200 text-xs">Energy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        size="sm"
                        className="w-full btn-secondary text-xs h-7"
                        onClick={() => onApplyIncomingDamage?.({
                            amount: Math.max(0, parseInt(incomingDamage, 10) || 0),
                            damageType: incomingType,
                            sourceProfile: incomingSource,
                        })}
                        data-testid="combat-card-apply-damage-btn"
                    >
                        Apply Damage
                    </Button>
                <div className="space-y-2 border-t border-zinc-800 pt-2">
                    {getNaturalHealingLabel(healthBoxes, activeCharacter?.natural_healing, activeCharacter?.scene_tracker) && (
                        <p className="text-[10px] text-zinc-400" data-testid="natural-healing-cards">
                            {getNaturalHealingLabel(healthBoxes, activeCharacter?.natural_healing, activeCharacter?.scene_tracker)}
                        </p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider" title="Storyteller correction, including Resistant wounds">ADJUST (ST)</span>

                        <Button
                            type="button"
                            variant="outline"
                            className="h-6 px-2 text-[10px] bg-purple-900/50 border-purple-500/50 text-purple-200 hover:bg-purple-900/70"
                            onClick={() => onHealHealthState?.("aggravated")}
                            data-testid="combat-heal-aggravated-btn"
                        >
                            ✱
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="h-6 px-2 text-[10px] bg-rose-900/50 border-rose-500/50 text-rose-300 hover:bg-rose-900/70"
                            onClick={() => onHealHealthState?.("lethal")}
                            data-testid="combat-heal-lethal-btn"
                        >
                            X
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="h-6 px-2 text-[10px] bg-amber-900/50 border-amber-500/50 text-amber-300 hover:bg-amber-900/70"
                            onClick={() => onHealHealthState?.("bashing")}
                            data-testid="combat-heal-bashing-btn"
                        >
                            /
                        </Button>

                        {isMage && (activeCharacter?.arcana?.Life || 0) >= 2 ? (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-6 px-2 text-[10px] bg-amber-900/30 border-amber-500/30 text-amber-300 hover:bg-amber-800/40"
                                    onClick={() => onPatternRestoration?.("bashing")}
                                    disabled={
                                        currentMana < 1 ||
                                        !hasHealableWound(healthBoxes, activeCharacter?.resistant_wounds, "bashing")
                                    }
                                    data-testid="combat-pattern-restoration-bashing-btn"
                                >
                                    Pattern Restoration / · 1 Mana
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-6 px-2 text-[10px] bg-rose-900/30 border-rose-500/30 text-rose-300 hover:bg-rose-800/40"
                                    onClick={() => onPatternRestoration?.("lethal")}
                                    disabled={
                                        currentMana < 2 ||
                                        !hasHealableWound(healthBoxes, activeCharacter?.resistant_wounds, "lethal")
                                    }
                                    data-testid="combat-pattern-restoration-lethal-btn"
                                >
                                    Pattern Restoration X · 2 Mana
                                </Button>
                            </>
                        ) : isMage ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="h-6 px-2 text-[10px] bg-violet-900/30 border-violet-500/30 text-violet-400 hover:bg-violet-800/40"
                                onClick={() => onPatternRestoration?.()}
                                disabled={patternRestorationDisabled}
                                data-testid="combat-pattern-restoration-btn"
                            >
                                Pattern Restoration · 3 Mana
                            </Button>
                        ) : null}
                    </div>

                    {woundPenalty < 0 && (
                        <p className="text-[10px] text-rose-400">
                            Wound Penalty {woundPenalty}
                        </p>
                    )}
                </div>
            </div>
            </div>


        </div>
    );
};
