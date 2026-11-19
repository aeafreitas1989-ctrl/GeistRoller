// CoD 2e mixed-severity armor calculation. Ballistic downgrades lethal damage;
// General armor then removes remaining damage, highest severity first.
const points = value => Math.max(0, Math.floor(Number(value) || 0));
export const resolveArmoredDamage = ({
    amount, damageType = 'lethal', sourceProfile = 'general',
    equippedGeneral = 0, equippedBallistic = 0,
    mageArmor = '', mageArmorDots = 0,
}) => {
    const original = points(amount);
    let lethal = damageType === 'lethal' ? original : 0;
    let bashing = damageType === 'bashing' ? original : 0;
    let aggravated = damageType === 'aggravated' ? original : 0;
    const dots = points(mageArmorDots);
    // The reduction applies before mundane armor, mirroring the existing UI.
    if (mageArmor === 'Prime' && sourceProfile === 'supernatural') {
        let removal = Math.min(original, dots);
        const cutA = Math.min(aggravated, removal); aggravated -= cutA; removal -= cutA;
        const cutL = Math.min(lethal, removal); lethal -= cutL; removal -= cutL;
        bashing = Math.max(0, bashing - removal);
    }
    if (lethal && (mageArmor === 'Death' && ['general', 'ballistic'].includes(sourceProfile) ||
                   mageArmor === 'Spirit' && ['general', 'ballistic', 'spirit'].includes(sourceProfile))) {
        bashing += lethal;
        lethal = 0;
    }
    const generalBonus = mageArmor === 'Matter' ? dots : mageArmor === 'Life' ? Math.ceil(dots / 2) : 0;
    const general = ['ballistic','general'].includes(sourceProfile)
        ? points(equippedGeneral) + generalBonus
        : sourceProfile === 'energy' && mageArmor === 'Forces' ? dots : 0;
    const ballistic = sourceProfile === 'ballistic' ? points(equippedBallistic) : 0;
    const converted = Math.min(lethal, ballistic);
    lethal -= converted;
    bashing += converted;
    let removed = Math.min(lethal, general);
    lethal -= removed;
    const remainder = general - removed;
    bashing = Math.max(0, bashing - remainder);
    // CoD shock: applying armor to a lethal hit still inflicts at least 1B.
    if (original > 0 && damageType === 'lethal' && (general > 0 || ballistic > 0) &&
        aggravated + lethal + bashing === 0) bashing = 1;
    return { aggravated, lethal, bashing };
};

export const attackDicePool = (base, woundPenalty = 0) =>
    Math.max(0, (Number(base) || 0) + Math.min(0, Number(woundPenalty) || 0));
