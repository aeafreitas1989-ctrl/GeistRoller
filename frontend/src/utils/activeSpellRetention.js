import { isEffectExpired, isCalendarEffect, reviewCalendarEffect, retainRecentCalendarEffects } from './effectDuration';
export const retainActiveSpells = (effects, tracker) => {
    if (!Array.isArray(effects)) return [];
    const kept=effects.map(e=>reviewCalendarEffect(e,tracker)).filter(e=>isCalendarEffect(e)||!isEffectExpired(e,tracker));
    const retained=retainRecentCalendarEffects(kept,tracker);
    return retained.length===effects.length && retained.every((e,i)=>e===effects[i])?effects:retained;
};
