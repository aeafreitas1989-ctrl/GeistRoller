import { reviewCalendarEffect, isCalendarLapsed } from './effectDuration';
export const reviewConditionExpiry = reviewCalendarEffect;
export const isPendingClockLapse = (condition,tracker) => Boolean(!condition?.lapse_finalized && isCalendarLapsed(condition,tracker));
