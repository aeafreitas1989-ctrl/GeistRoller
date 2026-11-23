// Chronicles of Darkness 2e Environmental Tilts: scene hazards versus individual exposure.
// Situational details are entered by the Storyteller; unknown severity never invents dice penalties.
import { getGameTimestamp } from './effectDuration';

const n = (value, max = 1000) => Math.max(0, Math.min(max, Number(value) || 0));
export const coldWeatherGearEquipped = (items = []) => Array.isArray(items) && items.some((item) =>
    item?.type === 'equipment' && item?.equipped === true &&
    (item?.equipment?.protection === 'cold_weather' ||
        String(item?.name || '').trim().toLowerCase() === 'cold weather gear'));

export const temperatureHazard = (tracker = {}) => {
    const temp = Number(tracker?.temperature);
    if (!Number.isFinite(temp)) return null;
    if (temp < 0) return 'Extreme Cold';
    if (temp > 40) return 'Extreme Heat';
    return null;
};

export const temperatureExposure = (character = {}, tracker = character?.scene_tracker || {}) => {
    const sceneHazard = temperatureHazard(tracker);
    const manual = (character?.conditions || []).find((c) =>
        ['Extreme Cold', 'Extreme Heat'].includes(c?.name) && c?.type === 'tilt' &&
        c?.status !== 'expired' && !c?.weather_auto);
    // A manually applied Personal Tilt (hypothermia, fever, magic) survives
    // weather protection; the Storyteller must end that Tilt separately.
    if (manual) return manual.name;
    if (!sceneHazard) return null;
    if (sceneHazard === 'Extreme Cold' && coldWeatherGearEquipped(character?.inventory_items) &&
        tracker?.cold_gear_adequate !== false) return null;
    if (tracker?.temperature_protected === true) return null;
    return sceneHazard;
};

export const activeEnvironmentalTiltNames = (character = {}, tracker = character?.scene_tracker || {}) => {
    const names = new Set((character?.conditions || [])
        .filter((c) => c?.group === 'tilt-environmental' && c?.status !== 'expired')
        .map((c) => c?.name).filter(Boolean));
    const temp = temperatureHazard(tracker);
    if (temp) names.add(temp);
    if (tracker?.precipitation === 'rain' && ['heavy', 'violent'].includes(tracker?.intensity)) names.add('Heavy Rain');
    if (tracker?.precipitation === 'snow' && ['heavy', 'violent'].includes(tracker?.intensity) &&
        ['strong', 'gale'].includes(tracker?.wind)) names.add('Blizzard');
    if (['strong', 'gale'].includes(tracker?.wind)) names.add('Heavy Winds');
    if (n(tracker?.flood_depth_feet) > 0 || tracker?.flooded === true) names.add('Flooded');
    if (tracker?.icy_ground === true) names.add('Ice');
    if (tracker?.earthquake_active === true) names.add('Earthquake');
    return names;
};

export const exposurePenalty = (character = {}, tracker = character?.scene_tracker || {}) => {
    const kind = temperatureExposure(character, tracker);
    const exposure = tracker?.environmental_exposure;
    if (!kind || !exposure || exposure.kind !== kind) return 0;
    const now = getGameTimestamp(tracker);
    const began = Date.parse(exposure.since || '');
    if (now === null || !Number.isFinite(began) || now < began) return 0;
    return -Math.min(5, Math.floor((now - began) / 3600000));
};

const affected = (name, tracker, character) => {
    if (['Extreme Cold', 'Extreme Heat'].includes(name)) return temperatureExposure(character, tracker) === name;
    if (tracker?.sheltered && ['Blizzard', 'Heavy Rain', 'Heavy Winds'].includes(name)) return false;
    return true;
};

