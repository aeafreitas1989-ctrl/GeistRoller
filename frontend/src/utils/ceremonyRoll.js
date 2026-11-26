import { ATTRIBUTE_LIST, SKILL_LIST, CEREMONY_SKILL_KEY_MAP } from '../data/character-data';
// Only plain Attribute + Skill/Attribute pools may be automatically rolled.
// Contested or modified pools need Storyteller input; never silently discard their rules.
export const parseCeremonyDicePool = (text) => {
    if (typeof text !== 'string') return null;
    const match = /^\s*([A-Za-z ]+)\s*\+\s*([A-Za-z ]+)\s*$/.exec(text);
    if (!match) return null;
    const attrKey = match[1].trim().toLowerCase();
    const right = match[2].trim().replace(/\s+/g,' ');
    const normalized = right.toLowerCase().replace(/\s+/g,'_');
    const skillKey = CEREMONY_SKILL_KEY_MAP[right] || ({computers:'computer', craft:'crafts'}[normalized]) || normalized;
    if (!ATTRIBUTE_LIST.includes(attrKey)) return null;
    const isRightAttribute = ATTRIBUTE_LIST.includes(skillKey);
    if (!isRightAttribute && !SKILL_LIST.includes(skillKey)) return null;
    return {attrKey, skillKey, isRightAttribute};
};
