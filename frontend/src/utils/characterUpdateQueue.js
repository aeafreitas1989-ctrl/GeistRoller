// State helpers shared by optimistic PUT and live-update subscription.
export const applyPendingCharacterPatches = (character, patches = []) =>
    (patches || []).reduce((state, entry) => ({ ...state, ...(entry.updates || entry) }), { ...(character || {}) });

const preciseUTC = value => {
    if (typeof value !== 'string') return null;
    const match = value.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d{1,6}))?(?:Z|\+00:00)$/);
    return match ? match[1] + '.' + (match[2] || '').padEnd(6, '0') : null;
};
export const isStaleCharacterSnapshot = (newer, candidate) => {
    if (!newer?.updated_at || !candidate?.updated_at) return false;
    const a=preciseUTC(newer.updated_at), b=preciseUTC(candidate.updated_at);
    if (a && b) return b < a;
    const newerDate=Date.parse(newer.updated_at), candidateDate=Date.parse(candidate.updated_at);
    return Number.isFinite(newerDate) && Number.isFinite(candidateDate) && candidateDate < newerDate;
};

export const resolveCharacterUpdate = (latest, update) => typeof update === "function" ? update(latest) : update;
