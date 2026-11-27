export const XP_TRACKER_RESOURCES = [
    "experience",
    "arcane_experience",
    "beats",
    "arcane_beats",
];

export const getXPTransactionTotals = (entry) => {
    const totals = Object.fromEntries(
        XP_TRACKER_RESOURCES.map((resource) => [resource, 0])
    );

    for (const movement of entry.movements || []) {
        const { resource } = movement;
        const amount = Number(movement.amount);

        if (
            !XP_TRACKER_RESOURCES.includes(resource) ||
            !Number.isInteger(amount)
        ) {
            throw new Error("The transaction contains invalid XP movements.");
        }

        totals[resource] += amount;
    }

    return totals;
};

export const isValidXPTrackerBalance = (resource, balance) =>
    Number.isInteger(balance) &&
    balance >= 0 &&
    (!resource.endsWith("beats") || balance <= 4);

export const buildXPTrackerEntries = (history, ledger) => {

    const trackedIds = new Set(
        history.map(entry => entry.source_ledger_id).filter(Boolean)
    );

    const historical = ledger
        .filter(entry => !trackedIds.has(entry.id))
        .map(entry => {
            const movements = [];

            for (const resource of ["experience", "arcane_experience"]) {
                const cost = Number(entry.cost?.[resource]) || 0;
                if (cost !== 0) {
                    movements.push({
                        resource,
                        amount: -cost,
                    });
                }
            }

            return {
                ...entry,
                historical: true,
                movements,
            };
        });

    return [...history, ...historical].sort(
        (a, b) =>
            (Date.parse(b.date) || 0) -
            (Date.parse(a.date) || 0)
    );
};

export const formatLedgerDate = (value) => {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(parsed);
};

export const formatXPTrackerMovement = (movement) => {
    const names = {
        experience: "XP",
        arcane_experience: "Arcane XP",
        beats: "Beats",
        arcane_beats: "Arcane Beats",
    };

    const amount = Number(movement.amount) || 0;
    const sign = amount > 0 ? "+" : "";

    return `${sign}${amount} ${names[movement.resource] || movement.resource}`;
};
