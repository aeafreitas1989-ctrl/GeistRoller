from typing import Dict, List, Any
import re

# Geist: The Sin-Eaters System Prompt
GEIST_SYSTEM_PROMPT = """You are the Storyteller for Geist: The Sin-Eaters 2nd Edition, a tabletop RPG in the Chronicles of Darkness universe. You have complete mastery of the game rules and lore.

## Your Role
- Guide players through dark, gothic horror narratives involving death, ghosts, and the Underworld
- Play all NPCs, ghosts, and geists the player encounters
- Describe scenes with atmospheric, evocative prose befitting the game's themes
- Adjudicate rules fairly while prioritizing narrative drama
- Respond to player actions with appropriate consequences

## Core Game Knowledge

### The Bound (Sin-Eaters)
- Mortals who died, made a Bargain with a geist, and returned to life
- Bound to their geist, they can see and interact with ghosts
- Walk between the living world and the Underworld

### Key Mechanics
- **Synergy**: Measures cooperation between Sin-Eater and geist (1-10). Low synergy = internal conflict
- **Plasm**: Supernatural fuel. Regained by helping ghosts pass on, at Cenotes, or by consuming ghosts

### Haunts (Synergy + Haunt to activate)
Haunts are ghostly powers activated through the Bargain. The 1-dot ability creates a Condition. Higher dots add Enhancements.

- **The Boneyard** (Hungry Burden): Infuse areas with Plasm, create environmental effects, perfect awareness
- **The Caul** (Any): Merge with Geist, transform body, gain armor, grow wings, become swarm
- **The Curse** (Any): Inflict bad luck, technology malfunctions, cause illness, make victims forgotten
- **The Dirge** (Kindly Burden): Control emotions with haunting songs, inspire or terrify crowds
- **The Marionette** (Any): Telekinetically control objects and people like puppets
- **The Memoria** (Any): Relive traumatic memories, create visions, drag others into psychodramas
- **The Oracle** (Bereaved Burden): Divine answers by ritually dying, see the future, learn ghost secrets
- **The Rage** (Vengeful Burden): Channel violence, unarmed attacks deal lethal damage to ghosts
- **The Shroud** (Any): Become ghostly, enter Twilight, don't need to breathe/eat/sleep
- **The Tomb** (Abiding Burden): Restore destroyed objects/dead beings as replicas

### Keys (Unlock Attribute added to dice pool, grants free Plasm)
Keys represent types of death. Unlocking risks a Doom (avoid with 1 Willpower or Exceptional Success).

- **Beasts** (Wits): Primal death, animals. Doom: fail actions involving animals
- **Blood** (Presence): Passion, violence. Doom: dramatic failure avoiding violence
- **Chance** (Dexterity): Accidents, bad luck. Doom: +3 bonus becomes chance die
- **Cold Wind** (Resolve): Exposure, isolation. Doom: Extreme Cold Tilt
- **Deep Waters** (Manipulation): Drowning, loss. Doom: only regain 1 Willpower
- **Disease** (Stamina): Illness, plague. Doom: Sick Tilt
- **Grave Dirt** (Strength): Burial, being forgotten. Doom: spend Willpower for extended actions
- **Pyre Flame** (Intelligence): Fire, consumption. Doom: Extreme Heat Tilt
- **Stillness** (Composure): Suicide, being ignored. Doom: Mute Condition

### Social Structure
- **Krewes**: Groups of Sin-Eaters working together
- Each krewe has a purpose related to the dead
- **Burdens**: Hungry, Kindly, Bereaved, Vengeful, Abiding

### Chronicles of Darkness Dice System
- Roll d10 dice pools (Attribute + Skill + modifiers)
- 8, 9, 10 = successes
- 10s explode (roll again)
- 5+ successes = Exceptional Success
- Dramatic Failure on chance die rolling 1

### Death and Resurrection
When a Sin-Eater dies:
- Their geist resurrects them
- Lose 1 current Synergy
- Lose 2 maximum Synergy
- Too many deaths can make a Sin-Eater uncontrollable

## Storytelling Guidelines
- Embrace themes of death, mourning, memory, and letting go
- Create atmospheric descriptions of the Underworld's Rivers (Lethe, Styx, etc.)
- Present ghosts with anchors, fetters, and unfinished business
- Balance horror with moments of dark hope and catharsis
- Remember: Sin-Eaters celebrate death, they don't fear it
- After a roll result appears in the conversation, treat it as established outcome data and narrate the consequences accordingly.
- Distinguish clearly between Failure, Success, Exceptional Success, and Dramatic Failure, and continue the fiction from that exact result.

When the player describes their action, narrate the outcome. If dice rolls are needed, indicate what pool should be rolled.

For SOCIAL rolls, do NOT suggest a roll merely because the player states an intention such as persuading, lying, intimidating, charming, negotiating, or fast-talking.
For SOCIAL rolls, first require the player to state what they actually say or the concrete approach they use.
If the player has only stated the goal or intent, ask what they say or how they present it, and do not generate a roll token yet.
Only after the player provides the actual wording or clear conversational approach may you suggest the appropriate social roll.

## Roll Suggestions — Clickable Format
When suggesting a dice roll, ALWAYS use this exact syntax so it appears as a clickable button for the player:
{{roll|NAME|formula:ATTRIBUTE + SKILL|pool:N|specialty:BOOL|again:N|rote:BOOL}}

Parameters:
- NAME: Short fiction-facing name for the roll button, e.g., "Convincing Harrow", "Leading the Witness", "Reading the Scene"
- formula: The actual mechanical pool, e.g., "Manipulation + Subterfuge" or "Wits + Composure"
- pool: Total calculated dice pool as a number. You MUST calculate this from the character sheet data.
- specialty: true if a Specialty applies, false otherwise. You can omit if false.
- again: Exploding dice threshold. 10 = 10-again (default), 9 = 9-again, 8 = 8-again, 11 = no exploding.
- rote: true if this is a rote action, false otherwise. Default false. You can omit if false.

When calculating the pool, factor in ALL of the following:
1. **Base**: Attribute + Skill (or Attribute + Attribute for resistance rolls)
2. **Specialty**: Include the Specialty bonus separately via `specialty:true` when it applies
3. **Wound penalties**: Check the character's current Health track and apply wound penalties
4. **Active Conditions**: Check for Conditions that impose dice penalties or bonuses
5. **Merit effects**: Check the character's merits for mechanical bonuses:
   - Trained Observer (3+ dots): Perception-based rolls get 8-again
   - Asset Skills: 9-again on those skills
   - Area of Expertise: +1 die when using a specialty
   - Other merits that grant dice bonuses or quality upgrades
6. **Equipment/Situational modifiers**: Include any relevant bonuses or penalties in the total pool
7. **Use NAME for the fiction-facing button text, and formula for the actual roll construction**

Examples:
{{roll|Sneaking Past the Watch|formula:Wits + Stealth|pool:4|again:10}}
{{roll|Focused Search|formula:Wits + Investigation|pool:6|again:8}}
{{roll|Winning Them Over|formula:Presence + Persuasion|pool:8|again:10}}
{{roll|Convincing Harrow|formula:Manipulation + Subterfuge|pool:4|specialty:true|again:10}}
{{roll|Punish the Lawbreaker|formula:Strength + Brawl|pool:5|again:10|rote:true}}

IMPORTANT: Always use this {{roll|...}} format. Never write "Roll X + Y" as plain text. The player relies on these clickable roll buttons.

## Scene Summary Updates
Whenever the scene changes significantly (new location, major event, new NPCs appear, time skip), include a scene summary token at the END of your response using this EXACT format on its own line:
{{summary|LOCATION: current location | DATETIME: YYYY/MM/DD hh:mm | WEATHER: current weather conditions | SCENE: brief current scene description | NPCS: list of present NPCs | THREATS: current dangers or tensions | STORY: 2-3 sentence recap of events so far this session}}

Rules:
- Include this token whenever the scene meaningfully shifts — NOT on every single message
- Place it at the very end of your response, after your narrative text
- LOCATION must be concise (for example: Shoreditch, Arthur's office)
- DATETIME must always use this exact format: YYYY/MM/DD hh:mm
- WEATHER should be a short natural-language description suitable for header display: cloud cover, precipitation, wind
- Keep SCENE, NPCS, THREATS, and STORY concise (1-2 sentences max each)
- The chat header shows only LOCATION, DATETIME, and WEATHER, so always populate those three fields
- If the player requests "[REFRESH SUMMARY]", respond ONLY with the {{summary|...}} token reflecting the current state
- LOCATION, DATETIME, WEATHER, SCENE, NPCS, THREATS, STORY are the field labels — always use them

Example:
{{summary|LOCATION: Shoreditch | DATETIME: 2025/10/21 11:42 | WEATHER: Overcast, raining and slightly windy | SCENE: Arthur is in his office reviewing the cemetery notes while Grim Shadow watches from the window. | NPCS: Grim Shadow. | THREATS: No immediate threat; pressure is building around the case timeline. | STORY: Arthur returned from the cemetery with new details about the witness account. He is organizing leads before contacting Harrow.}}

## End-of-Chapter Beat Awards
When the player ends a chapter/session, you will receive a special "[END CHAPTER]" prompt. Respond with:
1. A brief narrative summary of the chapter's events (2-3 paragraphs)
2. A beat award using this EXACT syntax on its own line:
{{beats|chapter:1|aspirations:N|dramatic:N|other:N|notes:Brief explanation of each extra beat}}

Rules:
- chapter: Always 1 (automatic end-of-chapter beat)
- aspirations: Number of Aspirations resolved or significantly advanced during the session (0 if none)
- dramatic: Number of major dramatic events worthy of a Beat (0 if none — note: dramatic failures from dice are already tracked separately)
- other: Any additional Beats for extraordinary play (usually 0)
- notes: Brief explanation of WHY each non-chapter beat was awarded
- Be fair but generous. If in doubt, award the beat.

Stay in character as the Storyteller. Be evocative, mysterious, and dramatic."""


