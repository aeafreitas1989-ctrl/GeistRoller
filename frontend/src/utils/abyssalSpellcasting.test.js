import { getAbyssalCastingEffects, abyssalParadoxModifiers, applyAbyssalOutcome, findAbyssalIndex } from './abyssalSpellcasting';
import { getAbyssalScouringPatch } from './abyssalScouring';
const clock={date:'1607-01-24',time:'12:00'};
const c=(name,id,paradox_successes)=>({name,id,paradox_successes});
const backlash=c('Abyssal Backlash','b',3), imago=c('Abyssal Imago','i',2), taint=c('Abyssal Taint','t'), nimbus=c('Abyssal Nimbus','n');
test('Backlash augments a triggered Paradox but cannot independently cause it',()=>{
    const e=getAbyssalCastingEffects([backlash,nimbus],clock);
    expect(abyssalParadoxModifiers(e,0,12)).toEqual({triggered:false,imagoFailure:false,imagoDice:0,backlashDice:0,taintDice:0});
    expect(abyssalParadoxModifiers(e,2,12).backlashDice).toBe(3);
});
test('Taint triggers Paradox even without excess Reach; Nimbus does not add dice',()=>{
    const e=getAbyssalCastingEffects([taint,backlash,nimbus],clock);
    const r=abyssalParadoxModifiers(e,0,12);expect(r.triggered).toBe(true);expect(r.taintDice).toBe(1);expect(r.backlashDice).toBe(3);
});
test('Imago requires extra Reach; refusing it forces automatic failure and adds spell pool',()=>{
    const e=getAbyssalCastingEffects([imago],clock);expect(e.imagoReach).toBe(2);
    expect(abyssalParadoxModifiers(e,0,12,true).triggered).toBe(false);
    expect(abyssalParadoxModifiers(e,0,12,false)).toEqual({triggered:true,imagoFailure:true,imagoDice:12,backlashDice:0,taintDice:0});
});
test('missing severity is explicit; expired and foreign conditions are ignored',()=>{
    const e=getAbyssalCastingEffects([c('Abyssal Imago','missing'),{...backlash,status:'expired'},{...taint,target_type:'familiar'}],clock);
    expect(e.missing.map(x=>x.id)).toEqual(['missing']);expect(e.taint).toBe(false);expect(e.backlashDice).toBe(0);
});
test('Backlash modifier is spent on first risky roll; full containment resolves only old Backlash',()=>{
    const spent=applyAbyssalOutcome([backlash,imago],clock,[backlash],'paradox-rolled');expect(spent[0].backlash_spent).toBe(true);
    expect(getAbyssalCastingEffects(spent,clock).backlashDice).toBe(0);
    const newer=c('Abyssal Backlash','new',2);
    expect(applyAbyssalOutcome([...spent,newer],clock,[backlash],'fully-contained')).toEqual([imago,newer]);
    expect(applyAbyssalOutcome([imago,taint],clock,[imago],'safe-spell-success')).toEqual([taint]);
});
test('Scouring is atomic, applies resistant lethal, changes no Mana or Beats',()=>{
    const mage={character_type:'mage',gnosis:4,mana:6,scene_tracker:clock,conditions:[taint,nimbus],pattern_scouring:[],resistant_wounds:[]};
    const patch=getAbyssalScouringPatch(mage,taint,['empty','empty','empty']);
    expect(patch.conditions).toEqual([nimbus]);expect(patch.health_boxes).toEqual(['lethal','empty','empty']);expect(patch.resistant_wounds).toEqual([true,false,false]);expect(patch.pattern_scouring).toHaveLength(1);expect(patch.mana).toBeUndefined();expect(patch.arcane_beats).toBeUndefined();
    expect(getAbyssalScouringPatch({...mage,pattern_scouring:patch.pattern_scouring},taint,['empty','empty','empty'])).toBeNull();
    expect(findAbyssalIndex([taint,taint],taint)).toBe(-1);
});
