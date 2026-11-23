import { getGameTimestamp } from './effectDuration';
import { advanceNaturalHealing, restartNaturalHealing } from './naturalHealing';
import { addWoundDamage, normalizeResistance } from './resistantWounds';
import { temperatureExposure } from './environmentalTilts';

const FIFTEEN = 15 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const trackedTime = (stamp, tracker) => ({ ...tracker, date: new Date(stamp).toISOString().slice(0, 10),
    time: new Date(stamp).toISOString().slice(11, 16) });
const validTime = (text) => {
    const value = Date.parse(text || '');
    return Number.isFinite(value) ? value : null;
};

// Advance natural healing before each new 15-minute temperature wound.
// This is essential to turn a naturally recovered Resistant Bashing wound into
// a fresh, non-Resistant Bashing wound rather than freezing the original wound.
// This helper is shared by manual scene-clock changes, Advance Time, and Sleep.
export const advanceEnvironmentalExposure = (character = {}, nextTracker = {}, boxesInput = null, marksInput = null) => {
    const oldTracker = character?.scene_tracker || {};
    const oldAt = getGameTimestamp(oldTracker);
    const newAt = getGameTimestamp(nextTracker);
    let boxes = Array.isArray(boxesInput) ? [...boxesInput] : [...(character?.health_boxes || [])];
    let marks = normalizeResistance(boxes, Array.isArray(marksInput) ? marksInput : character?.resistant_wounds);
    let recovery = character?.natural_healing || null;
    const previousKind = temperatureExposure(character, oldTracker);
    const nextKind = temperatureExposure(character, nextTracker);
    const previousState = oldTracker?.environmental_exposure || {};
    const since = previousKind && previousState.kind === previousKind
        ? (validTime(previousState.since) ?? oldAt) : oldAt;
    const latestTick = previousKind && previousState.kind === previousKind
        ? (validTime(previousState.last_tick_at) ?? since) : since;
    let bashing = 0;
    let lethal = 0;
    let healedCount = 0;
    let cursor = oldAt;
    const healTo = (at) => {
        const oldClock = trackedTime(cursor, oldTracker), newClock = trackedTime(at, oldTracker);
        const healed = advanceNaturalHealing(boxes, recovery, oldClock, newClock, marks);
        boxes = healed.boxes;
        marks = healed.resistant_wounds;
        recovery = healed.recovery;
        healedCount += healed.healed;
        cursor = at;
    };
    let endLastTick = latestTick;
    if (oldAt !== null && newAt !== null && newAt > oldAt) {
        if (previousKind && since !== null) {
            const firstTick = Math.max(since + FIFTEEN,
                (latestTick ?? since) + FIFTEEN);
            const count = Math.max(0, Math.floor((newAt - firstTick) / FIFTEEN) + 1);
            if (count > 10000) throw new Error('Environmental exposure exceeds 10,000 quarter-hour checks. Advance in shorter intervals.');
            for (let tick = firstTick; tick <= newAt; tick += FIFTEEN) {
                if (tick <= oldAt) continue;
                healTo(tick);
                const damaged = addWoundDamage(boxes, marks, 'bashing', 1, false);
                boxes = damaged.boxes;
                marks = damaged.resistant_wounds;
                bashing += damaged.applied;
                const hours = Math.floor((tick - since) / HOUR);
                if (hours > 5 && (tick - since) % HOUR === 0) {
                    const severe = addWoundDamage(boxes, marks, 'lethal', 1, false);
                    boxes = severe.boxes;
                    marks = severe.resistant_wounds;
                    lethal += severe.applied;
                }
                recovery = restartNaturalHealing(boxes, trackedTime(tick, oldTracker));
                endLastTick = tick;
            }
        }
        healTo(newAt);
    } else if (oldAt !== null && newAt !== null && newAt === oldAt) {
        // Weather or shelter change alone must not advance any wound.
    } else if (oldAt !== null && newAt !== null && newAt < oldAt) {
        // Never undo wounds or grant healing when the game clock moves backwards.
    }
    let exposure = {};
    if (nextKind && newAt !== null) {
        if (nextKind === previousKind && since !== null && newAt >= since) {
            exposure = { kind: nextKind, since: new Date(since).toISOString(),
                last_tick_at: endLastTick === null ? null : new Date(endLastTick).toISOString() };
        } else {
            exposure = { kind: nextKind, since: new Date(newAt).toISOString(),
                last_tick_at: new Date(newAt).toISOString() };
        }
    }
    return { tracker: { ...nextTracker, environmental_exposure: exposure },
        boxes, resistant_wounds: marks, recovery, healed: healedCount, bashing, lethal };
};
