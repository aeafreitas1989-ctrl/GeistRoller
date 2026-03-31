# Geist: The Sin-Eaters AI Storyteller

_Last updated: 2026-03-26 (Frontend Refactoring Complete)_

## Original Problem Statement
Build an AI Storyteller for a game of Geist: the Sin-Eaters, where the AI takes the role of the Storyteller and has full access to the rules of the game.

## User Personas
- **Tabletop RPG Players**: Players of Geist: the Sin-Eaters looking for a solo or co-op AI-guided experience
- **World of Darkness Enthusiasts**: Fans of Chronicles of Darkness seeking immersive storytelling
- **Game Masters**: GMs wanting inspiration or an assistant for session prep

## Core Requirements
- AI Storyteller powered by OpenAI GPT-5.2
- Full knowledge of Geist: the Sin-Eaters 2nd Edition rules
- Character sheet management (Sin-Eater attributes, Synergy, Plasm, Haunts, Keys, Touchstones, Geist details)
- Chronicles of Darkness dice system (10-again + chance die)
- Session save/load functionality
- Dark gothic horror UI theme

## Architecture
- **Frontend**: React with Shadcn UI, Tailwind CSS
- **Backend**: FastAPI with Motor (async MongoDB), modular architecture
- **Database**: MongoDB
- **AI**: OpenAI GPT-5.2 via emergentintegrations library

### Backend Structure (Refactored)
```
/app/backend/
├── server.py          # Routes + app setup (~560 lines)
├── models.py          # All Pydantic models (~290 lines)
├── ai_prompts.py      # System prompts + context builders (~480 lines)
├── campaign_utils.py  # Campaign helper functions (~200 lines)
└── database.py        # MongoDB connection
```

### Frontend Structure (Refactored)
```
/app/frontend/src/
├── data/
│   ├── character-data.js     # Static data: Haunts, Keys, Merits, Ceremonies, etc.
│   └── cards-data.js         # Static data: Conditions, Key/Haunt definitions, CardTypeColors
├── components/
│   ├── character/
│   │   ├── StatComponents.jsx      # StatDots, StatRow, HealthTrack, ResourceTrack, SynergyTrack
│   │   ├── CardComponents.jsx      # MementoCard, MeritCard, CeremonyCard (character sheet)
│   │   └── InlineDiceRoller.jsx    # Full dice roller component
│   ├── cards/
│   │   └── CardComponents.jsx      # MeritCard, CeremonyCard, PlacePersonCard, ConditionCard, HauntCard, KeyCard
│   ├── CharacterPanel.jsx    # (~2774 lines, was 4579)
│   ├── GameCardsPanel.jsx    # (~857 lines, was 1914)
│   ├── ChatInterface.jsx
│   ├── CampaignPanel.jsx
│   ├── SettingsPanel.jsx
│   └── ...
└── pages/
    └── StorytellerPage.jsx   # (~1000 lines, next refactor candidate)
```

## What's Been Implemented

### Core Features
- [x] AI Storyteller with comprehensive Geist rules knowledge
- [x] Chat-based storytelling interface with session management
- [x] AI Context Sharing - full character data + storyteller settings sent with every message
- [x] Character sheet with full Sin-Eater stats
- [x] Geist & Remembrance fields
- [x] Dice roller (Attribute+Skill, Haunt activation, Chance die, Again/Rote, Willpower +3, wound penalty)
- [x] Haunt roll mechanics: Plasm cost, Enhancement list, Key Unlock, Avoid Doom
- [x] Dice roll results sent to chat
- [x] Health damage track with bashing/lethal/aggravated cycling
- [x] Session history with save/load
- [x] Dark gothic UI with Crimson Text, Manrope, JetBrains Mono fonts
- [x] Responsive design with collapsible panels, sticky side panel

