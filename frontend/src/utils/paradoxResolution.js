// Core decision helpers for Mage: The Awakening 2e Paradox outcomes.
// Narrative anomalies are assigned by the Storyteller, not automatically invented here.

export const isReleasedParadoxSpellDramatic = ({
    paradoxMode = '', paradoxSuccesses = 0, spellResult = null,
} = {}) => paradoxMode === 'release'
    && Number(paradoxSuccesses) > 0
    && spellResult?.is_dramatic_failure === true;

export const shouldRecordParadoxCondition = ({
    mode = 'contain', remaining = 0, paradoxExceptional = false,
    spellDramaticFailure = false,
} = {}) => mode === 'release'
    ? Boolean(paradoxExceptional || spellDramaticFailure)
    : Number(remaining) > 0;

export const isContainedParadoxOutcome = (config = {}) =>
    config?.paradoxMode === 'contain';
// Passes both live and saved Last Rolls through the same safe input path.
// With zero Paradox successes, the Wisdom roll is intentionally absent.
export const getContainmentTranscriptArgs = (paradoxEntry, wisdomEntry) => [
    paradoxEntry?.result ?? null,
    wisdomEntry?.result ?? null,
    paradoxEntry?.config || {},
    wisdomEntry?.config || {},
];
