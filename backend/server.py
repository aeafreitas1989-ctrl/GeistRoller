from pathlib import Path
from typing import Dict, List, Set
from datetime import datetime, timezone
import asyncio
import json
import logging
import os
import uuid

from pymongo import ReturnDocument
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from database import client, db
from dice_engine import resolve_dice_roll
from time_effect_retention import retain_unexpired_effects
from abyssal_conditions import retain_conditions_with_lapse
from rules_validation import validate_rule_bounded_fields
from character_sync import CharacterSummary, CHARACTER_SUMMARY_PROJECTION
from character_history import without_xp_history, xp_history_snapshot
from character_delta import character_delta, history_projection, next_revision
from models import (
    Campaign,
    CampaignCreate,
    CampaignUpdate,
    Character,
    CharacterCreate,
    CharacterUpdate,
    DiceRollRequest,
    DiceRollResult,
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR.parent / ".env")
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="GeistRoller API")
api_router = APIRouter(prefix="/api")


_character_subscribers: Dict[str, Set[asyncio.Queue]] = {}


def _subscribe_to_character(character_id: str, include_xp_history: bool = True, delta_updates: bool = False) -> asyncio.Queue:
    queue: asyncio.Queue = asyncio.Queue(maxsize=1)
    queue.include_xp_history = include_xp_history
    queue.delta_updates = delta_updates and not include_xp_history
    _character_subscribers.setdefault(character_id, set()).add(queue)
    return queue


def _unsubscribe_from_character(character_id: str, queue: asyncio.Queue) -> None:
    subscribers = _character_subscribers.get(character_id)
    if not subscribers:
        return

    subscribers.discard(queue)

    if not subscribers:
        _character_subscribers.pop(character_id, None)


def _has_history_subscriber(character_id):
    return any(getattr(q, "include_xp_history", True) for q in _character_subscribers.get(character_id, set()))


def _compact_character(character):
    return Character.model_validate(character).model_dump(mode="json", exclude={"xp_history"})


def _publish_character_update(character: dict, delta=None) -> None:
    character_id = character.get("id")
    if not character_id:
        return
    subscribers = list(_character_subscribers.get(character_id, set()))
    payloads = {}
    for queue in subscribers:
        include_history = getattr(queue, "include_xp_history", True)
        # If a queued delta was not consumed, replace it with a complete snapshot.
        # A reconnect also always begins with a snapshot.
        use_delta = bool(delta and getattr(queue, "delta_updates", False) and not queue.full())
        kind = "delta" if use_delta else "full" if include_history else "compact"
        if kind not in payloads:
            data = delta if use_delta else {"type":"character_updated", "character": character if include_history else _compact_character(character)}
            payloads[kind] = json.dumps(data, default=str, separators=(",", ":"))
        if queue.full():
            try:
                queue.get_nowait()
            except asyncio.QueueEmpty:
                pass
        try:
            queue.put_nowait(payloads[kind])
        except asyncio.QueueFull:
            pass


@api_router.get("/")
async def api_root():
    return {"status": "ok", "service": "GeistRoller API"}


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


# ========================
# CHARACTERS
# ========================

@api_router.get("/character-summaries", response_model=List[CharacterSummary])
async def get_character_summaries():
    return await db.characters.find({}, CHARACTER_SUMMARY_PROJECTION).to_list(1000)


@api_router.get("/characters", response_model=List[Character])
async def get_characters():
    return await db.characters.find({}, {"_id": 0}).to_list(1000)


@api_router.get("/characters/{character_id}", response_model=Character)
async def get_character(character_id: str, include_xp_history: bool = True):
    projection = {"_id": 0} if include_xp_history else {"_id": 0, "xp_history": 0}
    character = await db.characters.find_one({"id": character_id}, projection)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    if not include_xp_history:
        return JSONResponse(Character.model_validate(character).model_dump(mode="json", exclude={"xp_history"}))
    return character


