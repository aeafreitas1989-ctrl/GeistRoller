import {
    expireTimedEffects, getEffectTimer, hasFiniteDuration,
    isEffectExpired, startTimedEffect, advanceTurnEffects, expireCombatEffects,
} from "./effectDuration";

const tracker = (date, time) => ({ date, time });

describe("in-game effect timers", () => {
    test("one hour expires at the in-game deadline, not in real time", () => {
        const effect = startTimedEffect({ id: 1, kind: "spell", duration: "1 hour" }, tracker("2025-12-05", "15:30"));
        expect(effect.expires_at).toBe("2025-12-05T16:30:00.000Z");
        expect(getEffectTimer(effect, tracker("2025-12-05", "16:00")).label).toBe("30m remaining");
        expect(isEffectExpired(effect, tracker("2025-12-05", "16:29"))).toBe(false);
        expect(isEffectExpired(effect, tracker("2025-12-05", "16:30"))).toBe(true);
    });

    test("a day crosses midnight, and a month clamps to its last day", () => {
        const day = startTimedEffect({ duration: "1 day" }, tracker("2025-12-31", "23:40"));
        expect(day.expires_at).toBe("2026-01-01T23:40:00.000Z");
        const month = startTimedEffect({ duration: "1 month" }, tracker("2025-01-31", "08:00"));
        expect(month.expires_at).toBe("2025-02-28T08:00:00.000Z");
        const leap = startTimedEffect({ duration: "1 year" }, tracker("2024-02-29", "12:00"));
        expect(leap.expires_at).toBe("2025-02-28T12:00:00.000Z");
    });

    test("expired effects remain in the list but are flagged", () => {
        const effect = startTimedEffect({ id: 1, kind: "spell", duration: "1 hour" }, tracker("2025-12-05", "15:30"));
        const spells = [effect, { id: 2, kind: "effect", duration: "Scene" }];
        const expired = expireTimedEffects(spells, tracker("2025-12-05", "17:00"));
        expect(expired).toHaveLength(2);
        expect(expired[0].status).toBe("expired");
        expect(getEffectTimer(expired[0], tracker("2025-12-05", "15:35")).label).toBe("Expired");
        expect(expired[1]).toEqual(spells[1]);
        expect(expireTimedEffects(expired, tracker("2025-12-05", "18:00"))).toBe(expired);
    });

    test("no clock means no fabricated timer; legacy spells may start manually", () => {
        const old = { id: 3, kind: "spell", duration: "1 week" };
        expect(startTimedEffect(old, tracker("", ""))).toBe(old);
        expect(getEffectTimer(old, tracker("2025-12-05", "12:00")).kind).toBe("untracked");
        expect(startTimedEffect(old, tracker("2025-12-05", "12:00")).expires_at).toBe("2025-12-12T12:00:00.000Z");
    });

    test("scene and indefinite effects do not get clock expiration", () => {
        for (const duration of ["Next applicable attack", "Indefinite (+1 Reach, 1 Mana)", "Lasting", "5 turns"]) {
            expect(hasFiniteDuration({ duration })).toBe(false);
            expect(getEffectTimer({ duration }, tracker("2025-12-05", "12:00")).kind).toBe("untimed");
        }
        expect(getEffectTimer({ duration: "Scene" }, tracker("2025-12-05", "12:00")).kind).toBe("scene");
        const condition = startTimedEffect({ name: "Shaken", duration: "2 turns" }, tracker("2025-12-05", "12:00"));
        expect(condition.turns_remaining).toBe(2);
        expect(advanceTurnEffects(advanceTurnEffects([condition]))[0].status).toBe("expired");
    });
});


describe("Combat-only Standard Duration", () => {
    test("turn countdown and End Combat expiry", () => {
        const effect = startTimedEffect({ kind: "spell", duration: "3 turns" }, tracker("2025-12-05", "10:00"));
        expect(effect.turns_remaining).toBe(3);
        expect(getEffectTimer(effect, tracker("2025-12-05", "10:00")).label).toBe("3 turns remaining");
        const tick1 = advanceTurnEffects([effect]);
        expect(tick1[0].turns_remaining).toBe(2);
        expect(advanceTurnEffects(advanceTurnEffects(tick1))[0].status).toBe("expired");
        expect(expireCombatEffects([effect])[0].status).toBe("expired");
    });
});
