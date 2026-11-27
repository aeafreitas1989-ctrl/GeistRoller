// Resistant wounds are tracked alongside health_boxes. Their positions move
// with the wounds when the health track is re-ordered by damage severity.
const TYPES = ["aggravated", "lethal", "bashing"];
const SEVERITY = { aggravated: 0, lethal: 1, bashing: 2 };

export const normalizeResistance = (boxes = [], marks = []) =>
    (Array.isArray(boxes) ? boxes : []).map((type, index) =>
        TYPES.includes(type) && Array.isArray(marks) && marks[index] === true
    );

const entriesFrom = (boxes, marks) => {
    const flags = normalizeResistance(boxes, marks);
    return boxes.map((type, index) => ({ type, resistant: flags[index] }))
        .filter((entry) => TYPES.includes(entry.type));
};

const pack = (wounds, max) => {
    const sorted = [...wounds].sort((a, b) => SEVERITY[a.type] - SEVERITY[b.type]);
    const padded = sorted.slice(0, max);
    while (padded.length < max) padded.push({ type: "empty", resistant: false });
    return {
        boxes: padded.map((entry) => entry.type),
        resistant_wounds: padded.map((entry) => entry.type !== "empty" && entry.resistant === true),
    };
};

export const hasHealableWound = (boxes, marks, kind) =>
    entriesFrom(boxes, marks).some((entry) =>
        entry.type === kind && entry.resistant !== true
    );

// Supernatural healing ignores Resistant wounds. Manual ST corrections can
// explicitly set allowResistant to true, without erasing unrelated markers.
export const healWound = (boxes, marks, kind, allowResistant = false) => {
    const wounds = entriesFrom(boxes, marks);
    let index = -1;
    for (let i = wounds.length - 1; i >= 0; i -= 1) {
        if (wounds[i].type === kind && (allowResistant || !wounds[i].resistant)) {
            index = i;
            break;
        }
    }
    if (index < 0) return null;
    wounds.splice(index, 1);
    return pack(wounds, boxes.length);
};

// Full tracks upgrade an existing wound. The upgraded wound remains Resistant
// if EITHER the pre-existing wound or the incoming damage is Resistant.
export const addWoundDamage = (boxes, marks, kind, amount = 1, resistant = false) => {
    const wounds = entriesFrom(boxes, marks);
    const max = boxes.length;
    let applied = 0;
    const promote = (from, to) => {
        const index = wounds.map((w) => w.type).lastIndexOf(from);
        if (index < 0) return false;
        wounds[index] = { type: to, resistant: wounds[index].resistant || resistant };
        return true;
    };
    for (let i = 0; i < Math.max(0, Math.floor(Number(amount) || 0)); i += 1) {
        if (!TYPES.includes(kind)) break;
        if (wounds.length < max) {
            wounds.push({ type: kind, resistant: !!resistant });
            applied += 1;
        } else if (promote("bashing", kind === "aggravated" ? "aggravated" : "lethal") ||
                   promote("lethal", "aggravated")) {
            applied += 1;
        }
    }
    return { ...pack(wounds, max), applied };
};

// Apply the damage that survives the existing armour calculation. Resistance
// belongs to the resulting wounds, including downgraded or promoted wounds.
export const applyResolvedDamage = (boxes, marks, damage, resistant = false) => {
    let result = { boxes, resistant_wounds: normalizeResistance(boxes, marks) };
    let applied = 0;
    const appliedByType = { aggravated: 0, lethal: 0, bashing: 0 };
    for (const kind of TYPES) {
        if (Number(damage?.[kind]) > 0) {
            result = addWoundDamage(result.boxes, result.resistant_wounds, kind, damage[kind], resistant === true);
            applied += result.applied;
            appliedByType[kind] = result.applied;
        }
    }
    return { ...result, applied, appliedByType };
};

// Mirrors the existing clickable health-track cycle, while retaining the
// Resistant flag on each wound when upgraded, shifted, or reordered.
export const adjustWoundClick = (boxes, marks, index, state) => {
    const wounds = entriesFrom(boxes, marks);
    const max = boxes.length;
    const promote = (from, to) => {
        const i = wounds.map((w) => w.type).lastIndexOf(from);
        if (i < 0) return false;
        wounds[i] = { ...wounds[i], type: to };
        return true;
    };
    if (state === "empty") {
        if (wounds.length < max) wounds.push({ type: "bashing", resistant: false });
    } else if (state === "bashing") {
        if (wounds.length >= max) {
            if (!promote("bashing", "lethal")) promote("lethal", "aggravated");
        } else {
            promote("bashing", "lethal");
            if (wounds.length < max) wounds.push({ type: "bashing", resistant: false });
        }
    } else if (state === "lethal") {
        if (promote("lethal", "aggravated")) {
            promote("bashing", "lethal");
            if (wounds.length < max) wounds.push({ type: "bashing", resistant: false });
        }
    } else if (state === "aggravated") {
        const firstDamaged = boxes.findIndex((box) => TYPES.includes(box));
        if (index === firstDamaged) wounds.length = 0;
        else {
            const i = wounds.map((w) => w.type).lastIndexOf("aggravated");
            if (i >= 0) wounds.splice(i, 1);
        }
    }
    return pack(wounds, max);
};

// Conservative fallback for old call sites passing only new health_boxes.
// Preserves flags on surviving same-type wounds; if a wound was upgraded,
// transfers leftover Resistant markers to newly created severe wounds.
export const reconcileResistance = (previousBoxes, previousMarks, nextBoxes) => {
    const originals = entriesFrom(previousBoxes, previousMarks);
    const result = Array(nextBoxes.length).fill(false);
    const unmatched = [];
    for (let i = 0; i < nextBoxes.length; i += 1) {
        const kind = nextBoxes[i];
        if (!TYPES.includes(kind)) continue;
        const at = originals.findIndex((w) => w.type === kind);
        if (at >= 0) result[i] = originals.splice(at, 1)[0].resistant;
        else unmatched.push(i);
    }
    for (const i of unmatched) {
        // Transfer flags only from wounds that became more severe.
        const at = originals.findIndex((w) => w.resistant && SEVERITY[w.type] > SEVERITY[nextBoxes[i]]);
        if (at >= 0) {
            result[i] = true;
            originals.splice(at, 1);
        }
    }
    return result;
};

export const toggleResistance = (boxes, marks, index) => {
    const result = normalizeResistance(boxes, marks);
    if (index >= 0 && index < result.length && TYPES.includes(boxes[index])) result[index] = !result[index];
    return result;
};
