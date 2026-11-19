import { useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Dices, Minus, Plus } from 'lucide-react';
import { makeQuickDiceRequest, normalizeQuickDicePool } from '../utils/quickDicePool';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/** Standalone CofD dice pool. No character statistics or Conditions are modified. */
export const QuickDiceRoller = () => {
    const [expanded, setExpanded] = useState(true);
    const [pool, setPool] = useState(3);
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const changePool = (next) => {
        setPool(normalizeQuickDicePool(next));
    };

    const roll = async (event) => {
        event.preventDefault();
        if (busy) return;
        setBusy(true);
        setError('');
        setResult(null);
        try {
            const response = await axios.post(`${API}/dice/roll`, makeQuickDiceRequest(pool));
            if (!response.data || !Array.isArray(response.data.dice)) {
                throw new Error('Unexpected dice roll response');
            }
            setResult({ ...response.data, rolledPool: pool });
        } catch (_) {
            setError('Could not roll dice. Check the app connection.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[65]" data-testid="quick-dice-roller">
            <section className={`${expanded ? 'w-[min(19rem,calc(100vw-2rem))]' : 'w-auto'} rounded-lg border border-zinc-700 bg-zinc-950/95 text-zinc-100 shadow-2xl backdrop-blur-sm`}>
                <div className="flex items-center gap-2 px-3 py-2">
                    <Dices className="h-4 w-4 text-teal-300" aria-hidden="true" />
                    <span className="text-xs font-semibold tracking-wide">Quick dice roll</span>
                    <button type="button" className="ml-auto rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300" aria-label={expanded ? 'Collapse quick dice roller' : 'Expand quick dice roller'} aria-expanded={expanded} aria-controls="quick-dice-content" onClick={() => setExpanded(value => !value)} data-testid="quick-dice-toggle">
                        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </button>
                </div>
                {expanded && (
                    <div id="quick-dice-content" className="border-t border-zinc-800 px-3 pb-3 pt-2">
                        <form onSubmit={roll} className="flex items-end gap-2">
                            <div className="min-w-0 flex-1">
                                <label htmlFor="quick-dice-count" className="mb-1 block text-[11px] text-zinc-400">Number of dice</label>
                                <div className="flex h-9 items-center overflow-hidden rounded border border-zinc-700 bg-zinc-900">
                                    <button type="button" className="flex h-full w-9 items-center justify-center hover:bg-zinc-800 disabled:opacity-40" disabled={pool === 0 || busy} aria-label="Remove one die" onClick={() => changePool(pool - 1)}><Minus className="h-4 w-4" /></button>
                                    <input id="quick-dice-count" type="number" inputMode="numeric" min="0" max="100" step="1" value={pool} disabled={busy} onChange={event => changePool(event.target.value)} className="h-full w-full min-w-0 bg-transparent text-center text-sm text-zinc-100 outline-none" data-testid="quick-dice-count" />
                                    <button type="button" className="flex h-full w-9 items-center justify-center hover:bg-zinc-800 disabled:opacity-40" disabled={pool === 100 || busy} aria-label="Add one die" onClick={() => changePool(pool + 1)}><Plus className="h-4 w-4" /></button>
                                </div>
                            </div>
                            <button type="submit" disabled={busy} className="h-9 rounded bg-teal-800 px-4 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50" data-testid="quick-dice-roll-button">{busy ? 'Rolling…' : 'Roll'}</button>
                        </form>
                        <p className="mt-2 text-[10px] text-zinc-500">D10 · 8+ succeeds · 10-again · 0 = chance die</p>
                        {error && <p className="mt-2 text-xs text-red-300" role="alert">{error}</p>}
                        {result && (
                            <div className="mt-2 border-t border-zinc-800 pt-2" aria-live="polite" data-testid="quick-dice-result">
                                <div className="flex items-baseline justify-between gap-2">
                                    <strong className="text-sm text-teal-200">{result.description || `${result.successes} successes`}</strong>
                                    <span className="text-[10px] text-zinc-500">{result.rolledPool === 0 ? 'Chance die' : `${result.rolledPool} dice`}</span>
                                </div>
                                <div className="mt-2 flex max-h-28 flex-wrap gap-1 overflow-y-auto" aria-label="Rolled dice">
                                    {result.dice.map((face, index) => (
                                        <span key={index} className={`flex h-7 w-7 items-center justify-center rounded border text-xs tabular-nums ${face >= (result.rolledPool === 0 ? 10 : 8) ? 'border-teal-500/60 bg-teal-900/30 text-teal-100' : 'border-zinc-700 bg-zinc-900 text-zinc-400'}`} title={face >= (result.rolledPool === 0 ? 10 : 8) ? 'Success' : 'No success'}>{face}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};