import { restartNaturalHealing, getWoundHealingRemainingLabels } from './naturalHealing';
test('wound display uses remaining time, with no replay on clock correction',()=>{
    const boxes=['lethal','bashing','empty'];
    const clock={date:'1607-01-24',time:'10:00'};
    const recovery=restartNaturalHealing(boxes,clock);
    const expected=['2d 15min remaining','15min remaining',null];
    expect(getWoundHealingRemainingLabels(boxes,recovery,clock)).toEqual(expected);
    expect(getWoundHealingRemainingLabels(boxes,recovery,{...clock,date:'1607-01-23',processed_at:'1607-01-24T10:00:00.000Z'})).toEqual(expected);
    expect(getWoundHealingRemainingLabels(boxes,{},clock)).toEqual([null,null,null]);
});
