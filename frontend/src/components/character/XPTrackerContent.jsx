import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, X } from 'lucide-react';
import { formatLedgerDate, formatXPTrackerMovement } from '../../utils/xpTrackerRules';

export const XPTrackerContent = ({isMage, getValue, manualXPType, setManualXPType, manualXPAmount, setManualXPAmount, manualXPReason, setManualXPReason, recordingManualXP, recordManualXPTransaction, historyReady, historyError, setHistoryRetry, getXPTrackerEntries, savingXPChange, setXpEditDraft, setXpDeleteEntry, historySnapshot}) => {
    const entries = historyReady ? getXPTrackerEntries() : [];
    return (
        <>
            {isMage ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Available</div>
                                            <div className="font-mono text-xs text-emerald-300 mt-1">
                                                XP {getValue("experience") || 0} / Arcane {getValue("arcane_experience") || 0}
                                            </div>
                                        </div>
                                        <div className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Spent</div>
                                            <div className="font-mono text-xs text-amber-300 mt-1">
                                                XP {getValue("spent_experience") || 0} / Arcane {getValue("spent_arcane_experience") || 0}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-sm space-y-3">
                                        <div className="text-xs font-semibold text-zinc-300">
                                            Record XP Transaction
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                value={manualXPType}
                                                onChange={(e) => setManualXPType(e.target.value)}
                                                className="h-8 bg-zinc-900 border border-zinc-700 rounded-sm px-2 text-xs text-zinc-200"
                                            >
                                                <option value="experience">XP</option>
                                                <option value="arcane_experience">Arcane XP</option>
                                            </select>

                                            <Input
                                                type="number"
                                                step="1"
                                                value={manualXPAmount}
                                                onChange={(e) => setManualXPAmount(e.target.value)}
                                                placeholder="+5 or -2"
                                                className="h-8 input-geist text-xs"
                                            />
                                        </div>

                                        <Input
                                            value={manualXPReason}
                                            onChange={(e) => setManualXPReason(e.target.value)}
                                            placeholder="Reason for XP gain or expenditure"
                                            className="h-8 input-geist text-xs"
                                        />

                                        <Button
                                            size="sm"
                                            className="w-full bg-emerald-800 hover:bg-emerald-700 text-white"
                                            onClick={recordManualXPTransaction}
                                            disabled={
                                                recordingManualXP ||
                                                !manualXPReason.trim() ||
                                                !Number.isInteger(Number(manualXPAmount)) ||
                                                Number(manualXPAmount) === 0
                                            }
                                        >
                                            {recordingManualXP ? "Recording..." : "Record Transaction"}
                                        </Button>

                                        <div className="text-[10px] text-zinc-500">
                                            Use positive numbers to gain XP and negative numbers to spend XP.
                                        </div>
                                    </div>

                                    {!historyReady ? (
                                        <div className="text-xs text-zinc-400" data-testid="xp-history-loading">
                                            {historyError ? 'Could not load XP history.' : 'Loading XP history…'}
                                            <Button type="button" size="sm" variant="ghost" onClick={()=>setHistoryRetry(n=>n+1)}>Retry</Button>
                                        </div>
                                    ) : entries.length === 0 ? (
                                        <div className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-sm text-xs text-zinc-500">
                                            No XP transactions recorded yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {entries.map((entry, index) => (
                                                <div
                                                    key={entry.id || index}
                                                    className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-sm"
                                                    data-testid="xp-tracker-entry"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <div className="text-xs text-zinc-200">
                                                                {entry.label || "XP Transaction"}
                                                            </div>
                                                            <div className="mt-1 text-[10px] text-zinc-500">
                                                                {formatLedgerDate(entry.date)}
                                                                {entry.historical && " · Historical advancement"}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-zinc-400 hover:text-amber-300"
                                                                title="Edit transaction"
                                                                disabled={
                                                                    savingXPChange ||
                                                                    !entry.id ||
                                                                    entry.historical ||
                                                                    Boolean(entry.source_ledger_id)
                                                                }
                                                                onClick={() =>
                                                                    setXpEditDraft({
                                                                        ...entry,
                                                                        _history_revision: historySnapshot.updated_at,
                                                                        label: entry.label || "",
                                                                        note: entry.note || "",
                                                                    })
                                                                }
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-zinc-400 hover:text-red-400"
                                                                title="Delete transaction"
                                                                disabled={
                                                                    savingXPChange ||
                                                                    !entry.id ||
                                                                    entry.historical ||
                                                                    Boolean(entry.source_ledger_id)
                                                                }
                                                                onClick={() => setXpDeleteEntry({...entry, _history_revision: historySnapshot.updated_at})}
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {(entry.movements || [])
                                                            .filter(m => Number(m.amount) !== 0)
                                                            .map((movement, movementIndex) => (
                                                                <span
                                                                    key={movementIndex}
                                                                    className={`text-xs font-mono ${
                                                                        Number(movement.amount) > 0
                                                                            ? "text-emerald-300"
                                                                            : "text-rose-300"
                                                                    }`}
                                                                >
                                                                    {formatXPTrackerMovement(movement)}
                                                                </span>
                                                            ))}

                                                        {(entry.movements || []).every(
                                                            m => Number(m.amount) === 0
                                                        ) && (
                                                            <span className="text-xs text-zinc-500">
                                                                No XP change
                                                            </span>
                                                        )}
                                                    </div>

                                                    {entry.balances && (
                                                        <div className="mt-2 text-[10px] text-zinc-500">
                                                            Balance: {entry.balances.experience} XP
                                                            {" / "}
                                                            {entry.balances.arcane_experience} Arcane XP
                                                            {" · "}
                                                            {entry.balances.beats} Beats
                                                            {" / "}
                                                            {entry.balances.arcane_beats} Arcane Beats
                                                        </div>
                                                    )}

                                                    {entry.note && (
                                                        <div className="mt-2 pt-2 border-t border-zinc-800 text-xs text-zinc-400 whitespace-pre-wrap">
                                                            {entry.note}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3" data-testid="geist-xp-tracker">
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            ["Available XP", getValue("experience") || 0],
                                            ["Beats", getValue("beats") || 0],
                                            ["Spent XP", getValue("spent_experience") || 0],
                                        ].map(([label, value]) => (
                                            <div key={label} className="rounded-sm border border-zinc-800 bg-zinc-950/50 p-2">
                                                <div className="text-[10px] text-zinc-500">{label}</div>
                                                <div className="mt-1 font-mono text-sm text-emerald-300">{value}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2 rounded-sm border border-zinc-800 bg-zinc-950/50 p-3">
                                        <div className="text-xs font-semibold text-zinc-300">
                                            Record XP Transaction
                                        </div>
                                        <Input
                                            type="number"
                                            step="1"
                                            value={manualXPAmount}
                                            onChange={(e) => setManualXPAmount(e.target.value)}
                                            placeholder="+5 or -2"
                                            className="h-8 input-geist text-xs"
                                        />
                                        <Input
                                            value={manualXPReason}
                                            onChange={(e) => setManualXPReason(e.target.value)}
                                            placeholder="Reason for XP gain or expenditure"
                                            className="h-8 input-geist text-xs"
                                        />
                                        <Button
                                            size="sm"
                                            className="w-full bg-emerald-800 hover:bg-emerald-700 text-white"
                                            onClick={recordManualXPTransaction}
                                            disabled={
                                                recordingManualXP ||
                                                !manualXPReason.trim() ||
                                                !Number.isInteger(Number(manualXPAmount)) ||
                                                Number(manualXPAmount) === 0
                                            }
                                        >
                                            {recordingManualXP ? "Recording..." : "Record Transaction"}
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {!historyReady ? (
                                        <div className="text-xs text-zinc-400" data-testid="xp-history-loading">
                                            {historyError ? 'Could not load XP history.' : 'Loading XP history…'}
                                            <Button type="button" size="sm" variant="ghost" onClick={()=>setHistoryRetry(n=>n+1)}>Retry</Button>
                                        </div>
                                    ) : entries.length === 0 ? (
                                            <div className="rounded-sm border border-zinc-800 p-3 text-xs text-zinc-500">
                                                No XP transactions recorded yet.
                                            </div>
                                        ) : (
                                            entries.map((entry, index) => (
                                                <div
                                                    key={entry.id || index}
                                                    className="rounded-sm border border-zinc-800 bg-zinc-950/50 p-3"
                                                    data-testid="xp-tracker-entry"
                                                >
                                                    <div className="text-xs text-zinc-200">
                                                        {entry.label || "XP Transaction"}
                                                    </div>
                                                    <div className="mt-1 text-[10px] text-zinc-500">
                                                        {formatLedgerDate(entry.date)}
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {(entry.movements || [])
                                                            .filter(m => ["experience", "beats"].includes(m.resource) && Number(m.amount) !== 0)
                                                            .map((movement, i) => (
                                                                <span key={i} className="font-mono text-xs text-emerald-300">
                                                                    {formatXPTrackerMovement(movement)}
                                                                </span>
                                                            ))}
                                                    </div>
                                                    {entry.note && (
                                                        <p className="mt-2 text-xs text-zinc-400">{entry.note}</p>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
        </>
    );
};
