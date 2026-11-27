import { isAbyssalCondition, isAbyssalTaint } from './abyssalConditions';
import { findAbyssalIndex } from './abyssalSpellcasting';
import { isEffectExpired } from './effectDuration';
import { registerScouring } from './mageRecovery';
import { addWoundDamage } from './resistantWounds';
import { restartNaturalHealing } from './naturalHealing';
export const getAbyssalScouringPatch = (character,target,boxes) => {
    if (character?.character_type !== 'mage') return null;
    const conditions = character.conditions || [];
    const index = findAbyssalIndex(conditions,target);
    const entry = conditions[index];
    if (index < 0 || !(isAbyssalCondition(entry)||isAbyssalTaint(entry)) || isEffectExpired(entry,character.scene_tracker)) return null;
    const recorded = registerScouring(character.pattern_scouring,character.gnosis,character.scene_tracker,null);
    if (!recorded) return null;
    const damage = addWoundDamage(boxes,character.resistant_wounds,'lethal',1,true);
    if (!damage.applied) return null;
    return {conditions:conditions.filter((_,i)=>i!==index),pattern_scouring:recorded,health_boxes:damage.boxes,resistant_wounds:damage.resistant_wounds,health:damage.boxes.filter(box=>box!=='empty').length,natural_healing:restartNaturalHealing(damage.boxes,character.scene_tracker)};
};
