from datetime import datetime, timezone


def _timestamp(value):
    if not isinstance(value, str):
        return None
    try:
        result = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return result if result.tzinfo else result.replace(tzinfo=timezone.utc)
    except (ValueError, OverflowError):
        return None


def game_timestamp(tracker):
    tracker = tracker if isinstance(tracker, dict) else {}
    date, time = tracker.get('date'), tracker.get('time')
    raw = _timestamp(f'{date}T{time}:00Z') if isinstance(date, str) and isinstance(time, str) and len(date) == 10 and len(time) == 5 else None
    processed = _timestamp(tracker.get('processed_at'))
    return max((value for value in (raw, processed) if value is not None), default=None)


def preserve_clock_checkpoint(previous, requested):
    requested = requested if isinstance(requested, dict) else {}
    stamp = max((value for value in (game_timestamp(previous), game_timestamp(requested)) if value is not None), default=None)
    if stamp is None:
        return requested
    return {**requested, 'processed_at': stamp.astimezone(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z')}


def stamp_new_effects(effects, previous, tracker):
    if not isinstance(effects, list):
        return effects
    raw = {k: v for k, v in (tracker or {}).items() if k != 'processed_at'} if isinstance(tracker, dict) else {}
    stamp = game_timestamp(raw) or game_timestamp(tracker)
    if stamp is None:
        return effects
    def key(entry):
        if not isinstance(entry, dict):
            return None
        return ('id', str(entry['id'])) if entry.get('id') is not None else tuple(str(entry.get(k) or '') for k in ('name','definition_key','type','group','target_type','target_id','origin'))
    existing = {key(e): e for e in previous or [] if isinstance(e, dict)}
    result = []
    for entry in effects:
        if isinstance(entry, dict) and not entry.get('started_at') and not entry.get('expires_at') and entry.get('status') != 'expired':
            old = existing.get(key(entry))
            if old is None or old.get('started_at'):
                entry = {**entry, 'started_at': old['started_at'] if old else stamp.astimezone(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00','Z')}
        result.append(entry)
    return result


def retain_unexpired_effects(effects, tracker):
    if not isinstance(effects, list):
        return effects
    now = game_timestamp(tracker)
    def expired(effect):
        if not isinstance(effect, dict):
            return False
        if effect.get('status') == 'expired':
            return True
        if effect.get('tracking_mode') == 'turn':
            try:
                if float(effect.get('turns_remaining') or 0) <= 0:
                    return True
            except (TypeError, ValueError):
                return True
        end = _timestamp(effect.get('expires_at'))
        return now is not None and end is not None and now >= end
    return [effect for effect in effects if not expired(effect)]
