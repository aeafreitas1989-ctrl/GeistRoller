import { useState, useMemo, useEffect } from "react";
import { Plus, Minus, Trash2, ChevronUp, ChevronDown, ChevronRight, ChevronLeft, Save, X, Info, Dices, Zap, Star, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    HAUNTS, HAUNT_ENHANCEMENTS, KEYS, BURDENS,
    INVENTORY_TYPES, AVAILABILITY_OPTIONS, WEAPON_SPECIAL_OPTIONS,
    ARMOR_COVERAGE_OPTIONS, PREMADE_ARMOR, PREMADE_EQUIPMENT,
    SYNERGY_TABLE, MERIT_LIST, CEREMONY_LIST,
    ATTRIBUTE_LIST, SKILL_LIST, CEREMONY_DEFINITIONS,
    CEREMONY_SKILL_KEY_MAP, KEY_UNLOCK_ATTRIBUTES,
    ARCANA, MAGE_ATTAINMENTS, GNOSIS_TABLE, MAGE_PATHS, MAGE_ORDERS,
    PATH_ARCANA, ORDER_ROTE_SKILLS, ARCANA_PRACTICES, MAGE_ARMOR_EFFECTS,
} from "../data/character-data";
import { SpellcastingPopup } from "./SpellcastingPopup";

