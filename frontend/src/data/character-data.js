
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
    name: "Cold Weather Gear",
    category: "Physical",
    availability: 0,
    bonus: 0,
    durability: 1,
    size: 2,
    structure: 3,
    protection: "cold_weather",
    effect: "Insulated cold-weather clothing. When worn, this marks the character as using Cold Weather Gear. The Storyteller decides whether it is adequate for the conditions. No automatic dice bonus.",
  },
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
  // Additional premade Equipment from CofD 2e Appendix One (pp. 270-277).
  // Mage: The Awakening 2e (pp. 225-227) reprints a subset.
  // Numeric zero is used where the book states N/A for nonphysical or consumable gear.
  {
    name: "Cache (Concealed, Improved)",
    category: "Mental",
    availability: 2,
    bonus: 2,
    durability: 2,
    size: 2,
    structure: 5,
    effect: "Concealed storage; +2 to concealment and -2 to attempts to find its contents. Maximum cache Size is half its containing object."
  },
  {
    name: "Cache (Concealed, Superior)",
    category: "Mental",
    availability: 3,
    bonus: 3,
    durability: 2,
    size: 3,
    structure: 5,
    effect: "Concealed storage; +3 to concealment and -3 to attempts to find its contents. Maximum cache Size is half its containing object."
  },
  {
    name: "Code Kit",
    category: "Mental",
    availability: 1,
    bonus: 5,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "A shared cipher reference; imposes a -5 penalty on attempts to decode messages without the key. The +5 is a defensive rating, not a bonus to codebreaking."
  },
  {
    name: "Cracking Software",
    category: "Mental",
    availability: 3,
    bonus: 2,
    durability: 0,
    size: 0,
    structure: 0,
    effect: "Adds +2 to relevant hacking rolls; tracing the user requires separate steps to discover and attribute the software. Nonphysical: physical statistics N/A."
  },
  {
    name: "Digital Recorder (Advanced)",
    category: "Mental",
    availability: 2,
    bonus: 2,
    durability: 1,
    size: 1,
    structure: 2,
    effect: "+2 to recording or concealing audio, and relevant attempts to distinguish recorded sound."
  },
  {
    name: "Digital Recorder (Basic)",
    category: "Mental",
    availability: 1,
    bonus: 1,
    durability: 1,
    size: 1,
    structure: 2,
    effect: "+1 to recording or concealing audio, and relevant attempts to distinguish recorded sound."
  },
  {
    name: "Duct Tape",
    category: "Mental",
    availability: 1,
    bonus: 1,
    durability: 1,
    size: 1,
    structure: 2,
    effect: "+1 to suitable improvised repairs or related Crafts rolls; alternatively reinforce an object. Applied restraints penalize escape rolls."
  },
  {
    name: "First-Aid Kit (Advanced)",
    category: "Mental",
    availability: 2,
    bonus: 1,
    durability: 1,
    size: 2,
    structure: 3,
    effect: "Enables basic stabilization and treatment; +1 to relevant treatment rolls."
  },
  {
    name: "First-Aid Kit (Basic)",
    category: "Mental",
    availability: 1,
    bonus: 0,
    durability: 1,
    size: 2,
    structure: 3,
    effect: "Enables basic stabilization and treatment where medical supplies are required; no equipment dice bonus."
  },
  {
    name: "Flashlight",
    category: "Mental",
    availability: 1,
    bonus: 1,
    durability: 2,
    size: 1,
    structure: 3,
    effect: "Offsets one die of darkness penalties or adds +1 to searches in darkness. Can briefly dazzle an opponent."
  },
  {
    name: "Glowstick",
    category: "Mental",
    availability: 1,
    bonus: 2,
    durability: 1,
    size: 1,
    structure: 1,
    effect: "Portable chemical light for low-light operations; functions in water and rain, but cannot blind an opponent."
  },
  {
    name: "GPS Tracker",
    category: "Mental",
    availability: 2,
    bonus: 3,
    durability: 2,
    size: 2,
    structure: 2,
    effect: "Helps follow a GPS-equipped target or share locations. Tracking fails where suitable signals are unavailable."
  },
  {
    name: "Keylogging Software",
    category: "Mental",
    availability: 2,
    bonus: 2,
    durability: 0,
    size: 0,
    structure: 0,
    effect: "+2 to pertinent attempts to obtain data by capturing keystrokes. Requires a way to install the software. Nonphysical: physical statistics N/A."
  },
  {
    name: "Luminol",
    category: "Mental",
    availability: 1,
    bonus: 2,
    durability: 0,
    size: 1,
    structure: 1,
    effect: "+2 to finding traces of bodily fluids and reconstructing or tracking a bloody incident."
  },
  {
    name: "Multi-Tool",
    category: "Mental",
    availability: 1,
    bonus: 1,
    durability: 3,
    size: 1,
    structure: 4,
    effect: "+1 to various small-tool tasks, and may permit Craft rolls that would otherwise lack the required tools."
  },
  {
    name: "Personal Computer (Availability 1)",
    category: "Mental",
    availability: 1,
    bonus: 1,
    durability: 2,
    size: 3,
    structure: 2,
    effect: "+1 to applicable Computer rolls; higher Availability represents a more capable machine."
  },
  {
    name: "Personal Computer (Availability 2)",
    category: "Mental",
    availability: 2,
    bonus: 2,
    durability: 2,
    size: 3,
    structure: 2,
    effect: "+2 to applicable Computer rolls; higher Availability represents a more capable machine."
  },
  {
    name: "Personal Computer (Availability 3)",
    category: "Mental",
    availability: 3,
    bonus: 3,
    durability: 2,
    size: 3,
    structure: 2,
    effect: "+3 to applicable Computer rolls; higher Availability represents a more capable machine."
  },
  {
    name: "Personal Computer (Availability 4)",
    category: "Mental",
    availability: 4,
    bonus: 4,
    durability: 2,
    size: 3,
    structure: 2,
    effect: "+4 to applicable Computer rolls; higher Availability represents a more capable machine."
  },
  {
    name: "Smartphone (Advanced)",
    category: "Mental",
    availability: 3,
    bonus: 2,
    durability: 2,
    size: 1,
    structure: 1,
    effect: "+2 to applicable mobile-computing tasks; represents a more capable handset and software."
  },
  {
    name: "Smartphone (Basic)",
    category: "Mental",
    availability: 1,
    bonus: 1,
    durability: 2,
    size: 1,
    structure: 1,
    effect: "+1 to applicable mobile-computing tasks; includes ordinary calling, camera, navigation and online access."
  },
  {
    name: "Special Effects",
    category: "Mental",
    availability: 3,
    bonus: 2,
    durability: 2,
    size: 5,
    structure: 3,
    effect: "+2 to relevant staged illusions, distractions and theatrical tricks; may initially deceive an unwary observer."
  },
  {
    name: "Surveillance Equipment",
    category: "Mental",
    availability: 3,
    bonus: 2,
    durability: 2,
    size: 2,
    structure: 2,
    effect: "+2 to relevant installation or surveillance contests. Unwary intruders are recorded unless they actively evade the equipment."
  },
  {
    name: "Survival Gear (Advanced)",
    category: "Mental",
    availability: 3,
    bonus: 2,
    durability: 2,
    size: 3,
    structure: 3,
    effect: "+2 to relevant Survival rolls; lowers a suitable environment by two levels, but not a level-four hazard. Specify environment."
  },
  {
    name: "Survival Gear (Basic)",
    category: "Mental",
    availability: 1,
    bonus: 1,
    durability: 2,
    size: 2,
    structure: 3,
    effect: "+1 to relevant Survival rolls; lowers effective environmental severity by one level, subject to the rules."
  },
  {
    name: "Talcum Powder",
    category: "Mental",
    availability: 1,
    bonus: 2,
    durability: 0,
    size: 1,
    structure: 0,
    effect: "Reveals footprints or other signs of passage. Entering a treated area without traces requires five Stealth successes. Consumable: some physical statistics N/A."
  },
  {
    name: "Ultraviolet Ink",
    category: "Mental",
    availability: 1,
    bonus: 2,
    durability: 1,
    size: 1,
    structure: 2,
    effect: "Conceals written messages or markers that are visible under ultraviolet illumination."
  },
  {
    name: "Battering Ram",
    category: "Physical",
    availability: 2,
    bonus: 4,
    durability: 3,
    size: 4,
    structure: 8,
    effect: "+4 to a coordinated attempt to break a barrier, with up to four participants; ignores two points of Durability."
  },
  {
    name: "Bear Trap",
    category: "Physical",
    availability: 2,
    bonus: 2,
    durability: 3,
    size: 2,
    structure: 5,
    effect: "A sprung trap inflicts three lethal damage, ignoring two points of armor or Durability. Its rating hinders escape and concealment."
  },
  {
    name: "Caltrops",
    category: "Physical",
    availability: 2,
    bonus: 2,
    durability: 2,
    size: 2,
    structure: 3,
    effect: "A spread of sharp caltrops impedes passage and may inflict one lethal damage. Avoidance requires an Athletics roll."
  },
  {
    name: "Camouflage Clothing",
    category: "Physical",
    availability: 2,
    bonus: 2,
    durability: 1,
    size: 2,
    structure: 3,
    effect: "+2 to remaining unnoticed when the pattern suits the environment."
  },
  {
    name: "Climbing Gear",
    category: "Physical",
    availability: 2,
    bonus: 2,
    durability: 3,
    size: 2,
    structure: 2,
    effect: "+2 to climbing rolls; proper rigging can arrest a fall at short intervals."
  },
  {
    name: "Crowbar",
    category: "Physical",
    availability: 1,
    bonus: 2,
    durability: 3,
    size: 2,
    structure: 4,
    effect: "+2 when applying leverage; ignores two points of Durability while prying."
  },
  {
    name: "Firearm Suppressor",
    category: "Physical",
    availability: 2,
    bonus: 2,
    durability: 2,
    size: 1,
    structure: 2,
    effect: "When used with a compatible firearm, may grant +2 at short range while reducing the weapon damage rating by one. Also conceals the shot."
  },
  {
    name: "Gas Mask",
    category: "Physical",
    availability: 2,
    bonus: 5,
    durability: 1,
    size: 2,
    structure: 3,
    effect: "+5 to resisting dangerous airborne toxins; filters less potent airborne hazards."
  },
  {
    name: "Handcuffs",
    category: "Physical",
    availability: 1,
    bonus: 2,
    durability: 4,
    size: 1,
    structure: 4,
    effect: "Restrains a target after successful application. Escape attempts face substantial penalties and may cause injury."
  },
  {
    name: "Lockpicking Kit (Portable)",
    category: "Physical",
    availability: 1,
    bonus: 1,
    durability: 2,
    size: 1,
    structure: 1,
    effect: "+1 to mechanical lockpicking rolls; does not permit automatic opening even with plenty of time."
  },
  {
    name: "Lockpicking Kit (Standard)",
    category: "Physical",
    availability: 2,
    bonus: 2,
    durability: 2,
    size: 2,
    structure: 2,
    effect: "+2 to mechanical lockpicking under time pressure; skilled users may open common locks without a roll when time permits."
  },
  {
    name: "Night Vision Goggles",
    category: "Physical",
    availability: 2,
    bonus: 2,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "Amplifies dim light to avoid acting-blind penalties; sudden bright lights can temporarily blind the user."
  },
  {
    name: "Pepper Spray",
    category: "Physical",
    availability: 1,
    bonus: 1,
    durability: 2,
    size: 1,
    structure: 1,
    effect: "Short-ranged chemical spray: a successful attack imposes the Stun Tilt and a severe penalty until the eyes are rinsed."
  },
  {
    name: "Rope",
    category: "Physical",
    availability: 1,
    bonus: 1,
    durability: 2,
    size: 3,
    structure: 2,
    effect: "+1 to relevant rigging and Crafts rolls; strong knots resist breaking according to the user's Crafts rating."
  },
  {
    name: "Stun Gun (Handheld, Rating 1)",
    category: "Physical",
    availability: 1,
    bonus: 0,
    durability: 2,
    size: 1,
    structure: 2,
    effect: "Handheld electrical device, rating one. Requires close combat contact; successful use harms and impairs the target."
  },
  {
    name: "Stun Gun (Handheld, Rating 2)",
    category: "Physical",
    availability: 2,
    bonus: 0,
    durability: 2,
    size: 1,
    structure: 2,
    effect: "Handheld electrical device, rating two. Requires close combat contact; successful use harms and impairs the target."
  },
  {
    name: "Stun Gun (Handheld, Rating 3)",
    category: "Physical",
    availability: 3,
    bonus: 0,
    durability: 2,
    size: 1,
    structure: 2,
    effect: "Handheld electrical device, rating three. Requires close combat contact; successful use harms and impairs the target."
  },
  {
    name: "Stun Gun (Ranged, Rating 1)",
    category: "Physical",
    availability: 1,
    bonus: 0,
    durability: 2,
    size: 1,
    structure: 2,
    effect: "Ranged electrical device, rating one. Fires wired darts and may maintain an electrical effect while attached."
  },
  {
    name: "Stun Gun (Ranged, Rating 2)",
    category: "Physical",
    availability: 2,
    bonus: 0,
    durability: 2,
    size: 1,
    structure: 2,
    effect: "Ranged electrical device, rating two. Fires wired darts and may maintain an electrical effect while attached."
  },
  {
    name: "Stun Gun (Ranged, Rating 3)",
    category: "Physical",
    availability: 3,
    bonus: 0,
    durability: 2,
    size: 1,
    structure: 2,
    effect: "Ranged electrical device, rating three. Fires wired darts and may maintain an electrical effect while attached."
  },
  {
    name: "Cash (Availability 1)",
    category: "Social",
    availability: 1,
    bonus: 1,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "A one-off amount of money, not ongoing Resources. May be spent for a +1 bribe bonus or an item of comparable Availability."
  },
  {
    name: "Cash (Availability 2)",
    category: "Social",
    availability: 2,
    bonus: 2,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "A one-off amount of money, not ongoing Resources. May be spent for a +2 bribe bonus or an item of comparable Availability."
  },
  {
    name: "Cash (Availability 3)",
    category: "Social",
    availability: 3,
    bonus: 3,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "A one-off amount of money, not ongoing Resources. May be spent for a +3 bribe bonus or an item of comparable Availability."
  },
  {
    name: "Cash (Availability 4)",
    category: "Social",
    availability: 4,
    bonus: 4,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "A one-off amount of money, not ongoing Resources. May be spent for a +4 bribe bonus or an item of comparable Availability."
  },
  {
    name: "Cash (Availability 5)",
    category: "Social",
    availability: 5,
    bonus: 5,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "A one-off amount of money, not ongoing Resources. May be spent for a +5 bribe bonus or an item of comparable Availability."
  },
  {
    name: "Disguise (Availability 1)",
    category: "Social",
    availability: 1,
    bonus: 1,
    durability: 1,
    size: 3,
    structure: 2,
    effect: "Helps blend into an appropriate social group; +1 to remain concealed or as a penalty to active identification."
  },
  {
    name: "Disguise (Availability 2)",
    category: "Social",
    availability: 2,
    bonus: 2,
    durability: 1,
    size: 3,
    structure: 2,
    effect: "Helps blend into an appropriate social group; +2 to remain concealed or as a penalty to active identification."
  },
  {
    name: "Disguise (Availability 3)",
    category: "Social",
    availability: 3,
    bonus: 3,
    durability: 1,
    size: 3,
    structure: 2,
    effect: "Helps blend into an appropriate social group; +3 to remain concealed or as a penalty to active identification."
  },
  {
    name: "Fashion (Availability 1)",
    category: "Social",
    availability: 1,
    bonus: 1,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "Appropriate clothing provides +1 to relevant Social rolls; unsuitable clothing imposes a matching penalty."
  },
  {
    name: "Fashion (Availability 2)",
    category: "Social",
    availability: 2,
    bonus: 1,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "Appropriate clothing provides +1 to relevant Social rolls; unsuitable clothing imposes a matching penalty."
  },
  {
    name: "Fashion (Availability 3)",
    category: "Social",
    availability: 3,
    bonus: 2,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "Appropriate clothing provides +2 to relevant Social rolls; unsuitable clothing imposes a matching penalty."
  },
  {
    name: "Fashion (Availability 4)",
    category: "Social",
    availability: 4,
    bonus: 2,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "Appropriate clothing provides +2 to relevant Social rolls; unsuitable clothing imposes a matching penalty."
  },
  {
    name: "Fashion (Availability 5)",
    category: "Social",
    availability: 5,
    bonus: 3,
    durability: 1,
    size: 2,
    structure: 1,
    effect: "Appropriate clothing provides +3 to relevant Social rolls; unsuitable clothing imposes a matching penalty."
  },
].sort((a, b) => a.name.localeCompare(b.name));

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
  {
    "name": "Adamant Hand",
    "minDots": 2,
    "maxDots": 2,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Athletics, Brawl or Weaponry",
    "description": "Choose a qualifying Athletics, Brawl, or Weaponry fighting style. You can incorporate that style into instant spellcasting as a reflexive Order-tool Yantra, using its action and timing restrictions; the Skill and Order prerequisites still apply.",
    "requirements": "Adamantine Arrow Status 1; chosen Athletics, Brawl or Weaponry Skill at 3+ dots.",
    "source_citation": "Mage: The Awakening 2e, p. 100"
  },
  {
    "name": "Advanced Library",
    "minDots": 1,
    "maxDots": 5,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Topics",
    "description": "Choose one restricted supernatural topic per dot. Consulting your library once per topic per story grants the Informed Condition for that topic; Informed upgrades a qualifying roll result rather than giving a standing bonus.",
    "requirements": "Library 3; Safe Place rating at least equal to Advanced Library rating.",
    "source_citation": "Mage: The Awakening 2e, p. 105"
  },
  {
    "name": "Allies",
    "maxDots": 5,
    "description": "Choose a group or person with whom you have influence. Once per session you can ask for a favor within the Allies rating; greater favors require a Social roll and may create obligations. Buy separate instances for separate groups."
  },
  {
    "name": "Alternate Identity",
    "maxDots": 3,
    "description": "Maintain a cover identity. At 1 dot it is an informal alias; at 2 dots it has credible supporting records; at 3 dots it can withstand thorough investigation. The Merit does not make you physically unrecognizable."
  },
  {
    "name": "Ambidextrous",
    "minDots": 3,
    "maxDots": 3,
    "description": "Ignore the usual off-hand penalty when using your non-dominant hand, including in combat. It does not grant an extra action or remove penalties from wielding two weapons simultaneously."
  },
  {
    "name": "Anonymity",
    "maxDots": 5,
    "description": "Subtract Anonymity dots from attempts to identify or locate you through records or witnesses because you keep a minimal public footprint. This conflicts with Fame.",
    "requirements": "Cannot be combined with Fame.",
    "source_citation": "Chronicles of Darkness 2e, p. 50"
  },
  {
    "name": "Architect",
    "maxDots": 5,
    "description": "During an extended action to build a lasting work or relationship important to you, distribute bonus dice equal to your Merit dots across its rolls. Rolls receiving these dice have 8-again."
  },
  {
    "name": "Area of Expertise",
    "minDots": 1,
    "maxDots": 1,
    "description": "Choose an existing Skill Specialty. Whenever it applies, its bonus increases from +1 die to +2 dice; it does not grant the whole Skill or apply outside that Specialty."
  },
  {
    "name": "Armed Defense",
    "maxDots": 5,
    "description": "Defensive weapon style: at 1 dot lessen multi-attacker penalties when Dodging; at 2 disarm an attacker who misses against your Defense; at 3 spend Willpower to injure an attacker while Dodging; at 4 exchange weapon damage for Defense; at 5 spend Willpower to counterattack after successfully Dodging. Some maneuvers cannot be combined."
  },
  {
    "name": "Artifact",
    "minDots": 3,
    "maxDots": 10,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Artifact",
    "description": "Own a Supernal item that casts its built-in effects using its own effective Gnosis, Arcana and Mana supply. Dot cost reflects the strongest Arcanum, additional effects and Attainments; an Artifact is not an unrestricted spell list."
  },
  {
    "name": "Astral Adept",
    "minDots": 3,
    "maxDots": 3,
    "description": "Enter the Astral Realms without visiting a dedicated place of power. Perform the personal ceremony, spend the required Willpower and meditate to begin astral travel."
  },
  {
    "name": "Automotive Genius",
    "minDots": 1,
    "maxDots": 1,
    "description": "When customizing a vehicle, calculate the number of allowed modifications using three times Crafts rather than twice Crafts, with additional capacity for relevant Crafts Specialties."
  },
  {
    "name": "Barfly",
    "maxDots": 2,
    "description": "Move naturally through social venues, avoiding routine rolls to appear as though you belong. People trying to spot you as an outsider suffer a penalty equal to your Socialize rating.",
    "minDots": 2,
    "allowedDots": [
      2
    ],
    "requirements": "Socialize 2.",
    "source_citation": "Chronicles of Darkness 2e, p. 50"
  },
  {
    "name": "Between the Ticks",
    "minDots": 2,
    "maxDots": 2,
    "description": "Once per scene, exchange one point of Initiative for one die on an action that turn, or sacrifice one action die to increase Initiative by one. This is a trade, not a free bonus."
  },
  {
    "name": "Cabal Theme",
    "minDots": 1,
    "maxDots": 1,
    "description": "Cabal members sharing this Merit count as having one additional Shadow Name dot for persona-Yantra purposes, even if it exceeds the normal Shadow Name limit. It does not add a real Merit dot to each character."
  },
  {
    "name": "Cenote",
    "maxDots": 5,
    "description": "Maintain access to a haunted locale that produces Plasm equal to Cenote dots per chapter. The location must be represented by an appropriate Safe Place; record where the Plasm is stored or obtained."
  },
  {
    "name": "Cheap Shot",
    "minDots": 2,
    "maxDots": 2,
    "description": "Reflexively distract a foe in combat: contest Dexterity + Subterfuge against Wits + Composure. If you win, they lose Defense on their next turn; repeated tricks in the scene incur a cumulative penalty."
  },
  {
    "name": "Choke Hold",
    "minDots": 2,
    "maxDots": 2,
    "description": "While grappling and holding someone, use the Choke maneuver. Accumulated successes beyond the target's threshold, based on Stamina, can render them unconscious for a period determined by their Stamina."
  },
  {
    "name": "Close Quarters Combat",
    "maxDots": 5,
    "description": "Close-range fighting style: 1 dot lets you reposition into cover against gunfire; 2 lets you inflict lethal damage by smashing a grappled target into a surface; 3 exploits an armored foe's armor in a grapple; 4 improves close-combat ambushes; 5 upgrades disarm results."
  },
  {
    "name": "Closed Book",
    "maxDots": 5,
    "description": "Increase the number of Doors required to influence you through Social Maneuvering by this Merit's dots. Add the same rating to contested Social rolls when someone tries to discover your actual feelings, motives or intentions.",
    "requirements": "Manipulation 3 and Resolve 3.",
    "source_citation": "Chronicles of Darkness 2e, p. 50"
  },
  {
    "name": "Common Sense",
    "minDots": 3,
    "maxDots": 3,
    "description": "Once per chapter, roll Wits + Composure to ask the Storyteller for a useful assessment of a proposed action. A success supplies a meaningful answer; an exceptional success allows another question."
  },
  {
    "name": "Consilium/Order Status",
    "minDots": 1,
    "maxDots": 5,
    "description": "Represent your influence and obligations within a local Consilium or Order Caucus. The rating determines access to political support, privileges, protected resources and requisitions under the relevant organization's rules."
  },
  {
    "name": "Contacts",
    "maxDots": 5,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Sphere or source",
    "description": "Choose one information network or sphere per dot. Contacts supply leads and information, not free services or material favors; those usually require Allies, Retainer or another Merit."
  },
  {
    "name": "Crack Driver",
    "maxDots": 3,
    "description": "When you concentrate on driving, add Composure to Drive rolls and subtract it from attempts to disable your moving vehicle. At 3 dots, one Drive action each turn can be reflexive.",
    "minDots": 2,
    "allowedDots": [
      2,
      3
    ],
    "requirements": "Drive 3.",
    "source_citation": "Chronicles of Darkness 2e, p. 47"
  },
  {
    "name": "Danger Sense",
    "minDots": 2,
    "maxDots": 2,
    "description": "Add +2 dice to reflexive Wits + Composure rolls to detect impending ambushes or comparable immediate danger before it occurs."
  },
  {
    "name": "Defensive Combat",
    "minDots": 1,
    "maxDots": 1,
    "description": "Choose Brawl or Weaponry. When equipped to use that Skill, substitute it for Athletics when calculating Defense. You may learn separate versions for both Skills."
  },
  {
    "name": "Demolisher",
    "maxDots": 3,
    "description": "When damaging an object or structure, ignore one point of its Durability per dot of this Merit. This helps destroy objects, not people."
  },
  {
    "name": "Destiny",
    "minDots": 1,
    "maxDots": 5,
    "description": "Each chapter, receive Destiny points equal to the rating. Spend points for rote quality or a reroll on eligible mundane actions; applying Destiny to spellcasting has an additional cost. Record the linked Doom, which can complicate the character's fate."
  },
  {
    "name": "Direction Sense",
    "minDots": 1,
    "maxDots": 1,
    "description": "Always know your orientation and the direction you are facing, and ignore ordinary penalties to navigation that result from getting disoriented. It does not automatically reveal an unfamiliar destination."
  },
  {
    "name": "Double Jointed",
    "minDots": 2,
    "maxDots": 2,
    "description": "Escape mundane bindings without a roll. When defending against a grapple, subtract Dexterity from an opponent's attempts to overpower you while you refrain from aggressive action."
  },
  {
    "name": "Dread Geist",
    "minDots": 3,
    "maxDots": 3,
    "description": "Your accompanying Geist has Rank 4 rather than the usual lower Rank. Use the actual Rank 4 traits and limits when resolving its actions; this does not automatically increase the Sin-Eater's Synergy."
  },
  {
    "name": "Dream",
    "minDots": 1,
    "maxDots": 5,
    "description": "Once per chapter, after at least four hours of sleep or meditation, ask a number of prophetic yes-or-no questions up to the Merit rating. The Storyteller supplies accurate but sometimes qualified answers."
  },
  {
    "name": "Egregore",
    "minDots": 1,
    "maxDots": 5,
    "description": "Participate in the Mysterium's collective occult knowledge and rites. Increasing dots improve access to Order resources, shared study, magical ritual cooperation and the sympathetic or tool benefits specified for each rank.",
    "requirements": "Mysterium Status 1.",
    "source_citation": "Mage: The Awakening 2e, p. 101"
  },
  {
    "name": "Eidetic Memory",
    "minDots": 2,
    "maxDots": 2,
    "description": "Recall experiences accurately without a memory roll in ordinary situations. Gain +2 dice on appropriate rolls to retrieve a precise fact from complex information."
  },
  {
    "name": "Encyclopaedic Knowledge",
    "minDots": 2,
    "maxDots": 2,
    "description": "Choose an area of knowledge represented by a Skill. Recall obscure facts on a suitable Intelligence + Wits roll even when you lack formal Skill training; this supplies information, not practical competence in every related task."
  },
  {
    "name": "Enhanced Item",
    "minDots": 1,
    "maxDots": 10,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Enhanced Item",
    "description": "Own an object permanently improved by one or more indefinite spells. Dot rating pays for spell effects or physical bonuses such as tool bonus, Structure or Durability; it does not cast new spells on demand."
  },
  {
    "name": "Eye for the Strange",
    "minDots": 2,
    "maxDots": 2,
    "description": "Examine evidence and roll Intelligence + Composure to tell whether a scene has a supernatural cause. Success reveals one confirming clue; exceptional success adds useful supernatural context or, for mundane causes, aids investigation.",
    "requirements": "Resolve 2 and Occult 1.",
    "source_citation": "Chronicles of Darkness 2e, p. 44"
  },
  {
    "name": "Fame",
    "maxDots": 3,
    "description": "Define the field in which you are known. Gain one die per Fame dot on Social rolls involving people impressed by that reputation, but also attract recognition and scrutiny; it conflicts with Anonymity.",
    "requirements": "Cannot be combined with Anonymity.",
    "source_citation": "Chronicles of Darkness 2e, p. 50"
  },
  {
    "name": "Familiar",
    "minDots": 2,
    "maxDots": 4,
    "description": "Bond with a ghost, spirit or Goetia. At 2 dots it is Rank 1; at 4 it is Rank 2. Its abilities and limitations come from its own ephemeral traits, not from an automatic extra dice bonus.",
    "allowedDots": [
      2,
      4
    ],
    "source_citation": "Mage: The Awakening 2e, p. 101"
  },
  {
    "name": "Fast Reflexes",
    "maxDots": 3,
    "description": "Add one point of Initiative per Merit dot. The bonus improves turn order, not the number of actions you receive.",
    "requirements": "Wits 3 or Dexterity 3.",
    "source_citation": "Chronicles of Darkness 2e, p. 44"
  },
  {
    "name": "Fast Spells",
    "minDots": 2,
    "maxDots": 2,
    "description": "Your Aimed spells are defended against like firearm attacks, not ordinary melee attacks. A target cannot apply Defense unless a power specifically allows Defense against firearms.",
    "requirements": "Firearms 2 and Time 1.",
    "source_citation": "Mage: The Awakening 2e, p. 101"
  },
  {
    "name": "Fast-Talking",
    "maxDots": 5,
    "description": "Social deception style: 1 dot reduces a target's Resolve/Composure protection; 2 applies a suitable external Specialty; 3 rerolls a Subterfuge failure once per scene; 4 spends Willpower to open an additional Door; 5 exploits a mark's Vice to open a Door."
  },
  {
    "name": "Fighting Finesse",
    "minDots": 2,
    "maxDots": 2,
    "description": "Choose a Brawl or Weaponry Specialty. You may substitute Dexterity for Strength on attacks using that Specialty; buy additional instances for additional Specialties."
  },
  {
    "name": "Firefight",
    "maxDots": 3,
    "description": "Mobile firearm style: at 1 dot drawing a gun increases Initiative by Firearms; 2 improves covering fire with semi-automatic weapons and preserves Defense; 3 uses ricochets to bypass cover with a bashing attack."
  },
  {
    "name": "Fixer",
    "minDots": 2,
    "maxDots": 2,
    "description": "Use your network to secure a suitable service at one lower Availability than normal. The discount applies to obtaining services through contacts, not every purchase or item in the game.",
    "requirements": "Contacts 2 and Wits 3.",
    "source_citation": "Chronicles of Darkness 2e, p. 51"
  },
  {
    "name": "Fleet of Foot",
    "maxDots": 3,
    "description": "Increase Speed by one per dot. On foot chases, those pursuing you suffer a penalty equal to your Merit rating."
  },
  {
    "name": "Giant",
    "minDots": 3,
    "maxDots": 3,
    "description": "Your character's Size is 6 rather than 5, giving one additional Health box. It may also affect fiction and access to constrained spaces."
  },
  {
    "name": "Good Time Management",
    "minDots": 1,
    "maxDots": 1,
    "description": "On an extended action, halve the time required between successive rolls. It accelerates completion but does not automatically add successes.",
    "requirements": "Academics 2 or Science 2.",
    "source_citation": "Chronicles of Darkness 2e, p. 44"
  },
  {
    "name": "Grappling",
    "maxDots": 5,
    "description": "Wrestling style with cumulative maneuvers: early dots provide takedowns, joint manipulation and improved control; middle dots enable stronger locks and prone grappling; high dots can force submission or damage a locked limb. Use only maneuvers at or below your rating."
  },
  {
    "name": "Grave Goods",
    "maxDots": 5,
    "description": "Keep a cache of ephemeral equipment for ghosts and Sin-Eaters. Produce objects whose combined Availability is constrained by your Merit dots; the objects can also serve as Essence or Plasm for appropriate consumers."
  },
  {
    "name": "Greyhound",
    "minDots": 1,
    "maxDots": 1,
    "description": "In a chase, reaching three successes rather than five counts as an exceptional success. The bonus applies to chasing or escaping, not unrelated Athletics rolls."
  },
  {
    "name": "Grimoire",
    "minDots": 1,
    "maxDots": 5,
    "description": "Own a collection of rote instructions, holding two rotes per dot. A qualified mage may study them or cast a contained rote from the book with rote quality; using the book does not automatically teach the rote permanently."
  },
  {
    "name": "Hallow",
    "minDots": 1,
    "maxDots": 5,
    "description": "Control a location producing one Mana per dot per day. Unharvested Mana accumulates as tass, up to the site's storage limit; harvest it through the relevant Oblation rules."
  },
  {
    "name": "Hardy",
    "maxDots": 3,
    "description": "Add Hardy dots to rolls resisting disease, poison, deprivation, unconsciousness or suffocation. It helps resist physiological hazards rather than improving all Stamina rolls."
  },
  {
    "name": "Heavy Weapons",
    "maxDots": 5,
    "description": "Two-handed weapon style: 1 dot trades attack dice for increased weapon damage; 2 threatens enemies entering reach; 3 sacrifices Defense to impair targets on hit; 4 spends Willpower to gain protective weapon stance; 5 spends Willpower for a devastating attack with extra aggravated damage."
  },
  {
    "name": "High Speech",
    "minDots": 1,
    "maxDots": 1,
    "description": "Use spoken High Speech as a Yantra when casting a spell, subject to its normal preparation and accessibility rules. It does not supply automatic fluency for ordinary conversations."
  },
  {
    "name": "Hobbyist Clique",
    "minDots": 2,
    "maxDots": 2,
    "description": "Draw on a group devoted to one chosen Skill. With the group's assistance, relevant rolls benefit from 9-again, and extended actions using that Skill receive two bonus dice.",
    "requirements": "A related Skill at 2+ dots.",
    "source_citation": "Chronicles of Darkness 2e, p. 51"
  },
  {
    "name": "Holistic Awareness",
    "minDots": 1,
    "maxDots": 1,
    "description": "Provide basic treatment and stabilization with natural or improvised supplies instead of conventional medical equipment, except when serious wounds require it. Gather useful ingredients with Wits + Survival where appropriate."
  },
  {
    "name": "Imbued Item",
    "minDots": 1,
    "maxDots": 10,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Imbued Item",
    "description": "Own an object that activates an embedded spell by its specified trigger and can store Mana to power it. Merit's dots buy the spell and possible extra Mana capacity; effects remain limited to those actually imbued."
  },
  {
    "name": "Improvised Weaponry",
    "maxDots": 3,
    "description": "Turn nearby objects into usable weapons: at 1 dot draw and ready a suitable improvised weapon reflexively without its usual penalty; at 2 use the object's Structure as protection; at 3 sacrifice its Structure for stronger all-out attacks."
  },
  {
    "name": "Indomitable",
    "minDots": 2,
    "maxDots": 2,
    "description": "Gain +2 dice when contesting supernatural influence that manipulates your thoughts or emotions. Where the power uses a resistance trait rather than a contested roll, increase the appropriate resistance by two if the rules allow.",
    "requirements": "Resolve 3.",
    "source_citation": "Chronicles of Darkness 2e, p. 45"
  },
  {
    "name": "Infamous Mentor",
    "minDots": 1,
    "maxDots": 5,
    "description": "Invoke a notorious or powerful Mentor's reputation to obtain temporary social leverage and access to their standing or Social Merits. The benefits depend on the Mentor and should not be treated as personal permanent Status."
  },
  {
    "name": "Inspiring",
    "minDots": 3,
    "maxDots": 3,
    "description": "Deliver a motivating speech and roll Presence + Expression. On an appropriate success, listeners receive the Inspired Condition; it must later be invoked on a relevant roll to lower the exceptional-success threshold.",
    "allowedDots": [
      3
    ],
    "requirements": "Presence 3.",
    "source_citation": "Chronicles of Darkness 2e, p. 51"
  },
  {
    "name": "Interdisciplinary Speciality",
    "minDots": 1,
    "maxDots": 1,
    "description": "Choose one existing Specialty. Apply its +1 bonus to other Skills with at least one dot when the same specialized expertise genuinely applies; a medical Anatomy Specialty, for example, may assist a precise combat action."
  },
  {
    "name": "Investigative Aide",
    "minDots": 1,
    "maxDots": 1,
    "description": "Choose an investigative Skill. Rolls using it to Uncover Clues achieve exceptional success at three successes and produce Clues with one extra element."
  },
  {
    "name": "Investigative Prodigy",
    "maxDots": 5,
    "description": "On a successful instant investigation, uncover more than one Clue: the number is limited by both the successes rolled and the Merit rating."
  },
  {
    "name": "Iron Skin",
    "maxDots": 4,
    "description": "Gain one point of bashing Armor at 2 dots or two at 4 dots. Spend Willpower under the Merit rules to convert a limited amount of lethal damage you suffer to bashing.",
    "minDots": 2,
    "allowedDots": [
      2,
      4
    ],
    "requirements": "Martial Arts or Street Fighting 2, and Stamina 3.",
    "source_citation": "Chronicles of Darkness 2e, p. 63"
  },
  {
    "name": "Iron Stamina",
    "maxDots": 3,
    "description": "Ignore injury or fatigue penalties up to this Merit's rating, including wound penalties. It cancels negative modifiers but never creates a positive bonus."
  },
  {
    "name": "Iron Will",
    "minDots": 2,
    "maxDots": 2,
    "description": "When spending Willpower to resist Social manipulation, substitute Resolve for the ordinary Willpower dice bonus. When contesting the Social action, your dice gain 8-again.",
    "requirements": "Resolve 4.",
    "source_citation": "Chronicles of Darkness 2e, p. 51"
  },
  {
    "name": "Language",
    "minDots": 1,
    "maxDots": 1,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Language",
    "description": "Speak, read and write one additional chosen language competently. Purchase separate instances for different languages."
  },
  {
    "name": "Lex Magica",
    "minDots": 2,
    "maxDots": 2,
    "description": "Your Silver Ladder office grants protection from some Social influence and lets you use appropriate Order or Consilium Status as a Yantra for spells enforcing magical law. Apply the status-based Yantra value only in qualifying situations.",
    "requirements": "Silver Ladder Status 1.",
    "source_citation": "Mage: The Awakening 2e, p. 102"
  },
  {
    "name": "Library",
    "maxDots": 3,
    "specialtyPlaceholder": "Mental Skill",
    "hasSpecialty": true,
    "description": "Choose a field corresponding to a Mental Skill. Add Library dots on extended research or other extended rolls genuinely covered by that collection; it does not increase every roll with the Skill."
  },
  {
    "name": "Light Weapons",
    "maxDots": 5,
    "description": "Small blade or light-weapon style: 1 dot trades weapon damage for Initiative; 2 sacrifices Defense to gain attack dice; 3 feints to improve the next strike; 4 punishes foes in reach; 5 sacrifices Defense for an attack inflicting extra aggravated damage."
  },
  {
    "name": "Mana Sensitivity",
    "minDots": 1,
    "maxDots": 1,
    "description": "Your Peripheral Mage Sight notices sources of Mana, including Hallows and stored tass, even without another overt spell. It identifies the presence of Mana, not automatically the full details of its owner.",
    "requirements": "Wits 3 and Prime 1.",
    "source_citation": "Mage: The Awakening 2e, p. 102"
  },
  {
    "name": "Manic States",
    "maxDots": 5,
    "description": "Once per session, spend a Willpower point to enter a manic state for a scene, suppressing the negative effects of a chosen Persistent Condition. Divide bonus dice equal to Merit dots across rolls; those rolls get 8-again."
  },
  {
    "name": "Marksmanship",
    "maxDots": 3,
    "description": "Deliberate shooting style requiring Aim and sacrificing Defense: 1 dot increases maximum Aim bonus; 2 trades weapon damage to reduce called-shot penalties; 3 prevents stray hits on missed shots; 4 makes your firing position hard to discover."
  },
  {
    "name": "Martial Arts",
    "maxDots": 5,
    "description": "Formal Brawl style: the first dots improve precision and Defense, middle dots allow trapping and reactions against nearby foes, and advanced dots enable lethal barehanded strikes and powerful counters. Exact maneuvers depend on rating and the permitted fighting style."
  },
  {
    "name": "Masque",
    "minDots": 1,
    "maxDots": 5,
    "description": "Create a distinct Guardian of the Veil persona. Spending Willpower adopts it; increasing dots add persona-specific traits or benefits such as alternate Virtue/Vice, Specialties, Nimbus and identity-fitting Merits, subject to Order rules."
  },
  {
    "name": "Meditative Mind",
    "maxDots": 4,
    "description": "At 1 dot ignore environmental and wound penalties when meditating; at 2 dots successful meditation helps Resolve + Composure rolls; at 4 dots the meditation action requires only a single success.",
    "minDots": 1,
    "allowedDots": [
      1,
      2,
      4
    ],
    "source_citation": "Chronicles of Darkness 2e, p. 46"
  },
  {
    "name": "Memento",
    "minDots": 3,
    "maxDots": 3,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Memento",
    "description": "Own a particular ghostly Memento. Its rating determines the type or power of the object; define that object's Key, manifestations and special abilities separately rather than assuming every Memento has the same power."
  },
  {
    "name": "Mentor",
    "maxDots": 5,
    "description": "Choose an experienced adviser or patron. Their rating sets competence and the extent of instruction, information and favors they can provide; assistance may create demands or obligations."
  },
  {
    "name": "Multilingual",
    "minDots": 1,
    "maxDots": 1,
    "description": "Choose two languages: speak them conversationally, and attempt to read them well enough to grasp meaning using Intelligence + Academics. It does not provide the full literacy of the Language Merit."
  },
  {
    "name": "Mystery Cult Influence",
    "minDots": 3,
    "maxDots": 5,
    "description": "Lead or wield substantial influence over a Mystery Cult while remaining outside its ordinary initiation obligations. Receive cult benefits appropriate to the Merit rating and the group's defined hierarchy.",
    "source_citation": "Mage: The Awakening 2e, p. 103"
  },
  {
    "name": "Mystery Cult Initiation",
    "maxDots": 5,
    "description": "Belong to a defined Mystery Cult. Each dot increases rank and can grant a chosen Specialty, Skill dot or additional Merit at the listed tier; record the cult's doctrine, duties and benefits rather than treating it as an unconditional bonus."
  },
  {
    "name": "Occultation",
    "minDots": 1,
    "maxDots": 3,
    "description": "Penalize attempts to identify you through your Nimbus, magical traces or aura by Merit dots; sympathetic targeting against you also faces increased resistance as specified. Public fame can compromise this protection.",
    "requirements": "Cannot be combined with Fame.",
    "source_citation": "Mage: The Awakening 2e, p. 103"
  },
  {
    "name": "Parkour",
    "maxDots": 5,
    "description": "Movement style: 1 dot improves foot chases and counters environmental Athletics penalties; 2 improves safe landings; 3 increases climb height with a running start; 4 allows a powerful rote-quality movement action at a cost; 5 permits reflexive Athletics movement after preparation."
  },
  {
    "name": "Patient",
    "minDots": 1,
    "maxDots": 1,
    "description": "Take up to two more rolls than your usual Attribute + Skill limit during an extended action. It improves persistence, not the dice rolled on each attempt."
  },
  {
    "name": "Police Tactics",
    "maxDots": 3,
    "description": "Nonlethal restraint style: 1 dot improves Disarm or Immobilize maneuvers in a grapple; 2 makes opponents work harder to disarm or seize your weapon; 3 lets you restrain an immobilized target reflexively."
  },
  {
    "name": "Potent Nimbus",
    "minDots": 1,
    "maxDots": 2,
    "description": "Treat your Gnosis as higher when determining the strength of your Nimbus Tilt (by 2 effective Gnosis per dot), and add Merit dots when flaring your Nimbus. The extra Gnosis is not actual Gnosis for spellcasting."
  },
  {
    "name": "Potent Resonance",
    "minDots": 2,
    "maxDots": 2,
    "description": "When another mage scrutinizes your Signature Nimbus, that person is also subjected to your Immediate Nimbus and its Tilt. This is not a passive bonus on all your spells.",
    "allowedDots": [
      2
    ],
    "requirements": "Gnosis 3.",
    "source_citation": "Mage: The Awakening 2e, p. 103"
  },
  {
    "name": "Prelacy",
    "minDots": 1,
    "maxDots": 4,
    "description": "As a Seer invested in an Exarch's authority, obtain benefits at specified Prelacy ranks: an Exarchal command, an appropriate symbolic Yantra, Exarch-related Attainment and stronger authority over a linked Verge or Demesne.",
    "requirements": "Seers of the Throne Status 3.",
    "source_citation": "Mage: The Awakening 2e, p. 103"
  },
  {
    "name": "Professional Training",
    "maxDots": 5,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Profession",
    "description": "Select a profession and its Asset Skills. At lower ranks gain professional Contacts and 9-again on Asset Skill rolls; higher ranks add Specialties, Skill advancement and a Willpower-funded rote-quality roll."
  },
  {
    "name": "Pusher",
    "minDots": 1,
    "maxDots": 1,
    "description": "In Social Maneuvering, when the target accepts your soft leverage, treat that as also satisfying their Vice to open another Door and improve the impression. It only applies to accepted leverage."
  },
  {
    "name": "Quick Draw",
    "minDots": 1,
    "maxDots": 1,
    "description": "Choose a Weaponry or Firearms Specialty. Draw or holster a matching weapon reflexively when Defense would normally apply; it does not grant a separate attack."
  },
  {
    "name": "Reconciler",
    "maxDots": 3,
    "description": "When undertaking Social Maneuvering to make amends or broker a genuine reconciliation, remove a number of Doors equal to the Merit's rating."
  },
  {
    "name": "Relentless",
    "minDots": 1,
    "maxDots": 1,
    "description": "During a chase, opponents need two more successes than normal to catch you or escape you. This works when you are either pursuer or quarry."
  },
  {
    "name": "Resources",
    "maxDots": 5,
    "description": "Your rating determines discretionary spending power. Once per session, obtain goods or services within your Resources rating; less costly items are easier to acquire, while buying above your rating can temporarily reduce Resources.",
    "source_citation": "Chronicles of Darkness 2e, p. 53"
  },
  {
    "name": "Retainer",
    "maxDots": 5,
    "description": "Choose a reliable servant, assistant or follower. The rating determines their competence and the service they can provide. Retainers take actions with their own traits rather than granting an automatic bonus to every roll you make."
  },
  {
    "name": "Retribution",
    "maxDots": 5,
    "description": "When actively retaliating for harm to someone you protect, unlock rating-dependent bonuses such as tracking the wrongdoer, damage in all-out attacks, temporary protection and turning an inflicted Condition or Tilt against the aggressor. Benefits stop when the vendetta ends."
  },
  {
    "name": "Safe Place",
    "maxDots": 5,
    "description": "Maintain a secured location. While inside, add Safe Place dots to Initiative and apply the rating as a penalty to intruders' attempts to break in; carefully prepared traps can add further protection."
  },
  {
    "name": "Sanctum",
    "minDots": 1,
    "maxDots": 5,
    "description": "Protect a magical refuge attached to Safe Place. Add Sanctum dots to effective Gnosis only for spell-control limits while within it; higher investment may establish a Demesne."
  },
  {
    "name": "Seizing the Edge",
    "minDots": 2,
    "maxDots": 2,
    "description": "Start a chase with the Edge automatically. Unless the opponent notices the start with Wits + Composure, you can ignore some normal first-turn Speed and Initiative requirements."
  },
  {
    "name": "Shadow Name",
    "minDots": 1,
    "maxDots": 3,
    "description": "Define a magical identity and its symbols. Use appropriate symbolism as a persona Yantra worth the Merit rating; the identity also helps withstand spells or investigations that connect your Shadow Name to your mundane self."
  },
  {
    "name": "Shiv",
    "maxDots": 2,
    "description": "Conceal a small brawling weapon: at 1 dot a zero-damage weapon, at 2 dots a one-damage weapon. Attempts to find it suffer a penalty based on Weaponry, and you can fight with it using Brawl."
  },
  {
    "name": "Sleight of Hand",
    "minDots": 2,
    "maxDots": 2,
    "description": "Take one instant Larceny action reflexively per turn. Ordinary uses of that Larceny go unnoticed unless someone is actively watching for the trick."
  },
  {
    "name": "Small Unit Tactics",
    "minDots": 2,
    "maxDots": 2,
    "description": "Once per scene, spend Willpower and an instant action to direct a preplanned coordinated action. Allies up to your Presence rating can receive the Willpower-related dice bonus."
  },
  {
    "name": "Small-Framed",
    "minDots": 2,
    "maxDots": 2,
    "description": "Reduce Size to 4 and maximum Health by one, but gain +2 dice to hide or exploit your small stature. It also changes what spaces you can plausibly enter."
  },
  {
    "name": "Spin Doctor",
    "minDots": 1,
    "maxDots": 1,
    "description": "When your investigation uses Tainted Clues, suffer the listed dice penalty instead of losing successes outright. The rules cap the combined penalty from a Tainted Clue used this way."
  },
  {
    "name": "Staff",
    "maxDots": 5,
    "description": "Choose one type of helper and associated Skill per dot. When reasonably available, the staff can achieve a single automatic success on uncomplicated tasks using their assigned Skills, without making them effective in contested actions."
  },
  {
    "name": "Status",
    "maxDots": 5,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Group",
    "description": "Choose an organization in which you hold standing. Apply Status as a bonus to eligible Social rolls, draw on that group's resources and block lower-rated organizational favors under the frequency limits of the Merit."
  },
  {
    "name": "Street Fighting",
    "maxDots": 5,
    "description": "Pragmatic Brawl style: 1 dot trades an attack die for improved Defense calculation; 2 inflicts an extra debuff on barehanded hits; 3 punishes prone foes; 4 spends Willpower for additional bashing damage; 5 allows a desperate preemptive counterattack while injured."
  },
  {
    "name": "Striking Looks",
    "maxDots": 2,
    "description": "Add one or two dice to Social actions where your distinctive appearance genuinely matters, based on rating. The same memorable appearance can make you easier for others to notice or identify."
  },
  {
    "name": "Stunt Driver",
    "maxDots": 4,
    "description": "Advanced driving style: 1 dot penalizes attacks on your moving car; 2 improves acceleration; 3 allows safe high-speed turns; 4 reduces collision damage when ramming."
  },
  {
    "name": "Supernatural Membership",
    "maxDots": 5,
    "description": "Your krewe includes living members with supernatural abilities. Represent those members with Supernatural Merits totaling twice your rating; their uses and frequency restrictions come from the krewe rules."
  },
  {
    "name": "Sympathetic",
    "minDots": 2,
    "maxDots": 2,
    "description": "At the outset of Social Maneuvering, willingly accept an appropriate social Condition such as Leveraged or Swooned to immediately open two of the subject's Doors."
  },
  {
    "name": "Table Turner",
    "minDots": 1,
    "maxDots": 1,
    "description": "When another character starts Social Maneuvering against you, spend Willpower to preempt their attempt with your own Social action, reversing the pressure rather than simply gaining passive resistance."
  },
  {
    "name": "Takes One to Know One",
    "minDots": 1,
    "maxDots": 1,
    "description": "When investigating an act aligned with your Vice, replace the ordinary penalty with +2 dice and 9-again; success also counts as indulging that Vice."
  },
  {
    "name": "Taste",
    "minDots": 1,
    "maxDots": 1,
    "description": "Choose a creative or artistic Specialty. Roll Wits + an appropriate Skill to analyze relevant works, uncover details and appraise them; successes can supply questions or support later Social interactions in that cultural scene."
  },
  {
    "name": "Techné",
    "minDots": 2,
    "maxDots": 2,
    "hasSpecialty": true,
    "specialtyPlaceholder": "Focus or Field",
    "description": "Choose a Free Council cultural or technical focus to use as an Order-tool Yantra. Appropriate Sleeper participation can provide a distinct tool, and qualifying teamwork casting gains 8-again."
  },
  {
    "name": "Tolerance for Biology",
    "minDots": 1,
    "maxDots": 1,
    "description": "Ignore resistance rolls required merely because a biological phenomenon is gruesome or repellent. It does not protect against toxins, disease or genuine supernatural fear.",
    "allowedDots": [
      1
    ],
    "requirements": "Resolve 3.",
    "source_citation": "Chronicles of Darkness 2e, p. 46"
  },
  {
    "name": "Trained Observer",
    "maxDots": 3,
    "description": "Perception rolls, normally Wits + Composure, gain 9-again at 1 dot and 8-again at 3 dots. This changes rerolls, not the base dice pool.",
    "minDots": 1,
    "allowedDots": [
      1,
      3
    ],
    "requirements": "Wits 3 or Composure 3.",
    "source_citation": "Chronicles of Darkness 2e, p. 46"
  },
  {
    "name": "True Friend",
    "minDots": 3,
    "maxDots": 3,
    "description": "Choose one exceptionally loyal friend. Social attempts to turn them against you suffer a five-die penalty; they will not betray you casually. Once per story, a meaningful interaction restores one Willpower."
  },
  {
    "name": "Unarmed Defense",
    "maxDots": 5,
    "description": "Unarmed defensive style: 1 dot adds a Brawl-based Defense bonus; 2 specializes against a selected opponent; 3 redirects a missed attack toward a new target; 4 counters with a limb-injuring strike; 5 can knock foes down when Dodging."
  },
  {
    "name": "Untouchable",
    "minDots": 1,
    "maxDots": 1,
    "description": "Investigations into crimes you have concealed return Incomplete Clues unless they reach exceptional success. This does not prevent witnesses or supernatural investigation from acting entirely."
  },
  {
    "name": "Vice-Ridden",
    "minDots": 2,
    "maxDots": 2,
    "description": "Choose two Vices. You may satisfy either one to regain Willpower but remain subject to the usual frequency limits on that recovery."
  },
  {
    "name": "Virtuous",
    "maxDots": 2,
    "description": "Choose two Virtues. Either can justify the normal Willpower-restoring benefit, but the standard limits on Virtue-based recovery still apply.",
    "minDots": 2,
    "allowedDots": [
      2
    ],
    "source_citation": "Chronicles of Darkness 2e, p. 46"
  }
];

