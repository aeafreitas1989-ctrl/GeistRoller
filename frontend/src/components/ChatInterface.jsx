import { useState } from "react";
import { Send, Loader2, Ghost, User, Dices, Flag, Check, Plus, Minus, Star, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InlineDiceRoller } from "./character/InlineDiceRoller";

const ROLL_REGEX = /\{\{roll\|([^}]+)\}\}/g;
const BEATS_REGEX = /\{\{beats\|([^}]+)\}\}/g;
const SUMMARY_REGEX = /\{\{summary\|([^}]+)\}\}/g;

function parseRollToken(inner) {
    const parts = inner.split("|");
    const label = parts[0] || "Roll";
    const params = {
        label,
        formula: label,
        pool: 1,
        specialty: false,
        again: 10,
        rote: false,
    };

    for (let i = 1; i < parts.length; i++) {
        const [key, ...rest] = parts[i].split(":");
        const val = rest.join(":").trim();

        if (key === "formula") params.formula = val || label;
        else if (key === "pool") params.pool = Math.max(1, parseInt(val) || 1);
        else if (key === "specialty") params.specialty = val === "true";
        else if (key === "again") params.again = parseInt(val) || 10;
        else if (key === "rote") params.rote = val === "true";
    }

    return params;
}

function parseBeatsToken(inner) {
    const parts = inner.split("|");
    const params = { chapter: 1, aspirations: 0, dramatic: 0, other: 0, notes: "" };
    for (const part of parts) {
        const [key, ...rest] = part.split(":");
        const val = rest.join(":");
        if (key === "chapter") params.chapter = parseInt(val) || 1;
        else if (key === "aspirations") params.aspirations = parseInt(val) || 0;
        else if (key === "dramatic") params.dramatic = parseInt(val) || 0;
        else if (key === "other") params.other = parseInt(val) || 0;
        else if (key === "notes") params.notes = val.trim();
    }
    return params;
}

function buildRollButtonLabel(params) {
    const parts = [params.label];
    const mods = [];
    if (params.again !== 10) mods.push(`${params.again}-again`);
    if (params.rote) mods.push("rote");
    if (mods.length > 0) return `${parts[0]} [${mods.join(", ")}]`;
    return parts[0];
}

