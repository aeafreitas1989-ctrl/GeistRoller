// Non-Ruling improvised spells incur a single Mana surcharge, regardless of
// the number/order of participating Arcana.
export const requiresImprovisedMana = (spellType, arcana, rulingArcana = [], legacyRulingArcanum = '') =>
    spellType === 'improvised' &&
    [...new Set((arcana || []).filter(Boolean))].some(name =>
        !rulingArcana.includes(name) && name !== legacyRulingArcanum);
