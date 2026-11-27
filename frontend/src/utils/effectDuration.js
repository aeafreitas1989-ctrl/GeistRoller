import { isSceneDurationEffect } from "./sceneLifecycle";

// Timed effects use the character's in-game Scene Tracker, never the real clock.
// Dates are interpreted as game-local calendar dates, with UTC only for arithmetic.

const FINITE_DURATION = /^(\d+)\s+(minute|hour|day|week|month|year)s?$/i;

const parseDuration = (duration) => {
    const match = String(duration || "").trim().match(FINITE_DURATION);
    if (!match || Number(match[1]) <= 0) return null;
    return { amount: Number(match[1]), unit: match[2].toLowerCase() };
};

export const getRawGameTimestamp = (tracker) => {
    const date = tracker?.date;
    const time = tracker?.time;
    if (typeof date !== "string" || typeof time !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
    const stamp = Date.parse(`${date}T${time}:00.000Z`);
    return Number.isFinite(stamp) && new Date(stamp).toISOString().slice(0, 16) === `${date}T${time}`
        ? stamp : null;
};

const parseGameStamp = value => {
    const stamp = typeof value === 'string' ? Date.parse(value) : NaN;
    return Number.isFinite(stamp) ? stamp : null;
};
export const getGameTimestamp = tracker => {
    const raw = getRawGameTimestamp(tracker), processed = parseGameStamp(tracker?.processed_at);
    return raw === null ? processed : processed === null ? raw : Math.max(raw,processed);
};
export const withGameClockCheckpoint = (previous, requested) => {
    const old = getGameTimestamp(previous), next = getGameTimestamp(requested);
    const stamp = old === null ? next : next === null ? old : Math.max(old,next);
    if (stamp === null) return requested || {};
    const processed_at = new Date(stamp).toISOString();
    return requested?.processed_at === processed_at ? requested : {...requested,processed_at};
};
export const isGameClockBehind = tracker => {
    const raw = getRawGameTimestamp(tracker), effective = getGameTimestamp(tracker);
    return effective !== null && (raw === null || raw < effective);
};
export const formatGameDateTime = value => {
    const stamp = typeof value === 'number' ? value : parseGameStamp(value);
    return stamp === null || !Number.isFinite(stamp) ? '' : new Date(stamp).toISOString().slice(0,16).replace('T',' ').replace(/-/g,'/');
};
export const getEffectDateLabels = effect => ({
    started:formatGameDateTime(effect?.started_at), expires:formatGameDateTime(effect?.expires_at),
});

const addDuration = (start, { amount, unit }) => {
    if (["minute", "hour", "day", "week"].includes(unit)) {
        const minutes = { minute: 1, hour: 60, day: 1440, week: 10080 }[unit];
        return start + amount * minutes * 60000;
    }
    // Calendar months/years, clamped to the last valid day of the target month.
    const source = new Date(start);
    const originalDay = source.getUTCDate();
    const offset = unit === "month" ? amount : amount * 12;
    const targetMonthStart = Date.UTC(source.getUTCFullYear(), source.getUTCMonth() + offset, 1);
    const target = new Date(targetMonthStart);
    const targetYear = target.getUTCFullYear();
    const targetMonth = target.getUTCMonth();
    const finalDay = Math.min(originalDay, new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate());
    return Date.UTC(targetYear, targetMonth, finalDay, source.getUTCHours(), source.getUTCMinutes());
};

export const hasFiniteDuration = (effect) => Boolean(parseDuration(effect?.duration));

const TURN_DURATION = /^(\d+)\s+turns?$/i;
export const advanceTurnEffects = (effects) => {
    if (!Array.isArray(effects)) return [];
    let changed = false;
    const result = effects.map((effect) => {
        if (effect?.tracking_mode !== "turn" || effect.status === "expired") return effect;
        changed = true;
        const turns = Math.max(0, (Number(effect.turns_remaining) || 0) - 1);
        return { ...effect, turns_remaining: turns, ...(turns === 0 ? { status: "expired" } : {}) };
    });
    return changed ? result : effects;
};
export const expireCombatEffects = (effects) => {
    if (!Array.isArray(effects)) return [];
    let changed = false;
    const result = effects.map((effect) => {
        if (effect?.tracking_mode !== "turn" || effect.status === "expired") return effect;
        changed = true;
        return { ...effect, turns_remaining: 0, status: "expired" };
    });
    return changed ? result : effects;
};
export const startTimedEffect = (effect, tracker) => {
    if (!effect || typeof effect !== 'object' || effect.status === 'expired') return effect;
    const now = getRawGameTimestamp(tracker) ?? getGameTimestamp(tracker);
    const originalStart = parseGameStamp(effect.started_at);
    // Preserve existing timestamps and never reset a partially consumed turn timer.
    const start = originalStart ?? now;
    const stamped = originalStart === null && now !== null && !effect.expires_at
        ? {...effect, started_at:new Date(now).toISOString()} : effect;
    if (isSceneDurationEffect(effect)) {
        return stamped.tracking_mode === 'scene' && stamped.status === 'active' ? stamped : {...stamped,tracking_mode:'scene',status:'active'};
    }
    const turnMatch = String(effect.duration || '').trim().match(TURN_DURATION);
    if (turnMatch) {
        if (stamped.tracking_mode === 'turn') return stamped;
        return {...stamped,tracking_mode:'turn',turns_remaining:Number(turnMatch[1]),status:'active'};
    }
    const duration = parseDuration(effect.duration);
    if (!duration || start === null || effect.expires_at) return stamped;
    const expires = addDuration(start,duration);
    return Number.isFinite(expires) ? {...stamped,expires_at:new Date(expires).toISOString(),status:'active'} : stamped;
};

// Calendar effects follow the displayed clock, not the irreversible healing checkpoint.
export const isCalendarEffect = effect => parseGameStamp(effect?.expires_at) !== null &&
    effect?.tracking_mode !== 'turn' && effect?.tracking_mode !== 'scene' && !isSceneDurationEffect(effect);
export const getEffectTimestamp = (effect,tracker) => isCalendarEffect(effect)
    ? (getRawGameTimestamp(tracker) ?? getGameTimestamp(tracker)) : getGameTimestamp(tracker);
export const isEffectNotStarted = (effect,tracker) => {
    if (!isCalendarEffect(effect)) return false;
    const now=getEffectTimestamp(effect,tracker), start=parseGameStamp(effect.started_at);
    return now!==null && start!==null && now<start;
};
export const isCalendarLapsed = (effect,tracker) => {
    const now=getEffectTimestamp(effect,tracker), end=parseGameStamp(effect?.expires_at);
    return isCalendarEffect(effect) && now!==null && end!==null && now>=end;
};
export const isEffectExpired = (effect, tracker) => {
    if (isCalendarEffect(effect) && getEffectTimestamp(effect,tracker)!==null) {
        return isEffectNotStarted(effect,tracker) || isCalendarLapsed(effect,tracker);
    }
    if (effect?.status === 'expired') return true;
    if (effect?.tracking_mode === 'turn' && (Number(effect.turns_remaining) || 0) <= 0) return true;
    return false;
};
export const reviewCalendarEffect = (effect,tracker) => {
    if (!isCalendarEffect(effect) || getEffectTimestamp(effect,tracker)===null) return effect;
    const status=isEffectExpired(effect,tracker)?'expired':'active';
    if (effect.clock_review===true && effect.status===status) return effect;
    return {...effect,clock_review:true,status};
};
// Retain every current/future entry; only naturally expired calendar records count toward the limit.
// Unfinalized Abyssal lapses remain until End Scene, so no earned Beat is silently lost.
export const retainRecentCalendarEffects = (effects,tracker,{pendingLapse=()=>false,limit=5}={}) => {
    const list=Array.isArray(effects)?effects:[];
    const pendingCount=list.filter(e=>isCalendarLapsed(e,tracker)&&pendingLapse(e)).length;
    const candidates=list.map((e,i)=>({e,i})).filter(({e})=>isCalendarLapsed(e,tracker)&&!pendingLapse(e));
    candidates.sort((a,b)=>Date.parse(b.e.expires_at)-Date.parse(a.e.expires_at)||b.i-a.i);
    const drop=new Set(candidates.slice(Math.max(0,limit-pendingCount)).map(x=>x.i));
    return drop.size ? list.filter((_,i)=>!drop.has(i)) : list;
};
export const expireTimedEffects = (effects, tracker) => {
    if (!Array.isArray(effects)) return [];
    let changed=false;
    const result=effects.map(effect=>{
        const next=isCalendarEffect(effect)?reviewCalendarEffect(effect,tracker):
            effect && effect.status!=='expired' && isEffectExpired(effect,tracker)?{...effect,status:'expired'}:effect;
        if(next!==effect)changed=true;
        return next;
    });
    return changed?result:effects;
};

const remainingLabel = (ms) => {
    const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days) return `${days}d${hours ? ` ${hours}h` : ""} remaining`;
    if (hours) return `${hours}h${minutes ? ` ${minutes}m` : ""} remaining`;
    return `${minutes}m remaining`;
};

export const getEffectTimer = (effect, tracker) => {
    if (isEffectExpired(effect, tracker)) return { kind: "expired", label: "Expired" };
    if (isSceneDurationEffect(effect)) return { kind: "scene", label: "Until end of scene" };
    if (effect?.tracking_mode === "turn") {
        const count = Math.max(0, Number(effect.turns_remaining) || 0);
        return { kind: "running", label: count + (count === 1 ? " turn remaining" : " turns remaining") };
    }
    if (String(effect?.duration || "").toLowerCase() === "permanent") return { kind: "permanent", label: "Permanent" };
    if (!hasFiniteDuration(effect) && !isCalendarEffect(effect)) return { kind: "untimed", label: "" };
    const current = getEffectTimestamp(effect,tracker);
    const expiry = effect?.expires_at ? Date.parse(effect.expires_at) : NaN;
    if (!Number.isFinite(expiry)) return {
        kind: "untracked",
        label: current === null ? "Set in-game date and time" : "Timer not started",
    };
    if (current === null) return { kind: "clock-unset", label: "Set in-game date and time" };
    return { kind: "running", label: remainingLabel(expiry - current) };
};
