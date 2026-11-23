import { advanceEnvironmentalExposure } from './environmentalExposure';
const C=(time='00:00',props={})=>({ scene_tracker:{date:'2026-11-23',time,temperature:'-5',...props},
    health_boxes:['empty','empty','empty','empty'], resistant_wounds:[false,false,false,false], natural_healing:null });
const later=(time,temp='-5')=>({date:'2026-11-23',time,temperature:temp});

test('first cold threshold establishes exposure, not retroactive damage',()=>{
    const c=C('00:00',{temperature:'15'});
    const r=advanceEnvironmentalExposure(c,later('00:00'));
    expect(r.bashing).toBe(0);
    expect(r.tracker.environmental_exposure.kind).toBe('Extreme Cold');
});

test('cold: 15 minutes heals resistant B and applies new ordinary B',()=>{
    const c=C('00:00');
    c.health_boxes=['bashing','empty','empty','empty'];c.resistant_wounds=[true,false,false,false];
    c.natural_healing={last_at:'2026-11-23T00:00:00.000Z',progress_ms:0,wound_type:'bashing'};
    c.scene_tracker.environmental_exposure={kind:'Extreme Cold',since:'2026-11-23T00:00:00.000Z',last_tick_at:'2026-11-23T00:00:00.000Z'};
    const r=advanceEnvironmentalExposure(c,later('00:15'));
    expect(r.boxes).toEqual(['bashing','empty','empty','empty']);
    expect(r.resistant_wounds).toEqual([false,false,false,false]);
    expect(r.bashing).toBe(1);
});

test('cold: 15m applies 1B if healthy; repeating same timestamp does not double damage',()=>{
    const c=C();
    c.scene_tracker.environmental_exposure={kind:'Extreme Cold',since:'2026-11-23T00:00:00.000Z',last_tick_at:'2026-11-23T00:00:00.000Z'};
    const r=advanceEnvironmentalExposure(c,later('00:15'));
    expect(r.boxes[0]).toBe('bashing');
    const repeat=advanceEnvironmentalExposure({...c, scene_tracker:r.tracker, health_boxes:r.boxes,
        resistant_wounds:r.resistant_wounds,natural_healing:r.recovery},r.tracker);
    expect(repeat.bashing).toBe(0);
    expect(repeat.boxes).toEqual(r.boxes);
});

test('six hours causes additional lethal while continuing ordinary recovery',()=>{
    const c=C();
    c.scene_tracker.environmental_exposure={kind:'Extreme Cold',since:'2026-11-23T00:00:00.000Z',last_tick_at:'2026-11-23T00:00:00.000Z'};
    const r=advanceEnvironmentalExposure(c,later('06:00'));
    expect(r.lethal).toBe(1);
});

test('adequate equipped cold gear prevents injury and allows normal recovery',()=>{
    const c=C();c.inventory_items=[{type:'equipment',equipped:true,name:'My gear',equipment:{protection:'cold_weather'}}];
    const r=advanceEnvironmentalExposure(c,later('01:00'));
    expect(r.bashing).toBe(0);expect(r.tracker.environmental_exposure).toEqual({});
});

test('heat uses the same bashing cycle and switching from heat to normal ends exposure',()=>{
    const c=C('00:00',{temperature:'42'});
    c.scene_tracker.environmental_exposure={kind:'Extreme Heat',since:'2026-11-23T00:00:00.000Z',last_tick_at:'2026-11-23T00:00:00.000Z'};
    const r=advanceEnvironmentalExposure(c,later('00:15','20'));
    expect(r.bashing).toBe(1);
    expect(r.tracker.environmental_exposure).toEqual({});
});


test('normal temperature: advance time saves the natural-healing count and Health change',()=>{
    const c=C('00:00',{temperature:'20'});
    c.health_boxes=['bashing','empty','empty','empty'];
    c.natural_healing={last_at:'2026-11-23T00:00:00.000Z',progress_ms:0,wound_type:'bashing'};
    const r=advanceEnvironmentalExposure(c,later('00:15','20'));
    expect(r.healed).toBe(1);
    expect(r.boxes).toEqual(['empty','empty','empty','empty']);
    expect(r.bashing).toBe(0);
});

test('15-minute environmental replacement reports healing and new B separately',()=>{
    const c=C();
    c.health_boxes=['bashing','empty','empty','empty'];
    c.natural_healing={last_at:'2026-11-23T00:00:00.000Z',progress_ms:0,wound_type:'bashing'};
    c.scene_tracker.environmental_exposure={kind:'Extreme Cold',since:'2026-11-23T00:00:00.000Z',last_tick_at:'2026-11-23T00:00:00.000Z'};
    const r=advanceEnvironmentalExposure(c,later('00:15'));
    expect(r.healed).toBe(1);
    expect(r.bashing).toBe(1);
    expect(r.boxes[0]).toBe('bashing');
});

test('cold past -5 continues B replacement as L begins after the fifth hour',()=>{
    const c=C('05:00');
    c.scene_tracker.environmental_exposure={kind:'Extreme Cold',since:'2026-11-23T00:00:00.000Z',last_tick_at:'2026-11-23T05:00:00.000Z'};
    const r=advanceEnvironmentalExposure(c,later('06:00'));
    expect(r.bashing).toBe(4);
    expect(r.lethal).toBe(1);
});
