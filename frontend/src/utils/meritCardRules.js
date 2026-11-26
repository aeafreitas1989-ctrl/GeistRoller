import { MERIT_LIST, getMeritCategory } from '../data/character-data';
const catalogue = new Map(MERIT_LIST.map(merit => [merit.name, merit]));
export const getMeritCardRules = (merit = {}) => {
    const definition = catalogue.get(merit.name);
    const category = getMeritCategory(merit.name);
    const minDots = definition?.minDots || 1;
    const maxDots = definition?.maxDots || 5;
    const isOrderStatus = merit.source === 'order_free' && (merit.name || '').startsWith('Status:');
    const locked = !!merit.locked || merit.source === 'professional_training_free' || (merit.source === 'order_free' && !isOrderStatus);
    const invalidStoredRating = !!(definition?.allowedDots?.length && !definition.allowedDots.includes(Number(merit.dots)));
    return { definition, category, minDots, maxDots, locked, invalidStoredRating,
        canEditDots: !locked && (minDots !== maxDots || invalidStoredRating) };
};
