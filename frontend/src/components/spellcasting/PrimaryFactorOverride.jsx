import { Checkbox } from "@/components/ui/checkbox";

/**
 * Primary Factor Override section.
 * Allows the user to spend 1 Reach to change a spell's primary factor.
 * Scale is allowed only when override is on; it can never be a default primary.
 */
export const PrimaryFactorOverride = ({
    selectedPractice,
    overridePrimaryFactor,
    setOverridePrimaryFactor,
    primaryFactor,
    setPrimaryFactor,
    defaultPrimaryFactor,
}) => {
    if (!selectedPractice) return null;

    return (
        <div className="p-2 bg-zinc-800/30 rounded space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-zinc-500 uppercase">Primary Factor Override</p>
                    <p className="text-[11px] text-zinc-600">
                        Spend 1 Reach to override the spell&apos;s normal primary factor
                    </p>
                </div>
                <Checkbox
                    checked={overridePrimaryFactor}
                    onCheckedChange={(checked) => {
                        setOverridePrimaryFactor(!!checked);
                        if (!checked) {
                            // Restore default primary on un-toggle.
                            setPrimaryFactor(defaultPrimaryFactor);
                        } else if (primaryFactor === defaultPrimaryFactor) {
                            // Pre-select a non-default option if the current primary
                            // still equals the default (so the user sees something selected).
                            const fallback =
                                defaultPrimaryFactor === "potency" ? "duration" :
                                defaultPrimaryFactor === "duration" ? "potency" :
                                "potency";
                            setPrimaryFactor(fallback);
                        }
                    }}
                    className="border-zinc-600 data-[state=checked]:bg-amber-600"
                    data-testid="override-primary-factor"
                />
            </div>

            {overridePrimaryFactor && (
                <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">New Primary Factor</p>
                    <div className="flex gap-1.5" data-testid="pfo-selector">
                        {["potency", "duration", "scale"]
                            .filter((f) => f !== defaultPrimaryFactor)
                            .map((f) => {
                                const active = primaryFactor === f;
                                return (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => setPrimaryFactor(f)}
                                        className={`px-2 py-1 rounded border text-[11px] capitalize ${
                                            active
                                                ? "bg-amber-700 border-amber-500 text-white"
                                                : "bg-zinc-900/40 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                        }`}
                                        data-testid={`pfo-${f}`}
                                    >
                                        {f}
                                    </button>
                                );
                            })}
                    </div>
                    {defaultPrimaryFactor && (
                        <p className="text-[10px] text-zinc-600">
                            Default primary: <span className="capitalize text-zinc-400">{defaultPrimaryFactor}</span>. Scale can never be a default primary.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
