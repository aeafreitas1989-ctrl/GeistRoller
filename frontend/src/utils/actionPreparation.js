// Shared, deterministic payment accounting for Geist Haunts and Mage spells.
// In combat, each installment consumes the character's Action and one turn;
// outside combat, total turns are included in the casting/activation summary.
export const requiredPaymentTurns = (amount, perTurn) => {
    const cost = Math.max(0, Math.floor(Number(amount) || 0));
    const limit = Math.max(1, Math.floor(Number(perTurn) || 1));
    return Math.max(1, Math.ceil(cost / limit));
};

export const newPreparation = (kind, signature, total, requiredTurns = 1) => ({
    kind, signature, total: Math.max(0, Math.floor(Number(total) || 0)),
    paid: 0, turns: 0, requiredTurns: Math.max(1, Math.floor(Number(requiredTurns) || 1)),
});

export const nextInstallment = (preparation, perTurn) => {
    if (!preparation || !['haunt', 'spell'].includes(preparation.kind)) return null;
    const outstanding = Math.max(0, preparation.total - preparation.paid);
    if (!outstanding && preparation.turns >= (preparation.requiredTurns || 1)) return null;
    const amount = Math.min(outstanding, Math.max(1, Math.floor(Number(perTurn) || 1)));
    return { ...preparation, paid: preparation.paid + amount, turns: preparation.turns + 1, amount };
};

export const isPrepared = (preparation, kind, signature, total) =>
    preparation?.kind === kind && preparation.signature === signature &&
    preparation.total === Math.max(0, Math.floor(Number(total) || 0)) &&
    preparation.paid >= preparation.total && preparation.turns >= (preparation.requiredTurns || 1);

export const nextCombatPayment = (character, kind, signature, total, perTurn, resource, requiredTurns = 1) => {
    if (!character?.combat_active) return null;
    const ongoing = character.pending_activation;
    if (ongoing && (ongoing.kind !== kind || ongoing.signature !== signature || ongoing.total !== total || ongoing.requiredTurns !== requiredTurns)) return null;
    const active = ongoing || newPreparation(kind, signature, total, requiredTurns);
    const step = nextInstallment(active, perTurn);
    if (!step || (Number(character?.[resource]) || 0) < step.amount) return null;
    return {
        [resource]: (Number(character[resource]) || 0) - step.amount,
        pending_activation: { kind: step.kind, signature: step.signature, total: step.total, paid: step.paid, turns: step.turns, requiredTurns: step.requiredTurns },
    };
};

export const abandonPreparation = (character, kind) =>
    character?.pending_activation?.kind === kind ? { pending_activation: null } : null;
