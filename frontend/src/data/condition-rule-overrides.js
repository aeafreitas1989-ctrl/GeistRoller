// Canonical Condition and Tilt rule descriptions.
export const CONDITION_RULE_OVERRIDES = {
  "Abyssal Backlash": {
    "effect": "On your next spell that risks Paradox, add Paradox dice equal to the successes that imposed this Condition.",
    "resolution": "Fully contain a later Paradox, Scour the Condition from the Pattern, or allow it to lapse (the latter grants an Arcane Beat and taints the Pattern).",
    "source_citation": "Mage: The Awakening 2e, p. 116"
  },
  "Abyssal Imago": {
    "effect": "Each spell requires additional Reach equal to the Paradox successes that imposed this Condition. Without it, the spell automatically fails and its spellcasting pool is added to the Paradox pool.",
    "resolution": "Successfully cast a spell that does not risk Paradox, Scour the Condition, or allow it to lapse (Arcane Beat; Abyssal Pattern taint).",
    "source_citation": "Mage: The Awakening 2e, p. 116"
  },
  "Abyssal Nimbus": {
    "effect": "The mage and subjects affected by her Nimbus become Resonant to Abyssal entities (Open on exceptional Paradox success). Signature and Long-Term Nimbus reveal Abyssal corruption.",
    "resolution": "An Abyssal entity uses the Condition to Manifest, the mage Scours it away, or it lapses (Arcane Beat; Abyssal Pattern taint).",
    "source_citation": "Mage: The Awakening 2e, p. 116"
  },
  "Abyssal Taint": {
    "effect": "Abyssal corruption is detectable in the mage’s Nimbus. Every spell adds 1 Paradox die, even within free Reach.",
    "resolution": "Scour: suffer 1 resistant lethal wound; gain no Mana or Arcane Beat.",
    "source_citation": "Mage: The Awakening 2e, p. 116"
  },
  "Actor": {
    "effect": "The subject must play their assigned role in a Memoria Mystery Play or suffer the consequences of departing from its script.",
    "resolution": "Complete the role, escape the Memoria, or alter its script through the relevant enhancement.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Addicted": {
    "effect": "Dependence on a substance or behavior. When deprived, gain Deprived (−1 to Stamina-, Resolve- and Composure-based rolls).",
    "resolution": "Meaningful recovery through treatment, a character-defining change or a supernatural cure.",
    "source_citation": "CoD 2e / Mage 2e"
  },
  "Addled": {
    "effect": "Interference with the Geist’s Remembrance alters or obscures the Bound’s memories as specified by the source.",
    "resolution": "Re-establish reliable memory or remove the supernatural disturbance.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Amnesia": {
    "effect": "The Storyteller determines which memories are inaccessible and when they can be recalled.",
    "resolution": "Recover the missing memory, discover its significance, or resolve the associated story.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Blind": {
    "effect": "Sight-dependent tasks are impossible without alternative perception. The Storyteller adjudicates other penalties.",
    "resolution": "The character regains sight or removes the cause of blindness.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Blind [Mage]": {
    "effect": "Sight-dependent tasks are impossible without alternative perception. The Storyteller adjudicates other penalties; Mage Sight does not restore mundane vision.",
    "resolution": "Restore sight or remove the spell/condition that caused blindness.",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Bonded": {
    "effect": "Gain +2 dice to influence or persuade the bonded animal. While together, the animal can benefit from your Animal Ken when resisting fear or coercion, or for an appropriate roll.",
    "resolution": "The bond ends permanently, including through the animal’s death.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Bonding": {
    "effect": "Apply the Synergy or Bond improvement specified by the relationship-strengthening experience.",
    "resolution": "Complete the prescribed relationship or Synergy improvement.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Boneyard": {
    "effect": "The Sin-Eater gains awareness throughout the haunted area. Movement, Tilts and Rules depend on purchased Boneyard enhancements.",
    "resolution": "The Boneyard expires, is relinquished or is displaced according to its activation.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Boneyard [Environmental Tilt]": {
    "effect": "The haunted area is aware and responsive to its creator under the Boneyard Rules and purchased enhancements.",
    "resolution": "The underlying Boneyard Haunt ends or this location leaves its area.",
    "source_citation": "Geist: The Sin-Eaters 2e, environmental Tilts"
  },
  "Bound Geist [Ephemeral]": {
    "effect": "The Geist remains bound to the Sin-Eater until Unleashed. Rank, Ban, Bane and Manifestations follow the Bargain rules.",
    "resolution": "The Bargain ends or the Geist becomes independently Unleashed.",
    "source_citation": "Geist: The Sin-Eaters 2e, ephemeral Conditions"
  },
  "Broken": {
    "effect": "Subtract 2 dice from Social and Resolve rolls. Attempts to use Intimidation suffer a −5 penalty instead. This Condition also prevents normal Willpower expenditure until resolved.",
    "resolution": "Back down or suffer an appropriate consequential failure because of Broken; an applicable Integrity change or exceptional breaking-point success may also resolve it.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Caul": {
    "effect": "The Sin-Eater merges with the Geist. Purchased transformations consume their specified Plasm-derived charges.",
    "resolution": "The transformation ends, the charges expire or the Haunt’s specified trigger resolves it.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Charmed": {
    "effect": "Expend stored uses for the favorable coincidence or damage mitigation specified by the granting effect.",
    "resolution": "Expend the charm or end the originating magic.",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Connected": {
    "effect": "Gain +2 dice on relevant rolls involving the specified organization or group. You may resolve Connected to claim a one-time +3 bonus to influence or work with that group, burning the connection.",
    "resolution": "Use and exhaust the privileged connection, or sever that relationship.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Connected [Mage]": {
    "effect": "Gain +2 dice on relevant rolls involving the named group. Resolve for a one-time +3 interaction bonus, sacrificing the connection.",
    "resolution": "Use and lose the contact or sever the relationship.",
    "source_citation": "Mage: The Awakening 2e / CoD 2e"
  },
  "Crippled": {
    "effect": "Walking Speed is 1. Mobility aids may alter effective movement.",
    "resolution": "Recover mobility, or reach a significant story event where the impairment creates genuine danger or severe hindrance.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Curse": {
    "effect": "The Sin-Eater may reflexively expend stored charges for effects granted by purchased Curse enhancements.",
    "resolution": "The charges are used, the curse is broken, or its mark is cleansed as specified by the Haunt.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Dead": {
    "effect": "The Bound’s body is dead; the Geist acts under the death and Bargain rules. Natural healing cannot restore life.",
    "resolution": "Return to life under the Bargain or an appropriate supernatural restoration.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Defeated": {
    "effect": "The defeated Duel Arcane participant cannot spend Willpower or cast magic to harm the victor. The winner gains a Strong sympathetic connection to the defeated mage for the Condition’s duration.",
    "resolution": "Publicly accept the defeat at meaningful personal cost, or suffer a significant exploitation by the winner.",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Defiant": {
    "effect": "Breaking a Boneyard Rule exposes the subject to its specified punishment, including any effect of the creator’s Synergy.",
    "resolution": "Submit to an appropriate punishment or make meaningful restitution for the breach.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Deprived": {
    "effect": "Subtract 1 die from every roll involving Stamina, Resolve or Composure while deprived of the specified substance, habit or need.",
    "resolution": "Satisfy the deprivation or overcome it through effective treatment.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Dirge": {
    "effect": "A subject affected by the haunting song experiences the indicated emotional direction. Acting in concert with the song grants +2 dice to relevant rolls; opposing it may require resisting the supernatural compulsion.",
    "resolution": "A different character shakes the subject out of it with an instant action, or the Haunt ends.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Disabled": {
    "effect": "Movement or use of the affected body part is restricted as specified by the injury or spell.",
    "resolution": "Regain function or end the supernatural cause.",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Doomed": {
    "effect": "The affected Key source cannot unlock another Haunt until its Doom is resolved. Independent sources of the same Key remain usable.",
    "resolution": "Undergo the specific Doom attached to that Key source.",
    "source_citation": "Geist: The Sin-Eaters 2e, Keys"
  },
  "Echoes": {
    "effect": "Intrusive memories or traits of the Geist impose the recorded impulse or conflict on the Bound.",
    "resolution": "Process the intrusive memory or resolve its associated Remembrance.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Embarrassing Secret": {
    "effect": "Another party can exploit a damaging secret. If the secret becomes public, remove Embarrassing Secret and apply Notoriety instead.",
    "resolution": "The damaging secret is revealed or no longer provides leverage.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Enervated": {
    "effect": "Advanced soul loss reduces available Willpower and impairs supernatural or moral actions according to the stage of deprivation.",
    "resolution": "Recover the soul before deprivation progresses.",
    "source_citation": "Mage: The Awakening 2e, soul-loss rules"
  },
  "Engulfed [Ephemeral]": {
    "effect": "A ghost is subsumed into another ghost in vulnerable hibernation and cannot act independently.",
    "resolution": "Be freed from the engulfing entity or end the controlling supernatural effect.",
    "source_citation": "Geist: The Sin-Eaters 2e, ephemeral Conditions"
  },
  "Familiar [Ephemeral]": {
    "effect": "The bound familiar’s powers depend on its Rank, Manifestations, Essence, Ban, Bane and binding Merit.",
    "resolution": "The bond is ended or the familiar is released.",
    "source_citation": "Mage: The Awakening 2e, familiars"
  },
  "Ferry Bound": {
    "effect": "The Bound may ferry travelers through Underworld rivers in exchange for the specified price.",
    "resolution": "Complete the passage and pay/collect its price, or end the duty according to the effect.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Flatlining": {
    "effect": "Low Synergy disrupts cooperation between Bound and Geist and may restrict their shared benefits.",
    "resolution": "Repair the relationship and restore the required Synergy threshold.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Fugue": {
    "effect": "When circumstances evoke the trauma that caused the Fugue, roll Resolve + Composure. On failure, the Storyteller may direct the character for the scene as they flee or avoid the trigger.",
    "resolution": "Suffer a significant consequence of an episode, or meet the relevant Integrity/breaking-point recovery condition.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Ghost-Marked": {
    "effect": "A ghost leaves a persistent mark whose Anchor status and restrictions depend on the causing effect.",
    "resolution": "Remove the mark with appropriate supernatural intervention.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Guilty": {
    "effect": "−2 dice to Resolve- or Composure-based rolls defending against Subterfuge, Empathy or Intimidation.",
    "resolution": "Confess the wrongdoing, make restitution, or otherwise genuinely atone.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Humbled": {
    "effect": "The mage cannot willingly harm the specific person or ideal that inspired this Condition.",
    "resolution": "Defend the subject at significant cost or confront the imposed ideal in a meaningful way.",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Indebted": {
    "effect": "Neglecting a Touchstone incurs a spiritual debt or obligation to that Touchstone.",
    "resolution": "Make meaningful amends and fulfill the neglected relationship.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Informed": {
    "effect": "After a relevant non-combat Skill roll, upgrade a failure to one success or an ordinary success to exceptional success. Dramatic failures are ineligible.",
    "resolution": "Use the result upgrade.",
    "source_citation": "CoD 2e, Conditions, p. 289"
  },
  "Inspired": {
    "effect": "Before a relevant roll, regain 1 Willpower and reduce the exceptional-success threshold from 5 successes to 3.",
    "resolution": "Invoke this benefit before rolling.",
    "source_citation": "CoD 2e, Conditions, p. 289"
  },
  "Lawbreaker": {
    "effect": "Violating a Dominion’s Old Law incurs its specified supernatural judgment and punishment.",
    "resolution": "Accept the specified judgment, make restitution, or escape or overturn the Dominion’s authority.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Leveraged": {
    "effect": "The specified threat or obligation makes resisting its holder’s demands harder. Distinct sources may coexist.",
    "resolution": "Refuse a demand despite the leverage, escape the pressure, or turn the tables on the source.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Lost": {
    "effect": "No reliable progress toward the destination until reoriented. Navigate with Wits + Streetwise (urban) or Wits + Survival (outdoors), as appropriate.",
    "resolution": "Navigate successfully, find a guide, or abandon the original destination.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Madness": {
    "effect": "Once per chapter, the Storyteller may impose a situational penalty of up to 10 − Integrity dice on a Mental or Social roll.",
    "resolution": "Fail a roll because of the Condition, or meet the specified Integrity/breaking-point recovery criterion.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Marionette": {
    "effect": "The Bound animates the subject or object with Plasm. Directing it for a turn requires an instant action; resistance follows the Haunt rules.",
    "resolution": "Break the control or end the Haunt; Servant enhancement can replace this Condition.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Megalomaniacal": {
    "effect": "Hubris imposes the behavioral restrictions and consequences of the originating Wisdom breaking point.",
    "resolution": "Suffer the stated consequence of your hubris or resolve it through appropriate personal realization.",
    "source_citation": "Mage: The Awakening 2e, Wisdom conditions"
  },
  "Memento Collector": {
    "effect": "A collection of Mementos grants the source’s specified social standing among other Bound.",
    "resolution": "Lose the collection’s significance or fulfill its associated story condition.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Memoria": {
    "effect": "The subject perceives or enters a memory of the dead; roles, participants and consequences depend on the Haunt’s enhancements.",
    "resolution": "Complete the recollection, leave the scene or resolve the specific Haunt effect.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Memory Bleed": {
    "effect": "Another identity’s memories or motivations intrude; apply any source-specific loss of Clarity.",
    "resolution": "Disentangle the memories or confront the identity producing them.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Mute": {
    "effect": "Speech is unavailable; verbal commands, persuasion and incantations require an alternative method where possible.",
    "resolution": "Regain the ability to speak or remove the underlying cause.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Mystery Commands": {
    "effect": "The mage is compelled by the specified Mystery-derived command, with its recorded strength and consequences.",
    "resolution": "Obey, meaningfully resist, or otherwise resolve the originating Mystery’s directive.",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Notoriety": {
    "effect": "Subtract 2 dice from Social rolls involving people who know the damaging reputation. Social Maneuvering against such people requires one additional Door.",
    "resolution": "Debunk the story or repair the reputation sufficiently.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Obsession": {
    "effect": "Gain 9-again on rolls directly pursuing the obsession.",
    "resolution": "Fulfil the obsession, renounce it meaningfully, or overcome it through treatment.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Obsession [Mage]": {
    "effect": "Gain 9-again on rolls directly pursuing this fixation. Character-sheet Obsessions award Arcane Beats separately.",
    "resolution": "Fulfil or overcome this particular fixation.",
    "source_citation": "Mage: The Awakening 2e / CoD 2e"
  },
  "Oracle": {
    "effect": "Use death-sight or Underworld travel to consult a Mystery. Questions and limits depend on Oracle dots and purchased enhancements.",
    "resolution": "Return to ordinary awareness or complete the consultation.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Rage": {
    "effect": "Ghostly rage grants the damage type, weapon rating, range and Tilts permitted by Rage and its purchased enhancements.",
    "resolution": "The Haunt ends or its effects are expended.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Rampant": {
    "effect": "Compelled to use magic even for everyday problems; resisting requires Willpower or Storyteller adjudication according to the trigger.",
    "resolution": "Let magic create significant complications, or overcome the compulsion.",
    "source_citation": "Mage: The Awakening 2e, Wisdom conditions"
  },
  "Regalia": {
    "effect": "The krewe’s investiture grants the specified authority, protection or dot-rated benefit.",
    "resolution": "The blessing ends or is taken back by the krewe.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Servant": {
    "effect": "Enhanced Marionette control permits ongoing commands without turn-by-turn direction; target limits and duration follow the enhancements.",
    "resolution": "Break the supernatural subservience or let its Haunt duration expire.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Shaken": {
    "effect": "Before a roll affected by fear, you may choose to fail it outright. No passive dice penalty.",
    "resolution": "Choose the voluntary failure; gain the normal resolution Beat.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Shroud": {
    "effect": "The Bound gains ghostlike qualities and interaction with Twilight. Protections, movement and Numina depend on purchased Shroud enhancements.",
    "resolution": "Dismiss the Shroud, expend the permitted effect or end the Haunt.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Soul Shocked": {
    "effect": "When inflicted, roll current Willpower points as a dice pool without 10-again; retain 1 Willpower point per success and lose the rest (do not roll a chance die at zero). While affected, do not regain Willpower through Virtue/Vice, though rest and other methods still work.",
    "resolution": "Complete reintegration and appropriate recovery after the out-of-body experience.",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Soulless": {
    "effect": "Soul loss impairs Willpower recovery, causes escalating moral and psychological deterioration, and increases vulnerability to possession.",
    "resolution": "Recover the soul or halt the process before irreversible loss.",
    "source_citation": "Mage: The Awakening 2e, soul-loss rules"
  },
  "Spooked": {
    "effect": "Fear and fascination with a supernatural experience compel risky investigation.",
    "resolution": "Act on the fascination in a way that hinders the group or causes a significant complication.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Steadfast": {
    "effect": "After an ordinary failed roll, gain one success. If the original roll was a chance die, roll one regular die instead (8+ success, 10-again).",
    "resolution": "Use this benefit on an eligible failed roll.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Strained": {
    "effect": "Suffer −1 die on the next breaking-point roll arising from witnessing magic. If you have the Strained Merit and avoid the roll, the penalty stacks by −1 each time (maximum −5), after which you must face the roll.",
    "resolution": "Resolve the initiating magical confrontation or its psychological consequences.",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Swooned": {
    "effect": "Subtract 2 dice on rolls that would harm or work against the object of affection. That person gains +2 dice to Social rolls against you; their Social Maneuvering impression improves one level (maximum Perfect).",
    "resolution": "Put yourself at risk for the person, suffer danger because of them, or deliberately fail to resist their Social action.",
    "source_citation": "CoD 2e, Conditions"
  },
  "Theophany": {
    "effect": "A krewe achievement grants the source’s specified temporary spiritual benefit.",
    "resolution": "Its revelation produces a meaningful consequence or the relevant story completes.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Thrall": {
    "effect": "Cannot spend Willpower or Experience, use Defense or cast spells. Also suffers Broken.",
    "resolution": "Restore the soul through the relevant supernatural intervention.",
    "source_citation": "Mage: The Awakening 2e, soul-loss rules"
  },
  "Tomb": {
    "effect": "The Bound recreates an object or person from deathly memory; traits and limitations depend on the replica and purchased Tomb enhancements.",
    "resolution": "The created replica is destroyed, dismissed or expires.",
    "source_citation": "Geist: The Sin-Eaters 2e, Haunt Conditions"
  },
  "Triumphant": {
    "effect": "Exceptional success requires 3 successes instead of 5 on Social rolls with Awakened who know of the Duel Arcane victory.",
    "resolution": "The victory ceases to matter socially, or another consequential duel supersedes it.",
    "source_citation": "Mage: The Awakening 2e, Conditions"
  },
  "Unleashed": {
    "effect": "The Geist manifests independently, using its own actions and Traits. Apply Bargain separation and Bond consequences.",
    "resolution": "The Geist returns to the Bound or the separation ends.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Wavering": {
    "effect": "The offended Geist withholds cooperation according to its specified demand or restriction.",
    "resolution": "Meet the Geist’s demand, make amends or restore trust.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  },
  "Weakened Bond": {
    "effect": "Unleashing or separation weakens the Bargain, with loss of the specified benefits until the Bond is restored.",
    "resolution": "Reunite and complete the requisite reconciliation or recovery.",
    "source_citation": "Geist: The Sin-Eaters 2e, Conditions"
  }
};

export const getConditionRuleOverride = (name) => CONDITION_RULE_OVERRIDES[name] || null;