export const MERIT_CATEGORY_BY_NAME = {
    // Mental
    "Advanced Library": "Mental",
    "Area of Expertise": "Mental",
    "Common Sense": "Mental",
    "Danger Sense": "Mental",
    "Direction Sense": "Mental",
    "Eidetic Memory": "Mental",
    "Encyclopaedic Knowledge": "Mental",
    "Eye for the Strange": "Mental",
    "Fast Reflexes": "Mental",
    "Good Time Management": "Mental",
    "Holistic Awareness": "Mental",
    "Indomitable": "Mental",
    "Interdisciplinary Speciality": "Mental",
    "Investigative Aide": "Mental",
    "Investigative Prodigy": "Mental",
    "Language": "Mental",
    "Library": "Mental",
    "Meditative Mind": "Mental",
    "Multilingual": "Mental",
    "Patient": "Mental",
    "Professional Training": "Mental",
    "Tolerance for Biology": "Mental",
    "Trained Observer": "Mental",
    "Vice-Ridden": "Mental",
    "Virtuous": "Mental",

    // Physical
    "Ambidextrous": "Physical",
    "Automotive Genius": "Physical",
    "Crack Driver": "Physical",
    "Demolisher": "Physical",
    "Double Jointed": "Physical",
    "Fleet of Foot": "Physical",
    "Giant": "Physical",
    "Greyhound": "Physical",
    "Hardy": "Physical",
    "Iron Stamina": "Physical",
    "Parkour": "Physical",
    "Quick Draw": "Physical",
    "Relentless": "Physical",
    "Seizing the Edge": "Physical",
    "Sleight of Hand": "Physical",
    "Small-Framed": "Physical",
    "Stunt Driver": "Physical",

    // Social
    "Allies": "Social",
    "Alternate Identity": "Social",
    "Anonymity": "Social",
    "Barfly": "Social",
    "Closed Book": "Social",
    "Contacts": "Social",
    "Fame": "Social",
    "Fast-Talking": "Social",
    "Fixer": "Social",
    "Hobbyist Clique": "Social",
    "Inspiring": "Social",
    "Iron Will": "Social",
    "Mentor": "Social",
    "Mystery Cult Influence": "Social",
    "Mystery Cult Initiation": "Social",
    "Pusher": "Social",
    "Reconciler": "Social",
    "Resources": "Social",
    "Retainer": "Social",
    "Safe Place": "Social",
    "Small Unit Tactics": "Social",
    "Spin Doctor": "Social",
    "Staff": "Social",
    "Status": "Social",
    "Striking Looks": "Social",
    "Sympathetic": "Social",
    "Table Turner": "Social",
    "Takes One to Know One": "Social",
    "Taste": "Social",
    "True Friend": "Social",
    "Untouchable": "Social",

    // Fighting
    "Armed Defense": "Fighting",
    "Cheap Shot": "Fighting",
    "Choke Hold": "Fighting",
    "Close Quarters Combat": "Fighting",
    "Defensive Combat": "Fighting",
    "Fighting Finesse": "Fighting",
    "Firefight": "Fighting",
    "Grappling": "Fighting",
    "Heavy Weapons": "Fighting",
    "Improvised Weaponry": "Fighting",
    "Iron Skin": "Fighting",
    "Light Weapons": "Fighting",
    "Marksmanship": "Fighting",
    "Martial Arts": "Fighting",
    "Police Tactics": "Fighting",
    "Retribution": "Fighting",
    "Shiv": "Fighting",
    "Street Fighting": "Fighting",
    "Unarmed Defense": "Fighting",

    // Mage-specific
    "Adamant Hand": "Mage",
    "Artifact": "Mage",
    "Astral Adept": "Mage",
    "Between the Ticks": "Mage",
    "Cabal Theme": "Mage",
    "Consilium/Order Status": "Mage",
    "Destiny": "Mage",
    "Dream": "Mage",
    "Egregore": "Mage",
    "Enhanced Item": "Mage",
    "Familiar": "Mage",
    "Fast Spells": "Mage",
    "Grimoire": "Mage",
    "Hallow": "Mage",
    "High Speech": "Mage",
    "Imbued Item": "Mage",
    "Infamous Mentor": "Mage",
    "Lex Magica": "Mage",
    "Mana Sensitivity": "Mage",
    "Masque": "Mage",
    "Occultation": "Mage",
    "Potent Nimbus": "Mage",
    "Potent Resonance": "Mage",
    "Prelacy": "Mage",
    "Sanctum": "Mage",
    "Shadow Name": "Mage",
    "Techné": "Mage",

    // Geist-specific
    "Architect": "Geist",
    "Cenote": "Geist",
    "Dread Geist": "Geist",
    "Grave Goods": "Geist",
    "Manic States": "Geist",
    "Memento": "Geist",
    "Supernatural Membership": "Geist",
};

