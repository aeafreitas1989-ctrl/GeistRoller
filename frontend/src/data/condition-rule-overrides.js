// CofDRoller: distinct mechanics and resolution text for Core, Mage and Geist Conditions.
// These original paraphrases do not replace the cited sourcebooks or ST adjudication.
// Do not apply generic bonuses where the source requires a named subject, source or roll.

export const CONDITION_RULE_OVERRIDES = {
  "Abyssal Backlash": {
    effect: "When you next cast a spell that risks Paradox, add Paradox dice equal to the successes on the Paradox roll that created this Condition. Record that number when applying it; do not use a fixed modifier.",
    resolution: "Fully contain a later Paradox, Scour the Condition from the Pattern, or allow it to lapse (the latter grants an Arcane Beat and taints the Pattern).",
    source_citation: "Mage: The Awakening 2e, p. 116",
  },
  "Abyssal Imago": {
    effect: "For every subsequent spell, spend additional Reach equal to the successes on the Paradox roll that imposed this Condition. Without this Reach, the spell automatically fails and its spellcasting dice pool is added to its Paradox dice.",
    resolution: "Successfully cast a spell that does not risk Paradox, Scour the Condition, or allow it to lapse (Arcane Beat; Abyssal Pattern taint).",
    source_citation: "Mage: The Awakening 2e, p. 116",
  },
  "Abyssal Nimbus": {
    effect: "The mage and subjects affected by her Nimbus become Resonant to Abyssal entities; if the originating Paradox roll was exceptional, they become Open instead. Signature and Long-Term Nimbus carry detectable Abyssal corruption.",
    resolution: "An Abyssal entity uses the Condition to Manifest, the mage Scours it away, or it lapses (Arcane Beat; Abyssal Pattern taint).",
    source_citation: "Mage: The Awakening 2e, p. 116",
  },
  "Abyssal Taint": {
    "effect": "The Abyss has entered the mage’s Pattern and is detectable in her Nimbus. Every spell she casts adds one Paradox die, even without exceeding free Reach.",
    "resolution": "Scour the taint from the Pattern: suffer one resistant lethal wound, gain no Mana and no additional Arcane Beat.",
    "source_citation": "Mage: The Awakening 2e, p. 116"
  },
  "Actor": {
    effect: "While a Memoria Mystery Play controls a scene, the subject is cast in a specific role and faces consequences for departing from the recalled script. Track the scene and its assigned role.",
    resolution: "Complete the role, escape the Memoria, or alter its script through the relevant enhancement.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Addicted": {
    effect: "A persistent dependence on a named substance or behavior. If deprived, apply Deprived and its −1 penalty to Stamina-, Resolve- and Composure-based pools.",
    resolution: "Meaningful recovery through treatment, a character-defining change or a supernatural cure.",
    source_citation: "CoD 2e / Mage 2e",
  },
  "Addled": {
    effect: "The Bound’s memories become unreliable or confused because of interference with the Geist’s Remembrance. The specific forgotten or substituted details are determined by the source.",
    resolution: "Re-establish reliable memory or remove the supernatural disturbance.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Amnesia": {
    effect: "A substantial part of the character’s memories is inaccessible. The Storyteller determines which information cannot be recalled and when it becomes accessible; no universal dice-pool penalty applies.",
    resolution: "Recover the missing memory, discover its significance, or resolve the associated story.",
    source_citation: "CoD 2e, Conditions",
  },
  "Blind": {
    effect: "The character cannot perceive visually. Sight-dependent tasks are impossible without another means of perception; other actions suffer circumstances appropriate to blindness, as adjudicated by the Storyteller.",
    resolution: "The character regains sight or removes the cause of blindness.",
    source_citation: "CoD 2e, Conditions",
  },
  "Blind [Mage]": {
    effect: "The character has no functional sight. Treat visual tasks as impossible without an alternate sense, and apply appropriate circumstances to other actions; Mage Sight does not automatically restore mundane vision.",
    resolution: "Restore sight or remove the spell/condition that caused blindness.",
    source_citation: "Mage: The Awakening 2e, Conditions",
  },
  "Bonded": {
    effect: "Gain +2 dice to influence or persuade the bonded animal. While together, the animal can benefit from your Animal Ken when resisting fear or coercion, or for an appropriate roll.",
    resolution: "The bond ends permanently, including through the animal’s death.",
    source_citation: "CoD 2e, Conditions",
  },
  "Bonding": {
    effect: "The character and Geist have undergone a relationship-strengthening experience. Follow the associated Synergy/Bond rules; do not grant an unearned die bonus merely for having the Condition.",
    resolution: "Complete the prescribed relationship or Synergy improvement.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Boneyard": {
    effect: "The Sin-Eater has defined a haunted area and gains awareness throughout it; special movement, environmental Tilts and Rules depend on purchased Boneyard enhancements. Record the affected area and activator.",
    resolution: "The Boneyard expires, is relinquished or is displaced according to its activation.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Boneyard [Environmental Tilt]": {
    effect: "The haunted area is aware and responsive to its creator. Apply the Boneyard area, supernatural rules and purchased enhancements; it is not merely a generic environmental penalty.",
    resolution: "The underlying Boneyard Haunt ends or this location leaves its area.",
    source_citation: "Geist: The Sin-Eaters 2e, environmental Tilts",
  },
  "Bound Geist [Ephemeral]": {
    effect: "The Geist is bound to the Sin-Eater and is not an independently manifested ghost until Unleashed. Treat its Rank, Ban, Bane and Manifestations by the Bargain rules.",
    resolution: "The Bargain ends or the Geist becomes independently Unleashed.",
    source_citation: "Geist: The Sin-Eaters 2e, ephemeral Conditions",
  },
  "Broken": {
    effect: "Subtract 2 dice from Social and Resolve rolls. Attempts to use Intimidation suffer a −5 penalty instead. This Condition also prevents normal Willpower expenditure until resolved.",
    resolution: "Back down or suffer an appropriate consequential failure because of Broken; an applicable Integrity change or exceptional breaking-point success may also resolve it.",
    source_citation: "CoD 2e, Conditions",
  },
  "Caul": {
    effect: "The Sin-Eater merges bodily with the Geist. Record Plasm-derived charges and each purchased transformation; charge-based powers expend their specified charges rather than providing permanent bonuses.",
    resolution: "The transformation ends, the charges expire or the Haunt’s specified trigger resolves it.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Charmed": {
    effect: "A supernatural blessing of fortune may be discharged for the specific favorable coincidence or damage mitigation allowed by the granting effect. Track its origin and any stored uses; there is no universal passive bonus.",
    resolution: "Expend the charm or end the originating magic.",
    source_citation: "Mage: The Awakening 2e, Conditions",
  },
  "Connected": {
    effect: "Gain +2 dice on relevant rolls involving the specified organization or group. You may resolve Connected to claim a one-time +3 bonus to influence or work with that group, burning the connection.",
    resolution: "Use and exhaust the privileged connection, or sever that relationship.",
    source_citation: "CoD 2e, Conditions",
  },
  "Connected [Mage]": {
    effect: "Gain +2 dice on applicable rolls involving the named social group; may resolve for a one-time +3 interaction bonus, sacrificing the relationship. Follow the Core Connected rule.",
    resolution: "Use and lose the contact or sever the relationship.",
    source_citation: "Mage: The Awakening 2e / CoD 2e",
  },
  "Crippled": {
    effect: "The character cannot use the legs normally; walking Speed becomes 1. Mobility aids may change effective movement. The associated persistent impairment remains until properly addressed.",
    resolution: "Recover mobility, or reach a significant story event where the impairment creates genuine danger or severe hindrance.",
    source_citation: "CoD 2e, Conditions",
  },
  "Curse": {
    effect: "The subject carries a supernatural curse with charges determined by the activation. The Sin-Eater may expend charges reflexively to impose only the effects purchased through Curse enhancements. Track source and charges.",
    resolution: "The charges are used, the curse is broken, or its mark is cleansed as specified by the Haunt.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Dead": {
    effect: "The Bound’s living body is dead while the Geist acts under the special death/Bargain rules. Ordinary natural healing does not restore life; apply the appropriate Geist separation consequences.",
    resolution: "Return to life under the Bargain or an appropriate supernatural restoration.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Defeated": {
    effect: "The defeated Duel Arcane participant cannot spend Willpower or cast magic to harm the victor. The winner gains a Strong sympathetic connection to the defeated mage for the Condition’s duration.",
    resolution: "Publicly accept the defeat at meaningful personal cost, or suffer a significant exploitation by the winner.",
    source_citation: "Mage: The Awakening 2e, Conditions",
  },
  "Defiant": {
    effect: "The subject broke a Rule established by Boneyard and may suffer its associated punishment. The exact imposed Rule, penalty and creator’s Synergy must be recorded.",
    resolution: "Submit to an appropriate punishment or make meaningful restitution for the breach.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Deprived": {
    effect: "Subtract 1 die from every roll involving Stamina, Resolve or Composure while deprived of the specified substance, habit or need.",
    resolution: "Satisfy the deprivation or overcome it through effective treatment.",
    source_citation: "CoD 2e, Conditions",
  },
  "Dirge": {
    effect: "A subject affected by the haunting song experiences the indicated emotional direction. Acting in concert with the song grants +2 dice to relevant rolls; opposing it may require resisting the supernatural compulsion.",
    resolution: "A different character shakes the subject out of it with an instant action, or the Haunt ends.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Disabled": {
    effect: "Movement and use of the affected part are seriously restricted. Apply the specific restriction imposed by the creating spell or injury, not an invented universal dice modifier.",
    resolution: "Regain function or end the supernatural cause.",
    source_citation: "Mage: The Awakening 2e, Conditions",
  },
  "Doomed": {
    effect: "The named Key SOURCE is Doomed and cannot be used to unlock another Haunt until the Doom is resolved. Identical Keys belonging to other independent sources remain usable.",
    resolution: "Undergo the specific Doom attached to that Key source.",
    source_citation: "Geist: The Sin-Eaters 2e, Keys",
  },
  "Echoes": {
    effect: "The Geist’s intrusive memories or traits impose a particular remembered impulse or conflict. Record its trigger and how it affects the Bound; the effect is not a generic universal dice penalty.",
    resolution: "Process the intrusive memory or resolve its associated Remembrance.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Embarrassing Secret": {
    effect: "Another party can exploit a damaging secret. If the secret becomes public, remove Embarrassing Secret and apply Notoriety instead.",
    resolution: "The damaging secret is revealed or no longer provides leverage.",
    source_citation: "CoD 2e, Conditions",
  },
  "Enervated": {
    effect: "Advanced soul deprivation reduces the character’s available Willpower and interferes with certain supernatural or moral actions. Use the soul-loss stage from the initiating effect; penalties depend on how long the soul is missing.",
    resolution: "Recover the soul before deprivation progresses.",
    source_citation: "Mage: The Awakening 2e, soul-loss rules",
  },
  "Engulfed [Ephemeral]": {
    effect: "A ghost is subsumed into another ghost and must remain in vulnerable hibernation. The victim cannot act independently while Engulfed.",
    resolution: "Be freed from the engulfing entity or end the controlling supernatural effect.",
    source_citation: "Geist: The Sin-Eaters 2e, ephemeral Conditions",
  },
  "Familiar [Ephemeral]": {
    effect: "An ephemeral being is bound as a Familiar. Its Rank, Manifestations, Essence, Ban/Bane and the binding Merit determine its usable powers; it does not automatically gain extra Numina.",
    resolution: "The bond is ended or the familiar is released.",
    source_citation: "Mage: The Awakening 2e, familiars",
  },
  "Ferry Bound": {
    effect: "The Bound is authorized to ferry travelers through Underworld rivers but must demand or pay the specified price. Record the route, passengers and obligation.",
    resolution: "Complete the passage and pay/collect its price, or end the duty according to the effect.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Flatlining": {
    effect: "The relationship between Bound and Geist has broken down at low Synergy; cooperation and access to benefits may be restricted until reconciled. Record the source of the conflict.",
    resolution: "Repair the relationship and restore the required Synergy threshold.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Fugue": {
    effect: "When circumstances evoke the trauma that caused the Fugue, roll Resolve + Composure. On failure, the Storyteller may direct the character for the scene as they flee or avoid the trigger.",
    resolution: "Suffer a significant consequence of an episode, or meet the relevant Integrity/breaking-point recovery condition.",
    source_citation: "CoD 2e, Conditions",
  },
  "Ghost-Marked": {
    effect: "A ghostly influence has left a persistent physical or supernatural mark. Its nature, whether it functions as an Anchor and any related restriction are established by the causing effect.",
    resolution: "Remove the mark with appropriate supernatural intervention.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Guilty": {
    effect: "Subtract 2 dice from Resolve- or Composure-based rolls made to DEFEND against a manipulator using Subterfuge, Empathy or Intimidation. This is not a penalty to your own Subterfuge rolls.",
    resolution: "Confess the wrongdoing, make restitution, or otherwise genuinely atone.",
    source_citation: "CoD 2e, Conditions",
  },
  "Humbled": {
    effect: "The mage is profoundly affected by a demonstration of humanity and cannot willingly harm the particular person or ideal that inspired the Condition. Record that subject explicitly.",
    resolution: "Defend the subject at significant cost or confront the imposed ideal in a meaningful way.",
    source_citation: "Mage: The Awakening 2e, Conditions",
  },
  "Indebted": {
    effect: "Failure to attend to a Touchstone incurs an outstanding spiritual debt or obligation. Record the Touchstone and the action required to discharge the debt.",
    resolution: "Make meaningful amends and fulfill the neglected relationship.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Informed": {
    effect: "After making a relevant, non-combat Skill roll, resolve Informed to upgrade a failure to one success, or an ordinary success to an exceptional success. It does not alter an existing dramatic failure.",
    resolution: "Use this result-upgrade benefit on an eligible Skill roll.",
    source_citation: "CoD 2e, Conditions, p. 289",
  },
  "Inspired": {
    effect: "Before a roll relating to the inspiration, resolve Inspired. Regain 1 Willpower and reduce the threshold for exceptional success on that roll from 5 successes to 3. Failure remains failure.",
    resolution: "Invoke the inspiration for a relevant roll.",
    source_citation: "CoD 2e, Conditions, p. 289",
  },
  "Lawbreaker": {
    effect: "Violation of a Dominion’s Old Law attracts supernatural judgment. Record the Law, the adjudicating Dominion and the actual punishment; the Condition is not a universal penalty.",
    resolution: "Accept the specified judgment, make restitution, or escape or overturn the Dominion’s authority.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Leveraged": {
    effect: "A named character holds convincing leverage over you. The leverage affects attempts to resist that character’s demands; record the specific threat or obligation. Multiple distinct sources may coexist.",
    resolution: "Refuse a demand despite the leverage, escape the pressure, or turn the tables on the source.",
    source_citation: "CoD 2e, Conditions",
  },
  "Lost": {
    effect: "Until you become reoriented, you cannot make reliable progress toward your destination. Navigation usually requires Wits + Streetwise in an urban area or Wits + Survival outdoors.",
    resolution: "Navigate successfully, find a guide, or abandon the original destination.",
    source_citation: "CoD 2e, Conditions",
  },
  "Madness": {
    effect: "Supernaturally induced instability. Once per chapter, the Storyteller may impose an appropriate penalty of up to 10 − Integrity dice on a Mental or Social roll. Apply only when triggered.",
    resolution: "Fail a roll because of the Condition, or meet the specified Integrity/breaking-point recovery criterion.",
    source_citation: "CoD 2e, Conditions",
  },
  "Marionette": {
    effect: "The subject or object is animated by the Bound’s Plasm. The Sin-Eater must use an instant action to direct a puppeteered subject for a turn; control is resisted as specified by the Haunt.",
    resolution: "Break the control or end the Haunt; Servant enhancement can replace this Condition.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Megalomaniacal": {
    effect: "Hubris distorts the mage’s judgment. Follow the Wisdom-breakpoint consequence and the listed behavioral restrictions; do not treat this as a generic +/−2 modifier.",
    resolution: "Suffer the stated consequence of your hubris or resolve it through appropriate personal realization.",
    source_citation: "Mage: The Awakening 2e, Wisdom conditions",
  },
  "Memento Collector": {
    effect: "The Sin-Eater’s collection of Mementos establishes a reputation among other Bound. It confers the specific social standing described by the source; no blanket equipment bonus is implied.",
    resolution: "Lose the collection’s significance or fulfill its associated story condition.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Memoria": {
    effect: "The subject perceives or enters a manifestation of memories of the dead. Track the memory, its consequences and any roles or extra participants from enhancements.",
    resolution: "Complete the recollection, leave the scene or resolve the specific Haunt effect.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Memory Bleed": {
    effect: "The character experiences another identity’s memories as their own. Record which memories or motivations intrude; apply any specific loss of clarity from the source.",
    resolution: "Disentangle the memories or confront the identity producing them.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Mute": {
    effect: "The character cannot communicate through speech; verbal persuasion, spoken commands, incantations and similar acts may be impossible without an alternative communication method.",
    resolution: "Regain the ability to speak or remove the underlying cause.",
    source_citation: "CoD 2e, Conditions",
  },
  "Mystery Commands": {
    effect: "The mage is compelled by an Exarchal or other Mystery-derived directive. The actual command, its strength and consequences must be recorded on the specific Condition; no universal roll modifier can replace it.",
    resolution: "Obey, meaningfully resist, or otherwise resolve the originating Mystery’s directive.",
    source_citation: "Mage: The Awakening 2e, Conditions",
  },
  "Notoriety": {
    effect: "Subtract 2 dice from Social rolls involving people who know the damaging reputation. Social Maneuvering against such people requires one additional Door.",
    resolution: "Debunk the story or repair the reputation sufficiently.",
    source_citation: "CoD 2e, Conditions",
  },
  "Obsession": {
    effect: "Rolls directly pursuing, investigating or acting in accordance with the obsession receive 9-again. This quality does not apply to unrelated actions; mark applicability explicitly for each roll.",
    resolution: "Fulfil the obsession, renounce it meaningfully, or overcome it through treatment.",
    source_citation: "CoD 2e, Conditions",
  },
  "Obsession [Mage]": {
    effect: "Core Obsession’s 9-again applies only to relevant actions; distinguish this Condition from the mage’s character-sheet Obsessions, which award Arcane Beats through their own rules.",
    resolution: "Fulfil or overcome this particular fixation.",
    source_citation: "Mage: The Awakening 2e / CoD 2e",
  },
  "Oracle": {
    effect: "The Sin-Eater is using death-sight or travel to consult the Underworld about a Mystery. Each question available and its supernatural limits depend on Oracle dots and purchased enhancements.",
    resolution: "Return to ordinary awareness or complete the consultation.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Rage": {
    effect: "The Bound channels ghostly rage into offensive power. Apply damage type, weapon rating, range and extra Tilts only as permitted by the Rage Haunt and purchased enhancements.",
    resolution: "The Haunt ends or its effects are expended.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Rampant": {
    effect: "The mage is driven to employ magic even for simple everyday problems. Depending on the triggering context, resisting this impulse requires an appropriate Willpower expenditure or Storyteller adjudication.",
    resolution: "Let magic create significant complications, or overcome the compulsion.",
    source_citation: "Mage: The Awakening 2e, Wisdom conditions",
  },
  "Regalia": {
    effect: "A krewe grants its member a special investiture of authority or protection. Record the particular regalia and dot-rated benefit; merely owning the Condition does not grant a standard bonus.",
    resolution: "The blessing ends or is taken back by the krewe.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Servant": {
    effect: "A stronger form of Marionette control makes the target obey ongoing instructions without the same turn-by-turn direction. Track the number of targets and any durations imposed by enhancements.",
    resolution: "Break the supernatural subservience or let its Haunt duration expire.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Shaken": {
    effect: "There is NO automatic −2 dice penalty. Before a roll where the fear could interfere, you may elect to fail the roll outright; doing so resolves Shaken and earns its normal resolution Beat.",
    resolution: "Voluntarily fail a relevant action because of the fear.",
    source_citation: "CoD 2e, Conditions",
  },
  "Shroud": {
    effect: "The Bound takes on ghostlike qualities and may interact with Twilight. Specific protections, movement modes and Numina depend on Shroud enhancement purchases; record what is active.",
    resolution: "Dismiss the Shroud, expend the permitted effect or end the Haunt.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Soul Shocked": {
    effect: "When inflicted, roll current Willpower points as a dice pool without 10-again; retain 1 Willpower point per success and lose the rest (do not roll a chance die at zero). While affected, do not regain Willpower through Virtue/Vice, though rest and other methods still work.",
    resolution: "Complete reintegration and appropriate recovery after the out-of-body experience.",
    source_citation: "Mage: The Awakening 2e, Conditions",
  },
  "Soulless": {
    effect: "Without the soul the character cannot recover Willpower normally, experiences escalating moral and psychological deterioration, and becomes vulnerable to possession. Track the duration of the loss.",
    resolution: "Recover the soul or halt the process before irreversible loss.",
    source_citation: "Mage: The Awakening 2e, soul-loss rules",
  },
  "Spooked": {
    effect: "Fear and fascination with a supernatural experience compel risky investigation. No fixed dice modifier applies; the effect is the consequential behavior it provokes.",
    resolution: "Act on the fascination in a way that hinders the group or causes a significant complication.",
    source_citation: "CoD 2e, Conditions",
  },
  "Steadfast": {
    effect: "After an ordinary failed roll, resolve Steadfast to treat it as one success. If the original roll is a chance die, resolving instead permits one REGULAR die to be rolled (8+ success, normal 10-again); it does not guarantee a success.",
    resolution: "Invoke Steadfast to improve an eligible failed action.",
    source_citation: "CoD 2e, Conditions",
  },
  "Strained": {
    effect: "Suffer −1 die on the next breaking-point roll arising from witnessing magic. If you have the Strained Merit and avoid the roll, the penalty stacks by −1 each time (maximum −5), after which you must face the roll.",
    resolution: "Resolve the initiating magical confrontation or its psychological consequences.",
    source_citation: "Mage: The Awakening 2e, Conditions",
  },
  "Swooned": {
    effect: "Subtract 2 dice on rolls that would harm or work against the object of affection. That person gains +2 dice to Social rolls against you; their Social Maneuvering impression improves one level (maximum Perfect).",
    resolution: "Put yourself at risk for the person, suffer danger because of them, or deliberately fail to resist their Social action.",
    source_citation: "CoD 2e, Conditions",
  },
  "Theophany": {
    effect: "A major krewe achievement grants an intense period of spiritual certainty. Apply only its specified temporary benefit; the Condition is not general-purpose success enhancement.",
    resolution: "Its revelation produces a meaningful consequence or the relevant story completes.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Thrall": {
    effect: "A completely soulless Thrall cannot spend Willpower, use Defense in combat, spend Experiences or cast spells, and suffers the effects of Broken. Only restoration of the soul ends this advanced state.",
    resolution: "Restore the soul through the relevant supernatural intervention.",
    source_citation: "Mage: The Awakening 2e, soul-loss rules",
  },
  "Tomb": {
    effect: "The Bound has recreated an object or person from deathly memory. Its traits and limitations depend on the specific object and purchased Tomb enhancements, not an automatic general bonus.",
    resolution: "The created replica is destroyed, dismissed or expires.",
    source_citation: "Geist: The Sin-Eaters 2e, Haunt Conditions",
  },
  "Triumphant": {
    effect: "When interacting socially with Awakened aware of the Duel Arcane victory, achieve exceptional success with 3 successes instead of 5. The benefit applies only to those Social rolls, not ordinary spellcasting.",
    resolution: "The victory ceases to matter socially, or another consequential duel supersedes it.",
    source_citation: "Mage: The Awakening 2e, Conditions",
  },
  "Unleashed": {
    effect: "The Geist manifests independently of its Sin-Eater. Treat its actions and Traits separately; apply the consequences for leaving the Bargain and any weakening of the Bond.",
    resolution: "The Geist returns to the Bound or the separation ends.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Wavering": {
    effect: "The Geist is offended and refuses complete cooperation. The specific demand or restriction should be attached to the Condition, rather than inventing a fixed modifier.",
    resolution: "Meet the Geist’s demand, make amends or restore trust.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
  "Weakened Bond": {
    effect: "Recent Unleashing or separation weakens the working Bargain. Track the loss of the relevant Geist/Sin-Eater benefits until the bond is restored.",
    resolution: "Reunite and complete the requisite reconciliation or recovery.",
    source_citation: "Geist: The Sin-Eaters 2e, Conditions",
  },
};

export const getConditionRuleOverride = (name) => CONDITION_RULE_OVERRIDES[name] || null;
