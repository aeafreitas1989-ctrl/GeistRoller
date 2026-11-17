import { ChevronDown, ChevronRight } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ActiveSpellCard } from "../cards/CardComponents";
import { MageSightCard } from "../cards/MageSightCard";
import { expireTimedEffects, isEffectExpired, startTimedEffect } from "../../utils/effectDuration";

/**
 * Active Spells & Effects section of the Game Cards panel.
 * Shown only for mage characters. Renders the dedicated Mage Sight card and
 * any other active spells in alphabetical order.
 */
export const ActiveSpellsSection = ({
    open,
    onToggle,
    navMode = false,
    activeCharacter,
    activeSpells,
    activeMageSight,
    onUpdateCharacter,
    onTriggerDiceRoll,
    onDispelActiveSpell,
    onRelinquishActiveSpell,
    onRelinquishActiveSpellSafely,
}) => {
    const gameClock = activeCharacter?.scene_tracker || {};
    const activeCount = activeSpells.filter((spell) => !isEffectExpired(spell, gameClock)).length;
    const nonSightSpells = activeSpells
        .filter((spell) => spell.effect_key !== "mage-sight")
        .sort((a, b) =>
            Number(isEffectExpired(a, gameClock)) - Number(isEffectExpired(b, gameClock)) ||
            (a.name || "").localeCompare(b.name || "")
        );

    const startExistingTimer = async (spellId) => {
        if (!onUpdateCharacter) return;
        const existing = activeCharacter?.active_spells || [];
        const updated = existing.map((spell) =>
            spell.id === spellId ? startTimedEffect(spell, gameClock) : spell
        );
        if (updated.every((spell, index) => spell === existing[index])) return;
        await onUpdateCharacter({ active_spells: expireTimedEffects(updated, gameClock) });
    };

    return (
        <Collapsible
            open={open}
            onOpenChange={onToggle}
            className={navMode && !open ? "hidden" : "bg-zinc-900/40 border border-zinc-800 rounded-sm"}
            data-testid="cards-section-active-spells"
        >
            <CollapsibleTrigger className={`${navMode ? "!hidden " : ""}w-full flex items-center justify-between p-3`} data-testid="cards-section-active-spells-toggle">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Active Spells & Effects</span>
                    <span className="text-[10px] text-zinc-500">{activeCount}</span>
                </div>
                {open ? (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                )}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pt-3 pb-3">
                <div className="space-y-2" data-testid="active-spells-list">
                    <MageSightCard
                        activeCharacter={activeCharacter}
                        activeMageSight={activeMageSight}
                        onUpdateCharacter={onUpdateCharacter}
                        onTriggerDiceRoll={onTriggerDiceRoll}
                    />

                    {nonSightSpells.map((spell) => (
                        <ActiveSpellCard
                            key={spell.id || `${spell.name}-${spell.arcanum}-${spell.practice}`}
                            spell={spell}
                            sceneTracker={gameClock}
                            onStartTimer={() => startExistingTimer(spell.id)}
                            onDispel={onDispelActiveSpell}
                            onRelinquish={onRelinquishActiveSpell}
                            onRelinquishSafely={onRelinquishActiveSpellSafely}
                        />
                    ))}

                    {nonSightSpells.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-zinc-500 text-sm">No active spells or effects</p>
                            <p className="text-zinc-600 text-xs mt-1">Advanced Duration spells, plus Standard Duration spells cast during Combat, appear here</p>
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