export const getMeritCategory = (name) =>
    MERIT_CATEGORY_BY_NAME[name] || "Other";

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

// The learned-ceremony picker, reference cards and activation share this catalogue.
export const CEREMONY_DEFINITIONS = Object.fromEntries(CEREMONY_LIST.map(ceremony => [ceremony.name, {
    ...ceremony,
    description: ceremony.description || ceremony.success || '',
}]));

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

// Mage Armor effects (2-dot Attainment per Arcanum)
export const MAGE_ARMOR_EFFECTS = {
    "Death":  { short: "Downgrades lethal kinetic damage to bashing", armor: "Kinetic lethal → bashing" },
    "Fate":   { short: "Adds Fate dots to Defense against attacks", armor: "+Fate to Defense" },
    "Forces": { short: "Forces rating as general armor vs. energy attacks", armor: "+Forces general armor" },
    "Life":   { short: "Adds half Life dots (round up) to armor and Defense", armor: "+Life/2 armor & Defense" },
    "Matter": { short: "Matter rating as general armor, immune to Armor Piercing", armor: "+Matter general armor (ignore AP)" },
    "Mind":   { short: "Adds Mind dots to Defense vs. mental/social attacks", armor: "+Mind to Defense" },
    "Prime":  { short: "Reduces incoming supernatural damage by Prime dots", armor: "-Prime supernatural damage" },
    "Space":  { short: "Adds Space dots to Defense, can redirect attacks", armor: "+Space to Defense" },
    "Spirit": { short: "Downgrades lethal from spirits/ephemeral to bashing", armor: "Spirit lethal → bashing" },
    "Time":   { short: "Adds Time dots to Defense, can reduce attacker Initiative", armor: "+Time to Defense" },
};

