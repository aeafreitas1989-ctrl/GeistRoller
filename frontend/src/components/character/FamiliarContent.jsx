import { useState } from "react";
import { Plus, X, Dices, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { StatDots, ResourceTrack } from "./StatComponents";

const INFLUENCE_EFFECTS = [
    {
        name: "Strengthen",
        influenceCost: 1,
        essenceCost: 1,
    },
    {
        name: "Manipulate",
        influenceCost: 2,
        essenceCost: 2,
    },
    {
        name: "Control",
        influenceCost: 3,
        essenceCost: 3,
    },
    {
        name: "Create",
        influenceCost: 4,
        essenceCost: 4,
    },
    {
        name: "Mass Create",
        influenceCost: 5,
        essenceCost: 5,
    },
];

const INFLUENCE_DURATIONS = [
    {
        name: "1 minute",
        influenceCost: 0,
        essenceCost: 0,
    },
    {
        name: "10 minutes",
        influenceCost: 1,
        essenceCost: 0,
    },
    {
        name: "1 hour",
        influenceCost: 2,
        essenceCost: 1,
    },
    {
        name: "1 day",
        influenceCost: 3,
        essenceCost: 2,
    },
    {
        name: "Permanent",
        influenceCost: 4,
        essenceCost: 3,
    },
];

const DEFAULT_FAMILIAR = {
    name: "",
    entity_type: "Spirit",

    state: "Twilight",
    fetter_type: "Animal",
    fetter_name: "",

    power: 1,
    finesse: 1,
    resistance: 1,

    size: 1,
    speed_factor: 0,

    essence: null,
    corpus: null,
    willpower: null,

    influences: [],
    numina: [],
    manifestations: [],

    ban: "",
    bane: "",

    description: "",
    notes: "",
};

const NumberField = ({
    label,
    value,
    min = 0,
    max = 99,
    onChange,
}) => (
    <div>
        <label className="text-[10px] uppercase tracking-wider text-zinc-500">
            {label}
        </label>

        <Input
            type="number"
            min={min}
            max={max}
            value={value ?? 0}
            onChange={(event) =>
                onChange(
                    Math.max(
                        min,
                        Math.min(
                            max,
                            Number(
                                event.target.value
                            ) || 0
                        )
                    )
                )
            }
            className="input-geist h-8 text-sm mt-0.5"
        />
    </div>
);

const DerivedField = ({
    label,
    value,
}) => (
    <div>
        <label className="text-[10px] uppercase tracking-wider text-zinc-500">
            {label}
        </label>

        <div className="mt-0.5 h-8 flex items-center px-3 rounded-md border border-zinc-800 bg-zinc-950/50 text-sm font-mono text-indigo-300">
            {value}
        </div>
    </div>
);

export const FamiliarContent = ({
    getValue,
    handleChange,
    familiarDots,
    onTriggerDiceRoll,
}) => {
    const [influenceDialogOpen, setInfluenceDialogOpen] =
        useState(false);

    const [activeInfluenceIndex, setActiveInfluenceIndex] =
        useState(null);

    const [selectedInfluenceEffect, setSelectedInfluenceEffect] =
        useState("Strengthen");

    const [selectedInfluenceDuration, setSelectedInfluenceDuration] =
        useState("1 minute");

    const rank =
        Number(familiarDots) >= 4 ? 2 : 1;

    const rankRules =
        rank === 2
            ? {
                  traitCap: 7,
                  attributeMin: 9,
                  attributeMax: 14,
                  essenceMax: 15,
              }
            : {
                  traitCap: 5,
                  attributeMin: 5,
                  attributeMax: 8,
                  essenceMax: 10,
              };

    const familiar = {
        ...DEFAULT_FAMILIAR,
        ...(getValue("familiar") || {}),
    };

    const power = Math.max(
        0,
        Number(familiar.power) || 0
    );

    const finesse = Math.max(
        0,
        Number(familiar.finesse) || 0
    );

    const resistance = Math.max(
        0,
        Number(familiar.resistance) || 0
    );

    const size = Math.max(
        0,
        Number(familiar.size) || 0
    );

    const speedFactor = Math.max(
        0,
        Number(familiar.speed_factor) || 0
    );

    const corpusMax =
        resistance + size;

    const willpowerMax =
        Math.min(
            10,
            finesse + resistance
        );

    const essenceMax =
        rankRules.essenceMax;

    const defense =
        familiar.entity_type === "Spirit" &&
        rank === 1
            ? Math.max(power, finesse)
            : Math.min(power, finesse);

    const initiative =
        finesse + resistance;

    const speed =
        power + finesse + speedFactor;

    const defenseFormula =
        familiar.entity_type === "Spirit" &&
        rank === 1
            ? "higher Pwr/Fin"
            : "lower Pwr/Fin";

    const clampResource = (
        value,
        maximum
    ) => {
        if (
            value === null ||
            value === undefined
        ) {
            return maximum;
        }

        return Math.max(
            0,
            Math.min(
                maximum,
                Number(value) || 0
            )
        );
    };

    const corpusCurrent =
        clampResource(
            familiar.corpus,
            corpusMax
        );

    const willpowerCurrent =
        clampResource(
            familiar.willpower,
            willpowerMax
        );

    const essenceCurrent =
        clampResource(
            familiar.essence,
            essenceMax
        );

    const update = (patch) => {
        handleChange("familiar", {
            ...familiar,
            ...patch,
        });
    };

    const totalAttributes =
        (Number(familiar.power) || 0) +
        (Number(familiar.finesse) || 0) +
        (Number(familiar.resistance) || 0);

    const validAttributeTotal =
        totalAttributes >=
            rankRules.attributeMin &&
        totalAttributes <=
            rankRules.attributeMax;

    const influences = (
        Array.isArray(familiar.influences)
            ? familiar.influences
            : []
    ).map((influence) => {
        // Backward compatibility with old string Influences
        if (typeof influence === "string") {
            return {
                name: influence,
                dots: 1,
            };
        }

        return {
            name: influence?.name || "",
            dots: Math.max(
                1,
                Math.min(
                    5,
                    Number(influence?.dots) || 1
                )
            ),
        };
    });

    const addInfluence = () => {
        update({
            influences: [
                ...influences,
                {
                    name: "",
                    dots: 1,
                },
            ],
        });
    };

    const updateInfluence = (
        index,
        patch
    ) => {
        const next = influences.map(
            (influence, currentIndex) => {
                if (currentIndex !== index) {
                    return influence;
                }

                const updated = {
                    ...influence,
                    ...patch,
                };

                updated.dots = Math.max(
                    1,
                    Math.min(
                        5,
                        Number(updated.dots) || 1
                    )
                );

                return updated;
            }
        );

        update({
            influences: next,
        });
    };

    const removeInfluence = (index) => {
        update({
            influences:
                influences.filter(
                    (_, currentIndex) =>
                        currentIndex !== index
                ),
        });
    };

    /* Manifestations */

    const manifestations = (
        Array.isArray(familiar.manifestations)
            ? familiar.manifestations
            : []
    ).map((manifestation) => {
        // Backward compatibility with old string entries
        if (typeof manifestation === "string") {
            return {
                name: manifestation,
                required_condition: "",
                essence_cost: 0,
                effect: "",
            };
        }

        return {
            name: manifestation?.name || "",
            required_condition:
                manifestation?.required_condition || "",
            essence_cost: Math.max(
                0,
                Number(
                    manifestation?.essence_cost
                ) || 0
            ),
            effect: manifestation?.effect || "",
        };
    });

    const addManifestation = () => {
        update({
            manifestations: [
                ...manifestations,
                {
                    name: "",
                    required_condition: "",
                    essence_cost: 0,
                    effect: "",
                },
            ],
        });
    };

    const updateManifestation = (
        index,
        patch
    ) => {
        const next = manifestations.map(
            (manifestation, currentIndex) =>
                currentIndex === index
                    ? {
                        ...manifestation,
                        ...patch,
                    }
                    : manifestation
        );

        update({
            manifestations: next,
        });
    };

    const removeManifestation = (index) => {
        update({
            manifestations:
                manifestations.filter(
                    (_, currentIndex) =>
                        currentIndex !== index
                ),
        });
    };

    /* Numina */

    const numina = (
        Array.isArray(familiar.numina)
            ? familiar.numina
            : []
    ).map((numen) => {
        // Backward compatibility with old string entries
        if (typeof numen === "string") {
            return {
                name: numen,
                essence_cost: 0,
                can_reach_across_gauntlet: false,
                effect: "",
            };
        }

        return {
            name: numen?.name || "",
            essence_cost: Math.max(
                0,
                Number(numen?.essence_cost) || 0
            ),
            can_reach_across_gauntlet:
                Boolean(
                    numen?.can_reach_across_gauntlet
                ),
            effect: numen?.effect || "",
        };
    });

    const addNumen = () => {
        update({
            numina: [
                ...numina,
                {
                    name: "",
                    essence_cost: 0,
                    can_reach_across_gauntlet: false,
                    effect: "",
                },
            ],
        });
    };

    const updateNumen = (
        index,
        patch
    ) => {
        const next = numina.map(
            (numen, currentIndex) =>
                currentIndex === index
                    ? {
                        ...numen,
                        ...patch,
                    }
                    : numen
        );

        update({
            numina: next,
        });
    };

    const removeNumen = (index) => {
        update({
            numina:
                numina.filter(
                    (_, currentIndex) =>
                        currentIndex !== index
                ),
        });
    };

    const activeInfluence =
        activeInfluenceIndex !== null
            ? influences[activeInfluenceIndex] || null
            : null;

    const effectConfig =
        INFLUENCE_EFFECTS.find(
            (effect) =>
                effect.name === selectedInfluenceEffect
        ) || INFLUENCE_EFFECTS[0];

    const durationConfig =
        INFLUENCE_DURATIONS.find(
            (duration) =>
                duration.name === selectedInfluenceDuration
        ) || INFLUENCE_DURATIONS[0];

    const requiredInfluenceDots =
        effectConfig.influenceCost +
        durationConfig.influenceCost;

    const influenceEssenceCost =
        effectConfig.essenceCost +
        durationConfig.essenceCost;

    const influenceDicePool =
        power + finesse;

    const influenceRating =
        Number(activeInfluence?.dots) || 0;

    const influenceRatingValid =
        requiredInfluenceDots <= influenceRating;

    const influenceHasEssence =
        essenceCurrent >= influenceEssenceCost;

    const canUseInfluence =
        influenceRatingValid &&
        influenceHasEssence;

    const openInfluenceRoll = (index) => {
        setActiveInfluenceIndex(index);
        setSelectedInfluenceEffect("Strengthen");
        setSelectedInfluenceDuration("1 minute");
        setInfluenceDialogOpen(true);
    };

    const triggerFamiliarRoll = ({
    type,
    name,
    essenceCost = 0,
    details = [],
}) => {
    const pool =
        power + finesse;

    const cost = Math.max(
        0,
        Number(essenceCost) || 0
    );

    if (
        !onTriggerDiceRoll ||
        essenceCurrent < cost
    ) {
        return;
    }

    if (cost > 0) {
        update({
            essence:
                essenceCurrent - cost,
        });
    }

    const detailText =
        details
            .filter(Boolean)
            .join("\n");

    onTriggerDiceRoll({
        pool: Math.max(
            1,
            pool
        ),
        chance:
            pool <= 0,
        again: 10,
        rote: false,
        exceptional_target: 5,
        resetSummary: true,

        label:
            `${familiar.entity_type || "Ephemeral Entity"} ` +
            `${type} — ${name}`,

        dicePoolBreakdown:
            `${power} Power + ` +
            `${finesse} Finesse = ` +
            `${pool} dice` +
            (
                detailText
                    ? `\n${detailText}`
                    : ""
            ),
    });
};

    const rollInfluence = () => {
        if (
            !activeInfluence ||
            !canUseInfluence
        ) {
            return;
        }

        setInfluenceDialogOpen(false);

        triggerFamiliarRoll({
            type: "Influence",
            name:
                activeInfluence.name,
            essenceCost:
                influenceEssenceCost,
            details: [
                `Influence: ${activeInfluence.name} ${influenceRating}`,
                `Effect: ${selectedInfluenceEffect}`,
                `Duration: ${selectedInfluenceDuration}`,
                `Essence Cost: ${influenceEssenceCost}`,
            ],
        });
    };

    const rollManifestation = (
        manifestation
    ) => {
        triggerFamiliarRoll({
            type: "Manifestation",
            name:
                manifestation.name,
            essenceCost:
                manifestation.essence_cost,
            details: [
                `Required Condition: ${
                    manifestation.required_condition ||
                    "None"
                }`,
                `Essence Cost: ${
                    manifestation.essence_cost
                }`,
                manifestation.effect
                    ? `Effect: ${manifestation.effect}`
                    : null,
            ],
        });
    };

    const rollNumen = (
        numen
    ) => {
        triggerFamiliarRoll({
            type: "Numen",
            name:
                numen.name,
            essenceCost:
                numen.essence_cost,
            details: [
                `Essence Cost: ${numen.essence_cost}`,
                `Can Reach Across Gauntlet: ${
                    numen.can_reach_across_gauntlet
                        ? "Yes"
                        : "No"
                }`,
                numen.effect
                    ? `Effect: ${numen.effect}`
                    : null,
            ],
        });
    };

    return (
        <div className="space-y-4">
            {/* Rank / Merit summary */}
            <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-sm border border-indigo-800/50 bg-indigo-950/20">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Familiar Merit
                    </div>

                    <div className="mt-1 text-sm font-mono text-indigo-300">
                        {"●".repeat(
                            Number(
                                familiarDots
                            ) || 0
                        )}
                    </div>
                </div>

                <div className="p-2 rounded-sm border border-indigo-800/50 bg-indigo-950/20">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Rank
                    </div>

                    <div className="mt-1 text-sm font-mono text-indigo-300">
                        {rank}
                    </div>
                </div>

                <div className="p-2 rounded-sm border border-indigo-800/50 bg-indigo-950/20">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Max Essence
                    </div>

                    <div className="mt-1 text-sm font-mono text-indigo-300">
                        {
                            rankRules.essenceMax
                        }
                    </div>
                </div>
            </div>

            {/* Identity */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Name
                    </label>

                    <Input
                        value={familiar.name}
                        onChange={(event) =>
                            update({
                                name:
                                    event.target
                                        .value,
                            })
                        }
                        placeholder="Familiar name"
                        className="input-geist h-8 text-sm mt-0.5"
                        data-testid="familiar-name"
                    />
                </div>

                <div>
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Entity Type
                    </label>

                    <Select
                        value={
                            familiar.entity_type
                        }
                        onValueChange={(
                            value
                        ) =>
                            update({
                                entity_type:
                                    value,
                            })
                        }
                    >
                        <SelectTrigger
                            className="bg-zinc-900/50 border-zinc-800 h-8 text-sm mt-0.5"
                            data-testid="familiar-entity-type"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="Spirit">
                                Spirit
                            </SelectItem>

                            <SelectItem value="Ghost">
                                Ghost
                            </SelectItem>

                            <SelectItem value="Goetia">
                                Goetia
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* State */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                        State
                    </label>

                    <Select
                        value={familiar.state}
                        onValueChange={(
                            value
                        ) =>
                            update({
                                state: value,
                            })
                        }
                    >
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm mt-0.5">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="Twilight">
                                Twilight
                            </SelectItem>

                            <SelectItem value="Fettered">
                                Fettered
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {familiar.state ===
                    "Fettered" && (
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                            Fetter Type
                        </label>

                        <Select
                            value={
                                familiar.fetter_type
                            }
                            onValueChange={(
                                value
                            ) =>
                                update({
                                    fetter_type:
                                        value,
                                })
                            }
                        >
                            <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-8 text-sm mt-0.5">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem value="Animal">
                                    Animal
                                </SelectItem>

                                <SelectItem value="Item">
                                    Item
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {familiar.state ===
                "Fettered" && (
                <div>
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Fetter
                    </label>

                    <Input
                        value={
                            familiar.fetter_name
                        }
                        onChange={(event) =>
                            update({
                                fetter_name:
                                    event.target
                                        .value,
                            })
                        }
                        placeholder={
                            familiar.fetter_type ===
                            "Animal"
                                ? "Animal / host"
                                : "Object / item"
                        }
                        className="input-geist h-8 text-sm mt-0.5"
                    />
                </div>
            )}

            {/* Ephemeral Attributes */}
            <div className="rounded-sm border border-zinc-800 bg-zinc-950/40 p-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Ephemeral Attributes
                    </span>

                    <span
                        className={`text-[10px] font-mono ${
                            validAttributeTotal
                                ? "text-emerald-400"
                                : "text-rose-400"
                        }`}
                    >
                        {totalAttributes} /{" "}
                        {
                            rankRules.attributeMin
                        }
                        –
                        {
                            rankRules.attributeMax
                        }{" "}
                        dots
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <div className="text-[10px] text-center uppercase tracking-wider text-zinc-500 mb-1">
                            Power
                        </div>

                        <StatDots
                            value={
                                familiar.power
                            }
                            max={
                                rankRules.traitCap
                            }
                            onChange={(
                                value
                            ) =>
                                update({
                                    power: value,
                                })
                            }
                            color="violet"
                            size="small"
                            testIdPrefix="familiar-power"
                        />
                    </div>

                    <div>
                        <div className="text-[10px] text-center uppercase tracking-wider text-zinc-500 mb-1">
                            Finesse
                        </div>

                        <StatDots
                            value={
                                familiar.finesse
                            }
                            max={
                                rankRules.traitCap
                            }
                            onChange={(
                                value
                            ) =>
                                update({
                                    finesse:
                                        value,
                                })
                            }
                            color="violet"
                            size="small"
                            testIdPrefix="familiar-finesse"
                        />
                    </div>

                    <div>
                        <div className="text-[10px] text-center uppercase tracking-wider text-zinc-500 mb-1">
                            Resistance
                        </div>

                        <StatDots
                            value={
                                familiar.resistance
                            }
                            max={
                                rankRules.traitCap
                            }
                            onChange={(
                                value
                            ) =>
                                update({
                                    resistance:
                                        value,
                                })
                            }
                            color="violet"
                            size="small"
                            testIdPrefix="familiar-resistance"
                        />
                    </div>
                </div>
            </div>

            {/* Derived Traits */}
                <div className="grid grid-cols-4 gap-3">

                    {/* Size */}
                    <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                            Size
                        </div>

                        <Input
                            type="number"
                            min={0}
                            max={20}
                            value={familiar.size ?? 0}
                            onChange={(event) =>
                                update({
                                    size: Math.max(
                                        0,
                                        Number(event.target.value) || 0
                                    ),
                                })
                            }
                            className="input-geist h-8 text-sm"
                        />

                        <div className="h-4 mt-1 text-[9px] text-zinc-700">
                            &nbsp;
                        </div>
                    </div>

                    {/* Defense */}
                    <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                            Defense
                        </div>

                        <div className="h-8 flex items-center px-3 rounded-md border border-zinc-800 bg-zinc-950/50 text-sm font-mono text-indigo-300">
                            {defense}
                        </div>

                        <div className="h-4 mt-1 text-[9px] text-zinc-600 whitespace-nowrap">
                            (
                            {familiar.entity_type === "Spirit" && rank === 1
                                ? "Higher Pwr / Fin"
                                : "Lower Pwr / Fin"}
                            )
                        </div>
                    </div>

                    {/* Initiative */}
                    <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                            Initiative
                        </div>

                        <div className="h-8 flex items-center px-3 rounded-md border border-zinc-800 bg-zinc-950/50 text-sm font-mono text-indigo-300">
                            {initiative}
                        </div>

                        <div className="h-4 mt-1 text-[9px] text-zinc-600">
                            (Fin + Res)
                        </div>
                    </div>

                    {/* Speed */}
                    <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                            Speed
                        </div>

                        <div className="h-8 flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-950/50 px-2">
                            <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                                {power} + {finesse} +
                            </span>

                            <Input
                                type="number"
                                min={0}
                                max={20}
                                value={familiar.speed_factor ?? 0}
                                onChange={(event) =>
                                    update({
                                        speed_factor: Math.max(
                                            0,
                                            Number(event.target.value) || 0
                                        ),
                                    })
                                }
                                className="h-6 w-10 min-w-10 px-1 text-center text-xs bg-zinc-900 border-zinc-700"
                            />

                            <span className="text-zinc-600">
                                =
                            </span>

                            <span className="font-mono text-sm text-indigo-300">
                                {speed}
                            </span>
                        </div>

                        <div className="h-4 mt-1 text-[9px] text-zinc-600">
                            Pwr + Fin + Factor
                        </div>
                    </div>

                </div>

            {/* Resources */}
            <div className="grid grid-cols-3 gap-3">
                {/* Corpus */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                            Corpus (Size + Res)
                        </span>

                        <span className="text-[10px] font-mono text-violet-300">
                            {corpusCurrent} / {corpusMax}
                        </span>
                    </div>

                    <ResourceTrack
                        current={corpusCurrent}
                        max={corpusMax}
                        onChange={(value) =>
                            update({
                                corpus: value,
                            })
                        }
                        color="violet"
                        testIdPrefix="familiar-corpus"
                    />
                </div>

                {/* Willpower */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                            Willpower (Fin + Res)
                        </span>

                        <span className="text-[10px] font-mono text-amber-300">
                            {willpowerCurrent} / {willpowerMax}
                        </span>
                    </div>

                    <ResourceTrack
                        current={willpowerCurrent}
                        max={willpowerMax}
                        onChange={(value) =>
                            update({
                                willpower: value,
                            })
                        }
                        color="amber"
                        testIdPrefix="familiar-willpower"
                    />
                </div>

                {/* Essence */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                            Essence
                        </span>

                        <span className="text-[10px] font-mono text-teal-300">
                            {essenceCurrent} / {essenceMax}
                        </span>
                    </div>

                    <ResourceTrack
                        current={essenceCurrent}
                        max={essenceMax}
                        onChange={(value) =>
                            update({
                                essence: value,
                            })
                        }
                        color="teal"
                        testIdPrefix="familiar-essence"
                    />
                </div>
            </div>

            <div className="rounded-sm border border-indigo-800/40 bg-indigo-950/10 p-2 text-[10px] text-indigo-300">
                Familiar and Twilight Form Manifestations are intrinsic to this entity.
            </div>

            {/* Influences, Manifestations and Numina */}
                <div className="rounded-sm border border-zinc-800 bg-zinc-950/30 p-3 space-y-4">

                    <div className="text-[10px] uppercase tracking-wider text-indigo-300">
                        Influences, Manifestations and Numina
                    </div>

                    {/* Influences */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                Influences
                            </label>

                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-5 px-1.5 text-[10px] text-zinc-400"
                                onClick={addInfluence}
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Add
                            </Button>
                        </div>

                        {influences.length === 0 ? (
                            <div className="text-[10px] italic text-zinc-600">
                                None recorded
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {influences.map(
                                    (influence, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 p-2 rounded-sm border border-zinc-800 bg-zinc-950/40"
                                        >
                                            <div className="shrink-0">
                                                <StatDots
                                                    value={
                                                        influence.dots
                                                    }
                                                    max={5}
                                                    onChange={(dots) =>
                                                        updateInfluence(
                                                            index,
                                                            {
                                                                dots,
                                                            }
                                                        )
                                                    }
                                                    color="violet"
                                                    size="small"
                                                    testIdPrefix={`familiar-influence-${index}`}
                                                />
                                            </div>

                                            <Input
                                                value={
                                                    influence.name
                                                }
                                                onChange={(event) =>
                                                    updateInfluence(
                                                        index,
                                                        {
                                                            name:
                                                                event.target.value,
                                                        }
                                                    )
                                                }
                                                placeholder="e.g. Dogs"
                                                className="input-geist h-7 text-xs flex-1"
                                            />

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="h-7 px-2 text-[10px] bg-violet-950/30 border-violet-700/50 text-violet-300"
                                                onClick={() =>
                                                    openInfluenceRoll(
                                                        index
                                                    )
                                                }
                                                disabled={
                                                    !influence.name.trim()
                                                }
                                            >
                                                <Dices className="w-3 h-3 mr-1" />
                                                Roll
                                            </Button>

                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-zinc-500 hover:text-red-400"
                                                onClick={() =>
                                                    removeInfluence(
                                                        index
                                                    )
                                                }
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Manifestations */}
                    <div className="space-y-2 border-t border-zinc-800 pt-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                Manifestations
                            </label>

                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-5 px-1.5 text-[10px] text-zinc-400"
                                onClick={addManifestation}
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Add
                            </Button>
                        </div>

                        {manifestations.length === 0 ? (
                            <div className="text-[10px] italic text-zinc-600">
                                None recorded
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {/* Column headings */}
                                <div className="grid grid-cols-[minmax(0,1fr)_72px_minmax(120px,0.55fr)_88px_28px] gap-2 px-1 items-end">
                                    <div className="text-[9px] uppercase tracking-wider text-zinc-600">
                                        Manifestation
                                    </div>

                                    <div className="text-[9px] uppercase tracking-wider text-zinc-600">
                                        Cost
                                    </div>

                                    <div className="text-[9px] uppercase tracking-wider text-zinc-600">
                                        Condition
                                    </div>

                                    <div className="text-[9px] uppercase tracking-wider text-zinc-600">
                                        Roll
                                    </div>

                                    <div />
                                </div>

                                {manifestations.map(
                                    (
                                        manifestation,
                                        index
                                    ) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-[minmax(0,1fr)_72px_minmax(120px,0.55fr)_88px_28px] gap-2 items-center"
                                        >
                                            {/* Name */}
                                            <Input
                                                value={
                                                    manifestation.name
                                                }
                                                onChange={(event) =>
                                                    updateManifestation(
                                                        index,
                                                        {
                                                            name:
                                                                event.target.value,
                                                        }
                                                    )
                                                }
                                                placeholder="Manifestation"
                                                className="input-geist h-7 text-xs"
                                            />

                                            {/* Essence Cost */}
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={20}
                                                    value={
                                                        manifestation.essence_cost
                                                    }
                                                    onChange={(event) =>
                                                        updateManifestation(
                                                            index,
                                                            {
                                                                essence_cost:
                                                                    Math.max(
                                                                        0,
                                                                        Number(
                                                                            event.target.value
                                                                        ) || 0
                                                                    ),
                                                            }
                                                        )
                                                    }
                                                    className="input-geist h-7 text-xs pr-5"
                                                />

                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 pointer-events-none">
                                                    E
                                                </span>
                                            </div>

                                            {/* Required Condition */}
                                            <Input
                                                value={
                                                    manifestation.required_condition
                                                }
                                                onChange={(event) =>
                                                    updateManifestation(
                                                        index,
                                                        {
                                                            required_condition:
                                                                event.target.value,
                                                        }
                                                    )
                                                }
                                                placeholder="Condition"
                                                className="input-geist h-7 text-xs"
                                            />

                                            {/* Roll */}
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="h-7 px-2 text-[10px] bg-violet-950/30 border-violet-700/50 text-violet-300"
                                                onClick={() =>
                                                    rollManifestation(
                                                        manifestation
                                                    )
                                                }
                                                disabled={
                                                    !manifestation.name.trim() ||
                                                    essenceCurrent <
                                                        manifestation.essence_cost
                                                }
                                            >
                                                <Dices className="w-3 h-3 mr-1" />
                                                Roll
                                            </Button>

                                            {/* Delete */}
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-zinc-500 hover:text-red-400"
                                                onClick={() =>
                                                    removeManifestation(
                                                        index
                                                    )
                                                }
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Numina */}
                    <div className="space-y-2 border-t border-zinc-800 pt-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                Numina
                            </label>

                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-5 px-1.5 text-[10px] text-zinc-400"
                                onClick={addNumen}
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Add
                            </Button>
                        </div>

                        {numina.length === 0 ? (
                            <div className="text-[10px] italic text-zinc-600">
                                None recorded
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {/* Column headings */}
                                <div className="grid grid-cols-[minmax(0,1fr)_72px_80px_88px_28px] gap-2 px-1 items-end">
                                    <div className="text-[9px] uppercase tracking-wider text-zinc-600">
                                        Numen
                                    </div>

                                    <div className="text-[9px] uppercase tracking-wider text-zinc-600">
                                        Cost
                                    </div>

                                    <div className="text-[9px] uppercase tracking-wider text-zinc-600">
                                        Reach?
                                    </div>

                                    <div className="text-[9px] uppercase tracking-wider text-zinc-600">
                                        Roll
                                    </div>

                                    <div />
                                </div>

                                {numina.map(
                                    (numen, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-[minmax(0,1fr)_72px_80px_88px_28px] gap-2 items-center"
                                        >
                                            {/* Name */}
                                            <Input
                                                value={
                                                    numen.name
                                                }
                                                onChange={(event) =>
                                                    updateNumen(
                                                        index,
                                                        {
                                                            name:
                                                                event.target.value,
                                                        }
                                                    )
                                                }
                                                placeholder="Numen"
                                                className="input-geist h-7 text-xs"
                                            />

                                            {/* Essence Cost */}
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={20}
                                                    value={
                                                        numen.essence_cost
                                                    }
                                                    onChange={(event) =>
                                                        updateNumen(
                                                            index,
                                                            {
                                                                essence_cost:
                                                                    Math.max(
                                                                        0,
                                                                        Number(
                                                                            event.target.value
                                                                        ) || 0
                                                                    ),
                                                            }
                                                        )
                                                    }
                                                    className="input-geist h-7 text-xs pr-5"
                                                />

                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 pointer-events-none">
                                                    E
                                                </span>
                                            </div>

                                            {/* Reach Across Gauntlet */}
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className={`h-7 px-2 text-[10px] ${
                                                    numen.can_reach_across_gauntlet
                                                        ? "bg-emerald-950/30 border-emerald-700/50 text-emerald-300"
                                                        : "bg-zinc-950/40 border-zinc-800 text-zinc-500"
                                                }`}
                                                onClick={() =>
                                                    updateNumen(
                                                        index,
                                                        {
                                                            can_reach_across_gauntlet:
                                                                !numen.can_reach_across_gauntlet,
                                                        }
                                                    )
                                                }
                                            >
                                                {numen.can_reach_across_gauntlet
                                                    ? "Yes"
                                                    : "No"}
                                            </Button>

                                            {/* Roll */}
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="h-7 px-2 text-[10px] bg-violet-950/30 border-violet-700/50 text-violet-300"
                                                onClick={() =>
                                                    rollNumen(
                                                        numen
                                                    )
                                                }
                                                disabled={
                                                    !numen.name.trim() ||
                                                    essenceCurrent <
                                                        numen.essence_cost
                                                }
                                            >
                                                <Dices className="w-3 h-3 mr-1" />
                                                Roll
                                            </Button>

                                            {/* Delete */}
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-zinc-500 hover:text-red-400"
                                                onClick={() =>
                                                    removeNumen(
                                                        index
                                                    )
                                                }
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Ban
                    </label>

                    <Textarea
                        value={familiar.ban}
                        onChange={(event) =>
                            update({
                                ban:
                                    event.target
                                        .value,
                            })
                        }
                        className="mt-0.5 min-h-[70px] bg-zinc-950/50 border-zinc-800 text-xs"
                    />
                </div>

                <div>
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Bane
                    </label>

                    <Textarea
                        value={familiar.bane}
                        onChange={(event) =>
                            update({
                                bane:
                                    event.target
                                        .value,
                            })
                        }
                        className="mt-0.5 min-h-[70px] bg-zinc-950/50 border-zinc-800 text-xs"
                    />
                </div>
            </div>

            <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Description
                </label>

                <Textarea
                    value={
                        familiar.description
                    }
                    onChange={(event) =>
                        update({
                            description:
                                event.target
                                    .value,
                        })
                    }
                    placeholder="Appearance, personality, nature..."
                    className="mt-0.5 min-h-[80px] bg-zinc-950/50 border-zinc-800 text-xs"
                />
            </div>

            <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Notes
                </label>

                <Textarea
                    value={familiar.notes}
                    onChange={(event) =>
                        update({
                            notes:
                                event.target
                                    .value,
                        })
                    }
                    placeholder="Additional rules, history, relationships..."
                    className="mt-0.5 min-h-[80px] bg-zinc-950/50 border-zinc-800 text-xs"
                />
            </div>

            <Dialog
                open={influenceDialogOpen}
                onOpenChange={setInfluenceDialogOpen}
            >
                <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-violet-300">
                            Influence —{" "}
                            {activeInfluence?.name ||
                                "Influence"}
                        </DialogTitle>

                        <DialogDescription className="text-zinc-500">
                            Power + Finesse ={" "}
                            {influenceDicePool} dice
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Effect */}
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                Effect
                            </label>

                            <Select
                                value={selectedInfluenceEffect}
                                onValueChange={
                                    setSelectedInfluenceEffect
                                }
                            >
                                <SelectTrigger className="mt-1 bg-zinc-950 border-zinc-800">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    {INFLUENCE_EFFECTS.map(
                                        (effect) => (
                                            <SelectItem
                                                key={effect.name}
                                                value={effect.name}
                                            >
                                                {effect.name} (
                                                {effect.influenceCost}{" "}
                                                dot
                                                {effect.influenceCost !== 1
                                                    ? "s"
                                                    : ""}
                                                )
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                Duration
                            </label>

                            <Select
                                value={selectedInfluenceDuration}
                                onValueChange={
                                    setSelectedInfluenceDuration
                                }
                            >
                                <SelectTrigger className="mt-1 bg-zinc-950 border-zinc-800">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    {INFLUENCE_DURATIONS.map(
                                        (duration) => (
                                            <SelectItem
                                                key={duration.name}
                                                value={duration.name}
                                            >
                                                {duration.name} (+
                                                {duration.influenceCost}{" "}
                                                dots)
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Calculation */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 rounded-sm border border-zinc-800 bg-zinc-950/50">
                                <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                                    Required Influence
                                </div>

                                <div
                                    className={`mt-1 font-mono text-sm ${
                                        influenceRatingValid
                                            ? "text-emerald-300"
                                            : "text-red-400"
                                    }`}
                                >
                                    {requiredInfluenceDots} /{" "}
                                    {influenceRating}
                                </div>
                            </div>

                            <div className="p-2 rounded-sm border border-zinc-800 bg-zinc-950/50">
                                <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                                    Essence Cost
                                </div>

                                <div
                                    className={`mt-1 font-mono text-sm ${
                                        influenceHasEssence
                                            ? "text-teal-300"
                                            : "text-red-400"
                                    }`}
                                >
                                    {influenceEssenceCost}{" "}
                                    Essence
                                </div>
                            </div>
                        </div>

                        <div className="p-2 rounded-sm border border-zinc-800 bg-zinc-950/40 text-xs text-zinc-400">
                            <div>
                                Effect:{" "}
                                {effectConfig.influenceCost}{" "}
                                dots
                            </div>

                            <div>
                                Duration: +
                                {durationConfig.influenceCost}{" "}
                                dots
                            </div>

                            <div className="mt-1 text-zinc-300">
                                Total:{" "}
                                {requiredInfluenceDots}{" "}
                                Influence dots
                            </div>
                        </div>

                        {!influenceRatingValid && (
                            <div className="text-xs text-red-400">
                                This Influence is not
                                powerful enough for that
                                Effect and Duration.
                            </div>
                        )}

                        {!influenceHasEssence && (
                            <div className="text-xs text-red-400">
                                Not enough Essence.
                            </div>
                        )}

                        <Button
                            className="w-full bg-violet-800 hover:bg-violet-700 text-white"
                            disabled={!canUseInfluence}
                            onClick={rollInfluence}
                        >
                            <Dices className="w-4 h-4 mr-2" />
                            Roll {influenceDicePool} Dice
                            {" — "}
                            Spend {influenceEssenceCost} Essence
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            </div>
            );
            };
