// Scene boundaries are explicit player decisions, not inferred from clock/location changes.
// These helpers are pure so both character types share the same scene transition.

export const isSceneDurationEffect = (effect) => {
    if (!effect || typeof effect !== "object") return false;
    if (effect.scene_duration === true) return true;
    const duration = String(effect.duration || "").trim().toLowerCase();
    return /^(?:(?:1|one|a)\s+)?scene$/.test(duration) ||
        /^(?:until|through|for)\s+(?:(?:the|this)\s+)?(?:end\s+of\s+)?(?:the\s+)?scene$/.test(duration) ||
        /^until\s+(?:the\s+)?scene\s+ends$/.test(duration);
};

export const expireSceneEffects = (effects) => {
    if (!Array.isArray(effects)) return [];
    let changed = false;
    const updated = effects.map((effect) => {
        if (!effect || effect.status === "expired" || !isSceneDurationEffect(effect)) return effect;
        changed = true;
        return { ...effect, status: "expired" };
    });
    return changed ? updated : effects;
};

const nonNegativeInt = (value) => Math.max(0, Math.floor(Number(value) || 0));

// A signed Plasm transaction: positive amounts spend Plasm; negative amounts
// award temporary Key surplus. Temporary Plasm is spent before ordinary Plasm.
export const applyPlasmTransaction = (plasm, temporaryPlasm, amount) => {
    const delta = Number(amount);
    if (!Number.isInteger(delta)) return null;
    const current = nonNegativeInt(plasm);
    const temporary = Math.min(current, nonNegativeInt(temporaryPlasm));
    if (delta > current) return null;
    if (delta < 0) {
        return { plasm: current - delta, temporary_plasm: temporary - delta };
    }
    return {
        plasm: current - delta,
        temporary_plasm: Math.max(0, temporary - delta),
    };
};

// Manual adjustments and other resource costs should consume temporary Plasm first.
export const reconcileManualPlasm = (currentPlasm, temporaryPlasm, nextPlasm) => {
    const previous = nonNegativeInt(currentPlasm);
    const next = nonNegativeInt(nextPlasm);
    const temporary = Math.min(previous, nonNegativeInt(temporaryPlasm));
    return { plasm: next, temporary_plasm: Math.min(next, Math.max(0, temporary - Math.max(0, previous - next))) };
};

export const getEndScenePatch = (character) => {
    if (!character || typeof character !== "object") return null;
    const patch = {
        active_spells: expireSceneEffects(character.active_spells || []),
        conditions: expireSceneEffects(character.conditions || []),
    };
    if (character.character_type === "mage") {
        patch.scene_paradox_rolls = 0;
        patch.skip_previous_paradox_modifier_next_roll = false;
    }
    if (character.character_type !== "mage") {
        const current = nonNegativeInt(character.plasm);
        const surplus = Math.min(current, nonNegativeInt(character.temporary_plasm));
        patch.plasm = current - surplus;
        patch.temporary_plasm = 0;
        patch.remembrance_activation = null;
    }
    return patch;
};
