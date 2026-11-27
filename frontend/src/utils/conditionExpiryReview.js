import { getRawGameTimestamp, getGameTimestamp, isEffectExpired } from './effectDuration';
import { isSceneDurationEffect } from './sceneLifecycle';

export const reviewConditionExpiry = (condition,tracker) => {
    if (!condition || typeof condition!=='object') return condition;
    const end=Date.parse(condition.expires_at||'');
    if (!Number.isFinite(end) || condition.tracking_mode==='turn' || condition.tracking_mode==='scene' || isSceneDurationEffect(condition) || condition.lapse_finalized) return condition;
    const now=getRawGameTimestamp(tracker) ?? getGameTimestamp(tracker);
    const status=now===null ? condition.status : now>=end ? 'expired' : 'active';
    if (condition.clock_review===true && condition.status===status) return condition;
    return {...condition,clock_review:true,...(status ? {status}: {})};
};
export const isPendingClockLapse = (condition,tracker) => Boolean(condition?.clock_review && !condition.lapse_finalized && isEffectExpired(condition,tracker));
