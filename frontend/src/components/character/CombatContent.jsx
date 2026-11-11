import {
    Plus, Trash2, Pencil, Star, Package, Sword, Shield, Sparkles, ChevronDown,
    Coins, Wine, MirrorRound, WandSparkles, Flame,
    ArrowUpRight, VenetianMask, BookOpen, Crown, Cog, Eye,
    Crosshair, Search, Fingerprint, Camera, Cctv, Mic, Binoculars, ScanEye,
    FlaskConical, Flashlight, MapPin, Laptop, Smartphone, Radio, Headphones,
    HardDrive, Usb, Code, FileKey, Monitor, Satellite, Wrench, Hammer, Drill,
    KeyRound, LockKeyhole, Scissors, PocketKnife, Cable, Lasso, Construction,
    BriefcaseMedical, Pill, Stethoscope, Backpack, Tent, Compass, Map, Glasses,
    Shirt, Biohazard, Wallet, BookMarked, ScrollText, Gem, Skull, FlaskRound,
} from "lucide-react";
import * as GameIcons from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    ARCANA, MAGE_ARMOR_EFFECTS,
    AVAILABILITY_OPTIONS, WEAPON_SPECIAL_OPTIONS, ARMOR_COVERAGE_OPTIONS,
    PREMADE_ARMOR, PREMADE_EQUIPMENT,
} from "../../data/character-data";
import { useState } from "react";
import { HealthTrack, getHealthCounts, buildHealthBoxes, formatLabel } from "./StatComponents";
// Game-icons.net illustrations are distributed via react-icons/gi (CC BY 3.0).
const GAME_ICON_NAMES = Object.keys(GameIcons).filter((id) => /^Gi[A-Z]/.test(id));
const gameIconLabel = (id) => String(id || "").replace(/^Gi/, "").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
const GAME_ICON_LIST = GAME_ICON_NAMES.map((id) => ({
    id, label: gameIconLabel(id), search: gameIconLabel(id).toLowerCase(),
}));
const GAME_ICON_FEATURES = [
    { title: "Investigation & Surveillance", words: ["Magnifying Glass", "Fingerprint", "Camera", "Cctv Camera", "Binoculars", "Spyglass", "Flashlight", "Microscope"] },
    { title: "Computers & Communications", words: ["Laptop", "Smartphone", "Walkie Talkie", "Radio Tower", "Headphones", "Computer", "Microchip", "Satellite"] },
    { title: "Tools & Access", words: ["Wrench", "Hammer", "Screwdriver", "Key", "Padlock", "Scissors", "Rope", "Crowbar"] },
    { title: "Medicine & Survival", words: ["First Aid Kit", "Pill", "Stethoscope", "Backpack", "Camping Tent", "Compass", "Gas Mask", "Biohazard"] },
    { title: "Documents & Occult", words: ["Coins", "Wallet", "Open Book", "Scroll Quill", "Gem Pendant", "Skull", "Potion Ball", "Crystal Ball"] },
];
const findGameIconId = (term) => {
    if (!term) return "";
    const q = String(term).toLowerCase().replace(/[^a-z0-9]/g, "");
    return GAME_ICON_LIST.find((icon) => icon.search.replace(/[^a-z0-9]/g, "") === q)?.id ||
        GAME_ICON_LIST.find((icon) => icon.search.replace(/[^a-z0-9]/g, "").includes(q))?.id || "";
};
// Prefer the nested equipment icon, the established inventory data field.
// Legacy Lucide icon IDs continue to render without changing saved characters.
// Previously saved top-level Game Icon IDs remain readable.
const getEquipmentIconId = (item) => {
    if (item?.type !== "equipment") return "";
    const stored = item?.equipment?.icon;
    if (stored && GameIcons[stored]) return stored;
    if (item?.icon && GameIcons[item.icon]) return item.icon;
    if (stored && EQUIPMENT_ICON_LOOKUP[stored]) return "";
    return findGameIconId(item?.name);
};

const GameIconPicker = ({ value, onChange, itemName = "", testId }) => {
    const [query, setQuery] = useState("");
    const [expanded, setExpanded] = useState(false);
    const isLegacy = !!(value && EQUIPMENT_ICON_LOOKUP[value]);
    const chosenId = value && GameIcons[value] ? value : isLegacy ? "" : findGameIconId(itemName);
    const Chosen = isLegacy ? EQUIPMENT_ICON_LOOKUP[value].Icon : chosenId ? GameIcons[chosenId] : Package;
    const label = isLegacy ? EQUIPMENT_ICON_LOOKUP[value].label : chosenId ? gameIconLabel(chosenId) : "Default icon";
    const normalized = query.trim().toLowerCase();
    const shown = normalized
        ? GAME_ICON_LIST.filter((icon) => icon.search.includes(normalized) || icon.id.toLowerCase().includes(normalized)).slice(0, 60)
        : GAME_ICON_FEATURES.flatMap((group) => group.words.map((word) => {
            const id = findGameIconId(word);
            return id ? { id, label: word, search: word.toLowerCase() } : null;
        }).filter(Boolean)).filter((icon, index, all) => all.findIndex((i) => i.id === icon.id) === index);
    return (
        <div className="space-y-2" data-testid={testId || "game-icon-picker"}>
            <div className="flex items-center gap-2">
                <Chosen className="h-5 w-5 text-amber-200/80" />
                <span className="min-w-0 flex-1 truncate text-xs text-zinc-400">{label}{isLegacy ? " (existing icon)" : ""}</span>
                <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => setExpanded((open) => !open)}>
                    {expanded ? "Close icons" : "Choose icon"}
                </Button>
                {value && <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onChange("")}>Reset</Button>}
            </div>
            {expanded && (
                <div className="rounded-md border border-zinc-700 bg-zinc-950/80 p-2 space-y-2">
                    <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all Game Icons..." className="h-7 input-geist text-xs" data-testid="game-icon-search" />
                    {!normalized && <p className="text-[10px] text-zinc-500">Suggestions by category: {GAME_ICON_FEATURES.map((g) => g.title).join(" / ")}. Search for more.</p>}
                    <div className="max-h-52 overflow-y-auto grid grid-cols-6 sm:grid-cols-8 gap-1">
                        {shown.map(({ id, label: iconLabel }) => {
                            const Icon = GameIcons[id];
                            return (
                                <button key={id} type="button" title={iconLabel} aria-label={iconLabel}
                                    className={`flex items-center justify-center rounded border p-2 hover:bg-zinc-800 ${chosenId === id ? "border-teal-400" : "border-zinc-800"}`}
                                    onClick={() => { onChange(id); setExpanded(false); }}>
                                    <Icon className="h-5 w-5 text-amber-200/80" />
                                </button>
                            );
                        })}
                    </div>
                    {shown.length === 0 && <p className="text-xs text-zinc-500">No matching icons.</p>}
                </div>
            )}
        </div>
    );
};
const INVENTORY_TYPE_ORDER = {
    armor: 0,
    equipment: 1,
    weapon: 2,
    yantra: 3,
};

const YANTRA_TOOL_ORDER = {
    dedicated: 0,
    coin: 1,
    cup: 2,
    mirror: 3,
    rod: 4,
    weapon: 5,
    order: 6,
};

