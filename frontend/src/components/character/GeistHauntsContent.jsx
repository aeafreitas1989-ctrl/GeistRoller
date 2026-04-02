import { Plus, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HAUNTS, KEYS } from "../../data/character-data";
import { StatDots } from "./StatComponents";
import { MementoCard } from "./CardComponents";

export const GeistHauntsContent = ({
    getValue, getNestedValue, handleNestedChange, handleChange,
    openHauntRollPopup,
    allAvailableKeys, doomedKeys, doomedKeySources,
    mementos, addMemento, updateMemento, deleteMemento,
}) => {
    return (
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
    );
};
