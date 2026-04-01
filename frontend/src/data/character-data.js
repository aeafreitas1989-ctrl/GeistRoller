// Geist: The Sin-Eaters - Character Data Constants

export const HAUNTS = [
    "The Boneyard", "The Caul", "The Curse", "The Dirge",
    "The Marionette", "The Memoria", "The Oracle", "The Rage",
    "The Shroud", "The Tomb"
];

// Haunt Enhancements by Haunt name and dot level
// Data extracted from the provided docx
export const HAUNT_ENHANCEMENTS = {
  "The Boneyard": {
    2: [
      { name: "Eyes in the Paintings", cost: 1, description: "Transfer perception to any location within the Boneyard (see/hear/smell/taste as if present). Returning costs no Plasm. May be applied more than once." },
    ],
    3: [
      { name: "No Escape", cost: "1-5", costMin: 1, costMax: 5, description: "Any attempt to leave the Boneyard suffers a penalty equal to Plasm spent; any attempt requires an action." },
    ],
    4: [
      { name: "Earthquake Weather", cost: 3, description: "Create an Environmental Tilt in the Boneyard with Severity equal to Boneyard dots: Blizzard, Extreme Heat, Extreme Cold, Heavy Winds, Heavy Rain, Ice, or Earthquake. May be applied more than once; you may end any created Tilt reflexively." },
    ],
    5: [
      { name: "The New Law", cost: 2, description: "State a Rule all entrants must follow. Rolls to violate the Rule take a penalty equal to half Synergy; violators gain the Defiant Condition for the Boneyard’s duration. Entrants don’t automatically know the rules. May be applied more than once, but only when the Boneyard is created." },
      { name: "Punish Lawbreaker", cost: 2, description: "Gain rote quality on rolls to punish Rule-breakers; your punishment counts as a Bane for ghosts that violate the Rule." },
    ],
  },

  "The Caul": {
    2: [
      { name: "Cold Flesh", cost: 3, description: "Gain general Armor equal to Caul dots and ballistic Armor equal to half Caul dots (rounded up)." },
    ],
    3: [
      { name: "Bloated Corpse", cost: "1-4", costMin: 1, costMax: 4, description: "Gain Size equal to Plasm spent; for every 2 Size gained, gain +1 Strength." },
      { name: "Scuttle", cost: 1, description: "Move at twice normal Speed on the ground; climb walls/ceilings at normal Speed." },
      { name: "Vitiate", cost: 1, description: "Your next unarmed attack inflicts lethal damage. May be applied more than once." },
      { name: "Chiropteran", cost: 2, description: "Grow wings; fly at normal Speed." },
      { name: "Swarming", cost: 4, description: "Transform into a swarm of tiny animals or a viscous mass able to seep through any crack wide enough for light; takes one turn per point of Size to pass through cracks." },
    ],
    4: [
      { name: "Disarticulation", cost: "1-5", costMin: 1, costMax: 5, description: "Create a homunculus with Health equal to Plasm spent. It follows simple commands; has dice pool (2 × Plasm spent) for physical actions; chance die for social/mental actions. Commanding any number is an instant action. May be applied more than once, but total homunculi are limited by Synergy." },
    ],
    5: [
      { name: "The Hungry Dead", cost: "Victim’s Size", description: "Consume a recently-dead being or recently incapacitated ghost of Size ≤ 7 (if consumed via ectophagia, costs no Plasm). Add to Caul Condition: spend 1 charge to mimic the victim’s appearance for 5 minutes (extend by spending more charges); spend 1 charge to use victim’s Attributes+Skills for one action (or for a ghost, relevant Attribute + Rank). These effects last until Caul ends or you use any other Caul Enhancement; then you permanently lose the mimicry." },
    ],
  },

  "The Curse": {
    2: [
      { name: "Gremlin", cost: 2, description: "Add an option to the Curse Condition: make a piece of equipment go haywire; its equipment bonus becomes a penalty for the rest of the scene when used by the victim. For a second charge, the equipment inflicts damage equal to its equipment bonus the next time the victim tries to use it." },
      { name: "No Fire", cost: 2, description: "Add an option to the Curse Condition: victim cannot start fires for the rest of the scene; any fires they lit during the scene extinguish themselves." },
    ],
    3: [
      { name: "Lethal Injury", cost: 2, description: "Add an option to the Curse Condition: victim suffers 3 lethal damage, then the Curse Condition resolves." },
      { name: "Malady", cost: 2, description: "Add an option to the Curse Condition: inflict one Tilt until end of scene: Arm Wrack, Blinded, Deafened, Insane, Knocked Down, Leg Wrack, Poisoned, or Sick." },
    ],
    4: [
      { name: "Social Drain", cost: 2, description: "Add an option to the Curse Condition: turn the victim’s next Social roll into a chance die." },
      { name: "Exhaustion ", cost: 2, description: "Add an option to the Curse Condition: prevent the victim from gaining Willpower from one event." },
    ],
    5: [
      { name: "Ignore Presence", cost: 3, description: "Add an option to the Curse Condition (lasts rest of scene): victim must spend 1 Willpower for anyone other than the cursing Sin-Eater to register their presence." },
      { name: "Forgotten", cost: 3, description: "Add an option to the Curse Condition (lasts rest of scene): block one of the victim’s Social Merits." },
      { name: "Interact with Ghosts", cost: 3, description: "Add an option to the Curse Condition (lasts rest of scene): victim can see, touch, and interact with ghosts as though they were living." },
    ],
  },

  "The Dirge": {
    2: [
      { name: "Distribute Essence", cost: "1-5", costMin: 1, costMax: 5, description: "Distribute Essence equal to Plasm spent to any ghosts with the Dirge Condition." },
      { name: "Paean", cost: 2, description: "A living character with the Dirge Condition also gains the Inspired Condition. May be applied more than once." },
    ],
    3: [
      { name: "Communion", cost: 2, description: "You have a Perfect social impression; you may roll Synergy + Dirge to open Doors in a Social Maneuver against any character with the Dirge Condition." },
    ],
    4: [
      { name: "Remove Condition", cost: 2, description: "Remove (without resolving) one Condition from a subject with the Dirge Condition: Beaten Down, Broken, Deprived, Guilty, Madness, Obsession, Shaken, or Spooked. Persistent Conditions are suppressed until the Dirge Condition ends. May be applied more than once." },
      { name: "Grant Condition", cost: 3, description: "Give one Condition to a subject with the Dirge Condition: Beaten Down, Connected, Deprived, Guilty, Inspired, Obsession, Shaken, Spooked, or Swooning. May be applied more than once." },
    ],
    5: [
      { name: "Visitation", cost: "1-5", costMin: 1, costMax: 5, description: "Spend Plasm equal to the Rank of a ghost with the Dirge Condition; that ghost gains a Manifestation Condition of your choice. May be applied more than once." },
    ],
  },

  "The Marionette": {
    2: [
      { name: "Swarm", cost: 2, description: "String the Marionette affects a number of targets equal to your Marionette dots. Multiple targets may be commanded as a single instant action if all do the same thing. Attacking with multiple puppets halves the target’s Defense." },
    ],
    3: [
      { name: "Phantom Strength", cost: 2, description: "Next attempt to resist your control suffers a −3 penalty. May be applied more than once, but only once per action." },
    ],
    4: [
      { name: "Servant", cost: 2, description: "Replace the Marionette Condition on a single target you control with the Servant Condition. May be applied more than once." },
      { name: "Lasting Servant", cost: 4, description: "Servant Condition (on all targets) ends without resolving after 24 hours. May be applied more than once." },
    ],
    5: [
      { name: "Pain Tolerance", cost: 2, description: "Next time a sapient Marionette takes lethal damage or suffers a breaking point, they do not resolve the Condition. May be applied more than once." },
      { name: "Traitor Flesh", cost: 3, description: "Next time a Marionette tries to fight against what you want to do, they suffer 2 lethal damage. May be applied more than once, but only once per attempted resistance." },
    ],
  },

  "The Memoria": {
    2: [
      { name: "Dénouement", cost: "1-5", costMin: 1, costMax: 5, description: "Visions of the past are clearly visible to anyone present, but intangible; only you receive the Memoria Condition. Observers may attempt reflexive Wits + Composure to recognize intangibility before being ‘hurt’ by it." },
    ],
    3: [
      { name: "Memory in a Bottle", cost: 3, description: "Resolve the Memoria Condition and fill a container with Plasm charged with the memory; anyone who consumes it gains the Memoria Condition with the original number of charges. While bottled, attempts to invoke it via Recall the Memoria fail automatically; if destroyed/poured out, the memory is lost forever." },
    ],
    4: [
      { name: "Mystery Play", cost: "1-5", costMin: 1, costMax: 5, description: "Draw one target per Plasm spent into the illusion; they gain the Actor Condition. Unwilling participants may contest with Resolve + Synergy. You cannot create more Actors than there were people present in the actual memory." },
    ],
    5: [
      { name: "Break the Cycle", cost: 2, description: "Add to the Actor Condition for all Actors: may go off-script with reflexive Resolve + Synergy (altering the outcome); when Actor resolves, target immediately resolves another trauma-related Condition; a ghost that resolves Actor may immediately resolve an Anchor relevant to the memory; a Rank 1 ghost that resolves Actor rises to Rank 2." },
    ],
  },

  "The Oracle": {
    2: [
      { name: "Wandering Shade", cost: 1, description: "Add questions to the Oracle Condition: What is the biggest threat to me and mine? Who is in most need our aid? Who is guilty of crimes against the dead? What has been forgotten here?" },
    ],
    3: [
      { name: "Spirit Reading", cost: 2, description: "Add questions to the Oracle Condition: What is the Ban of [a ghost I know]? What is the Bane of [a ghost I know]? What ties [a ghost I know] to the mortal plane?" },
    ],
    4: [
      { name: "Descent", cost: 3, description: "Answer a single question about the Underworld. May be applied more than once." },
    ],
    5: [
      { name: "Nekyia", cost: 4, description: "Ask a single question about future events." },
    ],
  },

  "The Rage": {
    2: [
      { name: "Black-Iron Blade", cost: 2, description: "Next time you inflict damage, also inflict one Tilt: Arm Wrack, Blinded, Deafened, Knocked Down, Leg Wrack, or Poisoned. May be applied multiple times." },
    ],
    3: [
      { name: "Distant Storm", cost: 0, description: "You may make unarmed ranged attacks out to 30 yards." },
      { name: "Maelstrom", cost: 2, description: "Next unarmed ranged attack is treated as a medium-burst autofire attack. May be applied more than once." },
    ],
    4: [
      { name: "Shatter", cost: 3, description: "Your next unarmed attack inflicts aggravated damage. May be applied more than once." },
      { name: "Fugue", cost: 2, description: "Next character who suffers a breaking point caused by taking Rage damage gains the Fugue Condition. May be applied more than once." },
    ],
    5: [
      { name: "Breaking the World", cost: 4, description: "Scene suffers a Tilt: Blizzard, Earthquake, Flooded, Heavy Rain, Heavy Winds, or Ice (even if unlikely). Where severity is required, use the Rage weapon modifier. You are immune to this Tilt." },
    ],
  },

  "The Shroud": {
    2: [
      { name: "Vision of Mist", cost: 1, description: "Your body registers no temperature; you don’t set off motion detectors, laser tripwires, or similar sensors." },
      { name: "Hazy Flight", cost: 2, description: "Hover and fly in any direction at half your Speed." },
    ],
    3: [
      { name: "Haunting Presence", cost: 3, description: "Gain one Manifestation effect or Numen usable while in Twilight: Discorporate, Fetter, Image, Possess, Sign (Numen), or Hallucination (Numen). Roll Synergy + Shroud and spend Plasm instead of Essence. May be applied more than once." },
    ],
    4: [
      { name: "Harrow", cost: 2, description: "Add to Shroud Condition options: bring another person you’re holding into Twilight with you (grapple first if resisting)." },
    ],
    5: [
      { name: "Descent", cost: 3, description: "Add to Shroud Condition options: cross into or out of the Upper Reaches of the Underworld. For an additional charge, you may bring one person you’re holding into (but not out of) the Underworld (grapple first if resisting)." },
    ],
  },

  "The Tomb": {
    2: [
      { name: "Headstone", cost: 2, description: "You may use Open the Tomb on a representation (photo/recording) or a closely-linked object (ring/keys). Must still be a specific person/object. For representations, the recreation matches how it’s depicted. Must be applied when Open the Tomb is activated." },
    ],
    3: [
      { name: "Autonomous Replicas", cost: 0, description: "Replicas of living beings can follow simple instructions; they have original Physical Attributes/Skills, but Social/Mental actions are a chance die. Tomb Condition becomes Persistent." },
      { name: "Empty Graves", cost: 3, description: "Replica created by Open the Tomb has the Open Condition; for people/animals, the original’s ghost may Possess the replica even without the Possess Manifestation." },
    ],
    4: [
      { name: "Stygian Treasures", cost: 2, description: "Pick one effect for the recreated item (apply at activation; may be purchased multiple times): user can see the dead; hear the dead; speak to the dead; or the object can communicate between the living world and the Underworld." },
    ],
    5: [
      { name: "Terra Cotta Soldiers", cost: "1-5", costMin: 1, costMax: 5, description: "Use Open the Tomb on a wholly symbolic representation to create a piece of equipment or an appropriate Merit (e.g., Retainer, Library). Plasm cost equals the Merit cost or the Availability of the object. Must be applied when Open the Tomb is activated." },
    ],
  },
};


