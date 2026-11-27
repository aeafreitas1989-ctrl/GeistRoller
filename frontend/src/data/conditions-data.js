// Canonical corrected Conditions and Tilts; audit reference modules are retained for tests.
export const CONDITION_FILTER_OPTIONS = [
  "Core",
  "Vampire",
  "Werewolf",
  "Mage",
  "Changeling",
  "Geist",
  "Ephemeral",
  "Tilts"
];

export const CONDITION_DEFINITIONS = {
  "Abyssal Backlash": {
    "name": "Abyssal Backlash",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage — Paradox",
    "filters": [
      "Mage"
    ],
    "description": "On your next spell that risks Paradox, add Paradox dice equal to the successes that imposed this Condition.",
    "effect": "On your next spell that risks Paradox, add Paradox dice equal to the successes that imposed this Condition.",
    "resolution": "Fully contain a later Paradox, Scour the Condition from the Pattern, or allow it to lapse (the latter grants an Arcane Beat and taints the Pattern).",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, p. 116"
  },
  "Abyssal Imago": {
    "name": "Abyssal Imago",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage — Paradox",
    "filters": [
      "Mage"
    ],
    "description": "Each spell requires additional Reach equal to the Paradox successes that imposed this Condition. Without it, the spell automatically fails and its spellcasting pool is added to the Paradox pool.",
    "effect": "Each spell requires additional Reach equal to the Paradox successes that imposed this Condition. Without it, the spell automatically fails and its spellcasting pool is added to the Paradox pool.",
    "resolution": "Successfully cast a spell that does not risk Paradox, Scour the Condition, or allow it to lapse (Arcane Beat; Abyssal Pattern taint).",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, p. 116"
  },
  "Abyssal Nimbus": {
    "name": "Abyssal Nimbus",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage — Paradox",
    "filters": [
      "Mage"
    ],
    "description": "The mage and subjects affected by her Nimbus become Resonant to Abyssal entities (Open on exceptional Paradox success). Signature and Long-Term Nimbus reveal Abyssal corruption.",
    "effect": "The mage and subjects affected by her Nimbus become Resonant to Abyssal entities (Open on exceptional Paradox success). Signature and Long-Term Nimbus reveal Abyssal corruption.",
    "resolution": "An Abyssal entity uses the Condition to Manifest, the mage Scours it away, or it lapses (Arcane Beat; Abyssal Pattern taint).",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, p. 116"
  },
  "Abyssal Taint": {
    "name": "Abyssal Taint",
    "type": "condition",
    "group": "condition",
    "splat": "Mage — Paradox",
    "persistent": true,
    "beat_type": "none",
    "duration": "Permanent",
    "origin": "Paradox",
    "description": "Abyssal corruption is detectable in the mage’s Nimbus. Every spell adds 1 Paradox die, even within free Reach.",
    "effect": "Abyssal corruption is detectable in the mage’s Nimbus. Every spell adds 1 Paradox die, even within free Reach.",
    "resolution": "Scour: suffer 1 resistant lethal wound; gain no Mana or Arcane Beat.",
    "source_citation": "Mage: The Awakening 2e, p. 116",
    "filters": [
      "Mage"
    ]
  },
  "Actor": {
    "name": "Actor",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Memoria",
    "filters": [
      "Geist"
    ],
    "description": "The subject must play their assigned role in a Memoria Mystery Play or suffer the consequences of departing from its script.",
    "effect": "The subject must play their assigned role in a Memoria Mystery Play or suffer the consequences of departing from its script.",
    "resolution": "Complete the role, escape the Memoria, or alter its script through the relevant enhancement.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Addicted": {
    "name": "Addicted",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Mage; Vampire; Changeling",
    "filters": [
      "Vampire",
      "Mage",
      "Changeling"
    ],
    "description": "Dependence on a substance or behavior. When deprived, gain Deprived (−1 to Stamina-, Resolve- and Composure-based rolls).",
    "effect": "Dependence on a substance or behavior. When deprived, gain Deprived (−1 to Stamina-, Resolve- and Composure-based rolls).",
    "resolution": "Meaningful recovery through treatment, a character-defining change or a supernatural cure.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "CoD 2e / Mage 2e"
  },
  "Addled": {
    "name": "Addled",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "Interference with the Geist’s Remembrance alters or obscures the Bound’s memories as specified by the source.",
    "effect": "Interference with the Geist’s Remembrance alters or obscures the Bound’s memories as specified by the source.",
    "resolution": "Re-establish reliable memory or remove the supernatural disturbance.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Amnesia": {
    "name": "Amnesia",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "The Storyteller determines which memories are inaccessible and when they can be recalled.",
    "effect": "The Storyteller determines which memories are inaccessible and when they can be recalled.",
    "resolution": "Recover the missing memory, discover its significance, or resolve the associated story.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Arcadian Dreams": {
    "name": "Arcadian Dreams",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Changeling — Fae-Touched",
    "filters": [
      "Changeling"
    ],
    "description": "Recurring dreams provide clues about a specific missing or promise-bound changeling.",
    "effect": "Recurring dreams provide clues about a specific missing or promise-bound changeling.",
    "resolution": "Reunite with or definitively resolve the fate of the linked changeling.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Atavism": {
    "name": "Atavism",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Lunacy drives the subject toward instinctive aggression and violence.",
    "effect": "Lunacy drives the subject toward instinctive aggression and violence.",
    "resolution": "Destroy or escape the stimulus, or ride out the episode.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Awestruck": {
    "name": "Awestruck",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Lunacy makes the subject terrified of and deferential to the werewolf, hindering opposition.",
    "effect": "Lunacy makes the subject terrified of and deferential to the werewolf, hindering opposition.",
    "resolution": "Meaningful confrontation with the fear or source, or supernatural recovery.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Ban": {
    "name": "Ban",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "The subject must observe a supernatural taboo. Violations incur the consequences specified by its source.",
    "effect": "The subject must observe a supernatural taboo. Violations incur the consequences specified by its source.",
    "resolution": "Violate or fulfil the imposed Ban as defined by its source.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Berserk": {
    "name": "Berserk",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf; Changeling",
    "filters": [
      "Werewolf",
      "Changeling"
    ],
    "description": "The subject loses self-restraint and favors direct attacks over negotiation or defense, within the source’s action and duration restrictions.",
    "effect": "The subject loses self-restraint and favors direct attacks over negotiation or defense, within the source’s action and duration restrictions.",
    "resolution": "Remove or defeat the trigger, or regain control.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Bestial": {
    "name": "Bestial",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire; Changeling",
    "filters": [
      "Vampire",
      "Changeling"
    ],
    "description": "Predatory instincts compel hunting, feeding or aggression according to the triggering effect.",
    "effect": "Predatory instincts compel hunting, feeding or aggression according to the triggering effect.",
    "resolution": "Act decisively according to the Beast or instinct, or otherwise satisfy the trigger.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Blind": {
    "name": "Blind",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Sight-dependent tasks are impossible without alternative perception. The Storyteller adjudicates other penalties.",
    "effect": "Sight-dependent tasks are impossible without alternative perception. The Storyteller adjudicates other penalties.",
    "resolution": "The character regains sight or removes the cause of blindness.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Blind [Mage]": {
    "name": "Blind",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "Sight-dependent tasks are impossible without alternative perception. The Storyteller adjudicates other penalties; Mage Sight does not restore mundane vision.",
    "effect": "Sight-dependent tasks are impossible without alternative perception. The Storyteller adjudicates other penalties; Mage Sight does not restore mundane vision.",
    "resolution": "Restore sight or remove the spell/condition that caused blindness.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Bonded": {
    "name": "Bonded",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Gain +2 dice to influence or persuade the bonded animal. While together, the animal can benefit from your Animal Ken when resisting fear or coercion, or for an appropriate roll.",
    "effect": "Gain +2 dice to influence or persuade the bonded animal. While together, the animal can benefit from your Animal Ken when resisting fear or coercion, or for an appropriate roll.",
    "resolution": "The bond ends permanently, including through the animal’s death.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Bonding": {
    "name": "Bonding",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "Apply the Synergy or Bond improvement specified by the relationship-strengthening experience.",
    "effect": "Apply the Synergy or Bond improvement specified by the relationship-strengthening experience.",
    "resolution": "Complete the prescribed relationship or Synergy improvement.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Boneyard": {
    "name": "Boneyard",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "The Sin-Eater gains awareness throughout the haunted area. Movement, Tilts and Rules depend on purchased Boneyard enhancements.",
    "effect": "The Sin-Eater gains awareness throughout the haunted area. Movement, Tilts and Rules depend on purchased Boneyard enhancements.",
    "resolution": "The Boneyard expires, is relinquished or is displaced according to its activation.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Broken": {
    "name": "Broken",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Subtract 2 dice from Social and Resolve rolls. Attempts to use Intimidation suffer a −5 penalty instead. This Condition also prevents normal Willpower expenditure until resolved.",
    "effect": "Subtract 2 dice from Social and Resolve rolls. Attempts to use Intimidation suffer a −5 penalty instead. This Condition also prevents normal Willpower expenditure until resolved.",
    "resolution": "Back down or suffer an appropriate consequential failure because of Broken; an applicable Integrity change or exceptional breaking-point success may also resolve it.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Caul": {
    "name": "Caul",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "The Sin-Eater merges with the Geist. Purchased transformations consume their specified Plasm-derived charges.",
    "effect": "The Sin-Eater merges with the Geist. Purchased transformations consume their specified Plasm-derived charges.",
    "resolution": "The transformation ends, the charges expire or the Haunt’s specified trigger resolves it.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Charmed": {
    "name": "Charmed",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "Expend stored uses for the favorable coincidence or damage mitigation specified by the granting effect.",
    "effect": "Expend stored uses for the favorable coincidence or damage mitigation specified by the granting effect.",
    "resolution": "Expend the charm or end the originating magic.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Charmed [Vampire]": {
    "name": "Charmed",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "Majesty compels affection, cooperation and a desire to please the vampire.",
    "effect": "Majesty compels affection, cooperation and a desire to please the vampire.",
    "resolution": "Meaningful betrayal or rejection of the vampire, or supernatural influence ends.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Comatose": {
    "name": "Comatose",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Severe Clarity loss traps the changeling in an involuntary dream or withdrawn state, preventing ordinary waking activity.",
    "effect": "Severe Clarity loss traps the changeling in an involuntary dream or withdrawn state, preventing ordinary waking activity.",
    "resolution": "Recover sufficient Clarity or wake through appropriate aid.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Competitive": {
    "name": "Competitive",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire; Changeling",
    "filters": [
      "Vampire",
      "Changeling"
    ],
    "description": "The character prioritizes winning against a specific rival or in a particular contest, even at the expense of cooperation.",
    "effect": "The character prioritizes winning against a specific rival or in a particular contest, even at the expense of cooperation.",
    "resolution": "Win or lose an important contest, or accept another’s superiority.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Confused": {
    "name": "Confused",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire; Werewolf; Changeling",
    "filters": [
      "Vampire",
      "Werewolf",
      "Changeling"
    ],
    "description": "Difficulty interpreting instructions, priorities and complex situations impairs sustained mental effort.",
    "effect": "Difficulty interpreting instructions, priorities and complex situations impairs sustained mental effort.",
    "resolution": "Reorient through a meaningful successful action or the source ends.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Connected": {
    "name": "Connected",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Gain +2 dice on relevant rolls involving the specified organization or group. You may resolve Connected to claim a one-time +3 bonus to influence or work with that group, burning the connection.",
    "effect": "Gain +2 dice on relevant rolls involving the specified organization or group. You may resolve Connected to claim a one-time +3 bonus to influence or work with that group, burning the connection.",
    "resolution": "Use and exhaust the privileged connection, or sever that relationship.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Connected [Mage]": {
    "name": "Connected",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "Gain +2 dice on relevant rolls involving the named group. Resolve for a one-time +3 interaction bonus, sacrificing the connection.",
    "effect": "Gain +2 dice on relevant rolls involving the named group. Resolve for a one-time +3 interaction bonus, sacrificing the connection.",
    "resolution": "Use and lose the contact or sever the relationship.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e / CoD 2e"
  },
  "Cowed": {
    "name": "Cowed",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf; Changeling",
    "filters": [
      "Werewolf",
      "Changeling"
    ],
    "description": "The subject is reluctant to oppose the dominant figure and must overcome their imposed submission to defy them.",
    "effect": "The subject is reluctant to oppose the dominant figure and must overcome their imposed submission to defy them.",
    "resolution": "Successfully stand against the dominant figure.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Crippled": {
    "name": "Crippled",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Walking Speed is 1. Mobility aids may alter effective movement.",
    "effect": "Walking Speed is 1. Mobility aids may alter effective movement.",
    "resolution": "Recover mobility, or reach a significant story event where the impairment creates genuine danger or severe hindrance.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Cunning": {
    "name": "Cunning",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Gain the source’s Renown-related benefit on qualifying acts of cunning, deception or subtlety.",
    "effect": "Gain the source’s Renown-related benefit on qualifying acts of cunning, deception or subtlety.",
    "resolution": "Perform an appropriate Cunning act or use the benefit.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Curse": {
    "name": "Curse",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "The Sin-Eater may reflexively expend stored charges for effects granted by purchased Curse enhancements.",
    "effect": "The Sin-Eater may reflexively expend stored charges for effects granted by purchased Curse enhancements.",
    "resolution": "The charges are used, the curse is broken, or its mark is cleansed as specified by the Haunt.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Dead": {
    "name": "Dead",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "The Bound’s body is dead; the Geist acts under the death and Bargain rules. Natural healing cannot restore life.",
    "effect": "The Bound’s body is dead; the Geist acts under the death and Bargain rules. Natural healing cannot restore life.",
    "resolution": "Return to life under the Bargain or an appropriate supernatural restoration.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Defeated": {
    "name": "Defeated",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "The defeated Duel Arcane participant cannot spend Willpower or cast magic to harm the victor. The winner gains a Strong sympathetic connection to the defeated mage for the Condition’s duration.",
    "effect": "The defeated Duel Arcane participant cannot spend Willpower or cast magic to harm the victor. The winner gains a Strong sympathetic connection to the defeated mage for the Condition’s duration.",
    "resolution": "Publicly accept the defeat at meaningful personal cost, or suffer a significant exploitation by the winner.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Defiant": {
    "name": "Defiant",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "Breaking a Boneyard Rule exposes the subject to its specified punishment, including any effect of the creator’s Synergy.",
    "effect": "Breaking a Boneyard Rule exposes the subject to its specified punishment, including any effect of the creator’s Synergy.",
    "resolution": "Submit to an appropriate punishment or make meaningful restitution for the breach.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Delusion": {
    "name": "Delusion",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Lunacy distorts perception, provoking fear or mistaken interpretations of events.",
    "effect": "Lunacy distorts perception, provoking fear or mistaken interpretations of events.",
    "resolution": "Escape the Lunacy and regain a reliable grasp of events.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Delusional": {
    "name": "Delusional",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Vampire; Changeling",
    "filters": [
      "Vampire",
      "Changeling"
    ],
    "description": "A false belief persists despite contrary evidence and shapes decisions and social responses.",
    "effect": "A false belief persists despite contrary evidence and shapes decisions and social responses.",
    "resolution": "Strong evidence and meaningful confrontation with the delusion.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Demoralized": {
    "name": "Demoralized",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf; Changeling",
    "filters": [
      "Werewolf",
      "Changeling"
    ],
    "description": "Defeat undermines confidence and initiative in related actions.",
    "effect": "Defeat undermines confidence and initiative in related actions.",
    "resolution": "Achieve a meaningful success or receive effective support.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Dependent": {
    "name": "Dependent",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "A feeding relationship creates obsessive attachment to the vampire and compromises the mortal’s willingness to separate.",
    "effect": "A feeding relationship creates obsessive attachment to the vampire and compromises the mortal’s willingness to separate.",
    "resolution": "Break the attachment through prolonged separation or another decisive rupture.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Deprived": {
    "name": "Deprived",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Subtract 1 die from every roll involving Stamina, Resolve or Composure while deprived of the specified substance, habit or need.",
    "effect": "Subtract 1 die from every roll involving Stamina, Resolve or Composure while deprived of the specified substance, habit or need.",
    "resolution": "Satisfy the deprivation or overcome it through effective treatment.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Dirge": {
    "name": "Dirge",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "A subject affected by the haunting song experiences the indicated emotional direction. Acting in concert with the song grants +2 dice to relevant rolls; opposing it may require resisting the supernatural compulsion.",
    "effect": "A subject affected by the haunting song experiences the indicated emotional direction. Acting in concert with the song grants +2 dice to relevant rolls; opposing it may require resisting the supernatural compulsion.",
    "resolution": "A different character shakes the subject out of it with an instant action, or the Haunt ends.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Disabled": {
    "name": "Disabled",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Mage; Changeling",
    "filters": [
      "Mage",
      "Changeling"
    ],
    "description": "Movement or use of the affected body part is restricted as specified by the injury or spell.",
    "effect": "Movement or use of the affected body part is restricted as specified by the injury or spell.",
    "resolution": "Regain function or end the supernatural cause.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Disoriented": {
    "name": "Disoriented",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Unreliable spatial awareness hampers navigation and purposeful movement.",
    "effect": "Unreliable spatial awareness hampers navigation and purposeful movement.",
    "resolution": "Recenter in a safe or stable situation.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Dissociation": {
    "name": "Dissociation",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Emotional detachment and uncertainty about reality impair social engagement and assessment of events.",
    "effect": "Emotional detachment and uncertainty about reality impair social engagement and assessment of events.",
    "resolution": "Ground oneself through undeniable reality or meaningful connection.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Distracted": {
    "name": "Distracted",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire; Changeling",
    "filters": [
      "Vampire",
      "Changeling"
    ],
    "description": "The distraction impairs concentration, extended effort and precision.",
    "effect": "The distraction impairs concentration, extended effort and precision.",
    "resolution": "Escape or remove the source of distraction.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Dominated": {
    "name": "Dominated",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "The victim must obey the specific Dominate command within its defined scope and duration.",
    "effect": "The victim must obey the specific Dominate command within its defined scope and duration.",
    "resolution": "Fulfil the command or the supernatural command expires or is broken.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Drained": {
    "name": "Drained",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "Blood loss impairs strenuous activity according to its severity and source.",
    "effect": "Blood loss impairs strenuous activity according to its severity and source.",
    "resolution": "Recover sufficient blood or rest.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Dream Assailant": {
    "name": "Dream Assailant",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "A hostile dream attacks the intruder; harm carries over according to the dream-combat rules.",
    "effect": "A hostile dream attacks the intruder; harm carries over according to the dream-combat rules.",
    "resolution": "Escape or end the hostile dream interaction.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Dream Infiltrator": {
    "name": "Dream Infiltrator",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Dream inhabitants recognize the intruder as unwelcome, hindering deception and unobtrusive travel.",
    "effect": "Dream inhabitants recognize the intruder as unwelcome, hindering deception and unobtrusive travel.",
    "resolution": "Restore the dream’s acceptance or leave it.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Dream Intruder": {
    "name": "Dream Intruder",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "The dream’s inhabitants and events oppose the intruder’s interference.",
    "effect": "The dream’s inhabitants and events oppose the intruder’s interference.",
    "resolution": "Leave the dream or restore its stability.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Easy Prey": {
    "name": "Easy Prey",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "The marked quarry leaves clues that aid the specified hunter or hunting power.",
    "effect": "The marked quarry leaves clues that aid the specified hunter or hunting power.",
    "resolution": "Successfully obscure or break the trail.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Echoes": {
    "name": "Echoes",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "Intrusive memories or traits of the Geist impose the recorded impulse or conflict on the Bound.",
    "effect": "Intrusive memories or traits of the Geist impose the recorded impulse or conflict on the Bound.",
    "resolution": "Process the intrusive memory or resolve its associated Remembrance.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Ecstatic": {
    "name": "Ecstatic",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "Blood sorcery stimulates the Beast; apply the triggering power’s situational benefits.",
    "effect": "Blood sorcery stimulates the Beast; apply the triggering power’s situational benefits.",
    "resolution": "Expend the benefit or circumstances change.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Embarrassing Secret": {
    "name": "Embarrassing Secret",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Another party can exploit a damaging secret. If the secret becomes public, remove Embarrassing Secret and apply Notoriety instead.",
    "effect": "Another party can exploit a damaging secret. If the secret becomes public, remove Embarrassing Secret and apply Notoriety instead.",
    "resolution": "The damaging secret is revealed or no longer provides leverage.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Enervated": {
    "name": "Enervated",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Mage; Vampire",
    "filters": [
      "Vampire",
      "Mage"
    ],
    "description": "Advanced soul loss reduces available Willpower and impairs supernatural or moral actions according to the stage of deprivation.",
    "effect": "Advanced soul loss reduces available Willpower and impairs supernatural or moral actions according to the stage of deprivation.",
    "resolution": "Recover the soul before deprivation progresses.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, soul-loss rules"
  },
  "Enslaved": {
    "name": "Enslaved",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "Dominate conditioning binds the victim to the controlling vampire’s established instructions.",
    "effect": "Dominate conditioning binds the victim to the controlling vampire’s established instructions.",
    "resolution": "Break the conditioning through supernatural means or its defined escape condition.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Enthralled": {
    "name": "Enthralled",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "Majesty compels devotion to the vampire, prioritizing their wishes and approval over other loyalties.",
    "effect": "Majesty compels devotion to the vampire, prioritizing their wishes and approval over other loyalties.",
    "resolution": "Break the supernatural attachment.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Essence Overload": {
    "name": "Essence Overload",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Excess Essence destabilizes the werewolf; apply the specified physical consequences when losing the excess.",
    "effect": "Excess Essence destabilizes the werewolf; apply the specified physical consequences when losing the excess.",
    "resolution": "Reduce Essence to safe levels.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Exhausted": {
    "name": "Exhausted",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Severe exhaustion impairs strenuous physical actions and resistance to unconsciousness.",
    "effect": "Severe exhaustion impairs strenuous physical actions and resistance to unconsciousness.",
    "resolution": "Obtain genuinely restful sleep.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "False Memories": {
    "name": "False Memories",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "The character accepts implanted or altered memories as true.",
    "effect": "The character accepts implanted or altered memories as true.",
    "resolution": "Recover the truth or original memories.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Fatigued": {
    "name": "Fatigued",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Insufficient rest impairs concentration and stamina; continued exertion can worsen fatigue.",
    "effect": "Insufficient rest impairs concentration and stamina; continued exertion can worsen fatigue.",
    "resolution": "Proper restorative sleep.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Ferry Bound": {
    "name": "Ferry Bound",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "The Bound may ferry travelers through Underworld rivers in exchange for the specified price.",
    "effect": "The Bound may ferry travelers through Underworld rivers in exchange for the specified price.",
    "resolution": "Complete the passage and pay/collect its price, or end the duty according to the effect.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Flatlining": {
    "name": "Flatlining",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "Low Synergy disrupts cooperation between Bound and Geist and may restrict their shared benefits.",
    "effect": "Low Synergy disrupts cooperation between Bound and Geist and may restrict their shared benefits.",
    "resolution": "Repair the relationship and restore the required Synergy threshold.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Fragile": {
    "name": "Fragile",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Damaged Clarity increases vulnerability to further Clarity-breaking events.",
    "effect": "Damaged Clarity increases vulnerability to further Clarity-breaking events.",
    "resolution": "Stabilize Clarity or remove the source of fragility.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Frightened": {
    "name": "Frightened",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire; Changeling",
    "filters": [
      "Vampire",
      "Changeling"
    ],
    "description": "Overwhelming fear of a specific threat compels flight or avoidance and hinders confrontation.",
    "effect": "Overwhelming fear of a specific threat compels flight or avoidance and hinders confrontation.",
    "resolution": "Reach safety or directly overcome the source of fear.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Fugue": {
    "name": "Fugue",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "When circumstances evoke the trauma that caused the Fugue, roll Resolve + Composure. On failure, the Storyteller may direct the character for the scene as they flee or avoid the trigger.",
    "effect": "When circumstances evoke the trauma that caused the Fugue, roll Resolve + Composure. On failure, the Storyteller may direct the character for the scene as they flee or avoid the trigger.",
    "resolution": "Suffer a significant consequence of an episode, or meet the relevant Integrity/breaking-point recovery condition.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Ghost-Marked": {
    "name": "Ghost-Marked",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "A ghost leaves a persistent mark whose Anchor status and restrictions depend on the causing effect.",
    "effect": "A ghost leaves a persistent mark whose Anchor status and restrictions depend on the causing effect.",
    "resolution": "Remove the mark with appropriate supernatural intervention.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Glamour Addicted": {
    "name": "Glamour Addicted",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Glamour dependence causes withdrawal or compulsive pursuit of Glamour when deprived.",
    "effect": "Glamour dependence causes withdrawal or compulsive pursuit of Glamour when deprived.",
    "resolution": "Meaningfully overcome the addiction or satisfy its specified recovery requirements.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Glorious": {
    "name": "Glorious",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Gain the source’s Renown-related benefit on qualifying courageous, impressive or publicly noteworthy acts.",
    "effect": "Gain the source’s Renown-related benefit on qualifying courageous, impressive or publicly noteworthy acts.",
    "resolution": "Perform or use an appropriate act of Glory.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Goblin Queen": {
    "name": "Goblin Queen",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Goblin influence alters the character’s Hedge relationships, obligations and behavior toward goblin society.",
    "effect": "Goblin influence alters the character’s Hedge relationships, obligations and behavior toward goblin society.",
    "resolution": "Reverse the transformation through the specific supernatural remedy.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Guilty": {
    "name": "Guilty",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "−2 dice to Resolve- or Composure-based rolls defending against Subterfuge, Empathy or Intimidation.",
    "effect": "−2 dice to Resolve- or Composure-based rolls defending against Subterfuge, Empathy or Intimidation.",
    "resolution": "Confess the wrongdoing, make restitution, or otherwise genuinely atone.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Hedge Addiction": {
    "name": "Hedge Addiction",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Changeling; Fae-Touched",
    "filters": [
      "Changeling"
    ],
    "description": "Compulsive desire to return to the Hedge interferes with other priorities and relationships.",
    "effect": "Compulsive desire to return to the Hedge interferes with other priorities and relationships.",
    "resolution": "Break the supernatural addiction through prolonged recovery or appropriate resolution.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Hedge Denizen": {
    "name": "Hedge Denizen",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Progressive attachment to Hedge existence and goblin behavior displaces mortal or changeling ties.",
    "effect": "Progressive attachment to Hedge existence and goblin behavior displaces mortal or changeling ties.",
    "resolution": "Reverse the transformation or satisfy its special escape requirement.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Honorable": {
    "name": "Honorable",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Gain the source’s Renown-related benefit on qualifying acts of honor, fairness or keeping one’s word.",
    "effect": "Gain the source’s Renown-related benefit on qualifying acts of honor, fairness or keeping one’s word.",
    "resolution": "Demonstrate or use the associated Honor.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Humbled": {
    "name": "Humbled",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "The mage cannot willingly harm the specific person or ideal that inspired this Condition.",
    "effect": "The mage cannot willingly harm the specific person or ideal that inspired this Condition.",
    "resolution": "Defend the subject at significant cost or confront the imposed ideal in a meaningful way.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Humbled [Vampire]": {
    "name": "Humbled",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "Guilt, faith or judgment undermines the vampire’s pride and may suppress Beast-driven choices.",
    "effect": "Guilt, faith or judgment undermines the vampire’s pride and may suppress Beast-driven choices.",
    "resolution": "Act in accordance with the humbling lesson or the effect expires.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Hunted": {
    "name": "Hunted",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "The named hunter is actively tracking the character beyond the immediate encounter.",
    "effect": "The named hunter is actively tracking the character beyond the immediate encounter.",
    "resolution": "Defeat, permanently evade, or otherwise neutralize the hunter.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Indebted": {
    "name": "Indebted",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "Neglecting a Touchstone incurs a spiritual debt or obligation to that Touchstone.",
    "effect": "Neglecting a Touchstone incurs a spiritual debt or obligation to that Touchstone.",
    "resolution": "Make meaningful amends and fulfill the neglected relationship.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Informed": {
    "name": "Informed",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "After a relevant non-combat Skill roll, upgrade a failure to one success or an ordinary success to exceptional success. Dramatic failures are ineligible.",
    "effect": "After a relevant non-combat Skill roll, upgrade a failure to one success or an ordinary success to exceptional success. Dramatic failures are ineligible.",
    "resolution": "Use the result upgrade.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions, p. 289"
  },
  "Inspired": {
    "name": "Inspired",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Before a relevant roll, regain 1 Willpower and reduce the exceptional-success threshold from 5 successes to 3.",
    "effect": "Before a relevant roll, regain 1 Willpower and reduce the exceptional-success threshold from 5 successes to 3.",
    "resolution": "Invoke this benefit before rolling.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions, p. 289"
  },
  "Intoxicated": {
    "name": "Intoxicated",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "Substances in consumed blood impair judgment, perception or coordination according to the substance and its duration.",
    "effect": "Substances in consumed blood impair judgment, perception or coordination according to the substance and its duration.",
    "resolution": "The substance leaves the system.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Invisible Predator": {
    "name": "Invisible Predator",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "The hunter is harder for prey to detect or follow during the hunting actions specified by the ability.",
    "effect": "The hunter is harder for prey to detect or follow during the hunting actions specified by the ability.",
    "resolution": "Reveal oneself, lose concealment, or the hunt ends.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Isolated": {
    "name": "Isolated",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "The Hunter’s Aspect discourages relying on allies and impairs cooperation.",
    "effect": "The Hunter’s Aspect discourages relying on allies and impairs cooperation.",
    "resolution": "Rejoin or meaningfully rely on allies.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Jaded": {
    "name": "Jaded",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "The Beast’s priorities take precedence over human emotional ties.",
    "effect": "The Beast’s priorities take precedence over human emotional ties.",
    "resolution": "Meaningfully reconnect with Humanity or Touchstones.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Languid": {
    "name": "Languid",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "Apathy and detachment reduce the urgency of actions unrelated to the Beast’s immediate needs.",
    "effect": "Apathy and detachment reduce the urgency of actions unrelated to the Beast’s immediate needs.",
    "resolution": "Re-establish a meaningful Touchstone or human connection.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Lawbreaker": {
    "name": "Lawbreaker",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "Violating a Dominion’s Old Law incurs its specified supernatural judgment and punishment.",
    "effect": "Violating a Dominion’s Old Law incurs its specified supernatural judgment and punishment.",
    "resolution": "Accept the specified judgment, make restitution, or escape or overturn the Dominion’s authority.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Lethargic": {
    "name": "Lethargic",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire; Changeling",
    "filters": [
      "Vampire",
      "Changeling"
    ],
    "description": "Lack of energy impairs initiative, decisive action and sustained physical or mental effort.",
    "effect": "Lack of energy impairs initiative, decisive action and sustained physical or mental effort.",
    "resolution": "Rest, stimulation, or the source ends.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Leveraged": {
    "name": "Leveraged",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "The specified threat or obligation makes resisting its holder’s demands harder. Distinct sources may coexist.",
    "effect": "The specified threat or obligation makes resisting its holder’s demands harder. Distinct sources may coexist.",
    "resolution": "Refuse a demand despite the leverage, escape the pressure, or turn the tables on the source.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Lost": {
    "name": "Lost",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "No reliable progress toward the destination until reoriented. Navigate with Wits + Streetwise (urban) or Wits + Survival (outdoors), as appropriate.",
    "effect": "No reliable progress toward the destination until reoriented. Navigate with Wits + Streetwise (urban) or Wits + Survival (outdoors), as appropriate.",
    "resolution": "Navigate successfully, find a guide, or abandon the original destination.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Lost Tracker": {
    "name": "Lost Tracker",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "A failed hunt impairs attempts to resume pursuit of the same prey.",
    "effect": "A failed hunt impairs attempts to resume pursuit of the same prey.",
    "resolution": "Successfully relocate or track meaningful prey.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Lured": {
    "name": "Lured",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Supernatural attraction compels the subject to approach the specified person or place.",
    "effect": "Supernatural attraction compels the subject to approach the specified person or place.",
    "resolution": "Reach or confront the lure, or break its supernatural influence.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Madness": {
    "name": "Madness",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Once per chapter, the Storyteller may impose a situational penalty of up to 10 − Integrity dice on a Mental or Social roll.",
    "effect": "Once per chapter, the Storyteller may impose a situational penalty of up to 10 − Integrity dice on a Mental or Social roll.",
    "resolution": "Fail a roll because of the Condition, or meet the specified Integrity/breaking-point recovery criterion.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Marionette": {
    "name": "Marionette",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "The Bound animates the subject or object with Plasm. Directing it for a turn requires an instant action; resistance follows the Haunt rules.",
    "effect": "The Bound animates the subject or object with Plasm. Directing it for a turn requires an instant action; resistance follows the Haunt rules.",
    "resolution": "Break the control or end the Haunt; Servant enhancement can replace this Condition.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Megalomaniacal": {
    "name": "Megalomaniacal",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "Hubris imposes the behavioral restrictions and consequences of the originating Wisdom breaking point.",
    "effect": "Hubris imposes the behavioral restrictions and consequences of the originating Wisdom breaking point.",
    "resolution": "Suffer the stated consequence of your hubris or resolve it through appropriate personal realization.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Wisdom conditions"
  },
  "Memento Collector": {
    "name": "Memento Collector",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "A collection of Mementos grants the source’s specified social standing among other Bound.",
    "effect": "A collection of Mementos grants the source’s specified social standing among other Bound.",
    "resolution": "Lose the collection’s significance or fulfill its associated story condition.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Memoria": {
    "name": "Memoria",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "The subject perceives or enters a memory of the dead; roles, participants and consequences depend on the Haunt’s enhancements.",
    "effect": "The subject perceives or enters a memory of the dead; roles, participants and consequences depend on the Haunt’s enhancements.",
    "resolution": "Complete the recollection, leave the scene or resolve the specific Haunt effect.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Memory Bleed": {
    "name": "Memory Bleed",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "Another identity’s memories or motivations intrude; apply any source-specific loss of Clarity.",
    "effect": "Another identity’s memories or motivations intrude; apply any source-specific loss of Clarity.",
    "resolution": "Disentangle the memories or confront the identity producing them.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Mesmerized": {
    "name": "Mesmerized",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "The target is receptive to the specific Dominate instruction established by the vampire.",
    "effect": "The target is receptive to the specific Dominate instruction established by the vampire.",
    "resolution": "The Dominate interaction ends or supernatural influence is broken.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Moon Taint": {
    "name": "Moon Taint",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "A werewolf’s bite imparts Luna’s influence, with subsequent supernatural consequences determined by the bite’s effect.",
    "effect": "A werewolf’s bite imparts Luna’s influence, with subsequent supernatural consequences determined by the bite’s effect.",
    "resolution": "Transformation resolves or the supernatural taint is removed.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Mute": {
    "name": "Mute",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Speech is unavailable; verbal commands, persuasion and incantations require an alternative method where possible.",
    "effect": "Speech is unavailable; verbal commands, persuasion and incantations require an alternative method where possible.",
    "resolution": "Regain the ability to speak or remove the underlying cause.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Mystery Commands": {
    "name": "Mystery Commands",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "The mage is compelled by the specified Mystery-derived command, with its recorded strength and consequences.",
    "effect": "The mage is compelled by the specified Mystery-derived command, with its recorded strength and consequences.",
    "resolution": "Obey, meaningfully resist, or otherwise resolve the originating Mystery’s directive.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Mystified": {
    "name": "Mystified",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "The Hunter’s Aspect makes the Shadow or crossing the Gauntlet psychologically threatening.",
    "effect": "The Hunter’s Aspect makes the Shadow or crossing the Gauntlet psychologically threatening.",
    "resolution": "Meaningfully cross or confront the feared boundary.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Notoriety": {
    "name": "Notoriety",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Subtract 2 dice from Social rolls involving people who know the damaging reputation. Social Maneuvering against such people requires one additional Door.",
    "effect": "Subtract 2 dice from Social rolls involving people who know the damaging reputation. Social Maneuvering against such people requires one additional Door.",
    "resolution": "Debunk the story or repair the reputation sufficiently.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Numb": {
    "name": "Numb",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Severe Clarity damage suppresses emotion and impairs emotional connection or expression.",
    "effect": "Severe Clarity damage suppresses emotion and impairs emotional connection or expression.",
    "resolution": "Meaningfully reconnect with emotion or people, or recover through Clarity.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Oathbreaker": {
    "name": "Oathbreaker",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "A broken Wyrd-backed promise makes the character recognizable as unreliable under the oath’s rules.",
    "effect": "A broken Wyrd-backed promise makes the character recognizable as unreliable under the oath’s rules.",
    "resolution": "Make restitution and satisfy the supernatural consequences of the broken oath.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Obliged": {
    "name": "Obliged",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Changeling — Fae-Touched",
    "filters": [
      "Changeling"
    ],
    "description": "A promise or supernatural bargain imposes a specified duty and conditions any associated benefit on its fulfillment.",
    "effect": "A promise or supernatural bargain imposes a specified duty and conditions any associated benefit on its fulfillment.",
    "resolution": "Fulfil the promised service or the bargain is otherwise ended.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Obsession": {
    "name": "Obsession",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Gain 9-again on rolls directly pursuing the obsession.",
    "effect": "Gain 9-again on rolls directly pursuing the obsession.",
    "resolution": "Fulfil the obsession, renounce it meaningfully, or overcome it through treatment.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Obsession [Mage]": {
    "name": "Obsession",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "Gain 9-again on rolls directly pursuing this fixation. Character-sheet Obsessions award Arcane Beats separately.",
    "effect": "Gain 9-again on rolls directly pursuing this fixation. Character-sheet Obsessions award Arcane Beats separately.",
    "resolution": "Fulfil or overcome this particular fixation.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e / CoD 2e"
  },
  "Oracle": {
    "name": "Oracle",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "Use death-sight or Underworld travel to consult a Mystery. Questions and limits depend on Oracle dots and purchased enhancements.",
    "effect": "Use death-sight or Underworld travel to consult a Mystery. Questions and limits depend on Oracle dots and purchased enhancements.",
    "resolution": "Return to ordinary awareness or complete the consultation.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Paranoid": {
    "name": "Paranoid",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf; Changeling",
    "filters": [
      "Werewolf",
      "Changeling"
    ],
    "description": "Suspicion of others impairs trust, cooperation and relevant Social interactions.",
    "effect": "Suspicion of others impairs trust, cooperation and relevant Social interactions.",
    "resolution": "Trust another at meaningful personal risk.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Pure": {
    "name": "Pure",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Gain the source’s Renown-related benefit on actions aligned with its Pure ideal.",
    "effect": "Gain the source’s Renown-related benefit on actions aligned with its Pure ideal.",
    "resolution": "Demonstrate or use the associated Purity.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Rage": {
    "name": "Rage",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "Ghostly rage grants the damage type, weapon rating, range and Tilts permitted by Rage and its purchased enhancements.",
    "effect": "Ghostly rage grants the damage type, weapon rating, range and Tilts permitted by Rage and its purchased enhancements.",
    "resolution": "The Haunt ends or its effects are expended.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Rampant": {
    "name": "Rampant",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "Compelled to use magic even for everyday problems; resisting requires Willpower or Storyteller adjudication according to the trigger.",
    "effect": "Compelled to use magic even for everyday problems; resisting requires Willpower or Storyteller adjudication according to the trigger.",
    "resolution": "Let magic create significant complications, or overcome the compulsion.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Wisdom conditions"
  },
  "Raptured": {
    "name": "Raptured",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "Mystical ecstasy encourages identification with the Beast, reverence and surrender to predatory impulses.",
    "effect": "Mystical ecstasy encourages identification with the Beast, reverence and surrender to predatory impulses.",
    "resolution": "Act on the fervour or it fades.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Ravaged": {
    "name": "Ravaged",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Fae predation impairs emotional engagement, confidence and self-directed choices.",
    "effect": "Fae predation impairs emotional engagement, confidence and self-directed choices.",
    "resolution": "Recover through meaningful restoration of identity or agency.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Reception": {
    "name": "Reception",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Lunacy makes the mortal receptive to spirits or Shadow phenomena according to the source’s mode of influence.",
    "effect": "Lunacy makes the mortal receptive to spirits or Shadow phenomena according to the source’s mode of influence.",
    "resolution": "Exposure ends or spiritual influence is resolved.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Reckless": {
    "name": "Reckless",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Compelled toward risky decisions at the expense of caution and planning.",
    "effect": "Compelled toward risky decisions at the expense of caution and planning.",
    "resolution": "Suffer meaningful consequences or consciously pull back from the danger.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Regalia": {
    "name": "Regalia",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "The krewe’s investiture grants the specified authority, protection or dot-rated benefit.",
    "effect": "The krewe’s investiture grants the specified authority, protection or dot-rated benefit.",
    "resolution": "The blessing ends or is taken back by the krewe.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Resigned": {
    "name": "Resigned",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "The Hunter’s Aspect fosters acceptance of inevitable death, discouraging self-preservation.",
    "effect": "The Hunter’s Aspect fosters acceptance of inevitable death, discouraging self-preservation.",
    "resolution": "Demonstrate survival or self-preservation despite the fatalism.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Sated": {
    "name": "Sated",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "The Beast’s hunger-driven aggression or frenzy pressure eases according to the originating effect.",
    "effect": "The Beast’s hunger-driven aggression or frenzy pressure eases according to the originating effect.",
    "resolution": "Hunger or predatory pressure returns.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Scarred": {
    "name": "Scarred",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "A lasting moral or psychological injury influences subsequent Humanity-related decisions.",
    "effect": "A lasting moral or psychological injury influences subsequent Humanity-related decisions.",
    "resolution": "An appropriate act of recovery or redemption.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Servant": {
    "name": "Servant",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "Enhanced Marionette control permits ongoing commands without turn-by-turn direction; target limits and duration follow the enhancements.",
    "effect": "Enhanced Marionette control permits ongoing commands without turn-by-turn direction; target limits and duration follow the enhancements.",
    "resolution": "Break the supernatural subservience or let its Haunt duration expire.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Shadow Paranoia": {
    "name": "Shadow Paranoia",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Fear of the Shadow provokes suspicion and aggression toward Shadow-related threats or allies.",
    "effect": "Fear of the Shadow provokes suspicion and aggression toward Shadow-related threats or allies.",
    "resolution": "Reach safety or confront and overcome the Shadow threat.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Shadowlashed": {
    "name": "Shadowlashed",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "A failed Rite compromises the werewolf’s relationship with the Shadow or subsequent relevant Rites.",
    "effect": "A failed Rite compromises the werewolf’s relationship with the Shadow or subsequent relevant Rites.",
    "resolution": "Make restitution or perform an appropriate spiritual action.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Shaken": {
    "name": "Shaken",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Before a roll affected by fear, you may choose to fail it outright. No passive dice penalty.",
    "effect": "Before a roll affected by fear, you may choose to fail it outright. No passive dice penalty.",
    "resolution": "Choose the voluntary failure; gain the normal resolution Beat.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Shroud": {
    "name": "Shroud",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "The Bound gains ghostlike qualities and interaction with Twilight. Protections, movement and Numina depend on purchased Shroud enhancements.",
    "effect": "The Bound gains ghostlike qualities and interaction with Twilight. Protections, movement and Numina depend on purchased Shroud enhancements.",
    "resolution": "Dismiss the Shroud, expend the permitted effect or end the Haunt.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Siskur-Dah": {
    "name": "Siskur-Dah",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "The Sacred Hunt grants the rite’s tracking, coordination and supernatural benefits against its specified quarry.",
    "effect": "The Sacred Hunt grants the rite’s tracking, coordination and supernatural benefits against its specified quarry.",
    "resolution": "The prey is brought down, the hunt is abandoned, or the rite otherwise concludes.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Sleepwalking": {
    "name": "Sleepwalking",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "The subject may act while not fully aware and later forget those actions.",
    "effect": "The subject may act while not fully aware and later forget those actions.",
    "resolution": "Restore stable sleep and resolve the supernatural cause.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Soul Shocked": {
    "name": "Soul Shocked",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage; Changeling",
    "filters": [
      "Mage",
      "Changeling"
    ],
    "description": "When inflicted, roll current Willpower points as a dice pool without 10-again; retain 1 Willpower point per success and lose the rest (do not roll a chance die at zero). While affected, do not regain Willpower through Virtue/Vice, though rest and other methods still work.",
    "effect": "When inflicted, roll current Willpower points as a dice pool without 10-again; retain 1 Willpower point per success and lose the rest (do not roll a chance die at zero). While affected, do not regain Willpower through Virtue/Vice, though rest and other methods still work.",
    "resolution": "Complete reintegration and appropriate recovery after the out-of-body experience.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Soulless": {
    "name": "Soulless",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Mage; Vampire",
    "filters": [
      "Vampire",
      "Mage"
    ],
    "description": "Soul loss impairs Willpower recovery, causes escalating moral and psychological deterioration, and increases vulnerability to possession.",
    "effect": "Soul loss impairs Willpower recovery, causes escalating moral and psychological deterioration, and increases vulnerability to possession.",
    "resolution": "Recover the soul or halt the process before irreversible loss.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, soul-loss rules"
  },
  "Spooked": {
    "name": "Spooked",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Fear and fascination with a supernatural experience compel risky investigation.",
    "effect": "Fear and fascination with a supernatural experience compel risky investigation.",
    "resolution": "Act on the fascination in a way that hinders the group or causes a significant complication.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Steadfast": {
    "name": "Steadfast",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "After an ordinary failed roll, gain one success. If the original roll was a chance die, roll one regular die instead (8+ success, 10-again).",
    "effect": "After an ordinary failed roll, gain one success. If the original roll was a chance die, roll one regular die instead (8+ success, 10-again).",
    "resolution": "Use this benefit on an eligible failed roll.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Stoic": {
    "name": "Stoic",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Emotional restraint may aid composure and impair empathy or passion where specified by the source.",
    "effect": "Emotional restraint may aid composure and impair empathy or passion where specified by the source.",
    "resolution": "Meaningfully express vulnerability or emotion.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Strained": {
    "name": "Strained",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "Suffer −1 die on the next breaking-point roll arising from witnessing magic. If you have the Strained Merit and avoid the roll, the penalty stacks by −1 each time (maximum −5), after which you must face the roll.",
    "effect": "Suffer −1 die on the next breaking-point roll arising from witnessing magic. If you have the Strained Merit and avoid the roll, the penalty stacks by −1 each time (maximum −5), after which you must face the roll.",
    "resolution": "Resolve the initiating magical confrontation or its psychological consequences.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Stumbled": {
    "name": "Stumbled",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire; Werewolf",
    "filters": [
      "Vampire",
      "Werewolf"
    ],
    "description": "A complication blocks further progress on a project or extended action until addressed.",
    "effect": "A complication blocks further progress on a project or extended action until addressed.",
    "resolution": "Address the complication or abandon the project.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Subservient": {
    "name": "Subservient",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "Supernatural dominance hinders disobedience to the named vampire within the power’s limits.",
    "effect": "Supernatural dominance hinders disobedience to the named vampire within the power’s limits.",
    "resolution": "Break the supernatural dominance.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Swaggering": {
    "name": "Swaggering",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "The Hunter’s Aspect causes overconfidence, discouraging caution, preparation and help from allies.",
    "effect": "The Hunter’s Aspect causes overconfidence, discouraging caution, preparation and help from allies.",
    "resolution": "Failure caused by overconfidence or humbling reliance on aid.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Swooned": {
    "name": "Swooned",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Subtract 2 dice on rolls that would harm or work against the object of affection. That person gains +2 dice to Social rolls against you; their Social Maneuvering impression improves one level (maximum Perfect).",
    "effect": "Subtract 2 dice on rolls that would harm or work against the object of affection. That person gains +2 dice to Social rolls against you; their Social Maneuvering impression improves one level (maximum Perfect).",
    "resolution": "Put yourself at risk for the person, suffer danger because of them, or deliberately fail to resist their Social action.",
    "source_url": "https://anyflip.com/usqxr/yybn/basic/",
    "source_citation": "CoD 2e, Conditions"
  },
  "Swooning": {
    "name": "Swooning",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire; Werewolf",
    "filters": [
      "Vampire",
      "Werewolf"
    ],
    "description": "Unnatural attraction to a specific person impairs judgment and resistance to that person.",
    "effect": "Unnatural attraction to a specific person impairs judgment and resistance to that person.",
    "resolution": "The infatuation creates a meaningful problem or is rejected or broken.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Symbolic Focus": {
    "name": "Symbolic Focus",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "A Rite grants its specified benefit for the associated spirit-facing act.",
    "effect": "A Rite grants its specified benefit for the associated spirit-facing act.",
    "resolution": "Expend the ritual benefit.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Tainted": {
    "name": "Tainted",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "A diablerized soul influences the vampire through its memories, urges or supernatural consequences.",
    "effect": "A diablerized soul influences the vampire through its memories, urges or supernatural consequences.",
    "resolution": "Resolve the internal spiritual conflict.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Tasked": {
    "name": "Tasked",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "A specified command or duty binds the character, with consequences for fulfillment, neglect or defiance.",
    "effect": "A specified command or duty binds the character, with consequences for fulfillment, neglect or defiance.",
    "resolution": "Complete or definitively fail the task.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Tempted": {
    "name": "Tempted",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire",
    "filters": [
      "Vampire"
    ],
    "description": "After resisting frenzy, the Beast makes subsequent relevant temptation or frenzy checks more precarious.",
    "effect": "After resisting frenzy, the Beast makes subsequent relevant temptation or frenzy checks more precarious.",
    "resolution": "Succumb to or definitively overcome the next relevant frenzy trigger.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Theophany": {
    "name": "Theophany",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "A krewe achievement grants the source’s specified temporary spiritual benefit.",
    "effect": "A krewe achievement grants the source’s specified temporary spiritual benefit.",
    "resolution": "Its revelation produces a meaningful consequence or the relevant story completes.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Thrall": {
    "name": "Thrall",
    "type": "condition",
    "group": "condition",
    "persistent": true,
    "splat": "Mage; Vampire",
    "filters": [
      "Vampire",
      "Mage"
    ],
    "description": "Cannot spend Willpower or Experience, use Defense or cast spells. Also suffers Broken.",
    "effect": "Cannot spend Willpower or Experience, use Defense or cast spells. Also suffers Broken.",
    "resolution": "Restore the soul through the relevant supernatural intervention.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, soul-loss rules"
  },
  "Tomb": {
    "name": "Tomb",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist — Haunt",
    "filters": [
      "Geist"
    ],
    "description": "The Bound recreates an object or person from deathly memory; traits and limitations depend on the replica and purchased Tomb enhancements.",
    "effect": "The Bound recreates an object or person from deathly memory; traits and limitations depend on the replica and purchased Tomb enhancements.",
    "resolution": "The created replica is destroyed, dismissed or expires.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Triumphant": {
    "name": "Triumphant",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Mage",
    "filters": [
      "Mage"
    ],
    "description": "Exceptional success requires 3 successes instead of 5 on Social rolls with Awakened who know of the Duel Arcane victory.",
    "effect": "Exceptional success requires 3 successes instead of 5 on Social rolls with Awakened who know of the Duel Arcane victory.",
    "resolution": "The victory ceases to matter socially, or another consequential duel supersedes it.",
    "source_url": "https://pdfcoffee.com/mage-the-awakening-2e-pdf-free.html",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Unaware": {
    "name": "Unaware",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "The Hunter’s Aspect narrows attention, concealing relevant dangers or signs, particularly around the hunter’s bait.",
    "effect": "The Hunter’s Aspect narrows attention, concealing relevant dangers or signs, particularly around the hunter’s bait.",
    "resolution": "Notice or confront the hidden threat.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Unleashed": {
    "name": "Unleashed",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "The Geist manifests independently, using its own actions and Traits. Apply Bargain separation and Bond consequences.",
    "effect": "The Geist manifests independently, using its own actions and Traits. Apply Bargain separation and Bond consequences.",
    "resolution": "The Geist returns to the Bound or the separation ends.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Untraceable": {
    "name": "Untraceable",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Concealment restricts tracking until a suitable clue or countermeasure defeats it.",
    "effect": "Concealment restricts tracking until a suitable clue or countermeasure defeats it.",
    "resolution": "A tracker successfully re-establishes the trail.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Volatile": {
    "name": "Volatile",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "An unstable supernatural effect or item may discharge according to its specified trigger and backlash.",
    "effect": "An unstable supernatural effect or item may discharge according to its specified trigger and backlash.",
    "resolution": "Stabilize or remove the unstable source.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Wanton": {
    "name": "Wanton",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Vampire; Changeling",
    "filters": [
      "Vampire",
      "Changeling"
    ],
    "description": "Supernatural appetite compels immediate indulgence despite consequences.",
    "effect": "Supernatural appetite compels immediate indulgence despite consequences.",
    "resolution": "Meaningfully indulge the desire or break its hold.",
    "source_url": "https://github.com/Limpbark/vampire-the-requiem-2e/tree/main/packs-src/conditions"
  },
  "Wavering": {
    "name": "Wavering",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "The offended Geist withholds cooperation according to its specified demand or restriction.",
    "effect": "The offended Geist withholds cooperation according to its specified demand or restriction.",
    "resolution": "Meet the Geist’s demand, make amends or restore trust.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Weakened Bond": {
    "name": "Weakened Bond",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "description": "Unleashing or separation weakens the Bargain, with loss of the specified benefits until the Bond is restored.",
    "effect": "Unleashing or separation weakens the Bargain, with loss of the specified benefits until the Bond is restored.",
    "resolution": "Reunite and complete the requisite reconciliation or recovery.",
    "source_url": "https://anyflip.com/yckom/urox/basic",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Wise": {
    "name": "Wise",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Werewolf",
    "filters": [
      "Werewolf"
    ],
    "description": "Gain the source’s Renown-related benefit on qualifying acts of judgment, spiritual perception or insight.",
    "effect": "Gain the source’s Renown-related benefit on qualifying acts of judgment, spiritual perception or insight.",
    "resolution": "Demonstrate or use the associated Wisdom.",
    "source_url": "https://whitewolf.fandom.com/wiki/Werewolf%3A_The_Forsaken_2nd_Edition_Condition_Cards"
  },
  "Withdrawn": {
    "name": "Withdrawn",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Changeling"
    ],
    "description": "Fear or uncertainty impairs initiating contact, maintaining relationships and committing to action.",
    "effect": "Fear or uncertainty impairs initiating contact, maintaining relationships and committing to action.",
    "resolution": "Take meaningful action or engage despite the insecurity.",
    "source_url": "https://anyflip.com/pamxl/onlx/basic"
  },
  "Doomed": {
    "name": "Doomed",
    "type": "geist",
    "group": "condition",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Geist"
    ],
    "origin": "Key Doom",
    "description": "The affected Key source cannot unlock another Haunt until its Doom is resolved. Independent sources of the same Key remain usable.",
    "effect": "The affected Key source cannot unlock another Haunt until its Doom is resolved. Independent sources of the same Key remain usable.",
    "resolution": "Undergo the specific Doom attached to that Key source.",
    "source_citation": "Geist: The Sin-Eaters 2e, Keys"
  },
  "Anchor [Ephemeral]": {
    "name": "Anchor",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral — Ghost",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "The specified person, place or object ties the ghost to the living world; damage, relocation or severance affects the ghost’s options.",
    "effect": "The specified person, place or object ties the ghost to the living world; damage, relocation or severance affects the ghost’s options.",
    "resolution": "Destroy or remove the Anchor, or resolve the ghost's unfinished business."
  },
  "Infrastructure [Ephemeral]": {
    "name": "Infrastructure",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral — Angel",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "The associated Installation sustains its angel in the material world, including protection from normal Essence loss.",
    "effect": "The associated Installation sustains its angel in the material world, including protection from normal Essence loss.",
    "resolution": "Destroy, disable, or sever the relevant Infrastructure."
  },
  "Resonant [Ephemeral]": {
    "name": "Resonant",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral — Spirit/Goetia",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "The subject’s nature or emotional resonance enables the specified spirit or Goetia’s Influences or Manifestations.",
    "effect": "The subject’s nature or emotional resonance enables the specified spirit or Goetia’s Influences or Manifestations.",
    "resolution": "Remove or fundamentally change the relevant resonance."
  },
  "Open [Ephemeral]": {
    "name": "Open",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "The specified ephemeral entity can use Manifestations requiring Open on the subject.",
    "effect": "The specified ephemeral entity can use Manifestations requiring Open on the subject.",
    "resolution": "Remove the prerequisite influence Condition or successfully break the entity's access."
  },
  "Fettered [Ephemeral]": {
    "name": "Fettered",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "An ephemeral entity remains in Twilight, bound to a physical host it can interact with through its powers.",
    "effect": "An ephemeral entity remains in Twilight, bound to a physical host it can interact with through its powers.",
    "resolution": "Break the fetter, destroy the fetter, or successfully exorcise the entity."
  },
  "Urged [Ephemeral]": {
    "name": "Urged",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "A Fettered entity influences the living host’s behavior and impulses without assuming full control.",
    "effect": "A Fettered entity influences the living host’s behavior and impulses without assuming full control.",
    "resolution": "End the Fettered Condition or successfully break the entity's influence."
  },
  "Possessed [Ephemeral]": {
    "name": "Possessed",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "The entity controls the material host’s actions under the Possession Manifestation and its resistance rules.",
    "effect": "The entity controls the material host’s actions under the Possession Manifestation and its resistance rules.",
    "resolution": "The entity leaves, is driven out, or the host is destroyed."
  },
  "Controlled [Ephemeral]": {
    "name": "Controlled",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "The subject is prepared for permanent Claiming but has not yet merged with the entity.",
    "effect": "The subject is prepared for permanent Claiming but has not yet merged with the entity.",
    "resolution": "Break the conditioning or end the underlying Open access."
  },
  "Claimed [Ephemeral]": {
    "name": "Claimed",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "The entity and host form a lasting supernatural hybrid; bodily traits and powers follow Claiming rules.",
    "effect": "The entity and host form a lasting supernatural hybrid; bodily traits and powers follow Claiming rules.",
    "resolution": "Requires extraordinary supernatural intervention, destruction of the merged being, or a specific exorcism."
  },
  "Materialized [Ephemeral]": {
    "name": "Materialized",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "The entity has a tangible body in the material world and can be perceived and physically interacted with.",
    "effect": "The entity has a tangible body in the material world and can be perceived and physically interacted with.",
    "resolution": "The Manifestation ends, the entity dismisses it, or it is forced back into Twilight."
  },
  "Reaching [Ephemeral]": {
    "name": "Reaching",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral — Spirit",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "A spirit extends senses or powers across the Gauntlet while remaining in the Shadow.",
    "effect": "A spirit extends senses or powers across the Gauntlet while remaining in the Shadow.",
    "resolution": "The channel closes, the spirit ends it, or the effect is disrupted."
  },
  "Shadow Gate [Ephemeral]": {
    "name": "Shadow Gate",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral — Spirit",
    "filters": [
      "Ephemeral",
      "Core"
    ],
    "description": "A portal connects the material world and the Shadow, with access governed by its Manifestation.",
    "effect": "A portal connects the material world and the Shadow, with access governed by its Manifestation.",
    "resolution": "The gate closes, its duration ends, or it is disrupted."
  },
  "Underworld Gate [Ephemeral]": {
    "name": "Underworld Gate",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral — Ghost",
    "filters": [
      "Ephemeral",
      "Core",
      "Geist"
    ],
    "description": "A temporary portal connects the living world and Underworld; location, access and duration follow the opening power.",
    "effect": "A temporary portal connects the living world and Underworld; location, access and duration follow the opening power.",
    "resolution": "The gate closes, its duration ends, or it is disrupted."
  },
  "Bound Geist [Ephemeral]": {
    "name": "Bound Geist",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral — Geist",
    "filters": [
      "Ephemeral",
      "Geist"
    ],
    "description": "The Geist remains bound to the Sin-Eater until Unleashed. Rank, Ban, Bane and Manifestations follow the Bargain rules.",
    "effect": "The Geist remains bound to the Sin-Eater until Unleashed. Rank, Ban, Bane and Manifestations follow the Bargain rules.",
    "resolution": "The Bargain ends or the Geist becomes independently Unleashed.",
    "source_citation": "Geist: The Sin-Eaters 2e, ephemeral Conditions"
  },
  "Engulfed [Ephemeral]": {
    "name": "Engulfed",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral — Geist",
    "filters": [
      "Ephemeral",
      "Geist"
    ],
    "description": "A ghost is subsumed into another ghost in vulnerable hibernation and cannot act independently.",
    "effect": "A ghost is subsumed into another ghost in vulnerable hibernation and cannot act independently.",
    "resolution": "Be freed from the engulfing entity or end the controlling supernatural effect.",
    "source_citation": "Geist: The Sin-Eaters 2e, ephemeral Conditions"
  },
  "Familiar [Ephemeral]": {
    "name": "Familiar",
    "type": "condition",
    "group": "condition",
    "persistent": false,
    "splat": "Ephemeral — Mage",
    "filters": [
      "Ephemeral",
      "Mage"
    ],
    "description": "The bound familiar’s powers depend on its Rank, Manifestations, Essence, Ban, Bane and binding Merit.",
    "effect": "The bound familiar’s powers depend on its Rank, Manifestations, Essence, Ban, Bane and binding Merit.",
    "resolution": "The bond is ended or the familiar is released.",
    "source_citation": "Mage: The Awakening 2e, familiars"
  },
  "Blizzard [Environmental Tilt]": {
    "name": "Blizzard",
    "type": "tilt",
    "group": "tilt-environmental",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Visual Perception and ranged attacks: -1 nearby, plus -1 per further 10 yards. Physical rolls: -1 per 4 inches of snow. Appropriate equipment may offset penalties.",
    "effect": "Visual Perception and ranged attacks: -1 nearby, plus -1 per further 10 yards. Physical rolls: -1 per 4 inches of snow. Appropriate equipment may offset penalties.",
    "resolution": "Leave the area, gain shelter, or the weather ends."
  },
  "Earthquake [Environmental Tilt]": {
    "name": "Earthquake",
    "type": "tilt",
    "group": "tilt-environmental",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "While shaking: -1 to -5 to Dexterity pools and Defense. Each turn, 1-3 Lethal damage; Stamina + Athletics success downgrades to Bashing, exceptional success cancels.",
    "effect": "While shaking: -1 to -5 to Dexterity pools and Defense. Each turn, 1-3 Lethal damage; Stamina + Athletics success downgrades to Bashing, exceptional success cancels.",
    "resolution": "The earthquake ends and immediate hazards settle."
  },
  "Extreme Cold [Environmental Tilt]": {
    "name": "Extreme Cold",
    "type": "tilt",
    "group": "tilt-environmental",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Below 0 °C: every 15 minutes, recover Bashing normally and suffer 1 non-Resistant Bashing. Accelerated supernatural healing is halved. −1 to all rolls per hour (max −5); subsequent hours also inflict 1 Lethal.",
    "effect": "Below 0 °C: every 15 minutes, recover Bashing normally and suffer 1 non-Resistant Bashing. Accelerated supernatural healing is halved. −1 to all rolls per hour (max −5); subsequent hours also inflict 1 Lethal.",
    "resolution": "Gain adequate warmth, protective clothing or shelter, or the cold ends."
  },
  "Extreme Heat [Environmental Tilt]": {
    "name": "Extreme Heat",
    "type": "tilt",
    "group": "tilt-environmental",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Above 40 °C: every 15 minutes, recover Bashing normally and suffer 1 non-Resistant Bashing. Accelerated supernatural healing is halved. −1 to all rolls per hour (max −5); subsequent hours also inflict 1 Lethal.",
    "effect": "Above 40 °C: every 15 minutes, recover Bashing normally and suffer 1 non-Resistant Bashing. Accelerated supernatural healing is halved. −1 to all rolls per hour (max −5); subsequent hours also inflict 1 Lethal.",
    "resolution": "Cool down, gain shelter, or the heat ends."
  },
  "Flooded [Environmental Tilt]": {
    "name": "Flooded",
    "type": "tilt",
    "group": "tilt-environmental",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Each foot of floodwater imposes -2 to Physical pools. Swimming when submerged requires Dexterity + Athletics, or holding breath Stamina + Composure. The Storyteller determines depth and current.",
    "effect": "Each foot of floodwater imposes -2 to Physical pools. Swimming when submerged requires Dexterity + Athletics, or holding breath Stamina + Composure. The Storyteller determines depth and current.",
    "resolution": "Leave the flooded area or the water recedes."
  },
  "Heavy Rain [Environmental Tilt]": {
    "name": "Heavy Rain",
    "type": "tilt",
    "group": "tilt-environmental",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "−3 to visual and auditory Perception. Prolonged rain may cause flooding; track flood depth separately.",
    "effect": "−3 to visual and auditory Perception. Prolonged rain may cause flooding; track flood depth separately.",
    "resolution": "Gain shelter, leave the area, or the rain ends."
  },
  "Heavy Winds [Environmental Tilt]": {
    "name": "Heavy Winds",
    "type": "tilt",
    "group": "tilt-environmental",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "-3 to auditory Perception. Wind grade 1-5 penalizes Physical rolls by grade; exposed characters face that much Bashing damage each turn, avoidable using reflexive Dexterity + Athletics.",
    "effect": "-3 to auditory Perception. Wind grade 1-5 penalizes Physical rolls by grade; exposed characters face that much Bashing damage each turn, avoidable using reflexive Dexterity + Athletics.",
    "resolution": "Gain shelter, leave the area, or the wind subsides."
  },
  "Ice [Environmental Tilt]": {
    "name": "Ice",
    "type": "tilt",
    "group": "tilt-environmental",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Half Speed; -2 to Physical pools and Defense, -4 to Physical pools at full Speed. Driving: -5 and half Acceleration. Physical dramatic failures cause Knocked Down.",
    "effect": "Half Speed; -2 to Physical pools and Defense, -4 to Physical pools at full Speed. Driving: -5 and half Acceleration. Physical dramatic failures cause Knocked Down.",
    "resolution": "Leave the icy area, remove the ice, or gain secure footing."
  },
  "Poor Light [Environmental Tilt]": {
    "name": "Poor Light",
    "type": "tilt",
    "group": "tilt-environmental",
    "persistent": false,
    "splat": "Mage",
    "filters": [
      "Tilts",
      "Mage"
    ],
    "description": "Dim lighting impairs visual tasks and conceals details or threats; alternative senses may compensate.",
    "effect": "Dim lighting impairs visual tasks and conceals details or threats; alternative senses may compensate.",
    "resolution": "Restore adequate light or leave the affected area."
  },
  "Boneyard [Environmental Tilt]": {
    "name": "Boneyard",
    "type": "tilt",
    "group": "tilt-environmental",
    "persistent": false,
    "splat": "Geist",
    "filters": [
      "Tilts",
      "Geist"
    ],
    "description": "The haunted area is aware and responsive to its creator under the Boneyard Rules and purchased enhancements.",
    "effect": "The haunted area is aware and responsive to its creator under the Boneyard Rules and purchased enhancements.",
    "resolution": "The underlying Boneyard Haunt ends or this location leaves its area.",
    "source_citation": "Geist: The Sin-Eaters 2e, environmental Tilts"
  },
  "Arm Wrack [Personal Tilt]": {
    "name": "Arm Wrack",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "The damaged arm is impaired for gripping, aiming and manipulation.",
    "effect": "The damaged arm is impaired for gripping, aiming and manipulation.",
    "resolution": "The injury is healed or the effect causing it ends."
  },
  "Beaten Down [Personal Tilt]": {
    "name": "Beaten Down",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "The character may surrender, flee or defend themselves rather than continue ordinary aggressive attacks.",
    "effect": "The character may surrender, flee or defend themselves rather than continue ordinary aggressive attacks.",
    "resolution": "Combat ends, you surrender, or the effect specifically ends."
  },
  "Blind [Personal Tilt]": {
    "name": "Blind",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Visual tasks may be impossible without alternative perception; other penalties depend on circumstances.",
    "effect": "Visual tasks may be impossible without alternative perception; other penalties depend on circumstances.",
    "resolution": "Sight returns or the effect causing the blindness ends."
  },
  "Deafened [Personal Tilt]": {
    "name": "Deafened",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "The character cannot reliably perceive speech, alarms or other auditory information.",
    "effect": "The character cannot reliably perceive speech, alarms or other auditory information.",
    "resolution": "Hearing returns or the effect causing the deafness ends."
  },
  "Drugged [Personal Tilt]": {
    "name": "Drugged",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Apply the substance’s specific penalties to perception, coordination or judgment and its duration.",
    "effect": "Apply the substance’s specific penalties to perception, coordination or judgment and its duration.",
    "resolution": "The drug leaves your system or treatment removes its effects."
  },
  "Immobilized [Personal Tilt]": {
    "name": "Immobilized",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Physical restraint prevents free movement; escape and combat options depend on the restraint.",
    "effect": "Physical restraint prevents free movement; escape and combat options depend on the restraint.",
    "resolution": "Break free, are released, or the effect ends."
  },
  "Insane [Personal Tilt]": {
    "name": "Insane",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Acute panic or delusion impairs judgment and imposes the source’s behavioral restrictions.",
    "effect": "Acute panic or delusion impairs judgment and imposes the source’s behavioral restrictions.",
    "resolution": "Regain control or the provoking effect ends."
  },
  "Insensate [Personal Tilt]": {
    "name": "Insensate",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Suppressed consciousness or sensation prevents meaningful action.",
    "effect": "Suppressed consciousness or sensation prevents meaningful action.",
    "resolution": "Recover awareness or the effect ends."
  },
  "Knocked Down [Personal Tilt]": {
    "name": "Knocked Down",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Prone: apply the associated combat limitations; remaining prone may provide cover from ranged attacks.",
    "effect": "Prone: apply the associated combat limitations; remaining prone may provide cover from ranged attacks.",
    "resolution": "Stand up."
  },
  "Leg Wrack [Personal Tilt]": {
    "name": "Leg Wrack",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "A damaged leg impairs walking, running, balance and other actions requiring that limb.",
    "effect": "A damaged leg impairs walking, running, balance and other actions requiring that limb.",
    "resolution": "The injury is healed or the effect causing it ends."
  },
  "Poisoned [Personal Tilt]": {
    "name": "Poisoned",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Inflicts damage at the poison’s specified intervals, severity and resistance rules.",
    "effect": "Inflicts damage at the poison’s specified intervals, severity and resistance rules.",
    "resolution": "The toxin runs its course or is successfully treated."
  },
  "Sick [Personal Tilt]": {
    "name": "Sick",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Apply the illness’s severity-based penalties, damage and progression.",
    "effect": "Apply the illness’s severity-based penalties, damage and progression.",
    "resolution": "Recover from or successfully treat the illness."
  },
  "Stunned [Personal Tilt]": {
    "name": "Stunned",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Core",
    "filters": [
      "Tilts",
      "Core",
      "Vampire",
      "Werewolf",
      "Mage",
      "Changeling",
      "Geist"
    ],
    "description": "Lose the specified action or remain unable to act until the source’s recovery requirement is met.",
    "effect": "Lose the specified action or remain unable to act until the source’s recovery requirement is met.",
    "resolution": "Lose the required action or recover as specified by the effect."
  },
  "Nimbus [Personal Tilt]": {
    "name": "Nimbus",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Mage",
    "filters": [
      "Tilts",
      "Mage"
    ],
    "description": "Apply the specific Tilt imposed by the originating mage’s Immediate Nimbus.",
    "effect": "Apply the specific Tilt imposed by the originating mage’s Immediate Nimbus.",
    "resolution": "Leave the Nimbus, the Nimbus ends, or the effect otherwise expires."
  },
  "Flesh Too Solid [Personal Tilt]": {
    "name": "Flesh Too Solid",
    "type": "tilt",
    "group": "tilt-personal",
    "persistent": false,
    "splat": "Changeling",
    "filters": [
      "Tilts",
      "Changeling"
    ],
    "description": "Wounds suffered in the dream affect the body according to the supernatural dream-state rules.",
    "effect": "Wounds suffered in the dream affect the body according to the supernatural dream-state rules.",
    "resolution": "Leave the relevant dream state or the supernatural effect ends."
  }
};

export const getConditionDefinition = (key) => CONDITION_DEFINITIONS[key] || null;
export const getConditionDisplayName = (key) => CONDITION_DEFINITIONS[key]?.name || key;
