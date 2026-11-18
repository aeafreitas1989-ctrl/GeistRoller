import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { startTimedEffect } from '../../utils/effectDuration';

export const TrackedEffectsToolbar = ({ activeCharacter, onUpdateCharacter }) => {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('Scene');
    const [saving, setSaving] = useState(false);
    const save = async () => {
        if (!name.trim() || !onUpdateCharacter || saving) return;
        setSaving(true);
        try {
            const effect = startTimedEffect({
                id: 'manual-effect-' + Date.now(), kind: 'effect',
                name: name.trim(), duration, description: 'Manually tracked effect',
            }, activeCharacter?.scene_tracker || {});
            await onUpdateCharacter({
                active_spells: [...(activeCharacter?.active_spells || []), effect],
            });
            setName('');
        } finally { setSaving(false); }
    };
    return (
        <div className="rounded-sm border border-zinc-800 bg-zinc-950/40 p-2 space-y-2" data-testid="manual-effect-entry">
            <p className="text-[10px] uppercase tracking-wider text-zinc-400">Track effect</p>
            <Input value={name} onChange={(event) => setName(event.target.value)}
                className="h-8 bg-zinc-900 text-xs" placeholder="Effect name" data-testid="manual-effect-name" />
            <div className="flex gap-2">
                <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="h-8 flex-1 bg-zinc-900 text-xs" data-testid="manual-effect-duration"><SelectValue /></SelectTrigger>
                    <SelectContent className="border-zinc-700 bg-zinc-950">
                        {['Scene', '1 turn', '2 turns', '3 turns', '5 turns', '1 minute', '10 minutes', '1 hour', '1 day', '1 week', 'Lasting'].map((choice) => (
                            <SelectItem value={choice} key={choice}>{choice}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button size="sm" type="button" className="h-8" disabled={!name.trim() || saving}
                    onClick={save} data-testid="manual-effect-add">Add</Button>
            </div>
            <p className="text-[10px] text-zinc-500">Scene and turn timers use End Scene / End Turn. Clock durations use the in-game date and time.</p>
        </div>
    );
};