export const KEYS = [
    "Beasts", "Blood", "Chance", "Cold Wind", "Deep Waters",
    "Disease", "Grave Dirt", "Pyre Flame", "Stillness"
];

export const BURDENS = ["Abiding", "Bereaved", "Hungry", "Kindly", "Vengeful"];

export const ARCHETYPES = [
    "Advocates", "Furies", "Gatekeepers", "Mourners", "Necropolitans",
    "Pilgrims", "Undertakers"
];

export const INVENTORY_TYPES = ["weapon", "armor", "equipment"];

export const AVAILABILITY_OPTIONS = [
  { value: 0, label: "-" },
  { value: 1, label: "•" },
  { value: 2, label: "••" },
  { value: 3, label: "•••" },
  { value: 4, label: "••••" },
  { value: 5, label: "•••••" },
];

export const WEAPON_SPECIAL_OPTIONS = [
  "Stun",
  "Brawl",
  "Grapple",
  "Concealed",
  "9-again",
  "Two-Handed",
  "Defense",
];

export const ARMOR_COVERAGE_OPTIONS = ["head", "torso", "arms", "legs"];

// Minimal starter premade list (equipment). You can add more entries using this same shape.
export const PREMADE_ARMOR = [
    {
        name: "Reinforced Clothing",
        availability: 1,
        armor: {
            general: 1,
            ballistic: 0,
            strength: 1,
            defense: 0,
            speed: 0,
            coverage: ["torso", "arms", "legs"],
        },
    },
    {
        name: "Kevlar Vest",
        availability: 1,
        armor: {
            general: 1,
            ballistic: 3,
            strength: 1,
            defense: 0,
            speed: 0,
            coverage: ["torso"],
        },
    },
    {
        name: "Flak Jacket",
        availability: 2,
        armor: {
            general: 2,
            ballistic: 4,
            strength: 1,
            defense: -1,
            speed: 0,
            coverage: ["torso", "arms"],
        },
    },
    {
        name: "Full Riot Gear",
        availability: 3,
        armor: {
            general: 3,
            ballistic: 5,
            strength: 2,
            defense: -2,
            speed: -1,
            coverage: ["torso", "arms", "legs"],
        },
    },
    {
        name: "Leather Armor",
        availability: 1,
        armor: {
            general: 2,
            ballistic: 0,
            strength: 2,
            defense: -1,
            speed: 0,
            coverage: ["torso", "arms"],
        },
    },
    {
        name: "Chainmail",
        availability: 2,
        armor: {
            general: 3,
            ballistic: 1,
            strength: 3,
            defense: -2,
            speed: -2,
            coverage: ["torso", "arms"],
        },
    },
    {
        name: "Plate",
        availability: 4,
        armor: {
            general: 4,
            ballistic: 2,
            strength: 3,
            defense: -2,
            speed: -3,
            coverage: ["torso", "arms", "legs"],
        },
    },
];

