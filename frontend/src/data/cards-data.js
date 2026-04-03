// Geist: The Sin-Eaters - Cards Panel Data Constants

export const CONDITION_DEFINITIONS = {
    // Tilts (Combat)
    "Arm Wrack": { type: "tilt", description: "Your arm is damaged. -2 to actions using that arm.", resolution: "Healed or combat ends." },
    "Beaten Down": { type: "tilt", description: "You've taken enough damage to lose the will to fight.", resolution: "Combat ends or you're given a chance to surrender." },
    "Blinded": { type: "tilt", description: "You cannot see. -3 to vision-based actions, Defense halved.", resolution: "Effect ends or you adapt." },
    "Deafened": { type: "tilt", description: "You cannot hear. Automatically fail hearing-based rolls.", resolution: "Effect ends." },
    "Immobilized": { type: "tilt", description: "You cannot move from your current position.", resolution: "Break free or effect ends." },
    "Knocked Down": { type: "tilt", description: "You're on the ground. Standing is an action.", resolution: "Stand up." },
    "Leg Wrack": { type: "tilt", description: "Your leg is damaged. Speed halved, -2 to movement actions.", resolution: "Healed or combat ends." },
    "Poisoned": { type: "tilt", description: "Toxin in your system. Take damage each turn.", resolution: "Toxin runs its course or is treated." },
    "Stunned": { type: "tilt", description: "You lose your next action.", resolution: "Lose an action." },
    "Sick": { type: "tilt", description: "You are ill. -1 to all actions.", resolution: "Rest and recovery." },
    
    // Conditions (Persistent and Regular)
    "Shaken": { type: "condition", description: "-2 to Resolve or Composure rolls. Caused by fear or supernatural terror.", resolution: "Regain Willpower from Virtue/Vice, or confront the source." },
    "Spooked": { type: "condition", description: "Something supernatural has rattled you. -1 to Composure rolls.", resolution: "Succeed on a Composure roll in a safe environment." },
    "Guilty": { type: "condition", description: "Your conscience weighs on you. -2 to Subterfuge.", resolution: "Make amends or confess." },
    "Informed": { type: "condition", description: "You have useful information. +2 to one relevant roll.", resolution: "Use the bonus or the info becomes irrelevant." },
    "Inspired": { type: "condition", description: "You're driven to succeed. +2 to one roll related to your inspiration.", resolution: "Use the bonus or inspiration fades." },
    "Leveraged": { type: "condition", description: "Someone has something on you. They get +2 to Social rolls against you.", resolution: "Remove their leverage or give in." },
    "Obsession": { type: "condition", description: "You're fixated on something. -2 to unrelated Mental rolls.", resolution: "Fulfill the obsession or dramatically fail because of it." },
    "Swooned": { type: "condition", description: "You're romantically captivated. +2 to help them, -2 to act against them.", resolution: "They reject you or the feeling fades naturally." },
    "Fugue": { type: "condition", description: "You've lost time and memory. Disoriented and confused.", resolution: "Piece together what happened." },
    "Broken": { type: "condition", description: "Your will is shattered. Cannot spend Willpower.", resolution: "Achieve a meaningful victory or time passes." },
    "Deprived": { type: "condition", description: "You lack something essential. -1 to all rolls.", resolution: "Obtain what you need." },
    "Madness": { type: "condition", description: "Your grip on reality is slipping.", resolution: "Professional help or time." },
    
    // Geist-Specific Conditions
    "Doomed": { type: "geist", origin: "Key Doom", description: "A Key's Doom hangs over you. Cannot use that Key until resolved.", resolution: "Suffer the Doom's effects." },
    "Boneyard": { type: "geist", description: "Area is infused with Plasm. Perfect awareness, ghosts have Open Condition.", resolution: "Leave area, fall unconscious, or Geist's Ban/Bane." },
    "Caul": { type: "geist", description: "Merged with Geist. Spend charges for exceptional successes, ignore wounds, use Geist Attributes.", resolution: "Charges spent or Geist crisis." },
    "Curse": { type: "geist", description: "Cursed with misfortune. Charges can impose -2 penalties.", resolution: "Charges spent or countered by another Sin-Eater." },
    "Dirge": { type: "geist", description: "Compelled by haunting song. +2 acting with song's intent, costs Willpower to resist.", resolution: "Sin-Eater stops singing." },
    "Marionette": { type: "geist", description: "Actions controlled by Sin-Eater. Can contest with Strength + Stamina.", resolution: "Scene ends or line of sight broken." },
    "Memoria": { type: "geist", description: "Reliving traumatic memories. 8-again on investigation, learn leverage.", resolution: "Charges spent or Geist's Ban/Bane." },
    "Oracle": { type: "geist", description: "Consulting the Underworld. Insensate while active, can answer questions.", resolution: "Charges spent or damage taken." },
    "Rage": { type: "geist", description: "Channeling violent instincts. Unarmed attacks gain weapon damage.", resolution: "Scene ends or Geist's Ban/Bane." },
    "Shroud": { type: "geist", description: "Cloaked in Geist. No need to eat/sleep/breathe, can enter Twilight.", resolution: "Charges spent or drawing significant attention." },
    "Tomb": { type: "geist", description: "Object/person restored from the past. Precise replica.", resolution: "Duration ends or Geist's Ban." },
    "Actor": { type: "geist", description: "Bound to a role in a Memoria vision. Actions dictated by the Echo.", resolution: "Breaking point command or lethal damage." },
    "Servant": { type: "geist", description: "Obeys commands but otherwise free to act/speak.", resolution: "Scene ends." },
    
    // Liminal Aura (Ephemeral Conditions)
    "Anchor": {
        type: "condition",
        origin: "Liminal Aura",
        description: "The subject of this Condition (usually a location or object, rarely a person) falls within a ghost’s sphere of influence. Ghosts within (Rank × 3) yards of their Anchors do not suffer Essence bleed.",
        resolution: "Destroying the Anchor, resolving the ghost’s unfinished business, or the Anchor being removed."
    },
    "Controlled": {
        type: "condition",
        origin: "Liminal Aura",
        description: "The ghost has fully conditioned a target, making them ready for permanent possession. The target must already have the Open Condition tagged to the ghost attempting possession.",
        resolution: "Ending the Claimed Condition removes this Condition, reverting the subject back to Open."
    },
    "Open": {
        type: "condition",
        origin: "Liminal Aura",
        description: "A target has been conditioned to accept a ghost’s influence. The Anchor Condition must exist on the same phenomenon.",
        resolution: "If the Anchor Condition is removed, the Open Condition also ends."
    },
};

