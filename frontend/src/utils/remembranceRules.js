// Geist 2e Remembrance: spend 1 Plasm per dot, up to effective Rank (min Synergy/Rank).
// The resulting single Skill/Merit is enhanced for the scene, not all rolls.
export const effectiveGeistRank = character => Math.max(1,
    Math.min(Math.max(1, Number(character?.synergy) || 1), Math.max(1, Number(character?.geist_rank) || 1)));
export const activateRemembrance = (character, dots) => {
    const amount = Math.floor(Number(dots) || 0);
    if (!character || !['skill', 'merit'].includes(character.remembrance_trait_type) ||
        !character.remembrance_trait || !Number.isInteger(amount) || amount < 1 ||
        amount > effectiveGeistRank(character) || amount > (Number(character.plasm) || 0) ||
        character.remembrance_activation?.status === 'active') return null;
    return {
        plasm: (Number(character.plasm) || 0) - amount,
        temporary_plasm: Math.min((Number(character.plasm) || 0) - amount,
            Math.max(0, (Number(character.temporary_plasm) || 0) - amount)),
        remembrance_activation: {
            trait_type: character.remembrance_trait_type, trait: character.remembrance_trait,
            dots: amount, status: 'active', duration: 'Scene',
        },
    };
};
export const remembranceSkillBonus = (character, skill) => {
    const activation = character?.remembrance_activation;
    return activation?.status === 'active' && activation.trait_type === 'skill' &&
        activation.trait?.toLowerCase() === String(skill || '').toLowerCase()
        ? Math.max(0, Number(activation.dots) || 0) : 0;
};

export const completeRemembranceMilestone = (character, number, time = new Date().toISOString()) => {
    const index = Math.floor(Number(number));
    if (character?.character_type !== 'geist' || index < 1 || index > 3 ||
        character['remembrance_'+index+'_complete'] ||
        (index > 1 && !character['remembrance_'+(index-1)+'_complete'])) return null;
    const nextSynergy = (Number(character.synergy) || 1) + 1;
    const nextRank = (Number(character.geist_rank) || 3) + (index === 3 ? 1 : 0);
    if (nextSynergy > 10 || nextRank > 5) return null;
    return {
        ['remembrance_'+index+'_complete']: true,
        synergy: nextSynergy,
        geist_rank: nextRank,
        remembrance_history: [...(character.remembrance_history || []),
            { number:index, synergy_before:character.synergy, geist_rank_before:character.geist_rank, at:time }],
    };
};
