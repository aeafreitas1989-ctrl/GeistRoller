import { Minus, Plus, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export const CharacterGoalsContent = ({
    isMage,
    getValue,
    handleChange,
    fulfillAspiration,
    getObsessions,
    addObsession,
    updateObsession,
    removeObsession,
    fulfillObsession,
    removeBeat,
    awardBeat,
    removeArcaneBeat,
    awardArcaneBeat,
}) => {
    const obsessions = isMage ? getObsessions() : [];

    return (
        <>
            <div className="mb-4">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">
                    Aspirations
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 mt-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                            onClick={() => fulfillAspiration("aspiration_short_1")}
                            data-testid="aspiration-short-1-fulfilled"
                        >
                            SHORT-TERM
                        </Button>
                        <Input
                            value={getValue("aspiration_short_1") || ""}
                            onChange={(event) =>
                                handleChange("aspiration_short_1", event.target.value)
                            }
                            className="h-7 input-geist text-xs flex-1"
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                            onClick={() => fulfillAspiration("aspiration_short_2")}
                            data-testid="aspiration-short-2-fulfilled"
                        >
                            SHORT-TERM
                        </Button>
                        <Input
                            value={getValue("aspiration_short_2") || ""}
                            onChange={(event) =>
                                handleChange("aspiration_short_2", event.target.value)
                            }
                            className="h-7 input-geist text-xs flex-1"
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                            onClick={() => fulfillAspiration("aspiration_long")}
                            data-testid="aspiration-long-progressed"
                        >
                            LONG-TERM
                        </Button>
                        <Input
                            value={getValue("aspiration_long") || ""}
                            onChange={(event) =>
                                handleChange("aspiration_long", event.target.value)
                            }
                            className="h-7 input-geist text-xs flex-1"
                        />
                    </div>

                    {isMage ? (
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-violet-400 uppercase tracking-wider">
                                    Obsessions
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[10px] text-violet-400 hover:text-violet-300"
                                    onClick={addObsession}
                                    data-testid="add-obsession-btn"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add
                                </Button>
                            </div>

                            {obsessions.map((obsession, index) => (
                                <div key={index} className="flex items-center gap-2 mt-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-[10px] text-zinc-400 hover:text-violet-300"
                                        onClick={() => fulfillObsession(index)}
                                        data-testid={`obsession-${index}-progressed`}
                                    >
                                        OBSESSION {index + 1}
                                    </Button>
                                    <Input
                                        value={obsession || ""}
                                        onChange={(event) =>
                                            updateObsession(index, event.target.value)
                                        }
                                        className="h-7 input-geist text-xs flex-1"
                                        placeholder="Mage Obsession"
                                        data-testid={`obsession-${index}-input`}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-zinc-500 hover:text-red-400"
                                        onClick={() => removeObsession(index)}
                                        disabled={obsessions.length <= 1}
                                        data-testid={`obsession-${index}-remove`}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mt-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                                onClick={() => fulfillAspiration("aspiration_burden")}
                                data-testid="aspiration-burden-progressed"
                            >
                                BURDEN
                            </Button>
                            <Input
                                value={getValue("aspiration_burden") || ""}
                                onChange={(event) =>
                                    handleChange("aspiration_burden", event.target.value)
                                }
                                className="h-7 input-geist text-xs flex-1"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-sm">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Beats & Experience
                    </label>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-zinc-400">Beats</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                    onClick={removeBeat}
                                    disabled={(getValue("beats") || 0) <= 0}
                                    data-testid="beats-minus"
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>

                                <span className="font-mono text-amber-300">
                                    {getValue("beats") || 0}/5
                                </span>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                    onClick={awardBeat}
                                    data-testid="beats-plus"
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-0.5">
                            {[0, 1, 2, 3, 4].map((index) => (
                                <div
                                    key={index}
                                    className={`w-4 h-4 rounded-full border transition-all ${
                                        index < (getValue("beats") || 0)
                                            ? "bg-amber-500/50 border-amber-500"
                                            : "bg-zinc-900 border-zinc-700"
                                    }`}
                                    data-testid={`beat-${index}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-zinc-400">Experience</span>
                            <span className="font-mono text-teal-300">
                                {getValue("experience") || 0}
                            </span>
                        </div>
                        <Input
                            type="number"
                            min={0}
                            value={getValue("experience") || 0}
                            onChange={(event) =>
                                handleChange(
                                    "experience",
                                    Math.max(0, parseInt(event.target.value, 10) || 0)
                                )
                            }
                            className="h-6 w-16 text-center input-geist text-xs"
                            data-testid="experience-input-header"
                        />
                    </div>
                </div>

                {isMage && (
                    <div className="mt-3 pt-3 border-t border-amber-900/40 flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-zinc-400">Arcane Beats</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                        onClick={removeArcaneBeat}
                                        disabled={(getValue("arcane_beats") || 0) <= 0}
                                        data-testid="arcane-beats-minus"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="font-mono text-violet-300">
                                        {getValue("arcane_beats") || 0}/5
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                        onClick={awardArcaneBeat}
                                        data-testid="arcane-beats-plus"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-0.5">
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <div
                                        key={index}
                                        className={`w-4 h-4 rounded-full border transition-all ${
                                            index < (getValue("arcane_beats") || 0)
                                                ? "bg-violet-500/50 border-violet-500"
                                                : "bg-zinc-900 border-zinc-700"
                                        }`}
                                        data-testid={`arcane-beat-${index}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-zinc-400">Arcane XP</span>
                                <span className="font-mono text-violet-300">
                                    {getValue("arcane_experience") || 0}
                                </span>
                            </div>
                            <Input
                                type="number"
                                min={0}
                                value={getValue("arcane_experience") || 0}
                                onChange={(event) =>
                                    handleChange(
                                        "arcane_experience",
                                        Math.max(0, parseInt(event.target.value, 10) || 0)
                                    )
                                }
                                className="h-6 w-16 text-center input-geist text-xs"
                                data-testid="arcane-experience-input-header"
                            />
                        </div>
                    </div>
                )}

                <p className="text-[10px] text-zinc-600 mt-2 italic">
                    5 Beats = 1 Experience. 5 Arcane Beats = 1 Arcane Experience.
                </p>
            </div>
        </>
    );
};