// Haunt definitions - Geist: the Sin-Eaters 2nd Edition
export const HAUNT_DEFINITIONS = {
    "The Boneyard": { 
        description: "Infuse an area with Plasm, creating phantasmagorical effects. Perfect awareness of the area, impose conditions on targets.",
        burden: "Hungry",
        activation: "Synergy + Boneyard",
        abilities: [
            "• Raise the Boneyard - Create Boneyard Environmental Tilt, impose Guilty/Shaken/Spooked",
            "•• Eyes in the Paintings - Project awareness to any point in the Boneyard",
            "••• No Escape - Targets suffer penalty to leave equal to Plasm spent",
            "•••• Earthquake Weather - Create Environmental Tilts (Blizzard, Extreme Heat, etc.)",
            "••••• The New Law - State rules for the Boneyard, violators gain Defiant Condition"
        ]
    },
    "The Caul": { 
        description: "Merge with your Geist, make flesh malleable, gain ghostly abilities. Transform your body.",
        burden: "Any",
        activation: "Synergy + Caul",
        abilities: [
            "• Extrude the Caul - Gain Caul Condition with charges for exceptional successes, ignore wounds",
            "•• Cold Flesh - Gain Armor equal to Caul rating",
            "••• Vitiate - Grow in Size, climb walls, lethal unarmed attacks, grow wings, become swarm",
            "•••• Disarticulation - Create homunculi that follow commands",
            "••••• The Hungry Dead - Consume dead beings/ghosts to mimic their form"
        ]
    },
    "The Curse": { 
        description: "Conjure powers of the Underworld to inflict bad luck on victims.",
        burden: "Any",
        activation: "Synergy + Curse vs Resolve + Synergy",
        abilities: [
            "• Lay the Curse - Touch victim to inflict Curse Condition, spend charges for -2 penalties",
            "•• Gremlin - Technology malfunctions, can't start fires",
            "••• Malady - Inflict 3 lethal damage or Tilts (Arm Wrack, Blinded, Poisoned, etc.)",
            "•••• Exhaustion - Turn Social rolls to chance dice, prevent Willpower gain",
            "••••• Forgotten - Victim must spend Willpower to be noticed, can see ghosts"
        ]
    },
    "The Dirge": { 
        description: "Control people and manipulate emotional states with eerie songs.",
        burden: "Kindly",
        activation: "Synergy + Dirge vs Composure + Synergy",
        abilities: [
            "• Sing the Dirge - Haunting song compels targets, +2 to act with song's intent",
            "•• Paean - Distribute Essence to ghosts, grant Inspired Condition",
            "••• Communion - Perfect social impression, transcends language",
            "•••• Exaltation - Remove or inflict emotional Conditions",
            "••••• Visitation - Bring forth ghosts, grant Manifestation Conditions"
        ]
    },
    "The Marionette": { 
        description: "Telekinetically manipulate objects and creatures like puppets.",
        burden: "Any",
        activation: "Synergy + Marionette",
        abilities: [
            "• String the Marionette - Control target's actions",
            "•• Swarm - Control multiple targets simultaneously",
            "••• Phantom Strength - Affect larger targets, resist control harder",
            "•••• Servant - Create semi-independent servants from corpses/objects",
            "••••• Traitor Flesh - Total control of living person, victim watches helplessly"
        ]
    },
    "The Memoria": { 
        description: "Give life and body to memories of traumatic events, allowing others to relive them.",
        burden: "Any",
        activation: "Synergy + Memoria",
        abilities: [
            "• Recall the Memoria - 8-again on investigation, learn leverage, trigger crisis points",
            "•• Dénouement - Create visible illusionary visions",
            "••• Memory in a Bottle - Store visions for later viewing",
            "•••• Mystery Play - Drag others into visions with Actor Condition",
            "••••• Break the Cycle - Actors can go off-script, resolve trauma Conditions"
        ]
    },
    "The Oracle": { 
        description: "Extract answers from the Mysteries of the Underworld by ritually dying again.",
        burden: "Bereaved",
        activation: "Synergy + Oracle",
        abilities: [
            "• Consult the Oracle - Insensate, answer questions about death and the unseen",
            "•• Wandering Shade - Project spirit to hunt for information across a region",
            "••• Spirit Reading - Learn ghost Bans, Banes, and Anchors",
            "•••• Descent - Answer questions about the Underworld",
            "••••• Nekyia - Scavenge scars of future events"
        ]
    },
    "The Rage": { 
        description: "Channel violent instincts through Geist into a physical form suited for bloodshed.",
        burden: "Vengeful",
        activation: "Synergy + Rage",
        abilities: [
            "• Vent the Rage - Unarmed attacks gain weapon damage, hurt ghosts",
            "•• Black-Iron Blade - Inflict Tilts (Arm Wrack, Blinded, Leg Wrack, etc.)",
            "••• Maelstrom - Ranged unarmed attacks out to 30 yards, auto-fire",
            "•••• Shatter - Aggravated damage, inflict Fugue Condition",
            "••••• Breaking the World - Create Environmental Tilts, immune to them"
        ]
    },
    "The Shroud": { 
        description: "Cover yourself in a mantle of your Geist, gaining aspects of a ghostly nature.",
        burden: "Any",
        activation: "Synergy + Shroud",
        abilities: [
            "• Don the Shroud - No need to eat/sleep/breathe, enter Twilight",
            "•• Vision of Mist - No temperature, avoid sensors, hover/fly",
            "••• Haunting Presence - Gain Manifestations/Numina (Possess, Hallucination, etc.)",
            "•••• Harrow - Drag others into Twilight",
            "••••• Descent - Cross into/out of the Upper Reaches of the Underworld"
        ]
    },
    "The Tomb": { 
        description: "Reclaim what was lost, bringing the Past back to the Present as precise replicas.",
        burden: "Abiding",
        activation: "Synergy + Tomb",
        abilities: [
            "• Open the Tomb - Restore destroyed objects/dead beings as replicas",
            "•• Headstone - Use representations or linked objects",
            "••• Empty Graves - Replicas follow instructions, ghosts can Possess them",
            "•••• Stygian Treasures - Items allow seeing/hearing/speaking to the dead",
            "••••• Terra Cotta Soldiers - Create equipment from symbolic representations"
        ]
    },
};

