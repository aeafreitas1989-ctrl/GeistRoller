import { buildXPTrackerEntries, getXPTransactionTotals, isValidXPTrackerBalance } from './xpTrackerRules';
test('legacy ledger entries appear once and preserve movement sign', () => {
    const rows=buildXPTrackerEntries([{id:'tx',source_ledger_id:'paid',date:'2026-01-02'}],[{id:'paid'},{id:'old',date:'2026-01-01',cost:{experience:2}}]);
    expect(rows.map(r=>r.id)).toEqual(['tx','old']);
    expect(rows[1]).toMatchObject({historical:true,movements:[{resource:'experience',amount:-2}]});
});
test('transaction totals and beat validation preserve existing constraints', () => {
    expect(getXPTransactionTotals({movements:[{resource:'beats',amount:1},{resource:'beats',amount:-5}]}).beats).toBe(-4);
    expect(()=>getXPTransactionTotals({movements:[{resource:'mana',amount:1}]})).toThrow();
    expect(isValidXPTrackerBalance('beats',5)).toBe(false);
    expect(isValidXPTrackerBalance('experience',5)).toBe(true);
});
