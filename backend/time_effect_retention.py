from datetime import datetime, timezone


def _timestamp(value):
    if not isinstance(value, str):
        return None
    try:
        result = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return result if result.tzinfo else result.replace(tzinfo=timezone.utc)
    except (ValueError, OverflowError):
        return None


def retain_unexpired_effects(effects, tracker):
    if not isinstance(effects, list):
        return effects
    tracker = tracker if isinstance(tracker, dict) else {}
    date, time = tracker.get('date'), tracker.get('time')
    now = _timestamp(f'{date}T{time}:00Z') if isinstance(date, str) and isinstance(time, str) and len(date) == 10 and len(time) == 5 else None
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
