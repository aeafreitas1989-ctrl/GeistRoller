import { applyPendingCharacterPatches, isStaleCharacterSnapshot } from './characterUpdateQueue';
test('pending Mana and Conditions survive an older server snapshot', () => {
 const server = {id:'one', mana:10, conditions:[]};
 const pending = [{updates:{mana:8}}, {updates:{conditions:[{name:'Paradox Taint'}]}}];
 expect(applyPendingCharacterPatches(server,pending)).toMatchObject({mana:8, conditions:[{name:'Paradox Taint'}]});
});
test('later patch to same resource wins', () => {
 expect(applyPendingCharacterPatches({mana:10},[{updates:{mana:8}},{updates:{mana:7}}]).mana).toBe(7);
});
test('stale SSE updates are detected by timestamps', () => {
 expect(isStaleCharacterSnapshot({updated_at:'2026-11-19T10:00:02Z'},{updated_at:'2026-11-19T10:00:01Z'})).toBe(true);
});
