import { isEffectExpired, startTimedEffect, getGameTimestamp } from './effectDuration';
const names = new Set(['abyssal backlash','abyssal imago','abyssal nimbus','paradox taint','paradox condition (pending st)','paradox condition (dramatic spellcasting failure)']);
const nameOf = e => String(e?.definition_key || e?.name || '').toLowerCase().trim();
export const isAbyssalTaint = e => nameOf(e) === 'abyssal taint' && (!e?.target_type || e.target_type === 'character');
export const isAbyssalCondition = e => !isAbyssalTaint(e) && (e?.paradox_condition === true || names.has(nameOf(e)) || String(e?.id || '').startsWith('paradox-')) && (!e?.target_type || e.target_type === 'character');
export const abyssalDuration = wisdom => Number(wisdom) >= 8 ? '1 month' : Number(wisdom) >= 4 ? '1 day' : Number(wisdom) >= 1 ? '1 scene' : '1 turn';
export const makeAbyssalTaint = () => ({ ...{"name":"Abyssal Taint","type":"condition","group":"condition","splat":"Mage — Paradox","persistent":true,"beat_type":"none","duration":"Permanent","origin":"Paradox","description":"The Abyss has entered the mage’s Pattern and is detectable in her Nimbus. Every spell she casts adds one Paradox die, even without exceeding free Reach.","effect":"The Abyss has entered the mage’s Pattern and is detectable in her Nimbus. Every spell she casts adds one Paradox die, even without exceeding free Reach.","resolution":"Scour the taint from the Pattern: suffer one resistant lethal wound, gain no Mana and no additional Arcane Beat.","source_citation":"Mage: The Awakening 2e, p. 116"}, status:'active' });
export const hasAbyssalTaint = (conditions, tracker) => (conditions || []).some(e => isAbyssalTaint(e) && !isEffectExpired(e,tracker));
export const startAbyssalCondition = (effect, wisdom, tracker) => {
    if (isAbyssalTaint(effect)) return {...effect, ...makeAbyssalTaint(), expires_at: null, tracking_mode: null, scene_duration: false};
    if (!isAbyssalCondition(effect) || effect.status === 'expired') return effect;
    const duration = abyssalDuration(wisdom);
    return startTimedEffect({...effect, paradox_condition:true, beat_type:'arcane', duration},tracker);
};
export const ensureAbyssalTimer = (e, wisdom, before, after) => {
    if (!isAbyssalCondition(e) || e.status === 'expired' || e.expires_at || e.tracking_mode === 'turn' || e.tracking_mode === 'scene') return e;
    const tracker = getGameTimestamp(before) !== null ? before : after;
    return startTimedEffect({...e, paradox_condition:true, beat_type:'arcane', duration:e.paradox_condition && e.duration ? e.duration : abyssalDuration(wisdom)},tracker);
};
export const lapseAbyssalConditions = (conditions, lapsed, character, patch) => {
    if (!lapsed.length || character.character_type !== 'mage') return {};
    const beats = Math.max(0, Number(patch.arcane_beats ?? character.arcane_beats) || 0) + lapsed.length;
    const xp = Math.max(0, Number(patch.arcane_experience ?? character.arcane_experience) || 0);
    return {conditions:conditions.some(isAbyssalTaint) ? conditions : [...conditions,makeAbyssalTaint()], arcane_beats:beats % 5, arcane_experience:xp + Math.floor(beats / 5), xp_reason:'Abyssal Condition lapsed: '+lapsed.map(e=>e.name).join(', ')};
};
