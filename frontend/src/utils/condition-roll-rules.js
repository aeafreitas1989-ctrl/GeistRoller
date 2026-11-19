// Condition-specific calculation only. Relevance must be explicitly confirmed
// by the player; a condition's mere presence cannot imply its narrative target.
const SOCIAL_ATTRIBUTES = new Set(['presence', 'manipulation', 'composure']);
const SOCIAL_SKILLS = new Set(['animal_ken', 'empathy', 'expression', 'intimidation', 'persuasion', 'socialize', 'streetwise', 'subterfuge']);
const VULNERABLE_ATTRIBUTES = new Set(['stamina', 'resolve', 'composure']);

export const getConditionRollModifiers = ({
  conditions = [], rollType = 'attr-attr', primaryAttr = '', secondaryAttr = '', skill = '',
  guiltyDefense = false, notorietyKnown = false, connectedRelevant = false,
  obsessionRelevant = false,
} = {}) => {
  const names = new Set((conditions || []).filter(c => !c?.status || c.status !== 'expired').map(c => String(c?.name || '').toLowerCase()));
  const has = name => names.has(name.toLowerCase());
  const attrs = rollType === 'attr-attr' ? [primaryAttr, secondaryAttr] : rollType === 'attr-skill' ? [primaryAttr] : [];
  const usesSocial = attrs.some(a => SOCIAL_ATTRIBUTES.has(a)) || (rollType === 'attr-skill' && SOCIAL_SKILLS.has(skill));
  const usesDefensive = attrs.some(a => a === 'resolve' || a === 'composure');
  const usesVulnerable = attrs.some(a => VULNERABLE_ATTRIBUTES.has(a));
  const isAttributeOrSkill = rollType === 'attr-attr' || rollType === 'attr-skill';
  const parts = [];
  if (has('Broken') && isAttributeOrSkill) {
    const amount = rollType === 'attr-skill' && skill === 'intimidation' ? -5 : (usesSocial || attrs.includes('resolve') ? -2 : 0);
    if (amount) parts.push({ name: 'Broken', amount });
  }
  if (has('Deprived') && usesVulnerable) parts.push({ name: 'Deprived', amount: -1 });
  if (has('Guilty') && guiltyDefense && usesDefensive) parts.push({ name: 'Guilty (defense only)', amount: -2 });
  if (has('Notoriety') && notorietyKnown && usesSocial) parts.push({ name: 'Notoriety (known)', amount: -2 });
  if (has('Connected') && connectedRelevant && isAttributeOrSkill) parts.push({ name: 'Connected (relevant group)', amount: 2 });
  return {
    modifier: parts.reduce((sum, p) => sum + p.amount, 0),
    breakdown: parts,
    obsessionNineAgain: has('Obsession') && obsessionRelevant && isAttributeOrSkill,
  };
};

export const getPostRollConditionChoices = ({ conditions = [], rollType = 'attr-attr', nonCombatInformed = false, result = null } = {}) => {
  if (!result || result.is_dramatic_failure) return [];
  const names = new Set((conditions || []).filter(c => c?.status !== 'expired').map(c => String(c.name || '').toLowerCase()));
  const options = [];
  if (names.has('informed') && rollType === 'attr-skill' && nonCombatInformed) options.push('Informed');
  if (names.has('steadfast') && Number(result.successes) === 0) options.push('Steadfast');
  return options;
};

export const applyPostRollCondition = (result, conditionName) => {
  if (!result || result.is_dramatic_failure) return result;
  const successes = Number(result.successes) || 0;
  if (conditionName === 'Informed') {
    return { ...result, successes: Math.max(1, successes), is_exceptional: successes > 0,
      is_dramatic_failure: false, beat_awarded: false, condition_benefit: 'Informed',
      description: successes > 0 ? 'Exceptional Success (Informed)' : 'Success (Informed)' };
  }
  if (conditionName === 'Steadfast' && successes === 0) {
    return { ...result, successes: 1, is_exceptional: false, is_dramatic_failure: false,
      beat_awarded: false, condition_benefit: 'Steadfast', description: 'Success (Steadfast)' };
  }
  return result;
};

export const applyInspiredCondition = result => {
  if (!result || result.is_dramatic_failure) return result;
  return { ...result,
    is_exceptional: (Number(result.successes) || 0) >= 3,
    condition_benefit: 'Inspired',
    description: (Number(result.successes) || 0) >= 3 ? 'Exceptional Success (Inspired)' : result.description,
  };
};
