from datetime import datetime, timezone, timedelta


def history_projection(include_history):
    return {"_id": 0} if include_history else {"_id": 0, "xp_history": 0}


def next_revision(previous):
    now = datetime.now(timezone.utc)
    if isinstance(previous, str):
        try:
            prior = datetime.fromisoformat(previous.replace("Z", "+00:00"))
            if prior.tzinfo is None:
                prior = prior.replace(tzinfo=timezone.utc)
            if prior >= now:
                now = prior.astimezone(timezone.utc) + timedelta(microseconds=1)
        except (ValueError, OverflowError):
            pass
    return now.isoformat(timespec="microseconds")


def character_delta(before, after):
    # The caller provides normalized compact snapshots. Missing revisions or
    # removed fields cannot be represented safely; send a full snapshot instead.
    base = before.get("updated_at")
    revision = after.get("updated_at")
    if not base or not revision or base == revision or before.get("id") != after.get("id"):
        return None
    if set(before) - set(after):
        return None
    changes = {k: v for k, v in after.items() if k not in ("id", "xp_history") and (k not in before or before[k] != v)}
    return {"type": "character_delta", "id": after["id"], "base_revision": base,
            "revision": revision, "changes": changes,
            "summary": {k: after[k] for k in ("id", "name", "character_type", "updated_at")}}
