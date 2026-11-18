// Legacy Yantras can be objects, actions, gestures, or other approved practices.
// Only inventory entries with Tool Type "Legacy Yantra" are offered as optional tools.
export const LEGACY_YANTRA_VARIANTS = [
    { name: "Legacy Yantra: +1", shortLabel: "Bonus", bonus: 1 },
    { name: "Legacy Yantra: +2", shortLabel: "Bonus", bonus: 2 },
];

export const getLegacyYantraRating = (name) =>
    LEGACY_YANTRA_VARIANTS.find((variant) => variant.name === name)?.bonus || null;

const norm = (value) => String(value || "").trim().toLowerCase();

export const isLegacyYantraTool = (item, rating) =>
    (rating === 1 || rating === 2) &&
    norm(item?.type) === "yantra" &&
    norm(item?.yantra?.kind) === "tool" &&
    norm(item?.yantra?.tool_type) === "legacy yantra" &&
    Number(item?.yantra?.bonus ?? 1) === rating;
