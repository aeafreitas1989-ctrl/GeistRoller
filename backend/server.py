from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
import random
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage
from llm_wrapper import create_chat

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Database
from database import db, client

# Models
from models import (
    Message, Session, SessionCreate, SessionUpdate, SessionTitleSuggestionRequest,
    SessionTitleSuggestionResponse, CaseTruthUpdate, GenerateCaseTruthRequest,
    MessageCreate, SystemMessageCreate,
    Campaign, CampaignCreate, CampaignUpdate, JournalUpdateApproval, GenerateJournalRequest,
    Character, CharacterCreate, CharacterUpdate,
    StorytellerSettings, StorytellerSettingsUpdate,
    DiceRollRequest, DiceRollResult,
    Condition,
)

# AI Prompts
from ai_prompts import (
    GEIST_SYSTEM_PROMPT, SESSION_TRUTH_SYSTEM_PROMPT,
    CASE_TRUTH_SECTION_ORDER, CASE_TRUTH_INSTRUCTIONS,
    CASE_TRUTH_GENERATION_PROMPT, DEFAULT_CASE_TRUTH_TEMPLATE,
    parse_case_truth_sections, is_empty_case_truth_section,
    render_case_truth_sections, merge_case_truth_empty_slots,
    build_character_context_prompt, build_campaign_context_prompt,
    build_settings_prompt,
)

# Campaign Utilities
from campaign_utils import (
    upsert_journal_entry, dedupe_journal_entries,
    upsert_pending_journal_entry, upsert_world_state_fact,
    upsert_plot_thread, upsert_pending_world_state,
    upsert_pending_plot_thread, dedupe_world_state_once,
    dedupe_plot_threads_once,
)

# App setup
app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# LLM Chat caches
session_chats: Dict[str, Any] = {}
truth_chats: Dict[str, Any] = {}
_llm_settings_version: int = 0

async def _get_llm_settings() -> dict:
    doc = await db.settings.find_one({"_type": "storyteller"}, {"_id": 0})
    if not doc:
        return {}
    return doc

def invalidate_llm_caches():
    global _llm_settings_version
    _llm_settings_version += 1
    session_chats.clear()
    truth_chats.clear()

def get_or_create_llm_chat(session_id: str, settings: dict = None) -> Any:
    if session_id not in session_chats:
        chat = create_chat(f"geist-{session_id}", GEIST_SYSTEM_PROMPT, settings)
        session_chats[session_id] = chat
    return session_chats[session_id]

def get_or_create_truth_chat(session_id: str, settings: dict = None) -> Any:
    if session_id not in truth_chats:
        chat = create_chat(f"truth-{session_id}", SESSION_TRUTH_SYSTEM_PROMPT, settings)
        truth_chats[session_id] = chat
    return truth_chats[session_id]


# ========================
# ROOT
# ========================

@api_router.get("/")
async def root():
    return {"status": "ok", "service": "Geist Storyteller API"}


# ========================
# SESSIONS
# ========================

@api_router.post("/sessions", response_model=Session)
async def create_session(input: SessionCreate):
    session = Session(title=input.title or "New Session", campaign_id=input.campaign_id)
    await db.sessions.insert_one(session.model_dump())
    result = session.model_dump()
    result.pop("_id", None)
    return result

@api_router.get("/sessions", response_model=List[Session])
async def get_sessions():
    sessions = await db.sessions.find({}, {"_id": 0, "messages": 0}).sort("updated_at", -1).to_list(100)
    return sessions