// Attainments are automatically gained at specific Arcanum dot levels
export const MAGE_ATTAINMENTS = {
    "Death": {
        1: { name: "Counterspell (Death)", description: "Counter Death spells with Gnosis + Death in a Clash of Wills" },
        2: { name: "Eyes of the Dead / Death Armor", description: "See ghosts in Twilight; Armor downgrades lethal kinetic damage to bashing" },
        3: { name: "Targeted Summoning", description: "Summon Supernal beings with a secondary Arcanum" },
        4: { name: "Inviolate Soul", description: "Reflexively protect your soul from tampering, possession, or aura manipulation" },
        5: { name: "Create Rote", description: "Create permanent Rotes from spells you can cast" }
    },
    "Fate": {
        1: { name: "Counterspell (Fate)", description: "Counter Fate spells with Gnosis + Fate in a Clash of Wills" },
        2: { name: "Conditional Duration / Fate Armor", description: "Add conditional triggers to spell duration; Armor adds Fate to Defense" },
        3: { name: "Targeted Summoning", description: "Summon Supernal beings with a secondary Arcanum" },
        4: { name: "Unbound Fate", description: "Reflexively resist magical oaths, compulsions, or destiny alterations" },
        5: { name: "Create Rote", description: "Create permanent Rotes from spells you can cast" }
    },
    "Forces": {
        1: { name: "Counterspell (Forces)", description: "Counter Forces spells with Gnosis + Forces in a Clash of Wills" },
        2: { name: "Precise Force / Forces Armor", description: "9-Again on calculated attacks, ignore 2 Durability; Armor = Forces rating as general armor" },
        3: { name: "Targeted Summoning", description: "Summon Supernal beings with a secondary Arcanum" },
        4: { name: "Environmental Immunity", description: "Spend 1 Mana to become immune to Environmental Tilts for the scene" },
        5: { name: "Create Rote", description: "Create permanent Rotes from spells you can cast" }
    },
    "Life": {
        1: { name: "Counterspell (Life)", description: "Counter Life spells with Gnosis + Life in a Clash of Wills" },
        2: { name: "Improved Pattern Restoration / Life Armor", description: "Heal bashing 1:1 Mana, lethal 2:1; Armor adds Life/2 to armor and Defense" },
        3: { name: "Targeted Summoning", description: "Summon Supernal beings with a secondary Arcanum" },
        4: { name: "Body Autonomy", description: "Reflexively resist supernatural body alterations, injuries, or Personal Tilts" },
        5: { name: "Create Rote", description: "Create permanent Rotes from spells you can cast" }
    },
    "Matter": {
        1: { name: "Counterspell (Matter)", description: "Counter Matter spells with Gnosis + Matter in a Clash of Wills" },
        2: { name: "Permanence / Matter Armor", description: "Spend 1 Mana for Advanced Duration on Matter spells; Armor = Matter rating, immune to AP" },
        3: { name: "Targeted Summoning", description: "Summon Supernal beings with a secondary Arcanum" },
        4: { name: "Durability Control", description: "Touch object, spend 1 Mana to raise/lower Durability by Matter dots for the scene" },
        5: { name: "Create Rote", description: "Create permanent Rotes from spells you can cast" }
    },
    "Mind": {
        1: { name: "Counterspell (Mind)", description: "Counter Mind spells with Gnosis + Mind in a Clash of Wills" },
        2: { name: "Mind's Eye / Mind Armor", description: "See Goetia and projecting beings in Twilight; Armor adds Mind to Defense, can inflict Beaten Down" },
        3: { name: "Targeted Summoning", description: "Summon Supernal beings with a secondary Arcanum" },
        4: { name: "Intuitive Leap", description: "Spend 1 Mana when rolling 3+ successes on Social/Mental to make it exceptional" },
        5: { name: "Create Rote", description: "Create permanent Rotes from spells you can cast" }
    },
    "Prime": {
        1: { name: "Counterspell (Prime)", description: "Counter Prime spells with Gnosis + Prime in a Clash of Wills" },
        2: { name: "Universal Counterspell / Prime Armor", description: "Counter ANY spell with Gnosis + Prime; Armor reduces supernatural damage by Prime dots" },
        3: { name: "Targeted Summoning", description: "Summon Supernal beings with a secondary Arcanum" },
        4: { name: "Imbue Item", description: "Create permanent Imbued Items with any spell you can cast" },
        5: { name: "Create Rote", description: "Create permanent Rotes from spells you can cast" }
    },
    "Space": {
        1: { name: "Counterspell (Space)", description: "Counter Space spells with Gnosis + Space in a Clash of Wills" },
        2: { name: "Sympathetic Range / Space Armor", description: "Cast at sensory range via sympathy for 1 Mana; Armor adds Space to Defense, can redirect attacks" },
        3: { name: "Targeted Summoning", description: "Summon Supernal beings with a secondary Arcanum" },
        4: { name: "Everywhere", description: "Spend 1 Mana instead of Reach for Advanced Scale" },
        5: { name: "Create Rote", description: "Create permanent Rotes from spells you can cast" }
    },
    "Spirit": {
        1: { name: "Counterspell (Spirit)", description: "Counter Spirit spells with Gnosis + Spirit in a Clash of Wills" },
        2: { name: "Spirit Eyes / Spirit Armor", description: "See spirits in Twilight; Armor downgrades lethal kinetic and ephemeral attacks to bashing" },
        3: { name: "Targeted Summoning", description: "Summon Supernal beings with a secondary Arcanum" },
        4: { name: "Honorary Rank", description: "Have honorary spirit Rank = Spirit dots; physical attacks are banes to weaker spirits" },
        5: { name: "Create Rote", description: "Create permanent Rotes from spells you can cast" }
    },
    "Time": {
        1: { name: "Counterspell (Time)", description: "Counter Time spells with Gnosis + Time in a Clash of Wills" },
        2: { name: "Temporal Sympathy / Time Armor", description: "Cast Time spells on subject's past for 1 Mana; Armor adds Time to Defense, can reduce Initiative" },
        3: { name: "Targeted Summoning", description: "Summon Supernal beings with a secondary Arcanum" },
        4: { name: "Time in a Bottle", description: "Spend 1 Mana instead of Reach for instant casting time" },
        5: { name: "Create Rote", description: "Create permanent Rotes from spells you can cast" }
    }
};

