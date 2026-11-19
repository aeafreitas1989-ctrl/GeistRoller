import { MERIT_LIST, getMeritCategory } from './character-data';
import { MERIT_DEFINITIONS } from './cards-data';
import { CONDITION_DEFINITIONS } from './conditions-data';
const merit = name => MERIT_LIST.find(entry => entry.name === name);
test('all selectable Merits have canonical card descriptions and categories', () => {
  expect(MERIT_LIST.length).toBe(126);
  expect(Object.keys(MERIT_DEFINITIONS).length).toBe(MERIT_LIST.length);
  for (const item of MERIT_LIST) {
    expect(MERIT_DEFINITIONS[item.name]).toBeDefined();
    expect(MERIT_DEFINITIONS[item.name].description.length).toBeGreaterThan(10);
    expect(MERIT_DEFINITIONS[item.name].category).toBe(getMeritCategory(item.name));
  }
});
test('restricted Merit ratings agree with rules', () => {
  for (const [name,expected] of Object.entries({
    Familiar:[2,4], 'Iron Skin':[2,4], 'Trained Observer':[1,3],
    'Meditative Mind':[1,2,4], 'Crack Driver':[2,3],
    Barfly:[2], 'Tolerance for Biology':[1], Virtuous:[2]
  })) expect(merit(name).allowedDots).toEqual(expected);
});
test('Core result-changing Conditions remain distinct', () => {
  expect(CONDITION_DEFINITIONS.Informed.effect).toMatch(/failure to one success/);
  expect(CONDITION_DEFINITIONS.Inspired.effect).toMatch(/threshold.*5 successes to 3/);
  expect(CONDITION_DEFINITIONS.Steadfast.effect).toMatch(/failed roll/);
});