import { GNOSIS_TABLE, SYNERGY_TABLE } from "../data/character-data.js";

export const buildLiveCharacterState = (character, derived) => {
    if (!character) {
        return { status: "no_active_character" };
    }

    const isMage = character.character_type === "mage";

    const resourceRules = isMage
        ? GNOSIS_TABLE[character.gnosis || 1] || GNOSIS_TABLE[1]
        : SYNERGY_TABLE[character.synergy || 7] || SYNERGY_TABLE[7];

    const boxes = derived.healthBoxes;
    const damage = { bashing: 0, lethal: 0, aggravated: 0 };

    boxes.forEach((box) => {
        if (Object.hasOwn(damage, box)) {
            damage[box] += 1;
        }
    });

    const entries = character.conditions || [];

    const isTilt = (entry) =>
        entry.type === "tilt" ||
        ["tilt-personal", "tilt-environmental"].includes(entry.group);

    const snapshot = {
        status: "ok",
        observed_at: new Date().toISOString(),
        source: "displayed_character_sheet",
        has_unsaved_changes: derived.hasUnsavedChanges,

        character: {
            id: character.id,
            name: character.name,
            character_type: character.character_type,
        },

        health: {
            boxes,
            damage,
            marked_boxes:
                damage.bashing + damage.lethal + damage.aggravated,
            unmarked_boxes:
                boxes.filter((box) => box === "empty").length,
            capacity: derived.maxHealth,
            wound_penalty: derived.woundPenalty,
            dead_track: derived.isDeadTrack,
        },

        resource: {
            type: isMage ? "mana" : "plasm",
            current: character[isMage ? "mana" : "plasm"] ?? 0,
            maximum: isMage
                ? resourceRules.maxMana
                : resourceRules.maxPlasm,
            per_turn_limit: resourceRules.perTurn,
        },

        willpower: {
            current: character.willpower ?? 0,
            maximum: derived.maxWillpower,
            max_modifier: character.willpower_max_modifier ?? 0,
        },

        active_spells: character.active_spells || [],

        active_spell_count: (character.active_spells || [])
            .filter((entry) => entry.kind === "spell").length,

        active_mage_armor: character.active_mage_armor ?? null,

        conditions: entries.filter((entry) => !isTilt(entry)),
        tilts: entries.filter(isTilt),

        scene_tracker: character.scene_tracker || {},

        previous_paradox_rolls_this_scene: isMage
            ? derived.previousParadoxRolls
            : null,
    };

    // Return a detached copy so reading cannot mutate the sheet.
    return JSON.parse(JSON.stringify(snapshot));
};

export const LIVE_CHARACTER_TOOL_NAME = "get_live_character_state";

export const registerLiveCharacterTool = (context, readState) => {
    if (typeof context?.registerTool !== "function") {
        return () => {};
    }

    context.registerTool({
        name: LIVE_CHARACTER_TOOL_NAME,

        description:
            "Read the currently selected character's live displayed Health, " +
            "current Mana or Plasm, Willpower, active spells and effects, " +
            "Conditions, and Tilts, including unsaved sheet edits. " +
            "Consult before resolving spellcasting, Paradox mitigation, " +
            "resource spending or recovery, damage, healing, or scene/chapter " +
            "transitions whenever these values matter. Current resources " +
            "are distinct from their maximums. This reads only; it does not " +
            "spend resources, save edits, or advance the game.",

        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
        },

        annotations: {
            readOnlyHint: true,
        },

        execute: async () => readState(),
    });

    return () => {
        context.unregisterTool?.(LIVE_CHARACTER_TOOL_NAME);
    };
};
