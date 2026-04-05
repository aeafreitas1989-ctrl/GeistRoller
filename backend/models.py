from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone


class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str  # 'user', 'storyteller', or 'system'
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "New Session"
    campaign_id: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    messages: List[Message] = []
    session_truth: str = ""
    case_truth: str = ""

class SessionCreate(BaseModel):
    title: Optional[str] = "New Session"
    campaign_id: Optional[str] = None

class SessionUpdate(BaseModel):
    title: Optional[str] = None
    campaign_id: Optional[str] = None

class SessionTitleSuggestionRequest(BaseModel):
    include_campaign_context: bool = True

class SessionTitleSuggestionResponse(BaseModel):
    title: str

class CaseTruthUpdate(BaseModel):
    case_truth: str

class GenerateCaseTruthRequest(BaseModel):
    premise: str = ""

class MessageCreate(BaseModel):
    content: str
    character_context: Optional[Dict[str, Any]] = None
    storyteller_settings: Optional[Dict[str, Any]] = None

class SystemMessageCreate(BaseModel):
    content: str


# Campaign Models

class CampaignFaction(BaseModel):
    name: str
    description: str = ""
    relationship: str = "neutral"
    territory: str = ""
    notes: str = ""

class CampaignNPC(BaseModel):
    name: str
    description: str = ""
    type: str = ""
    status: str = "active"
    first_appeared: str = ""
    last_seen: str = ""
    notes: str = ""

class PlotThread(BaseModel):
    thread_key: str = ""
    title: str
    description: str = ""
    status: str = "active"
    introduced_session: str = ""
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    resolution_notes: str = ""

class WorldStateFact(BaseModel):
    fact_key: str = ""
    fact: str
    category: str = "general"
    session_established: str = ""
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class JournalEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    session_title: str
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    summary: str
    key_events: List[str] = Field(default_factory=list)
    npcs_encountered: List[str] = Field(default_factory=list)
    mysteries_uncovered: List[str] = Field(default_factory=list)

class PendingJournalUpdate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    update_type: str
    data: Dict[str, Any]
    ai_reasoning: str = ""

class CampaignJournal(BaseModel):
    entries: List[JournalEntry] = Field(default_factory=list)
    pending_updates: List[PendingJournalUpdate] = Field(default_factory=list)

