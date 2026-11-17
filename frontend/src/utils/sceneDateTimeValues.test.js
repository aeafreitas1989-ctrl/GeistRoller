import {
    parseSceneDate, toSceneISODate, toSceneDisplayDate,
    parseSceneTime, toSceneTime,
} from "./sceneDateTimeValues";

describe("Scene Tracker custom date and clock inputs", () => {
    test("preserves historical years instead of treating 1607 as a modern date", () => {
        const date = parseSceneDate("1607-01-05");
        expect(date.getFullYear()).toBe(1607);
        expect(toSceneDisplayDate(date)).toBe("05/01/1607");
        expect(toSceneISODate(date)).toBe("1607-01-05");
    });
    test("parses local date input and stores ISO scene date", () => {
        expect(toSceneISODate(parseSceneDate("9/2/1607"))).toBe("1607-02-09");
    });
    test("rejects invalid dates and honors historical leap years", () => {
        expect(parseSceneDate("1607-02-29")).toBeNull();
        expect(toSceneISODate(parseSceneDate("1608-02-29"))).toBe("1608-02-29");
        expect(parseSceneDate("1607-04-31")).toBeNull();
    });
    test("handles years below 100", () => {
        expect(toSceneISODate(parseSceneDate("0004-02-29"))).toBe("0004-02-29");
    });
    test("keeps the scene time in the existing 24-hour HH:MM representation", () => {
        expect(parseSceneTime("12:19")).toEqual({ hours: 12, minutes: 19 });
        expect(toSceneTime(0, 5)).toBe("00:05");
        expect(toSceneTime(23, 59)).toBe("23:59");
    });
    test("rejects out-of-range times", () => {
        expect(parseSceneTime("24:00")).toBeNull();
        expect(parseSceneTime("12:60")).toBeNull();
        expect(toSceneTime(24, 3)).toBe("");
    });
});
