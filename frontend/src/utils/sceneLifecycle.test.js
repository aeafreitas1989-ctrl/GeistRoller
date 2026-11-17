import {
    isSceneDurationEffect, expireSceneEffects,
    applyPlasmTransaction, reconcileManualPlasm, getEndScenePatch,
} from "./sceneLifecycle";

describe("explicit scene boundaries", () => {
    test("only explicit scene durations expire; indefinite, timed and turn effects remain", () => {
        const effects = [
            { id: 1, duration: "Scene" },
            { id: 2, duration: "1 scene" },
            { id: 3, duration: "Until the end of the scene" },
            { id: 4, duration: "1 hour" },
            { id: 5, duration: "Indefinite (+1 Reach, 1 Mana)" },
            { id: 6, duration: "3 turns", tracking_mode: "turn", turns_remaining: 2 },
            { id: 7, duration: "Scene", status: "expired" },
            { id: 8, duration: "One Scene" },
        ];
        const closed = expireSceneEffects(effects);
        expect(closed.map(e => e.status || "active")).toEqual([
            "expired", "expired", "expired", "active", "active", "active", "expired", "expired",
        ]);
        expect(closed[5].turns_remaining).toBe(2);
        expect(expireSceneEffects(closed)).toBe(closed);
    });

    test("ordinary text mentioning scene does not expire", () => {
        expect(isSceneDurationEffect({ duration: "During the next scene or chapter" })).toBe(false);
        expect(isSceneDurationEffect({ duration: "1 day", description: "Scene-long confrontation" })).toBe(false);
        expect(isSceneDurationEffect({ scene_duration: true })).toBe(true);
    });

    test("temporary Key Plasm accumulates and is consumed before regular Plasm", () => {
        expect(applyPlasmTransaction(5, 0, -3)).toEqual({ plasm: 8, temporary_plasm: 3 });
        expect(applyPlasmTransaction(8, 3, 2)).toEqual({ plasm: 6, temporary_plasm: 1 });
        expect(applyPlasmTransaction(6, 1, 3)).toEqual({ plasm: 3, temporary_plasm: 0 });
        expect(applyPlasmTransaction(2, 0, 3)).toBeNull();
        expect(applyPlasmTransaction(3, 0, 0.5)).toBeNull();
    });

    test("manual resource decreases consume temporary Plasm", () => {
        expect(reconcileManualPlasm(8, 3, 6)).toEqual({ plasm: 6, temporary_plasm: 1 });
        expect(reconcileManualPlasm(6, 1, 2)).toEqual({ plasm: 2, temporary_plasm: 0 });
        expect(reconcileManualPlasm(8, 3, 12)).toEqual({ plasm: 12, temporary_plasm: 3 });
    });

    test("Mage End Scene resets Paradox, preserves game time, combat and long spells", () => {
        const character = {
            character_type: "mage", scene_paradox_rolls: 4, combat_active: true,
            scene_tracker: { date: "1607-05-01", time: "12:19" },
            active_spells: [{ id: 1, duration: "Scene" }, { id: 2, duration: "1 day" }],
        };
        const patch = getEndScenePatch(character);
        expect(patch.scene_paradox_rolls).toBe(0);
        expect(patch.active_spells.map(e => e.status || "active")).toEqual(["expired", "active"]);
        expect(patch).not.toHaveProperty("scene_tracker");
        expect(patch).not.toHaveProperty("combat_active");
    });

    test("Geist End Scene removes only remaining temporary Key Plasm", () => {
        const patch = getEndScenePatch({ character_type: "geist", plasm: 10, temporary_plasm: 4, active_spells: [] });
        expect(patch).toMatchObject({ plasm: 6, temporary_plasm: 0 });
        expect(patch).not.toHaveProperty("scene_paradox_rolls");
        const legacy = getEndScenePatch({ character_type: "geist", plasm: 7, active_spells: [] });
        expect(legacy.plasm).toBe(7);
    });
});
