import {requiredPaymentTurns,nextCombatPayment,isPrepared,abandonPreparation} from './actionPreparation';
test('hybrid turns count uses all paid resources without extra noncombat instalments',()=>{
 expect(requiredPaymentTurns(4,1)).toBe(4);
 expect(requiredPaymentTurns(4,2)).toBe(2);
 expect(requiredPaymentTurns(0,1)).toBe(1);
});
test('each combat installment costs at most the per-turn budget and survives refresh',()=>{
 let c={combat_active:true,mana:7};
 for(let turn=1;turn<=3;turn++){
  const patch=nextCombatPayment(c,'spell','cast-A',5,2,'mana');
  expect(patch).not.toBeNull(); c={...c,...patch};
  expect(c.pending_activation.turns).toBe(turn);
 }
 expect(c.mana).toBe(2);expect(isPrepared(c.pending_activation,'spell','cast-A',5)).toBe(true);
 expect(nextCombatPayment(c,'spell','cast-A',5,2,'mana')).toBeNull();
});
test('abandoning does not refund spent Mana or Plasm',()=>{
 const c={combat_active:true,plasm:6,pending_activation:{kind:'haunt',signature:'abc',paid:2,total:5,turns:1}};
 expect({...c,...abandonPreparation(c,'haunt')}).toMatchObject({plasm:6,pending_activation:null});
 expect(nextCombatPayment(c,'spell','other',3,1,'mana')).toBeNull();
});