// Key definitions - Geist: the Sin-Eaters 2nd Edition (Complete)
export const KEY_DEFINITIONS = {
    "Beasts": { 
        fullName: "The Key of Beasts",
        aliases: "The Primeval Key, The Key of Tooth and Claw, The Key of Verdant Savagery",
        description: "The feeling of adrenaline, the discharge of the sympathetic nervous system at the feeling of teeth or hooves or horns entering the body. It opens when humanity is reminded they are just part of the game of life and don't always win.",
        unlockAttribute: "Wits",
        resonance: "Wild places where humanity is vulnerable (wilderness, ruins, city park after dark) or when using a Haunt on an animal target.",
        doom: "Automatically fail an action targeting an animal, or any action an animal could plausibly hinder.",
        hauntEffect: "The Predatory Haunt - The Haunt becomes feral, responsive, and tracking.",
        plasm: "Reddish-brown, semi-coagulated gel that smells faintly of musk and old copper. It twitches near threats."
    },
    "Blood": { 
        fullName: "The Key of Blood",
        aliases: "The Stigmatic Key, The Key of Veils and Shades, The Key of Crimson Agony",
        description: "The memory of passion and lives lost because of it. Premeditated deaths, crazy schemes, malicious rumors, or irritated phone calls that weren't meant to kill but did.",
        unlockAttribute: "Presence",
        resonance: "When situations spiral out of control in a violent, unintended way.",
        doom: "The next time you try to avoid a violent confrontation, suffer an automatic dramatic failure.",
        hauntEffect: "The Wounded Haunt - The Haunt feels personal, raw, and driven by will.",
        plasm: "Dark crimson fluid, thick and sticky like half-congealed blood. It pulses faintly."
    },
    "Chance": { 
        fullName: "The Key of Chance",
        aliases: "The Bastard's Key, The Key of Jinx and Hex, The Key of Black Humor",
        description: "The call and response of 'hey y'all, watch this' and the million-to-one death that follows. The Key of the absurd, unfair, and improbable.",
        unlockAttribute: "Dexterity",
        resonance: "When risking something important (treasured belonging, friend, life) on a single action. Also resonant on machines with 3+ lethal moving parts.",
        doom: "The next +3 or greater bonus roll becomes a chance die instead. If it succeeds, it counts as an exceptional success.",
        hauntEffect: "The Fractured Haunt - The Haunt is erratic, serendipitous, threadbare but sharp.",
        plasm: "Shimmering like oil on water, never holding a consistent color. Bubbles pop at random intervals, sometimes forming numbers."
    },
    "Cold Wind": { 
        fullName: "The Key of Cold Wind",
        aliases: "The Breathless Key, The Key of Gale and Garrote, The Key of Ivory Sorrow",
        description: "Deaths of exposure and execution, things lost to the formless and ephemeral, robbed of a breath of air. The cold whispers of a community turning its back.",
        unlockAttribute: "Resolve",
        resonance: "Within Environmental Tilts like Blizzard, Extreme Cold, or Heavy Winds. Also when ambient noise makes spoken conversation impossible.",
        doom: "Gain the Extreme Cold Tilt for (10 – Synergy) hours or until actively revealing a damaging personal secret.",
        hauntEffect: "The Fading Haunt - The Haunt is remote, observational, echoing.",
        plasm: "Pale blue and semi-translucent, like water thinned with frost. Leaves a rime of frost and carries a faint scent of winter air."
    },
    "Deep Waters": { 
        fullName: "The Key of Deep Waters",
        aliases: "The Tear-Stained Key, The Key of Wave and Whirlpool, The Key of Azure Futility",
        description: "The sensation of air leaving the lungs, not water entering. The experience of loss as cool, uncaring water drives the last vestiges of consciousness from the body.",
        unlockAttribute: "Manipulation",
        resonance: "In environments where breathing is impaired (carbon-dioxide-filled garage, submerged in water). Also when target is half submerged.",
        doom: "The next time you would fully replenish Willpower, gain only 1 Willpower instead.",
        hauntEffect: "The Drowned Haunt - The Haunt is invasive, flooding, pulling others inward.",
        plasm: "Deep green-blue, viscous as brine, with cloudy threads drifting within. Smells faintly of river silt and ink."
    },
    "Disease": { 
        fullName: "The Key of Disease",
        aliases: "The Wasting Key, The Key of Plague and Pestilence, The Key of Bilious Despair",
        description: "Deaths marked by burning fevers and clogged airways, archaic poisons, extinct bacterial species, or common diseases that didn't get better.",
        unlockAttribute: "Stamina",
        resonance: "Places or targets that resonate with illness or poison (hospital, malarial swamp, person with the Sick Tilt).",
        doom: "Suffer the Sick Tilt until the end of the next scene.",
        hauntEffect: "The Lingering Haunt - The Haunt is pervasive, lingering, unwholesome.",
        plasm: "Putrid yellow-green, like bruised fruit left too long. Bubbles slightly at rest, scent of sour, clinical rot."
    },
    "Grave Dirt": { 
        fullName: "The Key of Grave Dirt",
        aliases: "The Crushing Key, The Key of Stone and Barrow, The Key of Slate Bereavement",
        description: "The jealous owner of all who perish trying to leave a reminder of themselves. Those buried in kingly tombs, crushed by heavy girders, left in mine shafts.",
        unlockAttribute: "Strength",
        resonance: "Places or targets dedicated to the past (graveyard, memorial, abandoned building, antiquated business). Also anytime below ground.",
        doom: "For the rest of the story, any time you wish to roll for an extended action, spend 1 Willpower.",
        hauntEffect: "The Interred Haunt - The Haunt becomes anchored, resolute, inescapable.",
        plasm: "Thick, earthen brown with flecks of bone-white grit suspended in it. Smells of damp clay and rotting wood."
    },
    "Pyre Flame": { 
        fullName: "The Key of Pyre Flame",
        aliases: "The Burning Key, The Key of Ash and Brand, The Lover's Key, The Key of Golden Annihilation",
        description: "Understanding being consumed, feeling skin peel and lungs fill with hot particulates. The flame is apathetic, only knowing how to consume and spread.",
        unlockAttribute: "Intelligence",
        resonance: "Areas or targets that are on fire or subject to the Extreme Heat Tilt.",
        doom: "Gain the Extreme Heat Tilt for (10 – Synergy) hours or until deliberately destroying a valued personal possession.",
        hauntEffect: "The Burning Haunt - The Haunt is intense, searing, illuminating.",
        plasm: "Amber-orange, glowing faintly from within, as if holding embers. Radiates heat and the scent of burnt offerings or old candles."
    },
    "Stillness": { 
        fullName: "The Key of Stillness",
        aliases: "The Silent Key, The Key of Shroud and Shadow, The Key of Jet Uncertainty",
        description: "Deaths punctuated with 'I didn't know' or 'It's such a shame.' Deaths of ignorance, powerlessness, and apathy of individuals treated like ghosts before they died.",
        unlockAttribute: "Composure",
        resonance: "When the target is unaware of your presence, helpless, or if there is no one present except you and the target.",
        doom: "The next time you speak a word, resolve this Doom and the Condition from the Haunt. Without a Haunt, gain the Mute Condition until end of chapter.",
        hauntEffect: "The Silent Haunt - The Haunt becomes solemn, unblinking, ritually precise.",
        plasm: "Milky pearl-gray, still as ink that has never been stirred. Smells faintly of parchment, dust, and closed books."
    },
};

