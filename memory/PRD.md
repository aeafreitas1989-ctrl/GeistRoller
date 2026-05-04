# TTRPG Character Sheet App — PRD

## Original Problem Statement
Remove the AI part of the app. The app will now be a glorified Character Sheet with a dice roller. Keep Character, Cards and Campaign tabs visible. Introduce a comprehensive Mage: The Awakening character template alongside the existing Geist: The Sin-Eaters template. Manage complex Mage spellcasting rules (Factors, Reach, Paradox, Mana mitigation, Yantras, Rotes, Praxes, Mage Armor) and resource tracking.

## Core Requirements
- Dual character type support: Geist: The Sin-Eaters & Mage: The Awakening
- Global floating dice roller with WoD mechanics (10-again, 9-again, 8-again, rote, chance die)
- Spellcasting Popup with Factors, Reach, Paradox, Mana mitigation, Yantras
- Rotes/Praxes with inline Cast buttons and Order Rote Skills styling
- Mage Armor activation with Defense/General bonuses
- Mage Sight with Revelation/Scrutiny, Opacity tracking, and Scrutiny success tracker
- Resource quick-actions (Pattern Restoration, Pattern Scourge, Hallow)
- Attainments layout: Counterspell + Targeted Summoning buttons (left), Named attainments (right)
- Structured inventory system (weapons, armor, equipment)
- Geist Haunts, Keys, Mementos, Ceremonies
- Collapsible section-based character sheet UI

## Architecture
```
/app/
├── backend/
│   ├── server.py           # FastAPI endpoints
│   ├── models.py           # Pydantic models
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CharacterPanel.jsx      # Orchestrator (~1606 lines, refactored)
│   │   │   ├── SpellcastingPopup.jsx   # Mage Spellcasting UI
│   │   │   ├── DiceRoller.jsx          # Global floating dice roller
│   │   │   ├── GameCardsPanel.jsx      # Cards tab (Mage Sight, Conditions, Active Spells)
│   │   │   ├── character/
│   │   │   │   ├── MageArcanaContent.jsx    # Arcana, Rotes, Praxes, Attainments
│   │   │   │   ├── MageGnosisContent.jsx    # Gnosis, Health, Willpower, Mana
│   │   │   │   ├── GeistSynergyContent.jsx  # Synergy, Health, Willpower, Plasm
│   │   │   │   ├── GeistHauntsContent.jsx   # Haunts, Keys, Mementos
│   │   │   │   ├── GeistRemembranceContent.jsx  # Geist info, Remembrances
│   │   │   │   ├── MeritsContent.jsx        # Merits & Ceremonies
│   │   │   │   ├── CombatContent.jsx        # Combat stats, Mage Armor, Inventory
│   │   │   │   ├── StatComponents.jsx       # Shared UI (dots, tracks, formatLabel)
│   │   │   │   ├── CardComponents.jsx       # Merit/Ceremony/Memento cards
│   │   │   │   └── InlineDiceRoller.jsx     # Inline dice roller
│   │   ├── data/
│   │   │   └── character-data.js       # Game rule constants
```

## What's Been Implemented
- [x] Dual character type support (Mage + Geist)
- [x] Global floating dice roller
- [x] Spellcasting Popup with Factors, Reach, Paradox, Yantras, Primary Factor
- [x] Rotes/Praxes with Cast buttons
- [x] Mage Armor with Defense/General bonuses
- [x] Mage Sight with Revelation/Scrutiny and Scrutiny success tracker
- [x] Resource quick-actions
- [x] Attainments rework (Left: Counterspell + Targeted Summoning, Right: Named attainments)
- [x] CharacterPanel.jsx refactored from 3585→1606 lines (7 extracted components)
- [x] Structured inventory (weapons, armor, equipment)
- [x] Geist Haunts, Keys, Mementos, Ceremonies
- [x] Collapsible sections, conditional Mage/Geist rendering

## Backlog
- [ ] Data export/import for characters (P2)
- [ ] Storyteller/campaign management features (P3)
- [ ] Print-friendly character sheet view (P3)
