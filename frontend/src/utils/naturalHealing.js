// Natural recovery is driven only by the character's in-game Scene Tracker.
// Chronicles of Darkness 2e: rightmost wound first; 15m/2d/7d per bashing/lethal/aggravated.
import { getGameTimestamp } from "./effectDuration";
import { normalizeResistance } from "./resistantWounds";

const INTERVAL_MS = Object.freeze({
    bashing: 15 * 60 * 1000,
    lethal: 2 * 24 * 60 * 60 * 1000,
    aggravated: 7 * 24 * 60 * 60 * 1000,
});

export const rightmostWound = (boxes = []) => {
    for (let i = boxes.length - 1; i >= 0; i -= 1) {
        if (Object.prototype.hasOwnProperty.call(INTERVAL_MS, boxes[i])) return boxes[i];
    }
    return null;
};

const iso = (timestamp) => timestamp === null ? null : new Date(timestamp).toISOString();
const validCheckpoint = (recovery) => {
    const ms = recovery?.last_at ? Date.parse(recovery.last_at) : NaN;
    return Number.isFinite(ms) ? ms : null;
};

// A manually changed wound (damage, healing, magic, Scouring) starts a new interval.
// The cursor is stored in Character.natural_healing, not as wall-clock time.
export const restartNaturalHealing = (boxes, tracker) => ({
    last_at: iso(getGameTimestamp(tracker)),
    progress_ms: 0,
    wound_type: rightmostWound(boxes),
});

export const naturalHealingBlocked = (boxes = []) =>
    boxes.length > 0 && (boxes.every((box) => box === "lethal") ||
        boxes.every((box) => box === "aggravated"));

// Returns a patch and details. Never restores wounds when the game clock moves backwards.
// If an older character has wounds but no checkpoint, start at the PREVIOUS valid game time;
// if the previous time was missing, initialize at the new time without retroactive healing.
export const advanceNaturalHealing = (boxes, recovery, oldTracker, newTracker, resistant = []) => {
    const nextBoxes = Array.isArray(boxes) ? [...boxes] : [];
    const nextMarks = normalizeResistance(nextBoxes, resistant);
    const oldNow = getGameTimestamp(oldTracker);
    const newNow = getGameTimestamp(newTracker);
    const currentType = rightmostWound(nextBoxes);
    const previous = recovery || {};

    if (!currentType) return {
        boxes: nextBoxes, resistant_wounds: nextMarks,
        healed: 0,
        recovery: { last_at: iso(newNow), progress_ms: 0, wound_type: null },
    };

    if (newNow === null) return {
        boxes: nextBoxes, resistant_wounds: nextMarks, healed: 0,
        recovery: {
            last_at: previous.last_at || null,
            progress_ms: previous.wound_type === currentType ? Math.max(0, Number(previous.progress_ms) || 0) : 0,
            wound_type: currentType,
        },
    };

    const matchingWound = previous.wound_type === currentType;
    const saved = matchingWound ? validCheckpoint(previous) : null;
    const start = saved ?? (oldNow !== null && oldNow <= newNow ? oldNow : newNow);
    const progress = matchingWound && saved !== null ? Math.max(0, Number(previous.progress_ms) || 0) : 0;

    // No elapsed time and no checkpoint rewind. Keep a future checkpoint intact.
    if (newNow < start) return {
        boxes: nextBoxes, resistant_wounds: nextMarks, healed: 0,
        recovery: { last_at: iso(start), progress_ms: progress, wound_type: currentType },
    };

    // A fully Lethal track is bleeding out and cannot recover without treatment.
    // A fully Aggravated track is dead, so natural healing cannot revive it.
    if (naturalHealingBlocked(nextBoxes)) return {
        boxes: nextBoxes, resistant_wounds: nextMarks, healed: 0,
        recovery: { last_at: iso(newNow), progress_ms: 0, wound_type: currentType },
    };

    let available = progress + (newNow - start);
    let healed = 0;
    const healedByType = { bashing: 0, lethal: 0, aggravated: 0 };
    let wound = currentType;
    while (wound && available >= INTERVAL_MS[wound]) {
        // Actual rightmost damaged Health box is the one that heals.
        const index = nextBoxes.lastIndexOf(wound);
        nextBoxes[index] = "empty";
        nextMarks[index] = false;
        available -= INTERVAL_MS[wound];
        healed += 1;
        healedByType[wound] += 1;
        wound = rightmostWound(nextBoxes);
        if (naturalHealingBlocked(nextBoxes)) {
            available = 0;
            break;
        }
    }

    return {
        boxes: nextBoxes, resistant_wounds: nextMarks,
        healed, healedByType,
        recovery: {
            last_at: iso(newNow),
            progress_ms: wound ? available : 0,
            wound_type: wound,
        },
    };
};

