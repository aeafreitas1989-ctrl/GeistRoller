import { GNOSIS_TABLE } from '../data/character-data';
import { validateMageCreation } from './mageCreationAudit';
test('Gnosis-10 ritual interval and yantras are consistent', () => {
 expect(GNOSIS_TABLE[10]).toMatchObject({ ritualInterval: '1 min', combinedSpells: 4, yantras: 6 });
});
test('starting Rote cannot exceed owned Arcanum despite Rote Reach allowance', () => {
 const base = { rotes:[{spell:'Impossible Rote', arcanum:'Death', practice:'Making', primary_factor:'potency', skill:'occult'}], arcana: { Death: 1 }, praxes:[] };
 const audit = validateMageCreation(base);
 expect(audit.errors.some((e) => e.includes('Impossible Rote') && e.includes('Death 5'))).toBe(true);
});
