import { PREMADE_EQUIPMENT } from '../data/character-data';
import { isColdWeatherGearEquipped } from './coldWeatherGear';

test('Cold Weather Gear is a premade physical Equipment item with no invented dice bonus', () => {
    const preset = PREMADE_EQUIPMENT.find((entry) => entry.name === 'Cold Weather Gear');
    expect(preset).toBeDefined();
    expect(preset.category).toBe('Physical');
    expect(preset.bonus).toBe(0);
    expect(preset.protection).toBe('cold_weather');
});

test('only an equipped item provides a cold-weather-gear signal', () => {
    const gear = { type: 'equipment', name: 'Cold Weather Gear', equipped: false,
        equipment: { protection: 'cold_weather' } };
    expect(isColdWeatherGearEquipped([gear])).toBe(false);
    expect(isColdWeatherGearEquipped([{ ...gear, equipped: true }])).toBe(true);
    expect(isColdWeatherGearEquipped([{ ...gear, type: 'consumable', equipped: true }])).toBe(false);
});

test('renamed gear retains its marker; legacy named gear is recognized', () => {
    expect(isColdWeatherGearEquipped([{ type: 'equipment', name: 'My Polar Jacket', equipped: true,
        equipment: { protection: 'cold_weather' } }])).toBe(true);
    expect(isColdWeatherGearEquipped([{ type: 'equipment', name: 'Cold Weather Gear', equipped: true,
        equipment: {} }])).toBe(true);
    expect(isColdWeatherGearEquipped([{ type: 'equipment', name: 'Winter Coat', equipped: true,
        equipment: {} }])).toBe(false);
});

test('null or malformed inventory never grants protection', () => {
    expect(isColdWeatherGearEquipped(null)).toBe(false);
    expect(isColdWeatherGearEquipped([null, {}, 'Cold Weather Gear'])).toBe(false);
});
