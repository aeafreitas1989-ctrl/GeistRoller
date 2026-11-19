import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Dices, Minus, Plus, X } from 'lucide-react';
import { makeQuickDiceRequest, normalizeQuickDicePool, makeQuickDiceHistoryEntry } from '../utils/quickDicePool';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/** A standalone, manually configured CofD roll. It never changes character state. */
export const QuickDiceRoller = ({ onRollRecorded }) => {
    const [open, setOpen] = useState(false);
    const [pool, setPool] = useState(1);
    const [again, setAgain] = useState(10);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const rootRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const dismissOutside = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
        };
        const dismissEscape = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', dismissOutside);
        document.addEventListener('keydown', dismissEscape);
        return () => {
            document.removeEventListener('pointerdown', dismissOutside);
            document.removeEventListener('keydown', dismissEscape);
        };
    }, [open]);

    const changePool = (value) => {
        setPool(normalizeQuickDicePool(value));
        setError('');
    };

    const changeAgain = (value) => {
        setAgain(Number(value));
        setError('');
    };

    const roll = async (event) => {
        event.preventDefault();
        if (busy) return;
        setBusy(true);
        setError('');
        try {
            const response = await axios.post(`${API}/dice/roll`, makeQuickDiceRequest(pool, again));
            if (!response.data || !Array.isArray(response.data.dice)) {
                throw new Error('Unexpected dice roll response');
            }
            if (typeof onRollRecorded !== 'function') {
                throw new Error('Last Rolls is not available');
            }
            onRollRecorded(makeQuickDiceHistoryEntry(response.data, pool, again));
            setOpen(false);
        } catch (_) {
            setError('Could not roll dice. Check the app connection.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div ref={rootRef} className="fixed bottom-4 right-4 z-[65] flex flex-col items-end gap-2" data-testid="quick-dice-roller">
            {open && (
                <section
                    id="quick-dice-popup"
                    role="dialog"
                    aria-label="Quick dice roll"
                    className="w-[min(19rem,calc(100vw-2rem))] rounded-lg border border-zinc-700 bg-zinc-950/95 p-3 text-zinc-100 shadow-2xl backdrop-blur-sm"
                    data-testid="quick-dice-popup"
                >
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold tracking-wide">Quick dice roll</span>
                        <button type="button" className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Close quick dice roll" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
                    </div>
                    <form onSubmit={roll}>
                        <div className="flex items-center justify-center gap-2" aria-label="Dice pool">
                            <button type="button" disabled={pool === 0 || busy} onClick={() => changePool(pool - 1)} className="flex h-9 w-9 items-center justify-center rounded border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40" aria-label="Remove one die"><Minus className="h-4 w-4" /></button>
                            <div className="flex h-9 min-w-0 items-center justify-center rounded border border-zinc-700 bg-zinc-900 px-2">
                                <input id="quick-dice-count" type="number" inputMode="numeric" min="0" max="100" step="1" value={pool} disabled={busy} onChange={event => changePool(event.target.value)} className="w-11 bg-transparent text-right text-sm font-semibold text-zinc-100 outline-none" aria-label="Number of d10 dice" data-testid="quick-dice-count" />
                                <label htmlFor="quick-dice-count" className="ml-1 text-sm text-zinc-300">d10</label>
                            </div>
                            <button type="button" disabled={pool === 100 || busy} onClick={() => changePool(pool + 1)} className="flex h-9 w-9 items-center justify-center rounded border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40" aria-label="Add one die"><Plus className="h-4 w-4" /></button>
                        </div>
                        <fieldset className="mt-3 flex items-center justify-center gap-4" aria-label="Again rule">
                            {[8, 9, 10].map(value => (
                                <label key={value} className="flex cursor-pointer items-center gap-1.5 text-sm text-zinc-200">
                                    <input type="radio" name="quick-dice-again" value={value} checked={again === value} onChange={() => changeAgain(value)} disabled={busy} className="accent-teal-400" />
                                    <span>{value}!</span>
                                </label>
                            ))}
                        </fieldset>
                        <button type="submit" disabled={busy} className="mt-3 h-9 w-full rounded bg-teal-800 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50" data-testid="quick-dice-roll-button">{busy ? 'Rolling…' : 'Roll'}</button>
                    </form>
                    {error && <p className="mt-2 text-xs text-red-300" role="alert">{error}</p>}
                </section>
            )}
            <button
                type="button"
                aria-label="Quick dice roller"
                title="Quick dice roller"
                aria-haspopup="dialog"
                aria-controls="quick-dice-popup"
                aria-expanded={open}
                onClick={() => setOpen(value => !value)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-teal-500/60 bg-zinc-950 text-teal-200 shadow-2xl hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300"
                data-testid="quick-dice-toggle"
            >
                <Dices className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>
    );
};
