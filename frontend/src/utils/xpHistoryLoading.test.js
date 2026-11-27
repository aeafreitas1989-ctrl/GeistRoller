import {withoutXPHistory,isCurrentXPHistory} from './xpHistoryLoading';
test('compact state preserves all non-history fields',()=>{
    const character={id:'a',updated_at:'v1',xp_history:[{id:1}],advancement_ledger:[{id:2}]};
    expect(withoutXPHistory(character)).toEqual({id:'a',updated_at:'v1',advancement_ledger:[{id:2}]});
    expect(character.xp_history).toHaveLength(1);
});
test('only matching history revision is editable',()=>{
    const history={id:'a',updated_at:'v1',xp_history:[]};
    expect(isCurrentXPHistory(history,{id:'a',updated_at:'v1'})).toBe(true);
    expect(isCurrentXPHistory(history,{id:'a',updated_at:'v2'})).toBe(false);
    expect(isCurrentXPHistory(history,{id:'b',updated_at:'v1'})).toBe(false);
});
