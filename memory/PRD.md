# Geist: The Sin-Eaters - Character Sheet & Dice Roller

## Overview
A digital character sheet and dice roller for the Geist: The Sin-Eaters tabletop roleplaying game.

## Core Requirements
- Character sheet management for Sin-Eater characters
- Game cards (Conditions, Haunts, Keys, Ceremonies, Merits, Places & People)
- Campaign tracking (Journal, World State, NPCs, Plot Threads)
- Dice roller with Chronicles of Darkness mechanics

## Architecture
- **Frontend**: React.js with TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB

## What's Been Implemented (Jan 2026)

### Core Features
1. **Character Tab**
   - Full character sheet with collapsible sections
   - Character Info, Geist & Remembrance, Attributes & Skills
   - Combat & Inventory, Synergy & Resources
   - Haunts, Keys & Mementos, Merits & Ceremonies, Notes
   - Beats/Experience tracking

2. **Cards Tab**
   - Case File management
   - Conditions tracking with add/remove/resolve
   - Haunts with ratings
   - Keys with unlocking system
   - Ceremonies with activation
   - Merits reference
   - Places & People tracking

3. **Campaign Tab**
   - Campaign Journal (manual entries)
   - World State tracking
   - Factions management
   - Recurring NPCs
   - Plot Threads

4. **Dice Roller (Floating)**
   - Adjustable dice pool
   - 10-again, 9-again, 8-again, no-again options
   - Rote quality toggle
   - Chance die option
   - Visual dice results with success counting

### Removed Features (AI/Storyteller)
- AI chat interface
- AI-powered storytelling
- AI journal generation
- AI session summary

## User Personas
- **TTRPG Players**: Managing Sin-Eater characters during play
- **Storytellers/GMs**: Tracking campaign world state

## P0/P1/P2 Features

### P0 (Done)
- Character sheet CRUD
- Dice rolling mechanics
- Campaign tracking
- Merit adding (bug fixed Jan 2026)
- **Mage character template (Jan 2026)**
  - Character type selector (Sin-Eater/Mage)
  - Character type badge next to dropdown
  - Conditional section rendering
  - Gnosis & Resources (Gnosis, Nimbus, Mana)
  - Arcana, Spells & Attainments (10 Arcana, Rotes, Praxes, auto Attainments)

### P1 (Backlog)
- Export/import character data
- Multiple character management improvements
- Print-friendly character sheet view

### P2 (Future)
- Krewe (group) management
- Shared campaign viewing
- Character portraits

## Next Tasks
- Address nested button HTML warnings in Sidebar
- Consider adding character portrait support
- Add data export functionality
