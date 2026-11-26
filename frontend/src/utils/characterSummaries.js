import { isStaleCharacterSnapshot } from './characterUpdateQueue';

export const toCharacterSummary = (character) => ({
    id: character.id,
    name: character.name ?? 'New Sin-Eater',
    character_type: character.character_type ?? 'geist',
    updated_at: character.updated_at ?? '',
});

export const updateCharacterSummary = (list, snapshot) => {
    const next = toCharacterSummary(snapshot);
    let changed = false;
    const result = list.map(item => {
        if (item.id !== next.id || isStaleCharacterSnapshot(item, next)) return item;
        if (item.name === next.name && item.character_type === next.character_type && item.updated_at === next.updated_at) return item;
        changed = true;
        return next;
    });
    return changed ? result : list;
};
