import { maskSceneDateInput, maskSceneTimeInput, parseSceneDate, parseSceneTime, toSceneISODate } from './sceneDateTimeValues';

describe('scene clock fixed separators', () => {
    test('eight digits form DD/MM/YYYY, including historical years', () => {
        expect(maskSceneDateInput('06011607')).toBe('06/01/1607');
        expect(maskSceneDateInput('06/01/1607')).toBe('06/01/1607');
        expect(maskSceneDateInput('06')).toBe('06/');
        expect(toSceneISODate(parseSceneDate(maskSceneDateInput('06011607')))).toBe('1607-01-06');
    });
    test('four digits form HH:MM, with validation of impossible values', () => {
        expect(maskSceneTimeInput('0152')).toBe('01:52');
        expect(maskSceneTimeInput('01:52')).toBe('01:52');
        expect(maskSceneTimeInput('01')).toBe('01:');
        expect(parseSceneTime(maskSceneTimeInput('0152'))).toEqual({ hours: 1, minutes: 52 });
        expect(parseSceneTime(maskSceneTimeInput('2960'))).toBeNull();
    });
});
