import { useState } from "react";
import { ChevronDown, ChevronRight, X, Dices, Eye, Plus, Minus, Star, Book, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { KEYS, KEY_UNLOCK_ATTRIBUTES } from "../../data/character-data";
import { StatDots, formatLabel } from "./StatComponents";

export const MementoCard = ({ memento, index, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(memento);

    const handleSave = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    return (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-sm p-2 relative group">
            {isEditing ? (
                <div className="space-y-2">
                    <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder="Memento name" className="input-geist h-7 text-xs" data-testid={`memento-${index}-name-input`} />
                    <Select value={editData.key} onValueChange={(v) => setEditData({ ...editData, key: v })}>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs" data-testid={`memento-${index}-key-select`}>
                            <SelectValue placeholder="Key..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {KEYS.map((k) => (<SelectItem key={k} value={k} className="text-zinc-200 text-xs">{k}</SelectItem>))}
                        </SelectContent>
                    </Select>
                    <Textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Description" className="input-geist min-h-[40px] text-xs" data-testid={`memento-${index}-description`} />
                    <Textarea value={editData.effect} onChange={(e) => setEditData({ ...editData, effect: e.target.value })} placeholder="Effect" className="input-geist min-h-[40px] text-xs" data-testid={`memento-${index}-effect`} />
                    <div className="flex gap-1">
                        <Button size="sm" onClick={handleSave} className="btn-primary text-xs h-6 flex-1" data-testid={`memento-${index}-save`}>
                            Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="text-xs h-6" data-testid={`memento-${index}-cancel`}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between">
                        <div>
                            <h5 className="text-sm font-heading text-amber-300">{memento.name || "Unnamed Memento"}</h5>
                            {memento.key && (
                                <span className="text-[10px] px-1 py-0.5 bg-amber-900/30 text-amber-400 rounded font-mono">{memento.key}</span>
                            )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} className="h-5 w-5 text-zinc-500 hover:text-amber-400" data-testid={`memento-${index}-edit`}>
                                <Info className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={onDelete} className="h-5 w-5 text-zinc-500 hover:text-red-400" data-testid={`memento-${index}-delete`}>
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                    {memento.description && <p className="text-[10px] text-zinc-500 mt-1">{memento.description}</p>}
                    {memento.effect && <p className="text-[10px] text-teal-400 mt-1 italic">{memento.effect}</p>}
                </>
            )}
        </div>
    );
};