const YANTRA_PATH_CARD_CLASSES = {
    Acanthus:
        "bg-slate-800/25 border-slate-500/30",

    Mastigos:
        "bg-violet-950/30 border-violet-500/30",

    Moros:
        "bg-zinc-800/35 border-zinc-500/30",

    Obrimos:
        "bg-amber-950/25 border-amber-500/30",

    Thyrsus:
        "bg-emerald-950/25 border-emerald-500/30",
};

const DEFAULT_YANTRA_CARD_CLASS =
    "bg-sky-950/20 border-sky-500/25";

const getYantraDisplayType = (item) => {
    if (
        item?.yantra?.dedicated === true ||
        normalizeInventoryText(
            item?.yantra?.tool_type
        ) === "dedicated"
    ) {
        return "Dedicated";
    }

    if (
        normalizeInventoryText(
            item?.yantra?.kind
        ) === "sacrament"
    ) {
        return "Sacrament";
    }

    return (
        item?.yantra?.tool_type ||
        "Coin"
    );
};

const normalizeInventoryText = (value) =>
    String(value || "").trim().toLowerCase();

const ORDER_YANTRA_ICONS = {
    "adamantine arrow": ArrowUpRight,
    "guardians of the veil": VenetianMask,
    mysterium: BookOpen,
    "silver ladder": Crown,
    "free council": Cog,
    "seers of the throne": Eye,
};

const YANTRA_TOOL_ICONS = {
    coin: Coins,
    cup: Wine,
    mirror: MirrorRound,
    rod: WandSparkles,
    weapon: Sword,
};

const EQUIPMENT_ICON_GROUPS = [
    {
        label: "Investigation & Surveillance",
        icons: [
            ["search", "Magnifier", Search],
            ["fingerprint", "Forensics", Fingerprint],
            ["camera", "Camera", Camera],
            ["cctv", "Surveillance", Cctv],
            ["mic", "Recorder", Mic],
            ["binoculars", "Binoculars", Binoculars],
            ["scan-eye", "Night Vision", ScanEye],
            ["flask-conical", "Chemicals", FlaskConical],
            ["flashlight", "Flashlight", Flashlight],
            ["map-pin", "GPS Tracker", MapPin],
        ],
    },
    {
        label: "Computers & Communication",
        icons: [
            ["laptop", "Computer", Laptop],
            ["smartphone", "Phone", Smartphone],
            ["radio", "Radio", Radio],
            ["headphones", "Headset", Headphones],
            ["hard-drive", "Storage", HardDrive],
            ["usb", "USB Drive", Usb],
            ["code", "Code Kit", Code],
            ["file-key", "Secure Files", FileKey],
            ["monitor", "Monitor", Monitor],
            ["satellite", "Comms", Satellite],
        ],
    },
    {
        label: "Tools & Access",
        icons: [
            ["wrench", "Toolkit", Wrench],
            ["hammer", "Hammer", Hammer],
            ["drill", "Drill", Drill],
            ["key-round", "Key", KeyRound],
            ["lock-keyhole", "Lock", LockKeyhole],
            ["scissors", "Scissors", Scissors],
            ["pocket-knife", "Multitool", PocketKnife],
            ["cable", "Cables", Cable],
            ["lasso", "Rope", Lasso],
            ["construction", "Heavy Tools", Construction],
        ],
    },
    {
        label: "Medical, Survival & Clothing",
        icons: [
            ["briefcase-medical", "First Aid", BriefcaseMedical],
            ["pill", "Medication", Pill],
            ["stethoscope", "Medical Kit", Stethoscope],
            ["backpack", "Backpack", Backpack],
            ["tent", "Tent", Tent],
            ["compass", "Compass", Compass],
            ["map", "Map", Map],
            ["glasses", "Goggles", Glasses],
            ["shirt", "Clothing", Shirt],
            ["biohazard", "Hazard Gear", Biohazard],
        ],
    },
    {
        label: "Money, Records & Magical Objects",
        icons: [
            ["coins", "Cash", Coins],
            ["wallet", "Wallet", Wallet],
            ["venetian-mask", "Disguise", VenetianMask],
            ["book-open", "Book", BookOpen],
            ["book-marked", "Grimoire", BookMarked],
            ["scroll-text", "Manuscript", ScrollText],
            ["gem", "Artifact", Gem],
            ["skull", "Relic", Skull],
            ["flask-round", "Potion", FlaskRound],
            ["sparkles", "Enchanted Item", Sparkles],
        ],
    },
];

const EQUIPMENT_ICON_LOOKUP = Object.fromEntries(
    EQUIPMENT_ICON_GROUPS.flatMap((group) =>
        group.icons.map(([id, label, Icon]) => [id, { label, Icon }])
    )
);

// Defaults for the 65 CofD premade entries, including their rating/Availability variants.
// A user's selected icon takes priority; preset defaults do not overwrite existing items.
const PREMADE_EQUIPMENT_ICON_RULES = [
    [/^automotive tools/i, "wrench"],
    [/^cache/i, "lock-keyhole"],
    [/^communications headset/i, "headphones"],
    [/^crime scene kit/i, "fingerprint"],
    [/^code kit/i, "code"],
    [/^cracking software/i, "laptop"],
    [/^digital recorder/i, "mic"],
    [/^duct tape/i, "cable"],
    [/^first-aid kit/i, "briefcase-medical"],
    [/^flashlight/i, "flashlight"],
    [/^glowstick/i, "flashlight"],
    [/^gps tracker/i, "map-pin"],
    [/^keylogging software/i, "code"],
    [/^luminol/i, "flask-conical"],
    [/^multi-tool/i, "pocket-knife"],
    [/^personal computer/i, "laptop"],
    [/^smartphone/i, "smartphone"],
    [/^special effects/i, "sparkles"],
    [/^surveillance equipment/i, "cctv"],
    [/^survival gear/i, "backpack"],
    [/^talcum powder/i, "flask-round"],
    [/^ultraviolet ink/i, "flask-round"],
    [/^battering ram/i, "hammer"],
    [/^bear trap/i, "lock-keyhole"],
    [/^caltrops/i, "construction"],
    [/^camouflage clothing/i, "shirt"],
    [/^climbing gear/i, "lasso"],
    [/^crowbar/i, "wrench"],
    [/^firearm suppressor/i, "wrench"],
    [/^gas mask/i, "biohazard"],
    [/^handcuffs/i, "lock-keyhole"],
    [/^lockpicking kit/i, "key-round"],
    [/^night vision goggles/i, "scan-eye"],
    [/^pepper spray/i, "flask-round"],
    [/^rope/i, "lasso"],
    [/^stun gun/i, "flashlight"],
    [/^cash/i, "coins"],
    [/^disguise/i, "venetian-mask"],
    [/^fashion/i, "shirt"],
];

const getDefaultEquipmentIconId = (name) =>
    PREMADE_EQUIPMENT_ICON_RULES.find(([pattern]) =>
        pattern.test(String(name || ""))
    )?.[1] || "";

const getLegacyEquipmentIconId = (item) => {
    const custom = item?.equipment?.icon;
    if (custom && EQUIPMENT_ICON_LOOKUP[custom]) return custom;
    return getDefaultEquipmentIconId(item?.name);
};

