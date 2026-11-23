import { coldWeatherGearEquipped, temperatureExposure, temperatureHazard,
    getEnvironmentalRollModifiers, getEnvironmentalStats, environmentalTurnHazards,
    makeWeatherConditions, activeEnvironmentalTiltNames, exposurePenalty } from './environmentalTilts';
const ch = (tracker = {}, conditions = [], inventory_items = []) => ({ scene_tracker: tracker, conditions, inventory_items });
const marks = (character, options = {}) => getEnvironmentalRollModifiers({ character, ...options });

test('weather creates cold/heat but does not infer flooding from violent rain or ice from cold', () => {
    expect(temperatureHazard({temperature:'-5'})).toBe('Extreme Cold');
    expect(temperatureHazard({temperature:'41'})).toBe('Extreme Heat');
    expect(temperatureHazard({temperature:'0'})).toBeNull();
    const wet = makeWeatherConditions({ temperature: '8', precipitation: 'rain', intensity: 'violent' });
    expect(wet.map((c) => c.name)).toEqual(['Heavy Rain']);
    expect(wet[0].definition_key).toBe('Heavy Rain [Environmental Tilt]');
    expect(makeWeatherConditions({temperature:'-5'}).map((c) => c.name)).toEqual(['Extreme Cold']);
});

test('blizzard requires wind and heavy snow; flood and ice need explicit scene values', () => {
    expect(makeWeatherConditions({precipitation:'snow',intensity:'heavy',wind:'calm'}).map(x=>x.name)).not.toContain('Blizzard');
    expect(makeWeatherConditions({precipitation:'snow',intensity:'heavy',wind:'strong'}).map(x=>x.name)).toContain('Blizzard');
    const marks = makeWeatherConditions({flood_depth_feet:2, icy_ground:true, earthquake_active:true});
    expect(marks.map(x=>x.name)).toEqual(['Flooded','Ice','Earthquake']);
});

test('cold protection only when equipped and allowed; warmth/shelter stop exposure', () => {
    const gear = {type:'equipment',name:'Polar suit',equipped:true,equipment:{protection:'cold_weather'}};
    expect(coldWeatherGearEquipped([gear])).toBe(true);
    expect(coldWeatherGearEquipped([{...gear,equipped:false}])).toBe(false);
    expect(temperatureExposure(ch({temperature:'-3'},[],[gear]))).toBeNull();
    expect(temperatureExposure(ch({temperature:'-3',cold_gear_adequate:false},[],[gear]))).toBe('Extreme Cold');
    expect(temperatureExposure(ch({temperature:'42',temperature_protected:true}))).toBeNull();
});

test('exposure accumulates penalties per full hour, capped at five', () => {
    const c=ch({temperature:'-10',date:'2026-11-23',time:'03:00',environmental_exposure:{kind:'Extreme Cold',since:'2026-11-23T00:00:00Z'}});
    expect(exposurePenalty(c)).toBe(-3);
    expect(marks(c).modifier).toBe(-3);
});

test('heavy rain and wind hearing penalties are contextual; wind strength requires grade',()=>{
    const wet=ch({precipitation:'rain',intensity:'heavy',wind:'strong',wind_grade:2});
    expect(marks(wet,{perception:'auditory',physical:true}).modifier).toBe(-8);
    expect(marks(wet,{perception:'none',physical:false}).modifier).toBe(0);
    expect(marks(ch({wind:'strong'}),{physical:true}).modifier).toBe(0);
    expect(marks(ch({precipitation:'rain',intensity:'heavy',sheltered:true}),{perception:'visual'}).modifier).toBe(0);
});

test('blizzard visibility distance and snow depth accumulate independently',()=>{
    const b=ch({precipitation:'snow',intensity:'heavy',wind:'strong',snow_depth_inches:8});
    expect(marks(b,{perception:'visual',distanceYards:20,physical:true}).modifier).toBe(-5);
});

test('Flooded penalizes physical only, Earthquake Dex only, Ice full-speed/drive',()=>{
    const c=ch({flood_depth_feet:2,earthquake_active:true,earthquake_severity:3,icy_ground:true});
    expect(marks(c,{physical:true,dexterity:true}).modifier).toBe(-9);
    expect(marks(c,{physical:true,driving:true}).modifier).toBe(-9);
    expect(marks(c,{physical:true,fullSpeed:true}).modifier).toBe(-8);
    expect(getEnvironmentalStats(c)).toEqual({defensePenalty:-5,speedMultiplier:0.5,drivingPenalty:-5});
});

test('quake and wind expose turn-based damage requiring resistance rolls',()=>{
    const c=ch({wind:'gale',wind_grade:4,earthquake_active:true,earthquake_severity:3,earthquake_damage:2});
    const hazards=environmentalTurnHazards(c);
    expect(hazards).toEqual([
        expect.objectContaining({name:'Earthquake',damage:2,type:'lethal'}),
        expect.objectContaining({name:'Heavy Winds',damage:4,type:'bashing'}),
    ]);
});


test('Personal extreme cold persists despite equipped weather gear or ambient exemption',()=>{
    const gear={type:'equipment',equipped:true,equipment:{protection:'cold_weather'}};
    const c=ch({temperature:'-5',temperature_protected:true},
        [{name:'Extreme Cold',type:'tilt',group:'tilt-personal'}],[gear]);
    expect(temperatureExposure(c)).toBe('Extreme Cold');
});

test('enclosed vehicle avoids wind hearing penalty but not Drive penalty',()=>{
    const c=ch({wind:'gale',wind_grade:3,sheltered:true});
    expect(marks(c,{physical:true,driving:true}).modifier).toBe(-3);
    expect(marks(c,{perception:'auditory'}).modifier).toBe(0);
});


test('Dodge pool already derived from Defense does not double-apply Ice',()=>{
    const c=ch({icy_ground:true,wind:'strong',wind_grade:2});
    expect(marks(c,{physical:true,defenseBased:true}).modifier).toBe(-2);
});
