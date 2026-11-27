export const withoutXPHistory = character => {
    if (!character || !Object.prototype.hasOwnProperty.call(character, 'xp_history')) return character;
    const {xp_history, ...rest} = character;
    return rest;
};
export const isCurrentXPHistory = (snapshot, character) => Boolean(snapshot?.id && character?.id &&
    snapshot.id === character.id && snapshot.updated_at && snapshot.updated_at === character.updated_at &&
    Array.isArray(snapshot.xp_history));
