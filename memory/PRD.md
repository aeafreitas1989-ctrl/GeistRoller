# TTRPG Character Sheet App — PRD

## Original Problem Statement
A glorified Mage: The Awakening / Geist: The Sin-Eaters character sheet with a dice roller. Manage complex Mage spellcasting rules (Factors, Reach, Paradox, Mana mitigation, Yantras, Rotes, Praxes, Mage Armor) and resource tracking.

## Core Requirements
- Dual character type support: Geist: The Sin-Eaters & Mage: The Awakening
- Global floating dice roller with WoD mechanics (10/9/8-again, rote, chance die)
- Spellcasting Popup with Factors, Reach, Paradox, Mana mitigation, Yantras
- Rotes/Praxes with inline Cast buttons
- Mage Armor, Pattern Restoration, Scour Pattern, Hallow harvesting
- Mage Sight with Revelation/Scrutiny, Opacity tracking, layered Scrutiny tracker
- Scene tracker with time/date advancement (Sleep, Hallow)
- Structured inventory, Geist Haunts/Keys/Mementos/Ceremonies
- JSON/PDF character export, JSON import

## Architecture
```
/app/
├── backend/
│   ├── server.py           # FastAPI endpoints
│   ├── models.py           # Pydantic models (added scrutiny_state field)
├── frontend/src/
│   ├── components/
│   │   ├── CharacterPanel.jsx          # Orchestrator (~1606 lines)
│   │   ├── SpellcastingPopup.jsx       # Mage Spellcasting UI (~2.1k lines)
│   │   ├── GameCardsPanel.jsx          # Cards tab (~1400 lines)
│   │   ├── DiceRoller.jsx              # Global floating dice roller
│   │   ├── spellcasting/
│   │   │   └── YantrasGrid.jsx         # Yantras 2-col grid (NEW)
│   │   ├── cards/
│   │   │   ├── MageSightCard.jsx       # Mage Sight + Scrutiny (NEW - extracted)
│   │   │   └── CardComponents.jsx      # Merit/Ceremony/Memento/Active Spell cards
│   │   ├── character/                  # 7 extracted subcomponents
│   ├── data/character-data.js          # Game rule constants
│   ├── utils/timeUtils.js              # Scene time/date helpers
```

## What's Been Implemented
- [x] Dual character type support (Mage + Geist)
- [x] Global floating dice roller
- [x] Spellcasting Popup with Factors, Reach, Paradox, Yantras, PFO (with explicit factor selector)
- [x] Yantras 2-column checkbox grid (Sympathy/Sacrament rating pickers; Runes added; Location→Environment)
- [x] Spell name + Reach category breakdown on Recent Rolls paste
- [x] Lasting Duration mode
- [x] Advanced (Instant) Casting Time math: "Instant (X turn(s))", first yantra free, HS always +1 turn, Runes +ritual interval
- [x] Rotes/Praxes with Cast buttons
- [x] Mage Armor, Pattern Restoration, Scour Pattern (with red-bolt attribute indicators)
- [x] Hallow popup (Gnosis + Composure roll, success grants rating Mana; advances +1 hour)
- [x] Mage Sight with Revelation/layered Scrutiny tracker
- [x] **Scrutiny session persistence** (active flag + layers + opacity + target + obsession on character)
- [x] Sleep button advances scene time to 07:00 next day
- [x] JSON + PDF character export, JSON import
- [x] Collapsible sections, conditional Mage/Geist rendering
- [x] Geist Haunts, Keys, Mementos, Ceremonies
- [x] Structured inventory

## Refactors
- CharacterPanel.jsx: 3585 → 1606 lines (7 character/* extractions)
- GameCardsPanel.jsx: 1931 → 1400 lines (MageSightCard extracted)
- SpellcastingPopup.jsx: 2278 → 2123 lines (YantrasGrid extracted)

## Backlog
- [ ] Further break down SpellcastingPopup.jsx (PFO section, Paradox section, Spell Factors row)
- [ ] Further break down GameCardsPanel.jsx (Scene tracker, Conditions, Active Spells)
- [ ] Print-friendly character sheet view (P3)
