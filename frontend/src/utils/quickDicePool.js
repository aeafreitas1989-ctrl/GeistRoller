// A simple manual dice pool using the same backend rules as the main roller.
// Zero means a single chance die (10 succeeds; 1 is a dramatic failure).
export const normalizeQuickDicePool = (value) => {
    if (value === '') return 0;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 3;
    return Math.max(0, Math.min(100, Math.trunc(numeric)));
};

export const makeQuickDiceRequest = (value) => {
    const pool = normalizeQuickDicePool(value);
    return { pool, again: 10, rote: false, chance: pool === 0, exceptional_target: 5 };
};