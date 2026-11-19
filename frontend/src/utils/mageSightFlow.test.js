import {applyScrutinySuccesses} from './mageSightFlow';
test('scrutiny advances opacity layers without losing accumulated successes',()=>{
 const first=applyScrutinySuccesses(2,[{successes:0,target:3,complete:false}],3);
 expect(first[0].successes).toBe(2);
 const next=applyScrutinySuccesses(1,first,3);
 expect(next[0].complete).toBe(true);
 expect(next[1].target).toBe(2);
});
test('exceptional scrutiny carries surplus into next layer only when allowed',()=>{
 const first=applyScrutinySuccesses(5,[{successes:0,target:3,complete:false}],3,true);
 expect(first[0].complete).toBe(true);
 expect(first[1].complete).toBe(true);
});
