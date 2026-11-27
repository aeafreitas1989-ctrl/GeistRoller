import { withGameClockCheckpoint, getGameTimestamp, getRawGameTimestamp, isGameClockBehind, startTimedEffect, isEffectExpired, getEffectDateLabels } from './effectDuration';
import { advanceEnvironmentalExposure } from './environmentalExposure';
import { getWoundHealingDeadlines, restartNaturalHealing } from './naturalHealing';
import { prepareTimeTransition } from './timeTransitionSummary';
const clock = (date,time='10:00') => ({date,time,temperature:'20'});
const today = clock('1607-01-24'), yesterday=clock('1607-01-23'), later=clock('1607-01-24','10:15');
test('rewind and restore cannot replay elapsed time; deadline includes calendar date',()=>{
    const spell=startTimedEffect({name:'Nightvision',duration:'1 hour'},today);
    const back=withGameClockCheckpoint(today,yesterday);
    expect(isGameClockBehind(back)).toBe(true);
    expect(getRawGameTimestamp(back)).toBeLessThan(getGameTimestamp(back));
    const restored=withGameClockCheckpoint(back,today);
    expect(getGameTimestamp(restored)).toBe(getGameTimestamp(today));
    expect(isGameClockBehind(restored)).toBe(false);
    expect(isEffectExpired(spell,restored)).toBe(false);
    expect(getEffectDateLabels(spell)).toEqual({started:'1607/01/24 10:00',expires:'1607/01/24 11:00'});
    expect(isEffectExpired(spell,clock('1607-01-24','11:00'))).toBe(true);
});
test('untimed, permanent, scene and turn Conditions record full start date and never restart existing turn counters',()=>{
    for(const duration of ['Permanent','Scene','2 turns','Indefinite']) {
        const effect=startTimedEffect({name:'Example',duration},today);
        expect(effect.started_at).toBe('1607-01-24T10:00:00.000Z');
        expect(effect.expires_at).toBeUndefined();
        if(effect.tracking_mode==='turn')expect(startTimedEffect({...effect,turns_remaining:1},later).turns_remaining).toBe(1);
    }
});
test('wound deadlines remain absolute when the clock is corrected backwards',()=>{
    const boxes=['lethal','bashing','empty'];const recovery=restartNaturalHealing(boxes,today);
    const expected=['1607-01-26T10:15:00.000Z','1607-01-24T10:15:00.000Z',null];
    expect(getWoundHealingDeadlines(boxes,recovery,today)).toEqual(expected);
    expect(getWoundHealingDeadlines(boxes,recovery,withGameClockCheckpoint(today,yesterday))).toEqual(expected);
    const back=advanceEnvironmentalExposure({scene_tracker:today,health_boxes:boxes,natural_healing:recovery},yesterday);
    const restored=advanceEnvironmentalExposure({scene_tracker:back.tracker,health_boxes:back.boxes,natural_healing:back.recovery},today);
    expect(restored.healed).toBe(0);expect(restored.boxes).toEqual(boxes);
    const advanced=advanceEnvironmentalExposure({scene_tracker:restored.tracker,health_boxes:restored.boxes,natural_healing:restored.recovery},later);
    expect(advanced.healed).toBe(1);
});
test('rewind before beginning of cold exposure does not reset exposure or repeat damage',()=>{
    const scene={...today,temperature:'-5',environmental_exposure:{kind:'Extreme Cold',since:'1607-01-24T09:00:00.000Z',last_tick_at:'1607-01-24T10:00:00.000Z'}};
    const c={scene_tracker:scene,health_boxes:['bashing','empty'],natural_healing:restartNaturalHealing(['bashing','empty'],scene)};
    const b=advanceEnvironmentalExposure(c,{...scene,date:'1607-01-23'});
    const r=advanceEnvironmentalExposure({...c,scene_tracker:b.tracker,health_boxes:b.boxes,natural_healing:b.recovery},scene);
    expect(b.tracker.environmental_exposure).toEqual(scene.environmental_exposure);
    expect(r.bashing).toBe(0);expect(r.healed).toBe(0);
});
test('central transition stamps new Conditions without fabricating missing legacy dates or moving existing expiry',()=>{
    const old={name:'Legacy',duration:'Permanent'};
    const r=prepareTimeTransition({scene_tracker:today,conditions:[old]},{conditions:[old,{name:'New',duration:'1 hour'}]});
    expect(r.cleaned.conditions[0]).toEqual(old);
    expect(r.cleaned.conditions[1].expires_at).toBe('1607-01-24T11:00:00.000Z');
    const back=prepareTimeTransition({scene_tracker:today,conditions:r.cleaned.conditions},{scene_tracker:yesterday});
    expect(back.cleaned.scene_tracker.processed_at).toBe('1607-01-24T10:00:00.000Z');
    expect(back.summary).toBeNull();
});
