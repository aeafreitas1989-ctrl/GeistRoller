import { useState, useMemo, useEffect, useRef } from "react";
import { Plus, Minus, Trash2, ChevronUp, ChevronDown, ChevronRight, ChevronLeft, Save, X, Info, Dices, Zap, Star, Pencil, Sparkles, Download, Upload } from "lucide-react";import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { toast } from "sonner";
import { DiceRollPopup } from "./DiceRollPopup";

// Extracted data
import {
    HAUNT_ENHANCEMENTS, KEYS, BURDENS,
    SYNERGY_TABLE, MERIT_LIST, CEREMONY_LIST,
    ATTRIBUTE_LIST, SKILL_LIST, CEREMONY_DEFINITIONS,
    CEREMONY_SKILL_KEY_MAP,
    MAGE_PATHS, MAGE_ORDERS,
    PATH_ARCANA, ORDER_ROTE_SKILLS,
} from "../data/character-data";
import { SpellcastingPopup } from "./SpellcastingPopup";

// Extracted sub-components
import {
    formatLabel, HEALTH_STATES, HEALTH_SYMBOLS,
    normalizeHealthBoxes, getHealthCounts, buildHealthBoxes,
    StatDots, StatRow, HealthTrack, ResourceTrack, SynergyTrack,
} from "./character/StatComponents";
import { InlineDiceRoller } from "./character/InlineDiceRoller";
import { MageArcanaContent } from "./character/MageArcanaContent";
import { MageGnosisContent } from "./character/MageGnosisContent";
import { GeistSynergyContent } from "./character/GeistSynergyContent";
import { GeistHauntsContent } from "./character/GeistHauntsContent";
import { GeistRemembranceContent } from "./character/GeistRemembranceContent";
import { MeritsContent } from "./character/MeritsContent";
import { CombatContent } from "./character/CombatContent";
import { CharacterCreationAuditPanel } from "./character/CharacterCreationAuditPanel";
import {
    PROFESSIONAL_TRAINING_RULES,
    calculateMagePurchaseCost,
    canAffordMagePurchase,
    getBlankMageCreationChoices,
    getChargeableMeritDots,
    getProfessionalTrainingFreeSpecialtyCount,
    makeLedgerEntry,
    validateMageCreation,
} from "@/utils/mageCreationAudit";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MAGE_SIGHT_DESCRIPTIONS = {
    Death: "Death Sight reveals the Anchor Condition, manifested ghosts, and related deathly phenomena. At a glance, the mage can tell whether a person has a soul and whether a body is truly dead.",
    Fate: "Fate Sight reveals when someone experiences a dramatic failure or exceptional success. It also reveals the presence and use of a Destiny, but not the details of that Destiny.",
    Forces: "Forces Sight reveals motion, environmental Tilts, fire, electricity, and other physical hazards. It also allows the mage to tell at a glance whether a device is powered.",
    Life: "Life Sight reveals signs of life and allows the mage to tell at a glance whether a body is alive and how badly a living being is injured. Toxins, diseases, and Personal Tilts are also apparent.",
    Matter: "Matter Sight reveals the Structure and Durability of an object, along with its value and quality.",
    Mind: "Mind Sight reveals the presence of thinking beings and allows the mage to tell at a glance whether someone is asleep, comatose, awake, meditating, or projecting into the Astral. It also reveals when an observed being gains or spends Willpower.",
    Prime: "Prime Sight reveals anything the mage can use as a Yantra, as well as the presence of Awakened spells and Attainment effects. It also allows the mage to recognize tass and determine when they are within a Hallow or Node.",
    Space: "Space Sight reveals distances, range bands, and cover, allowing the mage to judge situational bonuses and penalties before acting. It also reveals spatial distortions, scrying windows, and Irises.",
    Spirit: "Spirit Sight reveals the strength of the local Gauntlet, the presence and nature of the Resonance Condition, other sources of Essence, and manifested spirits and related phenomena.",
    Time: "Time Sight reveals subtle temporal changes, allowing the mage to know the Initiative of all combatants. It also reveals when someone is about to act, even reflexively, and detects temporal distortions and signs of travel into the past.",
};