export const PREMADE_EQUIPMENT = [
  {
    name: "Automotive Tools (Basic Kit)",
    availability: 1,
    bonus: 1,
    durability: 2,
    size: 2,
    structure: 3,
    effect:
      "Automotive tools allow routine repairs without rolls if time is not a factor and the character is trained. Complex repairs/modifications require extended Intelligence + Crafts.",
  },
  {
    name: "Automotive Tools (Advanced Garage)",
    availability: 1,
    bonus: 2,
    durability: 2,
    size: 2,
    structure: 3,
    effect:
      "A fully stocked garage for major repairs (engine/transmission). Complex modifications and massive damage require extended Intelligence + Crafts.",
  },
  {
    name: "Cache",
    availability: 1,
    bonus: 1,
    durability: 2,
    size: 1,
    structure: 5,
    effect:
      "Hidden defensible place for items. Holds two items of its Size plus smaller items. Bonus adds to concealment and subtracts from rolls to find contents.",
  },
  {
    name: "Communications Headset",
    availability: 2,
    bonus: 2,
    durability: 0,
    size: 1,
    structure: 1,
    effect:
      "Keeps users in contact (most ~200 feet). Bonus applies to coordinated efforts; heavy objects can obstruct signal and require Wits + Composure to understand.",
  },
  {
    name: "Crime Scene Kit",
    availability: 2,
    bonus: 2,
    durability: 2,
    size: 3,
    structure: 2,
    effect:
      "Bonus to Investigation and allows evidence handling offsite; supports careful analysis at own pace.",
  },
];

// Synergy table data
export const SYNERGY_TABLE = {
    1:  { maxPlasm: 10, perTurn: 1, traitMax: 5, touchstones: 1, aura: "10m", auraCondition: "N/A", relationship: "Coercive" },
    2:  { maxPlasm: 11, perTurn: 2, traitMax: 5, touchstones: 1, aura: "20m", auraCondition: "Anchor", relationship: "Positional" },
    3:  { maxPlasm: 12, perTurn: 3, traitMax: 5, touchstones: 2, aura: "30m", auraCondition: "Anchor", relationship: "Positional" },
    4:  { maxPlasm: 13, perTurn: 4, traitMax: 5, touchstones: 2, aura: "40m", auraCondition: "Anchor", relationship: "Positional" },
    5:  { maxPlasm: 15, perTurn: 5, traitMax: 5, touchstones: 2, aura: "50m", auraCondition: "Anchor", relationship: "Sympathetic" },
    6:  { maxPlasm: 20, perTurn: 6, traitMax: 6, touchstones: 3, aura: "60m", auraCondition: "Open", relationship: "Sympathetic" },
    7:  { maxPlasm: 30, perTurn: 7, traitMax: 7, touchstones: 3, aura: "70m", auraCondition: "Open", relationship: "Sympathetic" },
    8:  { maxPlasm: 40, perTurn: 8, traitMax: 8, touchstones: 3, aura: "80m", auraCondition: "Open", relationship: "Empathetic" },
    9:  { maxPlasm: 50, perTurn: 9, traitMax: 9, touchstones: 3, aura: "90m", auraCondition: "Controlled", relationship: "Empathetic" },
    10: { maxPlasm: 100, perTurn: 10, traitMax: 10, touchstones: 3, aura: "100m", auraCondition: "Controlled", relationship: "Empathetic" },
};