const BeatAwardCard = ({ beatsData, onClaimBeats, claimed }) => {
    const [adjustments, setAdjustments] = useState({
        chapter: beatsData.chapter,
        aspirations: beatsData.aspirations,
        dramatic: beatsData.dramatic,
        other: beatsData.other,
    });

    const adjust = (category, delta) => {
        if (claimed) return;
        setAdjustments((prev) => ({
            ...prev,
            [category]: Math.max(0, prev[category] + delta),
        }));
    };

    const total = adjustments.chapter + adjustments.aspirations + adjustments.dramatic + adjustments.other;

    const categories = [
        { key: "chapter", label: "Chapter End", fixed: true },
        { key: "aspirations", label: "Aspirations" },
        { key: "dramatic", label: "Dramatic Events" },
        { key: "other", label: "Other" },
    ];

    return (
        <div className="my-3 p-4 rounded-sm bg-amber-950/30 border border-amber-500/40" data-testid="beat-award-card">
            <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="font-heading text-lg text-amber-300">Chapter Beat Awards</span>
            </div>

            <div className="space-y-2 mb-3">
                {categories.map(({ key, label, fixed }) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">{label}</span>
                        <div className="flex items-center gap-2">
                            {!fixed && !claimed && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-zinc-500 hover:text-amber-300"
                                    onClick={() => adjust(key, -1)}
                                    data-testid={`beat-decrease-${key}`}
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                            )}
                            <span className="font-mono text-amber-300 w-6 text-center" data-testid={`beat-count-${key}`}>
                                {adjustments[key]}
                            </span>
                            {!fixed && !claimed && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-zinc-500 hover:text-amber-300"
                                    onClick={() => adjust(key, 1)}
                                    data-testid={`beat-increase-${key}`}
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {beatsData.notes && (
                <p className="text-xs text-zinc-500 italic mb-3 border-t border-amber-500/20 pt-2">
                    {beatsData.notes}
                </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
                <span className="text-sm font-heading text-amber-200">
                    Total: <span className="font-mono text-lg">{total}</span> Beat{total !== 1 ? "s" : ""}
                </span>
                {claimed ? (
                    <div className="flex items-center gap-2 text-sm text-teal-400" data-testid="beats-claimed-indicator">
                        <Check className="w-4 h-4" />
                        <span>Beats Awarded!</span>
                    </div>
                ) : (
                    <Button
                        onClick={() => onClaimBeats(total)}
                        className="btn-primary h-8 px-4 text-sm"
                        disabled={total <= 0}
                        data-testid="claim-beats-btn"
                    >
                        <Star className="w-3.5 h-3.5 mr-1.5" />
                        Claim {total} Beat{total !== 1 ? "s" : ""}
                    </Button>
                )}
            </div>
        </div>
    );
};

export const ChatInterface = ({
    messages,
    onSendMessage,
    isLoading,
    activeSession,
    messagesEndRef,
    onDiceRollResult,
    onEndChapter,
    onClaimBeats,
    onSummaryUpdate,
    onRefreshSummary,
    chapterEnded,
    beatsClaimed,
    activeCharacter,
    onSpendWillpower,
    onSpendPlasm,
    onAddCondition,
    onAwardBeat,
    sessionSummary,
}) => {
    const [input, setInput] = useState("");
    const [rollPopup, setRollPopup] = useState({ open: false, data: null });

    const getValue = (field) => activeCharacter?.[field];
    const getNestedValue = (parent, field) => activeCharacter?.[parent]?.[field] ?? 0;

    const doomedKeys = new Set(
        (activeCharacter?.conditions || [])
            .filter((condition) => condition?.name === "Doomed" && condition?.origin)
            .map((condition) => condition.origin)
    );

    const allAvailableKeys = (() => {
        const keys = new Set();

        const characterKey = activeCharacter?.innate_key;
        if (characterKey) keys.add(characterKey);

        const geistKey = activeCharacter?.geist_innate_key;
            if (geistKey) keys.add(geistKey);

        (activeCharacter?.mementos || []).forEach((memento) => {
            if (memento?.key) keys.add(memento.key);
        });

        (activeCharacter?.keys || []).forEach((key) => keys.add(key));

        doomedKeys.forEach((key) => keys.delete(key));

        return Array.from(keys);
    })();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleRollClick = (rollData) => {
        setRollPopup({
            open: true,
            data: {
                ...rollData,
                type: "chat",
            },
        });
    };

    const handleRollResult = (resultText) => {
        if (onDiceRollResult) onDiceRollResult(resultText);
    };

    const renderSegment = (line, pi, li) => {
        const segments = [];
        let lastIndex = 0;

        // Combined regex for roll, beats, and summary tokens
        // Note: [^}]+ doesn't work for summary tokens which contain | characters
        // so we use a different pattern that matches until }}
        const combinedRegex = /\{\{(roll|beats|summary)\|(.+?)\}\}/g;
        let match;

        while ((match = combinedRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
                segments.push(
                    <span key={`t-${pi}-${li}-${lastIndex}`}>{line.slice(lastIndex, match.index)}</span>
                );
            }

            const tokenType = match[1];
            const tokenInner = match[2];

            if (tokenType === "roll") {
                const rollData = parseRollToken(tokenInner);
                const buttonLabel = buildRollButtonLabel(rollData);
                segments.push(
                    <button
                        key={`r-${pi}-${li}-${match.index}`}
                        onClick={() => handleRollClick(rollData)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 mx-0.5 rounded-full bg-teal-900/40 border border-teal-500/40 text-teal-300 text-xs font-mono hover:bg-teal-800/50 hover:border-teal-400/60 transition-all cursor-pointer align-baseline"
                        data-testid={`roll-btn-${pi}-${li}-${match.index}`}
                    >
                        <Dices className="w-3 h-3 flex-shrink-0" />
                        {buttonLabel} ({rollData.pool}d)
                    </button>
                );
            } else if (tokenType === "beats") {
                const beatsData = parseBeatsToken(tokenInner);
                segments.push(
                    <BeatAwardCard
                        key={`b-${pi}-${li}-${match.index}`}
                        beatsData={beatsData}
                        onClaimBeats={onClaimBeats}
                        claimed={beatsClaimed}
                    />
                );
            } else if (tokenType === "summary") {
                // Summary tokens are stripped from chat — only sent to the side panel
                // Don't render anything here
            }

            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < line.length) {
            segments.push(
                <span key={`t-${pi}-${li}-${lastIndex}`}>{line.slice(lastIndex)}</span>
            );
        }

        return segments.length > 0 ? segments : line;
    };

    const formatMessageContent = (content) => {
        if (content == null) content = "";
        if (typeof content !== "string") {
            try { content = JSON.stringify(content, null, 2); } catch { content = String(content); }
        }

        const hasTokens = content.includes("{{roll|") || content.includes("{{beats|") || content.includes("{{summary|");

        const cleanedContent = content
            .replace(/\{\{summary\|[\s\S]*?\}\}/g, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

        const paragraphs = cleanedContent.split(/\n\n+/);
        return paragraphs.map((p, pi) => {
            const lines = p.split("\n");
            return (
                <p key={pi} className="mb-3 last:mb-0">
                    {lines.map((line, li) => (
                        <span key={`line-${pi}-${li}`}>
                            {hasTokens ? renderSegment(line, pi, li) : line}
                            {li < lines.length - 1 && <br />}
                        </span>
                    ))}
                </p>
            );
        });
    };

    if (!activeSession) {
        return (
            <div className="chat-container flex items-center justify-center" data-testid="chat-interface">
                <div className="text-center">
                    <Ghost className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h2 className="font-heading text-2xl text-zinc-400 mb-2">No Session Selected</h2>
                    <p className="text-zinc-600 max-w-md">
                        Create a new session or select an existing one to begin your journey through the Underworld.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container" data-testid="chat-interface">
            {/* Session Header */}
            <div className="mb-4 pb-4 border-b border-zinc-800/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-heading text-2xl text-zinc-200" data-testid="session-title">
                            {activeSession.title}
                        </h2>
                        {sessionSummary?.location || sessionSummary?.datetime || sessionSummary?.weather ? (
                            <p className="text-sm text-zinc-400 mt-1 font-mono" data-testid="scene-info">
                                {sessionSummary.location && (
                                    <span className="text-zinc-300">{sessionSummary.location}</span>
                                )}
                                {sessionSummary.datetime && (
                                    <span className="text-zinc-500">
                                        {sessionSummary.location ? `, ${sessionSummary.datetime}` : sessionSummary.datetime}
                                    </span>
                                )}
                                {sessionSummary.weather && (
                                    <span className="text-zinc-500">
                                        {(sessionSummary.location || sessionSummary.datetime) ? ` - ${sessionSummary.weather}` : sessionSummary.weather}
                                    </span>
                                )}
                            </p>
                        ) : null}
                    </div>
                    {messages.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={onRefreshSummary}
                                disabled={isLoading}
                                className="h-8 px-3 text-xs font-mono uppercase tracking-wider bg-sky-950/40 border border-sky-500/30 text-sky-300 hover:bg-sky-900/50 hover:border-sky-400/50 transition-all"
                                data-testid="refresh-summary-btn"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} /> Summary
                            </Button>
                            <Button
                                onClick={onEndChapter}
                                disabled={isLoading || chapterEnded}
                                className={`h-8 px-3 text-xs font-mono uppercase tracking-wider transition-all ${
                                    chapterEnded
                                        ? "bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-default"
                                        : "bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/50 hover:border-rose-400/60"
                                }`}
                                data-testid="end-chapter-btn"
                            >
                                {chapterEnded ? (
                                    <><Check className="w-3.5 h-3.5 mr-1.5" /> Chapter Ended</>
                                ) : (
                                    <><Flag className="w-3.5 h-3.5 mr-1.5" /> End Chapter</>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="messages-area flex-1">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-block p-4 rounded-full bg-teal-900/20 border border-teal-500/20 mb-4">
                            <Ghost className="w-8 h-8 text-teal-400" />
                        </div>
                        <h3 className="font-heading text-xl text-zinc-300 mb-2">Begin Your Tale</h3>
                        <p className="text-zinc-500 max-w-md mx-auto text-sm">
                            Describe your character's action or ask the Storyteller to set the scene. The spirits are listening...
                        </p>
                        <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
                            <p className="text-xs text-zinc-600 font-mono uppercase tracking-wider mb-3">Suggested Prompts:</p>
                            {[
                                "Set the scene for a new chronicle in the city of the dead.",
                                "My Sin-Eater awakens in a cemetery. What do I see?",
                                "I want to use my Boneyard Haunt to sense nearby ghosts."
                            ].map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(prompt)}
                                    className="block w-full text-left text-sm p-3 rounded-sm bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-300 transition-all"
                                    data-testid={`suggested-prompt-${i}`}
                                >
                                    "{prompt}"
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={message.id || index}
                                className={`p-4 rounded-sm animate-fade-in ${
                                    message.role === "user"
                                        ? "message-user"
                                        : message.role === "system" || message.isRoll
                                        ? "message-roll"
                                        : "message-storyteller"
                                }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                                data-testid={`message-${message.role}-${index}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                                            message.role === "user"
                                                ? "bg-zinc-800 border border-zinc-700"
                                                : message.role === "system" || message.isRoll
                                                ? "bg-amber-900/30 border border-amber-500/30"
                                                : "bg-teal-900/30 border border-teal-500/30"
                                        }`}
                                    >
                                        {message.role === "user" ? (
                                            <User className="w-4 h-4 text-zinc-400" />
                                        ) : message.role === "system" || message.isRoll ? (
                                            <Dices className="w-4 h-4 text-amber-400" />
                                        ) : (
                                            <Ghost className="w-4 h-4 text-teal-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className={`text-sm font-medium ${
                                                    message.role === "user"
                                                        ? "text-zinc-300"
                                                        : message.role === "system" || message.isRoll
                                                        ? "text-amber-300"
                                                        : "text-teal-300"
                                                }`}
                                            >
                                                {message.role === "user" ? "You" : message.role === "system" || message.isRoll ? "Dice Roll" : "Storyteller"}
                                            </span>
                                            <span className="text-xs text-zinc-600">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="text-zinc-300 text-sm leading-relaxed">
                                            {formatMessageContent(message.content)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="p-4 rounded-sm message-storyteller animate-fade-in">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-teal-900/30 border border-teal-500/30">
                                        <Ghost className="w-4 h-4 text-teal-400 animate-pulse" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                                        <span className="text-sm text-zinc-500">The Storyteller is weaving your fate...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </ScrollArea>

            {/* Roll Popup */}
            <Dialog open={rollPopup.open} onOpenChange={(open) => setRollPopup({ ...rollPopup, open })}>
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
                        onSpendWillpower={onSpendWillpower}
                        onAwardBeat={onAwardBeat}
                        onSpendPlasm={onSpendPlasm}
                        onAddCondition={onAddCondition}
                        onDiceRollResult={handleRollResult}
                        geistRank={getValue("geist_rank") || 1}
                        woundPenalty={getValue("wound_penalty") || 0}
                        currentPlasm={getValue("plasm") || 0}
                        preset={rollPopup.data}
                        forceExpanded={true}
                    />
                </DialogContent>
            </Dialog>

            {/* Input Area */}
            <div className="input-area">
                <form onSubmit={handleSubmit} className="relative">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe your action or speak to the Storyteller..."
                        className="input-geist min-h-[100px] pr-14 resize-none"
                        disabled={isLoading}
                        data-testid="chat-input"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="absolute bottom-3 right-3 bg-teal-900/50 border border-teal-500/50 hover:bg-teal-800/50 text-teal-200 disabled:opacity-50"
                        data-testid="send-message-btn"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </form>
                <p className="text-xs text-zinc-600 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
};