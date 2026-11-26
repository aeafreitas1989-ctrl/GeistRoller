import { ChevronDown, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardTypeColors } from '../../data/cards-data';
import { CEREMONY_DEFINITIONS } from '../../data/character-data';
export const CeremonyCard = ({ceremony, onActivate}) => {
    const [expanded,setExpanded] = useState(false);
    const name = ceremony.name || 'Unnamed Ceremony';
    const rule = CEREMONY_DEFINITIONS[name];
    const definition = {...ceremony,...(rule || {})};
    const dots = Math.max(0,Math.trunc(Number(ceremony.dots ?? definition.dots ?? 1)||0));
    const key = name.toLowerCase().replace(/\s+/g,'-');
    const description = definition.description || definition.success;
    return <div className={'rounded-sm border p-2 '+CardTypeColors.ceremony.bg+' '+CardTypeColors.ceremony.border} data-testid={'ceremony-card-'+key}>
        <button type="button" className="w-full text-left flex items-start justify-between gap-2" aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap"><h4 className={'text-sm font-medium '+CardTypeColors.ceremony.text}>{name}</h4><span className="text-fuchsia-400 text-xs">{'●'.repeat(dots)}</span></div>
                {definition.dicePool && <div className="text-[10px] text-zinc-500 mt-1">{definition.dicePool}</div>}
            </div>
            <ChevronDown className={'w-4 h-4 shrink-0 text-zinc-500 transition-transform '+(expanded?'rotate-180':'')}/>
        </button>
        {expanded && <div className="mt-2 space-y-2 text-xs text-zinc-300">
            {definition.requirements && <p><span className="text-zinc-500">Prerequisites: </span>{definition.requirements}</p>}
            {definition.subject && <p><span className="text-zinc-500">Subject: </span>{definition.subject}</p>}
            {definition.duration && <p><span className="text-zinc-500">Duration: </span>{definition.duration}</p>}
            {description && <p className="leading-relaxed whitespace-pre-wrap">{description}</p>}
            {(definition.source_citation || rule) && <p className="text-[10px] text-zinc-500">Source: {definition.source_citation || 'Geist: The Sin-Eaters 2e (catalogue)'}</p>}
            {!rule && !description && <p className="text-zinc-500">No rule information recorded for this custom Ceremony.</p>}
            <Button type="button" size="sm" className="w-full btn-secondary text-xs h-7" onClick={()=>onActivate?.(name)} disabled={!onActivate} data-testid={'ceremony-roll-'+key}><Sparkles className="w-3 h-3 mr-1"/>Roll Ceremony</Button>
        </div>}
    </div>;
};
