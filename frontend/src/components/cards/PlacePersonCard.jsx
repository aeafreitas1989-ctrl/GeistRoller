import { useState } from "react";
import { X, Info, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PERSON_TYPE_OPTIONS, PERSON_SUBTYPE_OPTIONS, PERSON_SUBTYPE_STYLES, SUPERNATURAL_SUBTYPE_STYLES, EPHEMERAL_SUBTYPE_STYLES, PLACE_STATUS_OPTIONS, PLACE_STATUS_STYLES, PERSON_STATUS_OPTIONS, PERSON_STATUS_STYLES, PERSON_RELATIONSHIP_OPTIONS, PERSON_RELATIONSHIP_STYLES } from "../../data/cards-data";

export const PlacePersonCard = ({
    entry,
    onUpdate,
    onDelete,
}) => {
    const entryId =
        entry.id ||
        entry.name ||
        "entry";

    const isPerson =
        entry.type === "person";

    const isAnimal =
        entry.type === "animal";

    const [isEditing, setIsEditing] =
        useState(false);

    const [isExpanded, setIsExpanded] =
        useState(false);

    const [editData, setEditData] =
        useState({
            name:
                entry.name || "",
            type:
                entry.type || "place",
            description:
                entry.description || "",
            status:
                entry.status || "",
            relationship:
                entry.relationship || "",
            person_type:
                entry.person_type ||
                "Mundane",
            person_subtype:
                entry.person_subtype ||
                "Aware",
            species:
                entry.species || "",
        });

    const typeLabel =
        isPerson
            ? "Person"
            : isAnimal
            ? "Animal"
            : "Place";

    const badgeClasses =
        isPerson
            ? "bg-indigo-900/40 border-indigo-500/40 text-indigo-300"
            : isAnimal
            ? "bg-emerald-900/40 border-emerald-500/40 text-emerald-300"
            : "bg-amber-900/40 border-amber-500/40 text-amber-300";

    const handleSave = () => {
        const isNpc =
            editData.type === "person" ||
            editData.type === "animal";

        onUpdate({
            name:
                editData.name.trim(),

            type:
                editData.type,

            description:
                editData.description.trim(),

            status:
                editData.status.trim(),

            relationship:
                isNpc
                    ? editData.relationship.trim()
                    : "",

            person_type:
                editData.type === "person"
                    ? editData.person_type
                    : "",

            person_subtype:
                editData.type === "person"
                    ? editData.person_subtype
                    : "",

            species:
                editData.type === "animal"
                    ? editData.species.trim()
                    : "",
        });

        setIsEditing(false);
    };

    return (
        <div
            className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-3"
            data-testid={`place-person-card-${entryId
                .toString()
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
        >
            {isEditing ? (
                <div className="space-y-2">

                    {/* Entry Type */}
                    <Select
                        value={editData.type}
                        onValueChange={(value) =>
                            setEditData({
                                ...editData,
                                type: value,
                            })
                        }
                    >
                        <SelectTrigger
                            className="bg-zinc-900/50 border-zinc-800 h-7 text-xs"
                            data-testid={`place-person-${entryId}-type-select`}
                        >
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>

                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem
                                value="place"
                                className="text-zinc-200"
                            >
                                Place
                            </SelectItem>

                            <SelectItem
                                value="person"
                                className="text-zinc-200"
                            >
                                Person
                            </SelectItem>

                            <SelectItem
                                value="animal"
                                className="text-zinc-200"
                            >
                                Animal
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Name */}
                    <Input
                        value={editData.name}
                        onChange={(event) =>
                            setEditData({
                                ...editData,
                                name:
                                    event.target.value,
                            })
                        }
                        placeholder="Name"
                        className="input-geist h-7 text-xs"
                    />

                    {/* Person Type / Subtype */}
                    {editData.type ===
                        "person" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                    Type
                                </label>

                                <Select
                                    value={
                                        editData.person_type
                                    }
                                    onValueChange={(
                                        value
                                    ) =>
                                        setEditData({
                                            ...editData,
                                            person_type:
                                                value,
                                            person_subtype:
                                                PERSON_SUBTYPE_OPTIONS[
                                                    value
                                                ]?.[0] ||
                                                "",
                                        })
                                    }
                                >
                                    <SelectTrigger
                                        className="bg-zinc-900/50 border-zinc-800 h-7 text-xs"
                                        data-testid={`place-person-${entryId}-person-type-select`}
                                    >
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>

                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {PERSON_TYPE_OPTIONS.map(
                                            (
                                                option
                                            ) => (
                                                <SelectItem
                                                    key={
                                                        option
                                                    }
                                                    value={
                                                        option
                                                    }
                                                    className="text-zinc-200"
                                                >
                                                    {
                                                        option
                                                    }
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                    Subtype
                                </label>

                                <Select
                                    value={
                                        editData.person_subtype
                                    }
                                    onValueChange={(
                                        value
                                    ) =>
                                        setEditData({
                                            ...editData,
                                            person_subtype:
                                                value,
                                        })
                                    }
                                >
                                    <SelectTrigger
                                        className="bg-zinc-900/50 border-zinc-800 h-7 text-xs"
                                        data-testid={`place-person-${entryId}-person-subtype-select`}
                                    >
                                        <SelectValue placeholder="Subtype" />
                                    </SelectTrigger>

                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        {(
                                            PERSON_SUBTYPE_OPTIONS[
                                                editData
                                                    .person_type
                                            ] || []
                                        ).map(
                                            (
                                                option
                                            ) => (
                                                <SelectItem
                                                    key={
                                                        option
                                                    }
                                                    value={
                                                        option
                                                    }
                                                    className="text-zinc-200"
                                                >
                                                    {
                                                        option
                                                    }
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Animal Species */}
                    {editData.type ===
                        "animal" && (
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                Species
                            </label>

                            <Input
                                value={
                                    editData.species
                                }
                                onChange={(event) =>
                                    setEditData({
                                        ...editData,
                                        species:
                                            event.target
                                                .value,
                                    })
                                }
                                placeholder="e.g., Dog, Cat, Horse"
                                className="input-geist h-7 text-xs mt-0.5"
                                data-testid={`place-person-${entryId}-species-input`}
                            />
                        </div>
                    )}

                    {/* Description */}
                    <Textarea
                        value={
                            editData.description
                        }
                        onChange={(event) =>
                            setEditData({
                                ...editData,
                                description:
                                    event.target.value,
                            })
                        }
                        placeholder="Description"
                        className="input-geist min-h-[50px] text-xs"
                        data-testid={`place-person-${entryId}-description-input`}
                    />

                    {/* Status */}
                    <Select
                        value={
                            editData.status
                        }
                        onValueChange={(value) =>
                            setEditData({
                                ...editData,
                                status: value,
                            })
                        }
                    >
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>

                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {(
                                editData.type ===
                                "place"
                                    ? PLACE_STATUS_OPTIONS
                                    : PERSON_STATUS_OPTIONS
                            ).map(
                                (option) => (
                                    <SelectItem
                                        key={
                                            option
                                        }
                                        value={
                                            option
                                        }
                                        className="text-zinc-200"
                                    >
                                        {
                                            option
                                        }
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    {/* Relationship — Persons and Animals only */}
                    {editData.type !==
                        "place" && (
                        <Select
                            value={
                                editData.relationship
                            }
                            onValueChange={(
                                value
                            ) =>
                                setEditData({
                                    ...editData,
                                    relationship:
                                        value,
                                })
                            }
                        >
                            <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-7 text-xs">
                                <SelectValue placeholder="Relationship" />
                            </SelectTrigger>

                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {PERSON_RELATIONSHIP_OPTIONS.map(
                                    (
                                        option
                                    ) => (
                                        <SelectItem
                                            key={
                                                option
                                            }
                                            value={
                                                option
                                            }
                                            className="text-zinc-200"
                                        >
                                            {
                                                option
                                            }
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    )}

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={
                                handleSave
                            }
                            className="btn-primary text-xs h-6 flex-1"
                            data-testid={`place-person-${entryId}-save`}
                        >
                            Save
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                                setIsEditing(
                                    false
                                )
                            }
                            className="text-xs h-6"
                            data-testid={`place-person-${entryId}-cancel`}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="flex items-start justify-between">

                        <div className="flex-1">

                            {/* Type + Name */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded border ${badgeClasses}`}
                                >
                                    {
                                        typeLabel
                                    }
                                </span>

                                <h4
                                    className="text-sm text-zinc-100 font-heading"
                                    data-testid={`place-person-${entryId}-name`}
                                >
                                    {
                                        entry.name
                                    }
                                </h4>
                            </div>

                            {/* Secondary tags */}
                            <div className="flex items-center gap-2 flex-wrap mt-1">

                                {/* Person subtype */}
                                {entry.type ===
                                    "person" &&
                                    entry.person_subtype && (
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                                entry.person_type ===
                                                "Mundane"
                                                    ? PERSON_SUBTYPE_STYLES[
                                                          entry
                                                              .person_subtype
                                                      ] ||
                                                      "bg-zinc-800/60 border-zinc-600/40 text-zinc-200"
                                                    : entry.person_type ===
                                                      "Supernatural"
                                                    ? SUPERNATURAL_SUBTYPE_STYLES[
                                                          entry
                                                              .person_subtype
                                                      ] ||
                                                      "bg-zinc-800/60 border-zinc-600/40 text-zinc-200"
                                                    : entry.person_type ===
                                                      "Ephemeral"
                                                    ? EPHEMERAL_SUBTYPE_STYLES[
                                                          entry
                                                              .person_subtype
                                                      ] ||
                                                      "bg-zinc-800/60 border-zinc-600/40 text-zinc-200"
                                                    : "bg-zinc-800/60 border-zinc-600/40 text-zinc-200"
                                            }`}
                                            data-testid={`place-person-${entryId}-person-subtype`}
                                        >
                                            {
                                                entry.person_subtype
                                            }
                                        </span>
                                    )}

                                {/* Animal species */}
                                {entry.type ===
                                    "animal" &&
                                    entry.species && (
                                        <span
                                            className="text-[10px] px-1.5 py-0.5 rounded border bg-emerald-950/40 border-emerald-700/40 text-emerald-300"
                                            data-testid={`place-person-${entryId}-species`}
                                        >
                                            {
                                                entry.species
                                            }
                                        </span>
                                    )}

                                {/* Status */}
                                {entry.status && (
                                    <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                            entry.type ===
                                            "place"
                                                ? PLACE_STATUS_STYLES[
                                                      entry
                                                          .status
                                                  ] ||
                                                  "bg-zinc-900/60 border-zinc-700/40 text-zinc-300"
                                                : PERSON_STATUS_STYLES[
                                                      entry
                                                          .status
                                                  ] ||
                                                  "bg-zinc-900/60 border-zinc-700/40 text-zinc-300"
                                        }`}
                                        data-testid={`place-person-${entryId}-status`}
                                    >
                                        {
                                            entry.status
                                        }
                                    </span>
                                )}

                                {/* Person / Animal relationship */}
                                {entry.type !==
                                    "place" &&
                                    entry.relationship && (
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                                PERSON_RELATIONSHIP_STYLES[
                                                    entry
                                                        .relationship
                                                ] ||
                                                "bg-zinc-800/60 border-zinc-600/40 text-zinc-200"
                                            }`}
                                            data-testid={`place-person-${entryId}-relationship`}
                                        >
                                            {
                                                entry.relationship
                                            }
                                        </span>
                                    )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-1 ml-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                    setIsExpanded(
                                        (
                                            previous
                                        ) =>
                                            !previous
                                    )
                                }
                                className="h-6 w-6 text-zinc-500 hover:text-amber-400"
                                data-testid={`place-person-${entryId}-edit`}
                            >
                                <Info className="w-3 h-3" />
                            </Button>

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                    setIsEditing(
                                        true
                                    )
                                }
                                className="h-6 w-6 text-zinc-500 hover:text-cyan-400"
                                data-testid={`place-person-${entryId}-edit-mode`}
                            >
                                <Pencil className="w-3 h-3" />
                            </Button>

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={
                                    onDelete
                                }
                                className="h-6 w-6 text-zinc-500 hover:text-red-400"
                                data-testid={`place-person-${entryId}-delete`}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    {isExpanded &&
                        entry.description && (
                            <p
                                className="text-xs text-zinc-400"
                                data-testid={`place-person-${entryId}-description`}
                            >
                                {
                                    entry.description
                                }
                            </p>
                        )}
                </div>
            )}
        </div>
    );
};
