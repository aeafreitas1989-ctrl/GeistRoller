import { LEGACY_YANTRA_VARIANTS, getLegacyYantraRating, isLegacyYantraTool } from "./legacyYantra";

describe("Legacy Yantras", () => {
    it("allows exactly one +1 or +2 rating at a time", () => {
        expect(LEGACY_YANTRA_VARIANTS.map((variant) => variant.bonus)).toEqual([1, 2]);
        expect(LEGACY_YANTRA_VARIANTS.map((variant) => variant.name)).toEqual(["Legacy Yantra: +1", "Legacy Yantra: +2"]);
        expect(getLegacyYantraRating("Legacy Yantra: +1")).toBe(1);
        expect(getLegacyYantraRating("Legacy Yantra: +2")).toBe(2);
        expect(getLegacyYantraRating("Legacy Yantra: +3")).toBeNull();
    });
    it("matches an inventory Legacy Yantra by tool type and exact bonus", () => {
        const item = { type: "yantra", name: "Ashwood key", yantra: { kind: "tool", tool_type: "Legacy Yantra", bonus: 2 } };
        expect(isLegacyYantraTool(item, 2)).toBe(true);
        expect(isLegacyYantraTool(item, 1)).toBe(false);
        expect(isLegacyYantraTool({ ...item, yantra: { ...item.yantra, kind: "sacrament" } }, 2)).toBe(false);
        expect(isLegacyYantraTool({ ...item, yantra: { ...item.yantra, tool_type: "Order" } }, 2)).toBe(false);
        expect(isLegacyYantraTool({ ...item, type: "equipment" }, 2)).toBe(false);
    });
    it("does not require an inventory tool for an action-based Legacy Yantra", () => {
        expect(getLegacyYantraRating("Legacy Yantra: +1")).toBe(1);
        expect(getLegacyYantraRating("Legacy Yantra: +2")).toBe(2);
    });
});