// A read-only status line for both Health panels; never advances healing on render.
export const getNaturalHealingLabel = (boxes, recovery, tracker) => {
    const wound = rightmostWound(boxes);
    if (!wound) return null;
    if (boxes?.length > 0 && boxes.every((box) => box === "lethal")) return "Bleeding out — medical treatment required";
    if (boxes?.length > 0 && boxes.every((box) => box === "aggravated")) return "No natural recovery — character is dead";
    const now = getGameTimestamp(tracker);
    if (now === null) return "Set in-game date and time to track natural healing";
    const start = validCheckpoint(recovery);
    if (start === null || recovery?.wound_type !== wound) return "Natural healing starts with the next time advance";
    if (now < start) return "Game clock is earlier than healing checkpoint";
    const accrued = Math.max(0, Number(recovery?.progress_ms) || 0) + (now - start);
    const remainingMinutes = Math.max(0, Math.ceil((INTERVAL_MS[wound] - accrued) / 60000));
    const days = Math.floor(remainingMinutes / 1440);
    const hours = Math.floor((remainingMinutes % 1440) / 60);
    const minutes = remainingMinutes % 60;
    const part = days ? `${days}d ${hours}h` : hours ? `${hours}h ${minutes}m` : `${minutes}m`;
    return `Natural healing: ${part} until next ${wound} wound heals`;
};

// Estimated time until the last wound of each severity heals, in actual track
// order, assuming no further damage or treatment. Uses the same intervals as recovery.
export const getRemainingWoundGroups = (boxes, recovery, tracker) => {
    if (!Array.isArray(boxes)) return [];
    const counts = { bashing: 0, lethal: 0, aggravated: 0 };
    const deadlines = {};
    const type = rightmostWound(boxes);
    const now = getGameTimestamp(tracker);
    const checkpoint = validCheckpoint(recovery);
    // A clock rewind must not undo existing progress or advance healing twice.
    const delay = now !== null && checkpoint !== null ? Math.max(0, checkpoint - now) : 0;
    const accrued = recovery?.wound_type === type && checkpoint !== null && now !== null
        ? Math.max(0, Number(recovery.progress_ms) || 0) + Math.max(0, now - checkpoint) : 0;
    let remaining = delay, progress = accrued;
    for (let i = boxes.length - 1; i >= 0; i -= 1) {
        const kind = boxes[i];
        if (!Object.prototype.hasOwnProperty.call(INTERVAL_MS, kind)) continue;
        counts[kind] += 1;
        const interval = INTERVAL_MS[kind];
        remaining += Math.max(0, interval - progress);
        progress = Math.max(0, progress - interval);
        deadlines[kind] = remaining;
    }
    const blocked = naturalHealingBlocked(boxes);
    return Object.keys(counts).filter(kind => counts[kind] > 0).map(kind => ({
        kind, count: counts[kind],
        remainingMs: blocked || now === null ? null : deadlines[kind],
        reason: blocked ? (boxes.every(box => box === 'aggravated') ? 'No natural recovery' : 'Medical treatment required') : now === null ? 'Clock unset' : null,
    }));
};

// Sequential natural recovery: a wound's deadline derives from the saved checkpoint,
// not the editable display clock. Unknown historical wound dates remain unknown.
export const getWoundHealingDeadlines = (boxes = [], recovery, tracker) => {
    if (!Array.isArray(boxes)) return [];
    const deadlines = boxes.map(()=>null);
    const checkpoint = validCheckpoint(recovery);
    const kind = rightmostWound(boxes);
    if (!kind || checkpoint === null || recovery?.wound_type !== kind || naturalHealingBlocked(boxes) || getGameTimestamp(tracker) === null) return deadlines;
    let due = checkpoint - Math.max(0,Number(recovery.progress_ms)||0);
    for (let i=boxes.length-1;i>=0;i--) {
        if (!Object.hasOwn(INTERVAL_MS,boxes[i])) continue;
        due += INTERVAL_MS[boxes[i]];
        if (Number.isFinite(due)) deadlines[i] = new Date(due).toISOString();
    }
    return deadlines;
};

// Display countdowns calculated from the unchanged absolute healing deadlines.
export const getWoundHealingRemainingLabels = (boxes, recovery, tracker) => {
    const now = getGameTimestamp(tracker);
    return getWoundHealingDeadlines(boxes,recovery,tracker).map(deadline=>{
        if (!deadline || now === null) return null;
        const minutes=Math.max(0,Math.ceil((Date.parse(deadline)-now)/60000));
        const parts=[[Math.floor(minutes/1440),'d'],[Math.floor(minutes%1440/60),'h'],[minutes%60,'min']];
        return (parts.filter(([n])=>n>0).map(([n,unit])=>n+unit).join(' ')||'0min')+' remaining';
    });
};