export const KEY_NAMES = Object.keys(KEY_DEFINITIONS);

// Geist-specific Merit definitions
export const MERIT_DEFINITIONS = {
    // Geist Merits
    "Architect": { category: "Geist", maxDots: 5, description: "When taking an extended action to create something significant, gain additional dice equal to Merit dots. Any roll benefiting from these dice gains 8-again." },
    "Cenote": { category: "Geist", maxDots: 5, description: "Generates Plasm equal to its dot rating every chapter. Each instance must be tied to a Safe Place Merit of at least one dot." },
    "Dread Geist": { category: "Geist", maxDots: 3, description: "Your Geist is Rank 4." },
    "Grave Goods": { category: "Geist", maxDots: 5, description: "Produce equipment whose total Availability is equal to or less than your dots. This equipment is ephemeral. Ghosts and Sin-Eaters can consume it for Essence or Plasm." },
    "Manic States": { category: "Geist", maxDots: 5, description: "Once per session, spend Willpower to bring about a manic state for the scene. Ignore negative effects of the Persistent Condition and gain a pool of dice equal to Merit dots." },
    "Memento": { category: "Geist", maxDots: 3, description: "Your character has a Memento. Each instance reflects a different Memento." },
    "Reconciler": { category: "Geist", maxDots: 3, description: "When undertaking a Social Maneuver to right a wrong or broker peace, remove a number of Doors equal to Merit dots." },
    "Retribution": { category: "Geist", maxDots: 5, description: "When pursuing retribution for harm to someone you care about, gain bonuses: +2 to tracking, +1 damage on all-out attacks, Armor 2/0, apply target's Condition/Tilt to them." },
    "Supernatural Membership": { category: "Geist", maxDots: 5, description: "Your krewe has living members with exceptional abilities. Create characters with Supernatural Merit dots equal to twice the krewe's rating." },
    
    // Mage Merits
    "Adamant Hand": { category: "Mage", maxDots: 2, description: "Use a chosen combat Skill with 3+ dots as a reflexive Order tool Yantra for instant spells. May be purchased multiple times for different styles." },
    "Advanced Library": { category: "Mage", maxDots: 5, description: "Gain the Informed Condition about a highly secretive supernatural topic. Each Dot represents a distinct topic, and each topic can only be used once per story." },
    "Artifact": { category: "Mage", maxDots: 10, description: "A Supernal item with its own Mana, effective Gnosis, Arcana, and magical effects. Not limited to 5 dots." },
    "Astral Adept": { category: "Mage", maxDots: 3, description: "Enter the Astral Realms without a place of power by performing a personal ceremony and spending Willpower." },
    "Between the Ticks": { category: "Mage", maxDots: 2, description: "Once per scene, trade 1 Initiative for 1 die on an action, or 1 die on an action for 1 Initiative." },
    "Cabal Theme": { category: "Mage", maxDots: 1, description: "All cabal members with this Merit count as having +1 Shadow Name for persona Yantras." },
    "Consilium/Order Status": { category: "Mage", maxDots: 5, description: "Status in a Consilium or Order Caucus, granting influence, protections, and access to magical requisitions." },
    "Destiny": { category: "Mage", maxDots: 5, description: "Gain a pool of Destiny each chapter to grant rote quality or rerolls, balanced by an inescapable Doom." },
    "Dream": { category: "Mage", maxDots: 5, description: "Once per chapter, ask prophetic yes-or-no questions through dreams after extended sleep or meditation." },
    "Egregore": { category: "Mage", maxDots: 5, description: "Mysterium initiation into deeper communal magical practice and Order secrets." },
    "Enhanced Item": { category: "Mage", maxDots: 10, description: "An item permanently enhanced by indefinite spells, with extra dots above 5 counting as half-dots for spell storage." },
    "Familiar": { category: "Mage", maxDots: 4, description: "A bonded Rank 1 or Rank 2 ephemeral Familiar such as a ghost, spirit, or Goetia." },
    "Fast Spells": { category: "Mage", maxDots: 2, description: "Targets cannot apply Defense against your Aimed Spells unless a power specifically allows it." },
    "Grimoire": { category: "Mage", maxDots: 5, description: "A book of rotes; each dot contains two rotes and can grant rote quality when casting from it." },
    "Hallow": { category: "Mage", maxDots: 5, description: "A magical site that produces Mana daily and stores it as tass if unharvested." },
    "High Speech": { category: "Mage", maxDots: 1, description: "Allows the character to use High Speech as a Yantra." },
    "Imbued Item": { category: "Mage", maxDots: 10, description: "An item that stores a triggered spell and Mana to cast it. Extra dots can add battery capacity." },
    "Infamous Mentor": { category: "Mage", maxDots: 5, description: "A Mentor with major reputation whose standing can be leveraged for social influence and access." },
    "Lex Magica": { category: "Mage", maxDots: 2, description: "Official Silver Ladder authority grants social protection and a Status-based Yantra for enforcing magical law." },
    "Mana Sensitivity": { category: "Mage", maxDots: 1, description: "Hallows and stored Mana trigger Peripheral Mage Sight even without active spells." },
    "Masque": { category: "Mage", maxDots: 5, description: "A Guardian persona with alternate traits, symbolism, ethics, and capabilities that improve by dot rating." },
    "Mystery Cult Influence": { category: "Mage", maxDots: 5, description: "Influence over a Mystery Cult without being one of its subordinate members." },
    "Occultation": { category: "Mage", maxDots: 3, description: "Mystically hides aura, Nimbus, and sympathetic traces, making the character harder to discern or target." },
    "Potent Nimbus": { category: "Mage", maxDots: 2, description: "Your Nimbus has stronger effects and is easier to flare effectively." },
    "Potent Resonance": { category: "Mage", maxDots: 2, description: "Those scrutinizing your Signature Nimbus are also affected by your Immediate Nimbus." },
    "Prelacy": { category: "Mage", maxDots: 4, description: "A Seer's bond to an Exarch grants symbolic authority, magical benefits, and an expanding supernatural mandate." },
    "Sanctum": { category: "Mage", maxDots: 5, description: "A secure magical refuge that improves spell control within its boundaries." },
    "Shadow Name": { category: "Mage", maxDots: 3, description: "A powerful magical identity that serves as a persona Yantra and protects the mage's mundane identity." },
    "Techné": { category: "Mage", maxDots: 2, description: "A chosen Free Council cultural or scientific focus counts as an Order tool and can enhance teamwork spellcasting." },

    // Social Merits
    "Allies": { category: "Social", maxDots: 5, description: "Allies help your character. Each instance represents one type of ally. Favors up to the Allies rating can be requested without penalty." },
    "Alternate Identity": { category: "Social", maxDots: 3, description: "Your character has established an alternate identity. The dot rating determines its robustness against scrutiny." },
    "Contacts": { category: "Social", maxDots: 5, description: "Contacts provide information. Each dot represents a sphere or organization for information gathering." },
    "Fame": { category: "Social", maxDots: 3, description: "Your character is recognized within a certain sphere. Each dot adds a die to Social rolls among those impressed." },
    "Mentor": { category: "Social", maxDots: 5, description: "Your character has a teacher who provides advice and guidance. Once per session, ask for a favor involving one of their Skills." },
    "Resources": { category: "Social", maxDots: 5, description: "Reflects disposable income. Once per chapter, procure an item at Resources level or lower without issue." },
    "Retainer": { category: "Social", maxDots: 5, description: "Your character has an assistant, servant, or follower. Dot rating determines relative competency." },
    "Safe Place": { category: "Social", maxDots: 5, description: "Your character has a secure location. Dot rating reflects security. Gives an Initiative bonus equal to Merit dots." },
    "Status": { category: "Social", maxDots: 5, description: "Your character has standing within a group or organization. Can apply Status to Social rolls with those over whom she has authority." },
    
    // Mental Merits
    "Common Sense": { category: "Mental", maxDots: 3, description: "Once per chapter, ask the Storyteller one question about a task or course of action by rolling Wits + Composure." },
    "Danger Sense": { category: "Mental", maxDots: 2, description: "Gain a +2 modifier on reflexive Wits + Composure rolls to detect an impending ambush." },
    "Eidetic Memory": { category: "Mental", maxDots: 2, description: "You do not have to make rolls to remember past experiences. Gain a +2 bonus to recall minute facts." },
    "Encyclopaedic Knowledge": { category: "Mental", maxDots: 2, description: "Make an Intelligence + Wits roll to gain a relevant fact or detail about a topic, even without dots in the Skill." },
    "Eye for the Strange": { category: "Mental", maxDots: 2, description: "Roll Intelligence + Composure to determine if a scene has a supernatural cause and gain one piece of confirming information." },
    "Good Time Management": { category: "Mental", maxDots: 1, description: "When taking an extended action, halve the time required between rolls." },
    "Holistic Awareness": { category: "Mental", maxDots: 1, description: "You do not need traditional medical equipment to stabilize and treat injuries (unless lethal/aggravated wounds)." },
    "Indomitable": { category: "Mental", maxDots: 2, description: "Add two dice to any dice pool to contest supernatural influence on your character's thoughts or emotions." },
    "Language": { category: "Mental", maxDots: 1, description: "Skilled with an additional language (speak, read, and write). Choose a language each time." },
    "Library": { category: "Mental", maxDots: 3, description: "Add Merit dots to any extended roll involving the chosen Mental Skill." },
    "Meditative Mind": { category: "Mental", maxDots: 4, description: "Do not suffer environmental penalties to meditation. Higher dots grant additional bonuses after successful meditation." },
    "Professional Training": { category: "Mental", maxDots: 5, description: "Your character has extensive training in a particular profession, which offers distinct advantages in a handful of fields." },
    "Trained Observer": { category: "Mental", maxDots: 3, description: "Benefit from 9-again (or 8-again at •••) quality on Perception rolls." },
    
    // Physical Merits
    "Ambidextrous": { category: "Physical", maxDots: 3, description: "Your character does not suffer the -2 penalty for using his off hand in combat or other actions." },
    "Double Jointed": { category: "Physical", maxDots: 2, description: "Automatically escapes from any mundane bonds without a roll. When grappled, subtract Dexterity from rolls to overpower." },
    "Fast Reflexes": { category: "Physical", maxDots: 3, description: "+1 Initiative per dot." },
    "Fleet of Foot": { category: "Physical", maxDots: 3, description: "Gain +1 Speed per dot. Pursuers suffer a -1 per dot to any foot chase rolls." },
    "Giant": { category: "Physical", maxDots: 3, description: "Size 6 and gains +1 Health." },
    "Hardy": { category: "Physical", maxDots: 3, description: "Add Merit dots to any rolls to resist disease, poison, deprivation, unconsciousness, or suffocation." },
    "Iron Stamina": { category: "Physical", maxDots: 3, description: "Each dot eliminates a negative modifier when resisting fatigue or injury. Also counteracts wound penalties." },
    "Tolerance for Biology": { category: "Physical", maxDots: 2, description: "Your character doesn't need to make Composure, Stamina, or Resolve rolls to withstand the biologically strange."},
    "Small-Framed": { category: "Physical", maxDots: 2, description: "Size 4, has one fewer Health box. Gains +2 to rolls to hide or go unnoticed." },
    
    // Fighting Merits
    "Armed Defense": { category: "Fighting", maxDots: 5, description: "Style Merit for using a weapon defensively. Reduce multiple attacker penalties, disarm, aggressive defense, etc." },
    "Defensive Combat": { category: "Fighting", maxDots: 1, description: "Use Brawl or Weaponry to calculate Defense instead of Athletics." },
    "Choke Hold": { category: "Fighting", maxDots: 2, description: "If you succeed on Hold, you can use the Choke Move. If you roll twice your victim's Stamina, the victim is unconscious for (6-Stamina) minutes." },
    "Fighting Finesse": { category: "Fighting", maxDots: 2, description: "Substitute Dexterity for Strength when making rolls with a chosen Weaponry or Brawl Specialty." },
    "Firefight": { category: "Fighting", maxDots: 3, description: "Style Merit for gun combat. Add Firearms to Initiative, suppressive fire, secondary targets." },
    "Grappling": { category: "Fighting", maxDots: 5, description: "Style Merit for wrestling. Sprawl, takedown, joint lock techniques." },
    "Heavy Weapons": { category: "Fighting", maxDots: 5, description: "Style Merit for two-handed weapons. Sure strike, threat range, warding stance, rending." },
    "Iron Skin": { category: "Fighting", maxDots: 4, description: "Gain armor against bashing attacks; one point with ••, two with ••••." },
    "Light Weapons": { category: "Fighting", maxDots: 5, description: "Style Merit for small hand weapons. Rapidity, thrust, feint, flurry, vital shot." },
    "Martial Arts": { category: "Fighting", maxDots: 5, description: "Style Merit for unarmed martial arts. Focused attack, defensive strike, whirlwind, lethal unarmed." },
    "Street Fighting": { category: "Fighting", maxDots: 5, description: "Style Merit for street combat. Duck and weave, knock wind out, kick while down." },
};