const InventoryItemIcon = ({ item, FallbackIcon, order }) => {
    if (item?.type === "equipment") {
        const id = getEquipmentIconId(item);
        const EquipmentIcon = id ? GameIcons[id] : null;
        if (EquipmentIcon) return <EquipmentIcon className="h-5 w-5 text-amber-200/80" />;
    }
    if (item?.type === "weapon" && item?.weapon?.kind === "ranged") {
        return <Crosshair className="h-5 w-5 text-amber-200/80" strokeWidth={1.6} />;
    }
    let Icon = FallbackIcon;

    if (item?.type === "weapon") {
        Icon = item.weapon?.kind === "ranged" ? Crosshair : Sword;
    } else if (item?.type === "equipment") {
        Icon = EQUIPMENT_ICON_LOOKUP[getLegacyEquipmentIconId(item)]?.Icon || Package;
    } else if (item?.type === "yantra") {
        const yantra = item.yantra || {};
        const kind = normalizeInventoryText(yantra.kind);
        const tool = normalizeInventoryText(yantra.tool_type);

        if (yantra.dedicated === true || tool === "dedicated") {
            Icon = Sparkles;
        } else if (kind === "sacrament") {
            Icon = Flame;
        } else if (tool === "order") {
            Icon = ORDER_YANTRA_ICONS[normalizeInventoryText(order)] || Sparkles;
        } else {
            Icon = YANTRA_TOOL_ICONS[tool || "coin"] || Sparkles;
        }
    }

    return <Icon className="h-5 w-5 text-amber-200/80" strokeWidth={1.6} />;
};

const clampInventoryNumber = (value, min, max, fallback = min) => {
    const parsed = parseInt(value, 10);
    const safe = Number.isFinite(parsed) ? parsed : fallback;
    return Math.min(max, Math.max(min, safe));
};

const compareInventoryNames = (a, b) =>
    normalizeInventoryText(a?.name || "Unnamed").localeCompare(
        normalizeInventoryText(b?.name || "Unnamed"),
        undefined,
        { sensitivity: "base", numeric: true }
    );

const getYantraSortRank = (item) => {
    const kind = normalizeInventoryText(item?.yantra?.kind);
    const explicitToolType = normalizeInventoryText(item?.yantra?.tool_type);
    const name = normalizeInventoryText(item?.name);
    const isDedicated =
        item?.yantra?.dedicated === true ||
        explicitToolType === "dedicated" ||
        name.includes("dedicated");

    if (kind === "sacrament") {
        return 7;
    }

    if (isDedicated) {
        return YANTRA_TOOL_ORDER.dedicated;
    }

    const effectiveToolType = explicitToolType || "coin";

    if (Object.prototype.hasOwnProperty.call(YANTRA_TOOL_ORDER, effectiveToolType)) {
        return YANTRA_TOOL_ORDER[effectiveToolType];
    }

    return 99;
};

const compareInventoryItems = (a, b) => {
    const itemA = a.item;
    const itemB = b.item;

    const typeA = normalizeInventoryText(itemA?.type);
    const typeB = normalizeInventoryText(itemB?.type);

    const typeOrderA = INVENTORY_TYPE_ORDER[typeA] ?? 99;
    const typeOrderB = INVENTORY_TYPE_ORDER[typeB] ?? 99;

    if (typeOrderA !== typeOrderB) {
        return typeOrderA - typeOrderB;
    }

    if (typeA === "yantra" && typeB === "yantra") {
        const yantraOrderA = getYantraSortRank(itemA);
        const yantraOrderB = getYantraSortRank(itemB);

        if (yantraOrderA !== yantraOrderB) {
            return yantraOrderA - yantraOrderB;
        }
    }

    const nameComparison = compareInventoryNames(itemA, itemB);
    if (nameComparison !== 0) {
        return nameComparison;
    }

    return a.originalIndex - b.originalIndex;
};

