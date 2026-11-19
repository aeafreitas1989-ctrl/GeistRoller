import { makeQuickDiceRequest, normalizeQuickDicePool } from './quickDicePool';

test('manual roller clamps to the supported range', () => {
    expect(normalizeQuickDicePool(-4)).toBe(0);
    expect(normalizeQuickDicePool(4.9)).toBe(4);
    expect(normalizeQuickDicePool(101)).toBe(100);
    expect(normalizeQuickDicePool('bad')).toBe(3);
});

test('manual roller uses normal CofD 10-again at 8+ without a character modifier', () => {
    expect(makeQuickDiceRequest(7)).toEqual({
        pool: 7, again: 10, rote: false, chance: false, exceptional_target: 5,
    });
    expect(makeQuickDiceRequest(0)).toEqual({
        pool: 0, again: 10, rote: false, chance: true, exceptional_target: 5,
    });
});