@api_router.get("/sessions/{session_id}", response_model=Session)
async def get_session(session_id: str):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@api_router.put("/sessions/{session_id}", response_model=Session)
async def update_session(session_id: str, input: SessionUpdate):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return session
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.sessions.update_one({"id": session_id}, {"$set": update_data})
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@api_router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    result = await db.sessions.delete_one({"id": session_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    session_chats.pop(session_id, None)
    truth_chats.pop(session_id, None)
    return {"status": "deleted"}

@api_router.get("/sessions/{session_id}/messages", response_model=List[Message])
async def get_messages(session_id: str):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session.get("messages", [])


# ========================
# MESSAGES & AI
# ========================

@api_router.post("/sessions/{session_id}/system-message", response_model=Message)
async def add_system_message(session_id: str, input: SystemMessageCreate):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    message = Message(role="system", content=input.content)
    await db.sessions.update_one(
        {"id": session_id},
        {
            "$push": {"messages": message.model_dump()},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    return message

@api_router.post("/sessions/{session_id}/messages", response_model=Message)
async def send_message(session_id: str, input: MessageCreate):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    user_message = Message(role="user", content=input.content)
    await db.sessions.update_one(
        {"id": session_id},
        {
            "$push": {"messages": user_message.model_dump()},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )

    try:
        llm_settings = await _get_llm_settings()
        chat = get_or_create_llm_chat(session_id, llm_settings)

        context_messages = session.get("messages", [])[-10:]
        context = ""
        for msg in context_messages:
            role = "Player" if msg["role"] == "user" else "Storyteller"
            content = msg.get("content", "")
            if isinstance(content, dict):
                content = json.dumps(content)
            elif not isinstance(content, str):
                content = str(content)
            context += f"{role}: {content}\n\n"

        character_context_prompt = ""
        if input.character_context:
            character_context_prompt = build_character_context_prompt(input.character_context)

        settings_prompt = ""
        if input.storyteller_settings:
            settings_prompt = build_settings_prompt(input.storyteller_settings)

        campaign_context_prompt = ""
        campaign_id = session.get("campaign_id")
        if campaign_id:
            campaign_context_prompt = await build_campaign_context_prompt(db, campaign_id)

        case_truth = (session.get("case_truth") or "").strip()
        case_truth_prompt = ""
        if case_truth and case_truth != DEFAULT_CASE_TRUTH_TEMPLATE.strip():
            case_truth_prompt = f"{CASE_TRUTH_INSTRUCTIONS}\n```\n{case_truth}\n```\n---\n"

        full_prompt = f"{settings_prompt}{campaign_context_prompt}{case_truth_prompt}{character_context_prompt}{context}Player: {input.content}"

        llm_message = UserMessage(text=full_prompt)
        response_text = await chat.send_message(llm_message)

        storyteller_message = Message(role="storyteller", content=response_text)

        await db.sessions.update_one(
            {"id": session_id},
            {
                "$push": {"messages": storyteller_message.model_dump()},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )

        # Update session truth in background
        try:
            truth_chat = get_or_create_truth_chat(session_id, llm_settings)
            truth_prompt = f"Update the session record.\n\nLatest exchange:\nPlayer: {input.content}\nStoryteller: {response_text}\n\nSession truth so far:\n{session.get('session_truth', '')}"
            truth_response = await truth_chat.send_message(UserMessage(text=truth_prompt))
            await db.sessions.update_one({"id": session_id}, {"$set": {"session_truth": truth_response}})
        except Exception as e:
            logger.warning(f"Failed to update session truth: {e}")

        return storyteller_message

    except Exception as e:
        logger.error(f"Error generating response: {e}")
        error_message = Message(role="storyteller", content=f"*The spirits are silent... (Error: {str(e)})*")
        await db.sessions.update_one(
            {"id": session_id},
            {"$push": {"messages": error_message.model_dump()}}
        )
        return error_message


@api_router.post("/sessions/{session_id}/end-chapter")
async def end_chapter(session_id: str, input: MessageCreate):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        llm_settings = await _get_llm_settings()
        chat = get_or_create_llm_chat(session_id, llm_settings)

        context_messages = session.get("messages", [])[-20:]
        context = ""
        for msg in context_messages:
            role = "Player" if msg["role"] == "user" else "Storyteller"
            context += f"{role}: {msg['content']}\n\n"

        character_context_prompt = ""
        if input.character_context:
            character_context_prompt = build_character_context_prompt(input.character_context)

        settings_prompt = ""
        if input.storyteller_settings:
            settings_prompt = build_settings_prompt(input.storyteller_settings)

        end_chapter_prompt = (
            f"{settings_prompt}{character_context_prompt}{context}"
            "[END CHAPTER]\n"
            "The player has ended this chapter/session. Review everything that happened during this session. "
            "Provide a narrative summary and award Beats using the {{beats|...}} format. "
            "Remember: +1 chapter beat is automatic. Award additional beats for aspirations advanced, "
            "dramatic events, or extraordinary play. Be specific in your notes about why each beat was awarded."
        )

        llm_message = UserMessage(text=end_chapter_prompt)
        response_text = await chat.send_message(llm_message)

        storyteller_message = Message(role="storyteller", content=response_text)
        system_message = Message(role="user", content="[The player ends the chapter]")

        await db.sessions.update_one(
            {"id": session_id},
            {
                "$push": {"messages": {"$each": [system_message.model_dump(), storyteller_message.model_dump()]}},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )

        return storyteller_message

    except Exception as e:
        logger.error(f"Error ending chapter: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to end chapter: {str(e)}")


# ========================
# SESSION TRUTH & CASE TRUTH
# ========================

@api_router.get("/sessions/{session_id}/truth")
async def get_session_truth(session_id: str):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_truth": session.get("session_truth", "")}

@api_router.get("/sessions/{session_id}/case-truth")
async def get_case_truth(session_id: str):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    case_truth_raw = session.get("case_truth", "")
    sections = parse_case_truth_sections(case_truth_raw)
    return {"case_truth": case_truth_raw, "sections": sections}

@api_router.put("/sessions/{session_id}/case-truth")
async def update_case_truth(session_id: str, input: CaseTruthUpdate):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.sessions.update_one(
        {"id": session_id},
        {"$set": {"case_truth": input.case_truth, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    sections = parse_case_truth_sections(input.case_truth)
    return {"case_truth": input.case_truth, "sections": sections}

@api_router.post("/sessions/{session_id}/case-truth/generate")
async def generate_case_truth(session_id: str, input: GenerateCaseTruthRequest):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        existing_case_truth = session.get("case_truth", "")
        messages = session.get("messages", [])

        transcript_lines = []
        for msg in messages[-30:]:
            role = "Player" if msg["role"] == "user" else "Storyteller"
            transcript_lines.append(f"{role}: {msg.get('content', '')}")
        transcript = "\n\n".join(transcript_lines)

        template = DEFAULT_CASE_TRUTH_TEMPLATE
        prompt_parts = [CASE_TRUTH_GENERATION_PROMPT, f"Template:\n{template}"]
        if input.premise:
            prompt_parts.append(f"Premise:\n{input.premise}")
        if transcript:
            prompt_parts.append(f"Session transcript (last 30 messages):\n{transcript}")
        if existing_case_truth.strip() and existing_case_truth.strip() != template.strip():
            prompt_parts.append(f"Current (partially filled) case record — do NOT overwrite filled sections:\n{existing_case_truth}")

        llm_settings = await _get_llm_settings()
        gen_chat = create_chat(f"casegen-{session_id}", CASE_TRUTH_GENERATION_PROMPT, llm_settings)
        generated = await gen_chat.send_message(UserMessage(text="\n\n".join(prompt_parts)))

        if existing_case_truth.strip() and existing_case_truth.strip() != template.strip():
            final_case_truth = merge_case_truth_empty_slots(existing_case_truth, generated)
        else:
            final_case_truth = generated

        await db.sessions.update_one(
            {"id": session_id},
            {"$set": {"case_truth": final_case_truth, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )

        sections = parse_case_truth_sections(final_case_truth)
        return {"case_truth": final_case_truth, "sections": sections}

    except Exception as e:
        logger.error(f"Error generating case truth: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate case truth: {str(e)}")

@api_router.post("/sessions/{session_id}/suggest-title", response_model=SessionTitleSuggestionResponse)
async def suggest_session_title(session_id: str, input: SessionTitleSuggestionRequest):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = session.get("messages", [])
    if not messages:
        return SessionTitleSuggestionResponse(title="New Session")

    try:
        recent = messages[-15:]
        transcript = "\n".join([f"{'Player' if m['role']=='user' else 'ST'}: {m.get('content','')[:200]}" for m in recent])

        campaign_hint = ""
        if input.include_campaign_context and session.get("campaign_id"):
            campaign = await db.campaigns.find_one({"id": session["campaign_id"]}, {"_id": 0, "name": 1})
            if campaign:
                campaign_hint = f"\nThis session is part of the chronicle: {campaign.get('name', '')}."

        llm_settings = await _get_llm_settings()
        title_chat = create_chat(
            f"title-{session_id}",
            "Generate a short, evocative title for this TTRPG session. Return ONLY the title, nothing else. Keep it under 8 words.",
            llm_settings,
        )
        title = await title_chat.send_message(UserMessage(text=f"Session transcript:{campaign_hint}\n{transcript}"))
        title = title.strip().strip('"').strip("'")
        return SessionTitleSuggestionResponse(title=title)
    except Exception as e:
        logger.error(f"Error suggesting title: {e}")
        return SessionTitleSuggestionResponse(title="Untitled Session")


# ========================
# CHARACTERS
# ========================

@api_router.post("/characters", response_model=Character)
async def create_character(input: CharacterCreate):
    character = Character(
        name=input.name or ("New Mage" if input.character_type == "mage" else "New Sin-Eater"),
        character_type=input.character_type or "geist"
    )
    await db.characters.insert_one(character.model_dump())
    result = character.model_dump()
    result.pop("_id", None)
    return result

@api_router.get("/characters", response_model=List[Character])
async def get_characters():
    characters = await db.characters.find({}, {"_id": 0}).to_list(100)
    return characters

@api_router.get("/characters/{character_id}", response_model=Character)
async def get_character(character_id: str):
    character = await db.characters.find_one({"id": character_id}, {"_id": 0})
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character

@api_router.put("/characters/{character_id}", response_model=Character)
async def update_character(character_id: str, input: CharacterUpdate):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.characters.update_one({"id": character_id}, {"$set": update_data})
    character = await db.characters.find_one({"id": character_id}, {"_id": 0})
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character

@api_router.delete("/characters/{character_id}")
async def delete_character(character_id: str):
    result = await db.characters.delete_one({"id": character_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Character not found")
    return {"status": "deleted"}


# ========================
# CAMPAIGNS
# ========================

@api_router.post("/campaigns", response_model=Campaign)
async def create_campaign(input: CampaignCreate):
    campaign = Campaign(name=input.name or "New Chronicle", description=input.description or "")
    await db.campaigns.insert_one(campaign.model_dump())
    result = campaign.model_dump()
    result.pop("_id", None)
    return result

@api_router.get("/campaigns", response_model=List[Campaign])
async def get_campaigns():
    campaigns = await db.campaigns.find({}, {"_id": 0}).sort("updated_at", -1).to_list(100)
    return campaigns

@api_router.get("/campaigns/{campaign_id}", response_model=Campaign)
async def get_campaign(campaign_id: str):
    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@api_router.put("/campaigns/{campaign_id}", response_model=Campaign)
async def update_campaign(campaign_id: str, input: CampaignUpdate):
    update_data = {}
    raw = input.model_dump()
    for k, v in raw.items():
        if v is not None:
            update_data[k] = v
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        if "world_state" in update_data:
            update_data["world_state"] = dedupe_world_state_once(update_data["world_state"])
        if "plot_threads" in update_data:
            update_data["plot_threads"] = dedupe_plot_threads_once(update_data["plot_threads"])
        await db.campaigns.update_one({"id": campaign_id}, {"$set": update_data})
    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@api_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str):
    result = await db.campaigns.delete_one({"id": campaign_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    await db.sessions.update_many({"campaign_id": campaign_id}, {"$set": {"campaign_id": None}})
    return {"status": "deleted"}


# ========================
# CAMPAIGN JOURNAL
# ========================

@api_router.post("/campaigns/{campaign_id}/journal/generate")
async def generate_journal_entry(campaign_id: str, input: GenerateJournalRequest):
    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    session = await db.sessions.find_one({"id": input.session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        messages = session.get("messages", [])
        if not messages:
            raise HTTPException(status_code=400, detail="Session has no messages")

        recent = messages[-30:]
        transcript = "\n".join([f"{'Player' if m['role']=='user' else 'ST'}: {m.get('content','')[:300]}" for m in recent])

        existing_journal = campaign.get("journal", {})
        existing_entries = existing_journal.get("entries", [])
        context_entries = existing_entries[-3:]
        context_text = ""
        if context_entries:
            context_text = "Previous journal entries for context:\n" + "\n".join([
                f"- {e.get('session_title', 'Session')}: {e.get('summary', '')[:200]}" for e in context_entries
            ])

        JOURNAL_SYSTEM_MSG = (
                "You generate concise journal entries for a TTRPG campaign. "
                "Return JSON with: summary (2-3 paragraphs), key_events (array of strings), "
                "npcs_encountered (array of names), mysteries_uncovered (array of strings). "
                "Also generate world_state_updates (array of {fact, category, fact_key}) for PERSISTENT world-building facts ONLY. "
                "Valid world_state categories: general, territory, underworld, supernatural, dominion, faction, secret, event. "
                "ONLY include facts that permanently change the world and should be remembered across all future sessions. "
                "Good examples: 'The Avernian Gate beneath St. Mary's has been sealed', 'The Krewe of the Pallid Mask controls the Docks', "
                "'A new Dominion has formed in the abandoned hospital's Underworld reflection'. "
                "Do NOT include: investigation leads, clue details, suspect theories, temporary scene descriptions, "
                "NPC dialogue, player intentions, or anything that is speculation rather than established fact. "
                "Also generate plot_thread_updates (array of {title, description, status, thread_key}). "
                "Return valid JSON only."
        )
        llm_settings = await _get_llm_settings()
        journal_chat = create_chat(f"journal-{campaign_id}", JOURNAL_SYSTEM_MSG, llm_settings)

        prompt = f"{context_text}\n\nSession transcript:\n{transcript}"
        response = await journal_chat.send_message(UserMessage(text=prompt))

        try:
            data = json.loads(response.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip())
        except json.JSONDecodeError:
            data = {"summary": response, "key_events": [], "npcs_encountered": [], "mysteries_uncovered": []}

        journal_entry_data = {
            "id": str(uuid.uuid4()),
            "session_id": input.session_id,
            "session_title": session.get("title", "Session"),
            "date": datetime.now(timezone.utc).isoformat(),
            "summary": data.get("summary", ""),
            "key_events": data.get("key_events", []),
            "npcs_encountered": data.get("npcs_encountered", []),
            "mysteries_uncovered": data.get("mysteries_uncovered", []),
        }

        # Build pending updates
        pending_updates = existing_journal.get("pending_updates", [])

        journal_pending = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "update_type": "journal_entry",
            "data": journal_entry_data,
            "ai_reasoning": "Auto-generated from session transcript",
        }
        pending_updates = upsert_pending_journal_entry(pending_updates, journal_pending)

        for ws in data.get("world_state_updates", []):
            ws_pending = {
                "id": str(uuid.uuid4()),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "update_type": "world_state",
                "data": ws,
                "ai_reasoning": "Extracted from session events",
            }
            pending_updates = upsert_pending_world_state(pending_updates, ws_pending)

        for pt in data.get("plot_thread_updates", []):
            pt_pending = {
                "id": str(uuid.uuid4()),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "update_type": "plot_thread",
                "data": pt,
                "ai_reasoning": "Extracted from session events",
            }
            pending_updates = upsert_pending_plot_thread(pending_updates, pt_pending)

        await db.campaigns.update_one(
            {"id": campaign_id},
            {"$set": {
                "journal.pending_updates": pending_updates,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )

        campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
        return campaign

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating journal: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate journal: {str(e)}")


@api_router.post("/campaigns/{campaign_id}/journal/approve")
async def approve_journal_update(campaign_id: str, input: JournalUpdateApproval):
    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    journal = campaign.get("journal", {})
    pending = journal.get("pending_updates", [])
    update = next((u for u in pending if u.get("id") == input.update_id), None)
    if not update:
        raise HTTPException(status_code=404, detail="Update not found")

    new_pending = [u for u in pending if u.get("id") != input.update_id]

    if input.approved:
        update_type = update.get("update_type")
        data = input.modified_data or update.get("data", {})

        if update_type == "journal_entry":
            entries = journal.get("entries", [])
            entries = upsert_journal_entry(entries, data)
            entries = dedupe_journal_entries(entries)
            await db.campaigns.update_one(
                {"id": campaign_id},
                {"$set": {
                    "journal.entries": entries,
                    "journal.pending_updates": new_pending,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        elif update_type == "world_state":
            world_state = campaign.get("world_state", [])
            world_state = upsert_world_state_fact(world_state, data)
            world_state = dedupe_world_state_once(world_state)
            await db.campaigns.update_one(
                {"id": campaign_id},
                {"$set": {
                    "world_state": world_state,
                    "journal.pending_updates": new_pending,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        elif update_type == "plot_thread":
            threads = campaign.get("plot_threads", [])
            threads = upsert_plot_thread(threads, data)
            threads = dedupe_plot_threads_once(threads)
            await db.campaigns.update_one(
                {"id": campaign_id},
                {"$set": {
                    "plot_threads": threads,
                    "journal.pending_updates": new_pending,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
    else:
        await db.campaigns.update_one(
            {"id": campaign_id},
            {"$set": {
                "journal.pending_updates": new_pending,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )

    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    return campaign


# ========================
# SETTINGS
# ========================

@api_router.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({"_type": "storyteller"}, {"_id": 0})
    if not doc:
        return StorytellerSettings().model_dump()
    doc.pop("_type", None)
    return doc

@api_router.put("/settings")
async def update_settings(input: StorytellerSettingsUpdate):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        doc = await db.settings.find_one({"_type": "storyteller"}, {"_id": 0})
        if doc:
            doc.pop("_type", None)
            return doc
        return StorytellerSettings().model_dump()
    result = await db.settings.find_one_and_update(
        {"_type": "storyteller"},
        {"$set": update_data},
        upsert=True,
        return_document=True
    )
    result.pop("_id", None)
    result.pop("_type", None)

    # Invalidate LLM caches if provider settings changed
    llm_fields = {"external_llm_provider", "external_llm_api_key", "external_llm_model", "external_llm_base_url"}
    if llm_fields & set(update_data.keys()):
        invalidate_llm_caches()

    return result


# ========================
# DICE
# ========================

@api_router.post("/dice/roll", response_model=DiceRollResult)
async def roll_dice(request: DiceRollRequest):
    dice = []
    pool = max(1, request.pool) if not request.chance else 1
    again_threshold = request.again if not request.chance else 11

    def roll_single():
        return random.randint(1, 10)

    for _ in range(pool):
        die = roll_single()
        dice.append(die)
        while die >= again_threshold:
            die = roll_single()
            dice.append(die)

    if request.rote and not request.chance:
        reroll_indices = [i for i, d in enumerate(dice) if d < 8 and i < pool]
        for idx in reroll_indices:
            new_die = roll_single()
            dice.append(new_die)
            while new_die >= again_threshold:
                new_die = roll_single()
                dice.append(new_die)

    successes = sum(1 for d in dice if d >= 8)

    if request.chance:
        is_dramatic = dice[0] == 1
        successes = 1 if dice[0] == 10 else 0
        is_exceptional = False
        beat_awarded = is_dramatic
    else:
        is_dramatic = False
        is_exceptional = successes >= 5
        beat_awarded = False

    if is_dramatic:
        desc = "Dramatic Failure! The spirits turn against you."
    elif is_exceptional:
        desc = f"Exceptional Success! ({successes} successes)"
    elif successes > 0:
        desc = f"{successes} success{'es' if successes > 1 else ''}"
    else:
        desc = "Failure. The darkness closes in."

    return DiceRollResult(
        dice=dice,
        successes=successes,
        is_exceptional=is_exceptional,
        is_dramatic_failure=is_dramatic,
        beat_awarded=beat_awarded,
        description=desc
    )


# ========================
# APP SETUP
# ========================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Serve React static build (production mode)
STATIC_DIR = ROOT_DIR / "static"
if STATIC_DIR.exists() and (STATIC_DIR / "index.html").exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR / "static")), name="static-assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = STATIC_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(STATIC_DIR / "index.html"))
