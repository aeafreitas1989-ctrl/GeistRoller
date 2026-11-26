import { parseCeremonyDicePool } from './ceremonyRoll';
import { CEREMONY_LIST, CEREMONY_DEFINITIONS } from '../data/character-data';
import { CEREMONY_DEFINITIONS as cards } from '../data/cards-data';
import { getMeritCardRules } from './meritCardRules';
test('the complete learned catalogue has one reference definition per name',()=>{
    expect(cards).toBe(CEREMONY_DEFINITIONS);
    expect(Object.keys(cards)).toHaveLength(CEREMONY_LIST.length);
    for(const entry of CEREMONY_LIST){expect(cards[entry.name].dicePool).toBe(entry.dicePool);expect(cards[entry.name].description).toBe(entry.description || entry.success || '');}
});
test('simple ceremony rolls support Skills, Attributes and existing aliases',()=>{
    expect(parseCeremonyDicePool('Stamina + Medicine')).toEqual({attrKey:'stamina',skillKey:'medicine',isRightAttribute:false});
    expect(parseCeremonyDicePool('Stamina + Composure')).toEqual({attrKey:'stamina',skillKey:'composure',isRightAttribute:true});
    expect(parseCeremonyDicePool('Wits + Craft').skillKey).toBe('crafts');
    expect(parseCeremonyDicePool('Manipulation + Computers').skillKey).toBe('computer');
});
test('modified and contested pools are never silently rolled as plain pools',()=>{
    expect(parseCeremonyDicePool('Manipulation + Expression vs. the dice pool that created the curse')).toBeNull();
    expect(parseCeremonyDicePool("Resolve + Persuasion – ghost's Rank (vs. Resolve + Rank if unwilling)")).toBeNull();
    expect(parseCeremonyDicePool('Wits + Not A Skill')).toBeNull();
});
test('both presentations share locking and legal ratings',()=>{
    expect(getMeritCardRules({name:'Trained Observer',dots:2}).invalidStoredRating).toBe(true);
    expect(getMeritCardRules({name:'Resources',dots:2,locked:true}).canEditDots).toBe(false);
    expect(getMeritCardRules({name:'Status: Mysterium',dots:1,source:'order_free'}).locked).toBe(false);
});