export const CharacterPanel = ({
    characters,
    activeCharacter,
    onSelectCharacter,
    onCreateCharacter,
    onUpdateCharacter,
    onDeleteCharacter,
    onDiceRollResult,
    onTriggerDiceRoll,
    onAddRecentRoll,
    onImportCharacter,
    onAdvanceTime,
}) => {
    const [expandedSections, setExpandedSections] = useState({
        header: false,
        geist: false,
        attributesSkills: false,
        merits: false,
        inventory: false,
        sinEater: false,
        powers: false,
        notes: false,
    });
    const [pendingChanges, setPendingChanges] = useState({});
    const [showMeritDialog, setShowMeritDialog] = useState(false);
    const [newMeritName, setNewMeritName] = useState("");
    const [newMeritDots, setNewMeritDots] = useState(1);
    const [newMeritSpecialty, setNewMeritSpecialty] = useState("");
    const [newSpecialty, setNewSpecialty] = useState("");
    const [inventoryAddOpen, setInventoryAddOpen] = useState(false);
    const importFileInputRef = useRef(null);
    
    // Inventory add-item form state
    const [invType, setInvType] = useState("equipment");
    const [invPremade, setInvPremade] = useState("__none__");
    const [editingInventoryIndex, setEditingInventoryIndex] = useState(null);
    const [invDraft, setInvDraft] = useState({
        type: "equipment",
        name: "",
        availability: 0,
        weapon: { kind: "melee", damage: 1, strength: 0, size: 1, range: 10, ammo: 0, special: [], notes: "" },
        armor: {
            general: 1,
            ballistic: 0,
            strength: 1,
            defense: 0,
            speed: 0,
            coverage: { head: false, torso: false, arms: false, legs: false },
        },
        equipment: { bonus: 0, durability: 0, size: 1, structure: 1, effect: "" },
        yantra: { kind: "tool", tool_type: "", bonus: 1, notes: "" },
    });

    // Ceremony Dialog State
    const [showCeremonyDialog, setShowCeremonyDialog] = useState(false);
    const [newCeremonyName, setNewCeremonyName] = useState("");

    // Character Type Selection Dialog State
    const [showCharacterTypeDialog, setShowCharacterTypeDialog] = useState(false);
    const [showAddCharacterDialog, setShowAddCharacterDialog] = useState(false);

    // Spellcasting Popup State (Mage)
    const [spellcastingOpen, setSpellcastingOpen] = useState(false);
    const [spellcastingArcanum, setSpellcastingArcanum] = useState(null);
    const [spellcastingPractice, setSpellcastingPractice] = useState(null);
    const [spellcastingType, setSpellcastingType] = useState(null);
    const [spellcastingRoteSkill, setSpellcastingRoteSkill] = useState(null);
    const [mageSceneParadoxRollsByCharacter, setMageSceneParadoxRollsByCharacter] = useState({});

    const getMageSceneParadoxKey = () => activeCharacter?.id || "__active_mage__";

    const getMageSceneParadoxRolls = () => {
        const key = getMageSceneParadoxKey();
        return Math.max(0, Number(mageSceneParadoxRollsByCharacter[key]) || 0);
    };

    const setMageSceneParadoxRolls = (valueOrUpdater) => {
        const key = getMageSceneParadoxKey();

        setMageSceneParadoxRollsByCharacter((previous) => {
            const current = Math.max(0, Number(previous[key]) || 0);
            const nextValue = typeof valueOrUpdater === "function"
                ? valueOrUpdater(current)
                : valueOrUpdater;

            return {
                ...previous,
                [key]: Math.max(0, Number(nextValue) || 0),
            };
        });
    };

    const resetMageSceneParadoxRolls = () => {
        setMageSceneParadoxRolls(0);
    };

    // Mage advancement purchase flow
    const [xpPurchaseOpen, setXpPurchaseOpen] = useState(false);
    const [pendingPurchase, setPendingPurchase] = useState(null);
    const [arcaneXpApplied, setArcaneXpApplied] = useState(0);
    const [xpPurchaseNote, setXpPurchaseNote] = useState("");

    const openSpellcastingPopup = (arcanum, practice = null, spellType = null, roteSkill = null) => {
        setSpellcastingArcanum(arcanum);
        setSpellcastingPractice(practice);
        setSpellcastingType(spellType);
        setSpellcastingRoteSkill(roteSkill);
        setSpellcastingOpen(true);
    };

    // Dice Roll Popup State
    const [dicePopupOpen, setDicePopupOpen] = useState(false);
    const [dicePopupHaunt, setDicePopupHaunt] = useState(null);
    // Generic Dice Roller Popup State (Attributes / Skills)
    const [genericDicePopupOpen, setGenericDicePopupOpen] = useState(false);
    const [dicePopupPreset, setDicePopupPreset] = useState(null);
    const openDicePopup = (type, key) => {
        // Only open the Haunt popup when explicitly opening a haunt
        if (type === "haunt") {
            setDicePopupHaunt(key);
            setDicePopupOpen(true);
            return;
        }
        // Attribute/Skill click -> open the generic dice roller popup
        setDicePopupPreset({ type, key });
        setGenericDicePopupOpen(true);
    };

    // Ceremony Roll Popup State
    const [ceremonyPopupOpen, setCeremonyPopupOpen] = useState(false);
    const [ceremonyPopupData, setCeremonyPopupData] = useState(null);

    const parseCeremonyDicePool = (dicePoolText) => {
        // Expected format: "Stamina + Medicine"
        // Attributes are in ATTRIBUTE_LIST (lowercase).
        // Skills are in SKILL_LIST (lowercase, underscores).
        if (!dicePoolText || typeof dicePoolText !== "string") return null;

        const parts = dicePoolText.split("+").map(p => p.trim());
        if (parts.length !== 2) return null;

        const left = parts[0].toLowerCase();      // attribute name
        const rightRaw = parts[1];                // skill label (may be plural)

        const attrKey = left; // e.g., "stamina", "presence", "manipulation"
        if (!ATTRIBUTE_LIST.includes(attrKey)) return null;

        // Skill label normalization (e.g., "Computers" -> "computer")
        const rightLabel = rightRaw.replace(/\s+/g, " ").trim();
        const skillKey = CEREMONY_SKILL_KEY_MAP[rightLabel] || rightLabel.toLowerCase().replace(/\s+/g, "_");

        // Special case: some ceremonies use an Attribute on the right (e.g. "Stamina + Composure" where composure is an Attribute)
        const isRightAttribute = ATTRIBUTE_LIST.includes(skillKey);

        return { attrKey, skillKey, isRightAttribute };
    };

    const rollCeremonyFromCharacter = async (ceremonyName) => {
        const def = CEREMONY_DEFINITIONS[ceremonyName];
        if (!def?.dicePool) {
            toast.error(`No dice pool defined for: ${ceremonyName}`);
            return;
        }

        const parsed = parseCeremonyDicePool(def.dicePool);
        if (!parsed) {
            toast.error(`Cannot parse dice pool: ${def.dicePool}`);
            return;
        }

        const left = getNestedValue("attributes", parsed.attrKey) || 0;
        const right = parsed.isRightAttribute
            ? (getNestedValue("attributes", parsed.skillKey) || 0)
            : (getNestedValue("skills", parsed.skillKey) || 0);

        const computedPool = left + right;
        const isChance = computedPool <= 0;

        try {
            // Backend endpoint expects { pool: int, chance: bool, again, rote }
            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/dice/roll`,
                {
                    pool: isChance ? 1 : computedPool,
                    chance: isChance,
                    again: 10,
                    rote: false,
                }
            );

            setCeremonyPopupData({
                name: ceremonyName,
                dicePoolText: def.dicePool,
                computedPool,
                result: res.data,
            });
            setCeremonyPopupOpen(true);

            // If you already use this elsewhere, keep it consistent
            if (onDiceRollResult) {
                const r = res.data;
                const diceStr = (r.dice || []).join(", ");
                let resultEmoji = "✅";
                let resultType = `**Success** (${r.successes})`;
                if (r.is_dramatic_failure) {
                    resultEmoji = "💀";
                    resultType = "**DRAMATIC FAILURE**";
                } else if ((r.successes || 0) === 0) {
                    resultEmoji = "❌";
                    resultType = "**Failure**";
                } else if (r.is_exceptional) {
                    resultEmoji = "✨";
                    resultType = "**EXCEPTIONAL SUCCESS!**";
                }
                const chatMessage =
                    `${resultEmoji} **Ceremony Roll:** **${ceremonyName}**\n` +
                    `*Pool:* ${isChance ? 1 : computedPool} dice → [${diceStr}]\n` +
                    `*Result:* ${resultType}`;
                onDiceRollResult(chatMessage);
            }

        } catch (e) {
            console.error(e);
            toast.error("Ceremony roll failed (backend call).");
        }
    };

    const openHauntRollPopup = (hauntName) => {
        setDicePopupHaunt(hauntName);
        setDicePopupOpen(true);
    };
    
    const addActiveSpell = async (spell) => {
        const currentActiveSpells = activeCharacter?.active_spells || [];
        await onUpdateCharacter({
            active_spells: [...currentActiveSpells, spell],
        });
    };

    const dispelActiveSpell = async (spellId) => {
        const currentActiveSpells = activeCharacter?.active_spells || [];
        await onUpdateCharacter({
            active_spells: currentActiveSpells.filter((spell) => spell.id !== spellId),
        });
    };

    const toggleSection = (section) => {
        setExpandedSections((prev) => {
            const shouldOpen = !prev[section];

            if (!shouldOpen) {
                return { ...prev, [section]: false };
            }

            return Object.fromEntries(
                Object.keys(prev).map((key) => [key, key === section])
            );
        });
    };

    const isMageCharacter = activeCharacter?.character_type === "mage";
    const isCreationMode = isMageCharacter && activeCharacter?.creation_mode === "creation" && !activeCharacter?.creation_locked;
    const isAdvancementLocked = isMageCharacter && !!activeCharacter?.creation_locked;

    const getCurrentValueForPurchase = (field) => {
        const value = pendingChanges[field] ?? activeCharacter?.[field];
        return value;
    };

    const openAdvancementPurchase = (purchase) => {
        const cost = calculateMagePurchaseCost(activeCharacter || {}, purchase);
        const maxArcaneApplied = cost.allowsArcane
            ? Math.min(Number(activeCharacter?.arcane_experience) || 0, Number(cost.flexible ?? cost.experience) || 0)
            : 0;

        setPendingPurchase({
            ...purchase,
            cost,
            maxArcaneApplied,
        });
        setArcaneXpApplied(maxArcaneApplied);
        setXpPurchaseNote("");
        setXpPurchaseOpen(true);
    };

    const requestNestedTraitPurchase = (parent, field, value, currentValue) => {
        const traitTypeMap = {
            attributes: "attribute",
            skills: "skill",
            arcana: "arcanum",
        };

        const traitType = traitTypeMap[parent];
        if (!traitType) return false;

        if (!isAdvancementLocked || Number(value) <= Number(currentValue)) return false;

        openAdvancementPurchase({
            trait_type: traitType,
            trait_key: field,
            label: `${formatLabel(field)} ${currentValue} → ${value}`,
            from: Number(currentValue) || 0,
            to: Number(value) || 0,
            apply: { kind: "nested", parent, field, value },
        });
        return true;
    };

    const totalChargeableMeritDots = (merits = []) =>
        (Array.isArray(merits) ? merits : []).reduce(
            (total, merit) => total + getChargeableMeritDots(merit),
            0
        );

    const getProfessionalTrainingDotsFromList = (merits = []) => {
        const professionalTraining = (Array.isArray(merits) ? merits : []).find(
            (merit) => (merit?.name || "") === PROFESSIONAL_TRAINING_RULES.meritName
        );

        return Math.max(0, Number(professionalTraining?.dots) || 0);
    };

    const buildProfessionalTrainingFreeContactsMerit = () => ({
        id: "professional-training-free-contacts",
        name: PROFESSIONAL_TRAINING_RULES.freeContactMeritName,
        dots: PROFESSIONAL_TRAINING_RULES.freeContactDots,
        specialty: PROFESSIONAL_TRAINING_RULES.freeContactSpecialty,
        source: PROFESSIONAL_TRAINING_RULES.freeContactSource,
        locked: true,
    });

    const withProfessionalTrainingFreeContacts = (merits = []) => {
        const safeMerits = Array.isArray(merits) ? merits : [];
        const withoutFreeContacts = safeMerits.filter(
            (merit) => merit?.source !== PROFESSIONAL_TRAINING_RULES.freeContactSource
        );

        const professionalTrainingDots = getProfessionalTrainingDotsFromList(withoutFreeContacts);

        if (professionalTrainingDots < PROFESSIONAL_TRAINING_RULES.contactsAtDots) {
            return withoutFreeContacts;
        }

        return [
            ...withoutFreeContacts,
            buildProfessionalTrainingFreeContactsMerit(),
        ].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    };

    const getProfessionalTrainingFreeSpecialtySlotsGained = (currentMerits = [], nextMerits = []) => {
        const currentFreeSpecialties = getProfessionalTrainingFreeSpecialtyCount(currentMerits);
        const nextFreeSpecialties = getProfessionalTrainingFreeSpecialtyCount(nextMerits);

        return Math.max(0, nextFreeSpecialties - currentFreeSpecialties);
    };

    const requestListTraitPurchase = (field, value, currentValue) => {
        if (!isAdvancementLocked) return false;

        const currentList = Array.isArray(currentValue) ? currentValue : [];
        const nextList = Array.isArray(value) ? value : [];

        if (field === "specialties" && nextList.length > currentList.length) {
            const freeSlots = Math.max(0, Number(activeCharacter?.free_skill_specialty_slots) || 0);

            if (freeSlots > 0) {
                commitCharacterUpdate({
                    specialties: nextList,
                    free_skill_specialty_slots: freeSlots - 1,
                });
                toast.success("Free Professional Training Specialty recorded.");
                return true;
            }

            openAdvancementPurchase({
                trait_type: "skill_specialty",
                trait_key: nextList[nextList.length - 1] || "specialty",
                label: `Skill Specialty: ${nextList[nextList.length - 1] || "New Specialty"}`,
                from: currentList.length,
                to: nextList.length,
                apply: { kind: "field", field, value },
            });
            return true;
        }

        if (field === "rotes" && nextList.length > currentList.length) {
            const added = nextList[nextList.length - 1] || {};
            openAdvancementPurchase({
                trait_type: "rote",
                trait_key: added.spell || "rote",
                label: `Rote: ${added.spell || "New Rote"}`,
                from: currentList.length,
                to: nextList.length,
                apply: { kind: "field", field, value },
            });
            return true;
        }

        if (field === "praxes" && nextList.length > currentList.length) {
            const added = nextList[nextList.length - 1] || {};
            openAdvancementPurchase({
                trait_type: "praxis",
                trait_key: added.spell || "praxis",
                label: `Praxis: ${added.spell || "New Praxis"}`,
                from: currentList.length,
                to: nextList.length,
                apply: { kind: "field", field, value },
            });
            return true;
        }

        if (field === "merits_list") {
            const normalizedNextList = withProfessionalTrainingFreeContacts(nextList);
            const currentChargeableDots = totalChargeableMeritDots(currentList);
            const nextChargeableDots = totalChargeableMeritDots(normalizedNextList);

            if (nextChargeableDots > currentChargeableDots) {
                const freeSpecialtySlotsGained = getProfessionalTrainingFreeSpecialtySlotsGained(currentList, normalizedNextList);
                const patch = {
                    merits_list: normalizedNextList,
                };

                if (freeSpecialtySlotsGained > 0) {
                    patch.free_skill_specialty_slots =
                        Math.max(0, Number(activeCharacter?.free_skill_specialty_slots) || 0) + freeSpecialtySlotsGained;
                }

                openAdvancementPurchase({
                    trait_type: "merit",
                    trait_key: "merit",
                    label: "Merit increase",
                    from: currentChargeableDots,
                    to: nextChargeableDots,
                    apply: { kind: "patch", patch },
                });
                return true;
            }
        }

        return false;
    };

    const requestFieldTraitPurchase = (field, value, currentValue) => {
        if (!isAdvancementLocked || Number(value) <= Number(currentValue)) return false;

        const traitTypeMap = {
            gnosis: "gnosis",
            wisdom: "wisdom",
        };

        const traitType = traitTypeMap[field];
        if (!traitType) return false;

        openAdvancementPurchase({
            trait_type: traitType,
            trait_key: field,
            label: `${formatLabel(field)} ${currentValue} → ${value}`,
            from: Number(currentValue) || 0,
            to: Number(value) || 0,
            apply: { kind: "field", field, value },
        });
        return true;
    };

    const handleChange = (field, value) => {
        const currentValue = getCurrentValueForPurchase(field);

        if (isAdvancementLocked && ["path", "order"].includes(field) && value !== currentValue) {
            toast.error(`${formatLabel(field)} is locked after character creation.`);
            return;
        }

        if (requestFieldTraitPurchase(field, value, currentValue)) return;
        if (requestListTraitPurchase(field, value, currentValue)) return;

        setPendingChanges(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        const currentParent = pendingChanges[parent] || activeCharacter?.[parent] || {};
        const currentValue = currentParent[field] ?? 0;

        if (requestNestedTraitPurchase(parent, field, value, currentValue)) return;

        setPendingChanges(prev => ({ ...prev, [parent]: { ...currentParent, [field]: value } }));
    };

    const saveChanges = () => {
        if (Object.keys(pendingChanges).length > 0) {
            onUpdateCharacter(pendingChanges);
            setPendingChanges({});
        }
    };

    const commitCharacterUpdate = async (updates) => {
        if (!updates || Object.keys(updates).length === 0) return;

        setPendingChanges((prev) => ({ ...prev, ...updates }));

        if (onUpdateCharacter) {
            await onUpdateCharacter(updates);
            setPendingChanges((prev) => {
                const next = { ...prev };
                Object.keys(updates).forEach((key) => {
                    if (next[key] === updates[key]) delete next[key];
                });
                return next;
            });
        }
    };

    const applyPurchasePatch = (purchase) => {
        if (!purchase?.apply) return {};

        if (purchase.apply.kind === "nested") {
            const currentParent = activeCharacter?.[purchase.apply.parent] || {};
            return {
                [purchase.apply.parent]: {
                    ...currentParent,
                    [purchase.apply.field]: purchase.apply.value,
                },
            };
        }

        if (purchase.apply.kind === "field") {
            return { [purchase.apply.field]: purchase.apply.value };
        }

        if (purchase.apply.kind === "patch") {
            return purchase.apply.patch || {};
        }

        return {};
    };

    const confirmAdvancementPurchase = async () => {
        if (!pendingPurchase) return;

        const cost = pendingPurchase.cost || calculateMagePurchaseCost(activeCharacter || {}, pendingPurchase);
        const safeArcaneApplied = Math.min(
            pendingPurchase.maxArcaneApplied || 0,
            Math.max(0, Number(arcaneXpApplied) || 0)
        );

        if (!canAffordMagePurchase(activeCharacter || {}, cost, safeArcaneApplied)) {
            toast.error("Not enough XP for this purchase.");
            return;
        }

        const ledgerEntry = makeLedgerEntry({ ...pendingPurchase, note: xpPurchaseNote }, cost, safeArcaneApplied);
        const currentLedger = activeCharacter?.advancement_ledger || [];
        const updates = {
            ...applyPurchasePatch(pendingPurchase),
            experience: Math.max(0, (activeCharacter?.experience || 0) - ledgerEntry.cost.experience),
            arcane_experience: Math.max(0, (activeCharacter?.arcane_experience || 0) - ledgerEntry.cost.arcane_experience),
            spent_experience: (activeCharacter?.spent_experience || 0) + ledgerEntry.cost.experience,
            spent_arcane_experience: (activeCharacter?.spent_arcane_experience || 0) + ledgerEntry.cost.arcane_experience,
            advancement_ledger: [...currentLedger, ledgerEntry],
        };

        await commitCharacterUpdate(updates);
        setPendingPurchase(null);
        setArcaneXpApplied(0);
        setXpPurchaseNote("");
        setXpPurchaseOpen(false);
        toast.success("XP purchase recorded.");
    };

    const lockMageCharacter = async (validationFromPanel = null) => {
        if (!activeCharacter || activeCharacter.character_type !== "mage") return;

        const characterForValidation = {
            ...activeCharacter,
            ...pendingChanges,
            creation_choices: pendingChanges.creation_choices || activeCharacter.creation_choices || getBlankMageCreationChoices(),
        };
        const validation = validationFromPanel || validateMageCreation(characterForValidation);

        if (!validation.valid) {
            toast.error("Character creation is not valid yet.");
            return;
        }

        const now = new Date().toISOString();
        const { created_at, updated_at, id, ...baselineCharacter } = characterForValidation;
        const updates = {
            ...pendingChanges,
            creation_mode: "active",
            creation_locked: true,
            creation_locked_at: now,
            creation_validation: validation,
            creation_baseline: {
                locked_at: now,
                character: baselineCharacter,
            },
            advancement_ledger: [],
        };

        await onUpdateCharacter(updates);
        setPendingChanges({});
        toast.success("Character locked. Future permanent increases require XP.");
    };

    const escapeHtml = (value = "") => String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

    const getCharacterForExport = () => ({
        ...(activeCharacter || {}),
        ...pendingChanges,
    });

    const buildCharacterExportText = (character) => {
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

    const exportCharacterToJson = () => {
        if (!activeCharacter) return;

        const characterToExport = getCharacterForExport();
        const fileName = `${(characterToExport.name || "character").replace(/[^a-z0-9-_]+/gi, "_")}.json`;

        const payload = {
            app: "GeistRoller",
            exported_at: new Date().toISOString(),
            character: characterToExport,
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Character exported as JSON");
    };

    const exportCharacterToPdf = () => {
        if (!activeCharacter) return;

        const characterToExport = getCharacterForExport();
        const printWindow = window.open("", "_blank", "width=900,height=1200");

        if (!printWindow) {
            toast.error("Popup blocked. Allow popups to export PDF.");
            return;
        }

        const printableText = buildCharacterExportText(characterToExport);
        const title = escapeHtml(characterToExport.name || "Character Sheet");
        const subtitle = escapeHtml(characterToExport.character_type === "mage" ? "Mage" : "Sin-Eater");
        const body = escapeHtml(printableText).replaceAll("\n", "<br />");

        printWindow.document.write(`
            <!doctype html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>${title}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 40px;
                            color: #111827;
                            background: #ffffff;
                        }
                        h1 {
                            margin: 0 0 8px 0;
                            font-size: 24px;
                        }
                        .subtitle {
                            margin-bottom: 24px;
                            color: #4b5563;
                            font-size: 14px;
                            text-transform: uppercase;
                            letter-spacing: 0.08em;
                        }
                        .sheet {
                            white-space: pre-wrap;
                            font-family: "Courier New", monospace;
                            font-size: 12px;
                            line-height: 1.45;
                        }
                        @media print {
                            body { margin: 20px; }
                        }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <div class="subtitle">${subtitle} character sheet</div>
                    <div class="sheet">${body}</div>
                    <script>
                        window.onload = function () {
                            window.focus();
                            window.print();
                        };
                    </script>
                </body>
            </html>
        `);

        printWindow.document.close();
        toast.success("Print dialog opened. Choose Save as PDF.");
    };

    const triggerImportCharacter = () => {
        importFileInputRef.current?.click();
    };

    const handleImportCharacterFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            const importedCharacter = parsed?.character || parsed;

            if (!importedCharacter || typeof importedCharacter !== "object") {
                throw new Error("Invalid character data");
            }

            if (!onImportCharacter) {
                throw new Error("Import handler is missing");
            }

            await onImportCharacter(importedCharacter);
        } catch (error) {
            console.error("Failed to import character:", error);
            toast.error("Could not import that JSON file");
        } finally {
            event.target.value = "";
        }
    };

    const getValue = (field) => pendingChanges[field] ?? activeCharacter?.[field];
    const getNestedValue = (parent, field) => {
        const pending = pendingChanges[parent]?.[field];
        if (pending !== undefined) return pending;
        return activeCharacter?.[parent]?.[field] ?? 0;
    };

    const getAdvancementLedger = () => {
        const ledger = getValue("advancement_ledger");
        return Array.isArray(ledger) ? ledger : [];
    };

    const formatLedgerDate = (value) => {
        if (!value) return "—";
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return "—";
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(parsed);
    };

    const formatLedgerCost = (entry = {}) => {
        const cost = entry.cost || {};
        const xp = Number(cost.experience) || 0;
        const arcane = Number(cost.arcane_experience) || 0;
        const parts = [];
        if (xp > 0) parts.push(`${xp} XP`);
        if (arcane > 0) parts.push(`${arcane} Arcane XP`);
        return parts.length > 0 ? parts.join(" / ") : "0 XP";
    };

    const formatLedgerChange = (entry = {}) => {
        const hasFrom = entry.from !== null && entry.from !== undefined;
        const hasTo = entry.to !== null && entry.to !== undefined;
        if (hasFrom && hasTo) return `${entry.from} → ${entry.to}`;
        return "";
    };

    const activateMageEffect = async ({ type, arcanum, attainmentName, effectName, description, path, extraArcanum }) => {
        const currentActiveSpells = activeCharacter?.active_spells || [];
        const currentMana = getValue("mana") || 0;

        if (type === "twilight") {
            if (currentMana < 1) {
                toast.error("Not enough Mana");
                return;
            }

            const effectKey = `twilight-${arcanum.toLowerCase()}`;

            if (currentActiveSpells.some((spell) => spell.effect_key === effectKey)) {
                toast.info(`${effectName} is already active.`);
                return;
            }

            await onUpdateCharacter({
                mana: Math.max(0, currentMana - 1),
                active_spells: [
                    ...currentActiveSpells,
                    {
                        id: Date.now(),
                        kind: "effect",
                        effect_key: effectKey,
                        name: effectName,
                        arcanum,
                        practice: "Attainment",
                        subtitle: `${arcanum} • ${attainmentName}`,
                        description,
                    },
                ],
            });

            return;
        }

        if (type === "mageSight") {
            const currentPath = path || getValue("path");
            const rulingArcana = PATH_ARCANA[currentPath]?.ruling || [];

            if (!currentPath || rulingArcana.length === 0) {
                return;
            }

            const existingMageSight = currentActiveSpells.find((spell) => spell.effect_key === "mage-sight");
            const existingExtras = Array.isArray(existingMageSight?.extra_arcana) ? existingMageSight.extra_arcana : [];

            let nextExtras = [];

            if (extraArcanum) {
                if (existingExtras.includes(extraArcanum)) {
                    toast.info(`${extraArcanum} Mage Sight is already active.`);
                    return;
                }

                if (currentMana < 1) {
                    toast.error("Not enough Mana");
                    return;
                }

                nextExtras = [...existingExtras, extraArcanum];
            }

            const activeArcana = [...rulingArcana, ...nextExtras];
            const plusLabel = nextExtras.length > 0 ? ` + ${nextExtras.join(" + ")}` : "";

            await onUpdateCharacter({
                ...(extraArcanum ? { mana: Math.max(0, currentMana - 1) } : {}),
                active_spells: [
                    ...currentActiveSpells.filter((spell) => spell.effect_key !== "mage-sight"),
                    {
                        id: existingMageSight?.id || Date.now(),
                        kind: "effect",
                        effect_key: "mage-sight",
                        name: `Mage Sight: ${currentPath}${plusLabel}`,
                        arcanum: activeArcana.join(", "),
                        practice: "Mage Sight",
                        subtitle: `${currentPath} • ${activeArcana.join(", ")}`,
                        description: activeArcana
                            .map((name) => `${name}: ${MAGE_SIGHT_DESCRIPTIONS[name]}`)
                            .join("\n"),
                        extra_arcana: nextExtras,
                    },
                ],
            });
        }
    };

    // Inventory helpers
    const inventoryItems = getValue("inventory_items") || [];
    const equippedArmor = useMemo(() => {
        return (inventoryItems || []).find((it) => it?.type === "armor" && !!it?.equipped) || null;
    }, [inventoryItems]);

    const equippedArmorGeneral = equippedArmor?.armor?.general ?? 0;
    const equippedArmorBallistic = equippedArmor?.armor?.ballistic ?? 0;
    const equippedArmorRating = useMemo(() => {
        const equippedArmor = (inventoryItems || []).filter((it) => it?.type === "armor" && !!it?.equipped);
        if (equippedArmor.length === 0) return 0;

        return equippedArmor.reduce((maxSoFar, it) => {
            const general = it?.armor?.general ?? 0;
            const ballistic = it?.armor?.ballistic ?? 0;
            const rating = Math.max(general, ballistic);
            return Math.max(maxSoFar, rating);
        }, 0);
    }, [inventoryItems]);

    const updateInventoryItem = (index, patch) => {
        const current = getValue("inventory_items") || [];
        const updated = current.map((it, i) => (i === index ? { ...it, ...patch } : it));
        handleChange("inventory_items", updated);
    };

    const updateInventoryItemNested = (index, section, patch) => {
        const current = getValue("inventory_items") || [];
        const updated = current.map((it, i) => {
            if (i !== index) return it;
            return { ...it, [section]: { ...(it?.[section] || {}), ...patch } };
        });
        handleChange("inventory_items", updated);
    };

    const removeInventoryItem = (index) => {
        const current = getValue("inventory_items") || [];
        const updated = current.filter((_, i) => i !== index);
        handleChange("inventory_items", updated);
    };

    const addInventoryItem = () => {
        const current = getValue("inventory_items") || [];

        // Basic validation
        if (!invDraft.name || !invDraft.name.trim()) {
            toast.error("Inventory item needs a name");
            return;
        }

        const newItem = {
            ...invDraft,
            type: invType,
            equipped: false,
        };

        handleChange("inventory_items", [...current, newItem]);

        // Reset draft (keep type)
        setInvPremade("__none__");
        setInvDraft((prev) => ({
            type: prev.type,
            name: "",
            availability: 0,
            weapon: { damage: 1, strength: 1, size: 1, special: [], notes: "" },
            armor: {
                general: 1,
                ballistic: 0,
                strength: 1,
                defense: 0,
                speed: 0,
                coverage: { head: false, torso: false, arms: false, legs: false },
            },
            equipment: { bonus: 0, durability: 0, size: 1, structure: 1, effect: "" },
            yantra: {kind: "tool", tool_type: "", bonus: 1, notes:""}
        }));
        setInventoryAddOpen(false);
    };

    const handleTouchstoneChange = (index, value) => {
        const current = getValue("touchstones") || [];
        const updated = [...current];
        updated[index] = value;
        handleChange("touchstones", updated);
    };

    const spendWillpower = async () => {
        const currentWillpower = getValue("willpower") || 0;
        if (currentWillpower <= 0) return false;
        const updated = currentWillpower - 1;
        await onUpdateCharacter({ willpower: updated });
        setPendingChanges((prev) => {
            const next = { ...prev };
            delete next.willpower;
            return next;
        });
        return true;
    };

    const rebuyWillpowerDot = async () => {
        const currentXP = getValue("experience") || 0;
        const currentModifier = getValue("willpower_max_modifier") || 0;

        if (currentXP < 1) {
            toast.error("Not enough Experience");
            return false;
        }

        if (currentModifier >= 0) {
            toast.error("Willpower is already at Resolve + Composure");
            return false;
        }

        const nextModifier = Math.min(0, currentModifier + 1);
        const currentWillpower = getValue("willpower") || 0;
        const resolve = getNestedValue("attributes", "resolve") || 1;
        const composure = getNestedValue("attributes", "composure") || 1;
        const nextMaxWillpower = Math.max(0, resolve + composure + nextModifier);

        await onUpdateCharacter({
            experience: currentXP - 1,
            willpower_max_modifier: nextModifier,
            willpower: Math.min(currentWillpower + 1, nextMaxWillpower),
        });

        setPendingChanges((prev) => {
            const next = { ...prev };
            delete next.experience;
            delete next.willpower_max_modifier;
            delete next.willpower;
            return next;
        });

        toast.success("Willpower dot re-bought for 1 Experience");
        return true;
    };

    const awardBeat = async () => {
        const currentBeats = getValue("beats") || 0;
        const currentXP = getValue("experience") || 0;
        const newBeats = currentBeats + 1;
        
        // 5 Beats = 1 Experience
        if (newBeats >= 5) {
            await onUpdateCharacter({ beats: newBeats - 5, experience: currentXP + 1 });
            toast.success("5 Beats converted to 1 Experience!");
        } else {
            await onUpdateCharacter({ beats: newBeats });
        }
        
        setPendingChanges((prev) => {
            const next = { ...prev };
            delete next.beats;
            delete next.experience;
            return next;
        });
    };

    const removeBeat = async () => {
        const currentBeats = getValue("beats") || 0;
        if (currentBeats <= 0) return;

        await onUpdateCharacter({ beats: currentBeats - 1 });

        setPendingChanges((prev) => {
            const next = { ...prev };
            delete next.beats;
            return next;
        });
    };

    const awardArcaneBeat = async () => {
        const currentBeats = getValue("arcane_beats") || 0;
        const currentXP = getValue("arcane_experience") || 0;
        const newBeats = currentBeats + 1;

        if (newBeats >= 5) {
            await onUpdateCharacter({ arcane_beats: newBeats - 5, arcane_experience: currentXP + 1 });
            toast.success("5 Arcane Beats converted to 1 Arcane Experience!");
        } else {
            await onUpdateCharacter({ arcane_beats: newBeats });
        }

        setPendingChanges((prev) => {
            const next = { ...prev };
            delete next.arcane_beats;
            delete next.arcane_experience;
            return next;
        });
    };

    const removeArcaneBeat = async () => {
        const currentBeats = getValue("arcane_beats") || 0;
        if (currentBeats <= 0) return;

        await onUpdateCharacter({ arcane_beats: currentBeats - 1 });

        setPendingChanges((prev) => {
            const next = { ...prev };
            delete next.arcane_beats;
            return next;
        });
    };

    const fulfillAspiration = async (field) => {
        await awardBeat();
        if (field) {
            handleChange(field, "");
        }
    };

    const getObsessions = () => {
        const list = getValue("obsessions");
        if (Array.isArray(list)) return list;
        const legacy = getValue("obsession");
        return legacy ? [legacy] : [""];
    };

    const updateObsession = (index, value) => {
        const next = [...getObsessions()];
        next[index] = value;
        handleChange("obsessions", next);
        if (index === 0) handleChange("obsession", value);
    };

    const addObsession = () => {
        handleChange("obsessions", [...getObsessions(), ""]);
    };

    const removeObsession = (index) => {
        const next = getObsessions().filter((_, i) => i !== index);
        handleChange("obsessions", next.length > 0 ? next : [""]);
        if (index === 0) handleChange("obsession", next[0] || "");
    };

    const fulfillObsession = async (index) => {
        await awardArcaneBeat();
        const next = [...getObsessions()];
        next[index] = "";
        handleChange("obsessions", next);
        if (index === 0) handleChange("obsession", "");
    };
    
    // Resolve condition and award beat
    const resolveCondition = async (conditionIndex) => {
        const conditions = getValue("conditions") || [];
        const condition = conditions[conditionIndex];
        if (!condition) return;
        
        // Remove the condition
        const updatedConditions = conditions.filter((_, i) => i !== conditionIndex);
        
        // Award beat
        const currentBeats = getValue("beats") || 0;
        const currentXP = getValue("experience") || 0;
        const newBeats = currentBeats + 1;
        
        const updates = { conditions: updatedConditions };
        
        // 5 Beats = 1 Experience
        if (newBeats >= 5) {
            updates.beats = newBeats - 5;
            updates.experience = currentXP + 1;
            toast.success(`Condition "${condition.name}" resolved! 5 Beats converted to 1 Experience!`);
        } else {
            updates.beats = newBeats;
            toast.success(`Condition "${condition.name}" resolved! Beat gained!`);
        }
        
        await onUpdateCharacter(updates);
        setPendingChanges((prev) => {
            const next = { ...prev };
            delete next.conditions;
            delete next.beats;
            delete next.experience;
            return next;
        });
    };

    const spendPlasm = async (amount) => {
        const currentPlasm = getValue("plasm") || 0;
        if (currentPlasm < amount) return false;
        const updated = currentPlasm - amount;
        await onUpdateCharacter({ plasm: updated });
        setPendingChanges((prev) => {
            const next = { ...prev };
            delete next.plasm;
            return next;
        });
        return true;
    };

    const addConditionFromDiceRoller = async (condition) => {
        const currentConditions = activeCharacter?.conditions || [];
        const updated = [...currentConditions, { ...condition, id: Date.now().toString() }];
        await onUpdateCharacter({ conditions: updated });
    };

    // Handle Mage Path selection - auto-set Ruling Arcana to 1 dot
    const handlePathChange = (newPath) => {
        if (isAdvancementLocked) {
            toast.error("Path is locked after character creation.");
            return;
        }

        handleChange("path", newPath);
        
        if (newPath && PATH_ARCANA[newPath]) {
            const pathData = PATH_ARCANA[newPath];
            const currentArcana = getValue("arcana") || {};
            const newArcana = { ...currentArcana };
            
            // Set ruling arcana to at least 1 dot
            pathData.ruling.forEach(arcanum => {
                if (!newArcana[arcanum] || newArcana[arcanum] < 1) {
                    newArcana[arcanum] = 1;
                }
            });
            
            handleChange("arcana", newArcana);
            toast.success(`Path set to ${newPath}. Ruling Arcana (${pathData.ruling.join(" & ")}) set to 1 dot.`);
        }
    };

    const handleOrderChange = (newOrder) => {
        if (isAdvancementLocked) {
            toast.error("Order is locked after character creation.");
            return;
        }

        handleChange("order", newOrder);

        if (!newOrder || newOrder === "Nameless") return;

        const currentSkills = getValue("skills") || {};
        const currentMerits = getValue("merits_list") || [];
        const orderStatusName = `Status: ${newOrder}`;
        const nextSkills = {
            ...currentSkills,
            occult: Math.max(1, Number(currentSkills.occult) || 0),
        };

        const hasHighSpeech = currentMerits.some((merit) => (merit?.name || "") === "High Speech");
        const hasOrderStatus = currentMerits.some((merit) => (merit?.name || "") === orderStatusName);
        const nextMerits = [
            ...currentMerits,
            ...(hasHighSpeech ? [] : [{ id: Date.now(), name: "High Speech", dots: 1, source: "order_free" }]),
            ...(hasOrderStatus ? [] : [{ id: Date.now() + 1, name: orderStatusName, dots: 1, source: "order_free" }]),
        ];

        handleChange("skills", nextSkills);
        handleChange("merits_list", nextMerits);
        toast.success(`Order set to ${newOrder}. Added free Occult, High Speech, and Order Status if missing.`);
    };

    const hasPendingChanges = Object.keys(pendingChanges).length > 0;

    // Get synergy-based values
    const currentSynergy = getValue("synergy") || 7;
    const synergyData = SYNERGY_TABLE[currentSynergy] || SYNERGY_TABLE[7];

    const doomedKeySources = useMemo(() => {
        const sources = {};
        const conditions = activeCharacter?.conditions || [];
        conditions.forEach((condition) => {
            const name = condition?.name || "";
            const origin = condition?.origin || "";
            if (name.toLowerCase().startsWith("doomed")) {
                KEYS.forEach((key) => {
                    if (name.includes(key) || origin.includes(key)) {
                        sources[key] = origin || name;
                    }
                });
            }
        });
        return sources;
    }, [activeCharacter?.conditions]);

    const doomedKeys = useMemo(() => new Set(Object.keys(doomedKeySources)), [doomedKeySources]);

    // Calculate all available keys (from Character, Geist, and Mementos)
    const allAvailableKeys = useMemo(() => {
        const keys = new Set();

        // Character's Innate Key
        const characterKey = getValue("innate_key");
        if (characterKey) keys.add(characterKey);

        // Geist's Innate Key
        const geistKey = getValue("geist_innate_key");
        if (geistKey) keys.add(geistKey);

        // Memento Keys
        const mementos = getValue("mementos") || [];
        mementos.forEach(m => {
            if (m.key) keys.add(m.key);
        });

        // Also include any manually added keys
        const manualKeys = getValue("keys") || [];
        manualKeys.forEach(k => keys.add(k));

        doomedKeys.forEach((key) => keys.delete(key));

        return Array.from(keys);
    }, [getValue("innate_key"), getValue("geist_innate_key"), getValue("mementos"), getValue("keys"), doomedKeys]);

    // Calculate derived stats
    const SCOURED_DERIVED_ATTRIBUTES = ["strength", "dexterity", "stamina"];

    const getScouredAttributeCount = (attr) => {
        const scoured = getValue("scoured_attributes") || {};
        return Math.max(0, Number(scoured[attr]) || 0);
    };

    const getAttributeForDerivedTrait = (attr, fallback = 1) => {
        const rawValue = getNestedValue("attributes", attr);
        const currentValue = Number.isFinite(Number(rawValue)) ? Number(rawValue) : fallback;

        if (!SCOURED_DERIVED_ATTRIBUTES.includes(attr)) return currentValue;

        const hasLifeTwo = (getNestedValue("arcana", "Life") || 0) >= 2;
        if (!hasLifeTwo) return currentValue;

        return currentValue + getScouredAttributeCount(attr);
    };

    const calculateDefense = () => {
        const dex = getAttributeForDerivedTrait("dexterity", 1);
        const wits = getNestedValue("attributes", "wits") || 1;
        const athletics = getNestedValue("skills", "athletics") || 0;
        return Math.min(dex, wits) + athletics;
    };

    const calculateInitiative = () => {
        const dex = getAttributeForDerivedTrait("dexterity", 1);
        const composure = getNestedValue("attributes", "composure") || 1;
        return dex + composure;
    };

    const calculateSpeed = () => {
        const str = getAttributeForDerivedTrait("strength", 1);
        const dex = getAttributeForDerivedTrait("dexterity", 1);
        return str + dex + 5;
    };

    const calculateHealthMax = () => {
        const stamina = getAttributeForDerivedTrait("stamina", 0);

        const meritsList = getValue("merits_list") || [];
        const hasGiant = (meritsList || []).some((m) => (m?.name || "") === "Giant");
        const hasSmallFramed = (meritsList || []).some((m) => (m?.name || "") === "Small-Framed");
        const size = 5 + (hasGiant ? 1 : 0) + (hasSmallFramed ? -1 : 0);

        return stamina + size;
    };

    const calculateWillpowerMax = () => {
        const resolve = getNestedValue("attributes", "resolve") || 1;
        const composure = getNestedValue("attributes", "composure") || 1;
        const modifier = getValue("willpower_max_modifier") || 0;
        return Math.max(0, resolve + composure + modifier);
    };

    const getParadoxTaintDuration = (wisdom) => {
        const safeWisdom = Number.isFinite(Number(wisdom)) ? Number(wisdom) : 0;

        if (safeWisdom >= 8) return "1 Month";
        if (safeWisdom >= 4) return "1 Day";
        if (safeWisdom >= 1) return "1 Hour";
        return "3 Seconds";
    };

    const geistRank = parseInt(getValue("geist_rank"), 10) || 1;
    const maxHealth = calculateHealthMax();
    const resolveParadoxContainment = async ({ cancelled, remaining, wisdomExceptional = false }) => {
        const safeCancelled = Math.max(0, cancelled || 0);
        const safeRemaining = Math.max(0, remaining || 0);
    
        const currentBoxes = normalizeHealthBoxes(
            getValue("health_boxes"),
            maxHealth,
            getValue("health") || 0
        );
    
        const currentCounts = getHealthCounts(currentBoxes);
    
        const nextCounts = {
            ...currentCounts,
            bashing: currentCounts.bashing + safeCancelled,
        };
    
        const nextHealthBoxes = normalizeHealthBoxes(
            buildHealthBoxes(nextCounts, maxHealth),
            maxHealth,
            0
        );
    
        const currentConditions = getValue("conditions") || [];
        const hasParadoxTaint = currentConditions.some(
            (cond) => (cond?.name || "").toLowerCase() === "paradox taint"
        );

        const currentWisdom = parseInt(getValue("wisdom"), 10) || 0;
        const paradoxTaintDuration = getParadoxTaintDuration(currentWisdom);

        const paradoxTaintDescription = wisdomExceptional
            ? "Your Nimbus is disfigured by the Abyss. You and any subjects affected by your Nimbus, gain the Open Condition applicable to Abyssal entities."
            : "Your Nimbus is disfigured by the Abyss. You and any subjects affected by your Nimbus, gain the Resonant Condition applicable to Abyssal entities.";

        const paradoxTaintResolution = `An Abyssal Entity uses the Condition to Manifest, you Scour the Condition from your Pattern, or you allow the Condition to lapse after ${paradoxTaintDuration}.`;

        const nextConditions =
            safeRemaining > 0 && !hasParadoxTaint
                ? [
                    ...currentConditions,
                    {
                        name: "Paradox Taint",
                        type: "condition",
                        origin: "Spellcasting",
                        description: paradoxTaintDescription,
                        resolution: paradoxTaintResolution,
                    },
                ]
                : currentConditions;
    
        await onUpdateCharacter({
            health_boxes: nextHealthBoxes,
            health: nextHealthBoxes.filter((box) => box !== "empty").length,
            conditions: nextConditions,
        });
    };
    const healthBoxes = normalizeHealthBoxes(getValue("health_boxes"), maxHealth, getValue("health") || 0);
    const filledHealth = healthBoxes.filter((state) => state !== "empty").length;
    const isDeadTrack = healthBoxes.length > 0 && healthBoxes.every((state) => state === "aggravated");
    const woundPenalty = filledHealth >= maxHealth
        ? -3
        : filledHealth >= maxHealth - 1
        ? -2
        : filledHealth >= maxHealth - 2
        ? -1
        : 0;

    const handleHealthBoxesChange = async (boxes) => {
        const normalized = normalizeHealthBoxes(boxes, maxHealth, 0);
        const filled = normalized.filter((state) => state !== "empty").length;
        handleChange("health_boxes", normalized);
        handleChange("health", filled);

        const isDead = normalized.length > 0 && normalized.every((state) => state === "aggravated");
        const currentConditions = getValue("conditions") || [];
        const hasDead = currentConditions.some((cond) => (cond?.name || "").toLowerCase() === "dead");

        const updates = {
            health_boxes: normalized,
            health: filled,
        };

        if (isDead && !hasDead) {
            updates.conditions = [
                ...currentConditions,
                {
                    name: "Dead",
                    type: "condition",
                    description: "All health boxes are filled with aggravated damage.",
                    origin: "Health Track",
                    resolution: "None",
                },
            ];
        }

        if (!isDead && hasDead) {
            updates.conditions = currentConditions.filter((cond) => (cond?.name || "").toLowerCase() !== "dead");
        }

        await onUpdateCharacter(updates);
        setPendingChanges((prev) => {
            const next = { ...prev };
            delete next.health_boxes;
            delete next.health;
            if (updates.conditions) {
                delete next.conditions;
            }
            return next;
        });
    };

    const handleHealthBoxClick = async (index, state) => {
        const counts = getHealthCounts(healthBoxes);
        const totalDamage = counts.aggravated + counts.lethal + counts.bashing;
        const fullTrack = totalDamage >= maxHealth;
        const leftmostDamageIndex = healthBoxes.findIndex((boxState) => boxState !== "empty");

        if (state === "empty") {
            if (fullTrack) return;
            counts.bashing += 1;
        } else if (state === "bashing") {
            if (fullTrack) {
                if (counts.bashing > 0) {
                    counts.bashing -= 1;
                    counts.lethal += 1;
                } else if (counts.lethal > 0) {
                    counts.lethal -= 1;
                    counts.aggravated += 1;
                }
            } else {
                if (counts.bashing > 0) {
                    counts.bashing -= 1;
                    counts.lethal += 1;
                }
                if (counts.aggravated + counts.lethal + counts.bashing < maxHealth) {
                    counts.bashing += 1;
                }
            }
        } else if (state === "lethal") {
            if (counts.lethal > 0) {
                counts.lethal -= 1;
                counts.aggravated += 1;
                if (counts.bashing > 0) {
                    counts.bashing -= 1;
                    counts.lethal += 1;
                }
                if (!fullTrack && counts.aggravated + counts.lethal + counts.bashing < maxHealth) {
                    counts.bashing += 1;
                }
            }
        } else if (state === "aggravated") {
            if (index === leftmostDamageIndex) {
                counts.aggravated = 0;
                counts.lethal = 0;
                counts.bashing = 0;
            } else if (counts.aggravated > 0) {
                counts.aggravated -= 1;
            }
        }

        const updatedBoxes = buildHealthBoxes(counts, maxHealth);
        await handleHealthBoxesChange(updatedBoxes);
    };

    const healHealthState = async (stateToHeal) => {
        const counts = getHealthCounts(healthBoxes);

        if (stateToHeal === "bashing" && counts.bashing > 0) {
            counts.bashing -= 1;
        }

        if (stateToHeal === "lethal" && counts.lethal > 0) {
            counts.lethal -= 1;
        }

        if (stateToHeal === "aggravated" && counts.aggravated > 0) {
            counts.aggravated -= 1;
        }

        const updatedBoxes = buildHealthBoxes(counts, maxHealth);
        await handleHealthBoxesChange(updatedBoxes);
    };

    // Mementos management
    const mementos = getValue("mementos") || [];
    const addMemento = () => {
        const newMementos = [...mementos, { id: Date.now(), name: "", key: "", description: "", effect: "" }];
        handleChange("mementos", newMementos);
    };
    const updateMemento = (index, data) => {
        const newMementos = [...mementos];
        newMementos[index] = { ...newMementos[index], ...data };
        handleChange("mementos", newMementos);
    };
    const deleteMemento = (index) => {
        const newMementos = mementos.filter((_, i) => i !== index);
        handleChange("mementos", newMementos);
    };

    // Merits management
    const meritsList = getValue("merits_list") || [];
    const sheetHasGiant = (meritsList || []).some((m) => (m?.name || "") === "Giant");
    const sheetHasSmallFramed = (meritsList || []).some((m) => (m?.name || "") === "Small-Framed");
    const effectiveSize = 5 + (sheetHasGiant ? 1 : 0) + (sheetHasSmallFramed ? -1 : 0);
    const sortedMeritsList = [...meritsList].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    const selectedMeritDef = MERIT_LIST.find((m) => m.name === newMeritName);
    const addMerit = () => {
        if (newMeritName) {
            const meritToAdd = {
                id: Date.now(),
                name: newMeritName,
                dots: newMeritDots,
                ...(selectedMeritDef?.hasSpecialty
                    ? { specialty: newMeritSpecialty.trim() }
                    : {}),
                ...(newMeritName === "Professional Training"
                    ? { assetSkills: ["__none__", "__none__", "__none__"] }
                    : {}),
            };

            let base = [...meritsList];

            // Prevent duplicates by name
            const selectedMeritDefForDuplicate = MERIT_LIST.find((m) => m.name === newMeritName);

            if (selectedMeritDefForDuplicate?.hasSpecialty) {
                const specialtyKey = newMeritSpecialty.trim().toLowerCase();
                if (!specialtyKey) {
                    toast.error("This Merit needs a label.");
                    return;
                }

                const alreadyHas = base.some(
                    (m) =>
                        (m?.name || "") === newMeritName &&
                        (m?.specialty || "").trim().toLowerCase() === specialtyKey
                );

                if (alreadyHas) {
                    toast.error("That Merit with the same label is already on the sheet.");
                    return;
                }
            } else {
                const alreadyHas = base.some((m) => (m?.name || "") === newMeritName);
                if (alreadyHas) {
                    toast.error("That Merit is already on the sheet.");
                    return;
                }
            }

            // Enforce mutual exclusion
            if (newMeritName === "Giant") {
                base = base.filter((m) => (m?.name || "") !== "Small-Framed");
            }
            if (newMeritName === "Small-Framed") {
                base = base.filter((m) => (m?.name || "") !== "Giant");
            }

            const newMerits = withProfessionalTrainingFreeContacts([...base, meritToAdd])
                .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
            
            handleChange("merits_list", newMerits);
            setNewMeritName("");
            setNewMeritDots(1);
            setNewMeritSpecialty("");
            setShowMeritDialog(false);
        }
    };

    useEffect(() => {
        if (!Array.isArray(meritsList) || meritsList.length === 0) return;

        const needsIds = meritsList.some((m) => !m?.id);
        if (!needsIds) return;

        const base = Date.now();
        const fixed = meritsList.map((m, i) => ({
            ...m,
            id: m?.id ?? (base + i),
        }));

        handleChange("merits_list", fixed);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meritsList]);

    const deleteMerit = (id) => {
        if (!id) return;

        const merit = meritsList.find((m) => (m?.id || null) === id);
        if (merit?.source === PROFESSIONAL_TRAINING_RULES.freeContactSource) {
            toast.error("Professional Training Contacts are granted by the Merit. Remove or lower Professional Training instead.");
            return;
        }

        const newMerits = withProfessionalTrainingFreeContacts(
            meritsList.filter((m) => (m?.id || null) !== id)
        );

        handleChange("merits_list", newMerits);
    };
    const updateMerit = (id, data) => {
        if (!id) return;

        const merit = meritsList.find((m) => (m?.id || null) === id);
        if (merit?.source === PROFESSIONAL_TRAINING_RULES.freeContactSource) {
            toast.error("Professional Training Contacts are granted by the Merit. Edit Professional Training instead.");
            return;
        }

        const newMerits = withProfessionalTrainingFreeContacts(
            meritsList.map((m) => {
                if ((m?.id || null) !== id) return m;
                return { ...m, ...data };
            })
        );

        handleChange("merits_list", newMerits);
    };

    // Ceremonies management
    const ceremoniesList = getValue("ceremonies_list") || [];
    const sortedCeremoniesList = [...ceremoniesList].sort((a, b) => (a.dots || 1) - (b.dots || 1) || (a.name || "").localeCompare(b.name || ""));
    const addCeremony = () => {
        if (newCeremonyName) {
            const ceremonyInfo = CEREMONY_LIST.find(c => c.name === newCeremonyName);
            const newCeremonies = [...ceremoniesList, { name: newCeremonyName, dots: ceremonyInfo?.dots || 1 }]
                .sort((a, b) => (a.dots || 1) - (b.dots || 1) || (a.name || "").localeCompare(b.name || ""));
            handleChange("ceremonies_list", newCeremonies);
            setNewCeremonyName("");
            setShowCeremonyDialog(false);
        }
    };
    const deleteCeremony = (index) => {
        const newCeremonies = ceremoniesList.filter((_, i) => i !== index);
        handleChange("ceremonies_list", newCeremonies);
    };

    // Specialties management
    const specialties = getValue("specialties") || [];
    const addSpecialty = () => {
        if (newSpecialty.trim()) {
            handleChange("specialties", [...specialties, newSpecialty.trim()]);
            setNewSpecialty("");
        }
    };
    const removeSpecialty = (index) => {
        handleChange("specialties", specialties.filter((_, i) => i !== index));
    };

    // Helper to get merit dot display text
    const getMeritDotDisplay = (merit) => {
        // Fixed merits: minDots === maxDots (show just "X dots")
        // Variable merits: minDots < maxDots (show "X to Y")
        // Legacy merits without minDots: treat as variable 1 to maxDots
        const min = merit.minDots || 1;
        const max = merit.maxDots || 5;
        if (min === max) {
            return `${max} dot${max > 1 ? 's' : ''}`;
        }
        return `${min} to ${max}`;
    };

    // Get selected merit's info
    const selectedMerit = MERIT_LIST.find(m => m.name === newMeritName);
    const minDotsForMerit = selectedMerit?.minDots || 1;
    const maxDotsForMerit = selectedMerit?.maxDots || 5;
    const isFixedDotMerit = minDotsForMerit === maxDotsForMerit;

    if (!activeCharacter) {
        return (
            <div className="p-6" data-testid="character-panel">
                <div className="text-center py-12">
                    <h3 className="font-heading text-xl text-zinc-400 mb-4">No Character</h3>
                    <Dialog open={showCharacterTypeDialog} onOpenChange={setShowCharacterTypeDialog}>
                        <DialogTrigger asChild>
                            <Button className="btn-primary" data-testid="create-first-character-btn">
                                <Plus className="w-4 h-4 mr-2" />Create Character
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800">
                            <DialogHeader>
                                <DialogTitle className="text-zinc-100 font-heading">Choose Character Type</DialogTitle>
                                <DialogDescription className="text-zinc-400">Select the type of character you want to create</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <Button 
                                    onClick={() => { onCreateCharacter("geist"); setShowCharacterTypeDialog(false); }}
                                    className="h-24 flex flex-col gap-2 bg-teal-900/30 border border-teal-500/50 hover:bg-teal-800/50"
                                    data-testid="create-geist-btn"
                                >
                                    <span className="text-lg font-heading text-teal-300">Sin-Eater</span>
                                    <span className="text-xs text-zinc-400">Geist: The Sin-Eaters</span>
                                </Button>
                                <Button 
                                    onClick={() => { onCreateCharacter("mage"); setShowCharacterTypeDialog(false); }}
                                    className="h-24 flex flex-col gap-2 bg-violet-900/30 border border-violet-500/50 hover:bg-violet-800/50"
                                    data-testid="create-mage-btn"
                                >
                                    <span className="text-lg font-heading text-violet-300">Mage</span>
                                    <span className="text-xs text-zinc-400">Mage: The Awakening</span>
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }

    // Determine character type
    const characterType = activeCharacter.character_type || "geist";
    const isMage = characterType === "mage";

    // Mage Armor bonuses for Defense and Armor stats
    const activeMageArmorName = isMage ? (getValue("active_mage_armor") || null) : null;
    const activeMageArmorDots = activeMageArmorName ? (getNestedValue("arcana", activeMageArmorName) || 0) : 0;

    const mageArmorDefenseBonus = (() => {
        if (!activeMageArmorName) return 0;
        if (["Fate", "Mind", "Space", "Time"].includes(activeMageArmorName)) return activeMageArmorDots;
        if (activeMageArmorName === "Life") return Math.ceil(activeMageArmorDots / 2);
        return 0;
    })();

    const mageArmorGeneralBonus = (() => {
        if (!activeMageArmorName) return 0;
        if (["Forces", "Matter"].includes(activeMageArmorName)) return activeMageArmorDots;
        if (activeMageArmorName === "Life") return Math.ceil(activeMageArmorDots / 2);
        return 0;
    })();

    return (
        <div className="h-full flex flex-col" data-testid="character-panel">
            {/* Header */}
            <div className="p-3 border-b border-zinc-800/50">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-heading text-lg text-zinc-200">Character Sheet</h2>
                    {hasPendingChanges && (
                        <Button size="sm" onClick={saveChanges} className="btn-primary text-xs h-7" data-testid="save-character-btn">
                            <Save className="w-3 h-3 mr-1" />Save
                        </Button>
                    )}
                </div>
                
                <div className="flex gap-2 items-center flex-wrap">
                    {/* Character Type Badge */}
                    <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded ${
                        isMage 
                            ? "bg-violet-900/50 text-violet-300 border border-violet-500/30" 
                            : "bg-teal-900/50 text-teal-300 border border-teal-500/30"
                    }`} data-testid="character-type-badge">
                        {isMage ? "Mage" : "Sin-Eater"}
                    </span>
                    
                    <Select value={activeCharacter.id} onValueChange={(id) => {
                        const char = characters.find(c => c.id === id);
                        if (char) onSelectCharacter(char);
                    }}>
                        <SelectTrigger className="flex-1 min-w-[180px] bg-zinc-900/50 border-zinc-800 h-8 text-sm" data-testid="character-select">
                            <SelectValue placeholder="Select character" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {characters.map((char) => (
                                <SelectItem key={char.id} value={char.id} className="text-zinc-200">
                                    {char.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <input
                        ref={importFileInputRef}
                        type="file"
                        accept="application/json,.json"
                        className="hidden"
                        onChange={handleImportCharacterFile}
                    />

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-zinc-700 bg-zinc-900/40 text-zinc-200"
                        onClick={exportCharacterToJson}
                        data-testid="export-character-json-button"
                    >
                        <Download className="w-3 h-3 mr-1" /> JSON
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-zinc-700 bg-zinc-900/40 text-zinc-200"
                        onClick={exportCharacterToPdf}
                        data-testid="export-character-pdf-button"
                    >
                        <Download className="w-3 h-3 mr-1" /> PDF
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-zinc-700 bg-zinc-900/40 text-zinc-200"
                        onClick={triggerImportCharacter}
                        data-testid="import-character-button"
                    >
                        <Upload className="w-3 h-3 mr-1" /> Import
                    </Button>
                    
                    {/* Add Character Dialog */}
                    <Dialog open={showAddCharacterDialog} onOpenChange={setShowAddCharacterDialog}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-teal-400" data-testid="add-character-button"><Plus className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800">
                            <DialogHeader>
                                <DialogTitle className="text-zinc-100 font-heading">Choose Character Type</DialogTitle>
                                <DialogDescription className="text-zinc-400">Select the type of character you want to create</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <Button 
                                    onClick={() => { onCreateCharacter("geist"); setShowAddCharacterDialog(false); }}
                                    className="h-24 flex flex-col gap-2 bg-teal-900/30 border border-teal-500/50 hover:bg-teal-800/50"
                                    data-testid="create-geist-btn-dialog"
                                >
                                    <span className="text-lg font-heading text-teal-300">Sin-Eater</span>
                                    <span className="text-xs text-zinc-400">Geist: The Sin-Eaters</span>
                                </Button>
                                <Button 
                                    onClick={() => { onCreateCharacter("mage"); setShowAddCharacterDialog(false); }}
                                    className="h-24 flex flex-col gap-2 bg-violet-900/30 border border-violet-500/50 hover:bg-violet-800/50"
                                    data-testid="create-mage-btn-dialog"
                                >
                                    <span className="text-lg font-heading text-violet-300">Mage</span>
                                    <span className="text-xs text-zinc-400">Mage: The Awakening</span>
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-400" data-testid="delete-character-button"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-zinc-100">Delete Character?</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">This will permanently delete {activeCharacter.name}.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-200">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteCharacter(activeCharacter.id)} className="bg-red-900/50 border border-red-500/50 text-red-200">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-3 space-y-3">
                    {isMage && isCreationMode && (
                        <CharacterCreationAuditPanel
                            character={{ ...(activeCharacter || {}), ...pendingChanges }}
                            getValue={getValue}
                            handleChange={handleChange}
                            onLockCharacter={lockMageCharacter}
                        />
                    )}

                    {isMage && isAdvancementLocked && (
                        <div className="p-2 bg-zinc-900/40 border border-zinc-800 rounded-sm flex items-center justify-between gap-3" data-testid="mage-advancement-status">
                            <div>
                                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Active Character</div>
                                <div className="text-[10px] text-zinc-500">Permanent increases are recorded as XP purchases.</div>
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400 text-right">
                                XP {getValue("experience") || 0} / Arcane XP {getValue("arcane_experience") || 0}
                            </div>
                        </div>
                    )}

                    {/* Dice Roller */}
                    {false && (
                        <InlineDiceRoller
                            getValue={getValue}
                            getNestedValue={getNestedValue}
                            availableKeys={allAvailableKeys}
                            doomedKeys={doomedKeys}
                            onSpendWillpower={spendWillpower}
                            onAwardBeat={awardBeat}
                            onSpendPlasm={spendPlasm}
                            onAddCondition={addConditionFromDiceRoller}
                            onDiceRollResult={onDiceRollResult}
                            geistRank={geistRank}
                            woundPenalty={woundPenalty}
                            currentPlasm={getValue("plasm") || 0}
                        />
                    )}    

                    {/* Character Header Info */}
                    <Collapsible open={expandedSections.header}>
                        <CollapsibleTrigger onClick={() => toggleSection("header")} className="flex items-center justify-between w-full p-2 rounded-sm bg-teal-900/20 border border-teal-800 hover:bg-teal-800/30" data-testid="section-toggle-character-info">
                            <span className="text-xs font-mono uppercase tracking-wider text-teal-400">Character Info</span>
                            {expandedSections.header ? <ChevronDown className="w-4 h-4 text-teal-500" /> : <ChevronRight className="w-4 h-4 text-teal-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Name</label>
                                    <Input value={getValue("name") || ""} onChange={(e) => handleChange("name", e.target.value)} className="input-geist h-8 text-sm mt-0.5" data-testid="character-name-input" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Concept</label>
                                    <Input value={getValue("concept") || ""} onChange={(e) => handleChange("concept", e.target.value)} className="input-geist h-8 text-sm mt-0.5" placeholder="e.g., Haunted Detective" data-testid="character-concept-input" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                        {isMage ? "Path" : "Burden"}
                                    </label>
                                    {isMage ? (
                                        <Select value={getValue("path") || ""} onValueChange={handlePathChange}>
                                            <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm mt-0.5" data-testid="character-path-select"><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                {MAGE_PATHS.map((p) => (<SelectItem key={p} value={p} className="text-zinc-200">{p}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Select value={getValue("burden") || ""} onValueChange={(v) => handleChange("burden", v)}>
                                            <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm mt-0.5" data-testid="character-burden-select"><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                {BURDENS.map((b) => (<SelectItem key={b} value={b} className="text-zinc-200">{b}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                        {isMage ? "Order" : "Character's Innate Key"}
                                    </label>
                                    {isMage ? (
                                        <Select value={getValue("order") || ""} onValueChange={handleOrderChange}>
                                            <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm mt-0.5" data-testid="character-order-select"><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                {MAGE_ORDERS.map((o) => (<SelectItem key={o} value={o} className="text-zinc-200">{o}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Select value={getValue("innate_key") || ""} onValueChange={(v) => handleChange("innate_key", v)}>
                                            <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm mt-0.5" data-testid="character-innate-key-select"><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                {KEYS.map((k) => (<SelectItem key={k} value={k} className="text-zinc-200">{k}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Virtue</label>
                                    <Input value={getValue("virtue") || ""} onChange={(e) => handleChange("virtue", e.target.value)} className="input-geist h-8 text-sm mt-0.5" placeholder="e.g., Charitable, Honest" data-testid="character-virtue-input" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Vice</label>
                                    <Input value={getValue("vice") || ""} onChange={(e) => handleChange("vice", e.target.value)} className="input-geist h-8 text-sm mt-0.5" placeholder="e.g., Greedy, Violent" data-testid="character-vice-input" />
                                </div>
                            </div>

                            {/* Aspirations */}
                            <div className="mb-4">
                                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">
                                    Aspirations
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                                                onClick={() => fulfillAspiration("aspiration_short_1")}
                                                data-testid="aspiration-short-1-fulfilled"
                                            >
                                                SHORT-TERM
                                            </Button>
                                            <Input
                                                value={getValue("aspiration_short_1") || ""}
                                                onChange={(e) => handleChange("aspiration_short_1", e.target.value)}
                                                className="h-7 input-geist text-xs flex-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                                                onClick={() => fulfillAspiration("aspiration_short_2")}
                                                data-testid="aspiration-short-1-fulfilled"
                                            >
                                                SHORT-TERM
                                            </Button>
                                            <Input
                                                value={getValue("aspiration_short_2") || ""}
                                                onChange={(e) => handleChange("aspiration_short_2", e.target.value)}
                                                className="h-7 input-geist text-xs flex-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                                                onClick={() => fulfillAspiration("aspiration_long")}
                                                data-testid="aspiration-long-progressed"
                                            >
                                                LONG-TERM
                                            </Button>
                                            <Input
                                                value={getValue("aspiration_long") || ""}
                                                onChange={(e) => handleChange("aspiration_long", e.target.value)}
                                                className="h-7 input-geist text-xs flex-1"
                                            />
                                        </div>
                                    </div>

                                    {isMage ? (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-violet-400 uppercase tracking-wider">Obsessions</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 text-[10px] text-violet-400 hover:text-violet-300"
                                                    onClick={addObsession}
                                                    data-testid="add-obsession-btn"
                                                >
                                                    <Plus className="w-3 h-3 mr-1" /> Add
                                                </Button>
                                            </div>
                                            {getObsessions().map((obsession, index) => (
                                                <div key={index} className="flex items-center gap-2 mt-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-[10px] text-zinc-400 hover:text-violet-300"
                                                        onClick={() => fulfillObsession(index)}
                                                        data-testid={`obsession-${index}-progressed`}
                                                    >
                                                        OBSESSION {index + 1}
                                                    </Button>
                                                    <Input
                                                        value={obsession || ""}
                                                        onChange={(e) => updateObsession(index, e.target.value)}
                                                        className="h-7 input-geist text-xs flex-1"
                                                        placeholder="Mage Obsession"
                                                        data-testid={`obsession-${index}-input`}
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 text-zinc-500 hover:text-red-400"
                                                        onClick={() => removeObsession(index)}
                                                        disabled={getObsessions().length <= 1}
                                                        data-testid={`obsession-${index}-remove`}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                                                    onClick={() => fulfillAspiration("aspiration_burden")}
                                                    data-testid="aspiration-burden-progressed"
                                                >
                                                    BURDEN
                                                </Button>
                                                <Input
                                                    value={getValue("aspiration_burden") || ""}
                                                    onChange={(e) => handleChange("aspiration_burden", e.target.value)}
                                                    className="h-7 input-geist text-xs flex-1"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Beats & Experience */}
                            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[10px] text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                        <Star className="w-3 h-3" /> Beats & Experience
                                    </label>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-zinc-400">Beats</span>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                                    onClick={removeBeat}
                                                    disabled={(getValue("beats") || 0) <= 0}
                                                    data-testid="beats-minus"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>

                                                <span className="font-mono text-amber-300">{getValue("beats") || 0}/5</span>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                                    onClick={awardBeat}
                                                    data-testid="beats-plus"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`w-4 h-4 rounded-full border transition-all ${
                                                        i < (getValue("beats") || 0)
                                                            ? "bg-amber-500/50 border-amber-500"
                                                            : "bg-zinc-900 border-zinc-700"
                                                    }`}
                                                    data-testid={`beat-${i}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-zinc-400">Experience</span>
                                            <span className="font-mono text-teal-300">{getValue("experience") || 0}</span>
                                        </div>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={getValue("experience") || 0}
                                            onChange={(e) => handleChange("experience", Math.max(0, parseInt(e.target.value) || 0))}
                                            className="h-6 w-16 text-center input-geist text-xs"
                                            data-testid="experience-input-header"
                                        />
                                    </div>
                                </div>
                                {isMage && (
                                    <div className="mt-3 pt-3 border-t border-amber-900/40 flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-zinc-400">Arcane Beats</span>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                                        onClick={removeArcaneBeat}
                                                        disabled={(getValue("arcane_beats") || 0) <= 0}
                                                        data-testid="arcane-beats-minus"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <span className="font-mono text-violet-300">{getValue("arcane_beats") || 0}/5</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                                        onClick={awardArcaneBeat}
                                                        data-testid="arcane-beats-plus"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-4 h-4 rounded-full border transition-all ${
                                                            i < (getValue("arcane_beats") || 0)
                                                                ? "bg-violet-500/50 border-violet-500"
                                                                : "bg-zinc-900 border-zinc-700"
                                                        }`}
                                                        data-testid={`arcane-beat-${i}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-zinc-400">Arcane XP</span>
                                                <span className="font-mono text-violet-300">{getValue("arcane_experience") || 0}</span>
                                            </div>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={getValue("arcane_experience") || 0}
                                                onChange={(e) => handleChange("arcane_experience", Math.max(0, parseInt(e.target.value) || 0))}
                                                className="h-6 w-16 text-center input-geist text-xs"
                                                data-testid="arcane-experience-input-header"
                                            />
                                        </div>
                                    </div>
                                )}
                                <p className="text-[10px] text-zinc-600 mt-2 italic">5 Beats = 1 Experience. 5 Arcane Beats = 1 Arcane Experience.</p>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Geist & Remembrance - Sin-Eaters only */}
                    {!isMage && (
                    <Collapsible open={expandedSections.geist}>
                        <CollapsibleTrigger onClick={() => toggleSection("geist")} className="flex items-center justify-between w-full p-2 rounded-sm bg-cyan-900/20 border border-cyan-800 hover:bg-cyan-800/30" data-testid="section-toggle-geist">
                            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Geist & Remembrance</span>
                            {expandedSections.geist ? <ChevronDown className="w-4 h-4 text-cyan-500" /> : <ChevronRight className="w-4 h-4 text-cyan-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-2">
                            <GeistRemembranceContent
                                getValue={getValue} handleChange={handleChange}
                                geistRank={geistRank} currentSynergy={currentSynergy} synergyData={synergyData}
                            />
                        </CollapsibleContent>
                    </Collapsible>
                    )}

                    {/* Attributes & Skills */}
                    <Collapsible open={expandedSections.attributesSkills}>
                        <CollapsibleTrigger onClick={() => toggleSection("attributesSkills")} className="flex items-center justify-between w-full p-2 rounded-sm bg-sky-900/20 border border-sky-800 hover:bg-sky-800/30" data-testid="section-toggle-attributes-skills">
                            <span className="text-xs font-mono uppercase tracking-wider text-sky-400">Attributes &amp; Skills</span>
                            {expandedSections.attributesSkills ? <ChevronDown className="w-4 h-4 text-sky-500" /> : <ChevronRight className="w-4 h-4 text-sky-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-3">
                            {/* Attributes */}
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 text-center">Mental</p>
                                    {["intelligence", "wits", "resolve"].map((attr) => (
                                        <StatRow key={attr} label={attr} value={getNestedValue("attributes", attr)} max={5} onChange={(v) => handleNestedChange("attributes", attr, v)} color="zinc" onLabelClick={() => openDicePopup('attribute', attr)} />
                                    ))}
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 text-center">Physical</p>
                                    {["strength", "dexterity", "stamina"].map((attr) => {
                                        const scoured = getValue("scoured_attributes") || {};
                                        const scouredCount = scoured[attr] || 0;
                                        const isScoured = scouredCount > 0;
                                        const restoreScouredDot = () => {
                                            const newScoured = { ...scoured, [attr]: scouredCount - 1 };
                                            if (newScoured[attr] <= 0) delete newScoured[attr];
                                            const currentVal = getNestedValue("attributes", attr) || 0;
                                            const attributes = getValue("attributes") || {};

                                            commitCharacterUpdate({
                                                scoured_attributes: newScoured,
                                                attributes: {
                                                    ...attributes,
                                                    [attr]: currentVal + 1,
                                                },
                                            });
                                        };

                                        return (
                                            <StatRow
                                                key={attr}
                                                label={attr}
                                                value={getNestedValue("attributes", attr)}
                                                max={5}
                                                onChange={(v) => handleNestedChange("attributes", attr, v)}
                                                color={isScoured ? "red" : "zinc"}
                                                onLabelClick={() => openDicePopup('attribute', attr)}
                                                scoured={scouredCount}
                                                onRestoreScoured={restoreScouredDot}
                                            />
                                        );
                                    })}
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 text-center">Social</p>
                                    {["presence", "manipulation", "composure"].map((attr) => (
                                        <StatRow key={attr} label={attr} value={getNestedValue("attributes", attr)} max={5} onChange={(v) => handleNestedChange("attributes", attr, v)} color="zinc" onLabelClick={() => openDicePopup('attribute', attr)} />
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-zinc-800/60" />

                            {/* Skills */}
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 text-center">Mental <span className="text-rose-400">(-3)</span></p>
                                    {["academics", "computer", "crafts", "investigation", "medicine", "occult", "politics", "science"].map((skill) => {
                                        const currentOrder = isMage ? getValue("order") : null;
                                        const isRoteSkill = currentOrder && ORDER_ROTE_SKILLS[currentOrder]?.includes(skill);
                                        return (
                                            <div key={skill}>
                                                <StatRow label={skill} value={getNestedValue("skills", skill)} max={5} onChange={(v) => handleNestedChange("skills", skill, v)} color={isRoteSkill ? "amber" : "zinc"} onLabelClick={() => openDicePopup('skill', skill)} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 text-center">Physical <span className="text-amber-400">(-1)</span></p>
                                    {["athletics", "brawl", "drive", "firearms", "larceny", "stealth", "survival", "weaponry"].map((skill) => {
                                        const currentOrder = isMage ? getValue("order") : null;
                                        const isRoteSkill = currentOrder && ORDER_ROTE_SKILLS[currentOrder]?.includes(skill);
                                        return (
                                            <div key={skill}>
                                                <StatRow label={skill} value={getNestedValue("skills", skill)} max={5} onChange={(v) => handleNestedChange("skills", skill, v)} color={isRoteSkill ? "amber" : "zinc"} onLabelClick={() => openDicePopup('skill', skill)} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 text-center">Social <span className="text-amber-400">(-1)</span></p>
                                    {["animal_ken", "empathy", "expression", "intimidation", "persuasion", "socialize", "streetwise", "subterfuge"].map((skill) => {
                                        const currentOrder = isMage ? getValue("order") : null;
                                        const isRoteSkill = currentOrder && ORDER_ROTE_SKILLS[currentOrder]?.includes(skill);
                                        return (
                                            <div key={skill}>
                                                <StatRow label={skill} value={getNestedValue("skills", skill)} max={5} onChange={(v) => handleNestedChange("skills", skill, v)} color={isRoteSkill ? "amber" : "zinc"} onLabelClick={() => openDicePopup('skill', skill)} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="p-2 bg-zinc-900/50 border border-zinc-800 rounded-sm">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Skill Specialties</label>
                                <div className="flex flex-wrap gap-1 mt-1" data-testid="skill-specialties-list">
                                    {specialties.map((spec, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-teal-900/30 border border-teal-500/30 rounded text-[10px] text-teal-300" data-testid={`skill-specialty-${i}`}>
                                            {spec}
                                            <button onClick={() => removeSpecialty(i)} className="hover:text-red-400" data-testid={`skill-specialty-remove-${i}`}><X className="w-2 h-2" /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-1 mt-1">
                                    <Input value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} placeholder="e.g., Occult (Ghosts)" className="input-geist h-6 text-[10px] flex-1" onKeyDown={(e) => e.key === "Enter" && addSpecialty()} data-testid="skill-specialty-input" />
                                    <Button size="sm" onClick={addSpecialty} className="h-6 px-2 text-[10px] btn-secondary" data-testid="skill-specialty-add">Add</Button>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Synergy & Resources (Geist) / Gnosis & Resources (Mage) */}
                    <Collapsible open={expandedSections.sinEater}>
                        <CollapsibleTrigger onClick={() => toggleSection("sinEater")} className="flex items-center justify-between w-full p-2 rounded-sm bg-purple-900/20 border border-purple-500/30 hover:bg-purple-900/30" data-testid="section-toggle-synergy-resources">
                            <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
                                {isMage ? "Gnosis & Resources" : "Synergy & Resources"}
                            </span>
                            {expandedSections.sinEater ? <ChevronDown className="w-4 h-4 text-purple-500" /> : <ChevronRight className="w-4 h-4 text-purple-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-3">
                            {isMage ? (
                                <MageGnosisContent
                                    getValue={getValue} handleChange={handleChange} getNestedValue={getNestedValue} handleNestedChange={handleNestedChange}
                                    onCommitCharacterUpdate={commitCharacterUpdate}
                                    healthBoxes={healthBoxes} maxHealth={maxHealth} filledHealth={filledHealth} isDeadTrack={isDeadTrack} woundPenalty={woundPenalty}
                                    handleHealthBoxClick={handleHealthBoxClick} handleHealthBoxesChange={handleHealthBoxesChange}
                                    calculateWillpowerMax={calculateWillpowerMax}
                                    onRebuyWillpowerDot={rebuyWillpowerDot}
                                    onTriggerDiceRoll={onTriggerDiceRoll}
                                    onAdvanceTime={onAdvanceTime}
                                />
                            ) : (
                                <GeistSynergyContent
                                    getValue={getValue} handleChange={handleChange}
                                    currentSynergy={currentSynergy} synergyData={synergyData}
                                    calculateWillpowerMax={calculateWillpowerMax}
                                />
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible open={expandedSections.inventory}>
                        <CollapsibleTrigger
                            onClick={() => toggleSection("inventory")}
                            className="flex items-center justify-between w-full p-2 rounded-sm bg-orange-900/20 border border-orange-800 hover:bg-orange-800/30"
                            data-testid="section-toggle-inventory"
                        >
                            <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Inventory</span>
                            {expandedSections.inventory ? (
                                <ChevronDown className="w-4 h-4 text-orange-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-orange-500" />
                            )}
                        </CollapsibleTrigger>

                        <CollapsibleContent className="pt-2">
                            <CombatContent
                                getValue={getValue} getNestedValue={getNestedValue} handleChange={handleChange}
                                isMage={isMage}
                                meritsList={meritsList}
                                calculateDefense={calculateDefense} calculateInitiative={calculateInitiative} calculateSpeed={calculateSpeed}
                                mageArmorDefenseBonus={mageArmorDefenseBonus} mageArmorGeneralBonus={mageArmorGeneralBonus}
                                equippedArmorGeneral={equippedArmorGeneral} equippedArmorBallistic={equippedArmorBallistic}
                                inventoryItems={inventoryItems} updateInventoryItem={updateInventoryItem} updateInventoryItemNested={updateInventoryItemNested} removeInventoryItem={removeInventoryItem} addInventoryItem={addInventoryItem}
                                inventoryAddOpen={inventoryAddOpen} setInventoryAddOpen={setInventoryAddOpen}
                                editingInventoryIndex={editingInventoryIndex} setEditingInventoryIndex={setEditingInventoryIndex}
                                invType={invType} setInvType={setInvType} invPremade={invPremade} setInvPremade={setInvPremade} invDraft={invDraft} setInvDraft={setInvDraft}
                                healthBoxes={healthBoxes}
                                maxHealth={maxHealth}
                                filledHealth={filledHealth}
                                isDeadTrack={isDeadTrack}
                                woundPenalty={woundPenalty}
                                handleHealthBoxClick={handleHealthBoxClick}
                                handleHealthBoxesChange={handleHealthBoxesChange}
                                onHealHealthState={healHealthState}
                                showCombat={false}
                                showMageArmor={false}
                                showInventory={true}
                            />
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Powers - Different for Mage vs Geist */}
                    <Collapsible open={expandedSections.powers}>
                        <CollapsibleTrigger onClick={() => toggleSection("powers")} className="flex items-center justify-between w-full p-2 rounded-sm bg-purple-900/20 border border-purple-500/30 hover:bg-purple-900/30" data-testid="section-toggle-powers">
                            <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
                                {isMage ? "Arcana, Spells & Attainments" : "Haunts, Keys & Mementos"}
                            </span>
                            {expandedSections.powers ? <ChevronDown className="w-4 h-4 text-purple-500" /> : <ChevronRight className="w-4 h-4 text-purple-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-3">
                            {isMage ? (
                                <MageArcanaContent
                                    getValue={getValue}
                                    getNestedValue={getNestedValue}
                                    handleChange={handleChange}
                                    handleNestedChange={handleNestedChange}
                                    openSpellcastingPopup={openSpellcastingPopup}
                                    onTriggerDiceRoll={onTriggerDiceRoll}
                                    onActivateMageEffect={activateMageEffect}
                                />
                            ) : (
                                <GeistHauntsContent
                                    getValue={getValue} getNestedValue={getNestedValue}
                                    handleNestedChange={handleNestedChange} handleChange={handleChange}
                                    openHauntRollPopup={openHauntRollPopup}
                                    allAvailableKeys={allAvailableKeys} doomedKeys={doomedKeys} doomedKeySources={doomedKeySources}
                                    mementos={mementos} addMemento={addMemento} updateMemento={updateMemento} deleteMemento={deleteMemento}
                                />
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Merits (different title for Mage vs Geist) */}
                    <Collapsible open={expandedSections.merits}>
                        <CollapsibleTrigger onClick={() => toggleSection("merits")} className="flex items-center justify-between w-full p-2 rounded-sm bg-purple-900/20 border border-purple-500/30 hover:bg-purple-900/30" data-testid="section-toggle-merits">
                            <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
                                {isMage ? "Merits" : "Merits & Ceremonies"}
                            </span>
                            {expandedSections.merits ? <ChevronDown className="w-4 h-4 text-purple-500" /> : <ChevronRight className="w-4 h-4 text-purple-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-2">
                            <MeritsContent
                                isMage={isMage}
                                meritsList={meritsList} sortedMeritsList={sortedMeritsList} deleteMerit={deleteMerit} updateMerit={updateMerit}
                                showMeritDialog={showMeritDialog} setShowMeritDialog={setShowMeritDialog}
                                newMeritName={newMeritName} setNewMeritName={setNewMeritName} newMeritDots={newMeritDots} setNewMeritDots={setNewMeritDots} newMeritSpecialty={newMeritSpecialty} setNewMeritSpecialty={setNewMeritSpecialty}
                                addMerit={addMerit} openDicePopup={openDicePopup}
                                selectedMerit={selectedMerit} minDotsForMerit={minDotsForMerit} maxDotsForMerit={maxDotsForMerit} isFixedDotMerit={isFixedDotMerit} getMeritDotDisplay={getMeritDotDisplay}
                                ceremoniesList={ceremoniesList} sortedCeremoniesList={sortedCeremoniesList}
                                showCeremonyDialog={showCeremonyDialog} setShowCeremonyDialog={setShowCeremonyDialog}
                                newCeremonyName={newCeremonyName} setNewCeremonyName={setNewCeremonyName}
                                addCeremony={addCeremony} deleteCeremony={deleteCeremony} rollCeremonyFromCharacter={rollCeremonyFromCharacter}
                            />
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Notes / XP Expenditure */}
                    <Collapsible
                        open={expandedSections.notes}
                        onOpenChange={() => toggleSection("notes")}
                    >
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-2 bg-zinc-900/40 border border-zinc-800 rounded-sm">
                                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                                    {isMage ? "XP Expenditure" : "Notes"}
                                </span>
                                {expandedSections.notes ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                            </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-2">
                            {isMage ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Available</div>
                                            <div className="font-mono text-xs text-emerald-300 mt-1">
                                                XP {getValue("experience") || 0} / Arcane {getValue("arcane_experience") || 0}
                                            </div>
                                        </div>
                                        <div className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Spent</div>
                                            <div className="font-mono text-xs text-amber-300 mt-1">
                                                XP {getValue("spent_experience") || 0} / Arcane {getValue("spent_arcane_experience") || 0}
                                            </div>
                                        </div>
                                    </div>

                                    {getAdvancementLedger().length === 0 ? (
                                        <div className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-sm text-xs text-zinc-500">
                                            No XP expenditure recorded yet. Trait increases after locking character creation will appear here.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {getAdvancementLedger().slice().reverse().map((entry, index) => (
                                                <div
                                                    key={entry.id || `${entry.trait_type}-${entry.trait_key}-${index}`}
                                                    className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm"
                                                    data-testid="xp-expenditure-entry"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="text-xs text-zinc-200 truncate">
                                                                {entry.label || formatLabel(entry.trait_key || entry.trait_type || "Purchase")}
                                                                {formatLedgerChange(entry) && (
                                                                    <span className="ml-2 font-mono text-zinc-500">{formatLedgerChange(entry)}</span>
                                                                )}
                                                            </div>
                                                            <div className="mt-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                                                                {formatLedgerDate(entry.date)} · {formatLabel(entry.trait_type || "purchase")}
                                                            </div>
                                                        </div>
                                                        <div className="shrink-0 text-xs font-mono text-emerald-300">
                                                            {formatLedgerCost(entry)}
                                                        </div>
                                                    </div>
                                                    {entry.note && (
                                                        <div className="mt-2 text-xs text-zinc-400 whitespace-pre-wrap border-t border-zinc-800 pt-2">
                                                            {entry.note}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Textarea
                                    value={getValue("notes") || ""}
                                    onChange={(e) => handleChange("notes", e.target.value)}
                                    className="bg-zinc-900 border-zinc-700 text-zinc-200"
                                    rows={6}
                                />
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </ScrollArea>
            
            {/* Dice Roll Popup for Haunts */}
            <DiceRollPopup
                isOpen={dicePopupOpen}
                onClose={() => setDicePopupOpen(false)}
                rollType="haunt"
                initialHaunt={dicePopupHaunt}
                character={{
                    attributes: { ...activeCharacter?.attributes, ...(pendingChanges.attributes || {}) },
                    skills: { ...activeCharacter?.skills, ...(pendingChanges.skills || {}) },
                    haunts: { ...activeCharacter?.haunts, ...(pendingChanges.haunts || {}) },
                    conditions: activeCharacter?.conditions || [],
                    innate_key: getValue("innate_key") || activeCharacter?.innate_key,
                    geist_innate_key: getValue("geist_innate_key") || activeCharacter?.geist_innate_key,
                    mementos: getValue("mementos") || activeCharacter?.mementos || [],
                    synergy: getValue("synergy") || 7,
                    willpower: getValue("willpower") || 0,
                    plasm: getValue("plasm") || 0,
                    geist_rank: getValue("geist_rank") || 1,
                }}
                availableKeys={allAvailableKeys}
                doomedKeys={doomedKeys}
                onSpendWillpower={spendWillpower}
                onSpendPlasm={spendPlasm}
                onAddCondition={addConditionFromDiceRoller}
                onAwardBeat={awardBeat}
                onDiceRollResult={onDiceRollResult}
                onAddRecentRoll={onAddRecentRoll}
                hauntEnhancements={HAUNT_ENHANCEMENTS}
            />

            <Dialog open={genericDicePopupOpen} onOpenChange={setGenericDicePopupOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-amber-300 font-heading">
                            <Dices className="w-5 h-5" />
                            Dice Roller
                        </DialogTitle>
                    </DialogHeader>
                    <InlineDiceRoller
                        getValue={getValue}
                        getNestedValue={getNestedValue}
                        availableKeys={allAvailableKeys}
                        doomedKeys={doomedKeys}
                        onSpendWillpower={spendWillpower}
                        onAwardBeat={awardBeat}
                        onSpendPlasm={spendPlasm}
                        onAddCondition={addConditionFromDiceRoller}
                        onDiceRollResult={onDiceRollResult}
                        onAddRecentRoll={onAddRecentRoll}
                        geistRank={getValue("geist_rank") || 1}
                        woundPenalty={getValue("wound_penalty") || 0}
                        currentPlasm={getValue("plasm") || 0}
                        preset={dicePopupPreset}
                        forceExpanded={true}
                        isMage={isMage}
                    />
                </DialogContent>
            </Dialog>

            {/* Mage XP Purchase Popup */}
            <Dialog open={xpPurchaseOpen} onOpenChange={setXpPurchaseOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-emerald-300">Record XP Purchase</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            {pendingPurchase?.label || "Permanent trait increase"}
                        </DialogDescription>
                    </DialogHeader>

                    {pendingPurchase && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Cost</div>
                                    <div className="font-mono text-zinc-200 mt-1">
                                        XP {Math.max(0, (pendingPurchase.cost?.experience || 0) - arcaneXpApplied)}
                                        {((pendingPurchase.cost?.arcane_experience || 0) + arcaneXpApplied) > 0 && (
                                            <span> / Arcane XP {(pendingPurchase.cost?.arcane_experience || 0) + arcaneXpApplied}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Available</div>
                                    <div className="font-mono text-zinc-200 mt-1">
                                        XP {getValue("experience") || 0} / Arcane {getValue("arcane_experience") || 0}
                                    </div>
                                </div>
                            </div>

                            {pendingPurchase.maxArcaneApplied > 0 && (
                                <div className="p-2 bg-violet-950/20 border border-violet-800/40 rounded-sm space-y-2">
                                    <div className="text-[10px] text-violet-300 uppercase tracking-wider">Apply Arcane XP to flexible cost</div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 w-7 p-0 bg-zinc-900 border-zinc-700 text-zinc-300"
                                            onClick={() => setArcaneXpApplied(Math.max(0, arcaneXpApplied - 1))}
                                            disabled={arcaneXpApplied <= 0}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="text-xs font-mono text-violet-300 w-10 text-center">{arcaneXpApplied}</span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 w-7 p-0 bg-zinc-900 border-zinc-700 text-zinc-300"
                                            onClick={() => setArcaneXpApplied(Math.min(pendingPurchase.maxArcaneApplied, arcaneXpApplied + 1))}
                                            disabled={arcaneXpApplied >= pendingPurchase.maxArcaneApplied}
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                        <span className="text-[10px] text-zinc-500">max {pendingPurchase.maxArcaneApplied}</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Ledger note</label>
                                <Textarea
                                    value={xpPurchaseNote}
                                    onChange={(e) => setXpPurchaseNote(e.target.value)}
                                    className="mt-1 bg-zinc-950 border-zinc-800 text-zinc-200 text-xs min-h-[70px]"
                                    placeholder="Optional reason, teacher, chapter, or approval note..."
                                    data-testid="xp-purchase-note-input"
                                />
                            </div>

                            <div className="flex gap-2 pt-1">
                                <Button
                                    variant="outline"
                                    className="flex-1 bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                    onClick={() => { setXpPurchaseOpen(false); setPendingPurchase(null); setArcaneXpApplied(0); setXpPurchaseNote(""); }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white"
                                    onClick={confirmAdvancementPurchase}
                                    disabled={!canAffordMagePurchase(activeCharacter || {}, pendingPurchase.cost || {}, arcaneXpApplied)}
                                    data-testid="confirm-xp-purchase-btn"
                                >
                                    Record Purchase
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Ceremony Roll Popup */}
            <Dialog open={ceremonyPopupOpen} onOpenChange={setCeremonyPopupOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-fuchsia-300">
                            {ceremonyPopupData?.name}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Roll {ceremonyPopupData?.dicePoolText} 
                            (computed pool: {ceremonyPopupData?.computedPool})
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        {!ceremonyPopupData?.result ? (
                            <p className="text-xs text-zinc-400">No result.</p>
                        ) : (
                            <div className="bg-zinc-800/50 rounded p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-500">Successes</span>
                                    <span className="text-lg font-mono text-fuchsia-300">
                                        {ceremonyPopupData.result.successes}
                                    </span>
                                </div>

                                <div className="mt-2">
                                    <span className="text-[10px] text-zinc-500">Dice</span>
                                    <div className="mt-1 text-xs font-mono text-zinc-200 break-words">
                                        {(ceremonyPopupData.result.dice || []).join(", ")}
                                    </div>
                                </div>

                                {ceremonyPopupData.result.is_exceptional && (
                                    <div className="mt-2 text-xs text-amber-300">
                                        Exceptional Success
                                    </div>
                                )}

                                {ceremonyPopupData.result.is_dramatic_failure && (
                                    <div className="mt-2 text-xs text-rose-300">
                                        Dramatic Failure
                                    </div>
                                )}

                                {ceremonyPopupData.result.beat_awarded && (
                                    <div className="mt-2 text-xs text-teal-300">
                                        Beat Awarded
                                    </div>
                                )}
                            </div>
                        )}

                        <Button 
                            className="w-full btn-secondary"
                            onClick={() => setCeremonyPopupOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Spellcasting Popup for Mages */}
            {isMage && spellcastingArcanum && (
                <SpellcastingPopup
                    isOpen={spellcastingOpen}
                    onClose={() => { setSpellcastingOpen(false); setSpellcastingArcanum(null); setSpellcastingPractice(null); setSpellcastingType(null); setSpellcastingRoteSkill(null); }}
                    arcanum={spellcastingArcanum}
                    arcanumDots={getNestedValue("arcana", spellcastingArcanum) || 0}
                    allArcana={getValue("arcana") || {}}
                    gnosis={getValue("gnosis") || 1}
                    isRuling={getValue("path") && PATH_ARCANA[getValue("path")]?.ruling?.includes(spellcastingArcanum)}
                    isInferior={getValue("path") && PATH_ARCANA[getValue("path")]?.inferior === spellcastingArcanum}
                    currentMana={getValue("mana") || 0}
                    currentWisdom={getValue("wisdom") || 7}
                    athleticsDots={getNestedValue("skills", "athletics") || 0}
                    firearmsDots={getNestedValue("skills", "firearms") || 0}
                    initialPractice={spellcastingPractice}
                    onCreateActiveSpell={addActiveSpell}
                    activeSpellCount={(activeCharacter?.active_spells || []).filter((entry) => entry?.kind === "spell").length}
                    orderRoteSkills={isMage && getValue("order") ? ORDER_ROTE_SKILLS[getValue("order")] || [] : []}
                    spellType={spellcastingType}
                    roteSkillDots={spellcastingRoteSkill ? (getNestedValue("skills", spellcastingRoteSkill) || 0) : 0}
                    isRoteOrderSkill={spellcastingRoteSkill && getValue("order") && (ORDER_ROTE_SKILLS[getValue("order")] || []).includes(spellcastingRoteSkill)}
                    onSpendMana={(amount) => handleChange("mana", Math.max(0, (getValue("mana") || 0) - amount))}
                    onRollDice={(spellData) => {
                        if (onTriggerDiceRoll) {
                            onTriggerDiceRoll(spellData);
                        }
                    }}
                    previousParadoxRolls={getMageSceneParadoxRolls()}
                    onPreviousParadoxRollsChange={setMageSceneParadoxRolls}
                    onResetPreviousParadoxRolls={resetMageSceneParadoxRolls}
                    onResolveParadoxContainment={resolveParadoxContainment}
                />
            )}

        </div>
    );
};