import { formatVoluntaryDramaticFailure } from './voluntaryDramaticFailure';
export const formatDiceOutcome = (result, {countOnly=false, countOnlyFirst=false, voluntary=false, isSpellcasting=false}={}) => {
    const successes = result?.successes || 0;
    const successText = successes + ' Success' + (successes === 1 ? '' : 'es');
    if (countOnly && countOnlyFirst) return successText;
    if (voluntary) { const label = formatVoluntaryDramaticFailure(result, isSpellcasting); if (label) return label; }
    if (result?.is_dramatic_failure) return successText + ' = Dramatic Failure...';
    if (result?.is_exceptional) return successText + ' = Exceptional Success!';
    if (countOnly) return successText;
    return successes > 0 ? successText + ' = Success' : '0 Successes = Failure';
};