export const MERIT_CATEGORIES = ["Geist", "Mage", "Social", "Mental", "Physical", "Fighting"];

export const MERIT_CATEGORY_COLORS = {
    "Geist": "bg-teal-900/50 border-teal-500/50 text-teal-300",
    "Mage": "bg-indigo-900/50 border-indigo-500/50 text-indigo-300",
    "Social": "bg-pink-900/60 border-pink-500/60 text-pink-300",
    "Mental": "bg-blue-900/40 border-blue-500/40 text-blue-300",
    "Physical": "bg-amber-900/40 border-amber-500/40 text-amber-300",
    "Fighting": "bg-red-900/60 border-red-500/60 text-red-300",
};

// Ceremony definitions
export const CEREMONY_DEFINITIONS = {
    "Death Watch": {
        dots: 1,
        dicePool: "Stamina + Medicine",
        duration: "While maintaining contact",
        description: "Time ceases to pass for the subject's body. They do not bleed out, age, get hungry, or suffer ongoing damage. However, they also do not heal."
    },
    "Ishtar's Perfume": {
        dots: 1,
        dicePool: "Presence + Occult",
        duration: "Instant",
        description: "The Sin-Eater sees the last minute of a corpse's life through its eyes."
    },
    "Lovers' Telephone": {
        dots: 1,
        dicePool: "Manipulation + Computers",
        duration: "One phone call",
        description: "Your call connects to the nearest phone to the subject, even if disconnected. Ghosts can answer even if the phone isn't in Twilight."
    },
    "Speaker for the Dead": {
        dots: 3,
        dicePool: "Stamina + Composure",
        duration: "One scene",
        description: "A target ghost can speak through your mouth. Your voice becomes recognizably that of the ghost."
    },
    "Pass On": {
        dots: 5,
        dicePool: "Manipulation + Empathy",
        duration: "Permanent",
        description: "Help a ghost that has resolved all Anchors pass on. All Sin-Eaters present regain all spent Plasm."
    },
};