### Cards Panel
- [x] Conditions with add/remove, origin tagging, and **Resolve button** (grants a Beat)
- [x] Haunts (all 10 with 1-5 rating)
- [x] Keys (consolidated from Character/Geist/Mementos with source badges)
- [x] Ceremonies (Death Watch, Ishtar's Perfume, etc.) with dice pools
- [x] Merits (dot ratings, category badges, expandable descriptions)
- [x] Places & People tracker

### Settings Panel (Completed)
- [x] Global Storyteller AI Settings (cogwheel tab)
- [x] Scene Summary Level, Suggest Rolls, Supernatural Presence, Escalation Speed
- [x] Opposition Competence, Lethality Bias, RAW Strictness
- [x] Custom Directives: Storyteller Doctrine, Tone, Chronicle Scope, etc.
- [x] Settings persisted in MongoDB, sent with every chat message to AI

### End-of-Chapter Beat Awards (Completed)
- [x] "End Chapter" button with AI summary + Beat calculation
- [x] Beat Award Card with editable category counts
- [x] Auto-converts 5 Beats → 1 XP

### Clickable Roll Suggestions (Completed)
- [x] AI embeds `{roll|...}` tokens rendered as teal pill buttons
- [x] Opens ChatRollPopup pre-filled with pool/again/rote

### Session Summary Cards (Completed)
- [x] AI generates `{summary|...}` tokens for Session Summary section

### Frontend Refactoring (Completed - 2026-03-26)
- [x] Extracted static data from CharacterPanel.jsx → `/data/character-data.js`
- [x] Extracted static data from GameCardsPanel.jsx → `/data/cards-data.js`
- [x] Extracted stat components → `/components/character/StatComponents.jsx`
- [x] Extracted character cards → `/components/character/CardComponents.jsx`
- [x] Extracted InlineDiceRoller → `/components/character/InlineDiceRoller.jsx`
- [x] Extracted game cards → `/components/cards/CardComponents.jsx`
- [x] Updated all import paths (CharacterPanel, GameCardsPanel, ChatInterface)
- [x] CharacterPanel: 4579 → 2774 lines (-39%)
- [x] GameCardsPanel: 1914 → 857 lines (-55%)

### Backend Refactoring (Completed)
- [x] Split server.py (2351 lines) → server.py, models.py, ai_prompts.py, campaign_utils.py, database.py

## API Endpoints
- POST/GET /api/sessions - Session CRUD
- POST/GET /api/sessions/{id}/messages - Chat messages
- POST/PUT/GET/DELETE /api/characters - Character CRUD
- POST /api/dice/roll - Dice rolling
- GET/PUT /api/settings - Global storyteller settings
- POST /api/sessions/{id}/end-chapter - End chapter + Beat awards
- POST /api/sessions/{id}/generate-case-truth - Case file generation
- POST /api/campaigns/{id}/generate-journal - Campaign journal

## Pending Tasks

### P2 - Future Features
- Export session as PDF
- Multiplayer krewe sessions

### P3 - Backlog
- Combat Tracker
- Ghost/NPC database management
- Voice narration / TTS for the AI

### Refactoring Candidates
- StorytellerPage.jsx (~1000 lines) - next candidate for component extraction

### Deployment (Completed - 2026-03-26)
- [x] Single Dockerfile (multi-stage: React build → FastAPI serving static + API)
- [x] docker-compose.yml (app + MongoDB)
- [x] FastAPI serves React build as SPA with catch-all route
- [x] .env.example, .dockerignore, README.md with setup instructions
- [x] `REACT_APP_BACKEND_URL=""` in production build for same-origin API calls

### Campaign Management UI Polish (Completed - 2026-03-26)
- [x] Strengthened AI journal generation prompt: explicit examples of valid/invalid world state entries
- [x] Geist-specific World State categories: General, Territory, Underworld, Supernatural, Dominion, Faction, Secret, Event
- [x] Color-coded category badges in UI
- [x] Guidance text: "Only add established truths — not investigation leads, theories, or temporary details"
- [x] Inline editing of existing world facts (pencil icon → edit form with save/cancel)
- [x] Textarea for new facts with example placeholder

### External LLM Support (Completed - 2026-03-30)
- [x] Unified LLM wrapper (`llm_wrapper.py`) supporting Emergent and OpenAI-compatible APIs
- [x] Provider presets: OpenRouter, OpenAI, Custom (any OpenAI-compatible endpoint including Ollama)
- [x] Settings panel "External LLM" section with provider, API key (masked), model, and base URL fields
- [x] Auto-fills base URL per provider, editable for proxies/custom endpoints
- [x] Falls back to Emergent key when no external provider configured
- [x] LLM cache invalidation on settings change
- [x] All LLM call sites updated: chat, end-chapter, case truth, title gen, journal gen

### Ban/Bane & Remembrances (Completed - 2026-03-30)
- [x] Added full-width Ban and Bane fields under Virtue/Vice in Geist & Remembrance section
- [x] Added 3 progressive Remembrance fields with checkboxes
- [x] Field 1 always visible; checking it reveals Field 2 and adds +1 Synergy
- [x] Checking Field 2 reveals Field 3 and adds +1 Synergy
- [x] Checking Field 3 adds +1 Synergy and +1 Geist Rank
- [x] Unchecking cascades: unchecking earlier fields also unchecks later ones and reverses stat changes