SESSION_TRUTH_SYSTEM_PROMPT = """You maintain a hidden continuity record for a Geist: The Sin-Eaters session.

Your job is to keep a concise, accurate, internal record of the session's current truths.

Rules:
- Keep only facts that should remain consistent during the session.
- Prefer established facts over guesses.
- Do not add speculation.
- Update the record when new facts become clear.
- Remove or revise facts only if the story explicitly changes them.
- Be concise and factual.
- Do not write narration.
- Do not write in-character prose.

Return plain text only using exactly these sections:

CURRENT SCENE:
- ...

ESTABLISHED FACTS:
- ...

ACTIVE NPCS:
- ...

OPEN TENSIONS:
- ...

PLAYER KNOWN TRUTHS:
- ...

UNRESOLVED QUESTIONS:
- ...

Only return the updated record."""


CASE_TRUTH_SECTION_ORDER = [
    "CASE TITLE",
    "VICTIM",
    "CULPRIT",
    "WHAT HAPPENED",
    "WHERE IT HAPPENED",
    "WHEN IT HAPPENED",
    "HOW IT HAPPENED",
    "WHY IT HAPPENED",
    "CAUSE OF DEATH",
    "TRUE EVIDENCE",
    "FALSE LEADS",
    "POLICE THEORY",
    "SUPERNATURAL TRUTH",
    "SOLUTION SUMMARY",
]

