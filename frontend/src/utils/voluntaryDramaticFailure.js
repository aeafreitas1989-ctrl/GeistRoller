// Mark a failed roll after the player chooses a voluntary Dramatic Failure.
// Preserve the original dice faces and success count for Last Rolls.
export const convertToVoluntaryDramaticFailure = (result) => ({
    ...result,
    is_dramatic_failure: true,
    is_voluntary_dramatic_failure: true,
    description: 'Voluntary Dramatic Failure',
});

// Only voluntary dramatic failures receive this special Last Rolls label.
// Spellcasting failures grant an Arcane Beat; other failures grant a normal Beat.
export const formatVoluntaryDramaticFailure = (result, isSpellcasting = false) => {
    if (!result?.is_dramatic_failure || !result?.is_voluntary_dramatic_failure) return null;
    const successes = Math.max(0, Number(result.successes) || 0);
    const successText = `${successes} Success${successes === 1 ? '' : 'es'}`;
    return `${successText} = Voluntary Dramatic Failure (+1 ${isSpellcasting ? 'Arcane Beat' : 'Beat'})`;
};
