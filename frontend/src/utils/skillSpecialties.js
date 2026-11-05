import { SKILL_LIST } from "../data/character-data";

const skillKey = (value) => {
    const normalized = String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
    return SKILL_LIST.find((key) => key === normalized) || "";
};

// Supports {skill, name} as well as older strings such as Occult (Ghosts).
export const normalizeSkillSpecialty = (entry) => {
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
        return { skill: skillKey(entry.skill), name: String(entry.name || "").trim() };
    }
    const text = String(entry || "").trim();
    const match = text.match(/^(.+?)\s*\((.+)\)$/) ||
        text.match(/^(.+?)\s*:\s*(.+)$/) ||
        text.match(/^(.+?)\s*[—–]\s*(.+)$/);
    if (match) {
        const skill = skillKey(match[1]);
        if (skill) return { skill, name: match[2].trim() };
    }
    return { skill: "", name: text };
};

export const formatSkillSpecialty = (entry) => {
    const { skill, name } = normalizeSkillSpecialty(entry);
    if (!skill) return `Unassigned: ${name || "Unnamed Specialty"}`;
    const label = skill.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    return `${label} (${name})`;
};
