// On-screen Condition rules come from the verified catalogue. Preserve any
// per-activation notes (Haunt charges, named source, ST customizations).
export const getDisplayedConditionRules = (condition, catalogue) => {
  const entry = condition || {};
  const key = entry.definition_key || entry.name;
  const definition = key ? catalogue?.[key] : null;
  const savedText = String(entry.description || entry.effect || '').trim();
  if (!definition || entry.type === 'custom' || entry.rule_customized === true) {
    return { effect: String(entry.effect || entry.description || ''),
      resolution: String(entry.resolution || ''), source: '' };
  }
  const rule = String(definition.effect || definition.description || '');
  const initial = String(definition.description || '');
  const detail = savedText && savedText !== initial && savedText !== rule
    ? savedText : '';
  return {
    effect: detail ? `${rule}\n\nCurrent instance: ${detail}` : rule,
    resolution: String(definition.resolution || entry.resolution || ''),
    source: String(definition.source_citation || ''),
  };
};