// Extracted sub-components
import {
    formatLabel, HEALTH_STATES, HEALTH_SYMBOLS,
    normalizeHealthBoxes, getHealthCounts, buildHealthBoxes,
    StatDots, StatRow, HealthTrack, ResourceTrack, SynergyTrack,
} from "./character/StatComponents";
import { MementoCard, MeritCard, CeremonyCard } from "./character/CardComponents";
import { InlineDiceRoller } from "./character/InlineDiceRoller";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const CharacterPanel = ({
    characters,
    activeCharacter,
    onSelectCharacter,
    onCreateCharacter,
    onUpdateCharacter,
    onDeleteCharacter,
    onDiceRollResult,
    onTriggerDiceRoll,
}) => {
    const [expandedSections, setExpandedSections] = useState({
        header: false,
        geist: false,
        attributes: false,
        skills: false,
        merits: false,
        combat: false,
        sinEater: false,
        powers: false,
        notes: false,
    });
    const [pendingChanges, setPendingChanges] = useState({});
    const [showMeritDialog, setShowMeritDialog] = useState(false);
    const [newMeritName, setNewMeritName] = useState("");
    const [newMeritDots, setNewMeritDots] = useState(1);
    const [newSpecialty, setNewSpecialty] = useState("");
    const [inventoryAddOpen, setInventoryAddOpen] = useState(false);
    
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

    const openSpellcastingPopup = (arcanum, practice = null) => {
        setSpellcastingArcanum(arcanum);
        setSpellcastingPractice(practice);
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
    
    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleChange = (field, value) => {
        setPendingChanges(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        const currentParent = pendingChanges[parent] || activeCharacter?.[parent] || {};
        setPendingChanges(prev => ({ ...prev, [parent]: { ...currentParent, [field]: value } }));
    };

    const saveChanges = () => {
        if (Object.keys(pendingChanges).length > 0) {
            onUpdateCharacter(pendingChanges);
            setPendingChanges({});
        }
    };

    const getValue = (field) => pendingChanges[field] ?? activeCharacter?.[field];
    const getNestedValue = (parent, field) => {
        const pending = pendingChanges[parent]?.[field];
        if (pending !== undefined) return pending;
        return activeCharacter?.[parent]?.[field] ?? 0;
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
    const calculateDefense = () => {
        const dex = getNestedValue("attributes", "dexterity") || 1;
        const wits = getNestedValue("attributes", "wits") || 1;
        const athletics = getNestedValue("skills", "athletics") || 0;
        return Math.min(dex, wits) + athletics;
    };

    const calculateInitiative = () => {
        const dex = getNestedValue("attributes", "dexterity") || 1;
        const composure = getNestedValue("attributes", "composure") || 1;
        return dex + composure;
    };

    const calculateSpeed = () => {
        const str = getNestedValue("attributes", "strength") || 1;
        const dex = getNestedValue("attributes", "dexterity") || 1;
        return str + dex + 5;
    };

    const calculateHealthMax = () => {
        const stamina = getNestedValue("attributes", "stamina") || 0;

        const meritsList = getValue("merits_list") || [];
        const hasGiant = (meritsList || []).some((m) => (m?.name || "") === "Giant");
        const hasSmallFramed = (meritsList || []).some((m) => (m?.name || "") === "Small-Framed");
        const size = 5 + (hasGiant ? 1 : 0) + (hasSmallFramed ? -1 : 0);

        return stamina + size;
    };

    const calculateWillpowerMax = () => {
        const resolve = getNestedValue("attributes", "resolve") || 1;
        const composure = getNestedValue("attributes", "composure") || 1;
        return resolve + composure;
    };

    const geistRank = parseInt(getValue("geist_rank"), 10) || 1;
    const maxHealth = calculateHealthMax();
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
    const addMerit = () => {
        if (newMeritName) {
            const meritToAdd = {
                id: Date.now(),
                name: newMeritName,
                dots: newMeritDots,
                ...(newMeritName === "Professional Training"
                    ? { assetSkills: ["__none__", "__none__", "__none__"] }
                    : {}),
            };

            let base = [...meritsList];

            // Prevent duplicates by name
            const alreadyHas = base.some((m) => (m?.name || "") === newMeritName);
            if (alreadyHas) {
                toast.error("That Merit is already on the sheet.");
                return;
            }

            // Enforce mutual exclusion
            if (newMeritName === "Giant") {
                base = base.filter((m) => (m?.name || "") !== "Small-Framed");
            }
            if (newMeritName === "Small-Framed") {
                base = base.filter((m) => (m?.name || "") !== "Giant");
            }

            const newMerits = [...base, meritToAdd]
                .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
            
            handleChange("merits_list", newMerits);
            setNewMeritName("");
            setNewMeritDots(1);
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
        const newMerits = meritsList.filter((m) => (m?.id || null) !== id);
        handleChange("merits_list", newMerits);
    };
    const updateMerit = (id, data) => {
        if (!id) return;
        const newMerits = meritsList.map((m) => {
            if ((m?.id || null) !== id) return m;
            return { ...m, ...data };
        });
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
                
                <div className="flex gap-2 items-center">
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
                        <SelectTrigger className="flex-1 bg-zinc-900/50 border-zinc-800 h-8 text-sm" data-testid="character-select">
                            <SelectValue placeholder="Select character" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {characters.map((char) => (<SelectItem key={char.id} value={char.id} className="text-zinc-200">{char.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                    
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
                                        <Select value={getValue("order") || ""} onValueChange={(v) => handleChange("order", v)}>
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

                                    <div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                                                onClick={() => fulfillAspiration(isMage ? "obsession" : "aspiration_burden")}
                                                data-testid="aspiration-burden-progressed"
                                            >
                                                {isMage ? "OBSESSION" : "BURDEN"}
                                            </Button>
                                            <Input
                                                value={getValue(isMage ? "obsession" : "aspiration_burden") || ""}
                                                onChange={(e) => handleChange(isMage ? "obsession" : "aspiration_burden", e.target.value)}
                                                className="h-7 input-geist text-xs flex-1"
                                                placeholder={isMage ? "Your Mage's Obsession" : ""}
                                            />
                                        </div>
                                    </div>
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
                                <p className="text-[10px] text-zinc-600 mt-2 italic">5 Beats = 1 Experience (auto-converts)</p>
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
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Geist Name</label>
                                <Input value={getValue("geist_name") || ""} onChange={(e) => handleChange("geist_name", e.target.value)} className="input-geist h-8 text-sm mt-0.5" placeholder="The name of your bound geist" data-testid="geist-name-input" />
                            </div>
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Geist Rank</label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={geistRank}
                                    onChange={(e) => handleChange("geist_rank", parseInt(e.target.value, 10) || 1)}
                                    className="input-geist h-8 text-sm mt-0.5"
                                    data-testid="geist-rank-input"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Geist Description</label>
                                <Textarea value={getValue("geist_description") || ""} onChange={(e) => handleChange("geist_description", e.target.value)} className="input-geist mt-0.5 min-h-[50px] text-sm" placeholder="Describe your geist's appearance..." data-testid="geist-description-textarea" />
                            </div>
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Geist's Innate Key</label>
                                <Select value={getValue("geist_innate_key") || ""} onValueChange={(v) => handleChange("geist_innate_key", v)}>
                                    <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm mt-0.5" data-testid="geist-innate-key-select"><SelectValue placeholder="Select Geist's Key..." /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {KEYS.map((k) => (<SelectItem key={k} value={k} className="text-zinc-200">{k}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Remembrance Trait</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select value={getValue("remembrance_trait_type") || ""} onValueChange={(v) => handleChange("remembrance_trait_type", v)}>
                                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm" data-testid="remembrance-trait-type-select"><SelectValue placeholder="Skill or Merit" /></SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            <SelectItem value="skill" className="text-zinc-200">Skill</SelectItem>
                                            <SelectItem value="merit" className="text-zinc-200">Merit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={getValue("remembrance_trait") || ""} onValueChange={(v) => handleChange("remembrance_trait", v)}>
                                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm" data-testid="remembrance-trait-select"><SelectValue placeholder="Select trait" /></SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            {(getValue("remembrance_trait_type") || "") === "merit"
                                                ? MERIT_LIST.map((merit) => (
                                                    <SelectItem key={merit.name} value={merit.name} className="text-zinc-200">{merit.name}</SelectItem>
                                                ))
                                                : SKILL_LIST.map((skillKey) => (
                                                    <SelectItem key={skillKey} value={skillKey} className="text-zinc-200">{formatLabel(skillKey)}</SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Virtue</label>
                                    <Input value={getValue("virtue") || ""} onChange={(e) => handleChange("virtue", e.target.value)} className="input-geist h-8 text-sm mt-0.5" data-testid="virtue-input" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Vice</label>
                                    <Input value={getValue("vice") || ""} onChange={(e) => handleChange("vice", e.target.value)} className="input-geist h-8 text-sm mt-0.5" data-testid="vice-input" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Ban</label>
                                <Input value={getValue("ban") || ""} onChange={(e) => handleChange("ban", e.target.value)} className="input-geist h-8 text-sm mt-0.5" placeholder="The Geist's Ban..." data-testid="ban-input" />
                            </div>
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Bane</label>
                                <Input value={getValue("bane") || ""} onChange={(e) => handleChange("bane", e.target.value)} className="input-geist h-8 text-sm mt-0.5" placeholder="The Geist's Bane..." data-testid="bane-input" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Remembrances</label>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={!!getValue("remembrance_1_complete")}
                                        onCheckedChange={(checked) => {
                                            handleChange("remembrance_1_complete", !!checked);
                                            const was = !!getValue("remembrance_1_complete");
                                            if (checked && !was) {
                                                handleChange("synergy", Math.min((getValue("synergy") || 7) + 1, 10));
                                            } else if (!checked && was) {
                                                if (getValue("remembrance_2_complete")) {
                                                    handleChange("remembrance_2_complete", false);
                                                    if (getValue("remembrance_3_complete")) {
                                                        handleChange("remembrance_3_complete", false);
                                                        handleChange("synergy", Math.max((getValue("synergy") || 7) - 3, 1));
                                                        handleChange("geist_rank", Math.max((parseInt(getValue("geist_rank"), 10) || 1) - 1, 1));
                                                    } else {
                                                        handleChange("synergy", Math.max((getValue("synergy") || 7) - 2, 1));
                                                    }
                                                } else {
                                                    handleChange("synergy", Math.max((getValue("synergy") || 7) - 1, 1));
                                                }
                                            }
                                        }}
                                        className="border-cyan-500/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                                        data-testid="remembrance-1-check"
                                    />
                                    <Input value={getValue("remembrance_1") || ""} onChange={(e) => handleChange("remembrance_1", e.target.value)} className="input-geist h-8 text-sm flex-1" placeholder="First Remembrance..." data-testid="remembrance-1-input" />
                                </div>
                                {getValue("remembrance_1_complete") && (
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={!!getValue("remembrance_2_complete")}
                                            onCheckedChange={(checked) => {
                                                handleChange("remembrance_2_complete", !!checked);
                                                const was = !!getValue("remembrance_2_complete");
                                                if (checked && !was) {
                                                    handleChange("synergy", Math.min((getValue("synergy") || 7) + 1, 10));
                                                } else if (!checked && was) {
                                                    if (getValue("remembrance_3_complete")) {
                                                        handleChange("remembrance_3_complete", false);
                                                        handleChange("synergy", Math.max((getValue("synergy") || 7) - 2, 1));
                                                        handleChange("geist_rank", Math.max((parseInt(getValue("geist_rank"), 10) || 1) - 1, 1));
                                                    } else {
                                                        handleChange("synergy", Math.max((getValue("synergy") || 7) - 1, 1));
                                                    }
                                                }
                                            }}
                                            className="border-cyan-500/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                                            data-testid="remembrance-2-check"
                                        />
                                        <Input value={getValue("remembrance_2") || ""} onChange={(e) => handleChange("remembrance_2", e.target.value)} className="input-geist h-8 text-sm flex-1" placeholder="Second Remembrance..." data-testid="remembrance-2-input" />
                                    </div>
                                )}
                                {getValue("remembrance_2_complete") && (
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={!!getValue("remembrance_3_complete")}
                                            onCheckedChange={(checked) => {
                                                handleChange("remembrance_3_complete", !!checked);
                                                const was = !!getValue("remembrance_3_complete");
                                                if (checked && !was) {
                                                    handleChange("synergy", Math.min((getValue("synergy") || 7) + 1, 10));
                                                    handleChange("geist_rank", (parseInt(getValue("geist_rank"), 10) || 1) + 1);
                                                } else if (!checked && was) {
                                                    handleChange("synergy", Math.max((getValue("synergy") || 7) - 1, 1));
                                                    handleChange("geist_rank", Math.max((parseInt(getValue("geist_rank"), 10) || 1) - 1, 1));
                                                }
                                            }}
                                            className="border-cyan-500/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                                            data-testid="remembrance-3-check"
                                        />
                                        <Input value={getValue("remembrance_3") || ""} onChange={(e) => handleChange("remembrance_3", e.target.value)} className="input-geist h-8 text-sm flex-1" placeholder="Third Remembrance..." data-testid="remembrance-3-input" />
                                    </div>
                                )}
                                <p className="text-[9px] text-zinc-600">Check to complete a Remembrance. Each raises Synergy by 1. The third also raises Geist Rank.</p>
                            </div>
                            <div className="p-2 bg-teal-900/10 border border-teal-500/20 rounded-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-teal-400 uppercase tracking-wider">Relationship</span>
                                    <span className="text-sm font-heading text-teal-300">{synergyData.relationship}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-1">Based on Synergy {currentSynergy}</p>
                            </div>
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
                                    {["strength", "dexterity", "stamina"].map((attr) => (
                                        <StatRow key={attr} label={attr} value={getNestedValue("attributes", attr)} max={5} onChange={(v) => handleNestedChange("attributes", attr, v)} color="zinc" onLabelClick={() => openDicePopup('attribute', attr)} />
                                    ))}
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

                    {/* Combat Stats */}
                    <Collapsible open={expandedSections.combat}>
                        <CollapsibleTrigger onClick={() => toggleSection("combat")} className="flex items-center justify-between w-full p-2 rounded-sm bg-red-900/50 border border-red-800 hover:bg-red-800/50" data-testid="section-toggle-combat">
                            <span className="text-xs font-mono uppercase tracking-wider text-red-400">Combat & Inventory</span>
                            {expandedSections.combat ? <ChevronDown className="w-4 h-4 text-red-500" /> : <ChevronRight className="w-4 h-4 text-red-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                                    <span className="text-zinc-500">Size</span>
                                    <span className="font-mono text-teal-400" data-testid="size-input">
                                        {5 + ((meritsList || []).some((m) => (m?.name || "") === "Giant") ? 1 : 0) + ((meritsList || []).some((m) => (m?.name || "") === "Small-Framed") ? -1 : 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                                    <span className="text-zinc-500">Defense</span>
                                    <span className="font-mono text-teal-400">{calculateDefense() + mageArmorDefenseBonus}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                                    <span className="text-zinc-500">Initiative</span>
                                    <span className="font-mono text-teal-400">{calculateInitiative()}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                                    <span className="text-zinc-500">Speed</span>
                                    <span className="font-mono text-teal-400">{calculateSpeed()}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                                    <span className="text-zinc-500">Armor</span>
                                    <span className="font-mono text-teal-400" data-testid="armor-input">{equippedArmorGeneral + mageArmorGeneralBonus}/{equippedArmorBallistic}</span>
                                </div>
                            </div>

                            {/* Mage Armor */}
                            {isMage && (() => {
                                const activeMageArmor = getValue("active_mage_armor") || null;
                                const arcanaWithArmor = ARCANA.filter(a => (getNestedValue("arcana", a) || 0) >= 2);
                                if (arcanaWithArmor.length === 0) return null;
                                return (
                                    <div className="mt-3 space-y-2" data-testid="mage-armor-section">
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Mage Armor</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {arcanaWithArmor.map(a => {
                                                const isActive = activeMageArmor === a;
                                                const dots = getNestedValue("arcana", a) || 0;
                                                const effect = MAGE_ARMOR_EFFECTS[a];
                                                return (
                                                    <TooltipProvider key={a}>
                                                        <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => handleChange("active_mage_armor", isActive ? null : a)}
                                                                className={`px-2.5 py-1 text-xs rounded border transition-all ${
                                                                    isActive
                                                                        ? "bg-violet-600/40 border-violet-500 text-violet-200 shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                                                                        : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                                                                }`}
                                                                data-testid={`mage-armor-${a.toLowerCase()}`}
                                                            >
                                                                {a} ({dots})
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="bg-zinc-800 border-zinc-700 text-xs max-w-[220px]">
                                                            <p className="font-medium text-violet-300">{a} Armor</p>
                                                            <p className="text-zinc-400 mt-0.5">{effect?.short}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    </TooltipProvider>
                                                );
                                            })}
                                        </div>
                                        {activeMageArmor && MAGE_ARMOR_EFFECTS[activeMageArmor] && (
                                            <div className="p-2 bg-violet-900/20 border border-violet-500/30 rounded text-xs text-violet-300" data-testid="mage-armor-active-effect">
                                                <span className="font-medium">{activeMageArmor} Armor active:</span>{" "}
                                                {MAGE_ARMOR_EFFECTS[activeMageArmor].armor}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Inventory (structured) */}
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Inventory</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-zinc-600 font-mono">
                                            {inventoryItems.length} item{inventoryItems.length === 1 ? "" : "s"}
                                        </span>
                                        <Button
                                            onClick={() => setInventoryAddOpen(true)}
                                            className="h-6 px-2 text-[10px] btn-primary flex items-center gap-1"
                                            data-testid="inventory-open-add"
                                        >
                                            <Plus className="w-3 h-3" /> Add
                                        </Button>
                                    </div>
                                </div>

                                <Dialog open={inventoryAddOpen} onOpenChange={setInventoryAddOpen}>
                                    <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-teal-300 font-heading">
                                                <Plus className="w-5 h-5" />
                                                Add Item
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-3">
                                            <div className="p-2 rounded-sm bg-zinc-900/30 border border-zinc-800 space-y-2">
                                                {/* PASTE THE INVENTORY TEMPLATE FORM HERE */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Type</label>
                                                        <Select
                                                            value={invType}
                                                            onValueChange={(v) => {
                                                                setInvType(v);
                                                                setInvPremade("__none__");
                                                                setInvDraft((prev) => ({ ...prev, type: v }));
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                                <SelectItem value="weapon" className="text-xs">Weapon</SelectItem>
                                                                <SelectItem value="armor" className="text-xs">Armor</SelectItem>
                                                                <SelectItem value="equipment" className="text-xs">Equipment</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Availability</label>
                                                        <Select
                                                            value={String(invDraft.availability ?? 0)}
                                                            onValueChange={(v) =>
                                                                setInvDraft((prev) => ({
                                                                    ...prev,
                                                                    availability: parseInt(v, 10),
                                                                }))
                                                            }
                                                        >
                                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                                {AVAILABILITY_OPTIONS.map((a) => (
                                                                    <SelectItem
                                                                        key={a.value}
                                                                        value={String(a.value)}
                                                                        className="text-xs"
                                                                    >
                                                                        {a.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {invType === "equipment" && (
                                                    <div>
                                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Premade</label>
                                                        <Select
                                                            value={invPremade}
                                                            onValueChange={(v) => {
                                                                setInvPremade(v);
                                                                if (v === "__none__") return;

                                                                const p = PREMADE_EQUIPMENT.find((x) => x.name === v);
                                                                if (!p) return;

                                                                setInvDraft((prev) => ({
                                                                    ...prev,
                                                                    name: p.name,
                                                                    availability: p.availability ?? 0,
                                                                    equipment: {
                                                                        bonus: p.bonus ?? 0,
                                                                        durability: p.durability ?? 0,
                                                                        size: p.size ?? 1,
                                                                        structure: p.structure ?? 1,
                                                                        effect: p.effect ?? "",
                                                                    },
                                                                }));
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                                <SelectValue placeholder="Select premade..." />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                                <SelectItem value="__none__" className="text-xs">
                                                                    None
                                                                </SelectItem>
                                                                {PREMADE_EQUIPMENT.map((p) => (
                                                                    <SelectItem
                                                                        key={p.name}
                                                                        value={p.name}
                                                                        className="text-xs"
                                                                    >
                                                                        {p.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}

                                                {invType === "armor" && (
                                                    <div>
                                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Premade</label>
                                                        <Select
                                                            value={invPremade}
                                                            onValueChange={(v) => {
                                                                setInvPremade(v);
                                                                if (v === "__none__") return;
                                                
                                                                const p = PREMADE_ARMOR.find((x) => x.name === v);
                                                                if (!p) return;

                                                                const rawCoverage = p.armor?.coverage ?? [];
                                                                const coverageList = (Array.isArray(rawCoverage) ? rawCoverage : String(rawCoverage).split(","))
                                                                    .map((s) => String(s).trim().toLowerCase())
                                                                    .filter(Boolean);

                                                                const coverageObj = {
                                                                    head: coverageList.includes("head"),
                                                                    torso: coverageList.includes("torso"),
                                                                    arms: coverageList.includes("arms"),
                                                                    legs: coverageList.includes("legs"),
                                                                };

                                                                setInvDraft((prev) => ({
                                                                    ...prev,
                                                                    name: p.name,
                                                                    availability: p.availability ?? 0,
                                                                    armor: {
                                                                        ...prev.armor,
                                                                        general: p.armor?.general ?? 0,
                                                                        ballistic: Math.max(0, Math.min(5, p.armor?.ballistic ?? 0)),
                                                                        strength: p.armor?.strength ?? 0,
                                                                        defense: p.armor?.defense ?? 0,
                                                                        speed: p.armor?.speed ?? 0,
                                                                        coverage: coverageObj,
                                                                    },
                                                                }));
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                                <SelectValue placeholder="Select premade..." />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                                <SelectItem value="__none__" className="text-xs">
                                                                    None
                                                                </SelectItem>
                                                                {PREMADE_ARMOR.map((p) => (
                                                                    <SelectItem key={p.name} value={p.name} className="text-xs">
                                                                        {p.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Name</label>
                                                    <Input
                                                        value={invDraft.name}
                                                        onChange={(e) =>
                                                            setInvDraft((prev) => ({
                                                                ...prev,
                                                                name: e.target.value,
                                                            }))
                                                        }
                                                        className="h-7 input-geist text-xs"
                                                        placeholder="Item name..."
                                                    />
                                                </div>

                                                {/* Type-specific fields */}
                                                {invType === "weapon" && (
                                                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Weapon Type</label>
                                                            <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                                                                <span>Melee</span>
                                                                <Switch
                                                                    checked={(invDraft.weapon.kind ?? "melee") === "ranged"}
                                                                    onCheckedChange={(v) => {
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            weapon: {
                                                                                ...prev.weapon,
                                                                                kind: v ? "ranged" : "melee",
                                                                            },
                                                                        }));
                                                                    }}
                                                                    data-testid="weapon-kind-toggle"
                                                                />
                                                                <span>Ranged</span>
                                                            </div>
                                                        </div>

                                                        {(invDraft.weapon.kind ?? "melee") === "ranged" && (
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                                                        Range (x/2x/4x)
                                                                    </label>
                                                                    <Input
                                                                        type="number"
                                                                        min={1}
                                                                        value={invDraft.weapon.range ?? 10}
                                                                        onChange={(e) => {
                                                                            const v = parseInt(e.target.value, 10);
                                                                            const base = Math.max(1, Number.isFinite(v) ? v : 10);
                                                                            setInvDraft((prev) => ({
                                                                                ...prev,
                                                                                weapon: { ...prev.weapon, range: base },
                                                                            }));
                                                                        }}
                                                                        className="h-7 input-geist text-xs"
                                                                    />
                                                                    <div className="mt-1 text-[10px] text-zinc-600">
                                                                        {`${invDraft.weapon.range ?? 10}/${(invDraft.weapon.range ?? 10) * 2}/${(invDraft.weapon.range ?? 10) * 4}`}
                                                                    </div>
                                                                </div>
                                                        
                                                                <div>
                                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Ammunition</label>
                                                                    <Input
                                                                        type="number"
                                                                        min={0}
                                                                        value={invDraft.weapon.ammo ?? 0}
                                                                        onChange={(e) => {
                                                                            const v = parseInt(e.target.value, 10);
                                                                            const ammo = Math.max(0, Number.isFinite(v) ? v : 0);
                                                                            setInvDraft((prev) => ({
                                                                                ...prev,
                                                                                weapon: { ...prev.weapon, ammo },
                                                                            }));
                                                                        }}
                                                                        className="h-7 input-geist text-xs"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Damage</label>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    max={5}
                                                                    value={invDraft.weapon.damage}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            weapon: {
                                                                                ...prev.weapon,
                                                                                damage: Math.min(
                                                                                    5,
                                                                                    Math.max(
                                                                                        1,
                                                                                        parseInt(e.target.value, 10) || 1
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Strength</label>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={5}
                                                                    value={invDraft.weapon.strength}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            weapon: {
                                                                                ...prev.weapon,
                                                                                strength: Math.min(
                                                                                    5,
                                                                                    Math.max(
                                                                                        0,
                                                                                        parseInt(e.target.value, 10) || 0
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Size</label>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    max={5}
                                                                    value={invDraft.weapon.size}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            weapon: {
                                                                                ...prev.weapon,
                                                                                size: Math.min(
                                                                                    5,
                                                                                    Math.max(
                                                                                        1,
                                                                                        parseInt(e.target.value, 10) || 1
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            {(invDraft.weapon.kind ?? "melee") === "melee" && (
                                                                <>
                                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Special</label>
                                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                                        {WEAPON_SPECIAL_OPTIONS.map((s) => {
                                                                            const checked = (invDraft.weapon.special || []).includes(s);

                                                                            return (
                                                                                <label
                                                                                    key={s}
                                                                                    className="flex items-center gap-2 text-[10px] text-zinc-400"
                                                                                >
                                                                                    <Checkbox
                                                                                        checked={checked}
                                                                                        onCheckedChange={(v) => {
                                                                                            setInvDraft((prev) => {
                                                                                                const cur = prev.weapon.special || [];
                                                                                                const next = v
                                                                                                    ? [...cur, s]
                                                                                                    : cur.filter((x) => x !== s);

                                                                                                return {
                                                                                                    ...prev,
                                                                                                    weapon: {
                                                                                                        ...prev.weapon,
                                                                                                        kind: v ? "ranged" : "melee",
                                                                                                        special: v ? [] : (prev.weapon.special || []),
                                                                                                    },
                                                                                                };
                                                                                            });
                                                                                        }}
                                                                                        className="h-3 w-3"
                                                                                    />
                                                                                    {s}
                                                                                </label>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Notes</label>
                                                            <Textarea
                                                                value={invDraft.weapon.notes}
                                                                onChange={(e) =>
                                                                    setInvDraft((prev) => ({
                                                                        ...prev,
                                                                        weapon: {
                                                                            ...prev.weapon,
                                                                            notes: e.target.value,
                                                                        },
                                                                    }))
                                                                }
                                                                className="input-geist mt-0.5 min-h-[60px] text-xs"
                                                                placeholder="Weapon notes..."
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {invType === "armor" && (
                                                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">General</label>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    max={5}
                                                                    value={invDraft.armor.general}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            armor: {
                                                                                ...prev.armor,
                                                                                general: Math.min(
                                                                                    5,
                                                                                    Math.max(
                                                                                        1,
                                                                                        parseInt(e.target.value, 10) || 1
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Ballistic</label>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={5}
                                                                    value={invDraft.armor.ballistic}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            armor: {
                                                                                ...prev.armor,
                                                                                ballistic: Math.min(
                                                                                    5,
                                                                                    Math.max(
                                                                                        0,
                                                                                        parseInt(e.target.value, 10) || 0
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Strength</label>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={5}
                                                                    value={invDraft.armor.strength}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            armor: {
                                                                                ...prev.armor,
                                                                                strength: Math.min(
                                                                                    5,
                                                                                    Math.max(
                                                                                        0,
                                                                                        parseInt(e.target.value, 10) || 0
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Defense</label>
                                                                <Input
                                                                    type="number"
                                                                    min={-3}
                                                                    max={0}
                                                                    value={invDraft.armor.defense}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            armor: {
                                                                                ...prev.armor,
                                                                                defense: Math.min(
                                                                                    0,
                                                                                    Math.max(
                                                                                        -3,
                                                                                        parseInt(e.target.value, 10) || 0
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Speed</label>
                                                                <Input
                                                                    type="number"
                                                                    min={-3}
                                                                    max={0}
                                                                    value={invDraft.armor.speed}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            armor: {
                                                                                ...prev.armor,
                                                                                speed: Math.min(
                                                                                    0,
                                                                                    Math.max(
                                                                                        -3,
                                                                                        parseInt(e.target.value, 10) || 0
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Coverage</label>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {ARMOR_COVERAGE_OPTIONS.map((c) => (
                                                                    <label
                                                                        key={c}
                                                                        className="flex items-center gap-2 text-[10px] text-zinc-400"
                                                                    >
                                                                        <Checkbox
                                                                            checked={!!invDraft.armor.coverage?.[c]}
                                                                            onCheckedChange={(v) =>
                                                                                setInvDraft((prev) => ({
                                                                                    ...prev,
                                                                                    armor: {
                                                                                        ...prev.armor,
                                                                                        coverage: {
                                                                                            ...(prev.armor.coverage || {}),
                                                                                            [c]: !!v,
                                                                                        },
                                                                                    },
                                                                                }))
                                                                            }
                                                                            className="h-3 w-3"
                                                                        />
                                                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {invType === "equipment" && (
                                                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Bonus</label>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={5}
                                                                    value={invDraft.equipment.bonus}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            equipment: {
                                                                                ...prev.equipment,
                                                                                bonus: Math.min(
                                                                                    5,
                                                                                    Math.max(
                                                                                        0,
                                                                                        parseInt(e.target.value, 10) || 0
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Durability</label>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={5}
                                                                    value={invDraft.equipment.durability}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            equipment: {
                                                                                ...prev.equipment,
                                                                                durability: Math.min(
                                                                                    5,
                                                                                    Math.max(
                                                                                        0,
                                                                                        parseInt(e.target.value, 10) || 0
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Size</label>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    max={5}
                                                                    value={invDraft.equipment.size}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            equipment: {
                                                                                ...prev.equipment,
                                                                                size: Math.min(
                                                                                    5,
                                                                                    Math.max(
                                                                                        1,
                                                                                        parseInt(e.target.value, 10) || 1
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Structure</label>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    max={10}
                                                                    value={invDraft.equipment.structure}
                                                                    onChange={(e) =>
                                                                        setInvDraft((prev) => ({
                                                                            ...prev,
                                                                            equipment: {
                                                                                ...prev.equipment,
                                                                                structure: Math.min(
                                                                                    10,
                                                                                    Math.max(
                                                                                        1,
                                                                                        parseInt(e.target.value, 10) || 1
                                                                                    )
                                                                                ),
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Effect</label>
                                                            <Textarea
                                                                value={invDraft.equipment.effect}
                                                                onChange={(e) =>
                                                                    setInvDraft((prev) => ({
                                                                        ...prev,
                                                                        equipment: {
                                                                            ...prev.equipment,
                                                                            effect: e.target.value,
                                                                        },
                                                                    }))
                                                                }
                                                                className="input-geist mt-0.5 min-h-[60px] text-xs"
                                                                placeholder="What it does..."
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <Button
                                                    onClick={addInventoryItem}
                                                    className="btn-primary h-7 px-3 text-xs w-full flex items-center justify-center gap-2"
                                                    data-testid="inventory-add-item"
                                                >
                                                    <Plus className="w-4 h-4" /> Add Item
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Items list */}
                                {inventoryItems.length === 0 ? (
                                    <p className="text-[10px] text-zinc-600 italic">No inventory items yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {inventoryItems.map((it, idx) => (
                                            <div key={`${it.name || "item"}-${idx}`} className="p-2 rounded-sm bg-zinc-900/20 border border-zinc-800">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-zinc-200">
                                                        <span className="font-mono text-zinc-500 mr-2">
                                                            {it.type.charAt(0).toUpperCase() + it.type.slice(1)}
                                                        </span>
                                                        {it.name || "Unnamed"}
                                                        <span className="text-[10px] text-zinc-500 ml-2">
                                                            {AVAILABILITY_OPTIONS.find((a) => a.value === (it.availability ?? 0))?.label ?? "o"}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-zinc-400 hover:text-red-300"
                                                        onClick={() => removeInventoryItem(idx)}
                                                        data-testid={`inventory-remove-${idx}`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
 
                                                {/* Quick edit: name + availability */}
                                                {editingInventoryIndex === idx ? (
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <Input
                                                            value={it.name || ""}
                                                            onChange={(e) => updateInventoryItem(idx, { name: e.target.value })}
                                                            className="h-7 input-geist text-xs"
                                                            placeholder="Name"
                                                        />
                                                        <Select
                                                            value={String(it.availability ?? 0)}
                                                            onValueChange={(v) => updateInventoryItem(idx, { availability: parseInt(v, 10) })}
                                                        >
                                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                                {AVAILABILITY_OPTIONS.map((a) => (
                                                                    <SelectItem key={a.value} value={String(a.value)} className="text-xs">
                                                                        {a.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {/* Type-specific edits */}
                                                        {it.type === "weapon" && (
                                                            <div className="col-span-2 grid grid-cols-3 gap-2">
                                                                <Input
                                                                type="number"
                                                                value={it.weapon?.damage ?? 1}
                                                                onChange={(e) =>
                                                                    updateInventoryItemNested(idx, "weapon", { damage: parseInt(e.target.value, 10) || 0 })
                                                                }
                                                                className="h-7 input-geist text-xs"
                                                                placeholder="Damage"
                                                            />
                                                            <Input
                                                                type="number"
                                                                value={it.weapon?.strength ?? 0}
                                                                onChange={(e) =>
                                                                    updateInventoryItemNested(idx, "weapon", { strength: parseInt(e.target.value, 10) || 0 })
                                                                }
                                                                className="h-7 input-geist text-xs"
                                                                placeholder="Strength"
                                                            />
                                                            <Input
                                                                type="number"
                                                                value={it.weapon?.size ?? 1}
                                                                onChange={(e) =>
                                                                    updateInventoryItemNested(idx, "weapon", { size: parseInt(e.target.value, 10) || 0 })
                                                                }
                                                                className="h-7 input-geist text-xs"
                                                                placeholder="Size"
                                                            />
                                                            </div>
                                                        )}

                                                        {it.type === "armor" && (
                                                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={5}
                                                                    value={it.armor?.general ?? 0}
                                                                    onChange={(e) => {
                                                                        const v = parseInt(e.target.value, 10);
                                                                        const clamped = Math.max(0, Math.min(5, Number.isFinite(v) ? v : 0));
                                                                        updateInventoryItemNested(idx, "armor", { general: clamped });
                                                                    }}
                                                                    className="h-7 input-geist text-xs"
                                                                    placeholder="General"
                                                                />
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={5}
                                                                    value={it.armor?.ballistic ?? 0}
                                                                    onChange={(e) => {
                                                                        const v = parseInt(e.target.value, 10);
                                                                        const clamped = Math.max(0, Math.min(5, Number.isFinite(v) ? v : 0));
                                                                        updateInventoryItemNested(idx, "armor", { ballistic: clamped });
                                                                    }}
                                                                    className="h-7 input-geist text-xs"
                                                                    placeholder="Ballistic"
                                                                />
                                                            </div>
                                                        )}

                                                        {it.type === "equipment" && (
                                                            <div className="col-span-2 grid grid-cols-4 gap-2">
                                                                <Input
                                                                    type="number"
                                                                    value={it.equipment?.bonus ?? 0}
                                                                    onChange={(e) =>
                                                                        updateInventoryItemNested(idx, "equipment", { bonus: parseInt(e.target.value, 10) || 0 })
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                    placeholder="Bonus"
                                                                />
                                                                <Input
                                                                    type="number"
                                                                    value={it.equipment?.durability ?? 0}
                                                                    onChange={(e) =>
                                                                        updateInventoryItemNested(idx, "equipment", { durability: parseInt(e.target.value, 10) || 0 })
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                    placeholder="Dur."
                                                                />
                                                                <Input
                                                                    type="number"
                                                                    value={it.equipment?.size ?? 1}
                                                                    onChange={(e) =>
                                                                        updateInventoryItemNested(idx, "equipment", { size: parseInt(e.target.value, 10) || 0 })
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                    placeholder="Size"
                                                                />
                                                                <Input
                                                                    type="number"
                                                                    value={it.equipment?.structure ?? 1}
                                                                    onChange={(e) =>
                                                                        updateInventoryItemNested(idx, "equipment", { structure: parseInt(e.target.value, 10) || 0 })
                                                                    }
                                                                    className="h-7 input-geist text-xs"
                                                                    placeholder="Str."
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="col-span-2 flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 px-2 text-zinc-400 hover:text-zinc-200"
                                                                onClick={() => setEditingInventoryIndex(null)}
                                                                data-testid={`inventory-cancel-edit-${idx}`}
                                                            >
                                                                Done
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 grid grid-cols-3 gap-2 items-center">
                                                        <div className="text-xs text-cyan-400 font-mono">
                                                            {(() => {
                                                                if (it.type === "weapon") {
                                                                    return `Damage +${it.weapon?.damage ?? 1}`;
                                                                }

                                                                if (it.type === "armor") {
                                                                    return `Rating ${it.armor?.general ?? 1}/${it.armor?.ballistic ?? 0}`;
                                                                }

                                                                // equipment (default)
                                                                return `Bonus +${it.equipment?.bonus ?? 0}`;
                                                            })()}
                                                        </div>

                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-[10px] text-zinc-500">Equipped</span>
                                                            <Switch
                                                                checked={!!it.equipped}
                                                                onCheckedChange={(v) => {
                                                                    const current = getValue("inventory_items") || [];
                                                                    const target = current[idx];

                                                                    // Default: just toggle this item
                                                                    let updated = current.map((it, i) => (i === idx ? { ...it, equipped: !!v } : it));

                                                                    // If equipping armor, unequip all other armor first
                                                                    if (target?.type === "armor" && !!v) {
                                                                        updated = current.map((it, i) => {
                                                                            if (it?.type !== "armor") return it;
                                                                            if (i === idx) return { ...it, equipped: true };
                                                                            return { ...it, equipped: false };
                                                                        });
                                                                    }

                                                                    handleChange("inventory_items", updated);
                                                                }}
                                                                data-testid={`inventory-equipped-${idx}`}
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 px-2 text-zinc-400 hover:text-zinc-200"
                                                                onClick={() => setEditingInventoryIndex(idx)}
                                                                data-testid={`inventory-edit-${idx}`}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
 
                                                {/* Type-specific display (editable minimal) */}
                                                {it.type === "weapon" && (
                                                    <div className="mt-2 grid grid-cols-3 gap-1 text-[12px] text-zinc-500">
                                                        <span>Damage {it.weapon?.damage ?? 1}</span>
                                                        <span>Size {it.weapon?.size ?? 1}</span>
                                                        <span>Strength {it.weapon?.strength ?? 0}</span>
                                                    </div>
                                                )}
                                                {it.type === "armor" && (
                                                    <div className="mt-2 grid grid-cols-3 gap-1 text-[12px] text-zinc-500">
                                                        <span>Strength {it.armor?.strength ?? 0}</span>
                                                        <span>Defense {it.armor?.defense ?? 0}</span>
                                                        <span>Speed {it.armor?.speed ?? 0}</span>
                                                    </div>
                                                )}
                                                {it.type === "equipment" && (
                                                    <div className="mt-2 grid grid-cols-3 gap-1 text-[12px] text-zinc-500">
                                                        <span>Durability {it.equipment?.durability ?? 0}</span>
                                                        <span>Structure {it.equipment?.structure ?? 1}</span>
                                                        <span>Size {it.equipment?.size ?? 1}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                <>
                                    {/* Gnosis for Mages */}
                                    <div>
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Gnosis</label>
                                        <SynergyTrack value={getValue("gnosis") || 1} maxValue={10} onChangeValue={(v) => handleChange("gnosis", v)} onChangeMax={() => {}} />
                                    </div>

                                    {(() => {
                                        const gnosisLevel = getValue("gnosis") || 1;
                                        const gnosisData = GNOSIS_TABLE[gnosisLevel] || GNOSIS_TABLE[1];
                                        return (
                                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                <div className="p-2 bg-zinc-900/50 rounded-sm">
                                                    <span className="text-zinc-500">Trait Max:</span>
                                                    <span className="text-violet-400 ml-1 font-mono">{gnosisData.traitMax}</span>
                                                </div>
                                                <div className="p-2 bg-zinc-900/50 rounded-sm">
                                                    <span className="text-zinc-500">Mana/Turn:</span>
                                                    <span className="text-violet-400 ml-1 font-mono">{gnosisData.perTurn}</span>
                                                </div>
                                                <div className="p-2 bg-zinc-900/50 rounded-sm">
                                                    <span className="text-zinc-500">Ritual Interval:</span>
                                                    <span className="text-violet-400 ml-1 font-mono">{gnosisData.ritualInterval}</span>
                                                </div>
                                                <div className="p-2 bg-zinc-900/50 rounded-sm">
                                                    <span className="text-zinc-500">Yantras:</span>
                                                    <span className="text-violet-400 ml-1 font-mono">{gnosisData.yantras}</span>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Nimbus for Mages */}
                                    <div className="p-2 bg-violet-900/20 border border-violet-500/30 rounded-sm">
                                        <label className="text-[10px] text-violet-400 uppercase tracking-wider block mb-1">Nimbus</label>
                                        <Textarea 
                                            value={getValue("nimbus") || ""} 
                                            onChange={(e) => handleChange("nimbus", e.target.value)} 
                                            className="input-geist text-xs min-h-[60px]" 
                                            placeholder="Describe your Nimbus manifestation..."
                                            data-testid="mage-nimbus-input"
                                        />
                                    </div>

                                    {/* Health */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Health</label>
                                            <span className="text-[10px] text-zinc-600 font-mono" data-testid="health-count">{filledHealth}/{maxHealth}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isDeadTrack && (
                                                <span className="text-[10px] text-rose-400 font-mono" data-testid="health-dead-label">DEAD</span>
                                            )}
                                            <HealthTrack boxes={healthBoxes} max={maxHealth} onBoxClick={handleHealthBoxClick} />
                                        </div>
                                        {woundPenalty < 0 && (
                                            <p className="text-[10px] text-rose-400 mt-1" data-testid="health-wound-penalty">
                                                Wound Penalty {woundPenalty}
                                            </p>
                                        )}
                                    </div>

                                    {/* Willpower */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Willpower</label>
                                            <span className="text-[10px] text-zinc-600 font-mono">{getValue("willpower") || 0}/{calculateWillpowerMax()}</span>
                                        </div>
                                        <ResourceTrack current={getValue("willpower") || 0} max={calculateWillpowerMax()} onChange={(v) => handleChange("willpower", v)} color="amber" testIdPrefix="willpower" />
                                    </div>

                                    {/* Mana for Mages */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Mana</label>
                                            <div className="flex items-center gap-2">
                                                {(() => {
                                                    const gnosisLevel = getValue("gnosis") || 1;
                                                    const gnosisData = GNOSIS_TABLE[gnosisLevel] || GNOSIS_TABLE[1];
                                                    return (
                                                        <>
                                                            <span className="text-[10px] text-zinc-600 font-mono">{getValue("mana") || 0}/{gnosisData.maxMana}</span>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <span className="text-[10px] px-1 py-0.5 bg-violet-900/30 text-violet-400 rounded font-mono">{gnosisData.perTurn}/turn</span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="bg-zinc-900 border-zinc-700"><p className="text-xs">Max expenditure per turn</p></TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        {(() => {
                                            const gnosisLevel = getValue("gnosis") || 1;
                                            const gnosisData = GNOSIS_TABLE[gnosisLevel] || GNOSIS_TABLE[1];
                                            return (
                                                <>
                                                    <ResourceTrack current={getValue("mana") || 0} max={Math.min(gnosisData.maxMana, 20)} onChange={(v) => handleChange("mana", v)} color="violet" testIdPrefix="mana" />
                                                    {gnosisData.maxMana > 20 && <p className="text-[10px] text-zinc-600 mt-1">Showing first 20 of {gnosisData.maxMana} max</p>}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Original Geist content */}
                                    <div>
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Synergy</label>
                                        <SynergyTrack value={getValue("synergy") || 7} maxValue={getValue("synergy_max") || 10} onChangeValue={(v) => handleChange("synergy", v)} onChangeMax={(v) => handleChange("synergy_max", v)} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                                        <div className="p-2 bg-zinc-900/50 rounded-sm">
                                            <span className="text-zinc-500">Trait Max:</span>
                                            <span className="text-teal-400 ml-1 font-mono">{synergyData.traitMax}</span>
                                        </div>
                                        <div className="p-2 bg-zinc-900/50 rounded-sm">
                                            <span className="text-zinc-500">Plasm/Turn:</span>
                                            <span className="text-teal-400 ml-1 font-mono">{synergyData.perTurn}</span>
                                        </div>
                                    </div>

                                    <div className="p-2 bg-violet-900/20 border border-violet-500/30 rounded-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] text-violet-400 uppercase tracking-wider">Liminal Aura</span>
                                            <span className="text-xs font-mono text-violet-300">{synergyData.aura}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-zinc-500">Condition:</span>
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                                                synergyData.auraCondition === "N/A" ? "bg-zinc-800 text-zinc-500" :
                                                synergyData.auraCondition === "Anchor" ? "bg-amber-900/30 text-amber-400" :
                                                synergyData.auraCondition === "Open" ? "bg-teal-900/30 text-teal-400" :
                                                "bg-violet-900/30 text-violet-400"
                                            }`}>{synergyData.auraCondition}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Health</label>
                                            <span className="text-[10px] text-zinc-600 font-mono" data-testid="health-count">{filledHealth}/{maxHealth}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isDeadTrack && (
                                                <span className="text-[10px] text-rose-400 font-mono" data-testid="health-dead-label">DEAD</span>
                                            )}
                                            <HealthTrack boxes={healthBoxes} max={maxHealth} onBoxClick={handleHealthBoxClick} />
                                        </div>
                                        {woundPenalty < 0 && (
                                            <p className="text-[10px] text-rose-400 mt-1" data-testid="health-wound-penalty">
                                                Wound Penalty {woundPenalty}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Willpower</label>
                                            <span className="text-[10px] text-zinc-600 font-mono">{getValue("willpower") || 0}/{calculateWillpowerMax()}</span>
                                        </div>
                                        <ResourceTrack current={getValue("willpower") || 0} max={calculateWillpowerMax()} onChange={(v) => handleChange("willpower", v)} color="amber" testIdPrefix="willpower" />
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            <Button
                                                size="sm"
                                                className="h-5 px-2 text-[9px] bg-amber-900/30 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50"
                                                onClick={() => {
                                                    const current = getValue("willpower") || 0;
                                                    const max = calculateWillpowerMax();
                                                    if (current < max) {
                                                        handleChange("willpower", Math.min(current + 1, max));
                                                        toast.success("Willpower +1 (Rest/Virtue/Vice)");
                                                    }
                                                }}
                                                disabled={(getValue("willpower") || 0) >= calculateWillpowerMax()}
                                                data-testid="wp-restore-one"
                                            >
                                                +1 WP
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-5 px-2 text-[9px] bg-amber-900/30 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50"
                                                onClick={() => {
                                                    const max = calculateWillpowerMax();
                                                    handleChange("willpower", max);
                                                    toast.success("Willpower fully restored!");
                                                }}
                                                disabled={(getValue("willpower") || 0) >= calculateWillpowerMax()}
                                                data-testid="wp-restore-full"
                                            >
                                                Full WP
                                            </Button>
                                        </div>
                                        <p className="text-[9px] text-zinc-600 mt-1 leading-relaxed">
                                            +1: Sleep, fulfill Virtue/Vice. Full: Virtue/Vice at great cost, Grave Goods (1/chapter).
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Plasm</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-zinc-600 font-mono">{getValue("plasm") || 0}/{synergyData.maxPlasm}</span>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <span className="text-[10px] px-1 py-0.5 bg-teal-900/30 text-teal-400 rounded font-mono">{synergyData.perTurn}/turn</span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-zinc-900 border-zinc-700"><p className="text-xs">Max expenditure per turn</p></TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                        <ResourceTrack current={getValue("plasm") || 0} max={Math.min(synergyData.maxPlasm, 20)} onChange={(v) => handleChange("plasm", v)} color="teal" testIdPrefix="plasm" />
                                        {synergyData.maxPlasm > 20 && <p className="text-[10px] text-zinc-600 mt-1">Showing first 20 of {synergyData.maxPlasm} max</p>}
                                    </div>
                                </>
                            )}
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
                                <>
                                    {/* Arcana for Mages */}
                                    <div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                                            Arcana
                                            {getValue("path") && (
                                                <span className="ml-2 text-[9px] font-normal">
                                                    <span className="text-blue-400">● Ruling</span>
                                                    <span className="text-red-400 ml-2">● Inferior</span>
                                                </span>
                                            )}
                                        </p>
                                        <div className="space-y-1">
                                            {ARCANA.map((arcanum) => {
                                                const arcanumRating = getNestedValue("arcana", arcanum) || 0;
                                                const currentPath = getValue("path");
                                                const pathData = currentPath ? PATH_ARCANA[currentPath] : null;
                                                const isRuling = pathData?.ruling?.includes(arcanum);
                                                const isInferior = pathData?.inferior === arcanum;
                                                
                                                // Determine label color
                                                let labelColor = arcanumRating > 0 ? 'text-zinc-400' : 'text-zinc-600';
                                                if (isRuling) labelColor = 'text-blue-400 font-medium';
                                                if (isInferior) labelColor = 'text-red-400';
                                                
                                                // Determine dot color
                                                let dotColor = "violet";
                                                if (isRuling) dotColor = "blue";
                                                if (isInferior) dotColor = "red";
                                                
                                                // Get unlocked practices
                                                const unlockedPractices = [];
                                                for (let i = 1; i <= arcanumRating; i++) {
                                                    if (ARCANA_PRACTICES[i]) {
                                                        unlockedPractices.push(...ARCANA_PRACTICES[i]);
                                                    }
                                                }
                                                
                                                return (
                                                    <div key={arcanum} className="flex items-center justify-between group py-0.5">
                                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                                            <button
                                                                onClick={() => arcanumRating > 0 && openSpellcastingPopup(arcanum)}
                                                                disabled={arcanumRating === 0}
                                                                className={`text-xs shrink-0 ${labelColor} ${arcanumRating > 0 ? 'hover:text-violet-300 cursor-pointer' : 'cursor-default'}`}
                                                            >
                                                                {arcanum}
                                                                {isRuling && <span className="ml-1 text-[9px] text-blue-500">(R)</span>}
                                                                {isInferior && <span className="ml-1 text-[9px] text-red-500">(I)</span>}
                                                            </button>
                                                            {/* Show unlocked practices as clickable badges */}
                                                            {arcanumRating > 0 && (
                                                                <div className="flex flex-wrap gap-0.5 overflow-hidden">
                                                                    {unlockedPractices.map((practice, idx) => (
                                                                        <button
                                                                            key={idx}
                                                                            onClick={() => openSpellcastingPopup(arcanum, practice)}
                                                                            className="text-[8px] px-1 py-0.5 rounded bg-violet-900/30 text-violet-400 hover:bg-violet-800/50 hover:text-violet-300 transition-colors"
                                                                        >
                                                                            {practice}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <StatDots value={arcanumRating} max={5} onChange={(v) => handleNestedChange("arcana", arcanum, v)} color={dotColor} size="small" testIdPrefix={`arcanum-${arcanum.toLowerCase()}`} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Rotes for Mages */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Rotes</p>
                                            <Button 
                                                size="sm" 
                                                onClick={() => {
                                                    const rotes = getValue("rotes") || [];
                                                    handleChange("rotes", [...rotes, { spell: "", arcanum: "Death", dots: 1, skill: "occult" }]);
                                                }} 
                                                className="h-5 px-2 text-[10px] btn-secondary" 
                                                data-testid="add-rote-btn"
                                            >
                                                <Plus className="w-3 h-3 mr-1" /> Add
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {(getValue("rotes") || []).length === 0 ? (
                                                <p className="text-[10px] text-zinc-600 italic">No rotes learned</p>
                                            ) : (
                                                (getValue("rotes") || []).map((rote, index) => (
                                                    <div key={index} className="p-2 bg-zinc-900/30 border border-zinc-800 rounded-sm space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Input
                                                                value={rote.spell || ""}
                                                                onChange={(e) => {
                                                                    const rotes = [...(getValue("rotes") || [])];
                                                                    rotes[index] = { ...rotes[index], spell: e.target.value };
                                                                    handleChange("rotes", rotes);
                                                                }}
                                                                placeholder="Spell name"
                                                                className="input-geist h-7 text-xs flex-1 mr-2"
                                                                data-testid={`rote-${index}-spell`}
                                                            />
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                onClick={() => {
                                                                    const rotes = (getValue("rotes") || []).filter((_, i) => i !== index);
                                                                    handleChange("rotes", rotes);
                                                                }}
                                                                className="h-7 w-7 text-zinc-400 hover:text-red-400"
                                                                data-testid={`rote-${index}-delete`}
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <Select value={rote.arcanum || "Death"} onValueChange={(v) => {
                                                                const rotes = [...(getValue("rotes") || [])];
                                                                rotes[index] = { ...rotes[index], arcanum: v };
                                                                handleChange("rotes", rotes);
                                                            }}>
                                                                <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-800 text-xs" data-testid={`rote-${index}-arcanum`}>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                                                    {ARCANA.map(a => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                            <div className="flex items-center justify-center">
                                                                <StatDots 
                                                                    value={rote.dots || 1} 
                                                                    max={5} 
                                                                    onChange={(v) => {
                                                                        const rotes = [...(getValue("rotes") || [])];
                                                                        rotes[index] = { ...rotes[index], dots: v };
                                                                        handleChange("rotes", rotes);
                                                                    }} 
                                                                    color="violet" 
                                                                    size="small" 
                                                                    testIdPrefix={`rote-${index}-dots`} 
                                                                />
                                                            </div>
                                                            <Select value={rote.skill || "occult"} onValueChange={(v) => {
                                                                const rotes = [...(getValue("rotes") || [])];
                                                                rotes[index] = { ...rotes[index], skill: v };
                                                                handleChange("rotes", rotes);
                                                            }}>
                                                                <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-800 text-xs" data-testid={`rote-${index}-skill`}>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[200px]">
                                                                    {SKILL_LIST.map(s => <SelectItem key={s} value={s} className="text-xs capitalize">{formatLabel(s)}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Praxes for Mages */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Praxes</p>
                                            <Button 
                                                size="sm" 
                                                onClick={() => {
                                                    const praxes = getValue("praxes") || [];
                                                    handleChange("praxes", [...praxes, { spell: "", arcanum: "Death", dots: 1 }]);
                                                }} 
                                                className="h-5 px-2 text-[10px] btn-secondary" 
                                                data-testid="add-praxis-btn"
                                            >
                                                <Plus className="w-3 h-3 mr-1" /> Add
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {(getValue("praxes") || []).length === 0 ? (
                                                <p className="text-[10px] text-zinc-600 italic">No praxes learned</p>
                                            ) : (
                                                (getValue("praxes") || []).map((praxis, index) => (
                                                    <div key={index} className="p-2 bg-zinc-900/30 border border-zinc-800 rounded-sm space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Input
                                                                value={praxis.spell || ""}
                                                                onChange={(e) => {
                                                                    const praxes = [...(getValue("praxes") || [])];
                                                                    praxes[index] = { ...praxes[index], spell: e.target.value };
                                                                    handleChange("praxes", praxes);
                                                                }}
                                                                placeholder="Spell name"
                                                                className="input-geist h-7 text-xs flex-1 mr-2"
                                                                data-testid={`praxis-${index}-spell`}
                                                            />
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                onClick={() => {
                                                                    const praxes = (getValue("praxes") || []).filter((_, i) => i !== index);
                                                                    handleChange("praxes", praxes);
                                                                }}
                                                                className="h-7 w-7 text-zinc-400 hover:text-red-400"
                                                                data-testid={`praxis-${index}-delete`}
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Select value={praxis.arcanum || "Death"} onValueChange={(v) => {
                                                                const praxes = [...(getValue("praxes") || [])];
                                                                praxes[index] = { ...praxes[index], arcanum: v };
                                                                handleChange("praxes", praxes);
                                                            }}>
                                                                <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-800 text-xs" data-testid={`praxis-${index}-arcanum`}>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                                                    {ARCANA.map(a => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                            <div className="flex items-center justify-center">
                                                                <StatDots 
                                                                    value={praxis.dots || 1} 
                                                                    max={5} 
                                                                    onChange={(v) => {
                                                                        const praxes = [...(getValue("praxes") || [])];
                                                                        praxes[index] = { ...praxes[index], dots: v };
                                                                        handleChange("praxes", praxes);
                                                                    }} 
                                                                    color="violet" 
                                                                    size="small" 
                                                                    testIdPrefix={`praxis-${index}-dots`} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Attainments (auto-calculated from Arcana) */}
                                    <div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Attainments</p>
                                        <div className="space-y-1">
                                            {(() => {
                                                const arcanaValues = getValue("arcana") || {};
                                                const attainments = [];
                                                ARCANA.forEach(arcanum => {
                                                    const rating = arcanaValues[arcanum] || 0;
                                                    for (let dot = 1; dot <= rating; dot++) {
                                                        const attainment = MAGE_ATTAINMENTS[arcanum]?.[dot];
                                                        if (attainment) {
                                                            attainments.push({ arcanum, dot, ...attainment });
                                                        }
                                                    }
                                                });
                                                if (attainments.length === 0) {
                                                    return <p className="text-[10px] text-zinc-600 italic">Gain Arcana dots to unlock attainments</p>;
                                                }
                                                return attainments.map((att, i) => (
                                                    <TooltipProvider key={i}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="flex items-start gap-2 text-xs cursor-help p-1 rounded hover:bg-zinc-800/50">
                                                                    <span className="text-violet-400 font-mono shrink-0">{"●".repeat(att.dot)}</span>
                                                                    <span className="text-zinc-500 shrink-0">{att.arcanum}:</span>
                                                                    <span className="text-zinc-300">{att.name}</span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-zinc-900 border-zinc-700 max-w-xs">
                                                                <p className="text-xs text-zinc-300">{att.description}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Original Geist content */}
                                    <div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Haunts</p>
                                        <div className="space-y-1">
                                            {HAUNTS.map((haunt) => {
                                                const hauntRating = getNestedValue("haunts", haunt) || 0;
                                                return (
                                                    <div key={haunt} className="flex items-center justify-between group">
                                                        <button
                                                            onClick={() => hauntRating > 0 && openHauntRollPopup(haunt)}
                                                            className={`text-xs flex items-center gap-1 transition-colors ${
                                                                hauntRating > 0 
                                                                    ? 'text-zinc-400 hover:text-teal-300 cursor-pointer' 
                                                                    : 'text-zinc-600 cursor-default'
                                                            }`}
                                                            disabled={hauntRating === 0}
                                                            data-testid={`haunt-${haunt.toLowerCase().replace(/\s+/g, '-')}-label`}
                                                        >
                                                            <Dices className={`w-2.5 h-2.5 transition-opacity ${hauntRating > 0 ? 'opacity-0 group-hover:opacity-100 text-teal-500' : 'opacity-0'}`} />
                                                            {haunt}
                                                        </button>
                                                        <StatDots value={hauntRating} max={5} onChange={(v) => handleNestedChange("haunts", haunt, v)} color="teal" size="small" testIdPrefix={`haunt-${haunt.toLowerCase().replace(/\s+/g, '-')}`} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                                            Available Keys 
                                            <span className="text-teal-400 ml-1">({allAvailableKeys.length})</span>
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {KEYS.map((key) => {
                                                const isCharacterKey = getValue("innate_key") === key;
                                                const isGeistKey = getValue("geist_innate_key") === key;
                                                const isMementoKey = (getValue("mementos") || []).some(m => m.key === key);
                                                const isAvailable = allAvailableKeys.includes(key);
                                                const isDoomed = doomedKeys.has(key);
                                                const doomSource = doomedKeySources[key];

                                                let badges = [];
                                                if (isCharacterKey) badges.push("C");
                                                if (isGeistKey) badges.push("G");
                                                if (isMementoKey) badges.push("M");
                                                if (isDoomed) badges.push("D");

                                                return (
                                                    <TooltipProvider key={key}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className={`px-2 py-0.5 text-[10px] rounded-sm border transition-all ${
                                                                    isDoomed
                                                                        ? "bg-rose-950/30 border-rose-500/50 text-rose-300"
                                                                        : isAvailable
                                                                        ? "bg-amber-900/30 border-amber-500/50 text-amber-300"
                                                                        : "bg-zinc-900 border-zinc-800 text-zinc-600"
                                                                }`}>
                                                                    {key}
                                                                    {badges.length > 0 && (
                                                                        <span className="ml-1 text-[8px] text-amber-200">
                                                                            [{badges.join("+")}]
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-zinc-900 border-zinc-700">
                                                                <p className="text-xs">
                                                                    {isCharacterKey && "Character's Innate Key"}
                                                                    {isCharacterKey && (isGeistKey || isMementoKey) && " + "}
                                                                    {isGeistKey && "Geist's Innate Key"}
                                                                    {isGeistKey && isMementoKey && " + "}
                                                                    {isMementoKey && "From Memento"}
                                                                    {isDoomed && doomSource && `Doomed: ${doomSource}`}
                                                                    {isDoomed && !doomSource && "Doomed"}
                                                                    {!isAvailable && !isDoomed && "Not available"}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Mementos */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Mementos</p>
                                            <Button size="sm" onClick={addMemento} className="h-5 px-2 text-[10px] btn-secondary" data-testid="add-memento-btn">
                                                <Plus className="w-3 h-3 mr-1" /> Add
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {mementos.length === 0 ? (
                                                <p className="text-[10px] text-zinc-600 italic">No mementos yet</p>
                                            ) : (
                                                mementos.map((memento, index) => (
                                                    <MementoCard key={memento.id || index} memento={memento} index={index} onUpdate={(data) => updateMemento(index, data)} onDelete={() => deleteMemento(index)} />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
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
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Merits</label>
                                    <Dialog open={showMeritDialog} onOpenChange={setShowMeritDialog}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="h-5 px-2 text-[10px] btn-secondary" data-testid="open-add-merit-dialog"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-zinc-900 border-zinc-800">
                                            <DialogHeader>
                                                <DialogTitle className="text-zinc-100 font-heading">Add Merit</DialogTitle>
                                                <DialogDescription className="text-zinc-400">Select a merit and set its rating</DialogDescription>
                                            </DialogHeader>
                                            <Select value={newMeritName} onValueChange={(v) => {
                                                setNewMeritName(v);
                                                const merit = MERIT_LIST.find(m => m.name === v);
                                                if (merit) {
                                                    const min = merit.minDots || 1;
                                                    const max = merit.maxDots || 5;
                                                    // For fixed-dot merits, auto-set to that value
                                                    if (min === max) {
                                                        setNewMeritDots(max);
                                                    } else if (newMeritDots < min) {
                                                        setNewMeritDots(min);
                                                    } else if (newMeritDots > max) {
                                                        setNewMeritDots(max);
                                                    }
                                                }
                                            }}>
                                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800" data-testid="select-merit-dropdown"><SelectValue placeholder="Select merit..." /></SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[200px]">
                                                    {MERIT_LIST.map((m) => (
                                                        <SelectItem key={m.name} value={m.name} className="text-zinc-200">
                                                            {m.name} ({getMeritDotDisplay(m)})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="space-y-2">
                                                <Input value={newMeritName} onChange={(e) => setNewMeritName(e.target.value)} placeholder="Or enter custom merit name" className="input-geist" data-testid="custom-merit-name-input" />
                                                {!isFixedDotMerit && (
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm text-zinc-400">Rating ({minDotsForMerit} to {maxDotsForMerit}):</label>
                                                        <StatDots value={newMeritDots} max={maxDotsForMerit} onChange={(v) => setNewMeritDots(Math.max(minDotsForMerit, v))} color="amber" testIdPrefix="new-merit-rating" />
                                                    </div>
                                                )}
                                                {isFixedDotMerit && selectedMerit && (
                                                    <p className="text-xs text-zinc-500">This merit has a fixed rating of {maxDotsForMerit} dot{maxDotsForMerit > 1 ? 's' : ''}.</p>
                                                )}
                                            </div>
                                            <Button onClick={addMerit} className="w-full btn-primary" disabled={!newMeritName} data-testid="add-merit-btn">Add Merit</Button>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="space-y-1">
                                    {meritsList.length === 0 ? (
                                        <p className="text-[10px] text-zinc-600 italic">No merits added</p>
                                    ) : (
                                        sortedMeritsList.map((merit, index) => (
                                            <MeritCard
                                                key={merit.id || index}
                                                merit={merit}
                                                index={index}
                                                onDelete={() => deleteMerit(merit.id || null)}
                                                onUpdate={(data) => updateMerit(merit.id || null, data)}
                                                onRollPerception={() => openDicePopup("perception")}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                            
                            {/* Ceremonies Section - Geist only */}
                            {!isMage && (
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] text-violet-400 uppercase tracking-wider">Ceremonies</label>
                                    <Dialog open={showCeremonyDialog} onOpenChange={setShowCeremonyDialog}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="h-5 px-2 text-[10px] bg-violet-900/30 border border-violet-500/50 text-violet-200 hover:bg-violet-800/40" data-testid="open-add-ceremony-dialog">
                                                <Plus className="w-3 h-3 mr-1" /> Add
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-zinc-900 border-zinc-800">
                                            <DialogHeader>
                                                <DialogTitle className="text-zinc-100 font-heading">Add Ceremony</DialogTitle>
                                                <DialogDescription className="text-zinc-400">Select a krewe ceremony to learn</DialogDescription>
                                            </DialogHeader>
                                            <Select value={newCeremonyName} onValueChange={setNewCeremonyName}>
                                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800" data-testid="select-ceremony-dropdown">
                                                    <SelectValue placeholder="Select ceremony..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[300px]">
                                                    {[1, 2, 3, 4, 5].map(dotLevel => (
                                                        <div key={dotLevel}>
                                                            <div className="px-2 py-1 text-[10px] text-violet-400 uppercase tracking-wider bg-zinc-800/50">
                                                                {"●".repeat(dotLevel)} {dotLevel}-Dot Ceremonies
                                                            </div>
                                                            {CEREMONY_LIST.filter(c => c.dots === dotLevel).map((c) => (
                                                                <SelectItem key={c.name} value={c.name} className="text-zinc-200">
                                                                    <div className="flex flex-col">
                                                                        <span>{c.name}</span>
                                                                        <span className="text-[10px] text-teal-400">{c.dicePool}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="space-y-2">
                                                <Input 
                                                    value={newCeremonyName} 
                                                    onChange={(e) => setNewCeremonyName(e.target.value)} 
                                                    placeholder="Or enter custom ceremony name" 
                                                    className="input-geist" 
                                                    data-testid="custom-ceremony-name-input" 
                                                />
                                            </div>
                                            <Button onClick={addCeremony} className="w-full bg-violet-900/50 border border-violet-500/50 text-violet-200 hover:bg-violet-800/50" disabled={!newCeremonyName} data-testid="add-ceremony-btn">
                                                Add Ceremony
                                            </Button>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="space-y-1">
                                    {ceremoniesList.length === 0 ? (
                                        <p className="text-[10px] text-zinc-600 italic">No ceremonies learned</p>
                                    ) : (
                                        sortedCeremoniesList.map((ceremony, index) => (
                                            <CeremonyCard
                                                key={index}
                                                ceremony={ceremony}
                                                index={index}
                                                onDelete={() => deleteCeremony(index)}
                                                onRoll={() => rollCeremonyFromCharacter(ceremony.name)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                            )}
                                                     
                        </CollapsibleContent>
                    </Collapsible>
                    {/* Notes */}
                    <Collapsible
                        open={expandedSections.notes}
                        onOpenChange={() => toggleSection("notes")}
>
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-2 bg-zinc-900/40 border border-zinc-800 rounded-sm">
                                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Notes</span>
                            </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-2">
                            <Textarea
                                value={getValue("notes") || ""}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                className="bg-zinc-900 border-zinc-700 text-zinc-200"
                                rows={6}
                            />
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
                        geistRank={getValue("geist_rank") || 1}
                        woundPenalty={getValue("wound_penalty") || 0}
                        currentPlasm={getValue("plasm") || 0}
                        preset={dicePopupPreset}
                        forceExpanded={true}
                    />
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
                    onClose={() => { setSpellcastingOpen(false); setSpellcastingArcanum(null); setSpellcastingPractice(null); }}
                    arcanum={spellcastingArcanum}
                    arcanumDots={getNestedValue("arcana", spellcastingArcanum) || 0}
                    gnosis={getValue("gnosis") || 1}
                    isRuling={getValue("path") && PATH_ARCANA[getValue("path")]?.ruling?.includes(spellcastingArcanum)}
                    isInferior={getValue("path") && PATH_ARCANA[getValue("path")]?.inferior === spellcastingArcanum}
                    currentMana={getValue("mana") || 0}
                    initialPractice={spellcastingPractice}
                    orderRoteSkills={isMage && getValue("order") ? ORDER_ROTE_SKILLS[getValue("order")] || [] : []}
                    onSpendMana={(amount) => handleChange("mana", Math.max(0, (getValue("mana") || 0) - amount))}
                    onRollDice={(spellData) => {
                        if (onTriggerDiceRoll) {
                            onTriggerDiceRoll(spellData);
                        }
                    }}
                />
            )}

        </div>
    );
};