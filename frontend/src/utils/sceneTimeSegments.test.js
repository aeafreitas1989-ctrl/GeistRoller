import { splitSceneTimeDraft, replaceSceneTimeSegment, parseSceneTimePaste, parseSceneTime, toSceneTime } from './sceneDateTimeValues';

test('replacing either segment preserves the other segment even during deletion', () => {
    expect(replaceSceneTimeSegment('14:30', 0, '1')).toBe('1:30');
    expect(replaceSceneTimeSegment('1:30', 0, '12')).toBe('12:30');
    expect(replaceSceneTimeSegment('14:30', 1, '5')).toBe('14:5');
    expect(replaceSceneTimeSegment('14:5', 1, '50')).toBe('14:50');
    expect(replaceSceneTimeSegment('14:30', 0, '')).toBe(':30');
    expect(replaceSceneTimeSegment('14:30', 1, '')).toBe('14:');
    expect(splitSceneTimeDraft(':30')).toEqual(['', '30']);
});
test('full time paste accepts HHMM and colon-delimited time and rejects invalid values', () => {
    expect(parseSceneTimePaste('0152')).toBe('01:52');
    expect(parseSceneTimePaste('9:5')).toBe('09:05');
    expect(parseSceneTimePaste('23:59')).toBe('23:59');
    expect(parseSceneTimePaste('24:00')).toBeNull();
    expect(parseSceneTimePaste('1460')).toBeNull();
    expect(parseSceneTimePaste('12')).toBeNull();
    expect(parseSceneTime('14:')).toBeNull();
    expect(toSceneTime(14, 5)).toBe('14:05');
});
