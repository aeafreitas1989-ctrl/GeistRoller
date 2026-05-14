export const MAGE_ATTRIBUTE_CATEGORIES = {
    mental: ["intelligence", "wits", "resolve"],
    physical: ["strength", "dexterity", "stamina"],
    social: ["presence", "manipulation", "composure"],
};

export const MAGE_SKILL_CATEGORIES = {
    mental: ["academics", "computer", "crafts", "investigation", "medicine", "occult", "politics", "science"],
    physical: ["athletics", "brawl", "drive", "firearms", "larceny", "stealth", "survival", "weaponry"],
    social: ["animal_ken", "empathy", "expression", "intimidation", "persuasion", "socialize", "streetwise", "subterfuge"],
};


export const MAGE_PATH_ARCANA = {
    Acanthus: { ruling: ["Time", "Fate"], inferior: "Forces" },
    Mastigos: { ruling: ["Space", "Mind"], inferior: "Matter" },
    Moros: { ruling: ["Matter", "Death"], inferior: "Spirit" },
    Obrimos: { ruling: ["Forces", "Prime"], inferior: "Death" },
    Thyrsus: { ruling: ["Life", "Spirit"], inferior: "Mind" },
};

export const MAGE_CREATION_RULES = {
    attributeBudgets: {
        primary: 5,
        secondary: 4,
        tertiary: 3,
    },
    skillBudgets: {
        primary: 11,
        secondary: 7,
        tertiary: 4,
    },
    attributeBase: 1,
    skillBase: 0,
    specialties: 3,
    arcanaDots: 6,
    maxStartingArcanum: 3,
    maxArcanaAtThree: 1,
    rotes: 3,
    merits: 10,
    wisdom: 7,
    gnosisMeritCosts: {
        1: 0,
        2: 5,
        3: 10,
    },
};

export const MAGE_XP_COSTS = {
    attribute: { experience: 4, arcane_experience: 0 },
    skill: { experience: 2, arcane_experience: 0 },
    skill_specialty: { experience: 1, arcane_experience: 0 },
    merit: { experience: 1, arcane_experience: 0 },
    rote: { experience: 1, arcane_experience: 0 },
    wisdom: { experience: 0, arcane_experience: 2 },
    willpower_dot: { experience: 1, arcane_experience: 0 },
    praxis: { experience: 0, arcane_experience: 1 },
    gnosis: { experience: 5, arcane_experience: 0, allowsArcane: true },
    arcanum_to_limit: { experience: 4, arcane_experience: 0, allowsArcane: true },
    arcanum_above_limit: { experience: 5, arcane_experience: 0 },
    legacy_attainment_tutored: { experience: 1, arcane_experience: 0, allowsArcane: true },
    legacy_attainment_no_tutor: { experience: 0, arcane_experience: 1 },
};

export const getBlankMageCreationChoices = () => ({
    attribute_priorities: {
        primary: "",
        secondary: "",
        tertiary: "",
    },
    skill_priorities: {
        primary: "",
        secondary: "",
        tertiary: "",
    },
    resistance_attribute_bonus: "",
});

export const getMageObsessionCount = (gnosis = 1) => {
    const safeGnosis = Math.max(1, Number(gnosis) || 1);
    if (safeGnosis >= 9) return 4;
    if (safeGnosis >= 6) return 3;
    if (safeGnosis >= 3) return 2;
    return 1;
};

export const normalizeMageObsessions = (character = {}) => {
    if (Array.isArray(character.obsessions)) return character.obsessions;
    if (character.obsession) return [character.obsession];
    return [];
};

export const isOrderMember = (order) => !!order && order !== "Nameless";

const sum = (values) => values.reduce((total, value) => total + (Number(value) || 0), 0);

const getMeritName = (merit) => (merit?.name || "").trim();
const getMeritDots = (merit) => Math.max(0, Number(merit?.dots) || 0);

export const getMageMeritCreationDots = (character = {}) => {
    const order = character.order || "";
    const orderStatusName = order ? `Status: ${order}` : "";
    const merits = Array.isArray(character.merits_list) ? character.merits_list : [];

    return merits.reduce((total, merit) => {
        const name = getMeritName(merit);
        const dots = getMeritDots(merit);

        if (isOrderMember(order) && name === "High Speech") return total;
        if (isOrderMember(order) && name === orderStatusName) return total + Math.max(0, dots - 1);
        if (merit?.source === "order_free") return total;

        return total + dots;
    }, 0);
};

