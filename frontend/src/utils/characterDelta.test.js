import { reconcileCharacterDelta } from './characterDelta';
import { isStaleCharacterSnapshot, applyPendingCharacterPatches } from './characterUpdateQueue';
const first='2026-11-27T01:00:00.000001+00:00', second='2026-11-27T01:00:00.000002+00:00', third='2026-11-27T01:00:00.000003+00:00';
const current={id:'a',updated_at:first,mana:10,conditions:[],name:'Mage'};
const delta={type:'character_delta',id:'a',base_revision:first,revision:second,changes:{mana:9,updated_at:second}};
test('delta updates only changed fields, preserving pending patches separately',()=>{
    const next=reconcileCharacterDelta(current,delta);
    expect(next.kind).toBe('applied');
    expect(next.snapshot).toEqual({...current,mana:9,updated_at:second});
    expect(applyPendingCharacterPatches(next.snapshot,[{updates:{mana:8}}]).mana).toBe(8);
});
test('duplicate and out-of-order events cannot roll state back within a millisecond',()=>{
    const newer={...current,updated_at:third,mana:8};
    expect(isStaleCharacterSnapshot(newer,{updated_at:second})).toBe(true);
    expect(reconcileCharacterDelta(newer,delta)).toEqual({kind:'old',snapshot:newer});
    expect(reconcileCharacterDelta({...current,updated_at:second},delta).kind).toBe('old');
});
test('missing revision and invalid messages request full recovery',()=>{
    expect(reconcileCharacterDelta(current,{...delta,base_revision:'missing'}).kind).toBe('gap');
    expect(reconcileCharacterDelta(current,{...delta,changes:{...delta.changes,xp_history:[]}}).kind).toBe('gap');
    expect(reconcileCharacterDelta(current,{...delta,id:'b'}).kind).toBe('gap');
});
