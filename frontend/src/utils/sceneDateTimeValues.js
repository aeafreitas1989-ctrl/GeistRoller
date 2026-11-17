// Scene date/time values are game-local; do not use wall-clock time or UTC offsets.
const pad2 = (number) => String(number).padStart(2, "0");

export const parseSceneDate = (value) => {
    const text = String(value || "").trim();
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    const local = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/.exec(text);
    if (!iso && !local) return null;

    const year = Number(iso ? iso[1] : local[3]);
    const month = Number(iso ? iso[2] : local[2]);
    const day = Number(iso ? iso[3] : local[1]);
    if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return null;

    // Date(y, ...) maps years 00-99 to 1900-1999. setFullYear avoids that.
    // Midday avoids midnight DST edge cases in date-only calendar values.
    const date = new Date(2000, month - 1, day, 12);
    date.setFullYear(year);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
        ? date
        : null;
};

export const toSceneISODate = (date) => {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) return "";
    return `${String(date.getFullYear()).padStart(4, "0")}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

export const toSceneDisplayDate = (date) => {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) return "";
    return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${String(date.getFullYear()).padStart(4, "0")}`;
};

export const parseSceneTime = (value) => {
    const match = /^(\d{1,2}):(\d{1,2})$/.exec(String(value || "").trim());
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    return hours <= 23 && minutes <= 59 ? { hours, minutes } : null;
};

export const toSceneTime = (hours, minutes) => {
    const hour = Number(hours);
    const minute = Number(minutes);
    if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) return "";
    return `${pad2(hour)}:${pad2(minute)}`;
};
