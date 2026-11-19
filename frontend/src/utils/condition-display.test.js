import { getDisplayedConditionRules } from './condition-display';
const catalogue={Informed:{description:'Vague research bonus',effect:'Failure becomes success; success becomes exceptional.',resolution:'Spend the benefit.',source_citation:'CoD 2e'},Caul:{description:'Vague transformation',effect:'Spend charges for transformations.',resolution:'End Haunt.'}};
test('legacy catalogue conditions display current precise rules',()=>{
 const x=getDisplayedConditionRules({name:'Informed',description:'Vague research bonus'},catalogue);
 expect(x.effect).toMatch(/Failure becomes success/);
 expect(x.source).toBe('CoD 2e');
});
test('named activation detail survives revised effect text',()=>{
 const x=getDisplayedConditionRules({name:'Caul',description:'Caul is active with 2 charges.'},catalogue);
 expect(x.effect).toContain('Spend charges');expect(x.effect).toContain('2 charges');
});
test('ST custom entries remain unchanged',()=>{
 const x=getDisplayedConditionRules({name:'Informed',type:'custom',description:'Personal change',resolution:'ST decision'},catalogue);
 expect(x.effect).toBe('Personal change');
});
