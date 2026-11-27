import { reviewConditionExpiry, isPendingClockLapse } from './conditionExpiryReview';
import { isAbyssalCondition, ensureAbyssalTimer, lapseAbyssalConditions } from "./abyssalConditions";
import { getGameTimestamp, getEffectTimer, isEffectExpired, withGameClockCheckpoint, startTimedEffect, getEffectDateLabels, formatGameDateTime, getEffectTimestamp, getRawGameTimestamp, isCalendarEffect, isEffectNotStarted, isCalendarLapsed, reviewCalendarEffect, retainRecentCalendarEffects } from './effectDuration';
import { isSceneDurationEffect } from './sceneLifecycle';
import { getRemainingWoundGroups, getWoundHealingDeadlines } from './naturalHealing';

export const formatElapsedMinutes = (value) => {
    const minutes = Math.max(0, Math.ceil(value));
    const parts = [ [Math.floor(minutes / 1440), 'd'], [Math.floor(minutes % 1440 / 60), 'h'], [minutes % 60, 'min'] ];
    return parts.filter(([n]) => n > 0).map(([n, unit]) => n + unit).join(' ') || '0min';
};
export const remainingEffectLabel = (effect, tracker) => {
    const timer = getEffectTimer(effect, tracker);
    if (timer.kind === 'expired' || timer.kind === 'scene' || effect?.tracking_mode === 'turn') return timer.label;
    const now = getEffectTimestamp(effect,tracker), end = Date.parse(effect?.expires_at || '');
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
const isAbyssalTaintName = e => String(e?.definition_key||e?.name||'').trim().toLowerCase()==='abyssal taint';
const activationKey = e => e?.id != null ? 'id:'+e.id : JSON.stringify([e?.definition_key||nameOf(e),e?.type,e?.group,e?.target_type,e?.target_id,e?.origin]);
const stampIncoming = (incoming, previous, tracker) => {
    const old = new Map(previous.map(e=>[activationKey(e),e]));
    return incoming.map(e=>{
        if (!e || typeof e !== 'object' || e.status === 'expired') return e;
        const prior = old.get(activationKey(e));
        if (!prior) return startTimedEffect(e,tracker);
        // Weather Tilts are regenerated; do not lose their original start time.
        if (!e.started_at && prior.started_at) return {...e,started_at:prior.started_at};
        return e;
    });
};
const woundLines = counts => ['bashing','lethal','aggravated'].filter(k => Number(counts?.[k]) > 0).map(k => ({name: String(counts[k])+' '+k[0].toUpperCase()+k.slice(1)+' damage'}));

// Pure calculation at the optimistic-write boundary, before expired entries are removed.
// Explicit dismissals, resolved Conditions and removed weather Tilts are not expirations.
export const prepareTimeTransition = (current, patch, options = {}) => {
    if (!options.kind && !['scene_tracker','active_spells','conditions'].some(field => Object.hasOwn(patch,field))) return {cleaned:{},summary:null};
    const before = current.scene_tracker || {}, after = withGameClockCheckpoint(before,patch.scene_tracker ?? before);
    const from = getGameTimestamp(before), to = getGameTimestamp(after);
    const forward = from !== null && to !== null && to > from;
    const expired = [], active = [], cleaned = {};
    if (Object.hasOwn(patch,'scene_tracker')) cleaned.scene_tracker = after;
    for (const field of ['active_spells','conditions']) {
        const previous = entries(current[field]);
        const raw = entries(patch[field] ?? previous);
        const isCondition = field === 'conditions';
        const finalize = options.kind === 'scene';
        const timed = isCondition && current.character_type === 'mage' ? raw.map(e=>ensureAbyssalTimer(e,patch.wisdom ?? current.wisdom,before,after)) : raw;
        const stamped = stampIncoming(timed,previous,after);
        const incoming = stamped.map(e=>reviewCalendarEffect(e,after));
        const lapsed = [], seenExpired = new Set();
        const previousActive = new Set(previous.filter(e=>!isEffectExpired(isCondition?reviewConditionExpiry(e,before):e,before)).map(identity));
        let retained = [];
        for (const e of incoming) {
            if (!isEffectExpired(e,after)) {retained.push(e);continue;}
            // Future activations stay stored but cannot trigger expiration or lapse rewards.
            if (isEffectNotStarted(e,after)) {retained.push(e);continue;}
            const key=identity(e);
            if ((previousActive.has(key)||(isCondition&&finalize&&!e.clock_archived)) && !seenExpired.has(key)) {
                expired.push({name:nameOf(e),type:effectType(e,field),...getEffectDateLabels(e)});seenExpired.add(key);
            }
            if (isCondition) {
                // Timed lapse is provisional until End Scene. Turn-based lapse is final immediately.
                const recordLapse=current.character_type==='mage' && isAbyssalCondition(e) && !e.lapse_finalized && (finalize || !isPendingClockLapse(e,after));
                if(recordLapse)lapsed.push(e);
                if(isCalendarEffect(e)) {
                    retained.push(finalize?{...e,status:'expired',clock_archived:true,...(recordLapse?{lapse_finalized:true}:{})}:e);
                } else if(!finalize)retained.push(recordLapse?{...e,status:'expired',lapse_finalized:true}:e.status==='expired'?e:{...e,status:'expired'});
            } else if(isCalendarEffect(e)) retained.push(e);
        }
        if(finalize && !isCondition) {
            for(const e of previous) {
                const key=identity(e);
                if(previousActive.has(key)&&isSceneDurationEffect(e)&&!retained.some(x=>identity(x)===key)&&!seenExpired.has(key)) {
                    expired.push({name:nameOf(e),type:effectType(e,field),...getEffectDateLabels(e)});seenExpired.add(key);
                }
            }
        }
        if(isCondition && current.character_type==='mage' && lapsed.length) {
            const transition=lapseAbyssalConditions(retained,lapsed,current,patch);
            Object.assign(cleaned,transition);
            retained=transition.conditions.map(e=>{
                if(e.started_at || !isAbyssalTaintName(e) || previous.some(isAbyssalTaintName))return e;
                const now=getRawGameTimestamp(after) ?? getGameTimestamp(after);
                if(now===null)return e;
                const times=lapsed.map(x=>Date.parse(x?.expires_at||'')).filter(x=>Number.isFinite(x)&&x<=now);
                return {...e,started_at:new Date(Math.min(now,...times)).toISOString()};
            });
        }
        retained=retainRecentCalendarEffects(retained,after,{pendingLapse:e=>isCondition&&current.character_type==='mage'&&isAbyssalCondition(e)&&isPendingClockLapse(e,after)});
        if(retained.length!==raw.length || Object.hasOwn(patch,field) || retained.some((e,i)=>e!==raw[i]))cleaned[field]=retained;
        for(const e of retained)if(!isEffectExpired(e,after))active.push({name:nameOf(e),type:effectType(e,field),remaining:remainingEffectLabel(e,after),...getEffectDateLabels(e)});
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
    const woundBoxes=patch.health_boxes ?? healing.boxes ?? current.health_boxes ?? [];
    const woundRecovery=patch.natural_healing ?? healing.recovery ?? current.natural_healing;
    const woundDeadlines=getWoundHealingDeadlines(woundBoxes,woundRecovery,after);
    const remainingDeadlines=Object.fromEntries(remaining.map(entry=>{
        const kind=entry.name.split(' ').slice(1).join(' ').toLowerCase();
        const stamps=woundDeadlines.filter((stamp,i)=>stamp&&woundBoxes[i]===kind).sort();
        return [entry.name,formatGameDateTime(stamps[stamps.length-1])];
    }));
    const damage = woundLines(healing);
    const willpower = options.kind === 'sleep' ? Math.max(0, (Number(patch.willpower)||0)-(Number(current.willpower)||0)) : 0;
    const kind = options.kind || (forward ? 'clock' : 'expiry');
    const elapsed = kind === 'turn' ? '1 turn' : kind === 'scene' ? 'Scene ended' : kind === 'combat' ? 'Combat ended' : forward ? formatElapsedMinutes((to-from)/60000) : '—';
    const show = forward || expired.length > 0 || healed.length > 0 || damage.length > 0 || willpower > 0 || (['turn','scene','combat'].includes(kind) && active.length > 0);
    const clockLabel = tracker => formatGameDateTime(getGameTimestamp(tracker)) || 'Clock unset';
    return {cleaned, summary: show ? {characterId:current.id, characterName:current.name, kind, from:clockLabel(before), to:clockLabel(after), elapsed, expired, healed, remaining, remainingDeadlines, damage, willpower, active} : null};
};