class Campaign(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = "New Chronicle"
    description: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    world_state: List[WorldStateFact] = Field(default_factory=list)
    factions: List[CampaignFaction] = Field(default_factory=list)
    recurring_npcs: List[CampaignNPC] = Field(default_factory=list)
    plot_threads: List[PlotThread] = Field(default_factory=list)
    journal: CampaignJournal = Field(default_factory=CampaignJournal)

class CampaignCreate(BaseModel):
    name: Optional[str] = "New Chronicle"
    description: Optional[str] = ""

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    world_state: Optional[List[Dict[str, Any]]] = None
    factions: Optional[List[Dict[str, Any]]] = None
    recurring_npcs: Optional[List[Dict[str, Any]]] = None
    plot_threads: Optional[List[Dict[str, Any]]] = None

class JournalUpdateApproval(BaseModel):
    update_id: str
    approved: bool
    modified_data: Optional[Dict[str, Any]] = None

class GenerateJournalRequest(BaseModel):
    session_id: str
    force_regenerate: bool = False


# Condition Model

class Condition(BaseModel):
    name: str
    type: str
    description: str = ""
    resolution: str = ""


# Character Models

class Character(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    character_type: str = "geist"  # "geist" or "mage"
    name: str = "New Sin-Eater"
    # Mage-specific fields
    gnosis: int = 1
    wisdom: int = 7
    mana: int = 10
    nimbus: str = ""
    nimbus_long_term: str = ""
    nimbus_immediate: str = ""
    nimbus_signature: str = ""
    nimbus_tilt: str = ""
    arcana: Dict[str, int] = Field(default_factory=dict)  # e.g., {"Death": 2, "Spirit": 3}
    rotes: List[Dict[str, Any]] = Field(default_factory=list)  # [{spell, arcanum, dots, skill}]
    praxes: List[Dict[str, Any]] = Field(default_factory=list)  # [{spell, arcanum, dots}]
    attainments: List[str] = Field(default_factory=list)  # auto-calculated from arcana
    concept: str = ""
    geist_name: str = ""
    geist_description: str = ""
    burden: str = ""
    krewe: str = ""
    archetype: str = ""
    innate_key: str = ""
    geist_innate_key: str = ""
    geist_rank: int = 1
    # Mage-specific fields
    path: str = ""  # Acanthus, Mastigos, Moros, Obrimos, Thyrsus
    order: str = ""  # Adamantine Arrow, Guardians of the Veil, Mysterium, Silver Ladder, Free Council
    obsession: str = ""  # Mage's Obsession (replaces Burden Aspiration)
    remembrance_trait_type: str = ""
    remembrance_trait: str = ""
    root: str = ""
    bloom: str = ""
    virtue: str = ""
    vice: str = ""
    ban: str = ""
    bane: str = ""
    remembrance_1: str = ""
    remembrance_2: str = ""
    remembrance_3: str = ""
    remembrance_1_complete: bool = False
    remembrance_2_complete: bool = False
    remembrance_3_complete: bool = False
    attributes: Dict[str, int] = Field(default_factory=lambda: {
        "intelligence": 1, "wits": 1, "resolve": 1,
        "strength": 1, "dexterity": 1, "stamina": 1,
        "presence": 1, "manipulation": 1, "composure": 1
    })
    skills: Dict[str, int] = Field(default_factory=lambda: {
        "academics": 0, "computer": 0, "crafts": 0, "investigation": 0, "medicine": 0,
        "occult": 0, "politics": 0, "science": 0,
        "athletics": 0, "brawl": 0, "drive": 0, "firearms": 0, "larceny": 0,
        "stealth": 0, "survival": 0, "weaponry": 0,
        "animal_ken": 0, "empathy": 0, "expression": 0, "intimidation": 0,
        "persuasion": 0, "socialize": 0, "streetwise": 0, "subterfuge": 0
    })
    specialties: List[str] = Field(default_factory=list)
    synergy: int = 7
    synergy_max: int = 10
    touchstones: List[str] = Field(default_factory=list)
    plasm: int = 5
    haunts: Dict[str, int] = Field(default_factory=dict)
    keys: List[str] = Field(default_factory=list)
    mementos: List[Dict[str, Any]] = Field(default_factory=list)
    conditions: List[Dict[str, Any]] = Field(default_factory=list)
    active_spells: List[Dict[str, Any]] = Field(default_factory=list)
    places_people: List[Dict[str, Any]] = Field(default_factory=list)
    size: int = 5
    health: int = 7
    health_boxes: List[str] = Field(default_factory=list)
    willpower: int = 5
    willpower_max_modifier: int = 0
    armor: int = 0
    beats: int = 0
    experience: int = 0
    merits_list: List[Dict[str, Any]] = Field(default_factory=list)
    ceremonies_list: List[Dict[str, Any]] = Field(default_factory=list)
    inventory_items: List[Dict[str, Any]] = Field(default_factory=list)
    aspiration_short_1: str = ""
    aspiration_short_2: str = ""
    aspiration_long: str = ""
    aspiration_burden: str = ""
    notes: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CharacterCreate(BaseModel):
    name: Optional[str] = "New Character"
    character_type: Optional[str] = "geist"  # "geist" or "mage"

class CharacterUpdate(BaseModel):
    character_type: Optional[str] = None
    name: Optional[str] = None
    # Mage fields
    gnosis: Optional[int] = None
    wisdom: Optional[int] = None
    mana: Optional[int] = None
    nimbus: Optional[str] = None
    nimbus_long_term: Optional[str] = None
    nimbus_immediate: Optional[str] = None
    nimbus_signature: Optional[str] = None
    nimbus_tilt: Optional[str] = None
    arcana: Optional[Dict[str, int]] = None
    rotes: Optional[List[Dict[str, Any]]] = None
    praxes: Optional[List[Dict[str, Any]]] = None
    attainments: Optional[List[str]] = None
    concept: Optional[str] = None
    geist_name: Optional[str] = None
    geist_description: Optional[str] = None
    burden: Optional[str] = None
    krewe: Optional[str] = None
    archetype: Optional[str] = None
    innate_key: Optional[str] = None
    geist_innate_key: Optional[str] = None
    geist_rank: Optional[int] = None
    path: Optional[str] = None  # Mage path
    order: Optional[str] = None  # Mage order
    obsession: Optional[str] = None  # Mage obsession
    remembrance_trait_type: Optional[str] = None
    remembrance_trait: Optional[str] = None
    root: Optional[str] = None
    bloom: Optional[str] = None
    virtue: Optional[str] = None
    vice: Optional[str] = None
    ban: Optional[str] = None
    bane: Optional[str] = None
    remembrance_1: Optional[str] = None
    remembrance_2: Optional[str] = None
    remembrance_3: Optional[str] = None
    remembrance_1_complete: Optional[bool] = None
    remembrance_2_complete: Optional[bool] = None
    remembrance_3_complete: Optional[bool] = None
    attributes: Optional[Dict[str, int]] = None
    skills: Optional[Dict[str, int]] = None
    specialties: Optional[List[str]] = None
    synergy: Optional[int] = None
    synergy_max: Optional[int] = None
    touchstones: Optional[List[str]] = None
    plasm: Optional[int] = None
    haunts: Optional[Dict[str, int]] = None
    keys: Optional[List[str]] = None
    mementos: Optional[List[Dict[str, Any]]] = None
    conditions: Optional[List[Dict[str, Any]]] = None
    active_spells: Optional[List[Dict[str, Any]]] = None
    places_people: Optional[List[Dict[str, Any]]] = None
    size: Optional[int] = None
    health: Optional[int] = None
    health_boxes: Optional[List[str]] = None
    willpower: Optional[int] = None
    willpower_max_modifier: Optional[int] = None
    armor: Optional[int] = None
    beats: Optional[int] = None
    experience: Optional[int] = None
    merits_list: Optional[List[Dict[str, Any]]] = None
    ceremonies_list: Optional[List[Dict[str, Any]]] = None
    inventory_items: Optional[List[Dict[str, Any]]] = None
    aspiration_short_1: Optional[str] = None
    aspiration_short_2: Optional[str] = None
    aspiration_long: Optional[str] = None
    aspiration_burden: Optional[str] = None
    notes: Optional[str] = None


# Storyteller Settings Models

class StorytellerSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    scene_summary_level: str = "standard"
    suggest_rolls: bool = True
    include_modifiers: bool = True
    supernatural_presence: str = "average"
    escalation_speed: str = "gradual"
    opposition_competence: str = "competent"
    lethality_bias: str = "neutral"
    raw_strictness: str = "raw_with_interpretation"
    storyteller_doctrine: str = ""
    tone_description: str = ""
    chronicle_scope: str = ""
    setting_constraints: str = ""
    npc_behavioral_rules: str = ""
    writing_style: str = ""
    additional_info: str = ""
    external_llm_provider: str = ""
    external_llm_api_key: str = ""
    external_llm_model: str = ""
    external_llm_base_url: str = ""

class StorytellerSettingsUpdate(BaseModel):
    scene_summary_level: Optional[str] = None
    suggest_rolls: Optional[bool] = None
    include_modifiers: Optional[bool] = None
    supernatural_presence: Optional[str] = None
    escalation_speed: Optional[str] = None
    opposition_competence: Optional[str] = None
    lethality_bias: Optional[str] = None
    raw_strictness: Optional[str] = None
    storyteller_doctrine: Optional[str] = None
    tone_description: Optional[str] = None
    chronicle_scope: Optional[str] = None
    setting_constraints: Optional[str] = None
    npc_behavioral_rules: Optional[str] = None
    writing_style: Optional[str] = None
    additional_info: Optional[str] = None
    external_llm_provider: Optional[str] = None
    external_llm_api_key: Optional[str] = None
    external_llm_model: Optional[str] = None
    external_llm_base_url: Optional[str] = None


# Dice Models

class DiceRollRequest(BaseModel):
    pool: int
    again: int = 10
    rote: bool = False
    chance: bool = False
    exceptional_target: int = 5

class DiceRollResult(BaseModel):
    dice: List[int]
    successes: int
    is_exceptional: bool
    is_dramatic_failure: bool
    beat_awarded: bool
    description: str
