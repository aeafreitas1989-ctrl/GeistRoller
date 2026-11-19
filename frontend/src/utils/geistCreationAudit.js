// Optional 2e character-creation diagnostic; never mutates an established character.
const ATTRIBUTE_GROUPS = [
    ['intelligence', 'wits', 'resolve'],
    ['strength', 'dexterity', 'stamina'],
    ['presence', 'manipulation', 'composure'],
];
const SKILL_GROUPS = [
    ['academics','computer','crafts','investigation','medicine','occult','politics','science'],
    ['athletics','brawl','drive','firearms','larceny','stealth','survival','weaponry'],
    ['animal_ken','empathy','expression','intimidation','persuasion','socialize','streetwise','subterfuge'],
];
const sum = (items) => items.reduce((total, value) => total + (Number(value) || 0), 0);
export const validateGeistCreation = (character = {}) => {
    const errors = []; const warnings = [];
    const synergy = Number(character.synergy ?? 1);
    const geistRank = Number(character.geist_rank ?? 3);
    const merits = Array.isArray(character.merits_list) ? character.merits_list : [];
    const dreadGeist = merits.some((merit) => String(merit?.name).toLowerCase() === 'dread geist');
    const spentMerits = sum(merits.map((merit) => merit?.dots));
    const expectedMerits = 10 - (synergy - 1) * 5;
    if (![1, 2, 3].includes(synergy)) errors.push('Starting Synergy must be 1–3 (Synergy 2 costs 5 Merit dots; Synergy 3 costs 10).');
    if (!dreadGeist && geistRank !== 3) errors.push('The starting geist must be Rank 3 unless modified by Dread Geist.');
    if (dreadGeist) warnings.push('Confirm the Dread Geist exception and Rank with the Storyteller.');
    if (merits.length && spentMerits > Math.max(0, expectedMerits)) errors.push('Merit dots exceed the budget after the starting Synergy purchase.');
    if (!character.innate_key || !character.geist_innate_key) errors.push('Choose both innate Keys (Sin-Eater and geist).');
    if (!character.burden) warnings.push('Choose a Burden.');
    const hauntTotal = sum(Object.values(character.haunts || {}));
    if (hauntTotal !== 3) errors.push('Allocate exactly 3 starting Haunt dots.');
    if ((character.specialties || []).length !== 3) errors.push('Choose 3 Skill Specialties.');
    const attributes = ATTRIBUTE_GROUPS.map((group) => sum(group.map((name) => Math.max(0, Number(character.attributes?.[name] ?? 1) - 1))));
    if ([...attributes].sort((a,b)=>a-b).join(',') !== '3,4,5') errors.push('Allocate Attribute categories as 5/4/3 dots above the starting 1-dot minimum.');
    const skills = SKILL_GROUPS.map((group) => sum(group.map((name) => character.skills?.[name])));
    if ([...skills].sort((a,b)=>a-b).join(',') !== '4,7,11') errors.push('Allocate Skill categories as 11/7/4 dots.');
    return { valid: errors.length === 0, errors, warnings, reports: { synergy, geistRank, hauntTotal, spentMerits, availableMerits: expectedMerits, attributes, skills } };
};
