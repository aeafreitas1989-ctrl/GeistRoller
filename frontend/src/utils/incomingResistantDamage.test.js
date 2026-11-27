import { resolveArmoredDamage } from './combatRules';
import { applyResolvedDamage, healWound } from './resistantWounds';

const empty = ['empty','empty','empty','empty'];
test('incoming damage can be Resistant at every severity',()=>{
    for(const kind of ['bashing','lethal','aggravated']) {
        const damage=resolveArmoredDamage({amount:2,damageType:kind});
        const result=applyResolvedDamage(empty,[],damage,true);
        expect(result.boxes).toEqual([kind,kind,'empty','empty']);
        expect(result.resistant_wounds).toEqual([true,true,false,false]);
        expect(result.applied).toBe(2);
        expect(healWound(result.boxes,result.resistant_wounds,kind)).toBeNull();
    }
});
test('ordinary incoming damage is unchanged and does not clear older Resistant marks',()=>{
    const result=applyResolvedDamage(['bashing','empty','empty','empty'],[true,false,false,false],{lethal:1});
    expect(result.boxes).toEqual(['lethal','bashing','empty','empty']);
    expect(result.resistant_wounds).toEqual([false,true,false,false]);
});
test('armour downgrades Resistant damage before wounds are marked',()=>{
    const damage=resolveArmoredDamage({amount:3,damageType:'lethal',sourceProfile:'ballistic',equippedBallistic:2,equippedGeneral:1});
    const result=applyResolvedDamage(empty,[],damage,true);
    expect(result.boxes).toEqual(['bashing','bashing','empty','empty']);
    expect(result.resistant_wounds).toEqual([true,true,false,false]);
});
test('fully absorbed damage creates no Resistant wounds',()=>{
    const damage=resolveArmoredDamage({amount:1,damageType:'bashing',equippedGeneral:2});
    const result=applyResolvedDamage(empty,[],damage,true);
    expect(result.applied).toBe(0);
    expect(result.resistant_wounds).toEqual([false,false,false,false]);
});
test('incoming Resistant damage on a full Health track preserves resistance on upgrade',()=>{
    const result=applyResolvedDamage(['lethal','bashing'],[false,false],{lethal:1},true);
    expect(result.boxes).toEqual(['lethal','lethal']);
    expect(result.resistant_wounds).toEqual([false,true]);
    expect(result.applied).toBe(1);
});