CASE_TRUTH_HEADER_REGEX = re.compile(r"^[A-Z][A-Z ]+:$")

DEFAULT_CASE_TRUTH_TEMPLATE = "\n".join(f"{h}:\n-\n" for h in CASE_TRUTH_SECTION_ORDER)

CASE_TRUTH_INSTRUCTIONS = """## Canonical Case Truth
The following case record is the canonical truth of the investigation.

Rules:
- Treat every item in this record as fixed fact.
- Do not contradict it.
- Do not replace the culprit, victim, timeline, method, location, motive, or true evidence.
- You may reveal information gradually through play.
- You may let NPCs be wrong, incomplete, dishonest, or misled.
- You may let the police theory be incorrect.
- Only the player's explicit manual edits can change this case record.
"""

CASE_TRUTH_GENERATION_PROMPT = """You are creating the canonical truth record for a crime investigation scenario in Geist: The Sin-Eaters.

Create a fixed case file that will remain true throughout play.

Requirements:
- Be internally consistent.
- Define one victim and one real culprit.
- Clearly state what happened, where, when, how, and why.
- Include both true evidence and false leads.
- The police theory may be partially wrong.
- Include a supernatural truth only if it fits the premise.
- Return plain text only using the exact template structure provided.
- Read the full session transcript before filling anything.
- Treat any already-filled case file sections as immutable facts.
- Only fill sections that are still blank or only contain "-".
- Do not rewrite, replace, or reinterpret sections that already contain text.
"""


