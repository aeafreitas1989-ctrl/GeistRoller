// Shared inventory quantities for mundane consumables and physical Tass.
// Tass stored as Equipment is non-edible; Tass in Consumables is edible.
const units = (n) => Math.max(0, Math.floor(Number(n) || 0));
const normalize = (value) => String(value || '').toLowerCase().trim().replace(/\s+/g, ' ');
const edibleNames = new Set(['tass', 'edible tass', 'tass (edible)']);
const otherNames = new Set(['tass', 'non-edible tass', 'other tass', 'tass (non-edible)']);

export const isNonEdibleTass = (item) => item?.type === 'equipment' && otherNames.has(normalize(item?.name));
export const isEdibleTass = (item) => item?.type === 'consumable' && edibleNames.has(normalize(item?.name));

const isStock = (item, stock) => stock === 'other' ? isNonEdibleTass(item) : isEdibleTass(item);

export const getInventoryTassQuantity = (items, stock) => (Array.isArray(items) ? items : [])
    .filter((item) => isStock(item, stock))
    .reduce((total, item) => total + units(item.quantity), 0);

export const consumeInventoryTass = (items, stock, amount) => {
    let remaining = units(amount);
    const next = (Array.isArray(items) ? items : []).map((item) => {
        if (!isStock(item, stock) || remaining <= 0) return item;
        const used = Math.min(units(item.quantity), remaining);
        remaining -= used;
        return used ? { ...item, quantity: units(item.quantity) - used } : item;
    });
    return { items: next, consumed: units(amount) - remaining };
};

// Convert existing character-level Tass counters to ordinary inventory once.
export const migrateLegacyTass = (items, edible, other) => {
    const next = Array.isArray(items) ? [...items] : [];
    const add = (stock, n) => {
        if (n <= 0) return;
        const index = next.findIndex((item) => isStock(item, stock));
        if (index >= 0) {
            next[index] = { ...next[index], quantity: units(next[index].quantity) + n };
        } else if (stock === 'edible') {
            next.push({ type: 'consumable', name: 'Edible Tass', availability: 0, quantity: n, equipped: false });
        } else {
            next.push({ type: 'equipment', name: 'Tass', availability: 0, quantity: n, equipped: false,
                equipment: { bonus: 0, durability: 0, size: 1, structure: 1, effect: 'Non-edible Tass' } });
        }
    };
    add('edible', units(edible));
    add('other', units(other));
    return next;
};