// Merits (alphabetical, from provided list)
export const MERIT_LIST = [
    { name: "Allies", maxDots: 5, description: "Allies help your character. They might be friends, employees, associates, or people your character has black-mailed. Each instance of this Merit represents one type of ally. This could be an organization, a society, a clique, or an individual. Examples include the police, a secret society, criminal organizations, unions, local politicians, or the academic community. Each purchase has its own rating. Your character might have Allies (Masons) ••, Allies (Carter Crime Family) •••, and Allies (Catholic Church) •." },
    { name: "Alternate Identity", maxDots: 3, description: "Your character has established an alternate identity. The level of this Merit determines the amount of scrutiny it holds up to. At one dot, the identity is superficial and unofficial. For example, your character uses an alias with a simple costume and adopts an accent. She hasn’t established the necessary paperwork to even approach a bureaucratic back-ground check, let alone pass one. At two dots, she’s supported her identity with paperwork and identification. It’s not liable to stand up to extensive research, but it’ll turn away private investigators and internet hobbyists. At three dots, the identity can pass a thorough inspection. The identity has been deeply entrenched in relevant databases, with subtle flourishes and details to make it seem real, even to trained professionals." },
    { name: "Ambidextrous", minDots: 3, maxDots: 3, description: "Your character does not suffer the -2 penalty for using his off hand in combat or other actions. Available only at character creation." },
    { name: "Anonymity", maxDots: 5, description: "Your character lives off the grid. This means purchases must be made with cash or falsified credit cards. She eschews identification. She avoids any official authoritative influence in her affairs. Any attempts to find her by paper trail suffer a -1 penalty per dot purchased in this Merit." },
    { name: "Architect", maxDots: 5, description: "Your character must create things that last. She’s particularly good at this; she pours her all into everything, every institution, every relationship she can. When taking an extended action to create something your character finds significant, you gain a number of additional dice equal to your Merit dots. You can divide these dice as you see fit across any number of rolls. Any roll benefiting from these dice gains the 8-again quality." },
    { name: "Area of Expertise", minDots: 1, maxDots: 1, description: "Your character is uncommonly specialized in one area. Choose a Specialty to assign to this Merit. Forgo the +1-bonus afforded by a Specialty, in exchange for a +2." },
    { name: "Armed Defense", maxDots: 5, description: "Prerequisites: Dexterity •••, Weaponry ••, Defensive Combat: Weaponry" },
    { name: "Automotive Genius", minDots: 1, maxDots: 1, description: "Your character knows how to fine-tune a vehicle to utter extremes. When determining how many modifications she can add to a vehicle, triple her Crafts dots instead of doubling them. So, a character with Crafts •••• could support 12 combined modifications on a vehicle instead of eight. Additionally, any relevant Crafts Specialties add one more potential modification to the total." },
    { name: "Barfly", maxDots: 2, description: "Your character is a natural in the bar environment and can procure an open invitation wherever he wishes. Whereas most characters would require rolls to blend into social functions they don’t belong in, he doesn’t; he belongs. Rolls to identify him as an outsider suffer his Socialize as a penalty." },
    { name: "Cenote", maxDots: 5, description: "Your character has access to a haunted house, cemetery, or other place she can freely spend time and recharge Plasm. Every chapter, this Cenote generates Plasm equal to its dot rating." },
    { name: "Cheap Shot", minDots: 2, maxDots: 2, description: "Your character is a master at the bait and switch. She can look off in an odd direction and prompt her oppo-nent to do the same, or she might step on his toes to distract him. She fights dirty. Make a Dexterity + Subterfuge roll as a reflexive action. The opponent’s player contests with Wits + Composure. If you score more successes, the opponent loses his Defense for the next turn. Each time a character uses this maneuver in a scene, it levies a cumulative -2 penalty to further uses since the opposition gets used to the tricks." },
    { name: "Choke Hold", minDots: 2, maxDots: 2, description: "Prerequisites: Brawl •• If you can get your hands on someone, they’re putty in your hands. When grappling, your character can use the Choke move:" },
    { name: "Close Quarters Combat", maxDots: 5, description: "Prerequisites: Wits •••, Athletics ••, Brawl •••" },
    { name: "Closed Book", maxDots: 5, description: "Your character is particularly tough to crack. When a character uses Social Manoeuvring against her, add her dots in this Merit as additional Doors. In other Social actions to uncover her true feelings, motives, and position, add her Merit dots to any contested rolls for her." },
    { name: "Common Sense", minDots: 3, maxDots: 3, description: "Your character has an exceptionally sound and rational mind. With a moment’s thought, she can weigh potential courses of action and outcomes. Once per chapter as an instant action, you may ask the Storyteller one of the following questions about a task at hand or course of action. Roll Wits + Composure. If you succeed, the Storyteller must answer to the best of her ability. If you fail, you get no answer. With an exceptional success, you can ask an additional question." },
    { name: "Contacts", maxDots: 5, description: "Contacts provide your character with information. Each dot in this Merit represents a sphere or organization with which the character can garner information. For example, a character with Contacts ••• might have Bloggers, Drug Dealers, and Financial Speculators for connections. Contacts do not provide services, only information. This may be face-to-face, via email, by telephone, or even by séance in some strange instances." },
    { name: "Crack Driver", maxDots: 3, description: "Your character’s an ace at the wheel, and nothing shakes his concentration. So long as he’s not taking any actions other than driving (and keeping the car safe), add his Composure to any rolls to Drive. Any rolls to disable his vehicle suffer a penalty equal to his Composure as well. With the three-dot version, once per turn he may take a Drive action reflexively." },
    { name: "Danger Sense", minDots: 2, maxDots: 2, description: "You gain a +2 modifier on reflexive Wits + Composure rolls for your character to detect an impending ambush." },
    { name: "Defensive Combat", minDots: 1, maxDots: 1, description: "Your character is trained in avoiding damage in combat. Use her Brawl or Weaponry to calculate Defense, rather than Athletics. Your character can learn both versions of this Merit, allowing you to use any of the three Skills to calculate Defense. However, you cannot use Weaponry to calculate Defense unless she actually has a weapon in her hand." },
    { name: "Demolisher", maxDots: 3, description: "Your character has an innate feel for the weak points in objects. When damaging an object, she ignores one point of the object’s Durability per dot with this Merit." },
    { name: "Direction Sense", minDots: 1, maxDots: 1, description: "Your character has an innate sense of direction and is always aware of her location in space. She always knows which direction she faces, and never suffers penalties to navigate or find her way." },
    { name: "Double Jointed", minDots: 2, maxDots: 2, description: "Your character might have been a contortionist or spent time practicing yoga. She can dislodge joints when need be. She automatically escapes from any mundane bonds without a roll. When grappled, subtract her Dexterity from any rolls to overpower her, as long as she’s not taking any aggressive actions." },
    { name: "Dread Geist", minDots: 3, maxDots: 3, description: "Your Geist is Rank 4." },
    { name: "Eidetic Memory", minDots: 2, maxDots: 2, description: "Your character recalls events and details with pinpoint accuracy. You do not have to make rolls for your character to remember past experiences. When making Intelligence + Composure (or relevant Skill) rolls to recall minute facts from swaths of information, take a +2 bonus." },
    { name: "Encyclopaedic Knowledge", minDots: 2, maxDots: 2, description: "Choose a Skill. Due to an immersion in academia, pop culture, or a hobby obsession, your character has collected limitless factoids about the topic, even if she has no dots in the Skill." },
    { name: "Eye for the Strange", minDots: 2, maxDots: 2, description: "While your character does not necessarily possess a breadth of knowledge about the supernatural, she knows the otherworldly when she sees it. By perusing evidence, she can determine whether something comes from natural or supernatural origins. Roll Intelligence + Composure. With a success, the Storyteller must tell you if the scene has a supernatural cause and provide one piece of found information that confirms the answer. With an exceptional success, she must give you a bit of supernatural folklore that suggests what type of creature caused the problem. If the problem was mundane, an exceptional success gives an ongoing +2 to all rolls to investigate the event, due to her redoubled certainty in its natural causation." },
    { name: "Fame", maxDots: 3, description: "Your character is recognized within a certain sphere, for a certain skill, or because of some past action or stroke of luck. This can mean favours and attention; it can also mean negative attention and scrutiny. When choosing the Merit, define what your character is known for. As a rule of thumb, one dot means local recognition, or reputation within a confined subculture. Two dots mean regional recognition by a wide swath of people. Three dots mean worldwide recognition to anyone that might have been exposed to the source of the fame. Each dot adds a die to any Social rolls among those who are impressed by your character’s celebrity." },
    { name: "Fast Reflexes", maxDots: 3, description: "+1 Initiative per dot Your character’s reflexes impress and astound; she’s always fast to react." },
    { name: "Fast-Talking", maxDots: 5, description: "Prerequisites: Manipulation •••, Subterfuge ••" },
    { name: "Fighting Finesse", minDots: 2, maxDots: 2, description: "Choose a Specialty in Weaponry or Brawl when you purchase this Merit. Your character’s extensive training in that particular weapon or style has allowed them to benefit more from their alacrity and agility than their strength. You may substitute your character’s Dexterity for her Strength when making rolls with that Specialty. This Merit may be purchased multiple times to gain its benefit with multiple Specialties." },
    { name: "Firefight", maxDots: 3, description: "Your character is comfortable with a gun. She’s been trained in stressful situations, and knows how to keep herself from being shot, while still shooting at her opponents. This Style is about moving, strafing, and taking shots when you get them. It’s not a series of precision techniques; it’s for using a gun practically in a real-world situation." },
    { name: "Fixer", minDots: 2, maxDots: 2, description: "Your character is people that knows people. She can not only get in touch with the right people to do a job, but she can get them at the best possible prices. When hiring a service, reduce the Availability score of the service by one dot." },
    { name: "Fleet of Foot", maxDots: 3, description: "Your character is remarkably quick and runs far faster than his frame suggests. He gains +1 Speed per dot, and anyone pursuing him suffers a -1 per dot to any foot chase rolls." },
    { name: "Giant", minDots: 3, maxDots: 3, description: "Your character is massive. She’s well over six feet tall, and crowds’ part when she approaches. She’s Size 6 and gains +1 Health. Available only at character creation." },
    { name: "Good Time Management", minDots: 1, maxDots: 1, description: "Your character has vast experience managing complex tasks, keeping schedules, and meeting deadlines. When taking an extended action, halve the time required between rolls." },
    { name: "Grappling", maxDots: 5, description: "Your character has trained in wrestling, or one of many grappling martial arts." },
    { name: "Grave Goods", maxDots: 5, description: "Your character wants and wants and takes and takes. To her, the phrase “you can’t take it with you” just means you’re not trying hard enough. She has gathered a cache of ghostly objects, perhaps snatched from the Underworld or given to her by ghostly lovers or even buried in her own empty tomb." },
    { name: "Greyhound", minDots: 1, maxDots: 1, description: "Your character works best when chasing or being chased; the hunt is in his blood. When in a chase, you receive the effects of an exceptional success on three successes instead of five." },
    { name: "Hardy", maxDots: 3, description: "Your character’s body goes further than it right-fully should. Add the dots in this Merit to any rolls to resist disease, poison, deprivation, unconsciousness, or suffocation." },
    { name: "Heavy Weapons", maxDots: 5, description: "Your character is trained with heavy weapons which require strength, wide range, and follow through more than direct speed and accuracy. This Style may be used with a two-handed weapon such as a claymore, chainsaw, pike, or an uprooted street sign." },
    { name: "Hobbyist Clique", minDots: 2, maxDots: 2, description: "Your character is part of a group of hobbyists that specialize in one area, represented by a Skill. It may be a book club, a coven, a political party, or any group brought together by a common interest. When the group’s support is available, you benefit from the 9-again quality on rolls involving the group’s chosen Skill. As well, the clique offers two additional dice on any extended actions involving that Skill." },
    { name: "Holistic Awareness", minDots: 1, maxDots: 1, description: "Your character is skilled at non-traditional healing methods. While scientific minds might scoff, he can provide basic medical care with natural means. He knows what herbs can stem an infection, and what minerals will stave off a minor sickness. Unless your patient suffers wound penalties from lethal or aggravated wounds, you do not need traditional medical equipment to stabilize and treat injuries. With access to woodlands, a greenhouse, or other source of diverse flora, a Wits + Survival roll allows your character to gather all necessary supplies." },
    { name: "Improvised Weaponry", maxDots: 3, description: "Prerequisites: Wits •••, Weaponry •" },
    { name: "Indomitable", minDots: 2, maxDots: 2, description: "Prerequisite: Resolve •••" },
    { name: "Inspiring", minDots: 3, maxDots: 3, description: "Your character’s passion inspires those around her to greatness. With a few words, she can redouble a group’s confidence or move them to action." },
    { name: "Interdisciplinary Speciality", minDots: 1, maxDots: 1, description: "Choose a Specialty that your character possesses when you purchase this Merit. You can apply the +1 from that Specialty on any Skill with at least one dot, provided it’s justifiable within the scope of the fiction. For example, a doctor with a Medicine Specialty in Anatomy may be able to use it when targeting a specific body part with Weaponry but could not with a general strike." },
    { name: "Investigative Aide", minDots: 1, maxDots: 1, description: "Your character has one particular knack that can contribute amazingly to an investigation. Choose a Skill when purchasing this Merit; when making rolls to Uncover Clues, she achieves exceptional success on three successes instead of five. As well, Clues that come from her use of that Skill start with one additional element." },
    { name: "Investigative Prodigy", maxDots: 5, description: "Your character investigates instinctively and can intuit details and connections in a scene without much time. He’s a veritable Sherlock Holmes. Instead of simply uncovering Clues or not uncovering Clues when investigating, your character discovers multiple Clues in a single action. Your character can uncover Clues equal to his successes or his Merit dots as an instant action, whichever is lower." },
    { name: "Iron Skin", maxDots: 4, description: "Prerequisites: Martial Arts •• or Street Fighting ••, Stamina •••" },
    { name: "Iron Stamina", maxDots: 3, description: "Each dot eliminates a negative modifier (on a one-for-one basis) when resisting the effects of fatigue or injury. For example: A character with Iron Stamina •• is able to ignore up to a -2-modifier brought on by fatigue. The Merit also counteracts the effects of wound penalties. So, if all of your character’s Health boxes are filled (which normally imposes a -3 penalty to his actions) and he has Iron Stamina •, those penalties are reduced to -2. This Merit cannot be used to gain positive modifiers for actions, only to cancel out negative ones." },
    { name: "Iron Will", minDots: 2, maxDots: 2, description: "Your character’s resolve is unwavering. When spending Willpower to contest or resist in a Social interaction, you may substitute your character’s Resolve for the usual Willpower bonus. If the roll is contested, roll with 8-again." },
    { name: "Language", minDots: 1, maxDots: 1, description: "Your character is skilled with an additional language, beyond her native tongue. Choose a language each time you buy this Merit. Your character can speak, read, and write in that language." },
    { name: "Library", maxDots: 3, description: "Your character has access to a plethora of information about a given topic. When purchasing this Merit, choose a Mental Skill. The Library covers that purview. On any extended roll involving the Skill in question, add the dots in this Merit." },
    { name: "Light Weapons", maxDots: 5, description: "Your character is trained with small hand-to-hand weapons which favor finesse over raw power. These maneuvers may only be used with one-handed weapons with a damage rating of two or less." },
    { name: "Manic States", maxDots: 5, description: "Once per game session, reflexively spend a point of Willpower to bring about a manic state for the scene. Ignore the negative effects of the Persistent Condition for the scene. Additionally, take a pool of dice equal to your Merit dots, and divide them among any rolls during the scene as you see fit. Any roll where you used these dice gains 8-again." },
    { name: "Marksmanship", maxDots: 3, description: "When prepared and aimed, a gun is an ideal kill-ing machine. Your character has trained to take advantage of the greatest features of a gun, usually a rifle, but this Style can be used with any gun. Because of the discipline and patience required for Marksmanship, your character cannot use her Defense during any turn in which she uses one of these maneuvers. These maneuvers may only be used after aiming for at least one turn." },
    { name: "Martial Arts", maxDots: 5, description: "Your character is trained in one or more formal mar-tial arts styles. This may have come from a personal mentor, a dojo, or a self-defense class. It may have been for exercise, protection, show, or tradition. These maneuvers may only be used unarmed, or with weapons capable of using the Brawl Skill, such as a punch dagger, or a weapon using the Shiv Merit (see below)." },
    { name: "Meditative Mind", maxDots: 4, description: "Your character’s meditation is far more fulfilling than for other characters. With the one-dot version of this Merit, the character does not suffer environmental penalties to meditation, even from wound penalties." },
    { name: "Memento", minDots: 3, maxDots: 3, description: "Your character has a Memento." },
    { name: "Mentor", maxDots: 5, description: "This Merit gives your character a teacher that provides advice and guidance. He acts on your character’s behalf, often in the background, and sometimes without your character’s knowledge. While Mentors can be highly competent, they almost always want something in return for their services. The dot rating determines the Mentor’s capabilities, and to what extent he’ll aid your character." },
    { name: "Multilingual", minDots: 1, maxDots: 1, description: "Your character has a strong affinity for language acquisition. Each time you purchase this Merit, choose two languages. Your character can speak conversationally in those languages. With an Intelligence + Academics roll, he may also read enough of the language to understand context." },
    { name: "Mystery Cult Initiation", maxDots: 5, description: "Cults are far more common than people would like to admit.. “Mystery cult” is the catch-all term for a phenomenon ranging from secret societies couched in fraternity houses, to scholarly cabals studying the magic of classical symbolism, to mystical suicide cults to the God-Machine." },
    { name: "Parkour", maxDots: 5, description: "Prerequisites: Dexterity •••, Athletics ••" },
    { name: "Patient", minDots: 1, maxDots: 1, description: "Your character knows how to pace herself and take the time to do the job right the first time. When taking an extended action, you may make two additional rolls, above what your Attribute + Skill allows." },
    { name: "Police Tactics", maxDots: 3, description: "Your character is trained in restraint techniques, often used by law enforcement officers. This may reflect formal training, or lessons from a skilled practitioner." },
    { name: "Professional Training", maxDots: 5, description: "Your character has extensive training in a particular profession, which offers distinct advantages in a handful of fields. When choosing this Merit, choose or create a Profession for your character (see the sidebar). Mark the two Asset Skills on your character sheet. The advantages of Professional Training relate directly to those Asset Skills." },
    { name: "Pusher", minDots: 1, maxDots: 1, description: "Your character tempts and bribes as second nature. Any time a mark in a Social interaction accepts his soft leverage, open a Door as if you’d satisfied his Vice as well as moving the impression up on the chart." },
    { name: "Quick Draw", minDots: 1, maxDots: 1, description: "Choose a Specialty in Weaponry or Firearms when you purchase this Merit. Your character has trained in that weapon or style enough that pulling the weapon is his first reflex. Drawing or holstering that weapon is considered a reflexive action and can be done any time his Defence applies." },
    { name: "Reconciler", maxDots: 3, description: "Your character is an expert at bringing closure to issues and making amends. When undertaking a Social Maneuver to right a wrong or broker peace, remove a number of Doors equal to her dots in this Merit." },
    { name: "Relentless", minDots: 1, maxDots: 1, description: "Your character will not stop running, whether away from a pursuer or toward prey. In any chase your opponents must achieve two additional successes against yours to catch her or elude her." },
    { name: "Resources", maxDots: 5, description: "This Merit reflects your character’s disposable in-come. She might live in an upscale condo, but if her income is tied up in the mortgage and child support payments, she might have little money to throw around. Characters are assumed to have basic necessities without Resources." },
    { name: "Retainer", maxDots: 5, description: "Your character has an assistant, sycophant, servant, or follower on whom she can rely. Establish who this companion is, and how he was acquired. It may be as simple as a paycheck. He might owe your character his life. However, it happened, your character has a hold on him." },
    { name: "Retribution", maxDots: 5, description: "Your character isn’t necessarily a practiced, learned fighter, but when she sees injustice, she gets a mean strike like nothing else. To use these abilities, your character must suffer or witness harm to someone she cares about or feels responsibility toward. This doesn’t have to happen in the same scene, but she must be actively pursuing retribution or the effects end. With loved ones whose lives were in true danger, she does not need to directly witness the harm — she simply has to be made aware of it." },
    { name: "Safe Place", maxDots: 5, description: "Your character has somewhere she can go where she can feel secure. While she may have enemies that could attack her there, she’s prepared and has the upper hand. The dot rating reflects the security of the place. The actual location, the luxury, and the size are represented by equipment. A one-dot Safe Place might be equipped with basic security systems or a booby trap at the windows and door. A five-dot could have a security crew, infrared scanners at every entrance, or trained dogs. Each place can be an apartment, a mansion, or a hidey-hole." },
    { name: "Seizing the Edge", minDots: 2, maxDots: 2, description: "Your character is always ready for a chase. Whether to escape a threat or hunt down a rival, she’s always geared and ready to go. She always has the Edge in the first turn of a chase scene. Additionally, the opponent must make a successful Wits + Composure roll, as if being ambushed, or your character does not have to account for her Speed or Initiative when calculating needed successes in the first turn." },
    { name: "Shiv", maxDots: 2, description: "Your character carries small, concealable weapons for use in a tussle. Rolls to detect the concealed weapon suffer your character’s Weaponry score as a pen-alty. With the one-dot version, he can conceal a weapon with a zero damage rating. The two-dot version can conceal a one damage rating weapon. Your character may use the Brawl Skill to use this weapon." },
    { name: "Sleight of Hand", minDots: 2, maxDots: 2, description: "Your character can pick locks and pockets without even thinking about it. She can take one Larceny-based instant action reflexively in a given turn. As well, her Larceny actions go unnoticed unless someone is trying specifically to catch her." },
    { name: "Small Unit Tactics", minDots: 2, maxDots: 2, description: "Your character is a proficient leader in the field. She can organize efforts and bark orders to remarkable effect. Once per scene, when making a coordinated action that was planned in advance, spend a point of Willpower and an instant action. A number of characters equal to your character’s Presence can benefit from the +3-bonus gained from the Willpower expenditure." },
    { name: "Small-Framed", minDots: 2, maxDots: 2, description: "Your character is diminutive. He’s not five feet, and it’s easy to walk into him without noticing. He’s Size 4, and thus has one fewer Health box. He gains +2 to any rolls to hide or go unnoticed, and this bonus might apply any time being smaller would be an advantage, such as crawling through smaller spaces. Available only at character creation." },
    { name: "Spin Doctor", minDots: 1, maxDots: 1, description: "Your character can fast-talk and sell bullshit stories as if they were completely flawless. When suffering from Tainted Clues, your character does not ignore successes. Instead, apply a -1 penalty for each relevant Tainted Clue. Using a Tainted Clue only levies a total -2 penalty with this Merit, which includes the -1 taken in lieu of ignoring successes." },
    { name: "Staff", maxDots: 5, description: "Your character has a crew of workers or assistants at his disposal. They may be housekeepers, designers, research assistants, animators, cheap thugs, or whatever else makes sense. For every dot in this Merit, choose one type of assistant, and one Skill. At any reasonable time, his staff can take actions using that Skill. These actions automatically garner a single success. While not useful in contested actions, this guarantees success on minor, mundane activities. Note that your character may have employees without requiring the Staff Merit; Staff simply adds a mechanical advantage for those groups." },
    { name: "Status", maxDots: 5, description: "Your character has standing, membership, authority, control over, or respect from a group or organization. This can reflect official standing, or merely informal respect. No matter the source, your character enjoys certain privileges within that structure." },
    { name: "Street Fighting", maxDots: 5, description: "Your character learned to fight on the mean streets. She may have had some degree of formal training, but the methodology came from the real world, in dangerous circum-stances. Street Fighting isn’t about form and grace, it’s about staying alive. These maneuvers may only be used unarmed, or with weapons capable of using the Brawl Skill, such as punch daggers, or weapons concealed with the Shiv Merit (above)." },
    { name: "Striking Looks", maxDots: 2, description: "Your character is stunning, alarming, commanding, repulsive, threatening, charming, or otherwise worthy of attention. Determine how your character looks and how people react to that. For one dot, your character gets a +1 bonus on any Social rolls that would be influenced by his looks. For two dots, the benefit increases to +2. Depending on the particulars, this might influence Expression, Intimidation, Persuasion, Subterfuge, or other rolls." },
    { name: "Stunt Driver", maxDots: 4, description: "Your character is an expert behind the wheel and can push a vehicle beyond normal limits. Each dot of this Merit grants access to another driving technique." },
    { name: "Supernatural Membership", maxDots: 5, description: "Your krewe has various living members with exceptional abilities. When defining living members of your krewe, you may create characters with Supernatural Merit dots equal to twice the krewe’s rating in Supernatural Membership. Such characters always roll their best dice pool to activate their Supernatural Merits. If a Supernatural Merit has a Willpower cost, they ignore it, but may only use the Merit once per chapter." },
    { name: "Sympathetic", minDots: 2, maxDots: 2, description: "Your character is very good at letting others get close. This gives him an edge in getting what he wants. At the beginning of a Social manoeuvring attempt, you may choose to accept a Condition such as Leveraged, Swooned, or Vulnerable in order to immediately eliminate two of the subject’s Doors." },
    { name: "Table Turner", minDots: 1, maxDots: 1, description: "Prerequisites: Composure •••, Manipulation •••, Wits •••" },
    { name: "Takes One to Know One", minDots: 1, maxDots: 1, description: "Normally, when Uncovering a Clue, your character suffers a -2 penalty if the crime aligns with his Vice. However, it takes a criminal to know a criminal, and your character has a deep-seated understanding of his particular weakness. Instead, take a +2 and the 9-again quality on any investigation rolls when the crime aligns with your character’s particular Vice. The successful investigation is considered fulfilling his Vice." },
    { name: "Taste", minDots: 1, maxDots: 1, description: "Your character has refined tastes, and can identify minor details in fashion, food, architecture, and other forms of artistry and craftsmanship. Not only does this give her an eye for detail, it makes her a centre of attention in critical circles. She can also appraise items within her area of expertise. With a Wits + Skill roll, depending on the creation in question (Expression for poetry, Crafts for architecture, for example), your character can pick out obscure details about the item that other, less discerning minds would not. For each success, ask one of the following questions, or take a +1 bonus to any Social rolls pertaining to groups interested in the art assessed for the remainder of the scene." },
    { name: "Tolerance for Biology", minDots: 2, maxDots: 2, description: "Most people turn away at the sight of blood, other bodily fluids, or exotic biology. Your character has seen enough that nothing turns her stomach. When other characters must resist shock or physical repulsion from the disgusting and morbid, your character stands her ground. You do not need to make Composure, Stamina, or Resolve rolls to withstand the biologically strange. This doesn’t mean she’s immune to fear; she’s just used to nature in all its nasty forms." },
    { name: "Trained Observer", maxDots: 3, description: "Your character has spent years in the field, catching tiny details and digging for secrets. She might not have a better chance of finding things, but she has a better chance of finding important things. Any time you make a Perception roll (usually Wits + Composure), you benefit from the 9-again quality. With the three-dot version, you get 8-again." },
    { name: "True Friend", minDots: 3, maxDots: 3, description: "Your character has a True Friend. While that friend may have specific functions covered by other Merits (Allies, Contacts, Retainer, Mentor, et cetera), True Friend represents a deeper, truly trusting relationship that cannot be breached. Unless your character does something egregious to cause it, her True Friend will not betray her. Additionally, the Storyteller cannot kill her True Friend as part of a plot without your express permission. Any rolls to influence a True Friend against your character suffer a five-die penalty. In addition, once per story, your character can regain one spent Willpower by having a meaningful interaction with her True Friend." },
    { name: "Unarmed Defense", maxDots: 5, description: "Prerequisites: Dexterity •••, Brawl ••, Defensive Combat: Brawl" },
    { name: "Untouchable", minDots: 1, maxDots: 1, description: "Your character commits crimes and is always a step ahead of pursuers. Because of his methodical planning, any roll to investigate him suffers the Incomplete Clue tag unless it achieves exceptional success." },
    { name: "Vice-Ridden", minDots: 2, maxDots: 2, description: "Your character is one of the worst examples of humanity in the Chronicles of Darkness. He has two Vices, although he may still only regain one Willpower per scene he indulges himself." },
    { name: "Virtuous", maxDots: 2, description: "Your character is a light of good in the Chronicles of Darkness. She has two Virtues. The limitations of how many times she may refresh Willpower using a Virtue remain the same, but it’s up to you which Virtue she uses each time." }
];

