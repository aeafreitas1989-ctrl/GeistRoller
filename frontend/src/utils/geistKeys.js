// Source-specific Key IDs prevent a Doom on one Memento from blocking another.
export const getGeistKeySources = (character = {}) => {
    const result = [];
    if (character.innate_key) result.push({ name: character.innate_key, id: 'innate::' + character.innate_key, label: 'Innate' });
    if (character.geist_innate_key) result.push({ name: character.geist_innate_key, id: 'geist::' + character.geist_innate_key, label: 'Geist' });
    (Array.isArray(character.mementos) ? character.mementos : []).forEach((item, index) => {
        if (!item?.key) return;
        const id = item.id === undefined || item.id === null ? 'legacy-index-' + index : String(item.id);
        result.push({ name: item.key, id: 'memento::' + id, label: item.name || 'Memento', index });
    });
    return result;
};

export const getDoomedKeySources = (character = {}) => {
    const sources = getGeistKeySources(character);
    const result = {};
    (Array.isArray(character.conditions) ? character.conditions : []).forEach((condition) => {
        const conditionName = String(condition?.name || '');
        if (!conditionName.toLowerCase().startsWith('doomed') || condition?.status === 'expired') return;
        const origin = String(condition?.origin || conditionName);
        if (condition.key_source_id) { result[String(condition.key_source_id)] = origin; return; }
        // Existing legacy records have no source ID. Do not guess which item produced them.
        const keyName = String(condition.key_name || '');
        if (keyName) { result['legacy::' + keyName] = origin; return; }
        for (const source of sources) {
            if (conditionName.includes(source.name) || origin.includes(source.name))
                result['legacy::' + source.name] = origin;
        }
    });
    for (const source of sources) {
        const copies = sources.filter((other) => other.name === source.name);
        if (copies.every((item) => result[item.id] || result['legacy::' + item.name]))
            result[source.name] = result[source.id] || result['legacy::' + source.name] || 'All sources under Doom';
    }
    return result;
};

export const isKeySourceDoomed = (keySource, doomedSources = {}) =>
    Boolean(doomedSources[keySource.id] || doomedSources['legacy::' + keySource.name]);