// Gnosis table (similar to Synergy for Mages)
export const GNOSIS_TABLE = {
    1: { maxMana: 10, perTurn: 1, traitMax: 5, ritualInterval: "3 hours", combinedSpells: 1, paradoxDie: 1, highestArcanum: "3 or less", otherArcana: "2 or less", yantras: 2 },
    2: { maxMana: 11, perTurn: 2, traitMax: 5, ritualInterval: "3 hours", combinedSpells: 1, paradoxDie: 1, highestArcanum: "3 or less", otherArcana: "3 or less", yantras: 2 },
    3: { maxMana: 12, perTurn: 3, traitMax: 5, ritualInterval: "1 hour", combinedSpells: 2, paradoxDie: 2, highestArcanum: "4 or less", otherArcana: "3 or less", yantras: 3 },
    4: { maxMana: 13, perTurn: 4, traitMax: 5, ritualInterval: "1 hour", combinedSpells: 2, paradoxDie: 2, highestArcanum: "4 or less", otherArcana: "4 or less", yantras: 3 },
    5: { maxMana: 15, perTurn: 5, traitMax: 5, ritualInterval: "30 min", combinedSpells: 2, paradoxDie: 3, highestArcanum: "5 or less", otherArcana: "4 or less", yantras: 4 },
    6: { maxMana: 20, perTurn: 6, traitMax: 6, ritualInterval: "30 min", combinedSpells: 3, paradoxDie: 3, highestArcanum: 5, otherArcana: 5, yantras: 4 },
    7: { maxMana: 25, perTurn: 7, traitMax: 7, ritualInterval: "10 min", combinedSpells: 3, paradoxDie: 4, highestArcanum: 5, otherArcana: 5, yantras: 5 },
    8: { maxMana: 30, perTurn: 8, traitMax: 8, ritualInterval: "10 min", combinedSpells: 3, paradoxDie: 4, highestArcanum: 5, otherArcana: 5, yantras: 5 },
    9: { maxMana: 50, perTurn: 10, traitMax: 9, ritualInterval: "1 min", combinedSpells: 4, paradoxDie: 5, highestArcanum: 5, otherArcana: 5, yantras: 6 },
    10: { maxMana: 75, perTurn: 15, traitMax: 10, ritualInterval: "1 min", combinedSpells: 4, paradoxDie: 5, highestArcanum: 5, otherArcana: 5, yantras: 6 }
};

