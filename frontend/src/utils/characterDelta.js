import { isStaleCharacterSnapshot } from './characterUpdateQueue';

export const reconcileCharacterDelta = (confirmed, message) => {
    if (!confirmed?.id || message?.type !== 'character_delta' || message.id !== confirmed.id || !message.revision || !message.base_revision) return {kind:'gap'};
    if (message.revision === confirmed.updated_at || isStaleCharacterSnapshot(confirmed,{updated_at:message.revision})) return {kind:'old',snapshot:confirmed};
    if (message.base_revision !== confirmed.updated_at || !message.changes || typeof message.changes !== 'object' || Array.isArray(message.changes) || message.changes.updated_at !== message.revision || Object.hasOwn(message.changes,'id') || Object.hasOwn(message.changes,'xp_history')) return {kind:'gap'};
    return {kind:'applied',snapshot:{...confirmed,...message.changes}};
};
