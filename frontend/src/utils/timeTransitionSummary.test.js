import { prepareTimeTransition, remainingEffectLabel, formatElapsedMinutes } from './timeTransitionSummary';
const clock = (time, date='1607-01-24')=>({date,time});
const spell = (id,name,expires_at)=>({id,name,kind:'spell',duration:'1 week',expires_at});
test('clock transition shows expired, remaining days/hours/minutes and separate healing/damage',()=>{
    const old=clock('08:15'), next=clock('10:45');
    const c={id:'mage',scene_tracker:old,active_spells:[spell(1,'Nightvision','1607-01-24T09:00:00Z'),spell(2,'Lure and Repel','1607-01-30T00:13:00Z')],conditions:[{id:3,name:'Shaken',duration:'1 hour',expires_at:'1607-01-24T09:15:00Z'}]};
    const r=prepareTimeTransition(c,{scene_tracker:next},{kind:'clock',healing:{healed:2,healedByType:{bashing:2},bashing:1}});
    expect(r.summary.elapsed).toBe('2h 30min');
    expect(r.summary.expired.map(e=>e.name)).toEqual(['Nightvision','Shaken']);
    expect(r.summary.active[0].remaining).toBe('5d 13h 28min remaining');
    expect(r.summary.healed).toEqual([{name:'2 Bashing damage'}]);
    expect(r.summary.damage).toEqual([{name:'1 Bashing damage'}]);
    expect(r.cleaned.conditions).toHaveLength(1); expect(r.cleaned.conditions[0].status).toBe('expired'); expect(r.cleaned.active_spells).toHaveLength(2);
});
test('same-clock scene and turn expiration, and previous patch already removed scene spell',()=>{
    const c={scene_tracker:clock('12:00'),active_spells:[{id:1,name:'Scene spell',kind:'spell',duration:'Scene'},{id:2,name:'Turn effect',tracking_mode:'turn',turns_remaining:1}],conditions:[{id:3,name:'Persistent',persistent:true}]};
    const turn=prepareTimeTransition(c,{active_spells:[c.active_spells[0],{...c.active_spells[1],turns_remaining:0,status:'expired'}]},{kind:'turn'});
    expect(turn.summary.expired[0].name).toBe('Turn effect'); expect(turn.summary.elapsed).toBe('1 turn');
    const scene=prepareTimeTransition(c,{active_spells:[c.active_spells[1]]},{kind:'scene'});
    expect(scene.summary.expired[0].name).toBe('Scene spell'); expect(scene.summary.active.map(e=>e.name)).toEqual(['Turn effect','Persistent']);
});
test('manual resolution and already expired legacy entries are not newly expired',()=>{
    const c={scene_tracker:clock('12:00'),conditions:[{id:1,name:'Old',status:'expired'},{id:2,name:'Resolved'}]};
    const r=prepareTimeTransition(c,{conditions:[c.conditions[0]]});
    expect(r.summary).toBeNull(); expect(r.cleaned.conditions).toEqual([c.conditions[0]]);
});
test('clock crossing midnight includes dates; clock rewind does not report elapsed time',()=>{
    const c={scene_tracker:clock('23:30')}; const next=clock('01:00','1607-01-25');
    const r=prepareTimeTransition(c,{scene_tracker:next}); expect(r.summary.from).toBe('1607/01/24 23:30'); expect(r.summary.to).toBe('1607/01/25 01:00'); expect(r.summary.elapsed).toBe('1h 30min');
    expect(prepareTimeTransition(c,{scene_tracker:clock('22:00')}).summary).toBeNull();
});
test('active durations include all nonzero units and unresolved effects',()=>{
    expect(formatElapsedMinutes(1440+60+7)).toBe('1d 1h 7min');
    expect(remainingEffectLabel({tracking_mode:'turn',turns_remaining:2},clock('12:00'))).toBe('2 turns remaining');
    expect(remainingEffectLabel({duration:'Scene'},clock('12:00'))).toBe('Until end of scene');
    expect(remainingEffectLabel({persistent:true},clock('12:00'))).toContain('Persistent');
});

test('remaining wounds report time until the last wound of each type heals, including partial recovery',()=>{
    const next=clock('10:45');
    const c={scene_tracker:clock('10:30'), health_boxes:['aggravated','lethal','bashing','bashing','empty','empty']};
    const r=prepareTimeTransition(c,{scene_tracker:next,health_boxes:['aggravated','lethal','bashing','bashing','empty','empty'],natural_healing:{last_at:'1607-01-24T10:45:00Z',progress_ms:5*60000,wound_type:'bashing'}},{kind:'clock'});
    expect(r.summary.remaining).toEqual([{name:'2 Bashing',remaining:'25min'},{name:'1 Lethal',remaining:'2d 25min'},{name:'1 Aggravated',remaining:'9d 25min'}]);
});
test('remaining wounds use final Health, not net healing counts; blocked recovery is not assigned a timer',()=>{
    const old=clock('10:30'), next=clock('10:45');
    const c={scene_tracker:old,health_boxes:['bashing','empty']};
    const r=prepareTimeTransition(c,{scene_tracker:next,health_boxes:['bashing','empty'],natural_healing:{last_at:'1607-01-24T10:45:00Z',progress_ms:0,wound_type:'bashing'}},{kind:'clock',healing:{healed:1,healedByType:{bashing:1},bashing:1}});
    expect(r.summary.remaining).toEqual([{name:'1 Bashing',remaining:'15min'}]);
    expect(r.summary.healed).toEqual([{name:'1 Bashing damage'}]);
    expect(r.summary.damage).toEqual([{name:'1 Bashing damage'}]);
    const blocked=prepareTimeTransition(c,{scene_tracker:next,health_boxes:['lethal','lethal']},{kind:'clock'});
    expect(blocked.summary.remaining).toEqual([{name:'2 Lethal',remaining:'Medical treatment required'}]);
    const dead=prepareTimeTransition(c,{scene_tracker:next,health_boxes:['aggravated','aggravated']},{kind:'clock'});
    expect(dead.summary.remaining).toEqual([{name:'2 Aggravated',remaining:'No natural recovery'}]);
    expect(prepareTimeTransition(c,{scene_tracker:next,health_boxes:['empty','empty']},{kind:'clock'}).summary.remaining).toEqual([]);
});
