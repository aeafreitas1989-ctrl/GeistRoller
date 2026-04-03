import { useState, useEffect, useRef } from "react";
import { CharacterPanel } from "@/components/CharacterPanel";
import { GameCardsPanel } from "@/components/GameCardsPanel";
import { DiceRoller } from "@/components/DiceRoller";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const StorytellerPage = () => {
    const [characters, setCharacters] = useState([]);
    const [activeCharacter, setActiveCharacter] = useState(null);

    const diceRollerRef = useRef(null);
    const lastCharacterStorageKey = "geistroller-last-active-character-id";

    const triggerDiceRoll = (config) => {
        diceRollerRef.current?.rollWithConfig(config);
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
                <div className="w-full max-w-7xl mx-auto min-h-full flex flex-col">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 flex-1 min-h-0">
                        <section className="min-h-0 border-b xl:border-b-0 xl:border-r border-zinc-800">
                            <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
                                <h2 className="font-mono text-sm uppercase tracking-wider text-zinc-400">
                                    Character
                                </h2>
                            </div>
                            <div className="h-[calc(100vh-57px)] xl:h-full overflow-hidden">
                                <CharacterPanel
                                    characters={characters}
                                    activeCharacter={activeCharacter}
                                    onSelectCharacter={setActiveCharacter}
                                    onCreateCharacter={createCharacter}
                                    onUpdateCharacter={updateCharacter}
                                    onDeleteCharacter={deleteCharacter}
                                    onTriggerDiceRoll={triggerDiceRoll}
                                    onCreateActiveSpell={addActiveSpell}
                                />
                            </div>
                        </section>

                        <section className="min-h-0">
                            <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
                                <h2 className="font-mono text-sm uppercase tracking-wider text-zinc-400">
                                    Cards
                                </h2>
                            </div>
                            <div className="h-[calc(100vh-57px)] xl:h-full overflow-hidden">
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
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Floating Dice Roller */}
            <DiceRoller ref={diceRollerRef} />
        </div>
    );
};