export const getEnvironmentalRollModifiers = ({
    character = {}, tracker = character?.scene_tracker || {},
    physical = false, dexterity = false, perception = 'none', ranged = false,
    distanceYards = 0, driving = false, fullSpeed = false, defenseBased = false,
} = {}) => {
    const names = activeEnvironmentalTiltNames(character, tracker);
    const parts = [];
    const add = (name, amount) => { if (amount) parts.push({ name, amount }); };
    add('Extreme Temperature', exposurePenalty(character, tracker));
    if (names.has('Heavy Rain') && affected('Heavy Rain', tracker, character) &&
        ['visual', 'auditory'].includes(perception)) add('Heavy Rain', -3);
    if (names.has('Heavy Winds')) {
        const exposed = affected('Heavy Winds', tracker, character);
        if (exposed && perception === 'auditory') add('Heavy Winds (hearing)', -3);
        // An enclosed vehicle shelters its occupants from debris, but a
        // character driving in the wind still suffers its Physical penalty.
        if (physical && (exposed || driving)) add('Heavy Winds (Physical)', -n(tracker?.wind_grade, 5));
    }
    if (names.has('Blizzard') && affected('Blizzard', tracker, character)) {
        if (perception === 'visual' || ranged) {
            add('Blizzard (visibility)', -(1 + Math.floor(n(distanceYards, 1000) / 10)));
        }
        if (physical) add('Blizzard (snow depth)', -Math.floor(n(tracker?.snow_depth_inches, 1000) / 4));
    }
    if (names.has('Flooded') && physical) add('Flooded', -2 * n(tracker?.flood_depth_feet, 30));
    if (names.has('Earthquake') && dexterity) add('Earthquake', -n(tracker?.earthquake_severity, 5));
    if (names.has('Ice') && physical && !defenseBased) add('Ice', driving ? -5 : (fullSpeed ? -4 : -2));
    return { modifier: parts.reduce((total, part) => total + part.amount, 0), breakdown: parts };
};

export const getEnvironmentalStats = (character = {}, tracker = character?.scene_tracker || {}) => {
    const names = activeEnvironmentalTiltNames(character, tracker);
    const ice = names.has('Ice');
    const earthquake = names.has('Earthquake') ? n(tracker?.earthquake_severity, 5) : 0;
    return { defensePenalty: -(earthquake + (ice ? 2 : 0)), speedMultiplier: ice ? 0.5 : 1,
        drivingPenalty: ice ? -5 : 0 };
};

export const environmentalTurnHazards = (character = {}, tracker = character?.scene_tracker || {}) => {
    const names = activeEnvironmentalTiltNames(character, tracker);
    const hazards = [];
    if (names.has('Earthquake')) hazards.push({ name: 'Earthquake', damage: n(tracker?.earthquake_damage, 3),
        type: 'lethal', avoid: 'Stamina + Athletics: success downgrades to Bashing; exceptional success cancels damage' });
    if (names.has('Heavy Winds') && affected('Heavy Winds', tracker, character)) hazards.push({ name: 'Heavy Winds',
        damage: n(tracker?.wind_grade, 5), type: 'bashing', avoid: 'Reflexive Dexterity + Athletics to avoid flying debris' });
    return hazards.filter((hazard) => hazard.damage > 0);
};

export const makeWeatherConditions = (tracker = {}) => {
    const hazards = [];
    const add = (name, description) => hazards.push({
        name, definition_key: `${name} [Environmental Tilt]`, type: 'tilt', group: 'tilt-environmental',
        description, effect: description, origin: 'Weather', target_type: 'scene', target_id: 'scene',
        target_name: String(tracker?.location_name || '').trim() || 'Current Location', weather_auto: true,
        shelter_mitigates: ['Extreme Cold', 'Extreme Heat', 'Blizzard', 'Heavy Rain', 'Heavy Winds'].includes(name),
        mitigated_by_shelter: ['Extreme Cold', 'Extreme Heat'].includes(name) ?
            tracker?.temperature_protected === true :
            !!tracker?.sheltered && ['Blizzard', 'Heavy Rain', 'Heavy Winds'].includes(name),
    });
    const name = temperatureHazard(tracker);
    if (name) add(name, 'Extreme temperature exposure; see Tilt rules and exposure tracker.');
    if (tracker?.precipitation === 'rain' && ['heavy', 'violent'].includes(tracker?.intensity)) add('Heavy Rain', 'Heavy rainfall affects vision and hearing.');
    if (tracker?.precipitation === 'snow' && ['heavy', 'violent'].includes(tracker?.intensity) &&
        ['strong', 'gale'].includes(tracker?.wind)) add('Blizzard', 'Blowing snow impairs visibility and movement.');
    if (['strong', 'gale'].includes(tracker?.wind)) add('Heavy Winds', 'High winds impair hearing and Physical actions.');
    if (n(tracker?.flood_depth_feet) > 0 || tracker?.flooded === true) add('Flooded', 'Flood depth determines the Physical penalty.');
    if (tracker?.icy_ground === true) add('Ice', 'Slippery ground impairs Speed, Defense and Physical actions.');
    if (tracker?.earthquake_active === true) add('Earthquake', 'Earthquake severity affects Dexterity and Defense; damage is resolved per turn.');
    return hazards;
};
