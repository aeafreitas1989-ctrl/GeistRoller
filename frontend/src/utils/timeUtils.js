// Utilities for advancing the in-game scene tracker time/date.
// Scene tracker stores:
//   date: "YYYY-MM-DD" (may be empty)
//   time: "HH:MM" (may be empty)

const pad = (n) => String(n).padStart(2, "0");

const parseDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return null;
    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map((p) => parseInt(p, 10));
    if (!y || !m || !d) return null;
    return new Date(Date.UTC(y, m - 1, d));
};

const formatDate = (dateObj) => {
    const y = dateObj.getUTCFullYear();
    const m = pad(dateObj.getUTCMonth() + 1);
    const d = pad(dateObj.getUTCDate());
    return `${y}-${m}-${d}`;
};

const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return { h: 0, m: 0 };
    const parts = timeStr.split(":");
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return { h, m };
};

/**
 * Advance the scene tracker by a number of hours (and optionally minutes).
 * Returns a new object { date, time } — falls back to today if date missing.
 */
export const advanceSceneTime = (tracker, hours = 0, minutes = 0) => {
    const currentDate = parseDate(tracker?.date) || (() => {
        const now = new Date();
        return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    })();
    const { h, m } = parseTime(tracker?.time);

    let totalMinutes = h * 60 + m + hours * 60 + minutes;
    let dayOffset = 0;

    const MINS_PER_DAY = 24 * 60;
    while (totalMinutes >= MINS_PER_DAY) {
        totalMinutes -= MINS_PER_DAY;
        dayOffset += 1;
    }
    while (totalMinutes < 0) {
        totalMinutes += MINS_PER_DAY;
        dayOffset -= 1;
    }

    const newDate = new Date(currentDate.getTime());
    newDate.setUTCDate(newDate.getUTCDate() + dayOffset);

    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;

    return {
        date: formatDate(newDate),
        time: `${pad(newH)}:${pad(newM)}`,
    };
};

/**
 * Advance the scene tracker to 07:00 of the next day.
 */
export const sleepUntilMorning = (tracker) => {
    const currentDate = parseDate(tracker?.date) || (() => {
        const now = new Date();
        return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    })();
    const nextDate = new Date(currentDate.getTime());
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    return {
        date: formatDate(nextDate),
        time: "07:00",
    };
};