export const CardTypeColors = {
    tilt: { bg: "bg-orange-950/30", border: "border-orange-500/40", text: "text-orange-300", badge: "bg-orange-900/50" },
    condition: { bg: "bg-violet-950/30", border: "border-violet-500/40", text: "text-violet-300", badge: "bg-violet-900/50" },
    geist: { bg: "bg-teal-950/30", border: "border-teal-500/40", text: "text-teal-300", badge: "bg-teal-900/50" },
    haunt: { bg: "bg-cyan-950/30", border: "border-cyan-500/40", text: "text-cyan-300", badge: "bg-cyan-900/50" },
    key: { bg: "bg-amber-950/30", border: "border-amber-500/40", text: "text-amber-300", badge: "bg-amber-900/50" },
    merit: { bg: "bg-emerald-950/30", border: "border-emerald-500/40", text: "text-emerald-300", badge: "bg-emerald-900/50" },
    ceremony: { bg: "bg-fuchsia-950/30", border: "border-fuchsia-500/40", text: "text-fuchsia-300", badge: "bg-fuchsia-900/50" },
    custom: { bg: "bg-zinc-800/50", border: "border-zinc-600/40", text: "text-zinc-300", badge: "bg-zinc-700/50" },
};

export const PERSON_TYPE_OPTIONS = ["Mundane", "Supernatural", "Ephemeral"];
export const PERSON_SUBTYPE_OPTIONS = {
    Mundane: ["Aware", "Touched", "Unaware"],
    Supernatural: ["Vampire", "Werewolf", "Mage", "Changeling", "Bound"],
    Ephemeral: ["Ghost", "Geist"],
};

