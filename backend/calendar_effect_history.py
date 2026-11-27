from time_effect_retention import _timestamp, game_timestamp, retain_unexpired_effects


def displayed_timestamp(tracker):
    tracker = tracker if isinstance(tracker, dict) else {}
    return game_timestamp({k: v for k, v in tracker.items() if k != 'processed_at'}) or game_timestamp(tracker)


def is_calendar_effect(entry):
    return (isinstance(entry, dict) and _timestamp(entry.get('expires_at')) is not None
            and entry.get('tracking_mode') not in ('turn', 'scene') and not entry.get('scene_duration'))


def not_started(entry, tracker):
    if not is_calendar_effect(entry):
        return False
    now, start = displayed_timestamp(tracker), _timestamp(entry.get('started_at'))
    return now is not None and start is not None and now < start


def calendar_lapsed(entry, tracker):
    if not is_calendar_effect(entry):
        return False
    now = displayed_timestamp(tracker)
    return now is not None and now >= _timestamp(entry.get('expires_at'))


def review_calendar_effect(entry, tracker):
    if not is_calendar_effect(entry) or displayed_timestamp(tracker) is None:
        return entry
    return {**entry, 'clock_review': True, 'status': 'expired' if not_started(entry, tracker) or calendar_lapsed(entry, tracker) else 'active'}


def retain_recent_calendar_effects(entries, tracker, pending_lapse=lambda e: False, limit=5):
    pending_count = sum(1 for e in entries if calendar_lapsed(e, tracker) and pending_lapse(e))
    candidates = [(i, _timestamp(e['expires_at'])) for i,e in enumerate(entries)
                  if calendar_lapsed(e, tracker) and not pending_lapse(e)]
    candidates.sort(key=lambda item: (item[1], item[0]), reverse=True)
    drop = {i for i,_ in candidates[max(0, limit-pending_count):]}
    return [entry for i,entry in enumerate(entries) if i not in drop]


def retain_spell_history(effects, tracker):
    if not isinstance(effects, list):
        return effects
    reviewed = [review_calendar_effect(e, tracker) for e in effects]
    kept = [e for e in reviewed if is_calendar_effect(e) or retain_unexpired_effects([e], tracker)]
    return retain_recent_calendar_effects(kept, tracker)
