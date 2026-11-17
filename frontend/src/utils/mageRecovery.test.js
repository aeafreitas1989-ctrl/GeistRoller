import { scourDailyLimit, remainingScourings, registerScouring, restoreScouredAttributes, hallowManaRemaining, recordHallowMana } from './mageRecovery';
const clock = (date, time) => ({ date, time });
const c = clock('2025-12-05', '10:00');
test('Scour tiers 1/2/3/4 per rolling day', () => {
  expect([1,4,5,6,7,9,10].map(scourDailyLimit)).toEqual([1,1,2,2,3,3,4]);
});
test('Scouring limit and restore exactly after 24 hours', () => {
  const entries=registerScouring([],3,c,'stamina');
  expect(entries).toHaveLength(1);
  expect(registerScouring(entries,3,c,'strength')).toBeNull();
  const char={ pattern_scouring: entries, scoured_attributes:{stamina:1}, attributes:{stamina:2}};
  expect(restoreScouredAttributes(char,clock('2025-12-06','09:59'))).toEqual({});
  const healed=restoreScouredAttributes(char,clock('2025-12-06','10:00'));
  expect(healed.attributes.stamina).toBe(3);
  expect(healed.scoured_attributes.stamina).toBeUndefined();
  expect(remainingScourings(entries,3,clock('2025-12-06','10:00'))).toBe(1);
});
test('Hallow 1 Mana per success and limited during a rolling 24 hours',()=>{
  const history=recordHallowMana([],2,c);
  expect(hallowManaRemaining(history,5,c)).toBe(3);
  expect(hallowManaRemaining(history,5,clock('2025-12-06','09:59'))).toBe(3);
  expect(hallowManaRemaining(history,5,clock('2025-12-06','10:00'))).toBe(5);
});
test('Unset game time cannot grant Scouring or Hallow Mana',()=>{
  expect(registerScouring([],1,clock('',''),'stamina')).toBeNull();
  expect(hallowManaRemaining([],5,clock('',''))).toBeNull();
});
