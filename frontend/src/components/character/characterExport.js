import { formatLabel } from './StatComponents';
import { formatSkillSpecialty } from '../../utils/skillSpecialties';

export const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const buildCharacterExportText = (character) => {
    if (!character) return "";

    const lines = [];
    const addLine = (label, value = "") => {
        if (value === undefined || value === null || value === "") {
            lines.push(`${label}: -`);
            return;
        }
        lines.push(`${label}: ${value}`);
    };
    const addSection = (title) => {
        if (lines.length > 0) lines.push("");
        lines.push(title);
        lines.push("-".repeat(title.length));
    };

    const typeLabel = character.character_type === "mage" ? "Mage" : "Sin-Eater";

    lines.push(`${character.name || "Unnamed Character"}`);
    lines.push(`${typeLabel} Character Sheet`);

    addSection("Core");
    addLine("Concept", character.concept);
    addLine("Virtue", character.virtue);
    addLine("Vice", character.vice);
    addLine("Archetype", character.archetype);
    addLine("Krewe", character.krewe);
    addLine("Notes", character.notes);

    if (character.character_type === "mage") {
        addSection("Mage");
        addLine("Path", character.path);
        addLine("Order", character.order);
        addLine("Legacy", character.legacy);
        addLine("Legacy Ruling Arcanum", character.legacy_ruling_arcanum);
        addLine("Gnosis", character.gnosis);
        addLine("Wisdom", character.wisdom);
        addLine("Mana", character.mana);
        const exportObsessions = Array.isArray(character.obsessions) && character.obsessions.length > 0
            ? character.obsessions.filter(Boolean).join("; ")
            : character.obsession;
        addLine("Obsessions", exportObsessions);
        addLine("Arcane Beats", character.arcane_beats);
        addLine("Arcane Experience", character.arcane_experience);
    } else {
        addSection("Geist");
        addLine("Geist Name", character.geist_name);
        addLine("Burden", character.burden);
        addLine("Synergy", `${character.synergy ?? 0} / ${character.synergy_max ?? 10}`);
        addLine("Plasm", character.plasm);
        addLine("Geist Rank", character.geist_rank);
    }

    addSection("Attributes");
    Object.entries(character.attributes || {}).forEach(([key, value]) => {
        addLine(formatLabel(key), value);
    });

    addSection("Skills");
    Object.entries(character.skills || {}).forEach(([key, value]) => {
        addLine(formatLabel(key), value);
    });

    addSection("Skill Specialties");
    const exportSpecialties = character.specialties || [];
    if (exportSpecialties.length === 0) {
        lines.push("-");
    } else {
        exportSpecialties.forEach((entry) => lines.push(`- ${formatSkillSpecialty(entry)}`));
    }

    addSection("Merits");
    const merits = character.merits_list || [];
    if (merits.length === 0) {
        lines.push("-");
    } else {
        merits.forEach((merit) => {
            const dots = merit?.dots ? ` (${merit.dots})` : "";
            const specialty = merit?.specialty ? ` - ${merit.specialty}` : "";
            lines.push(`- ${merit?.name || "Unnamed Merit"}${dots}${specialty}`);
        });
    }

    addSection("Inventory");
    addLine("Funds", character.funds);
    const inventory = character.inventory_items || [];
    if (inventory.length === 0) {
        lines.push("-");
    } else {
        inventory.forEach((item) => {
            lines.push(`- ${item?.name || "Unnamed Item"} [${item?.type || "item"}]`);
        });
    }

    addSection("Conditions");
    const conditions = character.conditions || [];
    if (conditions.length === 0) {
        lines.push("-");
    } else {
        conditions.forEach((condition) => {
            lines.push(`- ${condition?.name || "Unnamed Condition"}`);
        });
    }

    return lines.join("\n");
};