export const getCategoryAllocationReport = ({ values = {}, categories, base = 0, freeAdjustments = {}, priorityChoices = {}, budgets = {} }) => {
    const usedCategories = new Set(Object.values(priorityChoices).filter(Boolean));

    return Object.entries(categories).reduce((report, [category, keys]) => {
        const rawSpent = sum(keys.map((key) => Math.max(0, (Number(values[key]) || 0) - base)));
        const adjustment = Number(freeAdjustments[category]) || 0;
        const spent = Math.max(0, rawSpent - adjustment);
        const priority = Object.entries(priorityChoices).find(([, chosenCategory]) => chosenCategory === category)?.[0] || "unassigned";
        const expected = budgets[priority] ?? null;

        report[category] = {
            category,
            priority,
            expected,
            spent,
            rawSpent,
            adjustment,
            selected: usedCategories.has(category),
        };
        return report;
    }, {});
};

export const validateMageCreation = (character = {}) => {
    const errors = [];
    const warnings = [];
    const choices = character.creation_choices || getBlankMageCreationChoices();
    const attributePriorities = choices.attribute_priorities || {};
    const skillPriorities = choices.skill_priorities || {};
    const attributes = character.attributes || {};
    const skills = character.skills || {};
    const arcana = character.arcana || {};
    const path = character.path || "";
    const order = character.order || "";
    const gnosis = Math.max(1, Number(character.gnosis) || 1);
    const wisdom = Number(character.wisdom) || 0;
    const rotes = Array.isArray(character.rotes) ? character.rotes : [];
    const praxes = Array.isArray(character.praxes) ? character.praxes : [];
    const specialties = Array.isArray(character.specialties) ? character.specialties : [];
    const obsessions = normalizeMageObsessions(character).filter((entry) => String(entry || "").trim());

    const chosenAttributeCategories = Object.values(attributePriorities).filter(Boolean);
    const chosenSkillCategories = Object.values(skillPriorities).filter(Boolean);

    if (chosenAttributeCategories.length !== 3 || new Set(chosenAttributeCategories).size !== 3) {
        errors.push("Choose three different Attribute priorities: primary, secondary, and tertiary.");
    }

    if (chosenSkillCategories.length !== 3 || new Set(chosenSkillCategories).size !== 3) {
        errors.push("Choose three different Skill priorities: primary, secondary, and tertiary.");
    }

    const resistanceAttribute = choices.resistance_attribute_bonus || "";
    if (!["resolve", "composure", "stamina"].includes(resistanceAttribute)) {
        errors.push("Choose the free Resistance Attribute dot: Resolve, Composure, or Stamina.");
    }

    const resistanceCategory = Object.entries(MAGE_ATTRIBUTE_CATEGORIES)
        .find(([, keys]) => keys.includes(resistanceAttribute))?.[0];

    const attributeFreeAdjustments = resistanceCategory ? { [resistanceCategory]: 1 } : {};
    const attributeReport = getCategoryAllocationReport({
        values: attributes,
        categories: MAGE_ATTRIBUTE_CATEGORIES,
        base: MAGE_CREATION_RULES.attributeBase,
        freeAdjustments: attributeFreeAdjustments,
        priorityChoices: attributePriorities,
        budgets: MAGE_CREATION_RULES.attributeBudgets,
    });

    Object.values(attributeReport).forEach((entry) => {
        if (entry.expected === null) return;
        if (entry.spent !== entry.expected) {
            errors.push(`${entry.category} Attributes: spent ${entry.spent}; expected ${entry.expected} for ${entry.priority}.`);
        }
    });

    const skillFreeAdjustments = {};
    if (isOrderMember(order) && (Number(skills.occult) || 0) > 0) {
        skillFreeAdjustments.mental = 1;
    }

    const skillReport = getCategoryAllocationReport({
        values: skills,
        categories: MAGE_SKILL_CATEGORIES,
        base: MAGE_CREATION_RULES.skillBase,
        freeAdjustments: skillFreeAdjustments,
        priorityChoices: skillPriorities,
        budgets: MAGE_CREATION_RULES.skillBudgets,
    });

    Object.values(skillReport).forEach((entry) => {
        if (entry.expected === null) return;
        if (entry.spent !== entry.expected) {
            errors.push(`${entry.category} Skills: spent ${entry.spent}; expected ${entry.expected} for ${entry.priority}.`);
        }
    });

    if (!path) {
        errors.push("Choose a Path.");
    }

    if (!order) {
        errors.push("Choose an Order or Nameless.");
    }

    const pathData = character.path_arcana_override || MAGE_PATH_ARCANA[path] || null;

    const ruling = pathData?.ruling || character.ruling_arcana || [];
    const inferior = pathData?.inferior || character.inferior_arcanum || "";

    const arcanumEntries = Object.values(arcana).map((value) => Math.max(0, Number(value) || 0));
    const arcanumTotal = sum(arcanumEntries);
    const arcanaAtThree = arcanumEntries.filter((value) => value >= 3).length;
    const arcanaAboveThree = arcanumEntries.filter((value) => value > 3).length;

    if (arcanumTotal !== MAGE_CREATION_RULES.arcanaDots) {
        errors.push(`Starting Arcana: spent ${arcanumTotal}; expected ${MAGE_CREATION_RULES.arcanaDots}.`);
    }

    if (arcanaAboveThree > 0) {
        errors.push("Starting Arcana cannot exceed 3 dots in any Arcanum.");
    }

    if (arcanaAtThree > MAGE_CREATION_RULES.maxArcanaAtThree) {
        errors.push("Only one starting Arcanum can be rated 3 dots.");
    }

    if (Array.isArray(ruling) && ruling.length === 2) {
        const rulingTotal = sum(ruling.map((arcanum) => arcana[arcanum] || 0));
        ruling.forEach((arcanum) => {
            if ((arcana[arcanum] || 0) < 1) {
                errors.push(`${arcanum} is a Ruling Arcanum and must start at 1+ dots.`);
            }
        });
        if (rulingTotal < 3 || rulingTotal > 5) {
            errors.push(`Starting Ruling Arcana must contain 3 to 5 dots total; current total is ${rulingTotal}.`);
        }
    }

    if (inferior && (arcana[inferior] || 0) > 0) {
        errors.push(`${inferior} is the Inferior Arcanum and cannot receive starting dots.`);
    }

    if (specialties.length !== MAGE_CREATION_RULES.specialties) {
        errors.push(`Starting Skill Specialties: ${specialties.length}; expected ${MAGE_CREATION_RULES.specialties}.`);
    }

    if (gnosis < 1 || gnosis > 3) {
        errors.push("Starting Gnosis must be 1, 2, or 3.");
    }

    if (wisdom !== MAGE_CREATION_RULES.wisdom) {
        errors.push(`Starting Wisdom must be ${MAGE_CREATION_RULES.wisdom}.`);
    }

    if (rotes.length !== MAGE_CREATION_RULES.rotes) {
        errors.push(`Starting Rotes: ${rotes.length}; expected ${MAGE_CREATION_RULES.rotes}.`);
    }

    if (praxes.length !== gnosis) {
        errors.push(`Starting Praxes: ${praxes.length}; expected ${gnosis}, one per Gnosis dot.`);
    }

    const expectedObsessions = getMageObsessionCount(gnosis);
    if (obsessions.length !== expectedObsessions) {
        errors.push(`Starting Obsessions: ${obsessions.length}; expected ${expectedObsessions} at Gnosis ${gnosis}.`);
    }

    const gnosisMeritCost = MAGE_CREATION_RULES.gnosisMeritCosts[gnosis] ?? 0;
    const availableMerits = MAGE_CREATION_RULES.merits - gnosisMeritCost;
    const spentMerits = getMageMeritCreationDots(character);

    if (spentMerits > availableMerits) {
        errors.push(`Creation Merit dots overspent: spent ${spentMerits}; available ${availableMerits} after Gnosis ${gnosis}.`);
    } else if (spentMerits < availableMerits) {
        warnings.push(`Creation Merit dots unspent: spent ${spentMerits}; available ${availableMerits}.`);
    }

    if (isOrderMember(order)) {
        if ((Number(skills.occult) || 0) < 1) {
            errors.push("Order members receive Occult 1 for free; Occult must be at least 1.");
        }
        const merits = Array.isArray(character.merits_list) ? character.merits_list : [];
        const hasHighSpeech = merits.some((merit) => getMeritName(merit) === "High Speech");
        const hasOrderStatus = merits.some((merit) => getMeritName(merit) === `Status: ${order}` && getMeritDots(merit) >= 1);
        if (!hasHighSpeech) warnings.push("Order member is missing the free High Speech Merit.");
        if (!hasOrderStatus) warnings.push(`Order member is missing free Status: ${order} •.`);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        reports: {
            attributes: attributeReport,
            skills: skillReport,
            merits: {
                spent: spentMerits,
                available: availableMerits,
                gnosisMeritCost,
            },
            arcana: {
                spent: arcanumTotal,
                expected: MAGE_CREATION_RULES.arcanaDots,
            },
            obsessions: {
                current: obsessions.length,
                expected: expectedObsessions,
            },
        },
    };
};