@api_router.get("/characters/{character_id}/xp-history")
async def get_xp_history(character_id: str):
    character = await db.characters.find_one({"id": character_id}, {"_id": 0, "id": 1,
        "updated_at": 1, "xp_history": 1, "experience": 1, "arcane_experience": 1,
        "beats": 1, "arcane_beats": 1})
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return xp_history_snapshot(character)


@api_router.get("/characters/{character_id}/events")
async def character_events(character_id: str, include_xp_history: bool = True, delta_updates: bool = False):
    queue = _subscribe_to_character(character_id, include_xp_history, delta_updates)
    try:
        projection = {"_id": 0} if include_xp_history else {"_id": 0, "xp_history": 0}
        character = await db.characters.find_one({"id": character_id}, projection)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")
        initial_payload = json.dumps({"type": "character_updated", "character": character if include_xp_history else _compact_character(character)},
                                     default=str, separators=(",", ":"))
    except BaseException:
        _unsubscribe_from_character(character_id, queue)
        raise

    async def event_stream(initial_payload):
        try:
            yield "retry: 2000\n\n"
            yield f"event: character_updated\ndata: {initial_payload}\n\n"
            del initial_payload

            while True:
                try:
                    payload = await asyncio.wait_for(queue.get(), timeout=20)
                    yield f"event: character_updated\ndata: {payload}\n\n"
                    del payload
                except asyncio.TimeoutError:
                    yield ": keep-alive\n\n"
        except asyncio.CancelledError:
            raise
        finally:
            _unsubscribe_from_character(character_id, queue)

    return StreamingResponse(
        event_stream(initial_payload),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@api_router.post("/characters", response_model=Character)
async def create_character(input: CharacterCreate):
    character = Character(
        name=input.name or "New Character",
        character_type=input.character_type or "geist",
    )

    character.health = 0
    character.health_boxes = []
    character.willpower = character.attributes.get("resolve", 1) + character.attributes.get("composure", 1)

    if character.character_type == "geist":
        character.synergy = 1
        character.geist_rank = 3
        character.plasm = 10

    if character.character_type == "mage":
        character.creation_mode = "creation"
        character.creation_locked = False
        character.wisdom = 7
        character.gnosis = 1
        character.obsessions = [""]
        character.creation_choices = {
            "attribute_priorities": {"primary": "", "secondary": "", "tertiary": ""},
            "skill_priorities": {"primary": "", "secondary": "", "tertiary": ""},
            "resistance_attribute_bonus": "",
        }

    doc = character.model_dump()
    await db.characters.insert_one(doc)
    return character

XP_TRACK_FIELDS = (
    "experience",
    "arcane_experience",
    "beats",
    "arcane_beats",
)


def build_xp_history_entry(previous, updates, reason=""):
    before = {
        key: int(previous.get(key, 0) or 0)
        for key in XP_TRACK_FIELDS
    }

    after = {
        key: int(updates.get(key, before[key]) or 0)
        for key in XP_TRACK_FIELDS
    }

    changes = {
        key: after[key] - before[key]
        for key in XP_TRACK_FIELDS
    }

    if not any(changes.values()):
        return None

    old_ledger = previous.get("advancement_ledger") or []
    new_ledger = updates.get("advancement_ledger")

    source = None

    if (
        isinstance(new_ledger, list)
        and len(new_ledger) > len(old_ledger)
        and isinstance(new_ledger[-1], dict)
    ):
        source = new_ledger[-1]

    movements = []
    cost = (source or {}).get("cost") or {}
    is_purchase = (source or {}).get("type") == "xp_purchase"

    for key in ("experience", "arcane_experience"):
        spent = (
            max(0, int(cost.get(key, 0) or 0))
            if is_purchase else 0
        )

        if spent:
            movements.append({
                "resource": key,
                "amount": -spent,
            })

        remaining = changes[key] + spent

        if remaining:
            movements.append({
                "resource": key,
                "amount": remaining,
            })

    for beat_key, xp_key in (
        ("beats", "experience"),
        ("arcane_beats", "arcane_experience"),
    ):
        if changes[xp_key] > 0 and changes[beat_key] == -4:
            movements.extend([
                {"resource": beat_key, "amount": 1},
                {"resource": beat_key, "amount": -5},
            ])
        elif changes[beat_key]:
            movements.append({
                "resource": beat_key,
                "amount": changes[beat_key],
            })

    if reason:
        label = reason
    elif source:
        label = source.get("label") or "XP transaction"
    elif changes["experience"] > 0 and changes["beats"] == -4:
        label = "5 Beats converted to 1 XP"
    elif (
        changes["arcane_experience"] > 0
        and changes["arcane_beats"] == -4
    ):
        label = "5 Arcane Beats converted to 1 Arcane XP"
    elif changes["beats"]:
        label = "Beat gained" if changes["beats"] > 0 else "Beat removed"
    elif changes["arcane_beats"]:
        label = (
            "Arcane Beat gained"
            if changes["arcane_beats"] > 0
            else "Arcane Beat removed"
        )
    else:
        label = "XP adjustment"

    return {
        "id": str(uuid.uuid4()),
        "date": datetime.now(timezone.utc).isoformat(),
        "type": "xp_transaction",
        "label": label,
        "note": (source or {}).get("note", ""),
        "source_ledger_id": (source or {}).get("id"),
        "movements": movements,
        "balances": after,
    }

@api_router.put("/characters/{character_id}", response_model=Character)
async def update_character(character_id: str, input: CharacterUpdate, include_xp_history: bool = True, expected_updated_at: str = None, delta_updates: bool = False):
    update_data = input.model_dump(exclude_unset=True)
    allow_override = bool(update_data.pop("allow_rules_override", False))
    reason = (update_data.pop("xp_reason", "") or "").strip()

    previous = await db.characters.find_one({"id": character_id}, history_projection(False))

    if not previous:
        raise HTTPException(
            status_code=404,
            detail="Character not found",
        )

    if expected_updated_at is not None and previous.get("updated_at") != expected_updated_at:
        raise HTTPException(status_code=409, detail="Character changed; reload XP history before editing")

    for field in ('active_spells', 'conditions'):
        if field in update_data or 'scene_tracker' in update_data:
            source = update_data.get(field, previous.get(field, []))
            tracker = update_data.get('scene_tracker', previous.get('scene_tracker'))
            if field == 'conditions':
                retained, gained, lapse_reason = retain_conditions_with_lapse(source, tracker, previous, update_data)
                update_data.update(gained)
                if lapse_reason:
                    reason = lapse_reason
            else:
                retained = retain_unexpired_effects(source, tracker)
            if retained != source or field in update_data:
                update_data[field] = retained

    try:
        validate_rule_bounded_fields(update_data, allow_override, previous)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    if update_data:
        # Preserve saved history when importing a character.
        importing_history = "xp_history" in update_data

        transaction = (
            None
            if importing_history
            else build_xp_history_entry(
                previous,
                update_data,
                reason,
            )
        )

        update_data["updated_at"] = next_revision(previous.get("updated_at"))

        operations = {"$set": update_data}

        if transaction:
            operations["$push"] = {
                "xp_history": transaction,
            }

        # Protect the exact revision used for rule validation and XP accounting.
        # A conflicting write is rejected rather than applying a stale computed patch.
        selector = {"id": character_id, "updated_at": previous.get("updated_at") if "updated_at" in previous else {"$exists": False}}
        wants_history = include_xp_history or _has_history_subscriber(character_id)
        character = await db.characters.find_one_and_update(
            selector, operations,
            projection=history_projection(wants_history), return_document=ReturnDocument.AFTER,
        )
    else:
        character = await db.characters.find_one({"id": character_id}, history_projection(True)) if include_xp_history else previous

    if not character:
        if update_data or expected_updated_at is not None:
            raise HTTPException(status_code=409, detail="Character changed; reload and retry the action")
        raise HTTPException(status_code=404, detail="Character not found")

    compact = _compact_character(character)
    delta = character_delta(_compact_character(previous), compact) if update_data and previous.get("updated_at") else None
    if update_data:
        publish_character, publish_delta = character, delta
        # A legacy full-history client may subscribe during the awaited Mongo write.
        # Refresh only in that uncommon case, and never publish an old delta for a newer snapshot.
        if not wants_history and _has_history_subscriber(character_id):
            full = await db.characters.find_one({"id": character_id}, history_projection(True))
            if full is not None:
                publish_character = full
                if full.get("updated_at") != character.get("updated_at"):
                    publish_delta = None
            else:
                publish_character = None
        if publish_character is not None:
            _publish_character_update(publish_character, publish_delta)

    if not include_xp_history:
        return JSONResponse(delta if delta_updates and delta else compact)
    return character


@api_router.delete("/characters/{character_id}")
async def delete_character(character_id: str):
    result = await db.characters.delete_one({"id": character_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Character not found")
    return {"status": "deleted"}


# ========================
# CAMPAIGNS
# Manual campaign data only; no AI/session generation.
# ========================

@api_router.get("/campaigns", response_model=List[Campaign])
async def get_campaigns():
    return await db.campaigns.find({}, {"_id": 0}).to_list(1000)


@api_router.get("/campaigns/{campaign_id}", response_model=Campaign)
async def get_campaign(campaign_id: str):
    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@api_router.post("/campaigns", response_model=Campaign)
async def create_campaign(input: CampaignCreate):
    campaign = Campaign(
        name=input.name or "New Chronicle",
        description=input.description or "",
    )
    await db.campaigns.insert_one(campaign.model_dump())
    return campaign


@api_router.put("/campaigns/{campaign_id}", response_model=Campaign)
async def update_campaign(campaign_id: str, input: CampaignUpdate):
    update_data = input.model_dump(exclude_unset=True)
    if update_data:
        result = await db.campaigns.update_one(
            {"id": campaign_id},
            {"$set": update_data},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Campaign not found")

    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@api_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str):
    result = await db.campaigns.delete_one({"id": campaign_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"status": "deleted"}


# ========================
# DICE
# ========================

@api_router.post("/dice/roll", response_model=DiceRollResult)
async def roll_dice(request: DiceRollRequest):
    return resolve_dice_roll(request)


# ========================
# APP SETUP
# ========================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def remove_retired_character_data():
    await db.characters.update_many({"exploration_map": {"$exists": True}}, {"$unset": {"exploration_map": ""}})
    async for record in db.characters.find(
        {"$or": [{"active_spells.0": {"$exists": True}}, {"conditions.0": {"$exists": True}}]},
        {"active_spells": 1, "conditions": 1, "scene_tracker": 1, "character_type": 1, "updated_at": 1, "experience": 1, "arcane_experience": 1, "beats": 1, "arcane_beats": 1},
    ):
        for field in ("active_spells", "conditions"):
            source = record.get(field, [])
            if field == "conditions":
                retained, gained, reason = retain_conditions_with_lapse(source, record.get("scene_tracker"), record)
            else:
                retained, gained, reason = retain_unexpired_effects(source, record.get("scene_tracker")), {}, ""
            if retained != source:
                changes = {field: retained, **gained}
                operations = {"$set": changes}
                selector = {"_id": record["_id"], field: source}
                if gained:
                    selector["updated_at"] = record.get("updated_at") if "updated_at" in record else {"$exists": False}
                    changes["updated_at"] = next_revision(record.get("updated_at"))
                    transaction = build_xp_history_entry(record, changes, reason)
                    if transaction:
                        operations["$push"] = {"xp_history": transaction}
                await db.characters.update_one(selector, operations)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


STATIC_DIR = ROOT_DIR / "static"
if STATIC_DIR.exists() and (STATIC_DIR / "index.html").exists():
    app.mount(
        "/static",
        StaticFiles(directory=str(STATIC_DIR / "static")),
        name="static-assets",
    )

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = STATIC_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(STATIC_DIR / "index.html"))
