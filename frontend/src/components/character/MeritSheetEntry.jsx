import { X, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SKILL_LIST } from '../../data/character-data';
import { StatDots, formatLabel } from './StatComponents';
import { getMeritCardRules } from '../../utils/meritCardRules';

export const MeritSheetEntry = ({ merit, index, onDelete, onUpdate, onRollPerception }) => {
    const {definition: meritDef, category: meritCategory, minDots, maxDots, locked: isLockedMerit, invalidStoredRating, canEditDots} = getMeritCardRules(merit);

    const handleDotChange = (nextValue) => {
        if (!canEditDots) return;

        const bounded = Math.max(minDots, Math.min(maxDots, Number(nextValue) || minDots));
        const safeNextValue = meritDef?.allowedDots?.length
            ? meritDef.allowedDots.reduce((best, dot) => Math.abs(dot - bounded) < Math.abs(best - bounded) ? dot : best)
            : bounded;

        if (safeNextValue === (Number(merit.dots) || 0)) return;

        onUpdate({ dots: safeNextValue });
    };

    return (
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-sm p-2 relative group space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs text-zinc-300 truncate">
                            {merit.specialty
                                ? `${merit.name}: ${merit.specialty}`
                                : merit.name}
                        </span>

                        <span className="shrink-0 px-1 py-0.5 rounded bg-zinc-900/70 border border-zinc-700 text-[8px] uppercase tracking-wider text-zinc-500">
                            {meritCategory}
                        </span>
                    </div>

                    <StatDots
                        value={merit.dots || 0}
                        max={maxDots}
                        onChange={handleDotChange}
                        color="amber"
                        size="small"
                        clickable={canEditDots}
                        testIdPrefix={`merit-${(merit.name || "merit").toLowerCase().replace(/\s+/g, '-')}`}
                    />

                    {invalidStoredRating && (
                        <span className="text-[10px] text-amber-300" title="Previously saved Merit rating is not legal under these rules">
                            Invalid rating: {meritDef.allowedDots.join(' or ')}
                        </span>
                    )}

                    {isLockedMerit && (
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                            locked
                        </span>
                    )}
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
                        Select 3 Asset Skills. 9-again applies on rolls using Asset Skills when Professional Training is 2+ dots.
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
