import { X, Star } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ConditionCard = ({
    timer,
    pendingLapse = false,
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
    removeAsCorrection = false,
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
            className={`${colors.bg} ${colors.border} border rounded-sm p-3 w-full min-w-0 relative group text-xs leading-normal transition-colors ${expired ? "opacity-50 grayscale" : ""}`}
            data-testid={`condition-card-${safeName
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
        >
            <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1 mb-1">
                <div className="flex flex-1 basis-48 min-w-0 items-center gap-2 flex-wrap">
                    <span
                        className={`text-xs px-1.5 py-0.5 rounded ${colors.badge} ${colors.text} font-mono uppercase`}
                    >
                        {badgeLabel}
                    </span>

                    <h4
                        className={`font-heading text-xs font-semibold ${colors.text}`}
                    >
                        {name}
                    </h4>

                    {type !== "tilt" && <span
                        className={`text-xs px-1.5 py-0.5 rounded font-mono uppercase tracking-wider border ${
                            isArcaneBeat
                                ? "border-violet-500/40 bg-violet-900/40 text-violet-200"
                                : "border-amber-500/40 bg-amber-900/40 text-amber-200"
                        }`}
                        data-testid={`condition-beat-${safeName.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                        {beatType === "none" ? "No Beat" : beatType === "arcane-lapse" ? "Arcane Beat on lapse" : isArcaneBeat ? "Arcane Beat" : "Regular Beat"}
                    </span>}

                    {persistent && (
                        <span className="text-xs px-1.5 py-0.5 rounded border border-amber-600/40 bg-amber-950/30 text-amber-300 font-mono uppercase tracking-wider">
                            Persistent
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap items-center justify-end gap-1 ml-auto max-w-full">
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
                            className="h-6 px-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-900/30 border border-transparent hover:border-amber-500/30"
                            data-testid={`resolve-condition-${safeName
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                        >
                            <Star className="w-3 h-3 mr-1" />
                            {type === "tilt" ? "End Tilt" : "Resolve"}
                        </Button>
                    )}

                    {onRemove && !expired &&                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            onRemove(
                                conditionIndex
                            )
                        }
                        title={removeAsCorrection ? "Remove (ST correction, no damage or Mana)" : "Remove Condition"}
                        aria-label={removeAsCorrection ? "Remove Abyssal Taint (ST correction)" : "Remove Condition"}
                        className={"h-6 w-6 transition-opacity text-zinc-500 hover:text-red-400 self-end " + (removeAsCorrection ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100")}
                        data-testid={`remove-condition-${safeName
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                    >
                        <X className="w-3 h-3" />
                    </Button>}
                </div>
            </div>
            <div className="min-w-0 w-full break-words">
                <p
                    className="text-xs text-zinc-500 mb-2"
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
                        className="mb-2 px-2 py-1.5 rounded-sm border border-cyan-700/40 bg-cyan-950/30 text-xs text-cyan-300"
                        data-testid={`condition-shelter-mitigation-${safeName
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                    >
                        Protected — environmental effects currently suppressed.
                    </div>
                )}
                {timer?.kind && timer.kind !== "untimed" && (
                    <p className="text-xs text-teal-300 mb-2" data-testid={"condition-timer-" + conditionIndex}>
                        {timer.label}
                    </p>
                )}
                {expired && <p className="mb-2 text-xs text-zinc-500">Removed at End Scene</p>}
                {expired && pendingLapse && <p className="mb-2 text-xs text-violet-300">Abyssal Taint modifier active; permanent Taint and Arcane Beat pending End Scene.</p>}
                {onSetParadoxSuccesses && !expired && <form className="flex flex-wrap items-center gap-2 mb-2" onSubmit={e=>{
                    e.preventDefault();
                    const value=Number(new FormData(e.currentTarget).get('paradoxSuccesses'));
                    if (Number.isSafeInteger(value)&&value>0) void onSetParadoxSuccesses(value);
                }}>
                    <label className="text-xs text-zinc-400">Paradox successes</label>
                    <Input key={String(paradoxSuccesses ?? '')} name="paradoxSuccesses" type="number" min="1" step="1" required defaultValue={paradoxSuccesses || ''} className="h-7 w-16 text-xs" data-testid="condition-paradox-successes" />
                    <Button type="submit" size="sm" variant="ghost" className="h-7 text-xs">Save</Button>
                    {backlashSpent && <span className="text-xs text-zinc-500">Next-roll modifier already applied</span>}
                </form>}
                {description && (
                    <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                )}

                {resolution && (
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        <span className="font-semibold text-zinc-300">
                            Resolution:
                        </span>{" "}
                        {resolution}
                    </p>
                )}

                {sourceCitation && (
                    <p className="text-xs text-zinc-500 mt-1">Source: {sourceCitation}</p>
                )}
            </div>
        </div>
    );
};
