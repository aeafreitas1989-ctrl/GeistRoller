import { isAbyssalCondition, ensureAbyssalTimer, lapseAbyssalConditions } from "./abyssalConditions";
import { getGameTimestamp, getEffectTimer, isEffectExpired } from './effectDuration';
import { isSceneDurationEffect } from './sceneLifecycle';
import { getRemainingWoundGroups } from './naturalHealing';

export const formatElapsedMinutes = (value) => {
    const minutes = Math.max(0, Math.ceil(value));
    const parts = [ [Math.floor(minutes / 1440), 'd'], [Math.floor(minutes % 1440 / 60), 'h'], [minutes % 60, 'min'] ];
    return parts.filter(([n]) => n > 0).map(([n, unit]) => n + unit).join(' ') || '0min';
};
export const remainingEffectLabel = (effect, tracker) => {
    const timer = getEffectTimer(effect, tracker);
    if (timer.kind === 'expired' || timer.kind === 'scene' || effect?.tracking_mode === 'turn') return timer.label;
    const now = getGameTimestamp(tracker), end = Date.parse(effect?.expires_at || '');
    if (now !== null && Number.isFinite(end) && end > now) return formatElapsedMinutes((end-now)/60000) + ' remaining';
    if (timer.label) return timer.label;
    return effect?.duration || (effect?.persistent ? 'Persistent — until resolved' : 'Until resolved / removed');
};
const nameOf = e => e?.name || e?.spell || 'Unnamed effect';
const identity = e => e?.id != null ? 'id:'+e.id : 'name:'+JSON.stringify([nameOf(e),e?.kind,e?.type,e?.group,e?.started_at,e?.expires_at]);
const effectType = (entry, collection) => collection === 'conditions'
    ? (entry?.type === 'tilt' || String(entry?.group || '').startsWith('tilt-') ? 'Tilt' : 'Condition')
    : (entry?.kind === 'spell' ? 'Spell' : 'Effect');
const entries = x => Array.isArray(x) ? x : [];
const woundLines = counts => ['bashing','lethal','aggravated'].filter(k => Number(counts?.[k]) > 0).map(k => ({name: String(counts[k])+' '+k[0].toUpperCase()+k.slice(1)+' damage'}));

// Pure calculation at the optimistic-write boundary, before expired entries are removed.
// Explicit dismissals, resolved Conditions and removed weather Tilts are not expirations.
export const prepareTimeTransition = (current, patch, options = {}) => {
    if (!options.kind && !['scene_tracker','active_spells','conditions'].some(field => Object.hasOwn(patch,field))) return {cleaned:{},summary:null};
    const before = current.scene_tracker || {}, after = patch.scene_tracker ?? before;
    const from = getGameTimestamp(before), to = getGameTimestamp(after);
    const forward = from !== null && to !== null && to > from;
    const expired = [], active = [], cleaned = {};
    for (const field of ['active_spells','conditions']) {
        const previous = entries(current[field]);
        const raw = entries(patch[field] ?? previous);
        const incoming = field === 'conditions' && current.character_type === 'mage' ? raw.map(e=>ensureAbyssalTimer(e,patch.wisdom ?? current.wisdom,before,after)) : raw;
        const lapsed = [];
        const previousActive = new Set(previous.filter(e => !isEffectExpired(e,before)).map(identity));
        const seenExpired = new Set();
        let retained = incoming.filter(e => {
            if (!isEffectExpired(e,after)) return true;
            const key = identity(e);
            if (field === 'conditions' && isAbyssalCondition(e)) lapsed.push(e);
            if (previousActive.has(key) && !seenExpired.has(key)) {
                expired.push({name:nameOf(e),type:effectType(e,field)}); seenExpired.add(key);
            }
            return false;
        });
        // The earlier memory patch may already strip scene-duration spells from the patch.
        if (options.kind === 'scene') {
            for (const e of previous) {
                const key = identity(e);
                if (previousActive.has(key) && isSceneDurationEffect(e) && !retained.some(x=>identity(x)===key) && !seenExpired.has(key)) {
                    expired.push({name:nameOf(e),type:effectType(e,field)}); seenExpired.add(key);
                }
            }
        }
        if (field === 'conditions' && current.character_type === 'mage' && lapsed.length) {
            const transition = lapseAbyssalConditions(retained,lapsed,current,patch);
            Object.assign(cleaned,transition);
            retained = transition.conditions;
        }
        if (retained.length !== incoming.length || Object.hasOwn(patch,field) || incoming.some((e,i)=>e!==raw[i])) cleaned[field] = retained;
        for (const e of retained) active.push({name:nameOf(e),type:effectType(e,field),remaining:remainingEffectLabel(e,after)});
    }
    const healing = options.healing || {};
    const healed = woundLines(healing.healedByType);
    if (!healed.length && healing.healed > 0) healed.push({name:healing.healed+' Health wound'+(healing.healed===1?'':'s')});
    const remaining = getRemainingWoundGroups(
        patch.health_boxes ?? healing.boxes ?? current.health_boxes ?? [],
        patch.natural_healing ?? healing.recovery ?? current.natural_healing,
        after,
    ).map(wound => ({
        name: wound.count+' '+wound.kind[0].toUpperCase()+wound.kind.slice(1),
        remaining: wound.reason || formatElapsedMinutes(wound.remainingMs/60000),
    }));
    const damage = woundLines(healing);
    const willpower = options.kind === 'sleep' ? Math.max(0, (Number(patch.willpower)||0)-(Number(current.willpower)||0)) : 0;
    const kind = options.kind || (forward ? 'clock' : 'expiry');
    const elapsed = kind === 'turn' ? '1 turn' : kind === 'scene' ? 'Scene ended' : kind === 'combat' ? 'Combat ended' : forward ? formatElapsedMinutes((to-from)/60000) : '—';
    const show = forward || expired.length > 0 || healed.length > 0 || damage.length > 0 || willpower > 0 || (['turn','scene','combat'].includes(kind) && active.length > 0);
    const dateChanged = before.date !== after.date;
    const clockLabel = tracker => getGameTimestamp(tracker) === null ? 'Clock unset' : (dateChanged ? tracker.date+' ' : '')+tracker.time;
    return {cleaned, summary: show ? {characterId:current.id, characterName:current.name, kind, from:clockLabel(before), to:clockLabel(after), elapsed, expired, healed, remaining, damage, willpower, active} : null};
};
