import {getConditionRollModifiers, getPostRollConditionChoices, applyPostRollCondition, applyInspiredCondition} from './condition-roll-rules';
const conditions=(...names)=>names.map(name=>({name}));
test('Guilty never penalizes own Subterfuge; only defensive Resolve/Composure checks',()=>{
  expect(getConditionRollModifiers({conditions:conditions('Guilty'),rollType:'attr-skill',primaryAttr:'manipulation',skill:'subterfuge'}).modifier).toBe(0);
  expect(getConditionRollModifiers({conditions:conditions('Guilty'),rollType:'attr-attr',primaryAttr:'resolve',secondaryAttr:'composure',guiltyDefense:true}).modifier).toBe(-2);
});
test('Shaken does not automatically penalize any dice roll',()=>{
  expect(getConditionRollModifiers({conditions:conditions('Shaken'),rollType:'attr-attr',primaryAttr:'resolve',secondaryAttr:'composure'}).modifier).toBe(0);
});
test('Deprived affects Stamina Resolve Composure rolls only',()=>{
  expect(getConditionRollModifiers({conditions:conditions('Deprived'),rollType:'attr-skill',primaryAttr:'stamina',skill:'athletics'}).modifier).toBe(-1);
  expect(getConditionRollModifiers({conditions:conditions('Deprived'),rollType:'attr-attr',primaryAttr:'strength',secondaryAttr:'dexterity'}).modifier).toBe(0);
});
test('Notoriety and Connected are relevance gated',()=>{
  expect(getConditionRollModifiers({conditions:conditions('Connected','Notoriety'),rollType:'attr-skill',primaryAttr:'presence',skill:'persuasion'}).modifier).toBe(0);
  expect(getConditionRollModifiers({conditions:conditions('Connected','Notoriety'),rollType:'attr-skill',primaryAttr:'presence',skill:'persuasion',connectedRelevant:true,notorietyKnown:true}).modifier).toBe(0);
});
test('Obsession gives 9-again only when relevant',()=>{
  expect(getConditionRollModifiers({conditions:conditions('Obsession'),obsessionRelevant:false}).obsessionNineAgain).toBe(false);
  expect(getConditionRollModifiers({conditions:conditions('Obsession'),obsessionRelevant:true}).obsessionNineAgain).toBe(true);
});
test('Informed upgrades noncombat skill failure to success and success to exceptional',()=>{
  const base={successes:0,is_exceptional:false,is_dramatic_failure:false};
  expect(getPostRollConditionChoices({conditions:conditions('Informed'),rollType:'attr-skill',nonCombatInformed:true,result:base})).toEqual(['Informed']);
  expect(getPostRollConditionChoices({conditions:conditions('Informed'),rollType:'attr-attr',nonCombatInformed:true,result:base})).toEqual([]);
  expect(applyPostRollCondition(base,'Informed').successes).toBe(1);
  expect(applyPostRollCondition({...base,successes:2},'Informed').is_exceptional).toBe(true);
});
test('Steadfast converts ordinary failure into 1 success, not dramatic failure',()=>{
  expect(applyPostRollCondition({successes:0,is_dramatic_failure:false},'Steadfast').successes).toBe(1);
  expect(applyPostRollCondition({successes:0,is_dramatic_failure:true},'Steadfast').successes).toBe(0);
});
test('Inspired preserves failures and lowers exceptional threshold to 3',()=>{
  expect(applyInspiredCondition({successes:0,is_exceptional:false}).successes).toBe(0);
  expect(applyInspiredCondition({successes:3,is_exceptional:false}).is_exceptional).toBe(true);
  expect(applyInspiredCondition({successes:2,is_exceptional:false}).is_exceptional).toBe(false);
});
test('Broken creates higher penalty for Intimidation',()=>{
  expect(getConditionRollModifiers({conditions:conditions('Broken'),rollType:'attr-skill',primaryAttr:'presence',skill:'intimidation'}).modifier).toBe(-5);
});
