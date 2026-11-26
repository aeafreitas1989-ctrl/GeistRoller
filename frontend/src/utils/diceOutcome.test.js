import { formatDiceOutcome } from './diceOutcome';
test('preserves ordinary, exceptional, dramatic and count-only formatting', () => {
    expect(formatDiceOutcome({successes:0})).toBe('0 Successes = Failure');
    expect(formatDiceOutcome({successes:1})).toBe('1 Success = Success');
    expect(formatDiceOutcome({successes:3,is_exceptional:true})).toBe('3 Successes = Exceptional Success!');
    expect(formatDiceOutcome({successes:0,is_dramatic_failure:true})).toBe('0 Successes = Dramatic Failure...');
    expect(formatDiceOutcome({successes:3,is_exceptional:true},{countOnly:true})).toBe('3 Successes = Exceptional Success!');
    expect(formatDiceOutcome({successes:3,is_exceptional:true},{countOnly:true,countOnlyFirst:true})).toBe('3 Successes');
});