export const getArcanumUntrainedLimit = (character = {}, arcanum) => {
    const pathData = character.path_arcana_override || MAGE_PATH_ARCANA[character.path] || null;
    const ruling = pathData?.ruling || character.ruling_arcana || [];
    const inferior = pathData?.inferior || character.inferior_arcanum || "";

    if (Array.isArray(ruling) && ruling.includes(arcanum)) return 5;
    if (inferior === arcanum) return 2;
    return 4;
};

export const calculateMagePurchaseCost = (character = {}, purchase = {}) => {
    const from = Math.max(0, Number(purchase.from) || 0);
    const to = Math.max(0, Number(purchase.to) || 0);
    const steps = Math.max(1, to - from);

    if (purchase.trait_type === "attribute") {
        return { experience: MAGE_XP_COSTS.attribute.experience * steps, arcane_experience: 0 };
    }

    if (purchase.trait_type === "skill") {
        return { experience: MAGE_XP_COSTS.skill.experience * steps, arcane_experience: 0 };
    }

    if (purchase.trait_type === "skill_specialty") {
        return { experience: MAGE_XP_COSTS.skill_specialty.experience, arcane_experience: 0 };
    }

    if (purchase.trait_type === "merit") {
        return { experience: MAGE_XP_COSTS.merit.experience * steps, arcane_experience: 0 };
    }

    if (purchase.trait_type === "rote") {
        return { experience: MAGE_XP_COSTS.rote.experience, arcane_experience: 0 };
    }

    if (purchase.trait_type === "praxis") {
        return { experience: 0, arcane_experience: MAGE_XP_COSTS.praxis.arcane_experience };
    }

    if (purchase.trait_type === "wisdom") {
        return { experience: 0, arcane_experience: MAGE_XP_COSTS.wisdom.arcane_experience * steps };
    }

    if (purchase.trait_type === "gnosis") {
        return { experience: MAGE_XP_COSTS.gnosis.experience * steps, arcane_experience: 0, allowsArcane: true };
    }

    if (purchase.trait_type === "arcanum") {
        const limit = getArcanumUntrainedLimit(character, purchase.trait_key);
        let regularOrArcane = 0;
        let regularOnly = 0;

        for (let dot = from + 1; dot <= to; dot += 1) {
            if (dot <= limit) {
                regularOrArcane += MAGE_XP_COSTS.arcanum_to_limit.experience;
            } else {
                regularOnly += MAGE_XP_COSTS.arcanum_above_limit.experience;
            }
        }

        return {
            experience: regularOrArcane + regularOnly,
            arcane_experience: 0,
            allowsArcane: regularOrArcane > 0,
            regularOnly,
            flexible: regularOrArcane,
        };
    }

    return { experience: 0, arcane_experience: 0 };
};

export const canAffordMagePurchase = (character = {}, cost = {}, arcaneApplied = 0) => {
    const availableExperience = Number(character.experience) || 0;
    const availableArcane = Number(character.arcane_experience) || 0;
    const safeArcaneApplied = Math.max(0, Number(arcaneApplied) || 0);
    const regularCost = Math.max(0, (Number(cost.experience) || 0) - safeArcaneApplied);
    const arcaneCost = (Number(cost.arcane_experience) || 0) + safeArcaneApplied;

    return availableExperience >= regularCost && availableArcane >= arcaneCost;
};

export const makeLedgerEntry = (purchase = {}, cost = {}, arcaneApplied = 0) => ({
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: new Date().toISOString(),
    type: "xp_purchase",
    trait_type: purchase.trait_type,
    trait_key: purchase.trait_key || "",
    label: purchase.label || purchase.trait_key || purchase.trait_type,
    from: purchase.from ?? null,
    to: purchase.to ?? null,
    cost: {
        experience: Math.max(0, (Number(cost.experience) || 0) - (Number(arcaneApplied) || 0)),
        arcane_experience: (Number(cost.arcane_experience) || 0) + (Number(arcaneApplied) || 0),
    },
    note: purchase.note || "",
});