# --- Case truth parsing utilities ---

def parse_case_truth_sections(case_truth: str) -> Dict[str, str]:
    text = (case_truth or DEFAULT_CASE_TRUTH_TEMPLATE).strip()
    sections: Dict[str, str] = {}
    current_header = None
    current_lines: List[str] = []

    for line in text.splitlines():
        stripped = line.strip()
        if CASE_TRUTH_HEADER_REGEX.match(stripped):
            if current_header is not None:
                sections[current_header] = "\n".join(current_lines).strip()
            current_header = stripped[:-1]
            current_lines = []
        else:
            if current_header is not None:
                current_lines.append(line)

    if current_header is not None:
        sections[current_header] = "\n".join(current_lines).strip()

    for header in CASE_TRUTH_SECTION_ORDER:
        sections.setdefault(header, "-")

    return sections


def is_empty_case_truth_section(content: str) -> bool:
    return (content or "").strip() in {"", "-"}


def render_case_truth_sections(sections: Dict[str, str]) -> str:
    lines: List[str] = []
    for header in CASE_TRUTH_SECTION_ORDER:
        value = (sections.get(header) or "").strip()
        if not value:
            value = "-"
        lines.append(f"{header}:")
        lines.append(value)
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def merge_case_truth_empty_slots(existing_case_truth: str, generated_case_truth: str) -> str:
    existing_sections = parse_case_truth_sections(existing_case_truth)
    generated_sections = parse_case_truth_sections(generated_case_truth)

    merged_sections: Dict[str, str] = {}
    for header in CASE_TRUTH_SECTION_ORDER:
        existing_value = existing_sections.get(header, "-")
        generated_value = generated_sections.get(header, "-")

        if is_empty_case_truth_section(existing_value):
            merged_sections[header] = generated_value
        else:
            merged_sections[header] = existing_value

    return render_case_truth_sections(merged_sections)


# --- Context prompt builders ---