// Ceremonies - Krewe rituals that Sin-Eaters can learn
// Data from official Geist: The Sin-Eaters 2nd Edition
export const CEREMONY_LIST = [
    // 1-dot Ceremonies
    { 
        name: "Dead Man's Camera", 
        dots: 1, 
        duration: "Permanent (only film in camera when performed)",
        subject: "One camera and its film. Digital and video tape cameras don't work.",
        dicePool: "Intelligence + Science",
        success: "The camera takes photos normally, no matter how damaged. When the film is developed, objects and entities in Twilight are visible in the photos."
    },
    { 
        name: "Death Watch", 
        dots: 1, 
        duration: "As long as ritualist maintains physical contact",
        subject: "One being the ritualist can touch",
        dicePool: "Stamina + Medicine",
        success: "Time ceases to pass for the subject's body. She does not bleed out or risk losing consciousness due to injuries, doesn't age, doesn't get hungrier or thirstier, and doesn't suffer ongoing damage from suffocation. She also does not heal damage or Tilts, and cannot resolve physical Conditions."
    },
    { 
        name: "The Diviner's Jawbone", 
        dots: 1, 
        duration: "One week",
        subject: "One skull, human or animal",
        dicePool: "Wits + Empathy",
        success: "As long as you can consult the skull, you gain the benefits of the Common-Sense Merit."
    },
    { 
        name: "Ishtar's Perfume", 
        dots: 1, 
        duration: "Instant",
        subject: "One corpse, or at least the eyes thereof",
        dicePool: "Presence + Occult",
        success: "The Sin-Eater sees the last minute of the corpse's life. She sees everything as the corpse saw it, but only gains its sight: she cannot hear, feel, smell, or taste anything during the vision."
    },
    { 
        name: "Lovers' Telephone", 
        dots: 1, 
        duration: "One phone call",
        subject: "One person whose name you know",
        dicePool: "Manipulation + Computers",
        success: "Your phone call connects to the nearest phone to the subject, even if disconnected or never functional (e.g. a child's toy phone or a Plasmic memory of a phone in the Underworld). If the subject is a ghost, they can answer even if the phone isn't in Twilight."
    },
    // 2-dot Ceremonies
    { 
        name: "Crow Girl Kiss", 
        dots: 2, 
        duration: "Permanent (but see description)",
        subject: "One person suffering from a deleterious supernatural effect",
        dicePool: "Manipulation + Expression vs. the dice pool that created the curse",
        success: "The curse is lifted, its magic transferred into a feather or similar talisman. If the talisman is ever destroyed, the effect returns in full force, continuing from when this Ceremony was performed."
    },
    { 
        name: "Gifts of Persephone", 
        dots: 2, 
        duration: "Story",
        subject: "Self",
        dicePool: "Wits + Craft",
        success: "Gain the Informed Condition related to something in the Underworld that will help you overcome a specific obstacle."
    },
    { 
        name: "Ghost Trap", 
        dots: 2, 
        duration: "One week",
        subject: "A ritual object designed to catch spirits or trap magical effects",
        dicePool: "Manipulation + Subterfuge",
        success: "Any ghost within 10 yards must succeed on Resistance + Rank or become fascinated, gaining the Ban 'Must stop everything to stare at the ghost trap.' Blocking line of sight removes the Ban; destroying the trap ends the ceremony. The Absent may spend 1 Willpower to replace the Ban with the Obsessed Condition."
    },
    { 
        name: "Skeleton Key", 
        dots: 2, 
        duration: "Permanent",
        subject: "One key",
        dicePool: "Resolve + Investigation",
        success: "The key opens the first lock it's used on, even if it shouldn't fit—including electronic locks. The magic is permanent: the Skeleton Key will always open that lock. Attempts to copy the key automatically fail."
    },
    // 3-dot Ceremonies
    { 
        name: "Bestow Regalia", 
        dots: 3, 
        duration: "One chapter or until resolved",
        subject: "One celebrant of the ritualist's krewe",
        dicePool: "Presence + Occult",
        success: "The subject gains the relevant Regalia Condition."
    },
    { 
        name: "Black Cat's Crossing", 
        dots: 3, 
        duration: "Until the next new or full moon",
        subject: "One being (living or dead) OR a location no larger than a small home",
        dicePool: "Intelligence + Intimidation vs. Resolve + Synergy",
        success: "If targeting an individual: they gain a Ban (like a Rank 2 ghost's) determined by the ritualist. Must be physically possible; subject may spend 1 Willpower to suppress for one action. If targeting a location: define a category of beings who treat 'Cannot enter the location' as a Ban. They may spend 1 Willpower to suppress for (Resolve) turns."
    },
    { 
        name: "Bloody Codex", 
        dots: 3, 
        duration: "Permanent",
        subject: "One book, tablet, scroll—anything that can be written on",
        dicePool: "Wits + Investigation",
        success: "Anyone who presses a bloody thumbprint to a page finds their surface thoughts recorded there, appearing and disappearing as their minds wander. Tearing out a page (or deleting the file) ends the effect for that person."
    },
    { 
        name: "Dumb Supper", 
        dots: 3, 
        duration: "5 days",
        subject: "Up to 13 individuals",
        dicePool: "Stamina + Expression",
        success: "A phantasmal feast appears for all participants, living or dead. The living completely refill their Willpower. The dead need not spend Essence to remain active for three days and do not suffer Essence Bleed during that time."
    },
    { 
        name: "Krewe Binding", 
        dots: 3, 
        duration: "Permanent",
        subject: "Any number of willing participants",
        dicePool: "Presence + Manipulation",
        success: "All participants without dots in the krewe's Mystery Cult Initiation Merit gain one dot free. If creating a new krewe, design the Merit first. Alternately, revoke a celebrant's membership—they keep their dots but lose access to benefits relying on krewe goodwill or shared resources."
    },
    { 
        name: "Speaker for the Dead", 
        dots: 3, 
        duration: "One scene",
        subject: "One ghost within earshot",
        dicePool: "Stamina + Composure",
        success: "The target ghost can speak through your mouth for as long as you allow it. Your voice is recognizably that of the target ghost."
    },
    // 4-dot Ceremonies
    { 
        name: "Forge Anchor", 
        dots: 4, 
        duration: "Permanent",
        subject: "One ghost and an object or being that will become an Anchor",
        dicePool: "Resolve + Persuasion – ghost's Rank (vs. Resolve + Rank if unwilling)",
        success: "The subject ghost gains the object or being as an Anchor."
    },
    { 
        name: "Maggot Homunculus", 
        dots: 4, 
        duration: "Scene",
        subject: "One ghost, who may be in a different world from the ritualist",
        dicePool: "Presence + Occult (vs. Resistance + Rank if unwilling)",
        success: "Maggots boil up from the ground, swarming into a roughly humanoid shape. The subject ghost is drawn from wherever it may be to inhabit the maggot homunculus (as the Materialize Manifestation). When the Ceremony ends, the ghost returns to where it was summoned from."
    },
    // 5-dot Ceremonies
    { 
        name: "Ghost Binding", 
        dots: 5, 
        duration: "Permanent until the object is destroyed",
        subject: "An object with the Anchor Condition",
        dicePool: "Composure + Intimidation vs. Power + Resistance",
        success: "The ghost is bound into her Anchor in hibernation. The Anchor becomes a Memento. If the ghost had an innate Key, the Memento has that Key; otherwise determined by the Storyteller based on the ghost's death and Influences."
    },
    { 
        name: "Pass On", 
        dots: 5, 
        duration: "Instant",
        subject: "One ghost that has resolved all of its Anchors",
        dicePool: "Manipulation + Empathy",
        success: "The ghost passes on, leaving behind an afterimage evocative of their life—often pleasant with a sense of closure, but occasionally a noxious gas or ear-splitting scream. Any Sin-Eaters present regain all spent Plasm."
    },
    { 
        name: "Persephone's Return", 
        dots: 5, 
        duration: "Gate remains open for 13 minutes",
        subject: "Creates an Avernian Gate at ritualist's location",
        dicePool: "Stamina + Occult",
        success: "With a thunderous crash, the earth splits open and creates a new Avernian Gate. The Gate is open when created and remains so for 13 minutes. This ritual does not give control over where the other side appears."
    },
];

