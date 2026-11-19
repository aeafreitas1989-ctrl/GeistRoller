import { makeQuickDiceRequest, normalizeQuickDicePool, normalizeQuickDiceAgain, makeQuickDiceHistoryEntry } from './quickDicePool';

test('standalone dice count is clamped to the backend-supported 0–100 range', () => {
    expect(normalizeQuickDicePool(-4)).toBe(0);
    expect(normalizeQuickDicePool(4.9)).toBe(4);
    expect(normalizeQuickDicePool(101)).toBe(100);
    expect(normalizeQuickDicePool('bad')).toBe(1);
});

test('8!, 9!, 10! select exactly the backend explosion threshold', () => {
    for (const again of [8, 9, 10]) {
        expect(normalizeQuickDiceAgain(again)).toBe(again);
        expect(makeQuickDiceRequest(1, again)).toEqual({
            pool: 1, again, rote: false, chance: false, exceptional_target: 5,
        });
    }
    expect(normalizeQuickDiceAgain(7)).toBe(10);
    expect(normalizeQuickDiceAgain(11)).toBe(10);
});

test('zero dice remains a chance die independently of selected again option', () => {
    expect(makeQuickDiceRequest(0, 8)).toEqual({
        pool: 0, again: 8, rote: false, chance: true, exceptional_target: 5,
    });
});

test('successful quick dice results format as Last Rolls entries', () => {
    const result = { dice: [8, 10, 4, 9], successes: 3, description: '3 successes' };
    expect(makeQuickDiceHistoryEntry(result, 3, 9)).toEqual({
        title: 'Quick Roll — 3d10 · 9!',
        transcript: 'Dice: 8, 10, 4, 9\nResult: 3 successes',
        outcome: '3 successes',
    });
    expect(makeQuickDiceHistoryEntry({ dice: [1], successes: 0, description: 'Dramatic Failure.' }, 0, 8)).toEqual({
        title: 'Quick Roll — Chance die',
        transcript: 'Dice: 1\nResult: Dramatic Failure.',
        outcome: 'Dramatic Failure.',
    });
});

test('quick dice history rejects incomplete dice API responses', () => {
    expect(() => makeQuickDiceHistoryEntry({ successes: 1 }, 1, 10)).toThrow(/dice faces/);
});
