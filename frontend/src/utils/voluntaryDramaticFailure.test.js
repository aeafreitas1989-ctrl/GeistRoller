import {
    convertToVoluntaryDramaticFailure,
    formatVoluntaryDramaticFailure,
} from './voluntaryDramaticFailure';

test('voluntary choice preserves rolled dice while flagging the choice', () => {
    const original = { successes: 0, dice: [2, 7, 4], is_dramatic_failure: false, description: 'Failure.' };
    const result = convertToVoluntaryDramaticFailure(original);
    expect(result.dice).toEqual([2, 7, 4]);
    expect(result.successes).toBe(0);
    expect(result.is_dramatic_failure).toBe(true);
    expect(result.is_voluntary_dramatic_failure).toBe(true);
    expect(result.description).toBe('Voluntary Dramatic Failure');
    expect(original.is_dramatic_failure).toBe(false);
});

test('normal failed and automatic dramatic rolls do not receive a voluntary label', () => {
    expect(formatVoluntaryDramaticFailure({ successes: 0, is_dramatic_failure: false })).toBeNull();
    expect(formatVoluntaryDramaticFailure({ successes: 0, is_dramatic_failure: true })).toBeNull();
});

test('a voluntary dramatic failure is explicit in Last Rolls for standard actions', () => {
    const roll = convertToVoluntaryDramaticFailure({ successes: 0, dice: [4] });
    expect(formatVoluntaryDramaticFailure(roll, false))
        .toBe('0 Successes = Voluntary Dramatic Failure (+1 Beat)');
});

test('a voluntary dramatic spellcasting failure shows Arcane Beat in Last Rolls', () => {
    const roll = convertToVoluntaryDramaticFailure({ successes: 0, dice: [4] });
    expect(formatVoluntaryDramaticFailure(roll, true))
        .toBe('0 Successes = Voluntary Dramatic Failure (+1 Arcane Beat)');
});