export const ATTRIBUTE_LIST = [
    "intelligence", "wits", "resolve",
    "strength", "dexterity", "stamina",
    "presence", "manipulation", "composure"
];

export const SKILL_LIST = [
    "academics", "computer", "crafts", "investigation", "medicine", "occult", "politics", "science",
    "athletics", "brawl", "drive", "firearms", "larceny", "stealth", "survival", "weaponry",
    "animal_ken", "empathy", "expression", "intimidation", "persuasion", "socialize", "streetwise", "subterfuge"
];

// Ceremony definitions (used for click-to-roll on Character page)
export const CEREMONY_DEFINITIONS = {
    "Death Watch": { dicePool: "Stamina + Medicine" },
    "Ishtar's Perfume": { dicePool: "Presence + Occult" },
    "Lovers' Telephone": { dicePool: "Manipulation + Computers" },
    "Speaker for the Dead": { dicePool: "Stamina + Composure" },
    "Pass On": { dicePool: "Manipulation + Empathy" },
};

// Map ceremony dice-pool skill labels to your internal SKILL_LIST keys
export const CEREMONY_SKILL_KEY_MAP = {
    "Medicine": "medicine",
    "Occult": "occult",
    "Empathy": "empathy",
    "Composure": "composure", // NOTE: Composure is an Attribute, not a Skill (handled below)
    "Computers": "computer",
    "Computer": "computer",
};

