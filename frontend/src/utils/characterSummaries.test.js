import { toCharacterSummary, updateCharacterSummary } from './characterSummaries';
const old = {id:'a',name:'Ashwood',character_type:'mage',updated_at:'2026-01-01T00:00:00Z'};
test('selector never stores a full character',()=>{
    expect(toCharacterSummary({...old, inventory_items:[1], xp_history:[2]})).toEqual(old);
    const list=[old];
    expect(updateCharacterSummary(list,{...old,inventory_items:[2]})).toBe(list);
});
test('summary updates are immutable, exclude full data and reject older snapshots',()=>{
    const list=[old,{id:'b',name:'Other'}];
    const next=updateCharacterSummary(list,{...old,name:'New',updated_at:'2026-01-02T00:00:00Z',conditions:[1]});
    expect(next[0]).toEqual({...old,name:'New',updated_at:'2026-01-02T00:00:00Z'});
    expect(next[1]).toBe(list[1]);
    expect(updateCharacterSummary(next,old)).toBe(next);
    expect(updateCharacterSummary(next,{id:'c',name:'Unknown'})).toBe(next);
});