// Mage Paths
export const MAGE_PATHS = [
    "Acanthus",
    "Mastigos", 
    "Moros",
    "Obrimos",
    "Thyrsus"
];

// Path Arcana (Ruling and Inferior)
export const PATH_ARCANA = {
    "Acanthus": { ruling: ["Fate", "Time"], inferior: "Forces" },
    "Mastigos": { ruling: ["Mind", "Space"], inferior: "Matter" },
    "Moros": { ruling: ["Death", "Matter"], inferior: "Spirit" },
    "Obrimos": { ruling: ["Forces", "Prime"], inferior: "Death" },
    "Thyrsus": { ruling: ["Life", "Spirit"], inferior: "Mind" }
};

// Mage Orders
export const MAGE_ORDERS = [
    "Adamantine Arrow",
    "Guardians of the Veil",
    "Mysterium",
    "Silver Ladder",
    "Free Council"
];

// Mage Practices by Arcana dots
export const ARCANA_PRACTICES = {
    1: ["Compelling", "Knowing", "Unveiling"],
    2: ["Ruling", "Shielding", "Veiling"],
    3: ["Fraying", "Perfecting", "Weaving"],
    4: ["Patterning", "Unravelling"],
    5: ["Making", "Unmaking"]
};

// Yantras (bonus dice tools for spellcasting)
export const YANTRAS = [
    { name: "Concentration", bonus: 2, description: "Focus your full attention on the spell." },
    { name: "Dedicated Tool", bonus: 1, description: "Personal magical tool. Also -2 to Paradox pool.", reducesParadox: true },
    { name: "Demesne/Verge", bonus: 2, description: "Casting within a Demesne or near a Supernal Verge." },
    { name: "Environment", bonus: 1, description: "A place symbolically linked to the spell." },
    { name: "High Speech", bonus: 2, description: "Chanting in the Supernal tongue." },
    { name: "Order Tool", bonus: 1, description: "A tool associated with the mage's Order." },
    { name: "Path Tool: Coin", bonus: 1, description: "A Path Tool: Coin." },
    { name: "Path Tool: Cup", bonus: 1, description: "A Path Tool: Cup." },
    { name: "Path Tool: Mirror", bonus: 1, description: "A Path Tool: Mirror." },
    { name: "Path Tool: Rod", bonus: 1, description: "A Path Tool: Rod." },
    { name: "Path Tool: Weapon", bonus: 1, description: "A Path Tool: Weapon." },
    { name: "Persona", bonus: 2, description: "Invoking the mage's Shadow Name." },
    { name: "Runes", bonus: 2, description: "Inscribed runes that channel the spell." },
    { name: "Sacrament: Minor", bonus: 1, description: "A minor sacrament." },
    { name: "Sacrament: Major", bonus: 2, description: "A major sacrament." },
    { name: "Sacrament: Mystic", bonus: 3, description: "A mystic sacrament." },
    { name: "Sympathy: Material", bonus: 2, description: "A strong sympathetic link to the target or moment." },
    { name: "Sympathy: Representational", bonus: 1, description: "A sufficient sympathetic link to the target or moment." },
    { name: "Sympathy: Symbolic", bonus: 0, description: "A weak sympathetic link to the target or moment." },
];

// Order Rote Skills
export const ORDER_ROTE_SKILLS = {
    "Adamantine Arrow": ["athletics", "intimidation", "medicine"],
    "Guardians of the Veil": ["investigation", "stealth", "subterfuge"],
    "Mysterium": ["investigation", "occult", "survival"],
    "Silver Ladder": ["expression", "persuasion", "subterfuge"],
    "Free Council": ["crafts", "persuasion", "science"]
};
