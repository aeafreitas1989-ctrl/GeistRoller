import { isAbyssalCondition, isAbyssalTaint } from './abyssalConditions';
import { isEffectExpired } from './effectDuration';

export const abyssalName = condition => String(condition?.definition_key || condition?.name || '').trim().toLowerCase();
export const needsParadoxSuccesses = condition => ['abyssal backlash','abyssal imago'].includes(abyssalName(condition));
export const validParadoxSuccesses = value => Number.isSafeInteger(Number(value)) && Number(value) > 0;
const key = condition => condition?.id != null ? 'id:'+condition.id : JSON.stringify([abyssalName(condition),condition?.origin || '',condition?.target_type || 'character',condition?.target_id || '',condition?.started_at || '',condition?.expires_at || '']);
export const sameAbyssalInstance = (left,right) => Boolean(left && right && key(left) === key(right));
export const findAbyssalIndex = (conditions,target) => {
    const matches = conditions.map((entry,index)=>sameAbyssalInstance(entry,target)?index:-1).filter(index=>index>=0);
    return matches.length === 1 ? matches[0] : -1;
};
const activeOnMage = (entry,tracker) => (isAbyssalCondition(entry) || isAbyssalTaint(entry)) && !isEffectExpired(entry,tracker);
export const getAbyssalCastingEffects = (conditions,tracker) => {
    const active = (conditions || []).filter(entry=>activeOnMage(entry,tracker));
    const imago = active.filter(entry=>abyssalName(entry)==='abyssal imago');
    const backlash = active.filter(entry=>abyssalName(entry)==='abyssal backlash');
    const unspent = backlash.filter(entry=>!entry.backlash_spent);
    const missing = [...imago,...unspent].filter(entry=>!validParadoxSuccesses(entry.paradox_successes));
    // Distinct active Conditions each retain their recorded severity. Taint itself is non-stacking.
    const total = entries => entries.reduce((sum,entry)=>sum+(validParadoxSuccesses(entry.paradox_successes)?Number(entry.paradox_successes):0),0);
    return {active,imago,backlash,unspent,missing,imagoReach:total(imago),backlashDice:total(unspent),taint:active.some(isAbyssalTaint)};
};
export const abyssalParadoxModifiers = (effects,baseParadoxDice,spellPool,spendImagoReach=true) => {
    const imagoFailure = effects.imagoReach > 0 && !spendImagoReach;
    const imagoDice = imagoFailure ? Math.max(0, Number(spellPool)||0) : 0;
    const triggered = baseParadoxDice > 0 || effects.taint || imagoFailure;
    return {triggered,imagoFailure,imagoDice,backlashDice:triggered?effects.backlashDice:0,taintDice:effects.taint?1:0};
};
// Only Conditions present when this cast began may be spent or resolved by this cast.
export const applyAbyssalOutcome = (conditions, tracker, original, event) => {
    const list = conditions || [];
    const matches = original || [];
    let changed = false;
    const result = list.flatMap(entry=>{
        if (!activeOnMage(entry,tracker) || !matches.some(target=>sameAbyssalInstance(entry,target))) return [entry];
        const name = abyssalName(entry);
        if ((event==='fully-contained' && name==='abyssal backlash') || (event==='safe-spell-success' && name==='abyssal imago')) {changed=true;return [];}
        if (event==='paradox-rolled' && name==='abyssal backlash' && !entry.backlash_spent) {changed=true;return [{...entry,backlash_spent:true}];}
        return [entry];
    });
    return changed?result:list;
};
