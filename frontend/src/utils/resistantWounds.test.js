import { advanceNaturalHealing, restartNaturalHealing } from "./naturalHealing";
import { addWoundDamage, adjustWoundClick, hasHealableWound, healWound, normalizeResistance, reconcileResistance, toggleResistance } from "./resistantWounds";

describe("Resistant wound handling", () => {
    test("Paradox containment applies Resistant bashing and preserves marks when lethal shifts wounds right", () => {
        const b = ["empty", "empty", "empty", "empty"];
        const p = addWoundDamage(b, [], "bashing", 2, true);
        expect(p.boxes).toEqual(["bashing", "bashing", "empty", "empty"]);
        expect(p.resistant_wounds).toEqual([true, true, false, false]);
        const q = addWoundDamage(p.boxes, p.resistant_wounds, "lethal", 1, false);
        expect(q.boxes).toEqual(["lethal", "bashing", "bashing", "empty"]);
        expect(q.resistant_wounds).toEqual([false, true, true, false]);
    });
    test("Pattern Scouring inflicts Resistant lethal", () => {
        const q = addWoundDamage(["empty", "empty", "empty"], [], "lethal", 1, true);
        expect(q.boxes).toEqual(["lethal", "empty", "empty"]);
        expect(q.resistant_wounds).toEqual([true, false, false]);
    });
    test("magical healing cannot remove Resistant damage but can remove ordinary adjacent damage", () => {
        const boxes = ["lethal", "lethal", "bashing", "empty"];
        const marks = [true, false, true, false];
        expect(hasHealableWound(boxes, marks, "bashing")).toBe(false);
        expect(healWound(boxes, marks, "bashing")).toBeNull();
        const result = healWound(boxes, marks, "lethal");
        expect(result.boxes).toEqual(["lethal", "bashing", "empty", "empty"]);
        expect(result.resistant_wounds).toEqual([true, true, false, false]);
    });
    test("manual Storyteller corrections may remove Resistant wounds", () => {
        const result = healWound(["bashing", "empty"], [true, false], "bashing", true);
        expect(result.boxes).toEqual(["empty", "empty"]);
        expect(result.resistant_wounds).toEqual([false, false]);
    });
    test("worsening a wound on a full track retains original and incoming resistance", () => {
        let p = addWoundDamage(["lethal", "bashing"], [false, true], "bashing", 1, false);
        expect(p.boxes).toEqual(["lethal", "lethal"]);
        expect(p.resistant_wounds).toEqual([false, true]);
        p = addWoundDamage(["lethal", "bashing"], [false, false], "bashing", 1, true);
        expect(p.resistant_wounds.some(Boolean)).toBe(true);
    });
    test("manual health-track click promotions and dot toggles preserve resistant flags", () => {
        const a = adjustWoundClick(["bashing", "empty", "empty"], [true, false, false], 0, "bashing");
        expect(a.boxes).toEqual(["lethal", "bashing", "empty"]);
        expect(a.resistant_wounds).toEqual([true, false, false]);
        expect(toggleResistance(a.boxes, a.resistant_wounds, 1)).toEqual([true, true, false]);
    });
    test("Resistant Bashing heals naturally after 15 game minutes and clears its dot", () => {
        const a = ["bashing", "empty", "empty"];
        const start = { date: "2025-12-05", time: "10:00" };
        const end = { date: "2025-12-05", time: "10:15" };
        const result = advanceNaturalHealing(a, restartNaturalHealing(a, start), start, end, [true, false, false]);
        expect(result.boxes).toEqual(["empty", "empty", "empty"]);
        expect(result.resistant_wounds).toEqual([false, false, false]);
    });
    test("Resistant Lethal still heals naturally after two game days", () => {
        const a = ["lethal", "empty", "empty"];
        const start = { date: "2025-12-05", time: "10:00" };
        const end = { date: "2025-12-07", time: "10:00" };
        const result = advanceNaturalHealing(a, restartNaturalHealing(a, start), start, end, [true, false, false]);
        expect(result.boxes).toEqual(["empty", "empty", "empty"]);
        expect(result.resistant_wounds).toEqual([false, false, false]);
    });
    test("legacy save with no flags is normal and fallback preserves relevant flags", () => {
        expect(normalizeResistance(["lethal", "bashing", "empty"], [])).toEqual([false, false, false]);
        expect(reconcileResistance(["lethal", "bashing", "empty"], [true, true, false], ["lethal", "lethal", "empty"]))
            .toEqual([true, true, false]);
    });
});
