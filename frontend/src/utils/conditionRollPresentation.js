// Describe an expended Condition without altering the mechanical dice result.
// Used by both the inline result and the Last Rolls transcript.
const outcomeText = (result = {}) => {
    const successes = Math.max(0, Number(result?.successes) || 0);
    const count = `${successes} ${successes === 1 ? 'Success' : 'Successes'}`;
    if (result?.is_dramatic_failure) return `${count} = Dramatic Failure`;
    if (result?.is_exceptional) return `${count} = Exceptional Success`;
    return successes > 0 ? `${count} = Success` : '0 Successes = Failure';
};

export const getConditionRollPresentation = (name, before, after, { chanceDieReplaced = false } = {}) => {
    if (!['Informed', 'Steadfast', 'Inspired'].includes(name) || !before || !after) return null;
    const note = name === 'Inspired'
        ? 'Exceptional success threshold: 3; regain 1 Willpower.'
        : chanceDieReplaced
            ? 'Original chance die replaced with one regular die; the replacement result is rolled, not guaranteed.'
            : name === 'Informed'
                ? 'Failure becomes Success, or Success becomes Exceptional Success.'
                : 'Ordinary Failure becomes one Success.';
    return {
        name,
        before: outcomeText(before),
        after: outcomeText(after),
        note,
        originalDice: chanceDieReplaced && Array.isArray(before.dice) ? [...before.dice] : null,
    };
};
