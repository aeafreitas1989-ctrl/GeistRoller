import { validateGeistCreation } from './geistCreationAudit';
test('default Synergy 1 and Rank 3 do not trigger supernatural-rating errors', () => {
 const audit = validateGeistCreation({ synergy: 1, geist_rank: 3 });
 expect(audit.errors.some((e) => e.includes('Synergy'))).toBe(false);
 expect(audit.errors.some((e) => e.includes('Rank'))).toBe(false);
});
test('Synergy 4 or standard Rank 1 invalid at creation', () => {
 const audit = validateGeistCreation({ synergy: 4, geist_rank: 1 });
 expect(audit.errors.some((e) => e.includes('Synergy'))).toBe(true);
 expect(audit.errors.some((e) => e.includes('Rank'))).toBe(true);
});
