import { advanceNaturalHealing, restartNaturalHealing, getNaturalHealingLabel } from './naturalHealing';
const t=(date,time)=>({date,time});
const start=(boxes,date='2025-12-05',time='10:00')=>restartNaturalHealing(boxes,t(date,time));
describe('natural healing uses game time', () => {
    test('bashing heals one per 15 minutes, rightmost first', () => {
        const boxes=['bashing','bashing','bashing','empty'];
        const x=advanceNaturalHealing(boxes,start(boxes),t('2025-12-05','10:00'),t('2025-12-05','10:30'));
        expect(x.healed).toBe(2);expect(x.boxes).toEqual(['bashing','empty','empty','empty']);
        expect(x.recovery.wound_type).toBe('bashing');
    });
    test('partial progress persists and carries across advances',()=>{
        const b=['bashing','empty'];let a=advanceNaturalHealing(b,start(b),t('2025-12-05','10:00'),t('2025-12-05','10:07'));
        expect(a.healed).toBe(0);expect(a.recovery.progress_ms).toBe(7*60000);
        a=advanceNaturalHealing(a.boxes,a.recovery,t('2025-12-05','10:07'),t('2025-12-05','10:15'));
        expect(a.healed).toBe(1);expect(a.recovery.wound_type).toBe(null);
    });
    test('lethal and aggravated each consume their own full intervals, sequentially',()=>{
        const boxes=['aggravated','lethal','bashing','empty'];
        const a=advanceNaturalHealing(boxes,start(boxes,'2025-01-01','00:00'),t('2025-01-01','00:00'),t('2025-01-10','00:15'));
        expect(a.healed).toBe(3);expect(a.boxes).toEqual(['empty','empty','empty','empty']);
    });
    test('manual wound changes reset partial progress',()=>{
        let boxes=['bashing','bashing','empty'];
        let a=advanceNaturalHealing(boxes,start(boxes),t('2025-12-05','10:00'),t('2025-12-05','10:07'));
        const reset=restartNaturalHealing(['bashing','bashing','bashing'],t('2025-12-05','10:07'));
        a=advanceNaturalHealing(['bashing','bashing','bashing'],reset,t('2025-12-05','10:07'),t('2025-12-05','10:15'));
        expect(a.healed).toBe(0);
    });
    test('rewinding time never reverses a wound or double counts elapsed time',()=>{
        const boxes=['bashing','bashing','empty'];
        const a=advanceNaturalHealing(boxes,start(boxes),t('2025-12-05','10:00'),t('2025-12-05','10:15'));
        const b=advanceNaturalHealing(a.boxes,a.recovery,t('2025-12-05','10:15'),t('2025-12-05','10:00'));
        const c=advanceNaturalHealing(b.boxes,b.recovery,t('2025-12-05','10:00'),t('2025-12-05','10:20'));
        expect(a.healed).toBe(1);expect(b.healed).toBe(0);expect(c.healed).toBe(0);
        expect(c.recovery.progress_ms).toBe(5*60000);
    });
    test('unset clock does not fabricate prior healing',()=>{
        const boxes=['bashing','empty'];
        const a=advanceNaturalHealing(boxes,{},t('',''),t('2025-12-05','11:00'));
        expect(a.healed).toBe(0);
    });
    test('all-lethal and all-aggravated tracks do not self-recover',()=>{
        for(const wound of ['lethal','aggravated']){
            const boxes=[wound,wound,wound];
            const a=advanceNaturalHealing(boxes,start(boxes),t('2025-12-05','10:00'),t('2026-01-05','10:00'));
            expect(a.healed).toBe(0);
        }
    });
    test('status gives remaining time after partial healing',()=>{
        const boxes=['bashing','empty'];
        const a=advanceNaturalHealing(boxes,start(boxes),t('2025-12-05','10:00'),t('2025-12-05','10:04'));
        expect(getNaturalHealingLabel(a.boxes,a.recovery,t('2025-12-05','10:04'))).toContain('11m');
    });
});
