import { getInventoryTassQuantity, isEdibleTass, isNonEdibleTass, migrateLegacyTass, consumeInventoryTass } from './inventoryResources';
import { getChannelManaPatch } from './mageManaActions';

describe('inventory Tass and consumable quantities', () => {
    const items = [
        { type: 'equipment', name: 'Tass', quantity: 3 },
        { type: 'consumable', name: 'Edible Tass', quantity: 2 },
        { type: 'consumable', name: 'Healing Potion', quantity: 7 },
    ];
    test('non-edible Tass belongs to Equipment, edible Tass to Consumables', () => {
        expect(isNonEdibleTass(items[0])).toBe(true);
        expect(isEdibleTass(items[1])).toBe(true);
        expect(isEdibleTass(items[0])).toBe(false);
        expect(getInventoryTassQuantity(items, 'other')).toBe(3);
        expect(getInventoryTassQuantity(items, 'edible')).toBe(2);
    });
    test('spending cannot go below zero or consume the other kind of Tass', () => {
        const spent = consumeInventoryTass(items, 'other', 4);
        expect(spent.consumed).toBe(3);
        expect(spent.items[0].quantity).toBe(0);
        expect(spent.items[1].quantity).toBe(2);
        expect(items[0].quantity).toBe(3);
        const edible = consumeInventoryTass(items, 'edible', 1);
        expect(edible.items[1].quantity).toBe(1);
        expect(edible.items[2].quantity).toBe(7);
    });
    test('Channel Mana spends physical inventory Tass and updates Mana', () => {
        const character = { gnosis: 3, mana: 2, tass_other: 0, inventory_items: items, scene_tracker: {} };
        const outcome = getChannelManaPatch(character, { source: 'tass', amount: 3, spellPotency: 3, manaPerTurn: 2, manaCost: 0, succeeded: true });
        expect(outcome.gained).toBe(2);
        expect(outcome.patch.mana).toBe(4);
        expect(outcome.patch.inventory_items[0].quantity).toBe(1);
        expect(outcome.patch.inventory_items[1].quantity).toBe(2);
    });
    test('legacy character counters migrate to existing inventory without loss', () => {
        const updated = migrateLegacyTass(items, 4, 5);
        expect(updated).toHaveLength(3);
        expect(getInventoryTassQuantity(updated, 'edible')).toBe(6);
        expect(getInventoryTassQuantity(updated, 'other')).toBe(8);
        const fresh = migrateLegacyTass([], 2, 3);
        expect(fresh.map(item => item.type)).toEqual(['consumable', 'equipment']);
    });
});
