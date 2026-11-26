import { replaceSceneDateSegment, parseSceneDateDraft, parseSceneDatePaste, toSceneISODate, toSceneCalendarDate } from './sceneDateTimeValues';
test('replacing day digit by digit never moves month or year',()=>{
    let draft=replaceSceneDateSegment('1607/01/23',2,'2');
    expect(draft).toBe('1607/01/2');
    draft=replaceSceneDateSegment(draft,2,'24');
    expect(draft).toBe('1607/01/24');
    expect(toSceneISODate(parseSceneDateDraft(draft))).toBe('1607-01-24');
});
test('month and year edits keep other segments independent',()=>{
    expect(replaceSceneDateSegment('1607/01/23',1,'11')).toBe('1607/11/23');
    expect(replaceSceneDateSegment('1607/01/23',0,'1608')).toBe('1608/01/23');
    expect(replaceSceneDateSegment('1607/01/23',2,'')).toBe('1607/01/');
    expect(toSceneCalendarDate(parseSceneDateDraft('1607/1/2'))).toBe('1607/01/02');
});
test('eight digits, ISO and legacy formatted paste are supported',()=>{
    expect(parseSceneDatePaste('16070124')).toBe('1607/01/24');
    expect(parseSceneDatePaste('1607-01-24')).toBe('1607/01/24');
    expect(parseSceneDatePaste('1607/1/24')).toBe('1607/01/24');
    expect(parseSceneDatePaste('24/1/1607')).toBe('1607/01/24');
});
test('invalid dates and incomplete years cannot be committed',()=>{
    expect(parseSceneDateDraft('1607/02/31')).toBeNull();
    expect(parseSceneDateDraft('160/01/23')).toBeNull();
    expect(parseSceneDateDraft('1607/01/')).toBeNull();
    expect(parseSceneDatePaste('16070231')).toBeNull();
});
