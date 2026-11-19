import { getDoomedKeySources, getGeistKeySources, isKeySourceDoomed } from './geistKeys';
test('Doom affects an individual Memento, not an identical independent copy', () => {
    const base = { mementos: [{ id: 11, key: 'Blood' }, { id: 22, key: 'Blood' }], conditions: [{ name: 'Doomed', key_name: 'Blood', key_source_id: 'memento::11' }] };
    const choices = getGeistKeySources(base);
    const doomed = getDoomedKeySources(base);
    expect(isKeySourceDoomed(choices[0], doomed)).toBe(true);
    expect(isKeySourceDoomed(choices[1], doomed)).toBe(false);
});
