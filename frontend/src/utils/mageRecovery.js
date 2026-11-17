// In-game, not wall-clock, recovery for Mage 2e Scouring and Oblations.
import { getGameTimestamp } from './effectDuration';

const DAY = 86400000;
export const scourDailyLimit = (gnosis) => {
    const value = Number(gnosis) || 1;
    return value >= 10 ? 4 : value >= 7 ? 3 : value >= 5 ? 2 : 1;
};
export const recentScourings = (records, tracker) => {
    const now = getGameTimestamp(tracker);
    if (now === null) return null;
    return (Array.isArray(records) ? records : []).filter((entry) => {
        const at = Date.parse(entry?.at);
        // Future records remain counted after the clock is rewound.
        return Number.isFinite(at) && at > now - DAY;
    });
};
export const remainingScourings = (records, gnosis, tracker) => {
    const recent = recentScourings(records, tracker);
    return recent === null ? null : Math.max(0, scourDailyLimit(gnosis) - recent.length);
};
export const registerScouring = (records, gnosis, tracker, attribute = null) => {
    const recent = recentScourings(records, tracker);
    if (!recent || recent.length >= scourDailyLimit(gnosis)) return null;
    const at = getGameTimestamp(tracker);
    return [...recent, {
        at: new Date(at).toISOString(),
        attribute: attribute || null,
        expires_at: attribute ? new Date(at + DAY).toISOString() : null,
    }];
};
// No recovery from rewinding the game clock. Only previously recorded
// Attribute reductions can be restored automatically.
export const restoreScouredAttributes = (character, nextTracker) => {
    const now = getGameTimestamp(nextTracker);
    if (now === null) return {};
    const records = Array.isArray(character?.pattern_scouring) ? character.pattern_scouring : [];
    const scoured = { ...(character?.scoured_attributes || {}) };
    const attributes = { ...(character?.attributes || {}) };
    let changed = false;
    const remaining = [];
    for (const entry of records) {
        const expiry = entry?.expires_at ? Date.parse(entry.expires_at) : NaN;
        if (entry?.attribute && Number.isFinite(expiry) && now >= expiry) {
            const attr = entry.attribute;
            if (Number(scoured[attr]) > 0) {
                attributes[attr] = (Number(attributes[attr]) || 0) + 1;
                scoured[attr] -= 1;
                if (scoured[attr] <= 0) delete scoured[attr];
            }
            changed = true;
        } else {
            remaining.push(entry);
        }
    }
    return changed ? {
        attributes,
        scoured_attributes: scoured,
        pattern_scouring: remaining,
    } : {};
};
export const hallowManaRemaining = (history, rating, tracker) => {
    const now = getGameTimestamp(tracker);
    if (now === null) return null;
    const entries = Array.isArray(history) ? history : [];
    const used = entries.reduce((sum, item) => {
        const at = Date.parse(item?.at);
        return Number.isFinite(at) && at > now - DAY ? sum + Math.max(0, Number(item?.gained) || 0) : sum;
    }, 0);
    return Math.max(0, (Number(rating) || 0) - used);
};
export const recordHallowMana = (history, gained, tracker) => {
    const now = getGameTimestamp(tracker);
    if (now === null) return Array.isArray(history) ? history : [];
    const previous = (Array.isArray(history) ? history : []).filter((entry) => {
        const at = Date.parse(entry?.at);
        return Number.isFinite(at) && at > now - DAY;
    });
    return gained > 0 ? [...previous, { at: new Date(now).toISOString(), gained }] : previous;
};
