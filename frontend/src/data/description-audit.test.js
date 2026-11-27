import { MERIT_LIST } from './character-data';
import { MERIT_DESCRIPTION_REVISIONS } from './merit-description-audit';
import { CONDITION_DEFINITIONS } from './conditions-data';
import { CONDITION_RULE_OVERRIDES } from './condition-rule-overrides';
import { CONDITION_DESCRIPTION_REVISIONS } from './condition-description-audit';
import { MERIT_DEFINITIONS } from './cards-data';

test('all 126 selectable Merits have distinct, explanatory catalogue descriptions', () => {
  expect(MERIT_LIST).toHaveLength(126);
  expect(Object.keys(MERIT_DESCRIPTION_REVISIONS)).toHaveLength(126);
  expect(new Set(MERIT_LIST.map(m => m.name)).size).toBe(126);
  expect(Object.keys(MERIT_DESCRIPTION_REVISIONS).sort()).toEqual(MERIT_LIST.map(m => m.name).sort());
  for (const merit of MERIT_LIST) {
    const text = MERIT_DESCRIPTION_REVISIONS[merit.name];
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(70);
    expect(text).not.toMatch(/^Prerequisites?:/i);
    expect(merit.description).toBe(text);
    expect(MERIT_DEFINITIONS[merit.name].description).toBe(text);
  }
});

test('all 198 Conditions and Tilts display either enhanced rules or the full audited description', () => {
  const known = Object.keys(CONDITION_DEFINITIONS).sort();
  expect(known).toHaveLength(198);
  expect(Object.keys(CONDITION_RULE_OVERRIDES)).toHaveLength(77);
  expect(Object.keys(CONDITION_DESCRIPTION_REVISIONS)).toHaveLength(121);
  const overlayNames = Object.keys(CONDITION_RULE_OVERRIDES);
  const revisionNames = Object.keys(CONDITION_DESCRIPTION_REVISIONS);
  expect(new Set([...overlayNames, ...revisionNames]).size).toBe(198);
  expect([...overlayNames, ...revisionNames].sort()).toEqual(known);
  for (const key of known) {
    const item = CONDITION_DEFINITIONS[key];
    const text = CONDITION_DESCRIPTION_REVISIONS[key] || CONDITION_RULE_OVERRIDES[key]?.effect;
    expect(item.effect).toBe(text);
    expect(item.description).toBe(text);
    expect(item.effect.length).toBeGreaterThan(70);
    // Some complete resolution instructions are legitimately brief (e.g. 'Stand up.').
    // Validate presence, not arbitrary character count.
    expect(typeof item.resolution).toBe('string');
    expect(item.resolution.trim().length).toBeGreaterThan(0);
  }
});

test('named result-changing Conditions remain mechanically distinct', () => {
  expect(CONDITION_DEFINITIONS.Informed.effect).toMatch(/failure to one success/);
  expect(CONDITION_DEFINITIONS.Inspired.effect).toMatch(/threshold.*5 successes to 3/);
  expect(CONDITION_DEFINITIONS.Steadfast.effect).toMatch(/failed roll/);
});