export const PERSON_TYPE_STYLES = {
    Mundane: "bg-green-800/60 border-green-600/40 text-green-200",
    Supernatural: "bg-purple-500/30 border-purple-300/30 text-purple-300",
    Ephemeral: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300",
};

export const PERSON_SUBTYPE_STYLES = {
    Unaware: "bg-zinc-800/60 border-zinc-600/40 text-zinc-200",
    Aware:   "bg-blue-900/40 border-blue-500/40 text-blue-300",
    Touched: "bg-violet-900/40 border-violet-500/40 text-violet-300",
};

export const SUPERNATURAL_SUBTYPE_STYLES = {
    Vampire:   "bg-rose-900/40 border-rose-500/40 text-rose-300",
    Werewolf:  "bg-amber-900/40 border-amber-500/40 text-amber-300",
    Mage:      "bg-indigo-900/40 border-indigo-500/40 text-indigo-300",
    Changeling:"bg-pink-900/40 border-pink-500/40 text-pink-300",
    Bound:     "bg-cyan-900/40 border-cyan-500/40 text-cyan-300",
};

export const EPHEMERAL_SUBTYPE_STYLES = {
    Ghost: "bg-blue-900/30 border-blue-400/30 text-blue-200",
    Geist: "bg-cyan-900/50 border-cyan-400/40 text-cyan-300",
};

