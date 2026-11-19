import {requiresImprovisedMana} from './mageCombinedMana';
test('combining a Ruling and Common Arcanum costs exactly one Mana irrespective of order',()=>{
 expect(requiresImprovisedMana('improvised',['Death','Forces'],['Death','Matter'])).toBe(true);
 expect(requiresImprovisedMana('improvised',['Forces','Death'],['Death','Matter'])).toBe(true);
 expect(requiresImprovisedMana('improvised',['Death','Matter'],['Death','Matter'])).toBe(false);
 expect(requiresImprovisedMana('rote',['Death','Forces'],['Death','Matter'])).toBe(false);
});
