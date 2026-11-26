from datetime import datetime, timezone


def _timestamp(value):
    if not isinstance(value, str):
        return None
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt
    except (ValueError, OverflowError):
        return None


def retain_active_spells(effects, tracker):
    """Remove expired tracked effects only; never inspect or modify Conditions."""
    tracker = tracker if isinstance(tracker, dict) else {}
    date, time = tracker.get("date"), tracker.get("time")
    now = _timestamp(f"{date}T{time}:00Z") if isinstance(date, str) and isinstance(time, str) and len(date) == 10 and len(time) == 5 else None
    def expired(effect):
        if not isinstance(effect, dict):
            return False
        if effect.get("status") == "expired":
            return True
        if effect.get("tracking_mode") == "turn":
            try:
                if float(effect.get("turns_remaining") or 0) <= 0:
                    return True
            except (ValueError, TypeError):
                return True
        end = _timestamp(effect.get("expires_at"))
        return now is not None and end is not None and now >= end
    return [effect for effect in (effects or []) if not expired(effect)]