def build_character_context_prompt(context: Dict[str, Any]) -> str:
    """Build a context prompt from character data for the AI to reference."""
    if not context:
        return ""

    lines = ["## PLAYER CHARACTER REFERENCE"]

    if context.get("name"):
        lines.append(f"**Name:** {context['name']}")
    if context.get("concept"):
        lines.append(f"**Concept:** {context['concept']}")
    if context.get("burden"):
        lines.append(f"**Burden:** {context['burden']}")
    if context.get("krewe"):
        lines.append(f"**Krewe:** {context['krewe']}")
    if context.get("archetype"):
        lines.append(f"**Archetype:** {context['archetype']}")
    if context.get("virtue") or context.get("vice"):
        lines.append(f"**Virtue/Vice:** {context.get('virtue', '-')} / {context.get('vice', '-')}")

    if context.get("geist_name"):
        lines.append(f"**Geist:** {context['geist_name']} (Rank {context.get('geist_rank', 1)})")
        if context.get("geist_description"):
            lines.append(f"  - {context['geist_description']}")

    if context.get("root") or context.get("bloom"):
        lines.append(f"**Remembrance:** Root: {context.get('root', '-')} / Bloom: {context.get('bloom', '-')}")
    if context.get("remembrance_trait"):
        lines.append(f"**Remembrance Trait:** {context.get('remembrance_trait')} ({context.get('remembrance_trait_type', 'Skill')})")

    attributes = context.get("attributes", {})
    if attributes:
        mental = f"Int {attributes.get('intelligence', 1)}, Wits {attributes.get('wits', 1)}, Res {attributes.get('resolve', 1)}"
        physical = f"Str {attributes.get('strength', 1)}, Dex {attributes.get('dexterity', 1)}, Sta {attributes.get('stamina', 1)}"
        social = f"Pre {attributes.get('presence', 1)}, Man {attributes.get('manipulation', 1)}, Com {attributes.get('composure', 1)}"
        lines.append(f"**Attributes:** {mental} | {physical} | {social}")

    skills = context.get("skills", {})
    if skills:
        skill_strs = [f"{k.replace('_', ' ').title()} {v}" for k, v in skills.items()]
        lines.append(f"**Skills:** {', '.join(skill_strs)}")

    specialties = context.get("specialties", [])
    if specialties:
        lines.append(f"**Specialties:** {', '.join(specialties)}")

    synergy = context.get("synergy")
    synergy_max = context.get("synergy_max")
    plasm = context.get("plasm")
    if synergy is not None:
        lines.append(f"**Synergy:** {synergy}/{synergy_max or 10}")
    if plasm is not None:
        lines.append(f"**Plasm:** {plasm}")

    health = context.get("health")
    willpower = context.get("willpower")
    health_boxes = context.get("health_boxes", [])
    if health is not None:
        try:
            health_int = int(health)
            damage_count = len([h for h in health_boxes if h != "empty"])
            lines.append(f"**Health:** {health_int - damage_count}/{health_int} (Damage: {damage_count})")
        except (ValueError, TypeError):
            pass
    if willpower is not None:
        lines.append(f"**Willpower:** {willpower}")

    touchstones = context.get("touchstones", [])
    if touchstones:
        lines.append(f"**Touchstones:** {', '.join(touchstones)}")

    all_keys = []
    if context.get("innate_key"):
        all_keys.append(f"{context['innate_key']} (Character Innate)")
    if context.get("geist_innate_key"):
        all_keys.append(f"{context['geist_innate_key']} (Geist Innate)")
    for key in context.get("unlocked_keys", []):
        if key not in [context.get("innate_key"), context.get("geist_innate_key")]:
            all_keys.append(key)
    if all_keys:
        lines.append(f"**Keys:** {', '.join(all_keys)}")

    haunts = context.get("haunts", {})
    active_haunts = []
    for name, rating in haunts.items():
        try:
            rating_int = int(rating)
            if rating_int > 0:
                active_haunts.append((name, rating_int))
        except (ValueError, TypeError):
            pass
    if active_haunts:
        haunt_strs = [f"{name} ({'.' * rating})" for name, rating in active_haunts]
        lines.append(f"**Haunts:** {', '.join(haunt_strs)}")

    merits = context.get("merits", [])
    if merits:
        merit_strs = []
        for m in merits:
            try:
                dots = int(m.get('dots', 0))
                if dots > 0:
                    merit_strs.append(f"{m['name']} ({'.' * dots})")
            except (ValueError, TypeError):
                pass
        if merit_strs:
            lines.append(f"**Merits:** {', '.join(merit_strs)}")

    conditions = context.get("conditions", [])
    if conditions:
        lines.append("**Active Conditions:**")
        for cond in conditions:
            origin = f" (from {cond.get('origin', 'unknown')})" if cond.get('origin') else ""
            lines.append(f"  - **{cond.get('name', 'Unknown')}**{origin}: {cond.get('description', '')}")

    people_places = context.get("people_and_places", [])
    if people_places:
        people = [pp for pp in people_places if pp.get("type") == "person"]
        places = [pp for pp in people_places if pp.get("type") == "place"]

        if people:
            lines.append("**Known People:**")
            for person in people:
                person_type = person.get("person_type", "")
                subtype = person.get("person_subtype", "")
                type_info = f" [{person_type}" + (f" - {subtype}" if subtype else "") + "]" if person_type else ""
                status = f" (Status: {person.get('status')})" if person.get("status") else ""
                desc = f" - {person.get('description')}" if person.get("description") else ""
                lines.append(f"  - **{person.get('name', 'Unknown')}**{type_info}{status}{desc}")

        if places:
            lines.append("**Known Places:**")
            for place in places:
                status = f" (Status: {place.get('status')})" if place.get("status") else ""
                desc = f" - {place.get('description')}" if place.get("description") else ""
                lines.append(f"  - **{place.get('name', 'Unknown')}**{status}{desc}")

    mementos = context.get("mementos", [])
    if mementos:
        lines.append("**Mementos:**")
        for memento in mementos:
            key_info = f" (Key: {memento.get('key')})" if memento.get("key") else ""
            desc = f" - {memento.get('description')}" if memento.get("description") else ""
            lines.append(f"  - **{memento.get('name', 'Unknown')}** ({memento.get('type', 'unknown')}){key_info}{desc}")

    lines.append("")
    lines.append("Use this character information to inform your responses. Reference their stats, abilities, and known NPCs/places when relevant.")
    lines.append("---\n")

    return "\n".join(lines)


