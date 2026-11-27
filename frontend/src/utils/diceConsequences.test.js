import { classifyDiceOutcome, getDiceChatOutcome, canConvertVoluntaryFailure, applyVoluntaryFailureWithBeat, applyResonantExceptional, shouldApplyKeyDoom } from './diceConsequences';

test('classifies normal, failure, dramatic and exceptional results consistently', () => {
    expect(classifyDiceOutcome({successes:1})).toBe('success');
    expect(classifyDiceOutcome({successes:0})).toBe('failure');
    expect(classifyDiceOutcome({successes:0,is_dramatic_failure:true})).toBe('dramatic');
    expect(getDiceChatOutcome({successes:5,is_exceptional:true}).resultType).toBe('**EXCEPTIONAL SUCCESS!**');
});
test('count-only and Paradox failures cannot be voluntarily converted in the main roller', () => {
    expect(canConvertVoluntaryFailure({successes:0})).toBe(true);
    expect(canConvertVoluntaryFailure({successes:0},{countOnly:true})).toBe(false);
    expect(canConvertVoluntaryFailure({successes:0},{summaryKey:'paradox'})).toBe(false);
    expect(canConvertVoluntaryFailure({successes:0,is_dramatic_failure:true})).toBe(false);
});
test('voluntary conversion preserves dice and canonical and compatibility flags', () => {
    const original={successes:0,dice:[2],is_dramatic_failure:false};
    const result=applyVoluntaryFailureWithBeat(original);
    expect(result).toMatchObject({dice:[2],successes:0,is_dramatic_failure:true,beat_awarded:true,is_voluntary_dramatic_failure:true,voluntary_dramatic_failure:true});
    expect(original.is_dramatic_failure).toBe(false);
});
test('resonant exceptional success prevents Key Doom, including the transcript', () => {
    const result=applyResonantExceptional({successes:3,is_exceptional:false},'Key',true);
    expect(result.is_exceptional).toBe(true);
    const args={key:'Key',avoidDoom:false,spendWillpower:false};
    expect(shouldApplyKeyDoom({...args,result})).toBe(false);
    expect(shouldApplyKeyDoom({...args,result:{successes:2}})).toBe(true);
    expect(shouldApplyKeyDoom({...args,avoidDoom:true,result:{successes:2}})).toBe(false);
    expect(shouldApplyKeyDoom({...args,spendWillpower:true,result:{successes:2}})).toBe(false);
    expect(shouldApplyKeyDoom({...args,key:'__none__',result:{successes:2}})).toBe(false);
});
