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

/** Convert one manual roll to the normal Last Rolls entry format. */
export const makeQuickDiceHistoryEntry = (result, poolValue, againValue = 10) => {
    if (!result || !Array.isArray(result.dice)) {
        throw new Error('A successful dice roll must provide its dice faces');
    }
    const pool = normalizeQuickDicePool(poolValue);
    const again = normalizeQuickDiceAgain(againValue);
    const poolLabel = pool === 0 ? 'Chance die' : `${pool}d10 · ${again}!`;
    const outcome = String(result.description || `${Number(result.successes) || 0} successes`);
    return {
        title: `Quick Roll — ${poolLabel}`,
        transcript: `Dice: ${result.dice.join(', ')}\nResult: ${outcome}`,
        outcome,
    };
};