async def build_campaign_context_prompt(db, campaign_id: str) -> str:
    """Build a context prompt from campaign data for the AI to reference."""
    if not campaign_id:
        return ""

    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        return ""

    lines = ["## CAMPAIGN CHRONICLE CONTEXT"]
    lines.append(f"**Chronicle:** {campaign.get('name', 'Unknown')}")

    if campaign.get('description'):
        lines.append(f"**Description:** {campaign['description']}")

    # World State - persistent facts only (no investigation details)
    world_state = campaign.get('world_state', [])
    if world_state:
        lines.append("")
        lines.append("### Established World Facts")
        lines.append("These are persistent world-building truths in this chronicle. Reference and build upon them. Do NOT contradict them unless the story explicitly changes them:")
        for ws in world_state:
            category = ws.get('category', 'general')
            lines.append(f"- [{category.upper()}] {ws.get('fact', '')}")

    factions = campaign.get('factions', [])
    if factions:
        lines.append("")
        lines.append("### Factions")
        for f in factions:
            rel = f.get('relationship', 'neutral')
            territory = f" (Territory: {f.get('territory')})" if f.get('territory') else ""
            lines.append(f"- **{f.get('name', 'Unknown')}** [{rel}]{territory}: {f.get('description', '')}")

    npcs = campaign.get('recurring_npcs', [])
    if npcs:
        lines.append("")
        lines.append("### Recurring NPCs")
        lines.append("These characters have appeared before. Maintain consistency with their established portrayal:")
        for npc in npcs:
            status = f" [{npc.get('status', 'active')}]" if npc.get('status') != 'active' else ""
            npc_type = f" ({npc.get('type')})" if npc.get('type') else ""
            lines.append(f"- **{npc.get('name', 'Unknown')}**{npc_type}{status}: {npc.get('description', '')}")

    threads = campaign.get('plot_threads', [])
    active_threads = [t for t in threads if t.get('status') == 'active']
    if active_threads:
        lines.append("")
        lines.append("### Active Plot Threads")
        lines.append("These mysteries and storylines are ongoing. Weave them into your narrative when appropriate:")
        for t in active_threads:
            lines.append(f"- **{t.get('title', 'Unknown')}**: {t.get('description', '')}")

    journal = campaign.get('journal', {})
    entries = journal.get('entries', [])
    if entries:
        recent = entries[-3:]
        lines.append("")
        lines.append("### Recent Session Summaries")
        for entry in recent:
            lines.append(f"- **{entry.get('session_title', 'Session')}**: {entry.get('summary', '')[:200]}...")

    lines.append("")
    lines.append("Maintain continuity with this established chronicle. Reference past events, NPCs, and world facts naturally.")
    lines.append("---\n")

    return "\n".join(lines)


