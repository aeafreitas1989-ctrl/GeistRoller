from time_effect_retention import _timestamp, game_timestamp, retain_unexpired_effects
from abyssal_conditions import is_abyssal_condition, is_abyssal_taint, retain_conditions_with_lapse


def condition_review_tracker(tracker):
    tracker = tracker if isinstance(tracker, dict) else {}
    raw = {k: v for k, v in tracker.items() if k != 'processed_at'}
    return raw if game_timestamp(raw) is not None else tracker


def review_condition_expiry(entry, tracker):
    if not isinstance(entry, dict) or entry.get('lapse_finalized'):
        return entry
    end = _timestamp(entry.get('expires_at'))
    if end is None or entry.get('tracking_mode') in ('turn', 'scene') or entry.get('scene_duration'):
        return entry
    now = game_timestamp(condition_review_tracker(tracker))
    status = entry.get('status') if now is None else ('expired' if now >= end else 'active')
    return {**entry, 'clock_review': True, **({'status': status} if status else {})}


def review_scene_conditions(conditions, tracker, previous, updates=None, finalize_scene=False):
    if not isinstance(conditions, list):
        return conditions, {}, ''
    clock = condition_review_tracker(tracker)
    reviewed = [review_condition_expiry(entry, tracker) for entry in conditions]
    def expired(entry):
        return not retain_unexpired_effects([entry], clock)
    reviewed = [{**e, 'status': 'expired'} if isinstance(e, dict) and expired(e) and e.get('status') != 'expired' else e for e in reviewed]
    if finalize_scene:
        # Already-finalized turn lapses are removed without a second reward.
        pending = [e for e in reviewed if not (expired(e) and isinstance(e, dict) and e.get('lapse_finalized'))]
        return retain_conditions_with_lapse(pending, clock, previous, updates)
    if previous.get('character_type') != 'mage':
        return reviewed, {}, ''
    # Clock lapses are provisional. Explicit turn lapses are not reversible by date edits.
    immediate = [i for i,e in enumerate(reviewed) if isinstance(e,dict) and expired(e) and is_abyssal_condition(e) and not e.get('clock_review') and not e.get('lapse_finalized')]
    if not immediate:
        return reviewed, {}, ''
    active = [e for e in reviewed if not expired(e)]
    remaining, gained, reason = retain_conditions_with_lapse(active + [reviewed[i] for i in immediate], clock, previous, updates)
    kept = [{**e, 'status':'expired', 'lapse_finalized':True} if i in immediate else e for i,e in enumerate(reviewed)]
    if not any(is_abyssal_taint(e) for e in kept):
        kept.extend(e for e in remaining if is_abyssal_taint(e))
    return kept, gained, reason