export const KEY_UNLOCK_ATTRIBUTES = {
    "Beasts": "wits",
    "Blood": "presence",
    "Chance": "dexterity",
    "Cold Wind": "resolve",
    "Deep Waters": "manipulation",
    "Disease": "stamina",
    "Grave Dirt": "strength",
    "Pyre Flame": "intelligence",
    "Stillness": "composure",
};



// =====================
// MAGE: THE AWAKENING DATA
// =====================

export const ARCANA = [
    "Death", "Fate", "Forces", "Life", "Matter",
    "Mind", "Prime", "Space", "Spirit", "Time"
];

// Attainments are automatically gained at specific Arcanum dot levels
export const MAGE_ATTAINMENTS = {
    "Death": {
        1: "Deathsight",
        2: "Soul Jar",
        3: "Cold Embrace",
        4: "Withstand Death",
        5: "Open Avernian Gate"
    },
    "Fate": {
        1: "Conditional Duration",
        2: "Nimbus Tuning",
        3: "Sever Oaths",
        4: "Unbound Fate",
        5: "Forge Destiny"
    },
    "Forces": {
        1: "Kinetic Efficiency",
        2: "Precise Force",
        3: "Optimize Machine",
        4: "Environmental Immunity",
        5: "Control Weather"
    },
    "Life": {
        1: "Improved Pattern Restoration",
        2: "Mutable Body",
        3: "Self-Healing",
        4: "Body Mastery",
        5: "Regeneration"
    },
    "Matter": {
        1: "Matter Sight",
        2: "Conjunctional Transmutation",
        3: "Durability Control",
        4: "Destroy Object",
        5: "Self-Repairing Apparatus"
    },
    "Mind": {
        1: "Mind's Eye",
        2: "Memory Palace",
        3: "Telepathy",
        4: "Psychological Immunity",
        5: "Network Mind"
    },
    "Prime": {
        1: "Mage Sight",
        2: "Imbue Item",
        3: "Channel Mana",
        4: "Supernal Sanctum",
        5: "Apocalypse"
    },
    "Space": {
        1: "Spatial Awareness",
        2: "Break Boundary",
        3: "Co-Location",
        4: "Ban",
        5: "Pocket Realm"
    },
    "Spirit": {
        1: "Spirit Sight",
        2: "Spirit Touch",
        3: "Reaching",
        4: "Spirit Gate",
        5: "Spirit Dominion"
    },
    "Time": {
        1: "Temporal Sympathy",
        2: "Immediate Reaction",
        3: "Prepared Spell",
        4: "Time Lock",
        5: "Prophecy"
    }
};

