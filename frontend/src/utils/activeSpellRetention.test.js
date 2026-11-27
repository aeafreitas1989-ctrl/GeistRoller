import { retainActiveSpells } from './activeSpellRetention';
const tracker = { date: '1607-01-24', time: '12:00' };
test('prunes expired status, elapsed time and exhausted turn effects without changing active records', () => {
    const active = {id:1, duration:'Indefinite'};
    const future = {id:2, expires_at:'1607-01-24T13:00:00.000Z'};
    expect(retainActiveSpells([active, {id:3,status:'expired'}, {id:4, expires_at:'1607-01-24T12:00:00.000Z'}, {id:5,tracking_mode:'turn',turns_remaining:0}, future], tracker)).toEqual([active,{id:4,expires_at:'1607-01-24T12:00:00.000Z',clock_review:true,status:'expired'},{...future,clock_review:true,status:'active'}]);
    const unchanged = [active,{...future,clock_review:true,status:'active'}];
    expect(retainActiveSpells(unchanged, tracker)).toBe(unchanged);
});
