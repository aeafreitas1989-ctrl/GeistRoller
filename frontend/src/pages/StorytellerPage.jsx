import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CharacterPanel } from "@/components/CharacterPanel";
import { GameCardsPanel } from "@/components/GameCardsPanel";
import { CampaignPanel } from "@/components/CampaignPanel";
import { DiceRoller } from "@/components/DiceRoller";
import { Menu, X, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const StorytellerPage = () => {
    const [sessions, setSessions] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [activeCampaign, setActiveCampaign] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [activeCharacter, setActiveCharacter] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const diceRollerRef = useRef(null);

    const triggerDiceRoll = (config) => {
        diceRollerRef.current?.rollWithConfig(config);
    };

    // Fetch sessions and campaigns on mount
    useEffect(() => {
        fetchSessions();
        fetchCampaigns();
        fetchCharacters();
    }, []);

    // Set active campaign if session belongs to one
    useEffect(() => {
        if (activeSession?.campaign_id) {
            const campaign = campaigns.find(c => c.id === activeSession.campaign_id);
            if (campaign) setActiveCampaign(campaign);
        } else {
            setActiveCampaign(null);
        }
    }, [activeSession, campaigns]);

    const fetchSessions = async () => {
        try {
            const response = await axios.get(`${API}/sessions`);
            setSessions(response.data);
            if (response.data.length > 0 && !activeSession) {
                setActiveSession(response.data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        }
    };

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get(`${API}/campaigns`);
            setCampaigns(response.data);
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
        }
    };

    const fetchCharacters = async () => {
        try {
            const response = await axios.get(`${API}/characters`);
            setCharacters(response.data);
            if (response.data.length > 0) {
                setActiveCharacter(response.data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch characters:", error);
        }
    };

    const createSession = async (campaignId = null) => {
        try {
            const campaignName = campaignId ? campaigns.find(c => c.id === campaignId)?.name : null;
            const sessionNumber = campaignId 
                ? sessions.filter(s => s.campaign_id === campaignId).length + 1
                : sessions.filter(s => !s.campaign_id).length + 1;
            const title = campaignName 
                ? `${campaignName} - Session ${sessionNumber}`
                : `Session ${sessionNumber}`;
            
            const response = await axios.post(`${API}/sessions`, {
                title,
                campaign_id: campaignId
            });
            setSessions([response.data, ...sessions]);
            setActiveSession(response.data);
            toast.success("New session created");
        } catch (error) {
            toast.error("Failed to create session");
        }
    };

    const createCampaign = async (name, description = "") => {
        try {
            const response = await axios.post(`${API}/campaigns`, { name, description });
            setCampaigns([response.data, ...campaigns]);
            setActiveCampaign(response.data);
            toast.success(`Campaign "${name}" created`);
        } catch (error) {
            toast.error("Failed to create campaign");
        }
    };

    const deleteCampaign = async (campaignId) => {
        try {
            await axios.delete(`${API}/campaigns/${campaignId}`);
            setCampaigns(campaigns.filter(c => c.id !== campaignId));
            setSessions(sessions.map(s => 
                s.campaign_id === campaignId ? { ...s, campaign_id: null } : s
            ));
            if (activeCampaign?.id === campaignId) {
                setActiveCampaign(null);
            }
            toast.success("Campaign deleted");
        } catch (error) {
            toast.error("Failed to delete campaign");
        }
    };

    const updateCampaign = async (updates) => {
        if (!activeCampaign) return;
        try {
            const response = await axios.put(`${API}/campaigns/${activeCampaign.id}`, updates);
            setActiveCampaign(response.data);
            setCampaigns(campaigns.map(c => c.id === activeCampaign.id ? response.data : c));
        } catch (error) {
            toast.error("Failed to update campaign");
        }
    };

    const moveSessionToCampaign = async (sessionId, campaignId) => {
        try {
            const response = await axios.put(`${API}/sessions/${sessionId}`, {
                campaign_id: campaignId
            });

            setSessions(sessions.map((session) =>
                session.id === sessionId ? response.data : session
            ));

            if (activeSession?.id === sessionId) {
                setActiveSession(response.data);
            }

            toast.success("Session moved to campaign");
        } catch (error) {
            toast.error("Failed to move session");
        }
    };

    const deleteSession = async (sessionId) => {
        try {
            await axios.delete(`${API}/sessions/${sessionId}`);
            setSessions(sessions.filter(s => s.id !== sessionId));
            if (activeSession?.id === sessionId) {
                setActiveSession(sessions.length > 1 ? sessions.find(s => s.id !== sessionId) : null);
            }
            toast.success("Session deleted");
        } catch (error) {
            toast.error("Failed to delete session");
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
            {/* Mobile menu button */}
            <div className="fixed top-4 left-4 z-50 lg:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="bg-zinc-900/80 backdrop-blur"
                    data-testid="sidebar-toggle"
                >
                    {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
                {sidebarCollapsed && (
                    <div className="hidden lg:flex justify-center pt-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarCollapsed(false)}
                            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                            data-testid="desktop-sidebar-uncollapse-toggle"
                            title="Expand sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                <div className={sidebarCollapsed ? "sidebar-content hidden lg:block" : "sidebar-content"}>
                    <Sidebar
                        sessions={sessions}
                        campaigns={campaigns}
                        activeSession={activeSession}
                        activeCampaign={activeCampaign}
                        onSelectSession={(session) => {
                            setActiveSession(session);
                            setSidebarOpen(false);
                        }}
                        onSelectCampaign={(campaign) => {
                            setActiveCampaign(campaign);
                        }}
                        onCreateSession={createSession}
                        onCreateCampaign={createCampaign}
                        onDeleteSession={deleteSession}
                        onDeleteCampaign={deleteCampaign}
                        onMoveSessionToCampaign={moveSessionToCampaign}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebarCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                    />
                </div>
            </div>

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
                                    session={activeSession}
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
