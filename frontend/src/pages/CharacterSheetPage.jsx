import { getAbyssalScouringPatch } from "@/utils/abyssalScouring";
import { findAbyssalIndex, needsParadoxSuccesses, validParadoxSuccesses } from "@/utils/abyssalSpellcasting";
import { isAbyssalCondition, isAbyssalTaint, startAbyssalCondition } from "@/utils/abyssalConditions";
import { reconcileCharacterDelta } from "@/utils/characterDelta";
import { withoutXPHistory } from "@/utils/xpHistoryLoading";
import { toCharacterSummary, updateCharacterSummary } from "@/utils/characterSummaries";
import { TimeElapsedDialog } from "@/components/TimeElapsedDialog";
import { prepareTimeTransition } from "@/utils/timeTransitionSummary";
import { retainActiveSpells } from "@/utils/activeSpellRetention";
import { useState, useEffect, useRef } from "react";
import { CharacterPanel } from "@/components/CharacterPanel";
import { GameCardsPanel } from "@/components/GameCardsPanel";
import { DiceRoller } from "@/components/DiceRoller";
import { QuickDiceRoller } from "@/components/QuickDiceRoller";
import axios from "axios";
import { toast } from "sonner";
import { normalizeHealthBoxes, getHealthCounts, buildHealthBoxes } from "@/components/character/StatComponents";
import { advanceSceneTime, sleepUntilMorning } from "@/utils/timeUtils";
import { expireTimedEffects, startTimedEffect, getGameTimestamp, advanceTurnEffects, expireCombatEffects, withGameClockCheckpoint, isGameClockBehind, isEffectExpired } from "@/utils/effectDuration";
import { resolveArmoredDamage } from "@/utils/combatRules";
import { advanceNaturalHealing, restartNaturalHealing } from "@/utils/naturalHealing";
import { advanceEnvironmentalExposure } from "@/utils/environmentalExposure";
import { environmentalTurnHazards, exposurePenalty, temperatureExposure, getEnvironmentalRollModifiers, activeEnvironmentalTiltNames } from "@/utils/environmentalTilts";
import { restoreScouredAttributes } from "@/utils/mageRecovery";
import { addWoundDamage, applyResolvedDamage, healWound, hasHealableWound, normalizeResistance, toggleResistance } from "@/utils/resistantWounds";
import { useCharacterSync } from "@/hooks/useCharacterSync";
import { getEndScenePatch } from "@/utils/sceneLifecycle";
import { applyPendingCharacterPatches, isStaleCharacterSnapshot, resolveCharacterUpdate } from "@/utils/characterUpdateQueue";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const CharacterSheetPage = () => {
    const [characters, setCharacters] = useState([]);
    const [activeCharacter, setActiveCharacter] = useState(null);
    const [rollColumnCollapsed, setRollColumnCollapsed] = useState(false);
    const [timeSummaries, setTimeSummaries] = useState([]);

    const diceRollerRef = useRef(null);
    const ceremonyRollRef = useRef(null);
    const latestCharacterRef = useRef(null);
    const characterWriteQueuesRef = useRef(new Map());
    const pendingCharacterPatchesRef = useRef(new Map());
    const confirmedCharacterRef = useRef(null);
    const selectionRequestRef = useRef(0);
    const deletingCharactersRef = useRef(new Set());

    const overlayPending = (snapshot) => {
        const pending = pendingCharacterPatchesRef.current.get(snapshot.id) || [];
        return withoutXPHistory(pending.length ? applyPendingCharacterPatches(snapshot, pending) : snapshot);
    };
    const refreshSummary = (snapshot) => setCharacters(list => updateCharacterSummary(list, snapshot));
    const activateCharacter = (snapshot) => {
        selectionRequestRef.current += 1;
        confirmedCharacterRef.current = withoutXPHistory(snapshot);
        const next = snapshot ? overlayPending(snapshot) : null;
        latestCharacterRef.current = next;
        setActiveCharacter(next);
    };
    const acceptCharacterSnapshot = (snapshot) => {
        if (!snapshot?.id) return;
        if (latestCharacterRef.current?.id !== snapshot.id) {
            refreshSummary(snapshot);
            return;
        }
        const confirmed = confirmedCharacterRef.current;
        if (confirmed?.id !== snapshot.id || !isStaleCharacterSnapshot(confirmed, snapshot)) {
            confirmedCharacterRef.current = withoutXPHistory(snapshot);
        }
        const next = overlayPending(confirmedCharacterRef.current);
        latestCharacterRef.current = next;
        setActiveCharacter(next);
        refreshSummary(next);
    };
    const acceptCharacterMessage = async (message) => {
        if (message?.type !== 'character_delta') { acceptCharacterSnapshot(message); return true; }
        if (latestCharacterRef.current?.id !== message.id) {
            if (message.summary?.id === message.id) refreshSummary(message.summary);
            return true;
        }
        const result = reconcileCharacterDelta(confirmedCharacterRef.current, message);
        if (result.snapshot) {
            // Reapply pending writes even for a duplicate acknowledgement.
            acceptCharacterSnapshot(result.snapshot);
            return true;
        }
        try {
            const response = await axios.get(`${API}/characters/${message.id}?include_xp_history=false`);
            acceptCharacterSnapshot(response.data);
            return true;
        } catch (error) {
            toast.error('Character synchronisation could not recover a missing revision. Reload before continuing.');
            return false;
        }
    };
    const selectCharacter = async (summary) => {
        const request = ++selectionRequestRef.current;
        if (!summary?.id || deletingCharactersRef.current.has(summary.id)) return false;
        if (latestCharacterRef.current?.id === summary.id) return true;
        try {
            await (characterWriteQueuesRef.current.get(summary.id) || Promise.resolve());
            const response = await axios.get(`${API}/characters/${summary.id}?include_xp_history=false`);
            if (request !== selectionRequestRef.current || deletingCharactersRef.current.has(summary.id)) return false;
            activateCharacter(response.data);
            refreshSummary(response.data);
            return true;
        } catch (error) {
            if (request === selectionRequestRef.current) toast.error('Failed to load character');
            return false;
        }
    };
    const loadCharacterForExport = async (id) => {
        await (characterWriteQueuesRef.current.get(id) || Promise.resolve());
        const response = await axios.get(`${API}/characters/${id}`);
        return response.data;
    };
    const lastCharacterStorageKey = "geistroller-last-active-character-id";

    useCharacterSync(activeCharacter?.id, (updatedCharacter) => {
        if (latestCharacterRef.current?.id === updatedCharacter.id) void acceptCharacterMessage(updatedCharacter);
    });

    const triggerDiceRoll = (config) => {
        setRollColumnCollapsed(false);
        // Spellcasting factors already contain the temperature penalty; Paradox and
        // Wisdom resistance are distinct mechanical pools.
        const excluded = ['spell', 'paradox', 'wisdom'].includes(config?.summaryKey);
        const character = latestCharacterRef.current || activeCharacter || {};
        const contexts = !excluded && !config?.chance && config?.environmentContext;
        const environmental = contexts
            ? getEnvironmentalRollModifiers({ character, ...config.environmentContext })
            : { modifier: !excluded && !config?.chance ? exposurePenalty(character) : 0, breakdown: [] };
        const penalty = environmental.modifier;
        const raw = (Number(config?.pool) || 0) + penalty;
        const detail = environmental.breakdown.length
            ? environmental.breakdown.map(item => item.name + ' ' + item.amount).join(', ')
            : 'Extreme Temperature ' + penalty;
        const rollConfig = penalty < 0 ? {
            ...config, pool: Math.max(1, raw), chance: raw <= 0,
            dicePoolBreakdown: (config?.dicePoolBreakdown || String(config?.pool || 0) + ' dice') +
                ' + ' + detail,
        } : config;
        // Combat Tracker and resistance rolls report contextual Physical actions.
        // If one fails dramatically on Ice, add Knocked Down once, after the
        // user has accepted or converted the failure. Preserve other callbacks.
        const physicalRoll = !!config?.environmentContext?.physical && !excluded;
        const recorded = physicalRoll ? { ...rollConfig, onResult: async (result) => {
            if (result?.is_dramatic_failure && activeEnvironmentalTiltNames(latestCharacterRef.current || activeCharacter).has('Ice')) {
                await updateCharacter((latest) => {
                    if ((latest.conditions || []).some((entry) => entry?.name === 'Knocked Down' && entry?.status !== 'expired')) return null;
                    return { conditions: [...(latest.conditions || []), { name: 'Knocked Down', type: 'tilt',
                        group: 'tilt-personal', origin: 'Ice',
                        description: 'Fell because of a dramatic failure on ice.',
                        resolution: 'Stand up or otherwise regain footing.' }] };
                });
            }
            if (typeof config.onResult === 'function') return config.onResult(result);
        } } : rollConfig;
        diceRollerRef.current?.rollWithConfig(recorded);
    };

    const addRecentRoll = (entry) => {
        setRollColumnCollapsed(false);
        diceRollerRef.current?.addHistoryEntry(entry);
    };

    const getCharacterAttributeForDerivedTrait = (character, attr, fallback = 0) => {
        const rawValue = character?.attributes?.[attr];
        const currentValue = Number.isFinite(Number(rawValue)) ? Number(rawValue) : fallback;

        if (!character || !["strength", "dexterity", "stamina"].includes(attr)) return currentValue;

        const hasLifeTwo = (character?.arcana?.Life || 0) >= 2;
        if (!hasLifeTwo) return currentValue;

        const scoured = character?.scoured_attributes || {};
        return currentValue + Math.max(0, Number(scoured[attr]) || 0);
    };


    const applyIncomingCombatDamage = async ({ amount, damageType, sourceProfile, resistant = false }) => {
        const character = latestCharacterRef.current || activeCharacter;
        if (!character || !amount || amount <= 0) return;

        const meritsList = character?.merits_list || [];
        const hasGiant = meritsList.some((m) => (m?.name || "") === "Giant");
        const hasSmallFramed = meritsList.some((m) => (m?.name || "") === "Small-Framed");
        const size = 5 + (hasGiant ? 1 : 0) + (hasSmallFramed ? -1 : 0);
        const stamina = getCharacterAttributeForDerivedTrait(character, "stamina", 0);
        const maxHealth = stamina + size;

        const inventoryItems = character?.inventory_items || [];
        const equippedArmor = inventoryItems.find((it) => it?.type === "armor" && !!it?.equipped) || null;
        const equippedArmorGeneral = equippedArmor?.armor?.general ?? 0;
        const equippedArmorBallistic = equippedArmor?.armor?.ballistic ?? 0;
        const damage = resolveArmoredDamage({
            amount, damageType, sourceProfile, equippedGeneral: equippedArmorGeneral,
            equippedBallistic: equippedArmorBallistic,
            mageArmor: character?.character_type === 'mage' ? character?.active_mage_armor : null,
            mageArmorDots: character?.arcana?.[character?.active_mage_armor] || 0,
        });
        const remaining = damage.aggravated + damage.lethal + damage.bashing;
        if (remaining <= 0) {
            toast.info('Incoming damage was fully absorbed.');
            return;
        }

        const startingBoxes = normalizeHealthBoxes(
            character?.health_boxes,
            maxHealth,
            character?.health || 0
        );
        const damaged = applyResolvedDamage(startingBoxes, character?.resistant_wounds || [], damage, resistant);
        if (!damaged.applied) { toast.info('No further damage could be recorded on the Health track.'); return; }
        const updatedBoxes = damaged.boxes;
        const filled = updatedBoxes.filter((state) => state !== "empty").length;
        const saved = await updateCharacter({
            health_boxes: updatedBoxes,
            resistant_wounds: damaged.resistant_wounds,
            health: filled,
            natural_healing: restartNaturalHealing(updatedBoxes, character?.scene_tracker),
        });

        if (saved) {
            const applied = damaged.appliedByType;
            toast.info(`${applied.aggravated} aggravated, ${applied.lethal} lethal, ${applied.bashing} bashing ${resistant === true ? 'resistant ' : ''}damage applied.`);
        }
    };

    const meritsList = activeCharacter?.merits_list || [];
    const hasGiant = meritsList.some((m) => (m?.name || "") === "Giant");
    const hasSmallFramed = meritsList.some((m) => (m?.name || "") === "Small-Framed");
    const combatSize = 5 + (hasGiant ? 1 : 0) + (hasSmallFramed ? -1 : 0);
    const combatStamina = getCharacterAttributeForDerivedTrait(activeCharacter, "stamina", 0);
    const combatMaxHealth = combatStamina + combatSize;

    const combatHealthBoxes = normalizeHealthBoxes(
        activeCharacter?.health_boxes,
        combatMaxHealth,
        activeCharacter?.health || 0
    );

    const combatResistantWounds = normalizeResistance(combatHealthBoxes, activeCharacter?.resistant_wounds);
    const combatFilledHealth = combatHealthBoxes.filter((state) => state !== "empty").length;
    const combatIsDeadTrack =
        combatHealthBoxes.length > 0 &&
        combatHealthBoxes.every((state) => state === "aggravated");

    const combatWoundPenalty =
        combatFilledHealth >= combatMaxHealth
            ? -3
            : combatFilledHealth >= combatMaxHealth - 1
            ? -2
            : combatFilledHealth >= combatMaxHealth - 2
            ? -1
            : 0;

    const toggleResistantCombatWound = async (index) => {
        if (!activeCharacter) return;
        await updateCharacter({ resistant_wounds: toggleResistance(combatHealthBoxes, combatResistantWounds, index) });
    };

    const healCombatHealthState = async (stateToHeal) => {
        if (!activeCharacter) return;
        // Manual Heal controls are Storyteller corrections, including Resistant wounds.
        const healed = healWound(combatHealthBoxes, combatResistantWounds, stateToHeal, true);
        if (!healed) return;
        await updateCharacter({
            health_boxes: healed.boxes,
            resistant_wounds: healed.resistant_wounds,
            health: healed.boxes.filter((state) => state !== "empty").length,
            natural_healing: restartNaturalHealing(healed.boxes, activeCharacter?.scene_tracker),
        });
    };

    const handlePatternRestoration = async (damageType = null) => {
        if (!activeCharacter || activeCharacter.character_type !== "mage") return;
        const currentMana = Number(activeCharacter?.mana) || 0;
        const improved = (activeCharacter?.arcana?.Life || 0) >= 2;
        const selectedType = damageType ||
            (hasHealableWound(combatHealthBoxes, combatResistantWounds, "lethal") ? "lethal" :
             hasHealableWound(combatHealthBoxes, combatResistantWounds, "bashing") ? "bashing" : null);
        if (!selectedType) { toast.info("No non-Resistant wounds available for Pattern Restoration."); return; }
        const healed = healWound(combatHealthBoxes, combatResistantWounds, selectedType, false);
        if (!healed) { toast.info("Resistant damage cannot be healed using Pattern Restoration."); return; }
        const manaCost = improved ? (selectedType === "bashing" ? 1 : 2) : 3;
        if (currentMana < manaCost) { toast.error(`Pattern Restoration requires ${manaCost} Mana.`); return; }
        await updateCharacter({
            mana: currentMana - manaCost,
            health_boxes: healed.boxes,
            resistant_wounds: healed.resistant_wounds,
            health: healed.boxes.filter((state) => state !== "empty").length,
            natural_healing: restartNaturalHealing(healed.boxes, activeCharacter?.scene_tracker),
        });
        toast.success(`Healed 1 ${selectedType} wound for ${manaCost} Mana.`);
    };

    const patternRestorationDisabled =
        activeCharacter?.character_type !== "mage" ||
        (() => {
            const hasDamage = hasHealableWound(combatHealthBoxes, combatResistantWounds, "lethal") ||
                hasHealableWound(combatHealthBoxes, combatResistantWounds, "bashing");

            const hasImproved =
                (activeCharacter?.arcana?.Life || 0) >= 2;

            const minimumMana = hasImproved ? 1 : 3;

            return (
                !hasDamage ||
                (activeCharacter?.mana || 0) < minimumMana
            );
        })();

    const resolveEnvironmentalTurnHazards = (hazards, index = 0) => {
        if (index >= hazards.length) return;
        const hazard = hazards[index];
        const current = latestCharacterRef.current || activeCharacter || {};
        const attributes = current.attributes || {}, skills = current.skills || {};
        const attr = hazard.name === 'Earthquake' ? 'stamina' : 'dexterity';
        const pool = (Number(attributes[attr]) || 0) + (Number(skills.athletics) || 0);
        triggerDiceRoll({
            pool: Math.max(1,pool), chance: pool <= 0,
            label: hazard.name + ': resist ' + hazard.damage + ' ' + hazard.type + ' damage',
            dicePoolBreakdown: attr + ' ' + (attributes[attr]||0) + ' + Athletics ' + (skills.athletics||0),
            summaryKey: 'environment',
            environmentContext: { physical: true, dexterity: attr === 'dexterity' },
            onResult: async (result) => {
                const successes = Number(result?.successes) || 0;
                const isQuake = hazard.name === 'Earthquake';
                const avoided = isQuake ? !!result?.is_exceptional : successes > 0;
                const kind = isQuake && !avoided && successes > 0 ? 'bashing' : hazard.type;
                if (!avoided) {
                    await updateCharacter((latest) => {
                        const giant = (latest.merits_list || []).some(m=>m.name==='Giant');
                        const small = (latest.merits_list || []).some(m=>m.name==='Small-Framed');
                        const max = (Number(latest.attributes?.stamina)||0) + 5 + (giant?1:0)-(small?1:0);
                        const boxes = normalizeHealthBoxes(latest.health_boxes, max, latest.health || 0);
                        const damaged = addWoundDamage(boxes, latest.resistant_wounds || [], kind, hazard.damage, false);
                        return { health_boxes: damaged.boxes, resistant_wounds: damaged.resistant_wounds,
                            health: damaged.boxes.filter(x=>x!=='empty').length,
                            natural_healing: restartNaturalHealing(damaged.boxes, latest.scene_tracker) };
                    });
                }
                resolveEnvironmentalTurnHazards(hazards, index + 1);
            },
        });
    };

    const handleCombatEndTurn = async () => {
        const currentCharacter = latestCharacterRef.current || activeCharacter;
        if (!currentCharacter || !currentCharacter.combat_active) return false;
        const effects = currentCharacter.active_spells || [];
        const ticked = advanceTurnEffects(effects);
        const conditionsBefore = currentCharacter.conditions || [];
        const tickedConditions = advanceTurnEffects(conditionsBefore);
        if (ticked !== effects || tickedConditions !== conditionsBefore) {
            const saved = await updateCharacter({
                ...(ticked !== effects ? { active_spells: ticked } : {}),
                ...(tickedConditions !== conditionsBefore ? { conditions: tickedConditions } : {}),
            }, { kind: "turn" });
            if (saved !== true) return false;
        }

        const conditions = (currentCharacter.conditions || []).filter((entry) => entry?.status !== "expired");
        const hasModeratePoison = conditions.some(
            (condition) => (condition?.name || "") === "Poisoned (Moderate)"
        );
        const hasGravePoison = conditions.some(
            (condition) => (condition?.name || "") === "Poisoned (Grave)"
        );

        if (hasModeratePoison) {
            await applyIncomingCombatDamage({
                amount: 1,
                damageType: "bashing",
                sourceProfile: "poison",
            });
        }

        if (hasGravePoison) {
            await applyIncomingCombatDamage({
                amount: 1,
                damageType: "lethal",
                sourceProfile: "poison",
            });
        }
        const hazards = environmentalTurnHazards(currentCharacter);
        if (hazards.length) resolveEnvironmentalTurnHazards(hazards);
        return true;
    };

    // A spent installment consumes one Action. All turn effects have been advanced.
    const handleCombatSleep = async () => {
        if (!activeCharacter) return;

        const currentTracker = activeCharacter?.scene_tracker || {};
        if (getGameTimestamp(currentTracker) === null) {
            toast.error("Set an in-game date and time before sleeping.");
            return;
        }
        if (isGameClockBehind(currentTracker)) { toast.error("Restore the processed game date and time before sleeping."); return; }
        const nextTime = sleepUntilMorning(currentTracker);
        const nextTracker = withGameClockCheckpoint(currentTracker,{ ...currentTracker, date: nextTime.date, time: nextTime.time });
        const healing = advanceEnvironmentalExposure(activeCharacter, nextTracker, combatHealthBoxes, combatResistantWounds);
        const updatedBoxes = healing.boxes;
        const filled = updatedBoxes.filter((state) => state !== "empty").length;

        const resolve = activeCharacter?.attributes?.resolve || 1;
        const composure = activeCharacter?.attributes?.composure || 1;
        const willpowerModifier = activeCharacter?.willpower_max_modifier || 0;
        const maxWillpower = Math.max(0, resolve + composure + willpowerModifier);
        const currentWillpower = activeCharacter?.willpower || 0;
        const spells = activeCharacter?.active_spells || [];
        const expiredSpells = expireCombatEffects(expireTimedEffects(spells, nextTracker));
        const beforeConditions = activeCharacter?.conditions || [];
        const expiredConditions = expireCombatEffects(expireTimedEffects(beforeConditions, nextTracker));
        const restoredAttributes = restoreScouredAttributes(activeCharacter, nextTracker);

        await updateCharacter({
            ...restoredAttributes,
            health_boxes: updatedBoxes,
            resistant_wounds: healing.resistant_wounds,
            health: filled,
            natural_healing: healing.recovery,
            willpower: Math.min(maxWillpower, currentWillpower + 1),
            combat_active: false,
            scene_tracker: healing.tracker,
            ...(expiredSpells !== spells ? { active_spells: expiredSpells } : {}),
            ...(expiredConditions !== beforeConditions ? { conditions: expiredConditions } : {}),
        }, { kind: "sleep", healing });
    };

    const handleAdvanceTime = async (hours = 0, minutes = 0, extraUpdates = {}) => {
        if (!activeCharacter) return;
        const currentTracker = activeCharacter?.scene_tracker || {};
        if (getGameTimestamp(currentTracker) === null) {
            toast.error("Set an in-game date and time before advancing time.");
            return;
        }
        const next = advanceSceneTime(currentTracker, hours, minutes);
        const nextTracker = withGameClockCheckpoint(currentTracker,{ ...currentTracker, date: next.date, time: next.time });
        const healing = advanceEnvironmentalExposure(activeCharacter, nextTracker, combatHealthBoxes, combatResistantWounds);
        const restoredAttributes = restoreScouredAttributes(activeCharacter, nextTracker);
        const spells = activeCharacter?.active_spells || [];
        const expiredSpells = expireTimedEffects(spells, nextTracker);
        const previousConditions = activeCharacter?.conditions || [];
        const expiredConditions = expireTimedEffects(previousConditions, nextTracker);
        await updateCharacter({
            scene_tracker: healing.tracker,
            ...restoredAttributes,
            ...extraUpdates,
            natural_healing: healing.recovery,
            ...(healing.healed > 0 || healing.bashing > 0 || healing.lethal > 0 ? {
                health_boxes: healing.boxes,
                resistant_wounds: healing.resistant_wounds,
                health: healing.boxes.filter((state) => state !== "empty").length,
            } : {}),
            ...(expiredSpells !== spells ? { active_spells: expiredSpells } : {}),
            ...(expiredConditions !== previousConditions ? { conditions: expiredConditions } : {}),
        }, { kind: "clock", healing });
    };

    // Fetch characters on mount
    useEffect(() => {
        fetchCharacters();
    }, []);

    useEffect(() => {
        if (activeCharacter?.id) {
            localStorage.setItem(lastCharacterStorageKey, activeCharacter.id);
        }
    }, [activeCharacter?.id, lastCharacterStorageKey]);

    const fetchCharacters = async () => {
        try {
            const request = selectionRequestRef.current;
            const response = await axios.get(`${API}/character-summaries`);
            if (request !== selectionRequestRef.current) return;
            const fetchedCharacters = response.data.map(toCharacterSummary);
            setCharacters(fetchedCharacters);
            if (fetchedCharacters.length) {
                const savedCharacterId = localStorage.getItem(lastCharacterStorageKey);
                await selectCharacter(fetchedCharacters.find(c => c.id === savedCharacterId) || fetchedCharacters[0]);
            } else {
                activateCharacter(null);
            }
        } catch (error) {
            console.error("Failed to fetch characters:", error);
        }
    };

    const createCharacter = async (characterType = "geist") => {
        try {
            const defaultName = characterType === "mage"
                ? `Mage ${characters.filter(c => c.character_type === "mage").length + 1}`
                : `Sin-Eater ${characters.filter(c => c.character_type !== "mage").length + 1}`;
            const response = await axios.post(`${API}/characters`, {
                name: defaultName,
                character_type: characterType
            });
            setCharacters(list => [...list, toCharacterSummary(response.data)]);
            activateCharacter(response.data);
            toast.success(`New ${characterType === "mage" ? "Mage" : "Sin-Eater"} created`);
        } catch (error) {
            toast.error("Failed to create character");
        }
    };

    const updatePlacesPeople = async (placesPeople) => {
        await updateCharacter({ places_people: placesPeople });
    };

    const importCharacter = async (importedCharacter) => {
        try {
            const characterType = importedCharacter?.character_type === "mage" ? "mage" : "geist";
            const importedName = (importedCharacter?.name || `Imported ${characterType === "mage" ? "Mage" : "Sin-Eater"}`).trim();

            const createResponse = await axios.post(`${API}/characters`, {
                name: importedName,
                character_type: characterType,
            });

            const createdCharacter = createResponse.data;
            const { id, _id, created_at, updated_at, ...updates } = importedCharacter || {};
            const normalizedUpdates = { ...updates };
            delete normalizedUpdates.exploration_map; // Ignore map data from legacy JSON exports.
            if (Array.isArray(normalizedUpdates.active_spells)) normalizedUpdates.active_spells = retainActiveSpells(normalizedUpdates.active_spells, normalizedUpdates.scene_tracker);

            if (characterType === "mage" && normalizedUpdates.creation_locked === undefined) {
                normalizedUpdates.creation_mode = "active";
                normalizedUpdates.creation_locked = true;
            }

            const updateResponse = await axios.put(`${API}/characters/${createdCharacter.id}`, {
                ...normalizedUpdates,
                name: importedName,
                character_type: characterType,
            });

            const finalCharacter = updateResponse.data;
            setCharacters(prev => [...prev, toCharacterSummary(finalCharacter)]);
            activateCharacter(finalCharacter);
            toast.success(`Imported character: ${finalCharacter.name}`);
        } catch (error) {
            console.error("Failed to import character:", error);
            toast.error("Failed to import character");
        }
    };

    const addActiveSpell = async (spell) => {
        await updateCharacter((latest) => ({
            active_spells: [...(latest.active_spells || []), startTimedEffect(spell, latest.scene_tracker)],
        }));
    };

    const dispelActiveSpell = async (spellId) => {
        await updateCharacter((latest) => ({
            active_spells: (latest.active_spells || []).filter((spell) => spell.id !== spellId),
        }));
    };

    const relinquishActiveSpell = async (spellId) => {
        const currentActiveSpells = activeCharacter?.active_spells || [];
        const currentWillpower = activeCharacter?.willpower || 0;

        await updateCharacter({
            active_spells: currentActiveSpells.filter((spell) => spell.id !== spellId),
            willpower: Math.max(0, currentWillpower - 1),
        });
    };

    const relinquishActiveSpellSafely = async (spellId) => {
        const currentActiveSpells = activeCharacter?.active_spells || [];
        const currentWillpower = activeCharacter?.willpower || 0;
        const currentModifier = activeCharacter?.willpower_max_modifier || 0;

        const resolve = activeCharacter?.attributes?.resolve || 1;
        const composure = activeCharacter?.attributes?.composure || 1;
        const nextModifier = currentModifier - 1;
        const nextMaxWillpower = Math.max(0, resolve + composure + nextModifier);

        await updateCharacter({
            active_spells: currentActiveSpells.filter((spell) => spell.id !== spellId),
            willpower_max_modifier: nextModifier,
            willpower: Math.min(currentWillpower, nextMaxWillpower),
        });
    };

    const updateCharacter = async (updates, summaryOptions = {}) => {
        const current = latestCharacterRef.current || activeCharacter;
        if (!current?.id || deletingCharactersRef.current.has(current.id)) return false;
        const characterId = current.id;
        const computed = resolveCharacterUpdate(current,updates);
        if (!computed || typeof computed !== 'object' || Object.keys(computed).length === 0) return false;
        const patch = { ...computed };
        if (patch.scene_tracker) patch.scene_tracker = withGameClockCheckpoint(current.scene_tracker,patch.scene_tracker);
        // An equipment change can begin or end exposure without advancing the
        // clock. Never let an old temperature cursor leak across an equip toggle.
        const beforeTemperature = temperatureExposure(current, current.scene_tracker || {});
        const projected = { ...current, ...patch };
        const nextTemperature = temperatureExposure(projected, projected.scene_tracker || {});
        if (beforeTemperature !== nextTemperature &&
            !(patch.scene_tracker && Object.prototype.hasOwnProperty.call(patch.scene_tracker, 'environmental_exposure'))) {
            const stamp = getGameTimestamp(projected.scene_tracker || {});
            const since = stamp === null ? null : new Date(stamp).toISOString();
            patch.scene_tracker = { ...(projected.scene_tracker || {}), environmental_exposure:
                nextTemperature && since ? { kind: nextTemperature, since, last_tick_at: since } : {} };
        }
        const {cleaned, summary} = prepareTimeTransition(current, patch, summaryOptions);
        Object.assign(patch, cleaned);
        const token = Symbol('character-update');
        const pending = pendingCharacterPatchesRef.current.get(characterId) || [];
        pendingCharacterPatchesRef.current.set(characterId, [...pending, { token, updates: patch }]);
        const optimistic = withoutXPHistory({ ...current, ...patch });
        latestCharacterRef.current = optimistic;
        setActiveCharacter((previous) => previous?.id === characterId ? optimistic : previous);
        refreshSummary(optimistic);

        const previousWrite = characterWriteQueuesRef.current.get(characterId) || Promise.resolve();
        const task = previousWrite.catch(() => false).then(async () => {
            try {
                const response = await axios.put(`${API}/characters/${characterId}`, patch, { params: {
                    include_xp_history: false, delta_updates: true, ...(summaryOptions.kind === "scene" ? {finalize_scene:true} : {}), ...(summaryOptions.expectedHistoryRevision ? {expected_updated_at: summaryOptions.expectedHistoryRevision} : {})
                }});
                const remaining = (pendingCharacterPatchesRef.current.get(characterId) || []).filter((entry) => entry.token !== token);
                if (remaining.length) pendingCharacterPatchesRef.current.set(characterId, remaining);
                else pendingCharacterPatchesRef.current.delete(characterId);
                await acceptCharacterMessage(response.data);
                if (summary) setTimeSummaries(queue => [...queue, summary]);
                return true;
            } catch (error) {
                const remaining = (pendingCharacterPatchesRef.current.get(characterId) || []).filter((entry) => entry.token !== token);
                if (remaining.length) pendingCharacterPatchesRef.current.set(characterId, remaining);
                else pendingCharacterPatchesRef.current.delete(characterId);
                try {
                    const response = await axios.get(`${API}/characters/${characterId}?include_xp_history=false`);
                    acceptCharacterSnapshot(response.data);
                } catch (refreshError) {
                    toast.error('Character save failed; server refresh also failed. Reload before continuing.');
                }
                toast.error(error.response?.status === 409 ? (summaryOptions.expectedHistoryRevision ? 'XP history changed. Reload and retry the correction.' : 'Character changed in another update. Retry the action.') : 'Failed to update character');
                return false;
            }
        });
        characterWriteQueuesRef.current.set(characterId, task);
        const clearQueue = () => { if (characterWriteQueuesRef.current.get(characterId) === task) characterWriteQueuesRef.current.delete(characterId); };
        task.then(clearQueue, clearQueue);
        return task;
    };

    const handleEndScene = async () => {
        if (!activeCharacter) return false;
        const changes = getEndScenePatch(latestCharacterRef.current || activeCharacter);
        if (!changes) return false;
        const saved = await updateCharacter(changes, { kind: "scene" });
        if (saved) toast.success("Scene ended. Scene-duration effects and resources updated.");
        return saved;
    };

    const awardDramaticFailureBeat = async ({
        spellcasting = false,
        automatic = false,
    } = {}) => {
        if (!activeCharacter) return;

        const isArcane =
            activeCharacter.character_type === "mage" &&
            spellcasting;

        const beatField = isArcane ? "arcane_beats" : "beats";
        const xpField = isArcane ? "arcane_experience" : "experience";

        const currentBeats = Number(activeCharacter[beatField]) || 0;
        const currentXP = Number(activeCharacter[xpField]) || 0;
        const newBeats = currentBeats + 1;

        await updateCharacter({
            [beatField]: newBeats >= 5 ? newBeats - 5 : newBeats,
            ...(newBeats >= 5 ? { [xpField]: currentXP + 1 } : {}),
            xp_reason: automatic
                ? "Chance Die Dramatic Failure"
                : isArcane
                    ? "Voluntary Dramatic Failure: Spellcasting"
                    : "Voluntary Dramatic Failure",
        });
    };

    // Condition management
    const addCondition = async (condition) => {
        if (!activeCharacter) return;
        const currentConditions = latestCharacterRef.current?.conditions || [];

        if (currentConditions.some(c => c.name === condition.name && c.status !== "expired")) {
            toast.error("Condition already active");
            return;
        }

        const startCondition = activeCharacter.character_type === "mage" && (isAbyssalCondition(condition) || isAbyssalTaint(condition))
            ? startAbyssalCondition({...condition, id:condition.id || "paradox-"+Date.now()+"-"+Math.random().toString(36).slice(2)}, activeCharacter.wisdom, activeCharacter.scene_tracker)
            : startTimedEffect(condition, activeCharacter.scene_tracker);
        await updateCharacter((latest) => ({ conditions: [...(latest.conditions || []), startCondition] }));
        toast.success(`Added: ${condition.name}`);
    };

    const scourAbyssalCondition = async (target) => {
        const id = activeCharacter?.id;
        const saved = await updateCharacter(latest => {
            if (latest.id !== id || latest.character_type !== 'mage') return null;
            const merits = latest.merits_list || [];
            const size = 5 + (merits.some(m=>m?.name==='Giant')?1:0) - (merits.some(m=>m?.name==='Small-Framed')?1:0);
            const max = getCharacterAttributeForDerivedTrait(latest,'stamina',0) + size;
            const boxes = normalizeHealthBoxes(latest.health_boxes,max,latest.health||0);
            return getAbyssalScouringPatch(latest,target,boxes);
        });
        if (saved) toast.success('Abyssal corruption Scoured: 1 resistant lethal wound; no Mana gained.');
        else toast.error('Scouring unavailable or not saved. Check the game clock, daily allowance and Health.');
        return saved;
    };
    const setAbyssalSuccesses = async (target,value) => {
        if (!validParadoxSuccesses(value)) { toast.error('Enter the positive number of Paradox successes that imposed this Condition.'); return false; }
        const id = activeCharacter?.id;
        return updateCharacter(latest=>{
            if (latest.id !== id || latest.character_type !== 'mage') return null;
            const conditions = latest.conditions || [];
            const index = findAbyssalIndex(conditions,target);
            if (index < 0 || isEffectExpired(conditions[index],latest.scene_tracker) || !isAbyssalCondition(conditions[index]) || !needsParadoxSuccesses(conditions[index])) return null;
            return {conditions:conditions.map((entry,i)=>i===index?{...entry,paradox_successes:Number(value)}:entry)};
        });
    };
    const removeCondition = async (conditionIndex) => {
        if (!activeCharacter) return;
        const conditions = activeCharacter.conditions || [];
        const condition = conditions[conditionIndex];
        if (!condition || isEffectExpired(condition,activeCharacter?.scene_tracker)) return;
        if (isAbyssalTaint(condition)) {
            if (!window.confirm("Remove Abyssal Taint as a Storyteller correction? This is not Pattern Scouring: no damage, Mana, Beat or Scouring allowance is applied.")) return;
            const characterId = activeCharacter.id;
            const saved = await updateCharacter(latest => {
                if (latest.id !== characterId) return null;
                const list = latest.conditions || [];
                const index = findAbyssalIndex(list, condition);
                if (index < 0 || !isAbyssalTaint(list[index])) return null;
                return {conditions:list.filter((_,i)=>i!==index)};
            });
            if (saved) toast.success("Abyssal Taint removed (ST correction).");
            else toast.error("Correction could not be saved. Check the Condition and try again.");
            return;
        }
        const newConditions = conditions.filter((_, i) => i !== conditionIndex);
        if (await updateCharacter({ conditions: newConditions })) toast.success(`Removed: ${condition.name}`);
    };



    const resolveCondition = async (conditionIndex) => {
        const target = (activeCharacter?.conditions || [])[conditionIndex];
        if (!target || isEffectExpired(target,activeCharacter?.scene_tracker)) return;
        if (target?.type === 'tilt' || String(target?.group || '').startsWith('tilt-')) {
            await updateCharacter((latest) => ({ conditions: (latest.conditions || []).filter((_, i) => i !== conditionIndex) }));
            toast.info('Tilt ended: ' + target.name + ' (no Beat)');
            return;
        }
        if (!activeCharacter) return;

        const conditions = activeCharacter.conditions || [];
        const condition = conditions[conditionIndex];
        if (!condition) return;

        if (isAbyssalTaint(condition)) { toast.error("Abyssal Taint must be Scoured from the Pattern."); return; }
        if (activeCharacter.character_type === "mage" && isAbyssalCondition(condition)) {
            if (await updateCharacter({conditions:conditions.filter((_, i)=>i!==conditionIndex)})) toast.success("Paradox Condition resolved (no Arcane Beat).");
            return;
        }
        const isPersistent = Boolean(condition.persistent);
        const isArcane = condition.beat_type === "arcane";

        const beatField = isArcane ? "arcane_beats" : "beats";
        const xpField = isArcane ? "arcane_experience" : "experience";
        const beatLabel = isArcane ? "Arcane Beat" : "Beat";
        const xpLabel = isArcane ? "Arcane Experience" : "Experience";

        const currentBeats = Number(activeCharacter[beatField]) || 0;
        const currentXP = Number(activeCharacter[xpField]) || 0;
        const newBeats = currentBeats + 1;

        const updates = {
            [beatField]: newBeats >= 5 ? newBeats - 5 : newBeats,
            xp_reason: isPersistent
                ? `Persistent Condition: ${condition.name || "Unnamed condition"} (${beatLabel})`
                : `Condition resolved: ${condition.name || "Unnamed condition"} (${beatLabel})`,
        };

        // Persistent Conditions remain active.
        if (!isPersistent) {
            updates.conditions = conditions.filter(
                (_, index) => index !== conditionIndex
            );
        }

        // Convert 5 Beats into the corresponding Experience.
        if (newBeats >= 5) {
            updates[xpField] = currentXP + 1;
        }

        await updateCharacter(updates);

        const action = isPersistent
            ? `Persistent Condition "${condition.name}" triggered`
            : `Condition "${condition.name}" resolved`;

        toast.success(
            `${action}! ${
                newBeats >= 5
                    ? `5 ${beatLabel}s converted to 1 ${xpLabel}!`
                    : `1 ${beatLabel} gained!`
            }`
        );
    };

    const updateCondition = async (conditionIndex, partialUpdate) => {
        if (!activeCharacter) return;
        const conditions = activeCharacter.conditions || [];
        const condition = conditions[conditionIndex];
        if (!condition || isEffectExpired(condition,activeCharacter?.scene_tracker)) return;
        const newConditions = conditions.map((c, i) => (i === conditionIndex ? { ...c, ...partialUpdate } : c));
        await updateCharacter({ conditions: newConditions });
    };

    const updateHaunt = async (hauntName, rating) => {
        if (!activeCharacter) return;
        const currentHaunts = activeCharacter.haunts || {};
        const newHaunts = { ...currentHaunts, [hauntName]: rating };
        await updateCharacter({ haunts: newHaunts });
    };

    const toggleKey = async (keyName) => {
        if (!activeCharacter) return;
        const currentKeys = activeCharacter.keys || [];
        const newKeys = currentKeys.includes(keyName)
            ? currentKeys.filter(k => k !== keyName)
            : [...currentKeys, keyName];
        await updateCharacter({ keys: newKeys });
    };

    const deleteCharacter = async (characterId) => {
        if (deletingCharactersRef.current.has(characterId)) return;
        deletingCharactersRef.current.add(characterId);
        try {
            await (characterWriteQueuesRef.current.get(characterId) || Promise.resolve());
            await axios.delete(`${API}/characters/${characterId}`);
            setCharacters(list => list.filter(c => c.id !== characterId));
            if (latestCharacterRef.current?.id === characterId) {
                activateCharacter(null);
                const replacement = characters.find(c => c.id !== characterId && !deletingCharactersRef.current.has(c.id));
                if (replacement) await selectCharacter(replacement);
            }
            toast.success("Character deleted");
        } catch (error) {
            toast.error("Failed to delete character");
        } finally {
            deletingCharactersRef.current.delete(characterId);
        }
    };

    return (
        <div className="app-container" data-testid="character-sheet-page">
            <TimeElapsedDialog summary={timeSummaries[0] || null} onClose={() => setTimeSummaries(queue => queue.slice(1))} />
            <QuickDiceRoller onRollRecorded={addRecentRoll} />
            {/* Main Content - Character and Cards always visible */}
            <div className="main-content overflow-y-auto">
                <div
                    className={`w-full ${rollColumnCollapsed ? "max-w-[1400px]" : "max-w-[1800px]"} mx-auto min-h-full flex flex-col`}
                >
                    <div
                        className={`grid grid-cols-1 gap-0 flex-1 min-h-0 ${
                            rollColumnCollapsed
                                ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
                                : "xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_380px]"
                        }`}
                    >
                        <section className="min-h-0 border-b xl:border-b-0 xl:border-r border-zinc-800">
                            <div className="h-full overflow-hidden">
                                <CharacterPanel
                                    characters={characters}
                                    activeCharacter={activeCharacter}
                                    onSelectCharacter={selectCharacter}
                                    onLoadCharacterForExport={loadCharacterForExport}
                                    onCreateCharacter={createCharacter}
                                    onUpdateCharacter={updateCharacter}
                                    onDeleteCharacter={deleteCharacter}
                                    onTriggerDiceRoll={triggerDiceRoll}
                                    onAddRecentRoll={addRecentRoll}
                                    onCreateActiveSpell={addActiveSpell}
                                    onImportCharacter={importCharacter}
                                    onEndTurn={handleCombatEndTurn}
                                    onAdvanceTime={handleAdvanceTime}
                                    ceremonyRollRef={ceremonyRollRef}
                                />
                            </div>
                        </section>

                        <section className="min-h-0">
                            <div className="h-full overflow-hidden">
                                <GameCardsPanel
                                    onRollCeremony={name => ceremonyRollRef.current?.(name)}
                                    activeCharacter={activeCharacter}
                                    activeConditions={activeCharacter?.conditions || []}
                                    haunts={activeCharacter?.haunts || {}}
                                    keys={activeCharacter?.keys || []}
                                    onAddCondition={addCondition}
                                    onRemoveCondition={removeCondition}
                                    onResolveCondition={resolveCondition}
                                    onUpdateCondition={updateCondition}
                                    onScourAbyssal={scourAbyssalCondition}
                                    onSetAbyssalSuccesses={setAbyssalSuccesses}
                                    onUpdateHaunt={updateHaunt}
                                    onToggleKey={toggleKey}
                                    onUpdatePlacesPeople={updatePlacesPeople}
                                    onDispelActiveSpell={dispelActiveSpell}
                                    onRelinquishActiveSpell={relinquishActiveSpell}
                                    onRelinquishActiveSpellSafely={relinquishActiveSpellSafely}
                                    onTriggerDiceRoll={triggerDiceRoll}
                                    onAddRecentRoll={addRecentRoll}
                                    onApplyIncomingDamage={applyIncomingCombatDamage}
                                    onUpdateCharacter={updateCharacter}
                                    healthBoxes={combatHealthBoxes}
                                    maxHealth={combatMaxHealth}
                                    filledHealth={combatFilledHealth}
                                    isDeadTrack={combatIsDeadTrack}
                                    woundPenalty={combatWoundPenalty}
                                    onHealHealthState={healCombatHealthState}
                                    onToggleResistantWound={toggleResistantCombatWound}
                                    onPatternRestoration={handlePatternRestoration}
                                    patternRestorationDisabled={patternRestorationDisabled}
                                    isMage={activeCharacter?.character_type === "mage"}
                                    onEndTurn={handleCombatEndTurn}
                                    onSleep={handleCombatSleep}
                                    onEndScene={handleEndScene}
                                />
                            </div>
                        </section>
                        <section
                            className={
                                rollColumnCollapsed
                                    ? "hidden xl:block xl:fixed xl:right-0 xl:top-0 xl:bottom-0 xl:w-14 xl:z-40"
                                    : "min-h-0 border-t xl:border-t-0 xl:border-l border-zinc-800"
                            }
                        >
                            <div className="h-full overflow-hidden">
                                <DiceRoller
                                    ref={diceRollerRef}
                                    embedded
                                    onAwardDramaticFailure={awardDramaticFailureBeat}
                                    collapsed={rollColumnCollapsed}
                                    onToggleCollapsed={() => setRollColumnCollapsed((prev) => !prev)}
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
