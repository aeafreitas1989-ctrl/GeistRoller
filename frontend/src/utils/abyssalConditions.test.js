import { abyssalDuration, startAbyssalCondition, hasAbyssalTaint, makeAbyssalTaint } from './abyssalConditions';
import { prepareTimeTransition } from './timeTransitionSummary';
import { getEndScenePatch } from './sceneLifecycle';
import { advanceTurnEffects } from './effectDuration';
const clock = {date:'1607-01-24',time:'10:00'};
const tomorrow = {date:'1607-01-25',time:'10:00'};
const make = (name,wisdom=7) => startAbyssalCondition({name,id:name},wisdom,clock);
const mage = (conditions, extra={}) => ({id:'m',character_type:'mage',wisdom:7,scene_tracker:clock,conditions,arcane_beats:4,arcane_experience:2,...extra});
test('Wisdom tiers include Wisdom one in Falling',()=>{
    expect([10,8,7,4,3,1,0].map(abyssalDuration)).toEqual(['1 month','1 month','1 day','1 day','1 scene','1 scene','1 turn']);
});
test('timed lapse awards an Arcane Beat, converts five and creates permanent taint',()=>{
    const c=mage([make('Abyssal Imago')]);
    const pending=prepareTimeTransition(c,{scene_tracker:tomorrow});
    expect(pending.cleaned.arcane_beats).toBeUndefined();
    expect(pending.cleaned.conditions[0].status).toBe('expired');
    const next={...c,...pending.cleaned};
    const {cleaned,summary}=prepareTimeTransition(next,getEndScenePatch(next),{kind:'scene'});
    expect(cleaned.arcane_beats).toBe(0);
    expect(cleaned.arcane_experience).toBe(3);
    expect(cleaned.conditions.find(e=>e.name==='Abyssal Taint')).toEqual({...makeAbyssalTaint(),started_at:"1607-01-25T10:00:00.000Z"});
    expect(cleaned.conditions[0]).toMatchObject({clock_archived:true,lapse_finalized:true});
    expect(summary.expired.map(e=>e.name)).toEqual(['Abyssal Imago']);
    expect(summary.active.find(e=>e.name==='Abyssal Taint').remaining).toBe('Permanent');
    expect(hasAbyssalTaint(cleaned.conditions,tomorrow)).toBe(true);
});
test('multiple lapses earn individual Beats but one taint; existing taint persists',()=>{
    const c=mage([make('Abyssal Nimbus'),make('Abyssal Backlash'),makeAbyssalTaint()]);
    const pending=prepareTimeTransition(c,{scene_tracker:tomorrow});
    const next={...c,...pending.cleaned};
    const {cleaned}=prepareTimeTransition(next,getEndScenePatch(next),{kind:'scene'});
    expect(cleaned.conditions).toHaveLength(3);
    expect(cleaned.arcane_beats).toBe(1);
    expect(cleaned.arcane_experience).toBe(3);
    const again=prepareTimeTransition({...c,...cleaned,scene_tracker:tomorrow},{scene_tracker:{...tomorrow,time:'11:00'}});
    expect(again.cleaned.arcane_beats).toBeUndefined();
});
test('scene and turn lapse, unlike active resolution, produce taint',()=>{
    const scene=mage([make('Abyssal Nimbus',1)],{wisdom:1});
    expect(prepareTimeTransition(scene,getEndScenePatch(scene),{kind:'scene'}).cleaned.conditions[0].name).toBe('Abyssal Taint');
    const turn=mage([make('Abyssal Backlash',0)],{wisdom:0});
    const turnResult=prepareTimeTransition(turn,{conditions:advanceTurnEffects(turn.conditions)},{kind:'turn'});
    expect(turnResult.cleaned.conditions[0].lapse_finalized).toBe(true);
    expect(turnResult.cleaned.conditions[1].name).toBe('Abyssal Taint');
    const afterTurn={...turn,...turnResult.cleaned};
    expect(prepareTimeTransition(afterTurn,getEndScenePatch(afterTurn),{kind:'scene'}).cleaned.arcane_beats).toBeUndefined();
    expect(prepareTimeTransition(scene,{conditions:[]}).cleaned).toEqual({conditions:[]});
});
test('non-mage or familiar conditions do not taint the mage',()=>{
    const foreign={...make('Abyssal Imago'),target_type:'familiar'};
    expect(prepareTimeTransition(mage([foreign]),{scene_tracker:tomorrow}).cleaned.arcane_beats).toBeUndefined();
    expect(prepareTimeTransition({...mage([make('Abyssal Imago')]),character_type:'geist'},{scene_tracker:tomorrow}).cleaned.arcane_beats).toBeUndefined();
});
