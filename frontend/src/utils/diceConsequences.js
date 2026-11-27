import { convertToVoluntaryDramaticFailure } from './voluntaryDramaticFailure';

export const classifyDiceOutcome = result => {
    if (result?.is_dramatic_failure) return 'dramatic';
    if ((result?.successes || 0) === 0) return 'failure';
    if (result?.is_exceptional) return 'exceptional';
    return 'success';
};

export const getDiceChatOutcome = result => {
    switch (classifyDiceOutcome(result)) {
        case 'dramatic': return { resultEmoji: '💀', resultType: '**DRAMATIC FAILURE**' };
        case 'failure': return { resultEmoji: '❌', resultType: '**Failure**' };
        case 'exceptional': return { resultEmoji: '✨', resultType: '**EXCEPTIONAL SUCCESS!**' };
        default: return { resultEmoji: '✅', resultType: '**Success** ('+result.successes+')' };
    }
};

export const canConvertVoluntaryFailure = (result, config = {}) =>
    result?.successes === 0 && !result.is_dramatic_failure && !config.countOnly && config.summaryKey !== 'paradox';

export const shouldAwardDramaticFailureBeat = (result, config = {}) =>
    Boolean(result?.beat_awarded && !config.countOnly && config.summaryKey !== 'paradox');

export const dramaticFailureBeatReason = result =>
    result?.is_voluntary_dramatic_failure || result?.voluntary_dramatic_failure ? 'Voluntary Dramatic Failure' : 'Chance Die Dramatic Failure';

export const applyVoluntaryFailureWithBeat = result => ({
    ...convertToVoluntaryDramaticFailure(result),
    beat_awarded: true,
    // Compatibility with existing consumers; canonical flag is is_voluntary_dramatic_failure.
    voluntary_dramatic_failure: true,
});

export const applyResonantExceptional = (result, key, resonant) => ({
    ...result,
    is_exceptional: result.is_exceptional || (key !== '__none__' && resonant && !result.is_dramatic_failure && result.successes >= 3),
});

export const shouldApplyKeyDoom = ({key, avoidDoom, spendWillpower, result}) =>
    key !== '__none__' && !avoidDoom && !spendWillpower && !result?.is_exceptional;
