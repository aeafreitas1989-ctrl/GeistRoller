import { Plus, Trash2, Sparkles, Dices, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ARCANA, MAGE_ATTAINMENTS, MAGE_PATHS, PATH_ARCANA, ORDER_ROTE_SKILLS, ARCANA_PRACTICES, SKILL_LIST } from "../../data/character-data";
import { StatDots, formatLabel } from "./StatComponents";

export const MageArcanaContent = ({
    getValue, getNestedValue, handleChange, handleNestedChange,
    openSpellcastingPopup, onTriggerDiceRoll, onActivateMageEffect,
}) => {
        const currentMana = getValue("mana") || 0;
    const currentPath = getValue("path");
    const currentArcana = getValue("arcana") || {};
    const pathRulingArcana = currentPath ? (PATH_ARCANA[currentPath]?.ruling || []) : [];

    const extraMageSightArcana = ARCANA.filter(
        (arcanum) => (currentArcana[arcanum] || 0) >= 1 && !pathRulingArcana.includes(arcanum)
    );

    const getAttainmentLabel = (att) =>
        att.name.split(" / ")[0].replace(` ${att.arcanum}`, "").replace(" Armor", "");

    const getAttainmentDescription = (att) =>
        att.dot === 2 && att.description.includes(";")
            ? att.description.split(";")[0].trim()
            : att.description;

    const TWILIGHT_EFFECTS = {
        Death: {
            attainmentName: "Eyes of the Dead",
            effectName: "Tangible to Ghost Twilight",
            description: "You can perceive and physically interact with ghosts and ghostly ephemera in Twilight.",
        },
        Mind: {
            attainmentName: "Mind's Eye",
            effectName: "Tangible to Goetic Twilight",
            description: "You can perceive and physically interact with Goetia and projecting minds in Twilight.",
        },
        Spirit: {
            attainmentName: "Spirit Eyes",
            effectName: "Tangible to Spirit Twilight",
            description: "You can perceive and physically interact with spirits and spirit ephemera in Twilight.",
        },
    };
    return (
        <>
            {/* Arcana for Mages */}
            <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Arcana
                    {getValue("path") && (
                        <span className="ml-2 text-[9px] font-normal">
                            <span className="text-blue-400">● Ruling</span>
                            <span className="text-red-400 ml-2">● Inferior</span>
                        </span>
                    )}
                </p>
                <div className="space-y-1">
                    {ARCANA.map((arcanum) => {
                        const arcanumRating = getNestedValue("arcana", arcanum) || 0;
                                                const selectedPath = getValue("path");
                        const pathData = selectedPath ? PATH_ARCANA[selectedPath] : null;
                        const isRuling = pathData?.ruling?.includes(arcanum);
                        const isInferior = pathData?.inferior === arcanum;

                        let labelColor = arcanumRating > 0 ? "text-zinc-400" : "text-zinc-600";
                        if (isRuling) labelColor = "text-blue-400 font-medium";
                        if (isInferior) labelColor = "text-red-400";

                        let dotColor = "violet";
                        if (isRuling) dotColor = "blue";
                        if (isInferior) dotColor = "red";

                        const unlockedPractices = [];
                        for (let i = 1; i <= arcanumRating; i++) {
                            if (ARCANA_PRACTICES[i]) {
                                unlockedPractices.push(...ARCANA_PRACTICES[i]);
                            }
                        }

                        return (
                            <div key={arcanum} className="flex items-center justify-between group py-0.5">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <button
                                        onClick={() => arcanumRating > 0 && openSpellcastingPopup(arcanum)}
                                        disabled={arcanumRating === 0}
                                        className={`text-xs shrink-0 ${labelColor} ${arcanumRating > 0 ? 'hover:text-violet-300 cursor-pointer' : 'cursor-default'}`}
                                    >
                                        {arcanum}
                                        {isRuling && <span className="ml-1 text-[9px] text-blue-500">(R)</span>}
                                        {isInferior && <span className="ml-1 text-[9px] text-red-500">(I)</span>}
                                    </button>
                                    {arcanumRating > 0 && (
                                        <div className="flex flex-wrap gap-0.5 overflow-hidden">
                                            {unlockedPractices.map((practice, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => openSpellcastingPopup(arcanum, practice)}
                                                    className="text-[8px] px-1 py-0.5 rounded bg-violet-900/30 text-violet-400 hover:bg-violet-800/50 hover:text-violet-300 transition-colors"
                                                >
                                                    {practice}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <StatDots value={arcanumRating} max={5} onChange={(v) => handleNestedChange("arcana", arcanum, v)} color={dotColor} size="small" testIdPrefix={`arcanum-${arcanum.toLowerCase()}`} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Rotes for Mages */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Rotes</p>
                    <Button 
                        size="sm" 
                        onClick={() => {
                            const rotes = getValue("rotes") || [];
                            handleChange("rotes", [...rotes, { spell: "", arcanum: "Death", dots: 1, skill: "occult" }]);
                        }} 
                        className="h-5 px-2 text-[10px] btn-secondary" 
                        data-testid="add-rote-btn"
                    >
                        <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                </div>
                <div className="space-y-2">
                    {(getValue("rotes") || []).length === 0 ? (
                        <p className="text-[10px] text-zinc-600 italic">No rotes learned</p>
                    ) : (
                        (getValue("rotes") || []).map((rote, index) => {
                            const currentOrder = getValue("order");
                            const roteIsOrderSkill = currentOrder && (ORDER_ROTE_SKILLS[currentOrder] || []).includes(rote.skill);
                            return (
                            <div key={index} className="flex items-center gap-1.5 p-1.5 bg-zinc-900/30 border border-zinc-800 rounded-sm">
                                <Input
                                    value={rote.spell || ""}
                                    onChange={(e) => {
                                        const rotes = [...(getValue("rotes") || [])];
                                        rotes[index] = { ...rotes[index], spell: e.target.value };
                                        handleChange("rotes", rotes);
                                    }}
                                    placeholder="Spell"
                                    className="input-geist h-6 text-xs flex-1 min-w-0"
                                    data-testid={`rote-${index}-spell`}
                                />
                                <Select value={rote.arcanum || "Death"} onValueChange={(v) => {
                                    const rotes = [...(getValue("rotes") || [])];
                                    rotes[index] = { ...rotes[index], arcanum: v };
                                    handleChange("rotes", rotes);
                                }}>
                                    <SelectTrigger className="h-6 w-[80px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0" data-testid={`rote-${index}-arcanum`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {ARCANA.map(a => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <StatDots value={rote.dots || 1} max={5} onChange={(v) => { const rotes = [...(getValue("rotes") || [])]; rotes[index] = { ...rotes[index], dots: v }; handleChange("rotes", rotes); }} color="violet" size="small" testIdPrefix={`rote-${index}-dots`} />
                                <Select value={rote.skill || "occult"} onValueChange={(v) => {
                                    const rotes = [...(getValue("rotes") || [])];
                                    rotes[index] = { ...rotes[index], skill: v };
                                    handleChange("rotes", rotes);
                                }}>
                                    <SelectTrigger className={`h-6 w-[90px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0 ${roteIsOrderSkill ? "text-amber-400" : ""}`} data-testid={`rote-${index}-skill`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[200px]">
                                        {SKILL_LIST.map(s => {
                                            const sIsOrder = currentOrder && (ORDER_ROTE_SKILLS[currentOrder] || []).includes(s);
                                            return <SelectItem key={s} value={s} className={`text-xs capitalize ${sIsOrder ? "text-amber-400" : ""}`}>{formatLabel(s)}</SelectItem>;
                                        })}
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="sm" onClick={() => openSpellcastingPopup(rote.arcanum, null, "rote", rote.skill)} className="h-6 px-1.5 text-[10px] text-violet-400 hover:text-violet-300 shrink-0" data-testid={`rote-${index}-cast`}>
                                    <Sparkles className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { const rotes = (getValue("rotes") || []).filter((_, i) => i !== index); handleChange("rotes", rotes); }} className="h-6 w-6 text-zinc-400 hover:text-red-400 shrink-0" data-testid={`rote-${index}-delete`}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Praxes for Mages */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Praxes</p>
                    <Button 
                        size="sm" 
                        onClick={() => {
                            const praxes = getValue("praxes") || [];
                            handleChange("praxes", [...praxes, { spell: "", arcanum: "Death", dots: 1 }]);
                        }} 
                        className="h-5 px-2 text-[10px] btn-secondary" 
                        data-testid="add-praxis-btn"
                    >
                        <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                </div>
                <div className="space-y-2">
                    {(getValue("praxes") || []).length === 0 ? (
                        <p className="text-[10px] text-zinc-600 italic">No praxes learned</p>
                    ) : (
                        (getValue("praxes") || []).map((praxis, index) => (
                            <div key={index} className="flex items-center gap-1.5 p-1.5 bg-zinc-900/30 border border-zinc-800 rounded-sm">
                                <Input
                                    value={praxis.spell || ""}
                                    onChange={(e) => {
                                        const praxes = [...(getValue("praxes") || [])];
                                        praxes[index] = { ...praxes[index], spell: e.target.value };
                                        handleChange("praxes", praxes);
                                    }}
                                    placeholder="Spell"
                                    className="input-geist h-6 text-xs flex-1 min-w-0"
                                    data-testid={`praxis-${index}-spell`}
                                />
                                <Select value={praxis.arcanum || "Death"} onValueChange={(v) => {
                                    const praxes = [...(getValue("praxes") || [])];
                                    praxes[index] = { ...praxes[index], arcanum: v };
                                    handleChange("praxes", praxes);
                                }}>
                                    <SelectTrigger className="h-6 w-[80px] bg-zinc-900/50 border-zinc-800 text-[10px] shrink-0" data-testid={`praxis-${index}-arcanum`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {ARCANA.map(a => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <StatDots value={praxis.dots || 1} max={5} onChange={(v) => { const praxes = [...(getValue("praxes") || [])]; praxes[index] = { ...praxes[index], dots: v }; handleChange("praxes", praxes); }} color="violet" size="small" testIdPrefix={`praxis-${index}-dots`} />
                                <Button variant="ghost" size="sm" onClick={() => openSpellcastingPopup(praxis.arcanum, null, "praxis")} className="h-6 px-1.5 text-[10px] text-teal-400 hover:text-teal-300 shrink-0" data-testid={`praxis-${index}-cast`}>
                                    <Sparkles className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { const praxes = (getValue("praxes") || []).filter((_, i) => i !== index); handleChange("praxes", praxes); }} className="h-6 w-6 text-zinc-400 hover:text-red-400 shrink-0" data-testid={`praxis-${index}-delete`}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Attainments */}
            <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Attainments</p>
                {(() => {
                    const arcanaValues = getValue("arcana") || {};
                    const arcanaWithDots = ARCANA.filter(a => (arcanaValues[a] || 0) >= 1);
                    const arcanaWith3 = ARCANA.filter(a => (arcanaValues[a] || 0) >= 3);
                    const namedAttainments = [];

                    ARCANA.forEach(arcanum => {
                        const rating = arcanaValues[arcanum] || 0;
                        for (let dot = 2; dot <= rating; dot++) {
                            const att = MAGE_ATTAINMENTS[arcanum]?.[dot];
                            if (att && !att.name.includes("Counterspell") && !att.name.includes("Targeted Summoning") && !att.name.includes("Create Rote")) {
                                namedAttainments.push({ arcanum, dot, ...att });
                            }
                        }
                    });

                    if (arcanaWithDots.length === 0) {
                        return <p className="text-[10px] text-zinc-600 italic">Gain Arcana dots to unlock attainments</p>;
                    }

                    return (
                        <div className="flex gap-4">
                            <div className="space-y-1.5 shrink-0">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => {
                                                    const bestArcanum = arcanaWithDots.reduce((best, a) => (arcanaValues[a] || 0) > (arcanaValues[best] || 0) ? a : best, arcanaWithDots[0]);
                                                    if (onTriggerDiceRoll) onTriggerDiceRoll({ pool: (getValue("gnosis") || 1) + (arcanaValues[bestArcanum] || 0), label: `Counterspell (${arcanaWithDots.join(", ")})` });
                                                }}
                                                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border bg-violet-900/30 border-violet-500/40 text-violet-300 hover:bg-violet-800/40 transition-colors"
                                                data-testid="counterspell-btn"
                                            >
                                                <Dices className="w-3 h-3" />
                                                Counterspell
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-zinc-900 border-zinc-700 max-w-xs">
                                            <p className="text-xs text-zinc-300">Counter spells of: {arcanaWithDots.join(", ")}. Roll Gnosis + Arcanum in a Clash of Wills.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {currentPath && pathRulingArcana.length > 0 && (
                                    <div className="space-y-1">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        type="button"
                                                        onClick={() => onActivateMageEffect?.({ type: "mageSight", path: currentPath })}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border bg-blue-900/30 border-blue-500/40 text-blue-300 hover:bg-blue-800/40 transition-colors"
                                                        data-testid="path-mage-sight-btn"
                                                    >
                                                        <Sparkles className="w-3 h-3" />
                                                        {currentPath} Mage Sight
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-zinc-900 border-zinc-700 max-w-xs">
                                                    <p className="text-xs text-zinc-300">
                                                        Activate Mage Sight with {pathRulingArcana.join(" + ")} at no Mana cost.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {extraMageSightArcana.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {extraMageSightArcana.map((arcanum) => (
                                                    <TooltipProvider key={arcanum}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => onActivateMageEffect?.({ type: "mageSight", path: currentPath, extraArcanum: arcanum })}
                                                                    disabled={currentMana < 1}
                                                                    className="px-2 py-1 text-[10px] rounded border bg-zinc-800/60 border-zinc-700 text-zinc-300 hover:border-blue-500/50 hover:text-blue-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                                    data-testid={`mage-sight-extra-${arcanum.toLowerCase()}`}
                                                                >
                                                                    + {arcanum}
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-zinc-900 border-zinc-700 max-w-xs">
                                                                <p className="text-xs text-zinc-300">Spend 1 Mana to add {arcanum} to Mage Sight.</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {arcanaWith3.length > 0 && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border bg-teal-900/30 border-teal-500/40 text-teal-300 hover:bg-teal-800/40 transition-colors"
                                                    data-testid="targeted-summoning-btn"
                                                >
                                                    <Zap className="w-3 h-3" />
                                                    Targeted Summoning
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-900 border-zinc-700 max-w-xs">
                                                <p className="text-xs text-zinc-300">Summon Supernal beings with: {arcanaWith3.join(", ")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>

                            {namedAttainments.length > 0 && (
                                <div className="flex flex-wrap gap-1 flex-1 content-start">
                                    {namedAttainments.map((att, i) => {
                                        const twilightEffect = att.dot === 2 ? TWILIGHT_EFFECTS[att.arcanum] : null;
                                        const isClickableTwilight = !!twilightEffect;
                                        const label = getAttainmentLabel(att);

                                        return (
                                            <TooltipProvider key={i}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        {isClickableTwilight ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => onActivateMageEffect?.({
                                                                    type: "twilight",
                                                                    arcanum: att.arcanum,
                                                                    attainmentName: twilightEffect.attainmentName,
                                                                    effectName: twilightEffect.effectName,
                                                                    description: twilightEffect.description,
                                                                })}
                                                                disabled={currentMana < 1}
                                                                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] rounded bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:border-teal-500/50 hover:text-teal-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                                data-testid={`attainment-${att.arcanum.toLowerCase()}-btn`}
                                                            >
                                                                <span className="text-violet-400 font-mono">{"●".repeat(att.dot)}</span>
                                                                {label}
                                                            </button>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] rounded bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 cursor-help">
                                                                <span className="text-violet-400 font-mono">{"●".repeat(att.dot)}</span>
                                                                {label}
                                                            </span>
                                                        )}
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-zinc-900 border-zinc-700 max-w-xs">
                                                        <p className="text-xs font-medium text-violet-300">{att.arcanum} ({att.dot})</p>
                                                        <p className="text-xs text-zinc-300">{getAttainmentDescription(att)}</p>
                                                        {isClickableTwilight && (
                                                            <p className="text-[11px] text-teal-400 mt-1">
                                                                Spend 1 Mana: add “{twilightEffect.effectName}” to Active Spells & Effects.
                                                            </p>
                                                        )}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>
        </>
    );
};
