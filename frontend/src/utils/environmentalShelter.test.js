import { temperatureExposure, shelterMitigatesTilt, getEnvironmentalRollModifiers,
    environmentalTurnHazards, makeWeatherConditions, getEnvironmentalStats, exposurePenalty } from './environmentalTilts';
import { advanceEnvironmentalExposure } from './environmentalExposure';

const tracker = (patch = {}) => ({date:'2026-11-23', time:'00:00', temperature:'-5', ...patch});
const character = (scene_tracker, conditions = [], inventory_items = []) => ({
    scene_tracker, conditions, inventory_items, health_boxes:['empty','empty','empty','empty'],
    resistant_wounds:[false,false,false,false], natural_healing:null,
});

test('shelter ends ambient exposure to Extreme Cold and Heat', () => {
    expect(temperatureExposure(character(tracker()))).toBe('Extreme Cold');
    expect(temperatureExposure(character(tracker({sheltered:true})))).toBeNull();
    expect(temperatureExposure(character(tracker({temperature:'44', sheltered:true})))).toBeNull();
    expect(shelterMitigatesTilt(character(tracker({sheltered:true})), tracker({sheltered:true}), 'Extreme Cold')).toBe(true);
    expect(makeWeatherConditions(tracker({sheltered:true}))[0].mitigated_by_shelter).toBe(true);
    expect(makeWeatherConditions(tracker({temperature:'44', sheltered:true}))[0].mitigated_by_shelter).toBe(true);
});

test('shelter can be declared inadequate for temperature; extra protection remains available', () => {
    const unsafe = tracker({sheltered:true, shelter_temperature_adequate:false});
    expect(temperatureExposure(character(unsafe))).toBe('Extreme Cold');
    expect(makeWeatherConditions(unsafe)[0].mitigated_by_shelter).toBe(false);
    expect(temperatureExposure(character({...unsafe, temperature_protected:true}))).toBeNull();
    const gear = [{type:'equipment',equipped:true,equipment:{protection:'cold_weather'}}];
    expect(temperatureExposure(character(unsafe,[],gear))).toBeNull();
});

test('scene-level manual environmental Tilts use Shelter, but Personal Tilts persist', () => {
    const manualScene = [{name:'Extreme Cold',type:'tilt',group:'tilt-environmental'}];
    const personal = [{name:'Extreme Cold',type:'tilt',group:'tilt-personal'}];
    const comfortable = tracker({temperature:'18',sheltered:true});
    expect(temperatureExposure(character(comfortable,manualScene))).toBeNull();
    expect(temperatureExposure(character({...comfortable,sheltered:false},manualScene))).toBe('Extreme Cold');
    expect(temperatureExposure(character(comfortable,personal))).toBe('Extreme Cold');
    expect(shelterMitigatesTilt(character(comfortable,personal), comfortable, 'Extreme Cold')).toBe(false);
});

test('shelter suppresses weather penalties but not flooding, ice or earthquakes', () => {
    const rain = tracker({temperature:'10',sheltered:true,wind:'strong',wind_grade:4,precipitation:'rain',intensity:'heavy'});
    const c = character(rain);
    expect(getEnvironmentalRollModifiers({character:c,physical:true,perception:'auditory'}).modifier).toBe(0);
    expect(environmentalTurnHazards(c)).toEqual([]);
    expect(getEnvironmentalRollModifiers({character:c,physical:true,driving:true}).modifier).toBe(-4);
    const ground = tracker({temperature:'10',sheltered:true,icy_ground:true,
      flood_depth_feet:1,earthquake_active:true,earthquake_severity:2,earthquake_damage:1});
    const g=character(ground);
    expect(getEnvironmentalRollModifiers({character:g,physical:true,dexterity:true}).modifier).toBe(-6);
    expect(getEnvironmentalStats(g).defensePenalty).toBe(-4);
    expect(environmentalTurnHazards(g).map(h=>h.name)).toEqual(['Earthquake']);
});

test('existing hourly exposure penalty is removed immediately when Shelter is checked', () => {
    const t=tracker({time:'03:00', environmental_exposure:{kind:'Extreme Cold',since:'2026-11-23T00:00:00.000Z'}});
    expect(exposurePenalty(character(t))).toBe(-3);
    expect(exposurePenalty(character({...t,sheltered:true}))).toBe(0);
});

test('shelter ends the timer, prevents damage and leaving shelter starts a new timer', () => {
    const start=tracker({environmental_exposure:{kind:'Extreme Cold', since:'2026-11-23T00:00:00.000Z',last_tick_at:'2026-11-23T00:00:00.000Z'}});
    const c=character(start);
    const protectedState=advanceEnvironmentalExposure(c,{...start,sheltered:true});
    expect(protectedState.bashing).toBe(0);
    expect(protectedState.tracker.environmental_exposure).toEqual({});
    const later=advanceEnvironmentalExposure(character(protectedState.tracker),{...tracker({time:'01:00',sheltered:true})});
    expect(later.bashing).toBe(0);
    expect(later.tracker.environmental_exposure).toEqual({});
    const backOutside=advanceEnvironmentalExposure(character(later.tracker),tracker({time:'01:00',sheltered:false}));
    expect(backOutside.tracker.environmental_exposure.kind).toBe('Extreme Cold');
    expect(backOutside.tracker.environmental_exposure.since).toBe('2026-11-23T01:00:00.000Z');
    const first=advanceEnvironmentalExposure(character(backOutside.tracker),tracker({time:'01:15'}));
    expect(first.bashing).toBe(1);
});