def build_settings_prompt(settings: Dict[str, Any]) -> str:
    """Build AI directives from storyteller settings."""
    lines = []
    lines.append("## Storyteller Settings (Player's Preferences -- Follow These)")
    lines.append("")

    level = settings.get("scene_summary_level", "standard")
    if level == "off":
        lines.append("- **Scene Summaries**: Do not provide scene summaries.")
    elif level == "brief":
        lines.append("- **Scene Summaries**: Keep scene summaries to 1-2 sentences.")
    elif level == "detailed":
        lines.append("- **Scene Summaries**: Provide rich, detailed scene summaries with sensory descriptions.")
    else:
        lines.append("- **Scene Summaries**: Provide standard scene summaries.")

    if settings.get("suggest_rolls", True):
        if settings.get("include_modifiers", True):
            lines.append("- **Roll Suggestions**: When a roll is needed, suggest the dice pool AND list specific modifiers.")
        else:
            lines.append("- **Roll Suggestions**: When a roll is needed, suggest the dice pool but do not itemize modifiers.")
    else:
        lines.append("- **Roll Suggestions**: Do NOT suggest dice rolls. The player will decide when to roll.")

    sp = settings.get("supernatural_presence", "average")
    sp_map = {
        "low": "Extremely rare (1 in 100,000). Encounters should feel momentous and terrifying.",
        "average": "Average (1 in 10,000). Supernatural beings exist but stay hidden.",
        "high": "Relatively common (1 in 1,000). Multiple factions vie for territory.",
    }
    lines.append(f"- **Supernatural Presence**: {sp_map.get(sp, sp_map['average'])}")

    esc = settings.get("escalation_speed", "gradual")
    esc_map = {
        "slow_burn": "Escalation is glacial -- build tension through atmosphere, mystery, and slow reveals.",
        "gradual": "Let situations develop naturally with steady rising tension.",
        "sharp": "Scenes escalate quickly once conflict begins. Quiet moments are brief.",
        "aggressive": "Things go wrong fast. No slow introductions -- hit hard, hit often.",
    }
    lines.append(f"- **Escalation Speed**: {esc_map.get(esc, esc_map['gradual'])}")

    opp = settings.get("opposition_competence", "competent")
    opp_map = {
        "flawed": "Enemies make mistakes, miss obvious clues, and act predictably.",
        "competent": "Enemies are skilled and prepared. They have contingency plans but can be outsmarted.",
        "elite": "Enemies are highly intelligent, well-resourced, and ruthless.",
    }
    lines.append(f"- **Opposition Competence**: {opp_map.get(opp, opp_map['competent'])}")

    leth = settings.get("lethality_bias", "neutral")
    leth_map = {
        "protective": "Err on the side of survival. Give players outs, warnings, and second chances.",
        "neutral": "Let the dice and narrative decide. Neither seek nor avoid character death.",
        "dangerous": "The world is lethal. Mistakes cost dearly. Death is always on the table.",
    }
    lines.append(f"- **Lethality**: {leth_map.get(leth, leth_map['neutral'])}")

    raw = settings.get("raw_strictness", "raw_with_interpretation")
    raw_map = {
        "strict_raw": "Follow the Rules As Written exactly. No homebrew or fudging.",
        "raw_with_interpretation": "Follow RAW as the baseline but interpret ambiguous rules in favour of drama and fun.",
        "narrative_priority": "Rules serve the story, not the other way around. Bend or ignore rules when they get in the way.",
    }
    lines.append(f"- **Rules Approach**: {raw_map.get(raw, raw_map['raw_with_interpretation'])}")

    free_fields = [
        ("storyteller_doctrine", "Storyteller Doctrine"),
        ("tone_description", "Tone"),
        ("chronicle_scope", "Chronicle Scope"),
        ("setting_constraints", "Setting Constraints"),
        ("npc_behavioral_rules", "NPC Behavioral Rules"),
        ("writing_style", "Writing Style"),
        ("additional_info", "Additional Instructions"),
    ]
    has_custom = False
    for key, label in free_fields:
        val = (settings.get(key) or "").strip()
        if val:
            if not has_custom:
                lines.append("")
                lines.append("### Custom Directives")
                has_custom = True
            lines.append(f"- **{label}**: {val}")

    lines.append("")
    lines.append("---\n")
    return "\n".join(lines)
