import { X, Star } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ConditionCard = ({
    timer,
    expired = false,
    name,
    type,
    persistent = false,
    beatType = "regular",
    group = "",
    mitigatedByShelter = false,
    description,
    resolution,
    sourceCitation = "",
    origin,
    targetName,
    onRemove,
    onResolve,
    onScour,
    scourDisabled = false,
    onSetParadoxSuccesses,
    paradoxSuccesses,
    backlashSpent,
    conditionIndex,
}) => {
    // Card colour identifies the Beat awarded on resolution.
    // Existing Conditions without beat_type award a normal Beat.
    const [savingScour, setSavingScour] = useState(false);
    const isArcaneBeat = beatType === "arcane" || beatType === "arcane-lapse";
    const colors = isArcaneBeat
        ? { bg: "bg-violet-950/30", border: "border-violet-500/40", text: "text-violet-300", badge: "bg-violet-900/50" }
        : { bg: "bg-amber-950/30", border: "border-amber-500/40", text: "text-amber-300", badge: "bg-amber-900/50" };

    const safeName =
        typeof name === "string"
            ? name
            : String(name);

    const originLabel =
        origin ||
        (
            type === "tilt"
                ? "Tilt"
                : type === "geist"
                ? "Geist"
                : type === "condition"
                ? "Condition"
                : "Custom"
        );

    const safeTargetName =
        targetName ||
        "Character";

    const isEnvironmentalTilt =
        group ===
        "tilt-environmental";

    const isPersonalTilt =
        group ===
        "tilt-personal";

    const badgeLabel =
        isEnvironmentalTilt
            ? "Environmental Tilt"
            : isPersonalTilt
            ? "Personal Tilt"
            : type === "tilt"
            ? "Tilt"
            : type;

    const targetVerb =
        isEnvironmentalTilt
            ? "affecting"
            : "targeting";

    return (
        <div
            className={`${colors.bg} ${colors.border} border rounded-sm p-3 relative group transition-all hover:scale-[1.02] ${expired ? "opacity-50 grayscale" : ""}`}
            data-testid={`condition-card-${safeName
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                            className={`text-xs px-1.5 py-0.5 rounded ${colors.badge} ${colors.text} font-mono uppercase`}
                        >
                            {badgeLabel}
                        </span>

                        <h4
                            className={`font-heading text-sm font-semibold ${colors.text}`}
                        >
                            {name}
                        </h4>

                        {type !== "tilt" && <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider border ${
                                isArcaneBeat
                                    ? "border-violet-500/40 bg-violet-900/40 text-violet-200"
                                    : "border-amber-500/40 bg-amber-900/40 text-amber-200"
                            }`}
                            data-testid={`condition-beat-${safeName.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                            {beatType === "none" ? "No Beat" : beatType === "arcane-lapse" ? "Arcane Beat on lapse" : isArcaneBeat ? "Arcane Beat" : "Regular Beat"}
                        </span>}

                        {persistent && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded border border-amber-600/40 bg-amber-950/30 text-amber-300 font-mono uppercase tracking-wider">
                                Persistent
                            </span>
                        )}
                    </div>

                    <p
                        className="text-[10px] text-zinc-500 mb-2"
                        data-testid={`condition-origin-${safeName
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                    >
                        from {originLabel};{" "}
                        {targetVerb}{" "}
                        <span className="text-zinc-300">
                            {safeTargetName}
                        </span>
                    </p>
                    {mitigatedByShelter && (
                        <div
                            className="mb-2 px-2 py-1.5 rounded-sm border border-cyan-700/40 bg-cyan-950/30 text-[10px] text-cyan-300"
                            data-testid={`condition-shelter-mitigation-${safeName
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                        >
                            Protected — environmental effects currently suppressed.
                        </div>
                    )}
                    {timer?.kind && timer.kind !== "untimed" && (
                        <p className="text-[10px] text-teal-300 mb-2" data-testid={"condition-timer-" + conditionIndex}>
                            {timer.label}
                        </p>
                    )}
                    {onSetParadoxSuccesses && !expired && <form className="flex flex-wrap items-center gap-2 mb-2" onSubmit={e=>{
                        e.preventDefault();
                        const value=Number(new FormData(e.currentTarget).get('paradoxSuccesses'));
                        if (Number.isSafeInteger(value)&&value>0) void onSetParadoxSuccesses(value);
                    }}>
                        <label className="text-[10px] text-zinc-400">Paradox successes</label>
                        <Input key={String(paradoxSuccesses ?? '')} name="paradoxSuccesses" type="number" min="1" step="1" required defaultValue={paradoxSuccesses || ''} className="h-7 w-16 text-xs" data-testid="condition-paradox-successes" />
                        <Button type="submit" size="sm" variant="ghost" className="h-7 text-xs">Save</Button>
                        {backlashSpent && <span className="text-[10px] text-zinc-500">Next-roll modifier already applied</span>}
                    </form>}
                    {description && (
                        <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">
                            {description}
                        </p>
                    )}

                    {resolution && (
                        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                            <span className="font-semibold text-zinc-300">
                                Resolution:
                            </span>{" "}
                            {resolution}
                        </p>
                    )}

                    {sourceCitation && (
                        <p className="text-[10px] text-zinc-600 mt-1">Source: {sourceCitation}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1 flex-shrink-0">
                    {onScour && !expired && <Button type="button" variant="outline" size="sm" className="h-auto min-h-6 py-1 text-xs border-violet-500/40 text-violet-300" disabled={savingScour || scourDisabled} title="1 resistant lethal damage; no Mana; uses one daily Scouring" data-testid="scour-abyssal-condition" onClick={async()=>{setSavingScour(true);try{await onScour();}finally{setSavingScour(false);}}}>Scour</Button>}
                    {onResolve && !expired && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                onResolve(
                                    conditionIndex
                                )
                            }
                            className="h-6 px-2 text-[10px] text-amber-400 hover:text-amber-300 hover:bg-amber-900/30 border border-transparent hover:border-amber-500/30"
                            data-testid={`resolve-condition-${safeName
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                        >
                            <Star className="w-3 h-3 mr-1" />
                            {type === "tilt" ? "End Tilt" : "Resolve"}
                        </Button>
                    )}

{onRemove &&                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            onRemove(
                                conditionIndex
                            )
                        }
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 self-end"
                        data-testid={`remove-condition-${safeName
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                    >
                        <X className="w-3 h-3" />
                    </Button>}
                </div>
            </div>
        </div>
    );
};
