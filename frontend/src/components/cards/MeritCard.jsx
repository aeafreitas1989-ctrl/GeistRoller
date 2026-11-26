import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { CardTypeColors, MERIT_CATEGORY_COLORS } from '../../data/cards-data';
import { getMeritCardRules } from '../../utils/meritCardRules';

export const MeritCard = ({merit}) => {
    const [expanded, setExpanded] = useState(false);
    const {definition, category, maxDots, locked} = getMeritCardRules(merit);
    const dots = Math.max(0, Math.trunc(Number(merit.dots) || 0));
    const categoryColor = MERIT_CATEGORY_COLORS[category] || MERIT_CATEGORY_COLORS.Other;
    const description = definition?.description || merit.description;
    const requirements = definition?.requirements || merit.requirements;
    const source = definition?.source_citation || merit.source_citation;
    return <div className={'rounded-sm border p-2 '+CardTypeColors.merit.bg+' '+CardTypeColors.merit.border} data-testid={'merit-card-'+(merit.name || '').toLowerCase().replace(/\s+/g,'-')}>
        <button type="button" className="w-full text-left flex items-start justify-between gap-2" aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={'text-sm font-medium '+CardTypeColors.merit.text}>{merit.name}{merit.specialty ? ': '+merit.specialty : ''}</h4>
                    <span className="text-amber-400 text-xs tracking-tight">{'●'.repeat(dots)}{'○'.repeat(Math.max(0,maxDots-dots))}</span>
                    {locked && <span className="text-[9px] uppercase tracking-wider text-zinc-500">Locked</span>}
                </div>
                <span className={'inline-block mt-1 px-1.5 py-0.5 text-[9px] uppercase tracking-wider rounded border '+categoryColor}>{category}</span>
            </div>
            <ChevronDown className={'w-4 h-4 text-zinc-500 shrink-0 transition-transform '+(expanded?'rotate-180':'')}/>
        </button>
        {expanded && <div className="mt-2 space-y-2 text-xs text-zinc-300 leading-relaxed">
            {requirements && <div><span className="text-amber-200/80 font-medium">Prerequisites: </span>{requirements}</div>}
            {description && <p className="whitespace-pre-wrap">{description}</p>}
            {source && <p className="text-[10px] text-zinc-500">Source: {source}</p>}
            {!description && !requirements && !source && <p className="text-zinc-500">No rule information recorded.</p>}
        </div>}
    </div>;
};
