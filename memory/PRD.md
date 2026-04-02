# Geist: The Sin-Eaters & Mage: The Awakening - Character Sheet & Dice Roller

## Overview
A digital character sheet and dice roller for Chronicles of Darkness tabletop RPGs, supporting both Geist: The Sin-Eaters and Mage: The Awakening game lines.

## Core Requirements
- Character sheet management for Sin-Eater and Mage characters
- Game cards (Conditions, Haunts, Keys, Ceremonies, Merits, Places & People)
- Campaign tracking (Journal, World State, NPCs, Plot Threads)
- Dice roller with Chronicles of Darkness mechanics
- Mage spellcasting system with full mechanical support

## Architecture
- **Frontend**: React.js with TailwindCSS, shadcn/ui components
- **Backend**: FastAPI (Python)
- **Database**: MongoDB

## What's Been Implemented

### Core Features
1. **Character Tab** - Full character sheet with collapsible sections, character type selection (Sin-Eater/Mage)
2. **Cards Tab** - Case Files, Conditions, Haunts, Keys, Ceremonies, Merits, Places & People
3. **Campaign Tab** - Journal, World State, Factions, NPCs, Plot Threads
4. **Floating Dice Roller** - Adjustable pool, 10/9/8-again, rote, chance die, visual results

### Mage: The Awakening Features
- Character type selector with conditional UI rendering
- Gnosis & Resources (Gnosis, Nimbus, Mana)
- 10 Arcana with dots, Rotes, Praxes, auto Attainments (1-5 dot)
- Path (Acanthus, Mastigos, Moros, Obrimos, Thyrsus) with auto Ruling/Inferior Arcana
- Order (Adamantine Arrow, Guardians, Mysterium, Silver Ladder, Free Council) with Rote Skills
- Arcana Practices system (clickable badges per Arcanum)
- Virtue/Vice (replacing Root/Bloom), Obsession (replacing Burden Aspiration for Mages)

### Spellcasting Popup (Feb 2026)
- Full spell factor system: Casting Time, Range, Potency, Duration, Scale (Standard/Advanced)
- Reach tracking: Free Reach calculation, Advanced factor reach cost
- **Paradox System**: Base paradox from Reach beyond free × Gnosis paradox dice
  - Modifiers: Inured (+2), Sleeper Witnesses (+1 die, scale affects roll quality), Dedicated Tool (-2), Previous Rolls (+N cumulative)
  - **Mana Mitigation**: Spend Mana to remove Paradox dice (-1 per Mana), respects per-turn Mana limit
  - **Chance Die Rule**: If Paradox was ever triggered and Mana reduces pool to 0, rolls as Chance Die
- **Yantras**: Selectable bonus dice tools (Dedicated Tool, Path/Order Tool, Mudra, High Speech, Concentration, Rote Skill Mudra, Demesne/Verge, Location, Sacrament (+1 to +3), Persona, Sympathy), limited by Gnosis max yantras
- **Dice Roller Integration**: Cast Spell triggers the global floating Dice Roller with correct pool, label, and auto-roll; Roll Paradox button appears after spell roll if paradox exists

### Removed Features
- AI chat interface, AI-powered storytelling, AI journal generation, AI session summary

## Key DB Schema
- `characters`: `{ id, character_type, name, virtue, vice, obsession, path, order, arcana: {}, rotes: [], praxes: [], skills: {}, gnosis, mana, ... }`

## P0/P1/P2 Features Remaining

### P2 (Backlog)
- Mage Armor activation tracking
- Refactor CharacterPanel.jsx (3400+ lines → MageSheet, GeistSheet components)
- Export/import character data
- Multiple character management improvements
- Print-friendly character sheet view

### P3 (Future)
- Krewe (group) management
- Shared campaign viewing
- Character portraits
