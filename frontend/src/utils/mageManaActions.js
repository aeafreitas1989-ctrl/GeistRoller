import { GNOSIS_TABLE } from '../data/character-data';
import { hallowManaRemaining, recordHallowMana } from './mageRecovery';

const integer = (value) => Math.max(0, Math.floor(Number(value) || 0));

// A successful Channel Mana spell transfers Potency Mana from a real source.
// The per-turn cap and available source Mana apply unless Reach explicitly changes them.
// Do not create Mana or Tass when the source is empty.
export const getChannelManaPatch = (character, request) => {
    if (!character || !request || !['hallow', 'tass'].includes(request.source)) return null;
    const gnosis = integer(character.gnosis) || 1;
    const maxMana = (GNOSIS_TABLE[gnosis] || GNOSIS_TABLE[1]).maxMana;
    const spent = integer(request.manaCost);
    const before = integer(character.mana);
    if (spent > before) return null;
    const afterCost = before - spent;
    const perTurn = request.ignorePerTurn ? Number.MAX_SAFE_INTEGER : Math.max(1, integer(request.manaPerTurn));
    const potency = integer(request.spellPotency);
    const amount = integer(request.amount);
    const sourceAvailable = request.source === 'tass'
        ? integer(character.tass_other)
        : (hallowManaRemaining(character.oblation_hallow, integer(request.hallowRating), character.scene_tracker) ?? 0);
    const gained = request.succeeded
        ? Math.max(0, Math.min(amount, potency, perTurn, sourceAvailable, maxMana - afterCost))
        : 0;
    const patch = { mana: afterCost + gained };
    if (request.source === 'tass' && gained > 0) patch.tass_other = integer(character.tass_other) - gained;
    if (request.source === 'hallow' && gained > 0) patch.oblation_hallow = recordHallowMana(
        character.oblation_hallow, gained, character.scene_tracker
    );
    return { patch, gained, spent };
};
