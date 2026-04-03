import { useState } from "react";
import { ChevronDown, ChevronRight, X, Dices, Eye, Plus, Minus, Star, Book, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { KEYS, KEY_UNLOCK_ATTRIBUTES, SKILL_LIST } from "../../data/character-data";
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

export const MeritCard = ({ merit, index, onDelete, onUpdate, onRollPerception }) => {
    return (
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-sm p-2 relative group space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-300">
    {merit.specialty ? `${merit.specialty} — ${merit.name}` : merit.name}
</span>
                    <StatDots
                        value={merit.dots || 0}
                        max={5}
                        onChange={() => {}}
                        color="amber"
                        size="small"
                        clickable={false}
                        testIdPrefix={`merit-${merit.name.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={onDelete}
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400"
                    data-testid={`merit-${index}-delete`}
                >
                    <X className="w-3 h-3" />
                </Button>
            </div>

            {merit.name === "Trained Observer" && (
                <div className="mt-2">
                    <Button
                        size="sm"
                        className="h-6 px-2 text-[10px] bg-sky-900/30 border border-sky-500/40 text-sky-200 hover:bg-sky-800/40"
                        onClick={onRollPerception}
                        data-testid="trained-observer-roll-perception"
                    >
                        <Dices className="w-3 h-3 mr-1" />
                        Roll Perception (Wits + Composure)
                    </Button>
                </div>
            )}

            {merit.name === "Professional Training" && (
                <div className="space-y-2">
                    <div className="text-[10px] text-zinc-500">
                        Select 3 Asset Skills. 9-again applies on rolls using these skills when Professional Training is 3+ dots.
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {[0, 1, 2].map((slot) => {
                            const current = (Array.isArray(merit.assetSkills) ? merit.assetSkills : ["__none__", "__none__", "__none__"])[slot] || "__none__";
                            return (
                                <div key={slot} className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] text-zinc-500 w-20">Asset {slot + 1}</span>
                                    <Select
                                        value={current}
                                        onValueChange={(v) => {
                                            const base = Array.isArray(merit.assetSkills) ? [...merit.assetSkills] : ["__none__", "__none__", "__none__"];
                                            base[slot] = v;
                                            onUpdate({ assetSkills: base });
                                        }}
                                    >
                                        <SelectTrigger className="flex-1 h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                            <SelectValue placeholder="Select skill..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-700 max-h-[220px]">
                                            <SelectItem value="__none__" className="text-xs">None</SelectItem>
                                            {SKILL_LIST.map((s) => (
                                                <SelectItem key={s} value={s} className="text-xs">
                                                    {formatLabel(s)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export const CeremonyCard = ({ ceremony, index, onDelete, onRoll }) => {
  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-sm bg-fuchsia-950/20 border border-fuchsia-500/20 group">
      <button
        type="button"
        onClick={onRoll}
        className="flex items-center gap-2 min-w-0 flex-1 text-left"
        data-testid={`ceremony-${(ceremony.name || "").toLowerCase().replace(/\s+/g, "-")}-roll`}
      >
        <Dices className="w-3 h-3 text-fuchsia-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
        <span className="text-xs text-zinc-200 truncate">{ceremony.name}</span>
        <StatDots
          value={ceremony.dots || 1}
          max={5}
          color="zinc"
          size="small"
          clickable={false}
          testIdPrefix={`ceremony-${(ceremony.name || "").toLowerCase().replace(/\s+/g, "-")}`}
        />
      </button>

      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="h-5 w-5 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400"
        data-testid={`ceremony-${index}-delete`}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};
