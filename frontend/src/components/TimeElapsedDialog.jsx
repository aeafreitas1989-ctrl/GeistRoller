import { Sparkles, CircleAlert, Heart, HeartCrack, Clock3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const EffectIcon = ({ type }) => {
    const Icon = type === 'Spell' ? Sparkles : type === 'Condition' || type === 'Tilt' ? CircleAlert : Clock3;
    const color = type === 'Spell' ? 'text-violet-300' : type === 'Condition' || type === 'Tilt' ? 'text-amber-300' : 'text-zinc-400';
    return <Icon aria-label={type || 'Effect'} className={'h-3.5 w-3.5 shrink-0 '+color} />;
};
const Section = ({ title, entries, active = false, effects = false }) => (
    <section className="border-t border-zinc-800 pt-2" aria-label={title}>
        <h3 className={'text-[10px] font-semibold tracking-wider uppercase mb-1 '+(active ? 'text-teal-300' : title === 'Expired' ? 'text-rose-300' : 'text-zinc-400')}>{title}</h3>
        {entries.length === 0 ? <p className="text-xs text-zinc-500">None</p> :
            <ul className="space-y-1.5">{entries.map((entry,index)=>(
                <li key={index} className="flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-1.5 min-w-0 break-words text-zinc-100">
                        {effects && <EffectIcon type={entry.type}/>}
                        <span className="min-w-0 break-words">{entry.name}</span>
                    </div>
                    {active && <span className="text-right font-mono text-teal-300 shrink-0 max-w-[55%]">{entry.remaining}</span>}
                </li>
            ))}</ul>}
    </section>
);
const HealthColumn = ({ title, entries, remaining = false }) => {
    const Icon = remaining ? HeartCrack : Heart;
    return <section className="min-w-0 space-y-1" aria-label={title}>
        <h3 className={'flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase '+(remaining ? 'text-rose-300' : 'text-emerald-300')}>
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0"/>{title}
        </h3>
        {entries.length === 0 ? <p className="text-xs text-zinc-500">None</p> : <ul className="space-y-1">
            {entries.map((entry,index)=><li key={index} className="text-xs text-zinc-100 break-words">
                {remaining ? entry.name : entry.name.replace(/ damage$/, '')}
                {remaining && entry.remaining && <span className="text-zinc-400 font-mono"> ({entry.remaining})</span>}
            </li>)}
        </ul>}
    </section>;
};
export const TimeElapsedDialog = ({summary,onClose}) => (
    <Dialog open={!!summary} onOpenChange={open=>{if(!open)onClose();}}>
        {summary && <DialogContent className="bg-zinc-950 border-zinc-700 text-zinc-100 max-w-lg max-h-[85vh] overflow-y-auto" data-testid="time-elapsed-dialog">
            <DialogHeader>
                <DialogTitle>Time Elapsed</DialogTitle>
                <DialogDescription className="sr-only">{summary.characterName || 'Character'} — in-game time and effects</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm" data-testid="elapsed-clock"><span>{summary.from}</span><span aria-hidden="true">→</span><span>{summary.to}</span></div>
                <div className="flex justify-between text-xs"><strong>Elapsed:</strong><span className="font-mono">{summary.elapsed}</span></div>
                <Section title="Active" entries={summary.active} active effects/>
                <Section title="Expired" entries={summary.expired} effects/>
                <div className="grid grid-cols-2 divide-x divide-zinc-800 border-t border-zinc-800 pt-2" data-testid="time-elapsed-health">
                    <div className="pr-3"><HealthColumn title="Healed" entries={summary.healed}/></div>
                    <div className="pl-3"><HealthColumn title="Remaining" entries={summary.remaining || []} remaining/></div>
                </div>
                {summary.damage.length > 0 && <Section title="Damage Taken" entries={summary.damage}/>}
                {summary.willpower > 0 && <Section title="Recovered" entries={[{name:'+'+summary.willpower+' Willpower'}]}/>}
                <Button type="button" className="w-full" onClick={onClose} data-testid="time-elapsed-ok">OK</Button>
            </div>
        </DialogContent>}
    </Dialog>
);
