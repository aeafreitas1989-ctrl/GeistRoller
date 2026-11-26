// Scene date/time values are game-local; do not use wall-clock time or UTC offsets.
const pad2 = (number) => String(number).padStart(2, "0");

// Keep separators visible while users type DDMMYYYY / HHMM as digits.
export const maskSceneDateInput = (value) => {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 8);
    return digits.slice(0, 2)
        + (digits.length >= 2 ? "/" : "")
        + digits.slice(2, 4)
        + (digits.length >= 4 ? "/" : "")
        + digits.slice(4);
};

export const maskSceneTimeInput = (value) => {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 4);
    return digits.slice(0, 2) + (digits.length >= 2 ? ":" : "") + digits.slice(2);
};

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

export const splitSceneDateDraft = (value) => {
    const parts = String(value || '').split('/');
    return [parts[0] || '',parts[1] || '',parts[2] || ''];
};
export const replaceSceneDateSegment = (value, index, replacement) => {
    const parts = splitSceneDateDraft(value);
    if (![0,1,2].includes(index)) return value;
    parts[index] = String(replacement ?? '').replace(/\D/g,'').slice(0,index === 0 ? 4 : 2);
    return parts.some(Boolean) ? parts.join('/') : '';
};
export const parseSceneDateDraft = (value) => {
    const [year,month,day] = splitSceneDateDraft(value);
    if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !/^\d{4}$/.test(year)) return null;
    return parseSceneDate(day+'/'+month+'/'+year);
};
export const toSceneCalendarDate = date => toSceneISODate(date).replace(/-/g, '/');
export const parseSceneDatePaste = (value) => {
    const text = String(value || '').trim();
    if (/^\d{8}$/.test(text)) return toSceneCalendarDate(parseSceneDateDraft(text.slice(0,4)+'/'+text.slice(4,6)+'/'+text.slice(6))) || null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return toSceneCalendarDate(parseSceneDate(text)) || null;
    if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(text)) return toSceneCalendarDate(parseSceneDateDraft(text)) || null;
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(text)) return toSceneCalendarDate(parseSceneDate(text)) || null;
    return null;
};
