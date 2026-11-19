import {effectiveGeistRank,activateRemembrance,remembranceSkillBonus} from './remembranceRules';
test('effective Rank caps Remembrance and requires a specified trait',()=>{
 const c={synergy:1,geist_rank:3,plasm:6,remembrance_trait_type:'skill',remembrance_trait:'crafts'};
 expect(effectiveGeistRank(c)).toBe(1);expect(activateRemembrance(c,2)).toBeNull();
 const patch=activateRemembrance(c,1);
 expect(patch.plasm).toBe(5);
 expect(remembranceSkillBonus({...c,...patch},'crafts')).toBe(1);
 expect(remembranceSkillBonus({...c,...patch},'firearms')).toBe(0);
});
test('third Remembrance cannot overrun Rank 5 and does not reverse XP dots',()=>{
 const {completeRemembranceMilestone} = require('./remembranceRules');
 const base={character_type:'geist',synergy:4,geist_rank:5,remembrance_1_complete:true,remembrance_2_complete:true};
 expect(completeRemembranceMilestone(base,3)).toBeNull();
 const can={...base,geist_rank:3};
 const result=completeRemembranceMilestone(can,3,'2026-11-19T00:00:00Z');
 expect(result).toMatchObject({synergy:5,geist_rank:4,remembrance_3_complete:true});
 expect(result.remembrance_history).toHaveLength(1);
});
