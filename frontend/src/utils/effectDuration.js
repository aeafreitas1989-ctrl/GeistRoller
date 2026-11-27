import { isSceneDurationEffect } from "./sceneLifecycle";

// Timed effects use the character's in-game Scene Tracker, never the real clock.
// Dates are interpreted as game-local calendar dates, with UTC only for arithmetic.

const FINITE_DURATION = /^(\d+)\s+(minute|hour|day|week|month|year)s?$/i;

const parseDuration = (duration) => {
    const match = String(duration || "").trim().match(FINITE_DURATION);
    if (!match || Number(match[1]) <= 0) return null;
    return { amount: Number(match[1]), unit: match[2].toLowerCase() };
};

export const getGameTimestamp = (tracker) => {
    const date = tracker?.date;
    const time = tracker?.time;
    if (typeof date !== "string" || typeof time !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
    const stamp = Date.parse(`${date}T${time}:00.000Z`);
    return Number.isFinite(stamp) && new Date(stamp).toISOString().slice(0, 16) === `${date}T${time}`
        ? stamp : null;
};

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
    if (isSceneDurationEffect(effect) && effect?.status !== "expired") {
        return { ...effect, tracking_mode: "scene", status: "active" };
    }
    const turnMatch = String(effect?.duration || "").trim().match(TURN_DURATION);
    if (turnMatch && effect?.status !== "expired") {
        return { ...effect, tracking_mode: "turn", turns_remaining: Number(turnMatch[1]), status: "active" };
    }
    const duration = parseDuration(effect?.duration);
    const start = getGameTimestamp(tracker);
    // Do not invent an activation time when the in-game clock is unset.
    if (!effect || !duration || start === null || effect.expires_at || effect.status === "expired") return effect;
    const expires = addDuration(start, duration);
    if (!Number.isFinite(expires)) return effect;
    return {
        ...effect,
        started_at: new Date(start).toISOString(),
        expires_at: new Date(expires).toISOString(),
        status: "active",
    };
};

export const isEffectExpired = (effect, tracker) => {
    if (effect?.status === "expired") return true;
    if (effect?.tracking_mode === "turn" && (Number(effect.turns_remaining) || 0) <= 0) return true;
    const current = getGameTimestamp(tracker);
    const expiry = effect?.expires_at ? Date.parse(effect.expires_at) : NaN;
    return current !== null && Number.isFinite(expiry) && current >= expiry;
};

// Persist expiration on game-time changes; retain entries as history.
export const expireTimedEffects = (effects, tracker) => {
    if (!Array.isArray(effects)) return [];
    let changed = false;
    const result = effects.map((effect) => {
        if (!effect || effect.status === "expired" || !isEffectExpired(effect, tracker)) return effect;
        changed = true;
        return { ...effect, status: "expired" };
    });
    return changed ? result : effects;
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
    if (!hasFiniteDuration(effect)) return { kind: "untimed", label: "" };
    const current = getGameTimestamp(tracker);
    const expiry = effect?.expires_at ? Date.parse(effect.expires_at) : NaN;
    if (!Number.isFinite(expiry)) return {
        kind: "untracked",
        label: current === null ? "Set in-game date and time" : "Timer not started",
    };
    if (current === null) return { kind: "clock-unset", label: "Set in-game date and time" };
    return { kind: "running", label: remainingLabel(expiry - current) };
};