export const CombatContent = ({
    getValue, getNestedValue, handleChange,
    isMage,
    meritsList,
    calculateDefense, calculateInitiative, calculateSpeed,
    mageArmorDefenseBonus, mageArmorGeneralBonus,
    equippedArmorGeneral, equippedArmorBallistic,
    inventoryItems, updateInventoryItem, updateInventoryItemNested, removeInventoryItem, addInventoryItem,
    inventoryAddOpen, setInventoryAddOpen,
    editingInventoryIndex, setEditingInventoryIndex,
    invType, setInvType, invPremade, setInvPremade, invDraft, setInvDraft,
    healthBoxes, maxHealth, filledHealth, isDeadTrack, woundPenalty,
    handleHealthBoxClick, onHealHealthState,
    handleHealthBoxesChange,
    onStartCombat,
    showCombat = true,
    showMageArmor = true,
    showInventory = true,
}) => {
    const [collapsedInventoryGroups, setCollapsedInventoryGroups] = useState([]);

    const sortedInventoryItems = (inventoryItems || [])
        .map((item, originalIndex) => ({ item, originalIndex }))
        .sort(compareInventoryItems);

    const inventoryGroups = [
        { key: "equipment", label: "Equipment", Icon: Package },
        { key: "weapon", label: "Weapons", Icon: Sword },
        { key: "armor", label: "Armor", Icon: Shield },
        { key: "yantra", label: "Yantras", Icon: Sparkles },
        { key: "other", label: "Other", Icon: Package },
    ].map((group) => ({
        ...group,
        items: sortedInventoryItems.filter(({ item }) =>
            group.key === "other"
                ? !["equipment", "weapon", "armor", "yantra"].includes(item?.type)
                : item?.type === group.key
        ),
    })).filter((group) => group.items.length > 0);
    const currentMagePath =
        isMage
            ? getValue("path")
            : "";

    const yantraCardClass =
        YANTRA_PATH_CARD_CLASSES[
            currentMagePath
        ] ||
        DEFAULT_YANTRA_CARD_CLASS;
    return (
        <>
            {showCombat && (
                <div className="space-y-3">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Health</label>
                            <span className="text-[10px] text-zinc-600 font-mono" data-testid="health-count">
                                {filledHealth}/{maxHealth}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 w-full">
                            <div className="flex items-center gap-2">
                                {isDeadTrack && (
                                    <span className="text-[10px] text-rose-400 font-mono" data-testid="health-dead-label">
                                        DEAD
                                    </span>
                                )}
                                <HealthTrack boxes={healthBoxes} max={maxHealth} onBoxClick={handleHealthBoxClick} />
                            </div>

                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Heal</span>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-6 px-2 text-[10px] bg-purple-900/50 border-purple-500/50 text-purple-200 hover:bg-purple-900/70"
                                    onClick={() => onHealHealthState("aggravated")}
                                    data-testid="heal-aggravated-btn"
                                >
                                    âœ±
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-6 px-2 text-[10px] bg-rose-900/50 border-rose-500/50 text-rose-300 hover:bg-rose-900/70"
                                    onClick={() => onHealHealthState("lethal")}
                                    data-testid="heal-lethal-btn"
                                >
                                    X
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-6 px-2 text-[10px] bg-amber-900/50 border-amber-500/50 text-amber-300 hover:bg-amber-900/70"
                                    onClick={() => onHealHealthState("bashing")}
                                    data-testid="heal-bashing-btn"
                                >
                                    /
                                </Button>

                                {isMage && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-6 px-2 text-[10px] bg-violet-900/30 border-violet-500/30 text-violet-400 hover:bg-violet-800/40"
                                        onClick={() => {
                                            const currentMana = getValue("mana") || 0;
                                            if (currentMana < 3) return;

                                            const counts = getHealthCounts(healthBoxes);
                                            if (counts.lethal > 0) {
                                                counts.lethal -= 1;
                                            } else if (counts.bashing > 0) {
                                                counts.bashing -= 1;
                                            } else {
                                                return;
                                            }

                                            handleChange("mana", currentMana - 3);
                                            const updatedBoxes = buildHealthBoxes(counts, maxHealth);
                                            handleHealthBoxesChange(updatedBoxes);
                                        }}
                                        disabled={(getValue("mana") || 0) < 3 || (() => {
                                            const c = getHealthCounts(healthBoxes);
                                            return c.lethal + c.bashing === 0;
                                        })()}
                                        title="Spend 3 Mana to heal 1 Lethal or Bashing"
                                        data-testid="pattern-restoration-btn"
                                    >
                                        Pattern Restoration
                                    </Button>
                                )}
                            </div>
                        </div>

                        {woundPenalty < 0 && (
                            <p className="text-[10px] text-rose-400 mt-1" data-testid="health-wound-penalty">
                                Wound Penalty {woundPenalty}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                    <span className="text-zinc-500">Size</span>
                    <span className="font-mono text-teal-400" data-testid="size-input">
                        {5 + ((meritsList || []).some((m) => (m?.name || "") === "Giant") ? 1 : 0) + ((meritsList || []).some((m) => (m?.name || "") === "Small-Framed") ? -1 : 0)}
                    </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                    <span className="text-zinc-500">Defense</span>
                    <span className="font-mono text-teal-400">{calculateDefense() + mageArmorDefenseBonus}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                    <span className="text-zinc-500">Initiative</span>
                    <span className="font-mono text-teal-400">{calculateInitiative()}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                    <span className="text-zinc-500">Speed</span>
                    <span className="font-mono text-teal-400">{calculateSpeed()}</span>
                </div>
                <div className="col-span-2 flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                    <span className="text-zinc-500">Armor</span>
                    <span className="font-mono text-teal-400" data-testid="armor-input">{equippedArmorGeneral + mageArmorGeneralBonus}/{equippedArmorBallistic}</span>
                </div>
                                <Button
                    type="button"
                    onClick={onStartCombat}
                    className="col-span-2 btn-primary"
                    data-testid="combat-start-btn"
                >
                    Start Combat
                </Button>
            </div>
        </div>
        )}

            {/* Mage Armor */}
            {showMageArmor && isMage && (() => {
                const activeMageArmor = getValue("active_mage_armor") || null;
                const arcanaWithArmor = ARCANA.filter(a => (getNestedValue("arcana", a) || 0) >= 2);
                if (arcanaWithArmor.length === 0) return null;
                return (
                    <div className="mt-3 space-y-2" data-testid="mage-armor-section">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Mage Armor</label>
                        <div className="flex flex-wrap gap-1.5">
                            {arcanaWithArmor.map(a => {
                                const isActive = activeMageArmor === a;
                                const dots = getNestedValue("arcana", a) || 0;
                                const effect = MAGE_ARMOR_EFFECTS[a];
                                return (
                                    <TooltipProvider key={a}>
                                        <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => handleChange("active_mage_armor", isActive ? null : a)}
                                                className={`px-2.5 py-1 text-xs rounded border transition-all ${
                                                    isActive
                                                        ? "bg-violet-600/40 border-violet-500 text-violet-200 shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                                                        : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                                                }`}
                                                data-testid={`mage-armor-${a.toLowerCase()}`}
                                            >
                                                {a} ({dots})
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="bg-zinc-800 border-zinc-700 text-xs max-w-[220px]">
                                            <p className="font-medium text-violet-300">{a} Armor</p>
                                            <p className="text-zinc-400 mt-0.5">{effect?.short}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </div>
                        {activeMageArmor && MAGE_ARMOR_EFFECTS[activeMageArmor] && (
                            <div className="p-2 bg-violet-900/20 border border-violet-500/30 rounded text-xs text-violet-300" data-testid="mage-armor-active-effect">
                                <span className="font-medium">{activeMageArmor} Armor active:</span>{" "}
                                {MAGE_ARMOR_EFFECTS[activeMageArmor].armor}
                            </div>
                        )}
                    </div>
                );
            })()}

            {showInventory && (
                <>
                    {/* Inventory (structured) */}
                    <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                    <label className="font-heading text-sm uppercase tracking-wider text-zinc-200">Inventory</label>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-600 font-mono">
                            {inventoryItems.length} item{inventoryItems.length === 1 ? "" : "s"}
                        </span>
                        <Button
                            onClick={() => setInventoryAddOpen(true)}
                            className="btn-primary flex h-8 items-center gap-1.5 px-3 text-xs"
                            data-testid="inventory-open-add"
                        >
                            <Plus className="w-3 h-3" /> Add
                        </Button>
                    </div>
                </div>

                <Dialog open={inventoryAddOpen} onOpenChange={setInventoryAddOpen}>
                    <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-teal-300 font-heading">
                                <Plus className="w-5 h-5" />
                                Add Item
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-3">
                            <div className="p-2 rounded-sm bg-zinc-900/30 border border-zinc-800 space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Type</label>
                                        <Select
                                            value={invType}
                                            onValueChange={(v) => {
                                                setInvType(v);
                                                setInvPremade("__none__");
                                                setInvDraft((prev) => ({ ...prev, type: v }));
                                            }}
                                        >
                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                <SelectItem value="weapon" className="text-xs">
                                                    Weapon
                                                </SelectItem>

                                                <SelectItem value="armor" className="text-xs">
                                                    Armor
                                                </SelectItem>

                                                <SelectItem value="equipment" className="text-xs">
                                                    Equipment
                                                </SelectItem>

                                                <SelectItem value="yantra" className="text-xs">
                                                    Yantra
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Availability</label>
                                        <Select
                                            value={String(invDraft.availability ?? 0)}
                                            onValueChange={(v) =>
                                                setInvDraft((prev) => ({
                                                    ...prev,
                                                    availability: parseInt(v, 10),
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                {AVAILABILITY_OPTIONS.map((a) => (
                                                    <SelectItem key={a.value} value={String(a.value)} className="text-xs">
                                                        {a.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {invType === "equipment" && (
                                    <div>
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Premade</label>
                                        <Select
                                            value={invPremade}
                                            onValueChange={(v) => {
                                                setInvPremade(v);
                                                if (v === "__none__") return;
                                                const p = PREMADE_EQUIPMENT.find((x) => x.name === v);
                                                if (!p) return;
                                                setInvDraft((prev) => ({
                                                    ...prev,
                                                    name: p.name,
                                                    availability: p.availability ?? 0,
                                                    equipment: {
                                                        icon: getDefaultEquipmentIconId(p.name),
                                                        bonus: p.bonus ?? 0,
                                                        durability: p.durability ?? 0,
                                                        size: p.size ?? 1,
                                                        structure: p.structure ?? 1,
                                                        effect: p.effect ?? "",
                                                    },
                                                }));
                                            }}
                                        >
                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                <SelectValue placeholder="Select premade..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                <SelectItem value="__none__" className="text-xs">None</SelectItem>
                                                {PREMADE_EQUIPMENT.map((p) => (
                                                    <SelectItem key={p.name} value={p.name} className="text-xs">{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {invType === "armor" && (
                                    <div>
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Premade</label>
                                        <Select
                                            value={invPremade}
                                            onValueChange={(v) => {
                                                setInvPremade(v);
                                                if (v === "__none__") return;
                                                const p = PREMADE_ARMOR.find((x) => x.name === v);
                                                if (!p) return;
                                                const rawCoverage = p.armor?.coverage ?? [];
                                                const coverageList = (Array.isArray(rawCoverage) ? rawCoverage : String(rawCoverage).split(","))
                                                    .map((s) => String(s).trim().toLowerCase())
                                                    .filter(Boolean);
                                                const coverageObj = {
                                                    head: coverageList.includes("head"),
                                                    torso: coverageList.includes("torso"),
                                                    arms: coverageList.includes("arms"),
                                                    legs: coverageList.includes("legs"),
                                                };
                                                setInvDraft((prev) => ({
                                                    ...prev,
                                                    name: p.name,
                                                    availability: p.availability ?? 0,
                                                    armor: {
                                                        ...prev.armor,
                                                        general: p.armor?.general ?? 0,
                                                        ballistic: Math.max(0, Math.min(5, p.armor?.ballistic ?? 0)),
                                                        strength: p.armor?.strength ?? 0,
                                                        defense: p.armor?.defense ?? 0,
                                                        speed: p.armor?.speed ?? 0,
                                                        coverage: coverageObj,
                                                    },
                                                }));
                                            }}
                                        >
                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                <SelectValue placeholder="Select premade..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                <SelectItem value="__none__" className="text-xs">None</SelectItem>
                                                {PREMADE_ARMOR.map((p) => (
                                                    <SelectItem key={p.name} value={p.name} className="text-xs">{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Name</label>
                                    <Input
                                        value={invDraft.name}
                                        onChange={(e) => setInvDraft((prev) => ({ ...prev, name: e.target.value }))}
                                        className="h-7 input-geist text-xs"
                                        placeholder="Item name..."
                                    />
                                </div>

                                {/* Weapon fields */}
                                {invType === "weapon" && (
                                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Weapon Type</label>
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                                                <span>Melee</span>
                                                <Switch
                                                    checked={(invDraft.weapon.kind ?? "melee") === "ranged"}
                                                    onCheckedChange={(v) => {
                                                        setInvDraft((prev) => ({
                                                            ...prev,
                                                            weapon: {
                                                                ...prev.weapon,
                                                                kind: v ? "ranged" : "melee",
                                                            },
                                                        }));
                                                    }}
                                                    data-testid="weapon-kind-toggle"
                                                />
                                                <span>Ranged</span>
                                            </div>
                                        </div>

                                        {(invDraft.weapon.kind ?? "melee") === "ranged" && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Range (x/2x/4x)</label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={invDraft.weapon.range ?? 10}
                                                        onChange={(e) => {
                                                            const v = parseInt(e.target.value, 10);
                                                            const base = Math.max(1, Number.isFinite(v) ? v : 10);
                                                            setInvDraft((prev) => ({ ...prev, weapon: { ...prev.weapon, range: base } }));
                                                        }}
                                                        className="h-7 input-geist text-xs"
                                                    />
                                                    <div className="mt-1 text-[10px] text-zinc-600">
                                                        {`${invDraft.weapon.range ?? 10}/${(invDraft.weapon.range ?? 10) * 2}/${(invDraft.weapon.range ?? 10) * 4}`}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Ammunition</label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={invDraft.weapon.ammo ?? 0}
                                                        onChange={(e) => {
                                                            const v = parseInt(e.target.value, 10);
                                                            const ammo = Math.max(0, Number.isFinite(v) ? v : 0);
                                                            setInvDraft((prev) => ({ ...prev, weapon: { ...prev.weapon, ammo } }));
                                                        }}
                                                        className="h-7 input-geist text-xs"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-4 gap-2">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Damage</label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={5}
                                                    value={invDraft.weapon.damage ?? 0}
                                                    onChange={(e) =>
                                                        setInvDraft((prev) => ({
                                                            ...prev,
                                                            weapon: {
                                                                ...prev.weapon,
                                                                damage: clampInventoryNumber(e.target.value, 0, 5, 0),
                                                            },
                                                        }))
                                                    }
                                                    className="h-7 input-geist text-xs"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Initiative</label>
                                                <Input
                                                    type="number"
                                                    min={-6}
                                                    max={0}
                                                    value={invDraft.weapon.initiative ?? 0}
                                                    onChange={(e) =>
                                                        setInvDraft((prev) => ({
                                                            ...prev,
                                                            weapon: {
                                                                ...prev.weapon,
                                                                initiative: clampInventoryNumber(e.target.value, -6, 0, 0),
                                                            },
                                                        }))
                                                    }
                                                    className="h-7 input-geist text-xs"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Strength</label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={5}
                                                    value={invDraft.weapon.strength}
                                                    onChange={(e) =>
                                                        setInvDraft((prev) => ({
                                                            ...prev,
                                                            weapon: {
                                                                ...prev.weapon,
                                                                strength: clampInventoryNumber(e.target.value, 0, 5, 0),
                                                            },
                                                        }))
                                                    }
                                                    className="h-7 input-geist text-xs"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Size</label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={5}
                                                    value={invDraft.weapon.size}
                                                    onChange={(e) =>
                                                        setInvDraft((prev) => ({
                                                            ...prev,
                                                            weapon: {
                                                                ...prev.weapon,
                                                                size: clampInventoryNumber(e.target.value, 1, 5, 1),
                                                            },
                                                        }))
                                                    }
                                                    className="h-7 input-geist text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                                Damage Type
                                            </label>
                                            <Select
                                                value={invDraft.weapon.damage_type || "lethal"}
                                                onValueChange={(value) =>
                                                    setInvDraft((prev) => ({
                                                        ...prev,
                                                        weapon: {
                                                            ...prev.weapon,
                                                            damage_type: value,
                                                        },
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid="weapon-damage-type">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-700">
                                                    <SelectItem value="bashing" className="text-xs">Bashing (B)</SelectItem>
                                                    <SelectItem value="lethal" className="text-xs">Lethal (L)</SelectItem>
                                                    <SelectItem value="aggravated" className="text-xs">Aggravated (A)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            {(invDraft.weapon.kind ?? "melee") === "melee" && (
                                                <>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Special</label>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {WEAPON_SPECIAL_OPTIONS.map((s) => {
                                                            const checked = (invDraft.weapon.special || []).includes(s);
                                                            return (
                                                                <label key={s} className="flex items-center gap-2 text-[10px] text-zinc-400">
                                                                    <Checkbox
                                                                        checked={checked}
                                                                        onCheckedChange={(v) => {
                                                                            setInvDraft((prev) => {
                                                                                const cur = prev.weapon.special || [];
                                                                                const next = v ? [...cur, s] : cur.filter((x) => x !== s);

                                                                                return {
                                                                                    ...prev,
                                                                                    weapon: {
                                                                                        ...prev.weapon,
                                                                                        special: next,
                                                                                    },
                                                                                };
                                                                            });
                                                                        }}
                                                                        className="h-3 w-3"
                                                                    />
                                                                    {s}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Notes</label>
                                            <Textarea value={invDraft.weapon.notes} onChange={(e) => setInvDraft((prev) => ({ ...prev, weapon: { ...prev.weapon, notes: e.target.value } }))} className="input-geist mt-0.5 min-h-[60px] text-xs" placeholder="Weapon notes..." />
                                        </div>
                                    </div>
                                )}

                                {/* Armor fields */}
                                {invType === "armor" && (
                                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">General</label>
                                                <Input type="number" min={1} max={5} value={invDraft.armor.general} onChange={(e) => setInvDraft((prev) => ({ ...prev, armor: { ...prev.armor, general: Math.min(5, Math.max(1, parseInt(e.target.value, 10) || 1)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Ballistic</label>
                                                <Input type="number" min={0} max={5} value={invDraft.armor.ballistic} onChange={(e) => setInvDraft((prev) => ({ ...prev, armor: { ...prev.armor, ballistic: Math.min(5, Math.max(0, parseInt(e.target.value, 10) || 0)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Strength</label>
                                                <Input type="number" min={0} max={5} value={invDraft.armor.strength} onChange={(e) => setInvDraft((prev) => ({ ...prev, armor: { ...prev.armor, strength: Math.min(5, Math.max(0, parseInt(e.target.value, 10) || 0)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Defense</label>
                                                <Input type="number" min={-3} max={0} value={invDraft.armor.defense} onChange={(e) => setInvDraft((prev) => ({ ...prev, armor: { ...prev.armor, defense: Math.min(0, Math.max(-3, parseInt(e.target.value, 10) || 0)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Speed</label>
                                                <Input type="number" min={-3} max={0} value={invDraft.armor.speed} onChange={(e) => setInvDraft((prev) => ({ ...prev, armor: { ...prev.armor, speed: Math.min(0, Math.max(-3, parseInt(e.target.value, 10) || 0)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Coverage</label>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {ARMOR_COVERAGE_OPTIONS.map((c) => (
                                                    <label key={c} className="flex items-center gap-2 text-[10px] text-zinc-400">
                                                        <Checkbox
                                                            checked={!!invDraft.armor.coverage?.[c]}
                                                            onCheckedChange={(v) => setInvDraft((prev) => ({ ...prev, armor: { ...prev.armor, coverage: { ...(prev.armor.coverage || {}), [c]: !!v } } }))}
                                                            className="h-3 w-3"
                                                        />
                                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Equipment fields */}
                                {invType === "equipment" && (
                                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                                        <GameIconPicker
                                            value={invDraft.equipment?.icon || ""}
                                            itemName={invDraft.name}
                                            onChange={(icon) => setInvDraft((previous) => ({
                                                ...previous,
                                                equipment: { ...(previous.equipment || {}), icon },
                                            }))}
                                            testId="inventory-add-equipment-icon"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Bonus</label>
                                                <Input type="number" min={-5} max={5} value={invDraft.equipment.bonus} onChange={(e) => setInvDraft((prev) => ({ ...prev, equipment: { ...prev.equipment, bonus: clampInventoryNumber(e.target.value, -5, 5, 1), }, })) } className="h-7 input-geist text-xs" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Durability</label>
                                                <Input type="number" min={1} max={5} value={invDraft.equipment.durability} onChange={(e) => setInvDraft((prev) => ({ ...prev, equipment: { ...prev.equipment, durability: clampInventoryNumber(e.target.value, 1, 5, 1), }, })) } className="h-7 input-geist text-xs" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Size</label>
                                                <Input type="number" min={1} max={20} value={invDraft.equipment.size} onChange={(e) => setInvDraft((prev) => ({ ...prev, equipment: { ...prev.equipment, size: clampInventoryNumber(e.target.value, 1, 20, 1), }, }))} className="h-7 input-geist text-xs" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Structure</label>
                                                <Input type="number" min={1} max={25} value={invDraft.equipment.structure} onChange={(e) => setInvDraft((prev) => ({ ...prev, equipment: { ...prev.equipment, structure: clampInventoryNumber(e.target.value, 1, 25, 1), }, }))} className="h-7 input-geist text-xs" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Effect</label>
                                            <Textarea value={invDraft.equipment.effect} onChange={(e) => setInvDraft((prev) => ({ ...prev, equipment: { ...prev.equipment, effect: e.target.value } }))} className="input-geist mt-0.5 min-h-[60px] text-xs" placeholder="What it does..." />
                                        </div>
                                    </div>
                                )}

                                {/* Yantra fields */}
                                {invType === "yantra" && (
                                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Yantra Type</label>
                                                <Select
                                                    value={invDraft.yantra?.kind || "tool"}
                                                    onValueChange={(v) =>
                                                        setInvDraft((prev) => ({
                                                            ...prev,
                                                            yantra: { ...(prev.yantra || {}), kind: v },
                                                        }))
                                                    }
                                                >
                                                    <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                                        <SelectItem value="tool" className="text-xs">Tool</SelectItem>
                                                        <SelectItem value="sacrament" className="text-xs">Sacrament</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {invDraft.yantra?.kind === "tool" ? (
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Tool Type</label>
                                                    <Select
                                                        value={invDraft.yantra?.tool_type || "Coin"}
                                                        onValueChange={(v) =>
                                                            setInvDraft((prev) => ({
                                                                ...prev,
                                                                yantra: { ...(prev.yantra || {}), tool_type: v },
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                                            <SelectItem value="Dedicated" className="text-xs">Dedicated</SelectItem>
                                                            <SelectItem value="Coin" className="text-xs">Coin</SelectItem>
                                                            <SelectItem value="Cup" className="text-xs">Cup</SelectItem>
                                                            <SelectItem value="Mirror" className="text-xs">Mirror</SelectItem>
                                                            <SelectItem value="Rod" className="text-xs">Rod</SelectItem>
                                                            <SelectItem value="Weapon" className="text-xs">Weapon</SelectItem>
                                                            <SelectItem value="Order" className="text-xs">Order</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            ) : (
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Bonus</label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={5}
                                                        value={invDraft.yantra?.bonus ?? 1}
                                                        onChange={(e) =>
                                                            setInvDraft((prev) => ({
                                                                ...prev,
                                                                yantra: {
                                                                    ...(prev.yantra || {}),
                                                                    bonus: Math.max(0, Math.min(5, parseInt(e.target.value, 10) || 0)),
                                                                },
                                                            }))
                                                        }
                                                        className="h-7 input-geist text-xs"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Notes</label>
                                            <Textarea
                                                value={invDraft.yantra?.notes || ""}
                                                onChange={(e) =>
                                                    setInvDraft((prev) => ({
                                                        ...prev,
                                                        yantra: { ...(prev.yantra || {}), notes: e.target.value },
                                                    }))
                                                }
                                                className="input-geist mt-0.5 min-h-[60px] text-xs"
                                                placeholder="Yantra notes..."
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button onClick={addInventoryItem} className="btn-primary h-7 px-3 text-xs w-full flex items-center justify-center gap-2" data-testid="inventory-add-item">
                                    <Plus className="w-4 h-4" /> Add Item
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Items list */}
                {inventoryItems.length === 0 ? (
                    <p className="text-[10px] text-zinc-600 italic">No inventory items yet.</p>
                ) : (
                    <div className="space-y-3" data-testid="inventory-grouped-list">
                        {inventoryGroups.map(({ key, label, Icon, items }) => (
                            <section key={key} className="rounded-lg border border-zinc-700/80 bg-zinc-900/20 p-2" data-testid={`inventory-group-${key}`}>
                                <button
                                    type="button"
                                    onClick={() => setCollapsedInventoryGroups((previous) => previous.includes(key)
                                        ? previous.filter((value) => value !== key)
                                        : [...previous, key]
                                    )}
                                    aria-expanded={!collapsedInventoryGroups.includes(key)}
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-zinc-200 hover:bg-zinc-800/50"
                                >
                                    <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${collapsedInventoryGroups.includes(key) ? "-rotate-90" : ""}`} />
                                    <Icon className="h-4 w-4 text-teal-300" />
                                    <span className="text-sm font-semibold">{label}</span>
                                    <span className="text-[11px] text-zinc-500">{items.length} item{items.length === 1 ? "" : "s"}</span>
                                </button>
                                {!collapsedInventoryGroups.includes(key) && (
                                    <div className="space-y-2 px-1 pb-1">
                                        {items.map(({ item: it, originalIndex: idx }) => (
                            <div
                                key={idx}
                                className={`relative rounded-md border px-3 py-3 shadow-sm ${
                                    it.type === "yantra"
                                        ? yantraCardClass
                                        : "border-zinc-700/70 bg-gradient-to-r from-zinc-900/90 to-zinc-950/80"
                                }`}
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex min-w-[160px] flex-1 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950/70">
                                            <InventoryItemIcon item={it} FallbackIcon={Icon} order={getValue("order")} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold text-zinc-100">{it.name || "Unnamed"}</div>
                                            <div className="text-[11px] leading-snug text-zinc-400">
                                                {it.type === "yantra"
                                                    ? getYantraDisplayType(it)
                                                    : it.type === "weapon"
                                                        ? `${it.weapon?.kind === "ranged" ? "Ranged" : "Melee"} Weapon`
                                                        : it.type === "armor" ? "Armor" : it.type === "equipment" ? "Equipment" : "Item"}
                                                <span className="px-1 text-zinc-600">·</span>
                                                Availability {AVAILABILITY_OPTIONS.find((a) => a.value === (it.availability ?? 0))?.label ?? "—"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-zinc-500">Equipped</span>
                                            <Switch
                                                checked={!!it.equipped}
                                                onCheckedChange={(v) => {
                                                    const current = getValue("inventory_items") || [];
                                                    const target = current[idx];
                                                    let updated = current.map((it2, i) => (i === idx ? { ...it2, equipped: !!v } : it2));
                                                    if (target?.type === "armor" && !!v) {
                                                        updated = current.map((it2, i) => {
                                                            if (it2?.type !== "armor") return it2;
                                                            if (i === idx) return { ...it2, equipped: true };
                                                            return { ...it2, equipped: false };
                                                        });
                                                    }
                                                    handleChange("inventory_items", updated);
                                                }}
                                                data-testid={`inventory-equipped-${idx}`}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-1.5 text-zinc-400 hover:text-zinc-200"
                                                onClick={() => setEditingInventoryIndex(idx)}
                                                data-testid={`inventory-edit-${idx}`}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-1.5 text-zinc-400 hover:text-red-300"
                                                onClick={() => removeInventoryItem(idx)}
                                                data-testid={`inventory-remove-${idx}`}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {editingInventoryIndex === idx ? (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <Input
                                            value={it.name || ""}
                                            onChange={(e) => updateInventoryItem(idx, { name: e.target.value })}
                                            className="h-7 input-geist text-xs"
                                            placeholder="Name"
                                        />
                                        <Select
                                            value={String(it.availability ?? 0)}
                                            onValueChange={(v) => updateInventoryItem(idx, { availability: parseInt(v, 10) })}
                                        >
                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                {AVAILABILITY_OPTIONS.map((a) => (
                                                    <SelectItem key={a.value} value={String(a.value)} className="text-xs">
                                                        {a.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {it.type === "weapon" && (
                                            <div className="col-span-2 grid grid-cols-4 gap-2">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={5}
                                                    value={it.weapon?.damage ?? 0}
                                                    onChange={(e) =>
                                                        updateInventoryItemNested(idx, "weapon", {
                                                            damage: clampInventoryNumber(e.target.value, 0, 5, 0),
                                                        })
                                                    }
                                                    className="h-7 input-geist text-xs"
                                                    placeholder="Damage"
                                                />

                                                <Input
                                                    type="number"
                                                    min={-6}
                                                    max={0}
                                                    value={it.weapon?.initiative ?? 0}
                                                    onChange={(e) =>
                                                        updateInventoryItemNested(idx, "weapon", {
                                                            initiative: clampInventoryNumber(e.target.value, -6, 0, 0),
                                                        })
                                                    }
                                                    className="h-7 input-geist text-xs"
                                                    placeholder="Init."
                                                />

                                                <Input
                                                    type="number"
                                                    value={it.weapon?.strength ?? 0}
                                                    onChange={(e) =>
                                                        updateInventoryItemNested(idx, "weapon", {
                                                            strength: parseInt(e.target.value, 10) || 0,
                                                        })
                                                    }
                                                    className="h-7 input-geist text-xs"
                                                    placeholder="Strength"
                                                />

                                                <Input
                                                    type="number"
                                                    value={it.weapon?.size ?? 1}
                                                    onChange={(e) =>
                                                        updateInventoryItemNested(idx, "weapon", {
                                                            size: parseInt(e.target.value, 10) || 0,
                                                        })
                                                    }
                                                    className="h-7 input-geist text-xs"
                                                    placeholder="Size"
                                                />
                                            </div>
                                        )}

                                        {it.type === "weapon" && (
                                            <div className="col-span-2">
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                                    Damage Type
                                                </label>
                                                <Select
                                                    value={it.weapon?.damage_type || "lethal"}
                                                    onValueChange={(value) =>
                                                        updateInventoryItemNested(idx, "weapon", {
                                                            damage_type: value,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs" data-testid={`inventory-weapon-damage-type-${idx}`}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                                        <SelectItem value="bashing" className="text-xs">Bashing (B)</SelectItem>
                                                        <SelectItem value="lethal" className="text-xs">Lethal (L)</SelectItem>
                                                        <SelectItem value="aggravated" className="text-xs">Aggravated (A)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        {it.type === "armor" && (
                                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={5}
                                                    value={it.armor?.general ?? 0}
                                                    onChange={(e) => {
                                                        const v = parseInt(e.target.value, 10);
                                                        updateInventoryItemNested(idx, "armor", {
                                                            general: Math.max(0, Math.min(5, Number.isFinite(v) ? v : 0)),
                                                        });
                                                    }}
                                                    className="h-7 input-geist text-xs"
                                                    placeholder="General"
                                                />
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={5}
                                                    value={it.armor?.ballistic ?? 0}
                                                    onChange={(e) => {
                                                        const v = parseInt(e.target.value, 10);
                                                        updateInventoryItemNested(idx, "armor", {
                                                            ballistic: Math.max(0, Math.min(5, Number.isFinite(v) ? v : 0)),
                                                        });
                                                    }}
                                                    className="h-7 input-geist text-xs"
                                                    placeholder="Ballistic"
                                                />
                                            </div>
                                        )}

                                        {it.type === "equipment" && (
                                            <div className="col-span-2">
                                                <GameIconPicker
                                                    value={it.equipment?.icon || ""}
                                                    itemName={it.name}
                                                    onChange={(icon) => updateInventoryItemNested(idx, "equipment", { icon })}
                                                    testId={`inventory-edit-equipment-icon-${idx}`}
                                                />
                                            </div>
                                        )}

                                        {it.type === "equipment" && (
                                            <div className="col-span-2 grid grid-cols-4 gap-2">
                                                <Input
                                                    type="number"
                                                    min={-5}
                                                    max={5}
                                                    value={it.equipment?.bonus ?? 0}
                                                    onChange={(e) => updateInventoryItemNested(idx, "equipment", { bonus: clampInventoryNumber(e.target.value, -5, 5, 1) || 0 })}
                                                    className="h-7 input-geist text-xs"
                                                    placeholder="Bonus"
                                                />
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={5}
                                                    value={it.equipment?.durability ?? 1}
                                                    onChange={(e) => updateInventoryItemNested(idx, "equipment", { durability: clampInventoryNumber(e.target.value, 1, 5, 1) || 0 })}
                                                    className="h-7 input-geist text-xs"
                                                    placeholder="Dur."
                                                />
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={20}
                                                    value={it.equipment?.size ?? 1}
                                                    onChange={(e) =>
                                                        updateInventoryItemNested(idx, "equipment", {
                                                            size: clampInventoryNumber(e.target.value, 1, 20, 1),
                                                        })
                                                    }
                                                    className="h-7 input-geist text-xs"
                                                    placeholder="Size"
                                                />
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={25}
                                                    value={it.equipment?.structure ?? 1}
                                                    onChange={(e) =>
                                                        updateInventoryItemNested(idx, "equipment", {
                                                            structure: clampInventoryNumber(e.target.value, 1, 25, 1),
                                                        })
                                                    }
                                                    className="h-7 input-geist text-xs"
                                                    placeholder="Str."
                                                />
                                            </div>
                                        )}

                                        {it.type === "yantra" && (
                                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                                <Select
                                                    value={it.yantra?.kind || "tool"}
                                                    onValueChange={(v) => updateInventoryItemNested(idx, "yantra", { kind: v })}
                                                >
                                                    <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                                        <SelectItem value="tool" className="text-xs">Tool</SelectItem>
                                                        <SelectItem value="sacrament" className="text-xs">Sacrament</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {it.yantra?.kind === "tool" ? (
                                                    <div className="space-y-1">
                                                        <Select
                                                            value={
                                                                it.yantra?.dedicated
                                                                    ? "Dedicated"
                                                                    : it.yantra?.tool_type ||
                                                                    "Coin"
                                                            }
                                                            onValueChange={(v) =>
                                                                updateInventoryItemNested(
                                                                    idx,
                                                                    "yantra",
                                                                    {
                                                                        tool_type: v,

                                                                        // Converts old starred Dedicated
                                                                        // Yantras to the new category system.
                                                                        dedicated: false,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                                <SelectItem value="Dedicated" className="text-xs">
                                                                    Dedicated
                                                                </SelectItem>

                                                                <SelectItem value="Coin" className="text-xs">
                                                                    Coin
                                                                </SelectItem>

                                                                <SelectItem value="Cup" className="text-xs">
                                                                    Cup
                                                                </SelectItem>

                                                                <SelectItem value="Mirror" className="text-xs">
                                                                    Mirror
                                                                </SelectItem>

                                                                <SelectItem value="Rod" className="text-xs">
                                                                    Rod
                                                                </SelectItem>

                                                                <SelectItem value="Weapon" className="text-xs">
                                                                    Weapon
                                                                </SelectItem>

                                                                <SelectItem value="Order" className="text-xs">
                                                                    Order
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                ) : (
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={5}
                                                        value={it.yantra?.bonus ?? 1}
                                                        onChange={(e) =>
                                                            updateInventoryItemNested(idx, "yantra", {
                                                                bonus: Math.max(0, Math.min(5, parseInt(e.target.value, 10) || 0)),
                                                            })
                                                        }
                                                        className="h-7 input-geist text-xs"
                                                        placeholder="Bonus"
                                                    />
                                                )}
                                            </div>
                                        )}

                                        <div className="col-span-2 flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-zinc-400 hover:text-zinc-200"
                                                onClick={() => setEditingInventoryIndex(null)}
                                                data-testid={`inventory-cancel-edit-${idx}`}
                                            >
                                                Done
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        
                                        {it.type === "weapon" && (
                                            <div className="mt-3 grid grid-cols-2 gap-1.5 border-t border-zinc-700/60 pt-3 text-xs text-zinc-300 sm:grid-cols-4">
                                                <span>
                                                    Damage {it.weapon?.damage ?? 0}
                                                    {it.weapon?.damage_type === "bashing"
                                                        ? "B"
                                                        : it.weapon?.damage_type === "aggravated"
                                                            ? "A"
                                                            : "L"}
                                                </span>
                                                <span>Initiative {it.weapon?.initiative ?? 0}</span>
                                                <span>Strength {it.weapon?.strength ?? 0}</span>
                                                <span>Size {it.weapon?.size ?? 1}</span>
                                            </div>
                                        )}

                                        {it.type === "armor" && (
                                            <div className="mt-3 grid grid-cols-3 gap-1.5 border-t border-zinc-700/60 pt-3 text-xs text-zinc-300">
                                                <span>Strength {it.armor?.strength ?? 0}</span>
                                                <span>Defense {it.armor?.defense ?? 0}</span>
                                                <span>Speed {it.armor?.speed ?? 0}</span>
                                            </div>
                                        )}

                                        {it.type === "equipment" && (
                                            <div className="mt-3 grid grid-cols-2 gap-1.5 border-t border-zinc-700/60 pt-3 text-xs text-zinc-300 sm:grid-cols-4">
                                                <span className="text-cyan-400">
                                                    Bonus {Number(it.equipment?.bonus ?? 0) >= 0 ? "+" : ""}
                                                    {it.equipment?.bonus ?? 0}
                                                </span>

                                                <span>
                                                    Durability {it.equipment?.durability ?? 0}
                                                </span>

                                                <span>
                                                    Structure {it.equipment?.structure ?? 1}
                                                </span>

                                                <span>
                                                    Size {it.equipment?.size ?? 1}
                                                </span>
                                            </div>
                                        )}

                                        {it.type === "yantra" &&
                                            it.yantra?.notes && (
                                                <div className="mt-1 text-[11px] text-zinc-500 truncate">
                                                    {it.yantra.notes}
                                                </div>
                                            )}
                                    </>
                                )}
                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                )}
                    </div>
                </>
            )}
        </>
    );
};
