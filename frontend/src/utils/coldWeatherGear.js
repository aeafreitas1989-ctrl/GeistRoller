// Inventory classification for future environmental-exposure rules.
// The equipped flag means the character is wearing the gear, not just carrying it.
export const isColdWeatherGearEquipped = (items = []) =>
    Array.isArray(items) && items.some((item) =>
        item?.type === 'equipment' &&
        item?.equipped === true &&
        (item?.equipment?.protection === 'cold_weather' ||
            String(item?.name || '').trim().toLowerCase() === 'cold weather gear')
    );