// Gnosis table (similar to Synergy for Mages)
export const GNOSIS_TABLE = {
    1: { maxMana: 10, perTurn: 1, traitMax: 5, ritualInterval: "3 hours", combinedSpells: 1, paradoxDie: 1, highestArcanum: "3 or less", otherArcana: "2 or less", yantras: 2 },
    2: { maxMana: 11, perTurn: 2, traitMax: 5, ritualInterval: "3 hours", combinedSpells: 1, paradoxDie: 1, highestArcanum: "3 or less", otherArcana: "2 or less", yantras: 2 },
    3: { maxMana: 12, perTurn: 3, traitMax: 5, ritualInterval: "1 hour", combinedSpells: 2, paradoxDie: 2, highestArcanum: "4 or less", otherArcana: "3 or less", yantras: 3 },
    4: { maxMana: 13, perTurn: 4, traitMax: 5, ritualInterval: "1 hour", combinedSpells: 2, paradoxDie: 2, highestArcanum: "4 or less", otherArcana: "3 or less", yantras: 3 },
    5: { maxMana: 15, perTurn: 5, traitMax: 5, ritualInterval: "30 min", combinedSpells: 2, paradoxDie: 3, highestArcanum: "5 or less", otherArcana: "4 or less", yantras: 4 },
    6: { maxMana: 20, perTurn: 6, traitMax: 6, ritualInterval: "30 min", combinedSpells: 3, paradoxDie: 3, highestArcanum: 5, otherArcana: 5, yantras: 4 },
    7: { maxMana: 25, perTurn: 7, traitMax: 7, ritualInterval: "10 min", combinedSpells: 3, paradoxDie: 4, highestArcanum: 5, otherArcana: 5, yantras: 5 },
    8: { maxMana: 30, perTurn: 8, traitMax: 8, ritualInterval: "10 min", combinedSpells: 3, paradoxDie: 4, highestArcanum: 5, otherArcana: 5, yantras: 5 },
    9: { maxMana: 50, perTurn: 10, traitMax: 9, ritualInterval: "1 min", combinedSpells: 4, paradoxDie: 5, highestArcanum: 5, otherArcana: 5, yantras: 6 },
    10: { maxMana: 75, perTurn: 15, traitMax: 10, ritualInterval: "1 turn", combinedSpells: 5, paradoxDie: 5, highestArcanum: 5, otherArcana: 5, yantras: 7 }
};

// Mage Paths
export const MAGE_PATHS = [
    "Acanthus",
    "Mastigos", 
    "Moros",
    "Obrimos",
    "Thyrsus"
];

// Mage Orders
export const MAGE_ORDERS = [
    "Adamantine Arrow",
    "Guardians of the Veil",
    "Mysterium",
    "Silver Ladder",
    "Free Council"
];
