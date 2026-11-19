// Standalone dice pool using the app's existing CofD dice endpoint.
// Zero dice means one chance die: only 10 succeeds and 1 is a dramatic failure.
export const normalizeQuickDicePool = (value) => {
    if (value === '') return 0;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 1;
    return Math.max(0, Math.min(100, Math.trunc(numeric)));
};

export const normalizeQuickDiceAgain = (value) => {
    const numeric = Number(value);
    return [8, 9, 10].includes(numeric) ? numeric : 10;
};

export const makeQuickDiceRequest = (value, again = 10) => {
    const pool = normalizeQuickDicePool(value);
    return { pool, again: normalizeQuickDiceAgain(again), rote: false, chance: pool === 0, exceptional_target: 5 };
};
