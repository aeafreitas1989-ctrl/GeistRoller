import { getChannelManaPatch } from './mageManaActions';
const base = {
    character_type: 'mage', gnosis: 3, mana: 4, tass_other: 3,
    scene_tracker: { date: '2025-12-05', time: '12:00' },
    oblation_hallow: [],
};

describe('Channel Mana source accounting', () => {
    test('successful spell transfers from non-edible Tass without creating more', () => {
        const result = getChannelManaPatch(base, { source: 'tass', amount: 9, spellPotency: 3, manaPerTurn: 2, manaCost: 1, succeeded: true });
        expect(result.gained).toBe(2);
        expect(result.patch).toEqual({ mana: 5, tass_other: 1 });
    });
    test('failed casting spends required Mana but does not transfer', () => {
        const result = getChannelManaPatch(base, { source: 'tass', amount: 3, spellPotency: 3, manaPerTurn: 3, manaCost: 1, succeeded: false });
        expect(result).toEqual({ patch: { mana: 3 }, gained: 0, spent: 1 });
    });
    test('Hallow is capped by unharvested Mana from the source', () => {
        const character = { ...base, mana: 2, oblation_hallow: [{ at: '2025-12-05T10:00:00.000Z', gained: 2 }] };
        const result = getChannelManaPatch(character, { source: 'hallow', hallowRating: 3, amount: 5, spellPotency: 5, manaPerTurn: 3, manaCost: 0, succeeded: true });
        expect(result.gained).toBe(1);
        expect(result.patch.mana).toBe(3);
        expect(result.patch.oblation_hallow).toHaveLength(2);
    });
    test('extra Reach permits transfer above the normal per-turn limit', () => {
        const result = getChannelManaPatch(base, { source: 'tass', amount: 4, spellPotency: 4, manaPerTurn: 1, ignorePerTurn: true, manaCost: 0, succeeded: true });
        expect(result.gained).toBe(3);
    });
    test('cannot transfer absent source or with insufficient casting cost', () => {
        expect(getChannelManaPatch({ ...base, tass_other: 0 }, { source: 'tass', amount: 1, spellPotency: 5, manaPerTurn: 5, succeeded: true }).gained).toBe(0);
        expect(getChannelManaPatch(base, { source: 'tass', manaCost: 5, succeeded: true })).toBe(null);
    });
});
