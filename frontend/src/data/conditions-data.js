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
    "description": "When you next cast a spell that risks Paradox, add Paradox dice equal to the successes on the Paradox roll that created this Condition. Record that number when applying it; do not use a fixed modifier.",
    "effect": "When you next cast a spell that risks Paradox, add Paradox dice equal to the successes on the Paradox roll that created this Condition. Record that number when applying it; do not use a fixed modifier.",
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
    "description": "For every subsequent spell, spend additional Reach equal to the successes on the Paradox roll that imposed this Condition. Without this Reach, the spell automatically fails and its spellcasting dice pool is added to its Paradox dice.",
    "effect": "For every subsequent spell, spend additional Reach equal to the successes on the Paradox roll that imposed this Condition. Without this Reach, the spell automatically fails and its spellcasting dice pool is added to its Paradox dice.",
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
    "description": "The mage and subjects affected by her Nimbus become Resonant to Abyssal entities; if the originating Paradox roll was exceptional, they become Open instead. Signature and Long-Term Nimbus carry detectable Abyssal corruption.",
    "effect": "The mage and subjects affected by her Nimbus become Resonant to Abyssal entities; if the originating Paradox roll was exceptional, they become Open instead. Signature and Long-Term Nimbus carry detectable Abyssal corruption.",
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
    "description": "The Abyss has entered the mage’s Pattern and is detectable in her Nimbus. Every spell she casts adds one Paradox die, even without exceeding free Reach.",
    "effect": "The Abyss has entered the mage’s Pattern and is detectable in her Nimbus. Every spell she casts adds one Paradox die, even without exceeding free Reach.",
    "resolution": "Scour the taint from the Pattern: suffer one resistant lethal wound, gain no Mana and no additional Arcane Beat.",
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
    "description": "While a Memoria Mystery Play controls a scene, the subject is cast in a specific role and faces consequences for departing from the recalled script. Track the scene and its assigned role.",
    "effect": "While a Memoria Mystery Play controls a scene, the subject is cast in a specific role and faces consequences for departing from the recalled script. Track the scene and its assigned role.",
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
    "description": "A persistent dependence on a named substance or behavior. If deprived, apply Deprived and its −1 penalty to Stamina-, Resolve- and Composure-based pools.",
    "effect": "A persistent dependence on a named substance or behavior. If deprived, apply Deprived and its −1 penalty to Stamina-, Resolve- and Composure-based pools.",
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
    "description": "The Bound’s memories become unreliable or confused because of interference with the Geist’s Remembrance. The specific forgotten or substituted details are determined by the source.",
    "effect": "The Bound’s memories become unreliable or confused because of interference with the Geist’s Remembrance. The specific forgotten or substituted details are determined by the source.",
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
    "description": "A substantial part of the character’s memories is inaccessible. The Storyteller determines which information cannot be recalled and when it becomes accessible; no universal dice-pool penalty applies.",
    "effect": "A substantial part of the character’s memories is inaccessible. The Storyteller determines which information cannot be recalled and when it becomes accessible; no universal dice-pool penalty applies.",
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
    "description": "Recurring dreams connect you to a particular missing or promise-bound changeling. They can provide clues or direction about that person; record whose fate the dreams concern.",
    "effect": "Recurring dreams connect you to a particular missing or promise-bound changeling. They can provide clues or direction about that person; record whose fate the dreams concern.",
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
    "description": "Lunacy drives the subject toward primitive aggression and violence. Their choices become dominated by instinct instead of reason until the originating Lunacy effect passes.",
    "effect": "Lunacy drives the subject toward primitive aggression and violence. Their choices become dominated by instinct instead of reason until the originating Lunacy effect passes.",
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
    "description": "Intense Lunacy leaves the subject terrified and deferential toward the werewolf. Attempts to resist or oppose that werewolf must account for the supernatural fear.",
    "effect": "Intense Lunacy leaves the subject terrified and deferential toward the werewolf. Attempts to resist or oppose that werewolf must account for the supernatural fear.",
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
    "description": "A specific supernatural taboo constrains what the subject may do. Record the forbidden act; violating it has the consequences imposed by the entity or power that created the Ban.",
    "effect": "A specific supernatural taboo constrains what the subject may do. Record the forbidden act; violating it has the consequences imposed by the entity or power that created the Ban.",
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
    "description": "The subject loses self-restraint and lashes out violently, generally favoring direct attacks over negotiation or defense. Use the controlling source to determine permitted actions and duration.",
    "effect": "The subject loses self-restraint and lashes out violently, generally favoring direct attacks over negotiation or defense. Use the controlling source to determine permitted actions and duration.",
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
    "description": "Predatory instincts overwhelm thoughtful choices. The subject is pushed toward immediate hunting, feeding or aggressive behavior; the exact trigger comes from the supernatural source.",
    "effect": "Predatory instincts overwhelm thoughtful choices. The subject is pushed toward immediate hunting, feeding or aggressive behavior; the exact trigger comes from the supernatural source.",
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
    "description": "The character cannot perceive visually. Sight-dependent tasks are impossible without another means of perception; other actions suffer circumstances appropriate to blindness, as adjudicated by the Storyteller.",
    "effect": "The character cannot perceive visually. Sight-dependent tasks are impossible without another means of perception; other actions suffer circumstances appropriate to blindness, as adjudicated by the Storyteller.",
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
    "description": "The character has no functional sight. Treat visual tasks as impossible without an alternate sense, and apply appropriate circumstances to other actions; Mage Sight does not automatically restore mundane vision.",
    "effect": "The character has no functional sight. Treat visual tasks as impossible without an alternate sense, and apply appropriate circumstances to other actions; Mage Sight does not automatically restore mundane vision.",
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
    "description": "The character and Geist have undergone a relationship-strengthening experience. Follow the associated Synergy/Bond rules; do not grant an unearned die bonus merely for having the Condition.",
    "effect": "The character and Geist have undergone a relationship-strengthening experience. Follow the associated Synergy/Bond rules; do not grant an unearned die bonus merely for having the Condition.",
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
    "description": "The Sin-Eater has defined a haunted area and gains awareness throughout it; special movement, environmental Tilts and Rules depend on purchased Boneyard enhancements. Record the affected area and activator.",
    "effect": "The Sin-Eater has defined a haunted area and gains awareness throughout it; special movement, environmental Tilts and Rules depend on purchased Boneyard enhancements. Record the affected area and activator.",
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
    "description": "The Sin-Eater merges bodily with the Geist. Record Plasm-derived charges and each purchased transformation; charge-based powers expend their specified charges rather than providing permanent bonuses.",
    "effect": "The Sin-Eater merges bodily with the Geist. Record Plasm-derived charges and each purchased transformation; charge-based powers expend their specified charges rather than providing permanent bonuses.",
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
    "description": "A supernatural blessing of fortune may be discharged for the specific favorable coincidence or damage mitigation allowed by the granting effect. Track its origin and any stored uses; there is no universal passive bonus.",
    "effect": "A supernatural blessing of fortune may be discharged for the specific favorable coincidence or damage mitigation allowed by the granting effect. Track its origin and any stored uses; there is no universal passive bonus.",
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
    "description": "The target experiences magically induced affection toward the vampire using Majesty, making cooperation and pleasing that vampire unusually compelling until the influence ends.",
    "effect": "The target experiences magically induced affection toward the vampire using Majesty, making cooperation and pleasing that vampire unusually compelling until the influence ends.",
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
    "description": "A changeling's Clarity has collapsed severely enough to trap them in an involuntary dream or withdrawn state. They cannot engage with ordinary waking circumstances until recovery or intervention.",
    "effect": "A changeling's Clarity has collapsed severely enough to trap them in an involuntary dream or withdrawn state. They cannot engage with ordinary waking circumstances until recovery or intervention.",
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
    "description": "The character feels compelled to prove superiority over a named rival or in a specific contest. Their priorities shift toward winning even when cooperation would be more sensible.",
    "effect": "The character feels compelled to prove superiority over a named rival or in a specific contest. Their priorities shift toward winning even when cooperation would be more sensible.",
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
    "description": "The character has trouble distinguishing priorities, instructions and complicated situations. Tasks demanding sustained clear thought become unreliable until the confusion is removed.",
    "effect": "The character has trouble distinguishing priorities, instructions and complicated situations. Tasks demanding sustained clear thought become unreliable until the confusion is removed.",
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
    "description": "Gain +2 dice on applicable rolls involving the named social group; may resolve for a one-time +3 interaction bonus, sacrificing the relationship. Follow the Core Connected rule.",
    "effect": "Gain +2 dice on applicable rolls involving the named social group; may resolve for a one-time +3 interaction bonus, sacrificing the relationship. Follow the Core Connected rule.",
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
    "description": "An overwhelming display of dominance leaves the subject reluctant to oppose the aggressor. Record whom they fear; defiance requires overcoming that imposed submission.",
    "effect": "An overwhelming display of dominance leaves the subject reluctant to oppose the aggressor. Record whom they fear; defiance requires overcoming that imposed submission.",
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
    "description": "The character cannot use the legs normally; walking Speed becomes 1. Mobility aids may change effective movement. The associated persistent impairment remains until properly addressed.",
    "effect": "The character cannot use the legs normally; walking Speed becomes 1. Mobility aids may change effective movement. The associated persistent impairment remains until properly addressed.",
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
    "description": "A temporary Renown-related state rewards clever, deceptive or subtle conduct. Its relevance is to the source's defined Cunning behavior, not an unconditional bonus to every Subterfuge roll.",
    "effect": "A temporary Renown-related state rewards clever, deceptive or subtle conduct. Its relevance is to the source's defined Cunning behavior, not an unconditional bonus to every Subterfuge roll.",
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
    "description": "The subject carries a supernatural curse with charges determined by the activation. The Sin-Eater may expend charges reflexively to impose only the effects purchased through Curse enhancements. Track source and charges.",
    "effect": "The subject carries a supernatural curse with charges determined by the activation. The Sin-Eater may expend charges reflexively to impose only the effects purchased through Curse enhancements. Track source and charges.",
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
    "description": "The Bound’s living body is dead while the Geist acts under the special death/Bargain rules. Ordinary natural healing does not restore life; apply the appropriate Geist separation consequences.",
    "effect": "The Bound’s living body is dead while the Geist acts under the special death/Bargain rules. Ordinary natural healing does not restore life; apply the appropriate Geist separation consequences.",
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
    "description": "The subject broke a Rule established by Boneyard and may suffer its associated punishment. The exact imposed Rule, penalty and creator’s Synergy must be recorded.",
    "effect": "The subject broke a Rule established by Boneyard and may suffer its associated punishment. The exact imposed Rule, penalty and creator’s Synergy must be recorded.",
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
    "description": "Lunacy distorts how the victim interprets what they see and hear, provoking fear or mistaken beliefs about events. Their reactions follow the delusion until they recover reliable perception.",
    "effect": "Lunacy distorts how the victim interprets what they see and hear, provoking fear or mistaken beliefs about events. Their reactions follow the delusion until they recover reliable perception.",
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
    "description": "The character believes a significant false proposition despite contrary evidence. Decisions and social responses are shaped by that belief until it is confronted or dispelled.",
    "effect": "The character believes a significant false proposition despite contrary evidence. Decisions and social responses are shaped by that belief until it is confronted or dispelled.",
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
    "description": "Failure damages the character's willingness to press onward. Their confidence and initiative suffer in actions tied to the defeat until success or effective support restores them.",
    "effect": "Failure damages the character's willingness to press onward. Their confidence and initiative suffer in actions tied to the defeat until success or effective support restores them.",
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
    "description": "A feeding relationship creates an obsessive attachment to the vampire. The mortal's choices and willingness to separate are compromised; track the vampire who created the dependence.",
    "effect": "A feeding relationship creates an obsessive attachment to the vampire. The mortal's choices and willingness to separate are compromised; track the vampire who created the dependence.",
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
    "description": "Movement and use of the affected part are seriously restricted. Apply the specific restriction imposed by the creating spell or injury, not an invented universal dice modifier.",
    "effect": "Movement and use of the affected part are seriously restricted. Apply the specific restriction imposed by the creating spell or injury, not an invented universal dice modifier.",
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
    "description": "The character cannot reliably place themselves in their surroundings or understand their immediate situation. Direction-finding and purposeful movement are hampered until they regain bearings.",
    "effect": "The character cannot reliably place themselves in their surroundings or understand their immediate situation. Direction-finding and purposeful movement are hampered until they regain bearings.",
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
    "description": "The character becomes emotionally detached and uncertain whether their experiences are real. Engagement with people and evaluation of immediate events are impaired until grounded again.",
    "effect": "The character becomes emotionally detached and uncertain whether their experiences are real. Engagement with people and evaluation of immediate events are impaired until grounded again.",
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
    "description": "Competing stimuli break sustained attention. Tasks involving careful concentration, extended effort or precision are harder while the specified distraction remains.",
    "effect": "Competing stimuli break sustained attention. Tasks involving careful concentration, extended effort or precision are harder while the specified distraction remains.",
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
    "description": "A vampire's Dominate power compels compliance with a recorded command. Apply the scope and duration of that command, rather than treating Dominated as general obedience to every request.",
    "effect": "A vampire's Dominate power compels compliance with a recorded command. Apply the scope and duration of that command, rather than treating Dominated as general obedience to every request.",
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
    "description": "Blood loss makes the subject physically weak and less able to sustain strenuous activity. The precise impairment and recovery depend on the source and degree of loss.",
    "effect": "Blood loss makes the subject physically weak and less able to sustain strenuous activity. The precise impairment and recovery depend on the source and degree of loss.",
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
    "description": "A hostile dream actively attacks the intruder or otherwise inflicts the consequences of dream combat. The dream interaction, not ordinary waking combat, determines what harm carries across.",
    "effect": "A hostile dream actively attacks the intruder or otherwise inflicts the consequences of dream combat. The dream interaction, not ordinary waking combat, determines what harm carries across.",
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
    "description": "Entities within a dream notice the intruder as alien or unwelcome. Deception and unobtrusive travel through that dream become more difficult until the dream accepts them again.",
    "effect": "Entities within a dream notice the intruder as alien or unwelcome. Deception and unobtrusive travel through that dream become more difficult until the dream accepts them again.",
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
    "description": "The dream environment as a whole reacts against the character's interference. Its inhabitants and events work against their presence until they depart or restore the dream.",
    "effect": "The dream environment as a whole reacts against the character's interference. Its inhabitants and events work against their presence until they depart or restore the dream.",
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
    "description": "The marked quarry leaves clues that a supernatural hunter can exploit. Record the hunter or hunting power; it assists pursuit rather than giving every bystander a tracking bonus.",
    "effect": "The marked quarry leaves clues that a supernatural hunter can exploit. Record the hunter or hunting power; it assists pursuit rather than giving every bystander a tracking bonus.",
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
    "description": "The Geist’s intrusive memories or traits impose a particular remembered impulse or conflict. Record its trigger and how it affects the Bound; the effect is not a generic universal dice penalty.",
    "effect": "The Geist’s intrusive memories or traits impose a particular remembered impulse or conflict. Record its trigger and how it affects the Bound; the effect is not a generic universal dice penalty.",
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
    "description": "Blood sorcery has satisfied or stimulated the Beast, reinforcing the vampire's predatory or sorcerous drive. Its advantages apply only in the setting and actions of the triggering power.",
    "effect": "Blood sorcery has satisfied or stimulated the Beast, reinforcing the vampire's predatory or sorcerous drive. Its advantages apply only in the setting and actions of the triggering power.",
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
    "description": "Advanced soul deprivation reduces the character’s available Willpower and interferes with certain supernatural or moral actions. Use the soul-loss stage from the initiating effect; penalties depend on how long the soul is missing.",
    "effect": "Advanced soul deprivation reduces the character’s available Willpower and interferes with certain supernatural or moral actions. Use the soul-loss stage from the initiating effect; penalties depend on how long the soul is missing.",
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
    "description": "Repeated or deep Dominate influence has removed substantial independent choice. The victim is bound to the controlling vampire's established instructions until the conditioning breaks.",
    "effect": "Repeated or deep Dominate influence has removed substantial independent choice. The victim is bound to the controlling vampire's established instructions until the conditioning breaks.",
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
    "description": "Majesty causes intense supernatural devotion. The subject prioritizes the vampire's wishes and approval, and may neglect other loyalties while the effect is active.",
    "effect": "Majesty causes intense supernatural devotion. The subject prioritizes the vampire's wishes and approval, and may neglect other loyalties while the effect is active.",
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
    "description": "Taking in more Essence than can be safely held destabilizes the werewolf. Losing excess Essence can have linked physical consequences; track the actual overload and governing rule.",
    "effect": "Taking in more Essence than can be safely held destabilizes the werewolf. Losing excess Essence can have linked physical consequences; track the actual overload and governing rule.",
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
    "description": "Severe exhaustion reduces the character's ability to exert themselves or remain alert. Demanding physical actions and resisting unconsciousness are affected until effective rest.",
    "effect": "Severe exhaustion reduces the character's ability to exert themselves or remain alert. Demanding physical actions and resisting unconsciousness are affected until effective rest.",
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
    "description": "Supernatural interference has inserted or replaced memories. The character treats the substituted recollections as true until inconsistencies are exposed or the supernatural change is undone.",
    "effect": "Supernatural interference has inserted or replaced memories. The character treats the substituted recollections as true until inconsistencies are exposed or the supernatural change is undone.",
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
    "description": "Insufficient rest compromises concentration and stamina. Continued exertion can worsen the condition, while meaningful recovery reduces its consequences.",
    "effect": "Insufficient rest compromises concentration and stamina. Continued exertion can worsen the condition, while meaningful recovery reduces its consequences.",
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
    "description": "The Bound is authorized to ferry travelers through Underworld rivers but must demand or pay the specified price. Record the route, passengers and obligation.",
    "effect": "The Bound is authorized to ferry travelers through Underworld rivers but must demand or pay the specified price. Record the route, passengers and obligation.",
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
    "description": "The relationship between Bound and Geist has broken down at low Synergy; cooperation and access to benefits may be restricted until reconciled. Record the source of the conflict.",
    "effect": "The relationship between Bound and Geist has broken down at low Synergy; cooperation and access to benefits may be restricted until reconciled. Record the source of the conflict.",
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
    "description": "A changeling's damaged Clarity leaves them unusually vulnerable to further psychological disturbance. A later Clarity-breaking event can produce greater disruption than it otherwise would.",
    "effect": "A changeling's damaged Clarity leaves them unusually vulnerable to further psychological disturbance. A later Clarity-breaking event can produce greater disruption than it otherwise would.",
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
    "description": "The subject experiences immediate overwhelming fear of a specific threat. Flight, avoidance and difficulty confronting that threat dominate behavior until the fear subsides.",
    "effect": "The subject experiences immediate overwhelming fear of a specific threat. Flight, avoidance and difficulty confronting that threat dominate behavior until the fear subsides.",
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
    "description": "A ghostly influence has left a persistent physical or supernatural mark. Its nature, whether it functions as an Anchor and any related restriction are established by the causing effect.",
    "effect": "A ghostly influence has left a persistent physical or supernatural mark. Its nature, whether it functions as an Anchor and any related restriction are established by the causing effect.",
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
    "description": "The character is dependent on repeated exposure to Glamour. Going without it causes withdrawal or compulsive pursuit of another source of Glamour.",
    "effect": "The character is dependent on repeated exposure to Glamour. Going without it causes withdrawal or compulsive pursuit of another source of Glamour.",
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
    "description": "A Renown-linked heightened state reinforces courageous, impressive or publicly noteworthy actions. Only acts meeting the power's Glorious criteria receive its benefit.",
    "effect": "A Renown-linked heightened state reinforces courageous, impressive or publicly noteworthy actions. Only acts meeting the power's Glorious criteria receive its benefit.",
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
    "description": "Goblin influence changes the character's relationship to the Hedge, its creatures and obligations. The character increasingly behaves or is treated as part of goblin society.",
    "effect": "Goblin influence changes the character's relationship to the Hedge, its creatures and obligations. The character increasingly behaves or is treated as part of goblin society.",
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
    "description": "Subtract 2 dice from Resolve- or Composure-based rolls made to DEFEND against a manipulator using Subterfuge, Empathy or Intimidation. This is not a penalty to your own Subterfuge rolls.",
    "effect": "Subtract 2 dice from Resolve- or Composure-based rolls made to DEFEND against a manipulator using Subterfuge, Empathy or Intimidation. This is not a penalty to your own Subterfuge rolls.",
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
    "description": "Exposure to the Hedge creates a recurring compulsion to return. The desire can interfere with ordinary priorities and relationships until the dependence is addressed.",
    "effect": "Exposure to the Hedge creates a recurring compulsion to return. The desire can interfere with ordinary priorities and relationships until the dependence is addressed.",
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
    "description": "The character becomes progressively tied to Hedge existence and goblin behavior. Normal mortal or changeling attachments may lose priority as the transformation advances.",
    "effect": "The character becomes progressively tied to Hedge existence and goblin behavior. Normal mortal or changeling attachments may lose priority as the transformation advances.",
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
    "description": "A Renown-related state rewards keeping one's word, acting fairly and meeting a personal code. The benefit depends on honor-consistent actions rather than every Social roll.",
    "effect": "A Renown-related state rewards keeping one's word, acting fairly and meeting a personal code. The benefit depends on honor-consistent actions rather than every Social roll.",
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
    "description": "The mage is profoundly affected by a demonstration of humanity and cannot willingly harm the particular person or ideal that inspired the Condition. Record that subject explicitly.",
    "effect": "The mage is profoundly affected by a demonstration of humanity and cannot willingly harm the particular person or ideal that inspired the Condition. Record that subject explicitly.",
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
    "description": "A profound confrontation with guilt, faith or judgment weakens the vampire's usual pride and monstrous certainty. Choices that rely on the Beast may be suppressed until the experience is resolved.",
    "effect": "A profound confrontation with guilt, faith or judgment weakens the vampire's usual pride and monstrous certainty. Choices that rely on the Beast may be suppressed until the experience is resolved.",
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
    "description": "A named predator or supernatural pursuer is actively tracking the character. The danger persists beyond a single immediate attack; record the hunter and the reason the character is marked.",
    "effect": "A named predator or supernatural pursuer is actively tracking the character. The danger persists beyond a single immediate attack; record the hunter and the reason the character is marked.",
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
    "description": "Failure to attend to a Touchstone incurs an outstanding spiritual debt or obligation. Record the Touchstone and the action required to discharge the debt.",
    "effect": "Failure to attend to a Touchstone incurs an outstanding spiritual debt or obligation. Record the Touchstone and the action required to discharge the debt.",
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
    "description": "After making a relevant, non-combat Skill roll, resolve Informed to upgrade a failure to one success, or an ordinary success to an exceptional success. It does not alter an existing dramatic failure.",
    "effect": "After making a relevant, non-combat Skill roll, resolve Informed to upgrade a failure to one success, or an ordinary success to an exceptional success. It does not alter an existing dramatic failure.",
    "resolution": "Use this result-upgrade benefit on an eligible Skill roll.",
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
    "description": "Before a roll relating to the inspiration, resolve Inspired. Regain 1 Willpower and reduce the threshold for exceptional success on that roll from 5 successes to 3. Failure remains failure.",
    "effect": "Before a roll relating to the inspiration, resolve Inspired. Regain 1 Willpower and reduce the threshold for exceptional success on that roll from 5 successes to 3. Failure remains failure.",
    "resolution": "Invoke the inspiration for a relevant roll.",
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
    "description": "Drugs or alcohol entering through consumed blood impair the vampire's judgment, perception or coordination. Treat the specific substance and its duration as the source of the effect.",
    "effect": "Drugs or alcohol entering through consumed blood impair the vampire's judgment, perception or coordination. Treat the specific substance and its duration as the source of the effect.",
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
    "description": "An empowered hunter becomes difficult for prey to notice or follow. The concealment benefits hunting actions specified by the ability and is not blanket invisibility in every situation.",
    "effect": "An empowered hunter becomes difficult for prey to notice or follow. The concealment benefits hunting actions specified by the ability and is not blanket invisibility in every situation.",
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
    "description": "A Hunter's Aspect disrupts the quarry's reliance on allies. The victim is pushed into behaving or fighting alone, and cooperation may be compromised while the Aspect persists.",
    "effect": "A Hunter's Aspect disrupts the quarry's reliance on allies. The victim is pushed into behaving or fighting alone, and cooperation may be compromised while the Aspect persists.",
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
    "description": "The vampire's connection to ordinary humanity weakens. The Beast's priorities feel easier to accept and human emotional ties exert less influence.",
    "effect": "The vampire's connection to ordinary humanity weakens. The Beast's priorities feel easier to accept and human emotional ties exert less influence.",
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
    "description": "Detachment from living concerns encourages apathy, inactivity and surrender to torpor. Decisive actions not connected to the Beast's immediate needs lose urgency.",
    "effect": "Detachment from living concerns encourages apathy, inactivity and surrender to torpor. Decisive actions not connected to the Beast's immediate needs lose urgency.",
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
    "description": "Violation of a Dominion’s Old Law attracts supernatural judgment. Record the Law, the adjudicating Dominion and the actual punishment; the Condition is not a universal penalty.",
    "effect": "Violation of a Dominion’s Old Law attracts supernatural judgment. Record the Law, the adjudicating Dominion and the actual punishment; the Condition is not a universal penalty.",
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
    "description": "Debilitating lack of energy interferes with taking initiative and acting decisively. The character struggles with sustained physical or mental effort until the lethargy ends.",
    "effect": "Debilitating lack of energy interferes with taking initiative and acting decisively. The character struggles with sustained physical or mental effort until the lethargy ends.",
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
    "description": "A named character holds convincing leverage over you. The leverage affects attempts to resist that character’s demands; record the specific threat or obligation. Multiple distinct sources may coexist.",
    "effect": "A named character holds convincing leverage over you. The leverage affects attempts to resist that character’s demands; record the specific threat or obligation. Multiple distinct sources may coexist.",
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
    "description": "Until you become reoriented, you cannot make reliable progress toward your destination. Navigation usually requires Wits + Streetwise in an urban area or Wits + Survival outdoors.",
    "effect": "Until you become reoriented, you cannot make reliable progress toward your destination. Navigation usually requires Wits + Streetwise in an urban area or Wits + Survival outdoors.",
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
    "description": "A failed hunt shakes the character's confidence in following prey. Attempts to resume the same pursuit are compromised until they regain the trail or overcome the setback.",
    "effect": "A failed hunt shakes the character's confidence in following prey. Attempts to resume the same pursuit are compromised until they regain the trail or overcome the setback.",
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
    "description": "A supernatural lure makes a specific person or place unusually compelling. The victim is motivated to approach or seek that target, even when other concerns argue against it.",
    "effect": "A supernatural lure makes a specific person or place unusually compelling. The victim is motivated to approach or seek that target, even when other concerns argue against it.",
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
    "description": "Supernaturally induced instability. Once per chapter, the Storyteller may impose an appropriate penalty of up to 10 − Integrity dice on a Mental or Social roll. Apply only when triggered.",
    "effect": "Supernaturally induced instability. Once per chapter, the Storyteller may impose an appropriate penalty of up to 10 − Integrity dice on a Mental or Social roll. Apply only when triggered.",
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
    "description": "The subject or object is animated by the Bound’s Plasm. The Sin-Eater must use an instant action to direct a puppeteered subject for a turn; control is resisted as specified by the Haunt.",
    "effect": "The subject or object is animated by the Bound’s Plasm. The Sin-Eater must use an instant action to direct a puppeteered subject for a turn; control is resisted as specified by the Haunt.",
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
    "description": "Hubris distorts the mage’s judgment. Follow the Wisdom-breakpoint consequence and the listed behavioral restrictions; do not treat this as a generic +/−2 modifier.",
    "effect": "Hubris distorts the mage’s judgment. Follow the Wisdom-breakpoint consequence and the listed behavioral restrictions; do not treat this as a generic +/−2 modifier.",
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
    "description": "The Sin-Eater’s collection of Mementos establishes a reputation among other Bound. It confers the specific social standing described by the source; no blanket equipment bonus is implied.",
    "effect": "The Sin-Eater’s collection of Mementos establishes a reputation among other Bound. It confers the specific social standing described by the source; no blanket equipment bonus is implied.",
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
    "description": "The subject perceives or enters a manifestation of memories of the dead. Track the memory, its consequences and any roles or extra participants from enhancements.",
    "effect": "The subject perceives or enters a manifestation of memories of the dead. Track the memory, its consequences and any roles or extra participants from enhancements.",
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
    "description": "The character experiences another identity’s memories as their own. Record which memories or motivations intrude; apply any specific loss of clarity from the source.",
    "effect": "The character experiences another identity’s memories as their own. Record which memories or motivations intrude; apply any specific loss of clarity from the source.",
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
    "description": "A vampire has made the target receptive to a particular Dominate instruction. The effect sets up or strengthens that command; it is not permission to control all future actions.",
    "effect": "A vampire has made the target receptive to a particular Dominate instruction. The effect sets up or strengthens that command; it is not permission to control all future actions.",
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
    "description": "A human exposed to a werewolf's bite carries Luna's influence. This may affect later supernatural change or reactions; track the bite and its established consequences.",
    "effect": "A human exposed to a werewolf's bite carries Luna's influence. This may affect later supernatural change or reactions; track the bite and its established consequences.",
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
    "description": "The character cannot communicate through speech; verbal persuasion, spoken commands, incantations and similar acts may be impossible without an alternative communication method.",
    "effect": "The character cannot communicate through speech; verbal persuasion, spoken commands, incantations and similar acts may be impossible without an alternative communication method.",
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
    "description": "The mage is compelled by an Exarchal or other Mystery-derived directive. The actual command, its strength and consequences must be recorded on the specific Condition; no universal roll modifier can replace it.",
    "effect": "The mage is compelled by an Exarchal or other Mystery-derived directive. The actual command, its strength and consequences must be recorded on the specific Condition; no universal roll modifier can replace it.",
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
    "description": "A Hunter's Aspect instills supernatural fear of the Shadow or what lies beyond the Gauntlet. Crossing or engaging with that realm becomes psychologically threatening.",
    "effect": "A Hunter's Aspect instills supernatural fear of the Shadow or what lies beyond the Gauntlet. Crossing or engaging with that realm becomes psychologically threatening.",
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
    "description": "Severe Clarity damage suppresses the changeling's emotional responses. They have difficulty forming or expressing ordinary emotional connections until recovery.",
    "effect": "Severe Clarity damage suppresses the changeling's emotional responses. They have difficulty forming or expressing ordinary emotional connections until recovery.",
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
    "description": "Breaking a Wyrd-backed promise brands the character as unreliable in future pledges or bargains. Other beings can recognize or exploit the breach according to the oath's rules.",
    "effect": "Breaking a Wyrd-backed promise brands the character as unreliable in future pledges or bargains. Other beings can recognize or exploit the breach according to the oath's rules.",
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
    "description": "A promise or supernatural bargain binds the character to a defined duty, often in exchange for protection. Record both the obligation and the benefit that depends on honoring it.",
    "effect": "A promise or supernatural bargain binds the character to a defined duty, often in exchange for protection. Record both the obligation and the benefit that depends on honoring it.",
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
    "description": "Rolls directly pursuing, investigating or acting in accordance with the obsession receive 9-again. This quality does not apply to unrelated actions; mark applicability explicitly for each roll.",
    "effect": "Rolls directly pursuing, investigating or acting in accordance with the obsession receive 9-again. This quality does not apply to unrelated actions; mark applicability explicitly for each roll.",
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
    "description": "Core Obsession’s 9-again applies only to relevant actions; distinguish this Condition from the mage’s character-sheet Obsessions, which award Arcane Beats through their own rules.",
    "effect": "Core Obsession’s 9-again applies only to relevant actions; distinguish this Condition from the mage’s character-sheet Obsessions, which award Arcane Beats through their own rules.",
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
    "description": "The Sin-Eater is using death-sight or travel to consult the Underworld about a Mystery. Each question available and its supernatural limits depend on Oracle dots and purchased enhancements.",
    "effect": "The Sin-Eater is using death-sight or travel to consult the Underworld about a Mystery. Each question available and its supernatural limits depend on Oracle dots and purchased enhancements.",
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
    "description": "The character interprets others as potential threats and struggles to trust allies. Cooperation and Social interactions can be hindered by the specific suspicion.",
    "effect": "The character interprets others as potential threats and struggles to trust allies. Cooperation and Social interactions can be hindered by the specific suspicion.",
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
    "description": "This Renown-related state favors an unambiguous, instinct-driven commitment to purpose. The benefit applies only to actions aligned with that Pure ideal.",
    "effect": "This Renown-related state favors an unambiguous, instinct-driven commitment to purpose. The benefit applies only to actions aligned with that Pure ideal.",
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
    "description": "The Bound channels ghostly rage into offensive power. Apply damage type, weapon rating, range and extra Tilts only as permitted by the Rage Haunt and purchased enhancements.",
    "effect": "The Bound channels ghostly rage into offensive power. Apply damage type, weapon rating, range and extra Tilts only as permitted by the Rage Haunt and purchased enhancements.",
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
    "description": "The mage is driven to employ magic even for simple everyday problems. Depending on the triggering context, resisting this impulse requires an appropriate Willpower expenditure or Storyteller adjudication.",
    "effect": "The mage is driven to employ magic even for simple everyday problems. Depending on the triggering context, resisting this impulse requires an appropriate Willpower expenditure or Storyteller adjudication.",
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
    "description": "A state of religious or mystical ecstasy makes the vampire more willing to identify with the Beast. Their priorities shift toward surrender, reverence or reconciliation with predatory impulses.",
    "effect": "A state of religious or mystical ecstasy makes the vampire more willing to identify with the Beast. Their priorities shift toward surrender, reverence or reconciliation with predatory impulses.",
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
    "description": "Predation by a fae force leaves the victim psychologically depleted. Emotional engagement, confidence and self-directed choices are damaged until the trauma is addressed.",
    "effect": "Predation by a fae force leaves the victim psychologically depleted. Emotional engagement, confidence and self-directed choices are damaged until the trauma is addressed.",
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
    "description": "A mortal affected by Lunacy becomes unusually receptive to spirits or Shadow phenomena. Record the supernatural source and its particular mode of influence.",
    "effect": "A mortal affected by Lunacy becomes unusually receptive to spirits or Shadow phenomena. Record the supernatural source and its particular mode of influence.",
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
    "description": "The character ignores ordinary caution and is driven toward risky decisions. Avoiding danger or planning carefully becomes less likely while the Condition controls choices.",
    "effect": "The character ignores ordinary caution and is driven toward risky decisions. Avoiding danger or planning carefully becomes less likely while the Condition controls choices.",
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
    "description": "A krewe grants its member a special investiture of authority or protection. Record the particular regalia and dot-rated benefit; merely owning the Condition does not grant a standard bonus.",
    "effect": "A krewe grants its member a special investiture of authority or protection. Record the particular regalia and dot-rated benefit; merely owning the Condition does not grant a standard bonus.",
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
    "description": "A Hunter's Aspect instills acceptance of an apparently inevitable death. The quarry may stop protecting themselves or take fatal risks because resistance feels meaningless.",
    "effect": "A Hunter's Aspect instills acceptance of an apparently inevitable death. The quarry may stop protecting themselves or take fatal risks because resistance feels meaningless.",
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
    "description": "The vampire's Beast is temporarily satisfied. Immediate hunger-driven aggression or frenzy pressure eases, subject to the originating feeding or supernatural effect.",
    "effect": "The vampire's Beast is temporarily satisfied. Immediate hunger-driven aggression or frenzy pressure eases, subject to the originating feeding or supernatural effect.",
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
    "description": "An experience of moral or psychological injury changes how the vampire relates to Humanity. Later Humanity-related decisions may be shaped by that lasting scar.",
    "effect": "An experience of moral or psychological injury changes how the vampire relates to Humanity. Later Humanity-related decisions may be shaped by that lasting scar.",
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
    "description": "A stronger form of Marionette control makes the target obey ongoing instructions without the same turn-by-turn direction. Track the number of targets and any durations imposed by enhancements.",
    "effect": "A stronger form of Marionette control makes the target obey ongoing instructions without the same turn-by-turn direction. Track the number of targets and any durations imposed by enhancements.",
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
    "description": "Fear of the spirit world develops into defensive suspicion and aggression. The character may interpret Shadow-related events or even allies as immediate threats.",
    "effect": "Fear of the spirit world develops into defensive suspicion and aggression. The character may interpret Shadow-related events or even allies as immediate threats.",
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
    "description": "Failure in a Rite leaves a werewolf spiritually compromised. Their relationship with the Shadow, or relevant further Rites, suffers until the supernatural rebuke ends.",
    "effect": "Failure in a Rite leaves a werewolf spiritually compromised. Their relationship with the Shadow, or relevant further Rites, suffers until the supernatural rebuke ends.",
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
    "description": "There is NO automatic −2 dice penalty. Before a roll where the fear could interfere, you may elect to fail the roll outright; doing so resolves Shaken and earns its normal resolution Beat.",
    "effect": "There is NO automatic −2 dice penalty. Before a roll where the fear could interfere, you may elect to fail the roll outright; doing so resolves Shaken and earns its normal resolution Beat.",
    "resolution": "Voluntarily fail a relevant action because of the fear.",
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
    "description": "The Bound takes on ghostlike qualities and may interact with Twilight. Specific protections, movement modes and Numina depend on Shroud enhancement purchases; record what is active.",
    "effect": "The Bound takes on ghostlike qualities and may interact with Twilight. Specific protections, movement modes and Numina depend on Shroud enhancement purchases; record what is active.",
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
    "description": "The Sacred Hunt has marked a specific quarry for the pack. Tracking, coordination or supernatural benefits derive from the Hunt rite and its intended prey, not every unrelated target.",
    "effect": "The Sacred Hunt has marked a specific quarry for the pack. Tracking, coordination or supernatural benefits derive from the Hunt rite and its intended prey, not every unrelated target.",
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
    "description": "The boundary between sleeping and waking is disturbed. The subject may act without reliable awareness and later lose memory of their actions.",
    "effect": "The boundary between sleeping and waking is disturbed. The subject may act without reliable awareness and later lose memory of their actions.",
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
    "description": "Without the soul the character cannot recover Willpower normally, experiences escalating moral and psychological deterioration, and becomes vulnerable to possession. Track the duration of the loss.",
    "effect": "Without the soul the character cannot recover Willpower normally, experiences escalating moral and psychological deterioration, and becomes vulnerable to possession. Track the duration of the loss.",
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
    "description": "Fear and fascination with a supernatural experience compel risky investigation. No fixed dice modifier applies; the effect is the consequential behavior it provokes.",
    "effect": "Fear and fascination with a supernatural experience compel risky investigation. No fixed dice modifier applies; the effect is the consequential behavior it provokes.",
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
    "description": "After an ordinary failed roll, resolve Steadfast to treat it as one success. If the original roll is a chance die, resolving instead permits one REGULAR die to be rolled (8+ success, normal 10-again); it does not guarantee a success.",
    "effect": "After an ordinary failed roll, resolve Steadfast to treat it as one success. If the original roll is a chance die, resolving instead permits one REGULAR die to be rolled (8+ success, normal 10-again); it does not guarantee a success.",
    "resolution": "Invoke Steadfast to improve an eligible failed action.",
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
    "description": "A changeling suppresses emotional display, potentially aiding composure while weakening empathy and passion. The exact advantage or limitation applies only where the source specifies.",
    "effect": "A changeling suppresses emotional display, potentially aiding composure while weakening empathy and passion. The exact advantage or limitation applies only where the source specifies.",
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
    "description": "A complication disrupts progress on an ongoing project or extended action. The setback must be resolved or its consequences absorbed before normal progress resumes.",
    "effect": "A complication disrupts progress on an ongoing project or extended action. The setback must be resolved or its consequences absorbed before normal progress resumes.",
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
    "description": "Supernatural vampiric dominance makes disobeying a named master unusually difficult. Record the controlling vampire and any limits established by the power.",
    "effect": "Supernatural vampiric dominance makes disobeying a named master unusually difficult. Record the controlling vampire and any limits established by the power.",
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
    "description": "A Hunter's Aspect produces exaggerated self-confidence. The marked prey is discouraged from caution, preparation and seeking allies, creating exploitable vulnerability.",
    "effect": "A Hunter's Aspect produces exaggerated self-confidence. The marked prey is discouraged from caution, preparation and seeking allies, creating exploitable vulnerability.",
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
    "description": "The subject feels unnatural attraction toward a particular person and is eager to please them. Their judgment and willingness to resist that person are compromised while fascination persists.",
    "effect": "The subject feels unnatural attraction toward a particular person and is eager to please them. Their judgment and willingness to resist that person are compromised while fascination persists.",
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
    "description": "A werewolf's Rite leaves lingering symbolic power associated with a particular spirit-facing act. The benefit concerns the focus defined by that Rite, not all supernatural actions.",
    "effect": "A werewolf's Rite leaves lingering symbolic power associated with a particular spirit-facing act. The benefit concerns the focus defined by that Rite, not all supernatural actions.",
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
    "description": "A vampire contains a remnant of a diablerized soul that still affects their inner life. Record the swallowed soul and how it manifests through memories, urges or supernatural consequences.",
    "effect": "A vampire contains a remnant of a diablerized soul that still affects their inner life. Record the swallowed soul and how it manifests through memories, urges or supernatural consequences.",
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
    "description": "A significant command or duty binds the character's choices. Record the task, who imposed it and what happens if it is fulfilled, neglected or defied.",
    "effect": "A significant command or duty binds the character's choices. Record the task, who imposed it and what happens if it is fulfilled, neglected or defied.",
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
    "description": "After resisting frenzy, the Beast remains poised to exploit another provocation. Later temptation or frenzy checks are more precarious until the effect is resolved.",
    "effect": "After resisting frenzy, the Beast remains poised to exploit another provocation. Later temptation or frenzy checks are more precarious until the effect is resolved.",
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
    "description": "A major krewe achievement grants an intense period of spiritual certainty. Apply only its specified temporary benefit; the Condition is not general-purpose success enhancement.",
    "effect": "A major krewe achievement grants an intense period of spiritual certainty. Apply only its specified temporary benefit; the Condition is not general-purpose success enhancement.",
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
    "description": "A completely soulless Thrall cannot spend Willpower, use Defense in combat, spend Experiences or cast spells, and suffers the effects of Broken. Only restoration of the soul ends this advanced state.",
    "effect": "A completely soulless Thrall cannot spend Willpower, use Defense in combat, spend Experiences or cast spells, and suffers the effects of Broken. Only restoration of the soul ends this advanced state.",
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
    "description": "The Bound has recreated an object or person from deathly memory. Its traits and limitations depend on the specific object and purchased Tomb enhancements, not an automatic general bonus.",
    "effect": "The Bound has recreated an object or person from deathly memory. Its traits and limitations depend on the specific object and purchased Tomb enhancements, not an automatic general bonus.",
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
    "description": "When interacting socially with Awakened aware of the Duel Arcane victory, achieve exceptional success with 3 successes instead of 5. The benefit applies only to those Social rolls, not ordinary spellcasting.",
    "effect": "When interacting socially with Awakened aware of the Duel Arcane victory, achieve exceptional success with 3 successes instead of 5. The benefit applies only to those Social rolls, not ordinary spellcasting.",
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
    "description": "A Hunter's Aspect narrows the victim's situational attention. They miss relevant dangers or signs around them, especially while focused on the hunter's apparent bait.",
    "effect": "A Hunter's Aspect narrows the victim's situational attention. They miss relevant dangers or signs around them, especially while focused on the hunter's apparent bait.",
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
    "description": "The Geist manifests independently of its Sin-Eater. Treat its actions and Traits separately; apply the consequences for leaving the Bargain and any weakening of the Bond.",
    "effect": "The Geist manifests independently of its Sin-Eater. Treat its actions and Traits separately; apply the consequences for leaving the Bargain and any weakening of the Bond.",
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
    "description": "The character's trail has been deliberately concealed by exceptional skill or supernatural means. Tracking them is restricted by that concealment until a suitable clue or countermeasure defeats it.",
    "effect": "The character's trail has been deliberately concealed by exceptional skill or supernatural means. Tracking them is restricted by that concealment until a suitable clue or countermeasure defeats it.",
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
    "description": "A supernatural effect or item is unstable and liable to discharge unpredictably. Track the effect's trigger and backlash instead of assuming a standard penalty on unrelated rolls.",
    "effect": "A supernatural effect or item is unstable and liable to discharge unpredictably. Track the effect's trigger and backlash instead of assuming a standard penalty on unrelated rolls.",
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
    "description": "A supernatural urge magnifies impulsive gratification, lust or appetite. The character favors immediate indulgence despite likely consequences.",
    "effect": "A supernatural urge magnifies impulsive gratification, lust or appetite. The character favors immediate indulgence despite likely consequences.",
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
    "description": "The Geist is offended and refuses complete cooperation. The specific demand or restriction should be attached to the Condition, rather than inventing a fixed modifier.",
    "effect": "The Geist is offended and refuses complete cooperation. The specific demand or restriction should be attached to the Condition, rather than inventing a fixed modifier.",
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
    "description": "Recent Unleashing or separation weakens the working Bargain. Track the loss of the relevant Geist/Sin-Eater benefits until the bond is restored.",
    "effect": "Recent Unleashing or separation weakens the working Bargain. Track the loss of the relevant Geist/Sin-Eater benefits until the bond is restored.",
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
    "description": "A Renown-driven state rewards sound judgment, spiritual perception or hard-won insight. Only actions genuinely expressing the source's Wise ideal qualify.",
    "effect": "A Renown-driven state rewards sound judgment, spiritual perception or hard-won insight. Only actions genuinely expressing the source's Wise ideal qualify.",
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
    "description": "The character retreats from relationships or active participation because of fear or uncertainty. Initiating contact and committing to action become difficult until confidence is restored.",
    "effect": "The character retreats from relationships or active participation because of fear or uncertainty. Initiating contact and committing to action become difficult until confidence is restored.",
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
    "description": "The named Key SOURCE is Doomed and cannot be used to unlock another Haunt until the Doom is resolved. Identical Keys belonging to other independent sources remain usable.",
    "effect": "The named Key SOURCE is Doomed and cannot be used to unlock another Haunt until the Doom is resolved. Identical Keys belonging to other independent sources remain usable.",
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
    "description": "A ghost is connected to a named person, place or object that ties it to the living world. Record the Anchor: damage, relocation or severing it can change the ghost's options.",
    "effect": "A ghost is connected to a named person, place or object that ties it to the living world. Record the Anchor: damage, relocation or severing it can change the ghost's options.",
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
    "description": "God-Machine Infrastructure sustains an associated angel in the material world, including protection from normal Essence loss. Its functions are limited to the particular Installation and mission.",
    "effect": "God-Machine Infrastructure sustains an associated angel in the material world, including protection from normal Essence loss. Its functions are limited to the particular Installation and mission.",
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
    "description": "A subject shares the nature or emotional resonance of a particular spirit or Goetia, making the subject suitable for certain influences or Manifestations. Record the relevant entity.",
    "effect": "A subject shares the nature or emotional resonance of a particular spirit or Goetia, making the subject suitable for certain influences or Manifestations. Record the relevant entity.",
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
    "description": "A subject has become a receptive vessel for a named ephemeral entity. That entity can use Manifestations requiring Open, but other unrelated entities do not automatically gain the same access.",
    "effect": "A subject has become a receptive vessel for a named ephemeral entity. That entity can use Manifestations requiring Open, but other unrelated entities do not automatically gain the same access.",
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
    "description": "An ephemeral being is bound to a physical creature or object while remaining in Twilight. It can interact with that host as allowed by its powers, without automatically possessing it.",
    "effect": "An ephemeral being is bound to a physical creature or object while remaining in Twilight. It can interact with that host as allowed by its powers, without automatically possessing it.",
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
    "description": "A Fettered entity subtly pushes a living host toward behaviors or impulses of its choosing. The host retains some agency; Urged is not full Possessed control.",
    "effect": "A Fettered entity subtly pushes a living host toward behaviors or impulses of its choosing. The host retains some agency; Urged is not full Possessed control.",
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
    "description": "An ephemeral entity has taken direct control of a material host's actions. Apply the Possession Manifestation and the host's remaining resistance rules.",
    "effect": "An ephemeral entity has taken direct control of a material host's actions. Apply the Possession Manifestation and the host's remaining resistance rules.",
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
    "description": "An entity has prepared a host for permanent Claiming. The victim is vulnerable to being merged with the entity but has not yet become fully Claimed.",
    "effect": "An entity has prepared a host for permanent Claiming. The victim is vulnerable to being merged with the entity but has not yet become fully Claimed.",
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
    "description": "An ephemeral entity has fused with a material host, producing a lasting supernatural hybrid. The host's body and available powers change according to the entity's Claiming rules.",
    "effect": "An ephemeral entity has fused with a material host, producing a lasting supernatural hybrid. The host's body and available powers change according to the entity's Claiming rules.",
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
    "description": "An ephemeral entity has assumed a tangible body. It can be perceived and physically interacted with in the material world for as long as Materialization lasts.",
    "effect": "An ephemeral entity has assumed a tangible body. It can be perceived and physically interacted with in the material world for as long as Materialization lasts.",
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
    "description": "A spirit extends senses or powers across the Gauntlet into the material world without fully crossing into it. The entity remains in its home realm.",
    "effect": "A spirit extends senses or powers across the Gauntlet into the material world without fully crossing into it. The entity remains in its home realm.",
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
    "description": "A portal allows passage between the material world and the Shadow where a suitable Manifestation permits. Record where the Gate is, who can use it and when it closes.",
    "effect": "A portal allows passage between the material world and the Shadow where a suitable Manifestation permits. Record where the Gate is, who can use it and when it closes.",
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
    "description": "A temporary passage joins the living world to the Underworld. Its position, permitted travelers and duration follow the power that opened the Gate.",
    "effect": "A temporary passage joins the living world to the Underworld. Its position, permitted travelers and duration follow the power that opened the Gate.",
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
    "description": "The Geist is bound to the Sin-Eater and is not an independently manifested ghost until Unleashed. Treat its Rank, Ban, Bane and Manifestations by the Bargain rules.",
    "effect": "The Geist is bound to the Sin-Eater and is not an independently manifested ghost until Unleashed. Treat its Rank, Ban, Bane and Manifestations by the Bargain rules.",
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
    "description": "A ghost is subsumed into another ghost and must remain in vulnerable hibernation. The victim cannot act independently while Engulfed.",
    "effect": "A ghost is subsumed into another ghost and must remain in vulnerable hibernation. The victim cannot act independently while Engulfed.",
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
    "description": "An ephemeral being is bound as a Familiar. Its Rank, Manifestations, Essence, Ban/Bane and the binding Merit determine its usable powers; it does not automatically gain extra Numina.",
    "effect": "An ephemeral being is bound as a Familiar. Its Rank, Manifestations, Essence, Ban/Bane and the binding Merit determine its usable powers; it does not automatically gain extra Numina.",
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
    "description": "Below 0 C: each 15 minutes, ordinary Bashing heals normally and is replaced by 1 non-Resistant Bashing. Accelerated supernatural healing rate is halved. -1 to all rolls per hour (max -5); once capped, subsequent hours also inflict 1 Lethal. Adequate warmth or clothing ends exposure.",
    "effect": "Below 0 C: each 15 minutes, ordinary Bashing heals normally and is replaced by 1 non-Resistant Bashing. Accelerated supernatural healing rate is halved. -1 to all rolls per hour (max -5); once capped, subsequent hours also inflict 1 Lethal. Adequate warmth or clothing ends exposure.",
    "resolution": "Gain adequate warmth or shelter, or the cold ends."
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
    "description": "Above 40 C: each 15 minutes, ordinary Bashing heals normally and is replaced by 1 non-Resistant Bashing. Accelerated supernatural healing rate is halved. -1 to all rolls per hour (max -5); once capped, subsequent hours also inflict 1 Lethal. Cooling ends exposure.",
    "effect": "Above 40 C: each 15 minutes, ordinary Bashing heals normally and is replaced by 1 non-Resistant Bashing. Accelerated supernatural healing rate is halved. -1 to all rolls per hour (max -5); once capped, subsequent hours also inflict 1 Lethal. Cooling ends exposure.",
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
    "description": "-3 to visual and auditory Perception. Prolonged heavy rain can lead to flooding, but flood depth and onset are independent scene conditions.",
    "effect": "-3 to visual and auditory Perception. Prolonged heavy rain can lead to flooding, but flood depth and onset are independent scene conditions.",
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
    "description": "Dim lighting impairs tasks requiring clear vision and can conceal details or threats. Restore illumination or use another appropriate sense to avoid the limitation.",
    "effect": "Dim lighting impairs tasks requiring clear vision and can conceal details or threats. Restore illumination or use another appropriate sense to avoid the limitation.",
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
    "description": "The haunted area is aware and responsive to its creator. Apply the Boneyard area, supernatural rules and purchased enhancements; it is not merely a generic environmental penalty.",
    "effect": "The haunted area is aware and responsive to its creator. Apply the Boneyard area, supernatural rules and purchased enhancements; it is not merely a generic environmental penalty.",
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
    "description": "A damaged arm cannot be used normally for gripping, aiming or manipulating objects. Actions requiring the affected limb are hindered until the injury is healed.",
    "effect": "A damaged arm cannot be used normally for gripping, aiming or manipulating objects. Actions requiring the affected limb are hindered until the injury is healed.",
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
    "description": "The character is unwilling or unable to continue fighting aggressively. They may surrender, flee or defend themselves rather than persist in ordinary attacks until the Tilt ends.",
    "effect": "The character is unwilling or unable to continue fighting aggressively. They may surrender, flee or defend themselves rather than persist in ordinary attacks until the Tilt ends.",
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
    "description": "The character cannot see. Activities requiring visual information may be impossible without another sense, while other actions face appropriate circumstances.",
    "effect": "The character cannot see. Activities requiring visual information may be impossible without another sense, while other actions face appropriate circumstances.",
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
    "description": "The character cannot hear well enough to use ordinary auditory information. They may miss speech, alarms and other sound-based warnings, though vision remains available.",
    "effect": "The character cannot hear well enough to use ordinary auditory information. They may miss speech, alarms and other sound-based warnings, though vision remains available.",
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
    "description": "A drug changes perception, coordination or judgment. Apply the substance-specific impairment and duration; intoxication alone is not a universal identical penalty for all drugs.",
    "effect": "A drug changes perception, coordination or judgment. Apply the substance-specific impairment and duration; intoxication alone is not a universal identical penalty for all drugs.",
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
    "description": "The character is physically restrained and cannot reposition freely. Escape, resistance and combat options depend on the source and type of restraint.",
    "effect": "The character is physically restrained and cannot reposition freely. Escape, resistance and combat options depend on the source and type of restraint.",
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
    "description": "An acute panic or delusional episode overwhelms ordinary judgment, potentially causing uncontrollable responses. Use the source-specific behavior restrictions rather than a generic flat penalty.",
    "effect": "An acute panic or delusional episode overwhelms ordinary judgment, potentially causing uncontrollable responses. Use the source-specific behavior restrictions rather than a generic flat penalty.",
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
    "description": "The character's awareness is suppressed and they cannot respond normally to their surroundings. Meaningful actions must wait until consciousness or sensation returns.",
    "effect": "The character's awareness is suppressed and they cannot respond normally to their surroundings. Meaningful actions must wait until consciousness or sensation returns.",
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
    "description": "The character is prone on the ground and may suffer the associated combat limitations until standing up. Remaining prone can sometimes provide cover from ranged attacks.",
    "effect": "The character is prone on the ground and may suffer the associated combat limitations until standing up. Remaining prone can sometimes provide cover from ranged attacks.",
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
    "description": "A damaged leg severely limits walking, running and stable movement. Actions depending on the affected limb are hindered until it recovers.",
    "effect": "A damaged leg severely limits walking, running and stable movement. Actions depending on the affected limb are hindered until it recovers.",
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
    "description": "An active toxin harms the character over time, with interval, damage and resistance determined by the specific poison. Treatment or the end of exposure can stop further harm.",
    "effect": "An active toxin harms the character over time, with interval, damage and resistance determined by the specific poison. Treatment or the end of exposure can stop further harm.",
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
    "description": "Illness weakens the character and may impose continuing penalties or damage. Use the disease's severity, progression and treatment rules rather than one universal modifier.",
    "effect": "Illness weakens the character and may impose continuing penalties or damage. Use the disease's severity, progression and treatment rules rather than one universal modifier.",
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
    "description": "A blow or shock briefly prevents effective action. The character loses the required action or must recover as specified by the source before resuming normal activity.",
    "effect": "A blow or shock briefly prevents effective action. The character loses the required action or must recover as specified by the source before resuming normal activity.",
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
    "description": "A mage's Immediate Nimbus has imposed its distinctive supernatural Tilt on the character. Record whose Nimbus caused it and apply that mage's exact Tilt rather than a universal Nimbus penalty.",
    "effect": "A mage's Immediate Nimbus has imposed its distinctive supernatural Tilt on the character. Record whose Nimbus caused it and apply that mage's exact Tilt rather than a universal Nimbus penalty.",
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
    "description": "Hedge or dream immersion makes wounds from a dream affect the character's body. The consequences are tied to the supernatural dream state and end or persist under that effect's rules.",
    "effect": "Hedge or dream immersion makes wounds from a dream affect the character's body. The consequences are tied to the supernatural dream state and end or persist under that effect's rules.",
    "resolution": "Leave the relevant dream state or the supernatural effect ends."
  }
};

export const getConditionDefinition = (key) => CONDITION_DEFINITIONS[key] || null;
export const getConditionDisplayName = (key) => CONDITION_DEFINITIONS[key]?.name || key;
