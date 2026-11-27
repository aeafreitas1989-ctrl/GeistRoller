import { CONDITION_DEFINITIONS } from "../data/conditions-data";
import { LEGACY_CONDITION_TEXT } from "../data/condition-legacy-text";
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


test('retired catalogue descriptions are not appended to revised rules',()=>{
 for(const [key,oldTexts] of Object.entries(LEGACY_CONDITION_TEXT)){
   for(const text of oldTexts){
     const x=getDisplayedConditionRules({definition_key:key,name:CONDITION_DEFINITIONS[key].name,description:text},CONDITION_DEFINITIONS);
     expect(x.effect).toBe(CONDITION_DEFINITIONS[key].effect);
     expect(x.resolution).toBe(CONDITION_DEFINITIONS[key].resolution);
   }
 }
});
test('old text explicitly customized by ST is not discarded',()=>{
 const old=LEGACY_CONDITION_TEXT.Inspired[0];
 const x=getDisplayedConditionRules({name:'Inspired',description:old,rule_customized:true},CONDITION_DEFINITIONS);
 expect(x.effect).toBe(old);
});
test('new activation detail remains visible',()=>{
 const x=getDisplayedConditionRules({name:'Caul',description:'Caul is active with 2 charges.'},CONDITION_DEFINITIONS);
 expect(x.effect).toContain('2 charges');
 expect(x.effect).toContain(CONDITION_DEFINITIONS.Caul.effect);
});
