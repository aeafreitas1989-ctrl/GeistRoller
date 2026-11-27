from time_effect_retention import game_timestamp, retain_unexpired_effects
from abyssal_conditions import is_abyssal_condition, is_abyssal_taint, retain_conditions_with_lapse
from calendar_effect_history import (is_calendar_effect, not_started, calendar_lapsed,
                                     review_calendar_effect, retain_recent_calendar_effects)


def condition_review_tracker(tracker):
    tracker = tracker if isinstance(tracker, dict) else {}
    raw = {k: v for k, v in tracker.items() if k != 'processed_at'}
    return raw if game_timestamp(raw) is not None else tracker


review_condition_expiry = review_calendar_effect


def review_scene_conditions(conditions, tracker, previous, updates=None, finalize_scene=False):
    if not isinstance(conditions, list):
        return conditions, {}, ''
    clock = condition_review_tracker(tracker)
    reviewed = [review_condition_expiry(entry, tracker) for entry in conditions]
    def expired(entry):
        return not retain_unexpired_effects([entry], clock)
    reviewed = [{**e, 'status': 'expired'} if isinstance(e, dict) and expired(e) and e.get('status') != 'expired' else e for e in reviewed]
    mage = previous.get('character_type') == 'mage'
    def pending(e):
        return mage and is_abyssal_condition(e) and calendar_lapsed(e, tracker) and not e.get('lapse_finalized')
    if finalize_scene:
        # Retain calendar records for rewind, but award each actual lapse at most once.
        kept, lapse = [], []
        for entry in reviewed:
            if not expired(entry) or not_started(entry, tracker):
                kept.append(entry)
                continue
            award = mage and is_abyssal_condition(entry) and not entry.get('lapse_finalized')
            if award:
                lapse.append(entry)
            if is_calendar_effect(entry):
                kept.append({**entry, 'clock_archived': True, **({'lapse_finalized': True} if award else {})})
        if lapse:
            # Use only active entries and newly lapsed ones for reward calculation.
            active = [e for e in kept if not expired(e)]
            remaining, gained, reason = retain_conditions_with_lapse(active + lapse, clock, previous, updates)
            if not any(is_abyssal_taint(e) for e in kept):
                kept.extend(e for e in remaining if is_abyssal_taint(e))
        else:
            gained, reason = {}, ''
        return retain_recent_calendar_effects(kept, tracker), gained, reason
    immediate = [i for i,e in enumerate(reviewed) if mage and isinstance(e,dict) and expired(e) and is_abyssal_condition(e) and not is_calendar_effect(e) and not e.get('lapse_finalized')]
    if not immediate:
        return retain_recent_calendar_effects(reviewed, tracker, pending), {}, ''
    active = [e for e in reviewed if not expired(e)]
    remaining, gained, reason = retain_conditions_with_lapse(active + [reviewed[i] for i in immediate], clock, previous, updates)
    kept = [{**e, 'status':'expired', 'lapse_finalized':True} if i in immediate else e for i,e in enumerate(reviewed)]
    if not any(is_abyssal_taint(e) for e in kept):
        kept.extend(e for e in remaining if is_abyssal_taint(e))
    return retain_recent_calendar_effects(kept, tracker, pending), gained, reason
