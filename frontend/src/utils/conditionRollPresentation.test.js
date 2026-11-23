import { getConditionRollPresentation } from './conditionRollPresentation';

const outcome = (successes, options = {}) => ({ successes, is_exceptional: false, is_dramatic_failure: false, dice: [2, 6], ...options });

test('Steadfast shows original failure and changed final result in Last Rolls', () => {
    expect(getConditionRollPresentation('Steadfast', outcome(0), outcome(1))).toEqual(expect.objectContaining({
        name: 'Steadfast', before: '0 Successes = Failure', after: '1 Success = Success',
        originalDice: null,
    }));
});

test('Informed records ordinary success upgraded to exceptional', () => {
    const note = getConditionRollPresentation('Informed', outcome(2), outcome(2, { is_exceptional: true }));
    expect(note.before).toBe('2 Successes = Success');
    expect(note.after).toBe('2 Successes = Exceptional Success');
});

test('Informed records ordinary failure upgraded to success', () => {
    const note = getConditionRollPresentation('Informed', outcome(0), outcome(1));
    expect(note.before).toBe('0 Successes = Failure');
    expect(note.after).toBe('1 Success = Success');
});

test('Steadfast chance-die replacement reports both the original and the new die', () => {
    const note = getConditionRollPresentation('Steadfast', outcome(0, { dice: [1] }), outcome(0, { dice: [4] }), { chanceDieReplaced: true });
    expect(note.originalDice).toEqual([1]);
    expect(note.after).toBe('0 Successes = Failure');
    expect(note.note).toMatch(/not guaranteed/);
});

test('Inspired records its 3-success exceptional threshold and Willpower', () => {
    const note = getConditionRollPresentation('Inspired', outcome(3), outcome(3, { is_exceptional: true }));
    expect(note.before).toBe('3 Successes = Success');
    expect(note.after).toBe('3 Successes = Exceptional Success');
    expect(note.note).toContain('Willpower');
});

test('No expended Condition means no extra annotation', () => {
    expect(getConditionRollPresentation(null, outcome(0), outcome(1))).toBeNull();
});
