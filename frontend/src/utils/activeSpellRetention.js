import { isEffectExpired } from './effectDuration';
export const retainActiveSpells = (effects, tracker) => {
    if (!Array.isArray(effects)) return [];
    const kept = effects.filter(effect => !isEffectExpired(effect, tracker));
    return kept.length === effects.length ? effects : kept;
};
