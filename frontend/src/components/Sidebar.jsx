import { useState } from "react";
import { Plus, Trash2, MessageSquare, Skull, BookMarked, ChevronDown, ChevronRight, Folder, FolderOpen, Zap, Pencil, Sparkles, Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatDistanceToNow } from "date-fns";

export const Sidebar = ({
    sessions,
    campaigns,
    activeSession,
    activeCampaign,
    onSelectSession,
    onSelectCampaign,
    onCreateSession,
    onCreateCampaign,
    onDeleteSession,
    onDeleteCampaign,
    onMoveSessionToCampaign,
    sidebarCollapsed = false,
    onToggleSidebarCollapse,
}) => {
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
    const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false);
    const [newSessionCampaignId, setNewSessionCampaignId] = useState("one-shot");
    const [newCampaignName, setNewCampaignName] = useState("");
    const [newCampaignDesc, setNewCampaignDesc] = useState("");
    const [expandedCampaigns, setExpandedCampaigns] = useState({});
    const [moveSessionId, setMoveSessionId] = useState(null);
    const [moveTargetCampaignId, setMoveTargetCampaignId] = useState("");
    const [editingSession, setEditingSession] = useState(null);
    const [editedSessionTitle, setEditedSessionTitle] = useState("");
    const [suggestingSessionTitle, setSuggestingSessionTitle] = useState(false);
    const [savingSessionTitle, setSavingSessionTitle] = useState(false);

    const formatDate = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return "Unknown";
        }
    };

    const handleCreateSession = () => {
        const campaignId = newSessionCampaignId === "one-shot" ? null : newSessionCampaignId;
        onCreateSession(campaignId);
        setShowNewSessionDialog(false);
        setNewSessionCampaignId("one-shot");
    };

    const handleCreateCampaign = () => {
        if (!newCampaignName.trim()) return;
        onCreateCampaign(newCampaignName, newCampaignDesc);
        setShowNewCampaignDialog(false);
        setNewCampaignName("");
        setNewCampaignDesc("");
    };

    const toggleCampaignExpand = (campaignId) => {
        setExpandedCampaigns(prev => ({
            ...prev,
            [campaignId]: !prev[campaignId]
        }));
    };

    const handleMoveSession = () => {
        if (!moveSessionId || !moveTargetCampaignId) return;
        onMoveSessionToCampaign(moveSessionId, moveTargetCampaignId);
        setMoveSessionId(null);
        setMoveTargetCampaignId("");
    };

    const openRenameSessionDialog = (session) => {
        setEditingSession(session);
        setEditedSessionTitle(session.title || "");
    };

    const handleSuggestSessionTitle = async () => {
        if (!editingSession || !onSuggestSessionTitle || suggestingSessionTitle) return;

        try {
            setSuggestingSessionTitle(true);
            const suggestedTitle = await onSuggestSessionTitle(editingSession.id);
            setEditedSessionTitle(suggestedTitle);
        } finally {
            setSuggestingSessionTitle(false);
        }
    };

    const handleSaveSessionTitle = async () => {
        if (!editingSession || !editedSessionTitle.trim() || !onUpdateSessionTitle || savingSessionTitle) return;

        try {
            setSavingSessionTitle(true);
            await onUpdateSessionTitle(editingSession.id, editedSessionTitle.trim());
            setEditingSession(null);
            setEditedSessionTitle("");
        } finally {
            setSavingSessionTitle(false);
        }
    };

    // Group sessions by campaign
    const oneShots = sessions.filter(s => !s.campaign_id);
    const campaignSessions = {};
    campaigns.forEach(c => {
        campaignSessions[c.id] = sessions.filter(s => s.campaign_id === c.id);
    });

    return (
        <div className="flex flex-col h-full" data-testid="sidebar">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800/50">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-sm bg-teal-900/30 border border-teal-500/30 flex items-center justify-center">
                            <Skull className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                            <h1 className="font-heading text-xl font-semibold text-zinc-100">
                                Geist
                            </h1>
                            <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">
                                Sin-Eaters
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleSidebarCollapse}
                        className="hidden lg:flex text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 flex-shrink-0"
                        data-testid="desktop-sidebar-collapse-toggle"
                        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="p-4 space-y-2">
                <Button
                    onClick={() => setShowNewSessionDialog(true)}
                    className="w-full btn-primary flex items-center gap-2"
                    data-testid="new-session-btn"
                >
                    <Plus className="w-4 h-4" />
                    New Session
                </Button>
                <Button
                    onClick={() => setShowNewCampaignDialog(true)}
                    variant="outline"
                    className="w-full flex items-center gap-2 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50"
                    data-testid="new-campaign-btn"
                >
                    <BookMarked className="w-4 h-4" />
                    New Campaign
                </Button>
            </div>

            {/* Sessions List */}
            <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 pb-4">
                    {/* Campaigns */}
                    {campaigns.length > 0 && (
                        <div className="space-y-2">
                            {campaigns.map((campaign) => (
                                <Collapsible
                                    key={campaign.id}
                                    open={expandedCampaigns[campaign.id] !== false}
                                    onOpenChange={() => toggleCampaignExpand(campaign.id)}
                                >
                                    <div 
                                        className={`rounded-sm transition-all duration-200 ${
                                            activeCampaign?.id === campaign.id
                                                ? "bg-purple-900/20 border border-purple-500/30"
                                                : "bg-zinc-900/30 border border-zinc-800/50"
                                        }`}
                                    >
                                        <CollapsibleTrigger className="w-full">
                                            <div 
                                                className="p-3 flex items-center justify-between cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectCampaign(campaign);
                                                }}
                                            >
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    {expandedCampaigns[campaign.id] !== false ? (
                                                        <FolderOpen className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                    ) : (
                                                        <Folder className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                    )}
                                                    <span className="text-sm text-zinc-200 font-medium truncate">
                                                        {campaign.name}
                                                    </span>
                                                    <span className="text-xs text-zinc-500 flex-shrink-0">
                                                        ({campaignSessions[campaign.id]?.length || 0})
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400"
                                                                onClick={(e) => e.stopPropagation()}
                                                                data-testid={`delete-campaign-${campaign.id}`}
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-zinc-100">
                                                                    Delete Campaign?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription className="text-zinc-400">
                                                                    This will delete "{campaign.name}" and unlink all its sessions (they'll become one-shots).
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => onDeleteCampaign(campaign.id)}
                                                                    className="bg-red-900/50 border border-red-500/50 text-red-200 hover:bg-red-800/50"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                    {expandedCampaigns[campaign.id] !== false ? (
                                                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <div className="px-2 pb-2 space-y-1">
                                                {campaignSessions[campaign.id]?.length === 0 ? (
                                                    <p className="text-xs text-zinc-500 px-2 py-1">No sessions yet</p>
                                                ) : (
                                                    campaignSessions[campaign.id]?.map((session) => (
                                                        <SessionItem
                                                            key={session.id}
                                                            session={session}
                                                            isActive={activeSession?.id === session.id}
                                                            onSelect={() => onSelectSession(session)}
                                                            onDelete={() => onDeleteSession(session.id)}
                                                            onRename={() => openRenameSessionDialog(session)}
                                                            formatDate={formatDate}
                                                            indent
                                                        />
                                                    ))
                                                )}
                                            </div>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                            ))}
                        </div>
                    )}

                    {/* One-Shot Sessions */}
                    {oneShots.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 px-2">
                                <Zap className="w-3 h-3 text-zinc-500" />
                                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                                    One-Shots ({oneShots.length})
                                </span>
                            </div>
                            {oneShots.map((session) => (
                                <SessionItem
                                    key={session.id}
                                    session={session}
                                    isActive={activeSession?.id === session.id}
                                    onSelect={() => onSelectSession(session)}
                                    onDelete={() => onDeleteSession(session.id)}
                                    onRename={() => openRenameSessionDialog(session)}
                                    onMove={() => {
                                        setMoveSessionId(session.id);
                                        setMoveTargetCampaignId("");
                                    }}
                                    canMove={campaigns.length > 0}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}

                    {sessions.length === 0 && campaigns.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-zinc-500 text-sm">No sessions yet</p>
                            <p className="text-zinc-600 text-xs mt-1">
                                Create a campaign or start a one-shot
                            </p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* New Session Dialog */}
            <Dialog open={showNewSessionDialog} onOpenChange={setShowNewSessionDialog}>
                <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100">New Session</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Choose a campaign for this session or create a one-shot.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select
                            value={newSessionCampaignId}
                            onValueChange={setNewSessionCampaignId}
                        >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-200">
                                <SelectValue placeholder="Select campaign..." />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                <SelectItem value="one-shot" className="text-zinc-200">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-400" />
                                        One-Shot (No Campaign)
                                    </div>
                                </SelectItem>
                                {campaigns.map((campaign) => (
                                    <SelectItem key={campaign.id} value={campaign.id} className="text-zinc-200">
                                        <div className="flex items-center gap-2">
                                            <BookMarked className="w-4 h-4 text-purple-400" />
                                            {campaign.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowNewSessionDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateSession} className="btn-primary">
                            Create Session
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Move Session Dialog */}
            <Dialog
                open={!!moveSessionId}
                onOpenChange={(open) => {
                    if (!open) {
                        setMoveSessionId(null);
                        setMoveTargetCampaignId("");
                    }
                }}  
            >
                <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100">Move Session to Campaign</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Choose which campaign this one-shot should belong to.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select
                            value={moveTargetCampaignId}
                            onValueChange={setMoveTargetCampaignId}
                        >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-200">
                                <SelectValue placeholder="Select campaign..." />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                {campaigns.map((campaign) => (
                                    <SelectItem key={campaign.id} value={campaign.id} className="text-zinc-200">
                                        <div className="flex items-center gap-2">
                                            <BookMarked className="w-4 h-4 text-purple-400" />
                                            {campaign.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setMoveSessionId(null);
                                setMoveTargetCampaignId("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleMoveSession}
                            className="btn-primary"
                            disabled={!moveTargetCampaignId}
                        >
                            Move Session
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rename Session Dialog */}
            <Dialog
                open={!!editingSession}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingSession(null);
                        setEditedSessionTitle("");
                    }
                }}
            >
                <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100">Rename Session</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Edit the session title manually or ask the AI to suggest one from the session transcript.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <label className="text-xs font-mono uppercase text-zinc-500 mb-1 block">
                                Session Title
                            </label>
                            <Input
                                value={editedSessionTitle}
                                onChange={(e) => setEditedSessionTitle(e.target.value)}
                                placeholder="Enter a session title..."
                                className="bg-zinc-800 border-zinc-700 text-zinc-200"
                            />
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSuggestSessionTitle}
                            disabled={!editingSession || suggestingSessionTitle}
                            className="w-full flex items-center gap-2 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50"
                        >
                            {suggestingSessionTitle ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            Suggest with AI
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setEditingSession(null);
                                setEditedSessionTitle("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveSessionTitle}
                            className="btn-primary"
                            disabled={!editedSessionTitle.trim() || savingSessionTitle}
                        >
                            {savingSessionTitle ? "Saving..." : "Save Title"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* New Campaign Dialog */}
            <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
                <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100">New Campaign</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Create a chronicle to group your sessions together.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <label className="text-xs font-mono uppercase text-zinc-500 mb-1 block">
                                Chronicle Name
                            </label>
                            <Input
                                value={newCampaignName}
                                onChange={(e) => setNewCampaignName(e.target.value)}
                                placeholder="e.g., The Cemetery District"
                                className="bg-zinc-800 border-zinc-700 text-zinc-200"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-mono uppercase text-zinc-500 mb-1 block">
                                Description (Optional)
                            </label>
                            <Input
                                value={newCampaignDesc}
                                onChange={(e) => setNewCampaignDesc(e.target.value)}
                                placeholder="A brief description of your chronicle..."
                                className="bg-zinc-800 border-zinc-700 text-zinc-200"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowNewCampaignDialog(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreateCampaign} 
                            className="btn-primary"
                            disabled={!newCampaignName.trim()}
                        >
                            Create Campaign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800/50">
                <p className="text-xs text-zinc-600 text-center font-mono">
                    Chronicles of Darkness
                </p>
            </div>
        </div>
    );
};

// Session Item Component
const SessionItem = ({
    session,
    isActive,
    onSelect,
    onDelete,
    onRename,
    onMove,
    canMove = false,
    formatDate,
    indent = false
}) => (
    <div
        className={`group relative rounded-sm cursor-pointer transition-all duration-200 ${
            indent ? "ml-4" : ""
        } ${
            isActive
                ? "bg-teal-900/20 border border-teal-500/30"
                : "bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-800/50"
        }`}
        onClick={onSelect}
        data-testid={`session-item-${session.id}`}
    >
        <div className="p-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                    <MessageSquare className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                    <span
                        className="text-sm text-zinc-200 leading-snug break-words overflow-hidden"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {session.title}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-teal-400"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRename();
                        }}
                        data-testid={`rename-session-${session.id}`}
                        title="Rename session"
                    >
                        <Pencil className="w-3 h-3" />
                    </Button>

                    {canMove && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-purple-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMove();
                            }}
                            data-testid={`move-session-${session.id}`}
                            title="Move to campaign"
                        >
                            <Folder className="w-3 h-3" />
                        </Button>
                    )}

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400"
                                onClick={(e) => e.stopPropagation()}
                                data-testid={`delete-session-${session.id}`}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-zinc-100">
                                    Delete Session?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">
                                    This will permanently delete "{session.title}" and all its messages.
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={onDelete}
                                    className="bg-red-900/50 border border-red-500/50 text-red-200 hover:bg-red-800/50"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-600">
                    {formatDate(session.updated_at)}
                </span>
                {session.messages?.length > 0 && (
                    <span className="text-xs text-zinc-600">
                        · {session.messages.length} messages
                    </span>
                )}
            </div>
        </div>
    </div>
);