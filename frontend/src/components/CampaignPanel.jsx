import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight, Book, Globe, Users, MapPin, Sparkles, Check, X, RefreshCw, Scroll, AlertTriangle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const WORLD_STATE_CATEGORIES = [
    { value: "general", label: "General", color: "bg-zinc-700 text-zinc-300" },
    { value: "territory", label: "Territory", color: "bg-emerald-900/60 text-emerald-300" },
    { value: "underworld", label: "Underworld", color: "bg-violet-900/60 text-violet-300" },
    { value: "supernatural", label: "Supernatural", color: "bg-indigo-900/60 text-indigo-300" },
    { value: "dominion", label: "Dominion", color: "bg-amber-900/60 text-amber-300" },
    { value: "faction", label: "Faction", color: "bg-rose-900/60 text-rose-300" },
    { value: "secret", label: "Secret", color: "bg-red-900/60 text-red-300" },
    { value: "event", label: "Event", color: "bg-sky-900/60 text-sky-300" },
];

const getCategoryStyle = (cat) => {
    const found = WORLD_STATE_CATEGORIES.find(c => c.value === cat);
    return found ? found.color : "bg-zinc-700 text-zinc-300";
};

export const CampaignPanel = ({
    campaign,
    onUpdateCampaign,
    onGenerateJournal,
    onApproveJournalUpdate,
    activeSession,
    isGeneratingJournal,
}) => {
    const [openSections, setOpenSections] = useState({
        journal: true,
        pendingUpdates: true,
        worldState: false,
        factions: false,
        npcs: false,
        plotThreads: false,
    });

    const [newFaction, setNewFaction] = useState({ name: "", description: "", relationship: "neutral", territory: "" });
    const [newNPC, setNewNPC] = useState({ name: "", description: "", type: "", status: "active" });
    const [newPlotThread, setNewPlotThread] = useState({ title: "", description: "", status: "active" });
    const [newWorldFact, setNewWorldFact] = useState({ fact: "", category: "general" });
    const [editingFactIdx, setEditingFactIdx] = useState(null);
    const [editingFact, setEditingFact] = useState({ fact: "", category: "general" });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleAddFaction = () => {
        if (!newFaction.name.trim()) return;
        const factions = [...(campaign.factions || []), newFaction];
        onUpdateCampaign({ factions });
        setNewFaction({ name: "", description: "", relationship: "neutral", territory: "" });
    };

    const handleRemoveFaction = (index) => {
        const factions = (campaign.factions || []).filter((_, i) => i !== index);
        onUpdateCampaign({ factions });
    };

    const handleAddNPC = () => {
        if (!newNPC.name.trim()) return;
        const recurring_npcs = [...(campaign.recurring_npcs || []), newNPC];
        onUpdateCampaign({ recurring_npcs });
        setNewNPC({ name: "", description: "", type: "", status: "active" });
    };

    const handleRemoveNPC = (index) => {
        const recurring_npcs = (campaign.recurring_npcs || []).filter((_, i) => i !== index);
        onUpdateCampaign({ recurring_npcs });
    };

    const handleAddPlotThread = () => {
        if (!newPlotThread.title.trim()) return;
        const plot_threads = [...(campaign.plot_threads || []), newPlotThread];
        onUpdateCampaign({ plot_threads });
        setNewPlotThread({ title: "", description: "", status: "active" });
    };

    const handleRemovePlotThread = (index) => {
        const plot_threads = (campaign.plot_threads || []).filter((_, i) => i !== index);
        onUpdateCampaign({ plot_threads });
    };

    const handleAddWorldFact = () => {
        if (!newWorldFact.fact.trim()) return;
        const world_state = [...(campaign.world_state || []), newWorldFact];
        onUpdateCampaign({ world_state });
        setNewWorldFact({ fact: "", category: "general" });
    };

    const handleRemoveWorldFact = (index) => {
        const world_state = (campaign.world_state || []).filter((_, i) => i !== index);
        onUpdateCampaign({ world_state });
    };

    const handleEditWorldFact = (index) => {
        const fact = (campaign.world_state || [])[index];
        setEditingFactIdx(index);
        setEditingFact({ fact: fact.fact || "", category: fact.category || "general" });
    };

    const handleSaveEditWorldFact = () => {
        if (!editingFact.fact.trim() || editingFactIdx === null) return;
        const world_state = [...(campaign.world_state || [])];
        world_state[editingFactIdx] = { ...world_state[editingFactIdx], ...editingFact };
        onUpdateCampaign({ world_state });
        setEditingFactIdx(null);
        setEditingFact({ fact: "", category: "general" });
    };

    const journal = campaign.journal || { entries: [], pending_updates: [] };
    const pendingUpdates = journal.pending_updates || [];

    const getUpdateTypeIcon = (type) => {
        switch (type) {
            case "journal_entry": return <Scroll className="w-3 h-3" />;
            case "world_state": return <Globe className="w-3 h-3" />;
            case "npc": return <Users className="w-3 h-3" />;
            case "faction": return <MapPin className="w-3 h-3" />;
            case "plot_thread": return <Sparkles className="w-3 h-3" />;
            default: return <Book className="w-3 h-3" />;
        }
    };

    const getUpdateTypeLabel = (type) => {
        switch (type) {
            case "journal_entry": return "Journal Entry";
            case "world_state": return "World Fact";
            case "npc": return "New NPC";
            case "faction": return "New Faction";
            case "plot_thread": return "Plot Thread";
            default: return type;
        }
    };

    return (
        <ScrollArea className="h-full" data-testid="campaign-panel">
            <div className="p-4 space-y-4">
                {/* Campaign Header */}
                <div className="border-b border-zinc-800/50 pb-4">
                    <h2 className="font-heading text-lg text-zinc-100">{campaign.name}</h2>
                    {campaign.description && (
                        <p className="text-sm text-zinc-400 mt-1">{campaign.description}</p>
                    )}
                </div>

                {/* Pending Updates (AI Suggestions) */}
                {pendingUpdates.length > 0 && (
                    <Collapsible
                        open={openSections.pendingUpdates}
                        onOpenChange={() => toggleSection("pendingUpdates")}
                        className="bg-amber-950/20 border border-amber-500/30 rounded-sm"
                        data-testid="campaign-pending-updates"
                    >
                        <CollapsibleTrigger className="w-full flex items-center justify-between p-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                                    Pending Updates ({pendingUpdates.length})
                                </span>
                            </div>
                            {openSections.pendingUpdates ? (
                                <ChevronDown className="w-4 h-4 text-amber-400" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-amber-400" />
                            )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-3 pb-3 space-y-2">
                            <p className="text-xs text-amber-200/70 mb-2">
                                AI-suggested updates from your sessions. Review and approve or reject.
                            </p>
                            {pendingUpdates.map((update) => (
                                <div 
                                    key={update.id} 
                                    className="bg-zinc-900/50 rounded-sm p-3 border border-zinc-800/50"
                                    data-testid={`pending-update-${update.id}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getUpdateTypeIcon(update.update_type)}
                                            <span className="text-xs font-mono text-amber-300">
                                                {getUpdateTypeLabel(update.update_type)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 text-green-400 hover:text-green-300 hover:bg-green-900/30"
                                                onClick={() => onApproveJournalUpdate(update.id, true)}
                                                data-testid={`approve-update-${update.id}`}
                                            >
                                                <Check className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                                                onClick={() => onApproveJournalUpdate(update.id, false)}
                                                data-testid={`reject-update-${update.id}`}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-zinc-300">
                                        {update.update_type === "journal_entry" ? (
                                            <div>
                                                <p className="font-medium">{update.data?.session_title}</p>
                                                <p className="text-zinc-400 text-xs mt-1">{update.data?.summary?.slice(0, 200)}...</p>
                                            </div>
                                        ) : update.update_type === "npc" ? (
                                            <p><strong>{update.data?.name}</strong>: {update.data?.description}</p>
                                        ) : update.update_type === "faction" ? (
                                            <p><strong>{update.data?.name}</strong> [{update.data?.relationship}]: {update.data?.description}</p>
                                        ) : update.update_type === "plot_thread" ? (
                                            <p><strong>{update.data?.title}</strong>: {update.data?.description}</p>
                                        ) : update.update_type === "world_state" ? (
                                            <p>[{update.data?.category}] {update.data?.fact}</p>
                                        ) : (
                                            <p>{JSON.stringify(update.data)}</p>
                                        )}
                                    </div>
                                    {update.ai_reasoning && (
                                        <p className="text-xs text-zinc-500 mt-2 italic">
                                            AI: {update.ai_reasoning}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                )}

                {/* Campaign Journal */}
                <Collapsible
                    open={openSections.journal}
                    onOpenChange={() => toggleSection("journal")}
                    className="bg-zinc-900/30 border border-zinc-800/50 rounded-sm"
                    data-testid="campaign-journal"
                >
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <Book className="w-4 h-4 text-teal-400" />
                            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                                Campaign Journal
                            </span>
                        </div>
                        {openSections.journal ? (
                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3 space-y-3">
                        {activeSession && (
                            <Button
                                onClick={onGenerateJournal}
                                disabled={isGeneratingJournal}
                                className="w-full btn-secondary text-xs"
                                data-testid="generate-journal-btn"
                            >
                                <RefreshCw className={`w-3 h-3 mr-2 ${isGeneratingJournal ? 'animate-spin' : ''}`} />
                                {isGeneratingJournal ? "Generating..." : "Update Journal from Session"}
                            </Button>
                        )}
                        
                        {(journal.entries || []).length === 0 ? (
                            <p className="text-sm text-zinc-500 text-center py-4">
                                No journal entries yet. Complete a session to generate entries.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {(journal.entries || []).slice().reverse().map((entry, idx) => (
                                    <div 
                                        key={entry.id || idx}
                                        className="bg-zinc-800/30 rounded-sm p-3 border border-zinc-700/30"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-zinc-200">
                                                {entry.session_title}
                                            </span>
                                            <span className="text-xs text-zinc-500">
                                                {new Date(entry.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-400">{entry.summary}</p>
                                        {entry.key_events?.length > 0 && (
                                            <div className="mt-2">
                                                <span className="text-[10px] font-mono uppercase text-zinc-500">Key Events:</span>
                                                <ul className="text-xs text-zinc-400 list-disc list-inside">
                                                    {entry.key_events.map((evt, i) => (
                                                        <li key={i}>{evt}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CollapsibleContent>
                </Collapsible>

                {/* World State */}
                <Collapsible
                    open={openSections.worldState}
                    onOpenChange={() => toggleSection("worldState")}
                    className="bg-zinc-900/30 border border-zinc-800/50 rounded-sm"
                    data-testid="campaign-world-state"
                >
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                                World State ({(campaign.world_state || []).length})
                            </span>
                        </div>
                        {openSections.worldState ? (
                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3 space-y-2">
                        <div className="bg-zinc-800/20 rounded-sm p-2 border border-zinc-700/20 mb-2">
                            <p className="text-xs text-zinc-400">
                                Persistent world-building facts referenced across all sessions. 
                                Only add established truths — not investigation leads, theories, or temporary details.
                            </p>
                        </div>
                        
                        {(campaign.world_state || []).map((fact, idx) => (
                            <div 
                                key={idx}
                                className="bg-zinc-800/30 rounded-sm p-2 border border-zinc-700/30"
                                data-testid={`world-fact-${idx}`}
                            >
                                {editingFactIdx === idx ? (
                                    <div className="space-y-2">
                                        <Textarea
                                            value={editingFact.fact}
                                            onChange={(e) => setEditingFact(prev => ({ ...prev, fact: e.target.value }))}
                                            className="bg-zinc-900/50 border-zinc-700/50 text-sm min-h-[50px]"
                                        />
                                        <div className="flex gap-2 items-center">
                                            <Select
                                                value={editingFact.category}
                                                onValueChange={(v) => setEditingFact(prev => ({ ...prev, category: v }))}
                                            >
                                                <SelectTrigger className="bg-zinc-900/50 border-zinc-700/50 text-xs flex-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {WORLD_STATE_CATEGORIES.map(c => (
                                                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button size="sm" className="btn-secondary h-7 px-2" onClick={handleSaveEditWorldFact}>
                                                <Check className="w-3 h-3" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-7 px-2 text-zinc-400" onClick={() => setEditingFactIdx(null)}>
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${getCategoryStyle(fact.category)}`}>
                                                {fact.category || "general"}
                                            </span>
                                            <p className="text-sm text-zinc-300 mt-1">{fact.fact}</p>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
                                                onClick={() => handleEditWorldFact(idx)}
                                                data-testid={`edit-world-fact-${idx}`}
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 text-zinc-500 hover:text-red-400"
                                                onClick={() => handleRemoveWorldFact(idx)}
                                                data-testid={`remove-world-fact-${idx}`}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <div className="border-t border-zinc-800/50 pt-2 mt-2 space-y-2">
                            <Textarea
                                placeholder="e.g., The Avernian Gate beneath St. Mary's has been sealed..."
                                value={newWorldFact.fact}
                                onChange={(e) => setNewWorldFact(prev => ({ ...prev, fact: e.target.value }))}
                                className="bg-zinc-900/50 border-zinc-700/50 text-sm min-h-[50px]"
                                data-testid="new-world-fact-input"
                            />
                            <div className="flex gap-2">
                                <Select
                                    value={newWorldFact.category}
                                    onValueChange={(v) => setNewWorldFact(prev => ({ ...prev, category: v }))}
                                >
                                    <SelectTrigger className="bg-zinc-900/50 border-zinc-700/50 text-xs flex-1" data-testid="new-world-fact-category">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {WORLD_STATE_CATEGORIES.map(c => (
                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAddWorldFact} size="sm" className="btn-secondary" data-testid="add-world-fact-btn">
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* Factions */}
                <Collapsible
                    open={openSections.factions}
                    onOpenChange={() => toggleSection("factions")}
                    className="bg-zinc-900/30 border border-zinc-800/50 rounded-sm"
                    data-testid="campaign-factions"
                >
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-rose-400" />
                            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                                Factions ({(campaign.factions || []).length})
                            </span>
                        </div>
                        {openSections.factions ? (
                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3 space-y-2">
                        {(campaign.factions || []).map((faction, idx) => (
                            <div 
                                key={idx}
                                className="flex items-start justify-between gap-2 bg-zinc-800/30 rounded-sm p-2"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-zinc-200">{faction.name}</span>
                                        <span className={`text-[10px] font-mono uppercase px-1 rounded ${
                                            faction.relationship === "allied" ? "bg-green-900/50 text-green-300" :
                                            faction.relationship === "friendly" ? "bg-teal-900/50 text-teal-300" :
                                            faction.relationship === "hostile" ? "bg-orange-900/50 text-orange-300" :
                                            faction.relationship === "enemy" ? "bg-red-900/50 text-red-300" :
                                            "bg-zinc-800 text-zinc-400"
                                        }`}>
                                            {faction.relationship}
                                        </span>
                                    </div>
                                    {faction.territory && (
                                        <p className="text-xs text-zinc-500">Territory: {faction.territory}</p>
                                    )}
                                    {faction.description && (
                                        <p className="text-xs text-zinc-400 mt-1">{faction.description}</p>
                                    )}
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-zinc-500 hover:text-red-400"
                                    onClick={() => handleRemoveFaction(idx)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                        
                        <div className="border-t border-zinc-800/50 pt-2 mt-2 space-y-2">
                            <Input
                                placeholder="Faction name..."
                                value={newFaction.name}
                                onChange={(e) => setNewFaction(prev => ({ ...prev, name: e.target.value }))}
                                className="bg-zinc-900/50 border-zinc-700/50 text-sm"
                            />
                            <div className="flex gap-2">
                                <Select
                                    value={newFaction.relationship}
                                    onValueChange={(v) => setNewFaction(prev => ({ ...prev, relationship: v }))}
                                >
                                    <SelectTrigger className="bg-zinc-900/50 border-zinc-700/50 text-xs flex-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="allied">Allied</SelectItem>
                                        <SelectItem value="friendly">Friendly</SelectItem>
                                        <SelectItem value="neutral">Neutral</SelectItem>
                                        <SelectItem value="hostile">Hostile</SelectItem>
                                        <SelectItem value="enemy">Enemy</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Territory..."
                                    value={newFaction.territory}
                                    onChange={(e) => setNewFaction(prev => ({ ...prev, territory: e.target.value }))}
                                    className="bg-zinc-900/50 border-zinc-700/50 text-xs flex-1"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Description..."
                                    value={newFaction.description}
                                    onChange={(e) => setNewFaction(prev => ({ ...prev, description: e.target.value }))}
                                    className="bg-zinc-900/50 border-zinc-700/50 text-xs flex-1 min-h-[60px]"
                                />
                                <Button onClick={handleAddFaction} size="sm" className="btn-secondary self-end">
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* Recurring NPCs */}
                <Collapsible
                    open={openSections.npcs}
                    onOpenChange={() => toggleSection("npcs")}
                    className="bg-zinc-900/30 border border-zinc-800/50 rounded-sm"
                    data-testid="campaign-npcs"
                >
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-sky-400" />
                            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                                Recurring NPCs ({(campaign.recurring_npcs || []).length})
                            </span>
                        </div>
                        {openSections.npcs ? (
                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3 space-y-2">
                        {(campaign.recurring_npcs || []).map((npc, idx) => (
                            <div 
                                key={idx}
                                className="flex items-start justify-between gap-2 bg-zinc-800/30 rounded-sm p-2"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-zinc-200">{npc.name}</span>
                                        {npc.type && (
                                            <span className="text-[10px] font-mono uppercase text-sky-400">
                                                {npc.type}
                                            </span>
                                        )}
                                        <span className={`text-[10px] font-mono uppercase px-1 rounded ${
                                            npc.status === "dead" ? "bg-red-900/50 text-red-300" :
                                            npc.status === "missing" ? "bg-amber-900/50 text-amber-300" :
                                            npc.status === "resolved" ? "bg-zinc-700 text-zinc-400" :
                                            "bg-green-900/50 text-green-300"
                                        }`}>
                                            {npc.status}
                                        </span>
                                    </div>
                                    {npc.description && (
                                        <p className="text-xs text-zinc-400 mt-1">{npc.description}</p>
                                    )}
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-zinc-500 hover:text-red-400"
                                    onClick={() => handleRemoveNPC(idx)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                        
                        <div className="border-t border-zinc-800/50 pt-2 mt-2 space-y-2">
                            <Input
                                placeholder="NPC name..."
                                value={newNPC.name}
                                onChange={(e) => setNewNPC(prev => ({ ...prev, name: e.target.value }))}
                                className="bg-zinc-900/50 border-zinc-700/50 text-sm"
                            />
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Type (ghost, mortal...)"
                                    value={newNPC.type}
                                    onChange={(e) => setNewNPC(prev => ({ ...prev, type: e.target.value }))}
                                    className="bg-zinc-900/50 border-zinc-700/50 text-xs flex-1"
                                />
                                <Select
                                    value={newNPC.status}
                                    onValueChange={(v) => setNewNPC(prev => ({ ...prev, status: v }))}
                                >
                                    <SelectTrigger className="bg-zinc-900/50 border-zinc-700/50 text-xs flex-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="dead">Dead</SelectItem>
                                        <SelectItem value="missing">Missing</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Description..."
                                    value={newNPC.description}
                                    onChange={(e) => setNewNPC(prev => ({ ...prev, description: e.target.value }))}
                                    className="bg-zinc-900/50 border-zinc-700/50 text-xs flex-1 min-h-[60px]"
                                />
                                <Button onClick={handleAddNPC} size="sm" className="btn-secondary self-end">
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* Plot Threads */}
                <Collapsible
                    open={openSections.plotThreads}
                    onOpenChange={() => toggleSection("plotThreads")}
                    className="bg-zinc-900/30 border border-zinc-800/50 rounded-sm"
                    data-testid="campaign-plot-threads"
                >
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                                Plot Threads ({(campaign.plot_threads || []).length})
                            </span>
                        </div>
                        {openSections.plotThreads ? (
                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3 space-y-2">
                        {(campaign.plot_threads || []).map((thread, idx) => (
                            <div 
                                key={idx}
                                className="flex items-start justify-between gap-2 bg-zinc-800/30 rounded-sm p-2"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-zinc-200">{thread.title}</span>
                                        <span className={`text-[10px] font-mono uppercase px-1 rounded ${
                                            thread.status === "resolved" ? "bg-green-900/50 text-green-300" :
                                            thread.status === "abandoned" ? "bg-zinc-700 text-zinc-400" :
                                            "bg-amber-900/50 text-amber-300"
                                        }`}>
                                            {thread.status}
                                        </span>
                                    </div>
                                    {thread.description && (
                                        <p className="text-xs text-zinc-400 mt-1">{thread.description}</p>
                                    )}
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-zinc-500 hover:text-red-400"
                                    onClick={() => handleRemovePlotThread(idx)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                        
                        <div className="border-t border-zinc-800/50 pt-2 mt-2 space-y-2">
                            <Input
                                placeholder="Plot thread title..."
                                value={newPlotThread.title}
                                onChange={(e) => setNewPlotThread(prev => ({ ...prev, title: e.target.value }))}
                                className="bg-zinc-900/50 border-zinc-700/50 text-sm"
                            />
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Description..."
                                    value={newPlotThread.description}
                                    onChange={(e) => setNewPlotThread(prev => ({ ...prev, description: e.target.value }))}
                                    className="bg-zinc-900/50 border-zinc-700/50 text-xs flex-1 min-h-[60px]"
                                />
                                <Button onClick={handleAddPlotThread} size="sm" className="btn-secondary self-end">
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </ScrollArea>
    );
};