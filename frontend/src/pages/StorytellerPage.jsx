import { useState, useEffect, useRef } from "react";
import { CharacterPanel } from "@/components/CharacterPanel";
import { GameCardsPanel } from "@/components/GameCardsPanel";
import { DiceRoller } from "@/components/DiceRoller";
import axios from "axios";
import { toast } from "sonner";
import { normalizeHealthBoxes, getHealthCounts, buildHealthBoxes } from "@/components/character/StatComponents";


const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const StorytellerPage = () => {
    const [characters, setCharacters] = useState([]);
    const [activeCharacter, setActiveCharacter] = useState(null);
    const [rollColumnCollapsed, setRollColumnCollapsed] = useState(true);

    const diceRollerRef = useRef(null);
    const lastCharacterStorageKey = "geistroller-last-active-character-id";

    const triggerDiceRoll = (config) => {
        diceRollerRef.current?.rollWithConfig(config);
    };


    const applyIncomingCombatDamage = async ({ amount, damageType, sourceProfile }) => {
        if (!activeCharacter || !amount || amount <= 0) return;

        const meritsList = activeCharacter?.merits_list || [];
        const hasGiant = meritsList.some((m) => (m?.name || "") === "Giant");
        const hasSmallFramed = meritsList.some((m) => (m?.name || "") === "Small-Framed");
        const size = 5 + (hasGiant ? 1 : 0) + (hasSmallFramed ? -1 : 0);
        const stamina = activeCharacter?.attributes?.stamina || 0;
        const maxHealth = stamina + size;

        const inventoryItems = activeCharacter?.inventory_items || [];
        const equippedArmor = inventoryItems.find((it) => it?.type === "armor" && !!it?.equipped) || null;
        const equippedArmorGeneral = equippedArmor?.armor?.general ?? 0;
        const equippedArmorBallistic = equippedArmor?.armor?.ballistic ?? 0;

        const activeMageArmorName = activeCharacter?.character_type === "mage"
            ? (activeCharacter?.active_mage_armor || null)
            : null;
        const activeMageArmorDots = activeMageArmorName
            ? (activeCharacter?.arcana?.[activeMageArmorName] || 0)
            : 0;

        const mageArmorGeneralBonus = (() => {
            if (!activeMageArmorName) return 0;
            if (["Forces", "Matter"].includes(activeMageArmorName)) return activeMageArmorDots;
            if (activeMageArmorName === "Life") return Math.ceil(activeMageArmorDots / 2);
            return 0;
        })();

        let finalType = damageType;
        let remaining = amount;

        if (activeMageArmorName === "Death" && finalType === "lethal" && ["general", "ballistic"].includes(sourceProfile)) {
            finalType = "bashing";
        }

        if (activeMageArmorName === "Spirit" && finalType === "lethal" && ["general", "ballistic", "spirit"].includes(sourceProfile)) {
            finalType = "bashing";
        }

        if (activeMageArmorName === "Prime" && sourceProfile === "supernatural") {
            remaining = Math.max(0, remaining - activeMageArmorDots);
        }

        if (finalType !== "aggravated") {
            let armorValue = 0;

            if (sourceProfile === "ballistic") {
                armorValue = equippedArmorBallistic;
            } else if (sourceProfile === "general") {
                armorValue =
                    equippedArmorGeneral +
                    (["Matter", "Life"].includes(activeMageArmorName) ? mageArmorGeneralBonus : 0);
            } else if (sourceProfile === "energy") {
                armorValue =
                    activeMageArmorName === "Forces" ? mageArmorGeneralBonus : 0;
            }

            remaining = Math.max(0, remaining - armorValue);
        }

        if (remaining <= 0) {
            toast.info("Incoming damage was fully absorbed.");
            return;
        }

        const startingBoxes = normalizeHealthBoxes(
            activeCharacter?.health_boxes,
            maxHealth,
            activeCharacter?.health || 0
        );
        const counts = getHealthCounts(startingBoxes);

        for (let i = 0; i < remaining; i += 1) {
            const total = counts.aggravated + counts.lethal + counts.bashing;

            if (finalType === "bashing") {
                if (total < maxHealth) {
                    counts.bashing += 1;
                } else if (counts.bashing > 0) {
                    counts.bashing -= 1;
                    counts.lethal += 1;
                } else if (counts.lethal > 0) {
                    counts.lethal -= 1;
                    counts.aggravated += 1;
                }
            }

            if (finalType === "lethal") {
                if (total < maxHealth) {
                    counts.lethal += 1;
                } else if (counts.bashing > 0) {
                    counts.bashing -= 1;
                    counts.lethal += 1;
                } else if (counts.lethal > 0) {
                    counts.lethal -= 1;
                    counts.aggravated += 1;
                }
            }

            if (finalType === "aggravated") {
                if (total < maxHealth) {
                    counts.aggravated += 1;
                } else if (counts.bashing > 0) {
                    counts.bashing -= 1;
                    counts.aggravated += 1;
                } else if (counts.lethal > 0) {
                    counts.lethal -= 1;
                    counts.aggravated += 1;
                }
            }
        }

        const updatedBoxes = buildHealthBoxes(counts, maxHealth);
        const filled = updatedBoxes.filter((state) => state !== "empty").length;
        await updateCharacter({
            health_boxes: updatedBoxes,
            health: filled,
        });

        toast.info(`${remaining} ${finalType} damage applied.`);
    };

    const meritsList = activeCharacter?.merits_list || [];
    const hasGiant = meritsList.some((m) => (m?.name || "") === "Giant");
    const hasSmallFramed = meritsList.some((m) => (m?.name || "") === "Small-Framed");
    const combatSize = 5 + (hasGiant ? 1 : 0) + (hasSmallFramed ? -1 : 0);
    const combatStamina = activeCharacter?.attributes?.stamina || 0;
    const combatMaxHealth = combatStamina + combatSize;

    const combatHealthBoxes = normalizeHealthBoxes(
        activeCharacter?.health_boxes,
        combatMaxHealth,
        activeCharacter?.health || 0
    );

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

    const healCombatHealthState = async (stateToHeal) => {
        if (!activeCharacter) return;

        const counts = getHealthCounts(combatHealthBoxes);

        if (stateToHeal === "bashing" && counts.bashing > 0) counts.bashing -= 1;
        if (stateToHeal === "lethal" && counts.lethal > 0) counts.lethal -= 1;
        if (stateToHeal === "aggravated" && counts.aggravated > 0) counts.aggravated -= 1;

        const updatedBoxes = buildHealthBoxes(counts, combatMaxHealth);
        const filled = updatedBoxes.filter((state) => state !== "empty").length;

        await updateCharacter({
            health_boxes: updatedBoxes,
            health: filled,
        });
    };

    const handlePatternRestoration = async () => {
        if (!activeCharacter || activeCharacter.character_type !== "mage") return;

        const currentMana = activeCharacter?.mana || 0;
        if (currentMana < 3) return;

        const counts = getHealthCounts(combatHealthBoxes);

        if (counts.lethal > 0) {
            counts.lethal -= 1;
        } else if (counts.bashing > 0) {
            counts.bashing -= 1;
        } else {
            return;
        }

        const updatedBoxes = buildHealthBoxes(counts, combatMaxHealth);
        const filled = updatedBoxes.filter((state) => state !== "empty").length;

        await updateCharacter({
            mana: currentMana - 3,
            health_boxes: updatedBoxes,
            health: filled,
        });
    };

    const patternRestorationDisabled =
        activeCharacter?.character_type !== "mage" ||
        (activeCharacter?.mana || 0) < 3 ||
        (() => {
            const c = getHealthCounts(combatHealthBoxes);
            return c.lethal + c.bashing === 0;
        })();

    const handleCombatEndTurn = async () => {
        if (!activeCharacter) return;

        const conditions = activeCharacter.conditions || [];
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
    };

    // Fetch sessions and campaigns on mount
    useEffect(() => {
        fetchCharacters();
    }, []);

    useEffect(() => {
        if (activeCharacter?.id) {
            localStorage.setItem(lastCharacterStorageKey, activeCharacter.id);
        }
    }, [activeCharacter, lastCharacterStorageKey]);

    const fetchCharacters = async () => {
        try {
            const response = await axios.get(`${API}/characters`);
            const fetchedCharacters = response.data;
            setCharacters(fetchedCharacters);

            if (fetchedCharacters.length > 0) {
                const savedCharacterId = localStorage.getItem(lastCharacterStorageKey);
                const savedCharacter = fetchedCharacters.find((c) => c.id === savedCharacterId);

                if (savedCharacter) {
                    setActiveCharacter(savedCharacter);
                } else {
                    setActiveCharacter(fetchedCharacters[0]);
                }
            } else {
                setActiveCharacter(null);
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
            setCharacters([...characters, response.data]);
            setActiveCharacter(response.data);
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

            const updateResponse = await axios.put(`${API}/characters/${createdCharacter.id}`, {
                ...updates,
                name: importedName,
                character_type: characterType,
            });

            const finalCharacter = updateResponse.data;
            setCharacters((prev) => [...prev, finalCharacter]);
            setActiveCharacter(finalCharacter);
            toast.success(`Imported character: ${finalCharacter.name}`);
        } catch (error) {
            console.error("Failed to import character:", error);
            toast.error("Failed to import character");
        }
    };

    const addActiveSpell = async (spell) => {
        const currentActiveSpells = activeCharacter?.active_spells || [];
        await updateCharacter({ active_spells: [...currentActiveSpells, spell] });
    };

    const dispelActiveSpell = async (spellId) => {
        const currentActiveSpells = activeCharacter?.active_spells || [];
        await updateCharacter({
            active_spells: currentActiveSpells.filter((spell) => spell.id !== spellId),
        });
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

    const updateCharacter = async (updates) => {
        if (!activeCharacter) return;

        try {
            const response = await axios.put(
                `${API}/characters/${activeCharacter.id}`,
                updates
            );
            setActiveCharacter(response.data);
            setCharacters(characters.map(c => 
                c.id === activeCharacter.id ? response.data : c
            ));
        } catch (error) {
            toast.error("Failed to update character");
        }
    };

    // Condition management
    const addCondition = async (condition) => {
        if (!activeCharacter) return;
        const currentConditions = activeCharacter.conditions || [];
        
        if (currentConditions.some(c => c.name === condition.name)) {
            toast.error("Condition already active");
            return;
        }
        
        const newConditions = [...currentConditions, condition];
        await updateCharacter({ conditions: newConditions });
        toast.success(`Added: ${condition.name}`);
    };

    const removeCondition = async (conditionIndex) => {
        if (!activeCharacter) return;
        const conditions = activeCharacter.conditions || [];
        const condition = conditions[conditionIndex];
        if (!condition) return;
        const newConditions = conditions.filter((_, i) => i !== conditionIndex);
        await updateCharacter({ conditions: newConditions });
        toast.success(`Removed: ${condition.name}`);
    };

    const resolveCondition = async (conditionIndex) => {
        if (!activeCharacter) return;
        const conditions = activeCharacter.conditions || [];
        const condition = conditions[conditionIndex];
        if (!condition) return;
        const newConditions = conditions.filter((_, i) => i !== conditionIndex);
        const currentBeats = activeCharacter.beats || 0;
        const currentXP = activeCharacter.experience || 0;
        const newBeats = currentBeats + 1;
        const updates = { conditions: newConditions };
        if (newBeats >= 5) {
            updates.beats = newBeats - 5;
            updates.experience = currentXP + 1;
            toast.success(`Resolved "${condition.name}": Beat gained! 5 Beats converted to 1 Experience!`);
        } else {
            updates.beats = newBeats;
            toast.success(`Resolved "${condition.name}": Beat gained!`);
        }
        await updateCharacter(updates);
    };

    const updateCondition = async (conditionIndex, partialUpdate) => {
        if (!activeCharacter) return;
        const conditions = activeCharacter.conditions || [];
        const condition = conditions[conditionIndex];
        if (!condition) return;
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
        try {
            await axios.delete(`${API}/characters/${characterId}`);
            setCharacters(characters.filter(c => c.id !== characterId));
            if (activeCharacter?.id === characterId) {
                setActiveCharacter(characters.length > 1 ? characters.find(c => c.id !== characterId) : null);
            }
            toast.success("Character deleted");
        } catch (error) {
            toast.error("Failed to delete character");
        }
    };

    return (
        <div className="app-container" data-testid="storyteller-page">
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
                                    onSelectCharacter={setActiveCharacter}
                                    onCreateCharacter={createCharacter}
                                    onUpdateCharacter={updateCharacter}
                                    onDeleteCharacter={deleteCharacter}
                                    onTriggerDiceRoll={triggerDiceRoll}
                                    onCreateActiveSpell={addActiveSpell}
                                    onImportCharacter={importCharacter}
                                />
                            </div>
                        </section>

                        <section className="min-h-0">
                            <div className="h-full overflow-hidden">
                                <GameCardsPanel
                                    activeCharacter={activeCharacter}
                                    activeConditions={activeCharacter?.conditions || []}
                                    haunts={activeCharacter?.haunts || {}}
                                    keys={activeCharacter?.keys || []}
                                    onAddCondition={addCondition}
                                    onRemoveCondition={removeCondition}
                                    onResolveCondition={resolveCondition}
                                    onUpdateCondition={updateCondition}
                                    onUpdateHaunt={updateHaunt}
                                    onToggleKey={toggleKey}
                                    onUpdatePlacesPeople={updatePlacesPeople}
                                    onDispelActiveSpell={dispelActiveSpell}
                                    onRelinquishActiveSpell={relinquishActiveSpell}
                                    onRelinquishActiveSpellSafely={relinquishActiveSpellSafely}
                                    onTriggerDiceRoll={triggerDiceRoll}
                                    onApplyIncomingDamage={applyIncomingCombatDamage}
                                    onUpdateCharacter={updateCharacter}
                                    healthBoxes={combatHealthBoxes}
                                    maxHealth={combatMaxHealth}
                                    filledHealth={combatFilledHealth}
                                    isDeadTrack={combatIsDeadTrack}
                                    woundPenalty={combatWoundPenalty}
                                    onHealHealthState={healCombatHealthState}
                                    onPatternRestoration={handlePatternRestoration}
                                    patternRestorationDisabled={patternRestorationDisabled}
                                    isMage={activeCharacter?.character_type === "mage"}
                                    onEndTurn={handleCombatEndTurn}
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
    