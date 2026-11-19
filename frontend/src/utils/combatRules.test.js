import {resolveArmoredDamage,attackDicePool} from './combatRules';
test('ballistic armor downgrades lethal rather than absorbing it',()=>{
 expect(resolveArmoredDamage({amount:2,damageType:'lethal',sourceProfile:'ballistic',equippedBallistic:2})).toEqual({aggravated:0,lethal:0,bashing:2});
 expect(resolveArmoredDamage({amount:3,damageType:'lethal',sourceProfile:'ballistic',equippedGeneral:1,equippedBallistic:1})).toEqual({aggravated:0,lethal:1,bashing:1});
});
test('armored lethal impact still inflicts shock when fully stopped',()=>{
 expect(resolveArmoredDamage({amount:1,damageType:'lethal',sourceProfile:'general',equippedGeneral:3}).bashing).toBe(1);
});
test('wound penalty applies equally to combat attacks',()=>{
 expect(attackDicePool(7,-2)).toBe(5);expect(attackDicePool(1,-3)).toBe(0);
});
