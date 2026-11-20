import {
    isReleasedParadoxSpellDramatic,
    shouldRecordParadoxCondition,
    isContainedParadoxOutcome,
    getContainmentTranscriptArgs,
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
test('contained zero-success Paradox has no Wisdom result; live/history access is safe', () => {
    const paradoxEntry = { result: { successes: 0, dice: [3] }, config: { paradoxMode: 'contain', chance: true } };
    expect(getContainmentTranscriptArgs(paradoxEntry, undefined)).toEqual([
        paradoxEntry.result, null, paradoxEntry.config, {},
    ]);
});

test('contained Paradox with a Wisdom roll preserves both results and configurations', () => {
    const paradoxEntry = { result: { successes: 3 }, config: { paradoxMode: 'contain', pool: 4 } };
    const wisdomEntry = { result: { successes: 2 }, config: { pool: 6 } };
    expect(getContainmentTranscriptArgs(paradoxEntry, wisdomEntry)).toEqual([
        paradoxEntry.result, wisdomEntry.result, paradoxEntry.config, wisdomEntry.config,
    ]);
});

test('both live summary and saved Last Rolls call the safe containment helper', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(path.join(__dirname, '../components/DiceRoller.jsx'), 'utf8');
    const calls = source.match(/buildContainmentTranscript\(\.\.\.getContainmentTranscriptArgs\(paradoxEntry, wisdomEntry\)\)/g) || [];
    expect(calls).toHaveLength(2);
    expect(source).not.toMatch(/\bwisdomEntry\.(?:result|config)\b/);
});
