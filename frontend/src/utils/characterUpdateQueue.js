// State helpers shared by optimistic PUT and live-update subscription.
export const applyPendingCharacterPatches = (character, patches = []) =>
    (patches || []).reduce((state, entry) => ({ ...state, ...(entry.updates || entry) }), { ...(character || {}) });

export const isStaleCharacterSnapshot = (newer, candidate) => {
    if (!newer?.updated_at || !candidate?.updated_at) return false;
    const newerDate = Date.parse(newer.updated_at);
    const candidateDate = Date.parse(candidate.updated_at);
    return Number.isFinite(newerDate) && Number.isFinite(candidateDate) && candidateDate < newerDate;
};