export const PLACE_STATUS_OPTIONS = [
    "Abandoned",
    "Destroyed",
    "Haunted",
    "Inhabited",
    "Operational",
];

export const PLACE_STATUS_STYLES = {
    Destroyed:   "bg-black-900/30 border-gray-300/30 text-gray-300",
    Abandoned:   "bg-orange-900/40 border-orange-500/40 text-orange-300",
    Haunted:     "bg-purple-900/40 border-purple-500/40 text-purple-300",
    Operational:   "bg-amber-900/40 border-amber-500/40 text-amber-300",
    Inhabited: "bg-emerald-900/40 border-emerald-500/40 text-emerald-300",
};

export const PERSON_STATUS_OPTIONS = [
    "Alive",
    "Compromised",
    "Dead",
    "Injured",
    "Missing",
];

export const PERSON_STATUS_STYLES = {
    Dead:        "bg-black-900/50 border-red-500/50 text-red-500",
    Injured:     "bg-red-900/30 border-red-500/30 text-red-200",
    Missing:     "bg-orange-900/40 border-orange-500/40 text-orange-300",
    Compromised: "bg-yellow-900/40 border-yellow-500/40 text-yellow-300",
    Alive:       "bg-green-900/50 border-green-500/50 text-green-300",
};

export const PERSON_RELATIONSHIP_OPTIONS = [
    "Friendly",
    "Hostile",
    "Intimate",
    "Neutral",
    "Suspicious",
];

export const PERSON_RELATIONSHIP_STYLES = {
    Hostile:     "bg-red-900/40 border-red-500/40 text-red-300",
    Suspicious:  "bg-orange-900/40 border-orange-500/40 text-orange-300",
    Neutral:     "bg-zinc-800/60 border-zinc-600/40 text-zinc-200",
    Friendly:    "bg-green-900/50 border-green-500/50 text-green-300",
    Intimate:    "bg-pink-900/50 border-pink-500/50 text-pink-300",
};

