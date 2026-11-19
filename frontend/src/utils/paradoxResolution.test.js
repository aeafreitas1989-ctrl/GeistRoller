import {
    isReleasedParadoxSpellDramatic,
    shouldRecordParadoxCondition,
    isContainedParadoxOutcome,
} from './paradoxResolution';

test('released Paradox: a dramatic spellcasting failure creates a Condition', () => {
    expect(isReleasedParadoxSpellDramatic({ paradoxMode: 'release', paradoxSuccesses: 2, spellResult: { is_dramatic_failure: true } })).toBe(true);
    expect(shouldRecordParadoxCondition({ mode: 'release', remaining: 2, spellDramaticFailure: true })).toBe(true);
});

test('released Paradox: ordinary failed spell and unincurred Paradox do not create that Condition', () => {
    expect(isReleasedParadoxSpellDramatic({ paradoxMode: 'release', paradoxSuccesses: 2, spellResult: { is_dramatic_failure: false } })).toBe(false);
    expect(isReleasedParadoxSpellDramatic({ paradoxMode: 'release', paradoxSuccesses: 0, spellResult: { is_dramatic_failure: true } })).toBe(false);
    expect(isReleasedParadoxSpellDramatic({ paradoxMode: 'contain', paradoxSuccesses: 2, spellResult: { is_dramatic_failure: true } })).toBe(false);
    expect(shouldRecordParadoxCondition({ mode: 'release', remaining: 2, paradoxExceptional: false })).toBe(false);
});

test('exceptional released Paradox creates a Condition irrespective of spellcasting failure', () => {
    expect(shouldRecordParadoxCondition({ mode: 'release', remaining: 5, paradoxExceptional: true })).toBe(true);
});

test('contained Paradox only creates a Condition when successes remain after Wisdom', () => {
    expect(shouldRecordParadoxCondition({ mode: 'contain', remaining: 1 })).toBe(true);
    expect(shouldRecordParadoxCondition({ mode: 'contain', remaining: 0 })).toBe(false);
});

test('contained zero-success Paradox remains marked Contained when Wisdom roll is skipped', () => {
    expect(isContainedParadoxOutcome({ paradoxMode: 'contain' })).toBe(true);
    expect(isContainedParadoxOutcome({ paradoxMode: 'release' })).toBe(false);
});
