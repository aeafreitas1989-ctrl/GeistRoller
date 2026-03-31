from typing import List, Dict, Any
from datetime import datetime, timezone
import uuid
import re


def upsert_journal_entry(entries: List[Dict[str, Any]], entry_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    session_id = entry_data.get("session_id")
    if not session_id:
        return entries + [entry_data]

    matching_entries = [entry for entry in entries if entry.get("session_id") == session_id]
    non_matching_entries = [entry for entry in entries if entry.get("session_id") != session_id]

    preserved_entry = matching_entries[-1] if matching_entries else {}
    preserved_id = preserved_entry.get("id") or entry_data.get("id") or str(uuid.uuid4())
    preserved_date = preserved_entry.get("date") or entry_data.get("date") or datetime.now(timezone.utc).isoformat()

    canonical_entry = {
        **preserved_entry,
        **entry_data,
        "id": preserved_id,
        "date": preserved_date,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    return non_matching_entries + [canonical_entry]


def dedupe_journal_entries(entries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    latest_by_session: Dict[str, Dict[str, Any]] = {}
    ordered_non_session_entries: List[Dict[str, Any]] = []

    for entry in entries:
        session_id = entry.get("session_id")
        if not session_id:
            ordered_non_session_entries.append(entry)
            continue
        latest_by_session[session_id] = entry

    return ordered_non_session_entries + list(latest_by_session.values())


def upsert_pending_journal_entry(pending_updates: List[Dict[str, Any]], new_update: Dict[str, Any]) -> List[Dict[str, Any]]:
    target_session_id = (new_update.get("data") or {}).get("session_id")
    if not target_session_id:
        return pending_updates + [new_update]

    new_pending = []
    replaced = False

    for update in pending_updates:
        if (
            update.get("update_type") == "journal_entry"
            and (update.get("data") or {}).get("session_id") == target_session_id
        ):
            new_pending.append(new_update)
            replaced = True
        else:
            new_pending.append(update)

    if not replaced:
        new_pending.append(new_update)

    return new_pending


def upsert_world_state_fact(world_state: List[Dict[str, Any]], fact_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    fact_key = (fact_data.get("fact_key") or "").strip()
    if not fact_key:
        return world_state + [{
            **fact_data,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }]

    non_matching = [item for item in world_state if (item.get("fact_key") or "").strip() != fact_key]
    matching = [item for item in world_state if (item.get("fact_key") or "").strip() == fact_key]
    preserved = matching[-1] if matching else {}

    canonical_fact = {
        **preserved,
        **fact_data,
        "fact_key": fact_key,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    return non_matching + [canonical_fact]


def upsert_plot_thread(threads: List[Dict[str, Any]], thread_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    thread_key = (thread_data.get("thread_key") or "").strip()
    if not thread_key:
        return threads + [{
            **thread_data,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }]

    non_matching = [item for item in threads if (item.get("thread_key") or "").strip() != thread_key]
    matching = [item for item in threads if (item.get("thread_key") or "").strip() == thread_key]
    preserved = matching[-1] if matching else {}

    canonical_thread = {
        **preserved,
        **thread_data,
        "thread_key": thread_key,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    return non_matching + [canonical_thread]


def upsert_pending_world_state(pending_updates: List[Dict[str, Any]], new_update: Dict[str, Any]) -> List[Dict[str, Any]]:
    target_key = ((new_update.get("data") or {}).get("fact_key") or "").strip()
    if not target_key:
        return pending_updates + [new_update]

    new_pending = []
    replaced = False

    for update in pending_updates:
        existing_key = ((update.get("data") or {}).get("fact_key") or "").strip()
        if update.get("update_type") == "world_state" and existing_key == target_key:
            new_pending.append(new_update)
            replaced = True
        else:
            new_pending.append(update)

    if not replaced:
        new_pending.append(new_update)

    return new_pending


def upsert_pending_plot_thread(pending_updates: List[Dict[str, Any]], new_update: Dict[str, Any]) -> List[Dict[str, Any]]:
    target_key = ((new_update.get("data") or {}).get("thread_key") or "").strip()
    if not target_key:
        return pending_updates + [new_update]

    new_pending = []
    replaced = False

    for update in pending_updates:
        existing_key = ((update.get("data") or {}).get("thread_key") or "").strip()
        if update.get("update_type") == "plot_thread" and existing_key == target_key:
            new_pending.append(new_update)
            replaced = True
        else:
            new_pending.append(update)

    if not replaced:
        new_pending.append(new_update)

    return new_pending


def dedupe_world_state_once(world_state: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not world_state:
        return []

    deduped: List[Dict[str, Any]] = []
    seen_keys: Dict[str, int] = {}

    def normalize_text(text: str) -> str:
        return re.sub(r"\s+", " ", (text or "").strip().lower())

    def infer_fact_key(item: Dict[str, Any]) -> str:
        explicit_key = (item.get("fact_key") or "").strip()
        if explicit_key:
            return explicit_key
        fact = normalize_text(item.get("fact", ""))
        category = normalize_text(item.get("category", "general"))
        base = re.sub(r"[^a-z0-9]+", "_", f"{category}_{fact}").strip("_")
        return base[:120] or f"{category}_fact"

    for item in world_state:
        key = infer_fact_key(item)
        normalized_item = {
            **item,
            "fact_key": key,
            "updated_at": item.get("updated_at") or datetime.now(timezone.utc).isoformat(),
        }

        if key in seen_keys:
            deduped[seen_keys[key]] = normalized_item
        else:
            seen_keys[key] = len(deduped)
            deduped.append(normalized_item)

    return deduped


def dedupe_plot_threads_once(plot_threads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not plot_threads:
        return []

    deduped: List[Dict[str, Any]] = []
    seen_keys: Dict[str, int] = {}

    def normalize_text(text: str) -> str:
        return re.sub(r"\s+", " ", (text or "").strip().lower())

    def infer_thread_key(item: Dict[str, Any]) -> str:
        explicit_key = (item.get("thread_key") or "").strip()
        if explicit_key:
            return explicit_key
        title = normalize_text(item.get("title", ""))
        base = re.sub(r"[^a-z0-9]+", "_", title).strip("_")
        return base[:120] or "plot_thread"

    for item in plot_threads:
        key = infer_thread_key(item)
        normalized_item = {
            **item,
            "thread_key": key,
            "updated_at": item.get("updated_at") or datetime.now(timezone.utc).isoformat(),
        }

        if key in seen_keys:
            deduped[seen_keys[key]] = normalized_item
        else:
            seen_keys[key] = len(deduped)
            deduped.append(normalized_item)

    return deduped
