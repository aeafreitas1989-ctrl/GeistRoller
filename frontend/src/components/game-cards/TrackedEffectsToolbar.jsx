import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { startTimedEffect } from '../../utils/effectDuration';

const DURATION_CHOICES = [
    'Scene', '1 turn', '2 turns', '3 turns', '5 turns',
    '1 minute', '10 minutes', '1 hour', '1 day', '1 week', 'Lasting',
];

/** Compact entry point; the full manual effect form is shown only on request. */
export const TrackedEffectsToolbar = ({ activeCharacter, onUpdateCharacter }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('Scene');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const save = async (event) => {
        event.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName || !onUpdateCharacter || saving) return;
        setSaving(true);
        setError('');
        try {
            const id = 'manual-effect-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
            // Use the latest character snapshot: avoid overwriting an effect
            // added by a different component while this dialog was open.
            const saved = await onUpdateCharacter((latest) => {
                if (!latest) return null;
                const effect = startTimedEffect({
                    id, kind: 'effect', name: trimmedName, duration,
                    description: 'Manually tracked effect',
                }, latest.scene_tracker || activeCharacter?.scene_tracker || {});
                return { active_spells: [...(latest.active_spells || []), effect] };
            });
            if (saved !== true) {
                setError('Could not save the effect. Check the app connection and try again.');
                return;
            }
            setName('');
            setDuration('Scene');
            setOpen(false);
        } catch (_) {
            setError('Could not save the effect. Check the app connection and try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex justify-end" data-testid="manual-effect-entry">
            <Dialog open={open} onOpenChange={(next) => {
                if (saving && !next) return;
                setOpen(next);
                if (next) setError('');
            }}>
                <DialogTrigger asChild>
                    <Button type="button" size="sm" variant="outline"
                        className="h-8 gap-1.5 border-zinc-700 bg-zinc-950/40 text-zinc-200 hover:bg-zinc-800"
                        disabled={!activeCharacter || !onUpdateCharacter}
                        data-testid="manual-effect-open">
                        <Plus className="h-4 w-4" aria-hidden="true" /> Add Effect
                    </Button>
                </DialogTrigger>
                <DialogContent className="border-zinc-700 bg-zinc-950 text-zinc-100 sm:max-w-md" data-testid="manual-effect-dialog">
                    <DialogHeader>
                        <DialogTitle>Add Effect</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Add a manually tracked effect to Active Spells &amp; Effects.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={save} className="space-y-3">
                        <div className="space-y-1.5">
                            <label htmlFor="manual-effect-name-input" className="text-xs text-zinc-300">Effect name</label>
                            <Input id="manual-effect-name-input" value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="h-9 border-zinc-700 bg-zinc-900 text-sm"
                                placeholder="Effect name" data-testid="manual-effect-name" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-zinc-300">Duration</label>
                            <Select value={duration} onValueChange={setDuration} disabled={saving}>
                                <SelectTrigger className="h-9 border-zinc-700 bg-zinc-900 text-sm" data-testid="manual-effect-duration">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-zinc-700 bg-zinc-950">
                                    {DURATION_CHOICES.map((choice) => (
                                        <SelectItem value={choice} key={choice}>{choice}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-zinc-500">
                            Scene and turn timers use End Scene / End Turn. Clock durations use the in-game date and time.
                        </p>
                        {error && <p className="text-xs text-red-300" role="alert">{error}</p>}
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" disabled={saving}
                                onClick={() => setOpen(false)} className="border-zinc-700">Cancel</Button>
                            <Button type="submit" disabled={!name.trim() || saving}
                                data-testid="manual-effect-add">{saving ? 'Saving...' : 'Add Effect'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
