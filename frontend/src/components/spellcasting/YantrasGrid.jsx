import { Wrench } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const YantraSingleCheckbox = ({ name, label, bonus, checked, disabled, onToggle }) => (
    <label
        className={`flex items-center gap-2 text-xs cursor-pointer p-1.5 rounded ${
            checked ? "bg-teal-900/20 border border-teal-500/30" : "border border-transparent hover:bg-zinc-800/50"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
        <Checkbox
            checked={checked}
            onCheckedChange={() => !disabled && onToggle(name)}
            disabled={disabled}
            className="border-zinc-600 data-[state=checked]:bg-teal-600 h-3.5 w-3.5"
            data-testid={`yantra-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        />
        <span className="flex-1 text-zinc-300">{label}</span>
        <span className="text-teal-400 font-mono">+{bonus}</span>
    </label>
);

export const YantraRatingPicker = ({
    groupLabel, variants, testIdPrefix, current, isOn, disabled, blockUncheck, onPickVariant, onClear,
}) => (
    <div
        className={`p-1.5 rounded space-y-1 ${
            isOn ? "bg-teal-900/20 border border-teal-500/30" : "border border-transparent hover:bg-zinc-800/50"
        } ${disabled ? "opacity-40" : ""}`}
    >
        <label className="flex items-center gap-2 text-xs cursor-pointer">
            <Checkbox
                checked={isOn}
                onCheckedChange={(checked) => {
                    if (disabled) return;
                    if (!checked) {
                        if (blockUncheck) return;
                        onClear();
                    } else {
                        onPickVariant(variants[0].name);
                    }
                }}
                disabled={disabled}
                className="border-zinc-600 data-[state=checked]:bg-teal-600 h-3.5 w-3.5"
                data-testid={`${testIdPrefix}-toggle`}
            />
            <span className="flex-1 text-zinc-300">{groupLabel}</span>
            {current && (
                <span className="text-teal-400 font-mono">+{current.bonus}</span>
            )}
        </label>
        {isOn && (
            <div className="flex gap-1 pl-6">
                {variants.map((v) => (
                    <button
                        key={v.name}
                        type="button"
                        onClick={() => onPickVariant(v.name)}
                        className={`px-2 py-0.5 rounded border text-[10px] ${
                            current?.name === v.name
                                ? "bg-teal-700 border-teal-500 text-white"
                                : "bg-zinc-900/40 border-zinc-700 text-zinc-400 hover:text-zinc-200"
                        }`}
                        data-testid={`${testIdPrefix}-rating-${v.bonus}`}
                    >
                        {v.shortLabel} +{v.bonus}
                    </button>
                ))}
            </div>
        )}
    </div>
);

const SYMPATHY_VARIANTS = [
    { name: "Sympathy: Symbolic", shortLabel: "Symbolic", bonus: 0 },
    { name: "Sympathy: Representational", shortLabel: "Repr.", bonus: 1 },
    { name: "Sympathy: Material", shortLabel: "Material", bonus: 2 },
];

const SACRAMENT_VARIANTS = [
    { name: "Sacrament: Minor", shortLabel: "Minor", bonus: 1 },
    { name: "Sacrament: Major", shortLabel: "Major", bonus: 2 },
    { name: "Sacrament: Mystic", shortLabel: "Mystic", bonus: 3 },
];

export const YantrasGrid = ({
    yantraCount,
    maxYantras,
    yantraSlotLimit,
    yantraBonus,
    rawYantraBonus,
    yantraBonusWasCapped,
    usesRoteMudra,
    roteMudraBonus,
    selectedNameSet,
    specialRangeMode,
    toggleYantraName,
    setMutuallyExclusiveYantra,
}) => {
    const slotsFull = selectedNameSet.size >= yantraSlotLimit;
    const sympathyCurrent = SYMPATHY_VARIANTS.find((v) => selectedNameSet.has(v.name)) || null;
    const sacramentCurrent = SACRAMENT_VARIANTS.find((v) => selectedNameSet.has(v.name)) || null;

    const renderSingle = (name, label, bonus) => (
        <YantraSingleCheckbox
            key={name}
            name={name}
            label={label}
            bonus={bonus}
            checked={selectedNameSet.has(name)}
            disabled={!selectedNameSet.has(name) && slotsFull}
            onToggle={toggleYantraName}
        />
    );

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500 uppercase flex items-center gap-1">
                    <Wrench className="w-3 h-3" /> Yantras
                </p>
                <span className="text-xs text-zinc-500">
                    {yantraCount}/{maxYantras} used
                    {yantraBonus > 0 && <span className="text-teal-400 ml-1">(+{yantraBonus} dice)</span>}
                </span>
            </div>

            {yantraBonusWasCapped && (
                <p className="text-[11px] text-amber-400">
                    Yantra bonus raw +{rawYantraBonus} is capped at +{yantraBonus}. Cap is +5 after offsetting spell factor penalties.
                </p>
            )}

            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                <div className="space-y-0.5">
                    {renderSingle("High Speech", "High Speech", 2)}
                    <YantraRatingPicker
                        groupLabel="Sacrament"
                        variants={SACRAMENT_VARIANTS}
                        testIdPrefix="yantra-sacrament"
                        current={sacramentCurrent}
                        isOn={!!sacramentCurrent}
                        disabled={!sacramentCurrent && slotsFull}
                        blockUncheck={false}
                        onPickVariant={(name) => setMutuallyExclusiveYantra(SACRAMENT_VARIANTS.map((v) => v.name), name)}
                        onClear={() => setMutuallyExclusiveYantra(SACRAMENT_VARIANTS.map((v) => v.name), null)}
                    />
                    {renderSingle("Concentration", "Concentration", 2)}
                    {renderSingle("Runes", "Runes", 2)}
                    <YantraRatingPicker
                        groupLabel="Sympathy"
                        variants={SYMPATHY_VARIANTS}
                        testIdPrefix="yantra-sympathy"
                        current={sympathyCurrent}
                        isOn={!!sympathyCurrent}
                        disabled={!sympathyCurrent && slotsFull}
                        blockUncheck={specialRangeMode !== "none"}
                        onPickVariant={(name) => setMutuallyExclusiveYantra(SYMPATHY_VARIANTS.map((v) => v.name), name)}
                        onClear={() => setMutuallyExclusiveYantra(SYMPATHY_VARIANTS.map((v) => v.name), null)}
                    />
                    {renderSingle("Persona", "Persona", 2)}
                    {renderSingle("Environment", "Environment", 1)}
                    {renderSingle("Demesne/Verge", "Demesne/Verge", 2)}
                </div>
                <div className="space-y-0.5">
                    {renderSingle("Dedicated Tool", "Dedicated Tool", 1)}
                    {renderSingle("Path Tool: Coin", "Path Tool: Coin", 1)}
                    {renderSingle("Path Tool: Cup", "Path Tool: Cup", 1)}
                    {renderSingle("Path Tool: Mirror", "Path Tool: Mirror", 1)}
                    {renderSingle("Path Tool: Rod", "Path Tool: Rod", 1)}
                    {renderSingle("Path Tool: Weapon", "Path Tool: Weapon", 1)}
                    {renderSingle("Order Tool", "Order Tool", 1)}
                    {usesRoteMudra && (
                        <div
                            className="flex items-center gap-2 text-xs p-1.5"
                            data-testid="yantra-rote-mudra"
                        >
                            <span className="h-3.5 w-3.5 shrink-0" />
                            <span className="flex-1 text-amber-300">Rote Mudra</span>
                            <span className="text-amber-300 font-mono">+{roteMudraBonus}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
