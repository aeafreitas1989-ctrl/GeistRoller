from pathlib import Path
from typing import List
import logging
import os

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from database import client, db
from dice_engine import resolve_dice_roll
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


@api_router.get("/")
async def api_root():
    return {"status": "ok", "service": "GeistRoller API"}


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


# ========================
# CHARACTERS
# ========================

@api_router.get("/characters", response_model=List[Character])
async def get_characters():
    return await db.characters.find({}, {"_id": 0}).to_list(1000)


@api_router.get("/characters/{character_id}", response_model=Character)
async def get_character(character_id: str):
    character = await db.characters.find_one({"id": character_id}, {"_id": 0})
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character


@api_router.post("/characters", response_model=Character)
async def create_character(input: CharacterCreate):
    character = Character(
        name=input.name or "New Character",
        character_type=input.character_type or "geist",
    )

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


@api_router.put("/characters/{character_id}", response_model=Character)
async def update_character(character_id: str, input: CharacterUpdate):
    update_data = input.model_dump(exclude_unset=True)
    if update_data:
        result = await db.characters.update_one(
            {"id": character_id},
            {"$set": update_data},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Character not found")

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
