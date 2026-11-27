import { startTimedEffect, getEffectTimer, isEffectExpired, isEffectNotStarted, withGameClockCheckpoint } from './effectDuration';
import { retainActiveSpells } from './activeSpellRetention';
import { prepareTimeTransition } from './timeTransitionSummary';
import { getEndScenePatch } from './sceneLifecycle';
const t=time=>({date:'1607-01-17',time});
const shift=startTimedEffect({id:'s',name:'Shifting Gaze',duration:'1 hour'},t('12:18'));
const eye=startTimedEffect({id:'e',name:"Exorcist's Eye",duration:'1 hour'},t('11:55'));
const advance=(c,next)=>({...c,...prepareTimeTransition(c,{scene_tracker:next}).cleaned});
test('rewind restores both spells with their original absolute deadlines',()=>{
 const current=advance({scene_tracker:t('12:50'),active_spells:[shift,eye]},t('13:08'));
 expect(getEffectTimer(current.active_spells[0],current.scene_tracker).label).toBe('10m remaining');
 expect(isEffectExpired(current.active_spells[1],current.scene_tracker)).toBe(true);
 const back=advance(current,t('12:50'));
 expect(back.active_spells.map(e=>getEffectTimer(e,back.scene_tracker).label)).toEqual(['28m remaining','5m remaining']);
 expect(back.scene_tracker.processed_at).toBe(current.scene_tracker.processed_at);
 expect(isEffectNotStarted(shift,withGameClockCheckpoint(back.scene_tracker,t('12:00')))).toBe(true);
 expect(advance(back,t('13:08')).active_spells[1].status).toBe('expired');
});
test('keeps five latest calendar expirations and all active/future records',()=>{
 const expired=Array.from({length:8},(_,i)=>({id:i,expires_at:'1607-01-17T12:0'+i+':00Z'}));
 const list=retainActiveSpells([...expired,shift,eye],t('13:08'));
 expect(list.filter(e=>isEffectExpired(e,t('13:08'))).map(e=>e.id)).toEqual([4,5,6,7,'e']);
 expect(list.some(e=>e.id==='s')).toBe(true);
});
test('archived condition can be restored after End Scene without recreating manually removed effects',()=>{
 const condition={...eye,name:'Test Condition'};
 const current=advance({scene_tracker:t('12:50'),conditions:[condition]},t('13:08'));
 const end={...current,...prepareTimeTransition(current,getEndScenePatch(current),{kind:'scene'}).cleaned};
 expect(end.conditions[0].clock_archived).toBe(true);
 const back=advance(end,t('12:50'));
 expect(back.conditions[0].status).toBe('active');
 expect(advance({...back,conditions:[]},t('12:40')).conditions).toEqual([]);
});
