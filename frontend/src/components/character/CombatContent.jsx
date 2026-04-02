import { Plus, Trash2, Pencil } from "lucide-react";
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
}) => {
    return (
        <>
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
                <div className="flex justify-between items-center p-2 bg-zinc-900/30 rounded-sm">
                    <span className="text-zinc-500">Armor</span>
                    <span className="font-mono text-teal-400" data-testid="armor-input">{equippedArmorGeneral + mageArmorGeneralBonus}/{equippedArmorBallistic}</span>
                </div>
            </div>

            {/* Mage Armor */}
            {isMage && (() => {
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

            {/* Inventory (structured) */}
            <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Inventory</label>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-600 font-mono">
                            {inventoryItems.length} item{inventoryItems.length === 1 ? "" : "s"}
                        </span>
                        <Button
                            onClick={() => setInventoryAddOpen(true)}
                            className="h-6 px-2 text-[10px] btn-primary flex items-center gap-1"
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
                                                <SelectItem value="weapon" className="text-xs">Weapon</SelectItem>
                                                <SelectItem value="armor" className="text-xs">Armor</SelectItem>
                                                <SelectItem value="equipment" className="text-xs">Equipment</SelectItem>
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
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Damage</label>
                                                <Input type="number" min={1} max={5} value={invDraft.weapon.damage} onChange={(e) => setInvDraft((prev) => ({ ...prev, weapon: { ...prev.weapon, damage: Math.min(5, Math.max(1, parseInt(e.target.value, 10) || 1)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Strength</label>
                                                <Input type="number" min={0} max={5} value={invDraft.weapon.strength} onChange={(e) => setInvDraft((prev) => ({ ...prev, weapon: { ...prev.weapon, strength: Math.min(5, Math.max(0, parseInt(e.target.value, 10) || 0)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Size</label>
                                                <Input type="number" min={1} max={5} value={invDraft.weapon.size} onChange={(e) => setInvDraft((prev) => ({ ...prev, weapon: { ...prev.weapon, size: Math.min(5, Math.max(1, parseInt(e.target.value, 10) || 1)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
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
                                                                                return { ...prev, weapon: { ...prev.weapon, kind: v ? "ranged" : "melee", special: v ? [] : (prev.weapon.special || []) } };
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
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Bonus</label>
                                                <Input type="number" min={0} max={5} value={invDraft.equipment.bonus} onChange={(e) => setInvDraft((prev) => ({ ...prev, equipment: { ...prev.equipment, bonus: Math.min(5, Math.max(0, parseInt(e.target.value, 10) || 0)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Durability</label>
                                                <Input type="number" min={0} max={5} value={invDraft.equipment.durability} onChange={(e) => setInvDraft((prev) => ({ ...prev, equipment: { ...prev.equipment, durability: Math.min(5, Math.max(0, parseInt(e.target.value, 10) || 0)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Size</label>
                                                <Input type="number" min={1} max={5} value={invDraft.equipment.size} onChange={(e) => setInvDraft((prev) => ({ ...prev, equipment: { ...prev.equipment, size: Math.min(5, Math.max(1, parseInt(e.target.value, 10) || 1)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Structure</label>
                                                <Input type="number" min={1} max={10} value={invDraft.equipment.structure} onChange={(e) => setInvDraft((prev) => ({ ...prev, equipment: { ...prev.equipment, structure: Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 1)) } }))} className="h-7 input-geist text-xs" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Effect</label>
                                            <Textarea value={invDraft.equipment.effect} onChange={(e) => setInvDraft((prev) => ({ ...prev, equipment: { ...prev.equipment, effect: e.target.value } }))} className="input-geist mt-0.5 min-h-[60px] text-xs" placeholder="What it does..." />
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
                    <div className="space-y-2">
                        {inventoryItems.map((it, idx) => (
                            <div key={`${it.name || "item"}-${idx}`} className="p-2 rounded-sm bg-zinc-900/20 border border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-200">
                                        <span className="font-mono text-zinc-500 mr-2">
                                            {it.type.charAt(0).toUpperCase() + it.type.slice(1)}
                                        </span>
                                        {it.name || "Unnamed"}
                                        <span className="text-[10px] text-zinc-500 ml-2">
                                            {AVAILABILITY_OPTIONS.find((a) => a.value === (it.availability ?? 0))?.label ?? "o"}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-zinc-400 hover:text-red-300" onClick={() => removeInventoryItem(idx)} data-testid={`inventory-remove-${idx}`}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                {editingInventoryIndex === idx ? (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <Input value={it.name || ""} onChange={(e) => updateInventoryItem(idx, { name: e.target.value })} className="h-7 input-geist text-xs" placeholder="Name" />
                                        <Select value={String(it.availability ?? 0)} onValueChange={(v) => updateInventoryItem(idx, { availability: parseInt(v, 10) })}>
                                            <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-700 text-xs"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                                {AVAILABILITY_OPTIONS.map((a) => (<SelectItem key={a.value} value={String(a.value)} className="text-xs">{a.label}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                        {it.type === "weapon" && (
                                            <div className="col-span-2 grid grid-cols-3 gap-2">
                                                <Input type="number" value={it.weapon?.damage ?? 1} onChange={(e) => updateInventoryItemNested(idx, "weapon", { damage: parseInt(e.target.value, 10) || 0 })} className="h-7 input-geist text-xs" placeholder="Damage" />
                                                <Input type="number" value={it.weapon?.strength ?? 0} onChange={(e) => updateInventoryItemNested(idx, "weapon", { strength: parseInt(e.target.value, 10) || 0 })} className="h-7 input-geist text-xs" placeholder="Strength" />
                                                <Input type="number" value={it.weapon?.size ?? 1} onChange={(e) => updateInventoryItemNested(idx, "weapon", { size: parseInt(e.target.value, 10) || 0 })} className="h-7 input-geist text-xs" placeholder="Size" />
                                            </div>
                                        )}
                                        {it.type === "armor" && (
                                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                                <Input type="number" min={0} max={5} value={it.armor?.general ?? 0} onChange={(e) => { const v = parseInt(e.target.value, 10); updateInventoryItemNested(idx, "armor", { general: Math.max(0, Math.min(5, Number.isFinite(v) ? v : 0)) }); }} className="h-7 input-geist text-xs" placeholder="General" />
                                                <Input type="number" min={0} max={5} value={it.armor?.ballistic ?? 0} onChange={(e) => { const v = parseInt(e.target.value, 10); updateInventoryItemNested(idx, "armor", { ballistic: Math.max(0, Math.min(5, Number.isFinite(v) ? v : 0)) }); }} className="h-7 input-geist text-xs" placeholder="Ballistic" />
                                            </div>
                                        )}
                                        {it.type === "equipment" && (
                                            <div className="col-span-2 grid grid-cols-4 gap-2">
                                                <Input type="number" value={it.equipment?.bonus ?? 0} onChange={(e) => updateInventoryItemNested(idx, "equipment", { bonus: parseInt(e.target.value, 10) || 0 })} className="h-7 input-geist text-xs" placeholder="Bonus" />
                                                <Input type="number" value={it.equipment?.durability ?? 0} onChange={(e) => updateInventoryItemNested(idx, "equipment", { durability: parseInt(e.target.value, 10) || 0 })} className="h-7 input-geist text-xs" placeholder="Dur." />
                                                <Input type="number" value={it.equipment?.size ?? 1} onChange={(e) => updateInventoryItemNested(idx, "equipment", { size: parseInt(e.target.value, 10) || 0 })} className="h-7 input-geist text-xs" placeholder="Size" />
                                                <Input type="number" value={it.equipment?.structure ?? 1} onChange={(e) => updateInventoryItemNested(idx, "equipment", { structure: parseInt(e.target.value, 10) || 0 })} className="h-7 input-geist text-xs" placeholder="Str." />
                                            </div>
                                        )}
                                        <div className="col-span-2 flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" className="h-7 px-2 text-zinc-400 hover:text-zinc-200" onClick={() => setEditingInventoryIndex(null)} data-testid={`inventory-cancel-edit-${idx}`}>
                                                Done
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2 grid grid-cols-3 gap-2 items-center">
                                        <div className="text-xs text-cyan-400 font-mono">
                                            {(() => {
                                                if (it.type === "weapon") return `Damage +${it.weapon?.damage ?? 1}`;
                                                if (it.type === "armor") return `Rating ${it.armor?.general ?? 1}/${it.armor?.ballistic ?? 0}`;
                                                return `Bonus +${it.equipment?.bonus ?? 0}`;
                                            })()}
                                        </div>
                                        <div className="flex items-center justify-end gap-2">
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
                                            <Button variant="ghost" size="sm" className="h-7 px-2 text-zinc-400 hover:text-zinc-200" onClick={() => setEditingInventoryIndex(idx)} data-testid={`inventory-edit-${idx}`}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {it.type === "weapon" && (
                                    <div className="mt-2 grid grid-cols-3 gap-1 text-[12px] text-zinc-500">
                                        <span>Damage {it.weapon?.damage ?? 1}</span>
                                        <span>Size {it.weapon?.size ?? 1}</span>
                                        <span>Strength {it.weapon?.strength ?? 0}</span>
                                    </div>
                                )}
                                {it.type === "armor" && (
                                    <div className="mt-2 grid grid-cols-3 gap-1 text-[12px] text-zinc-500">
                                        <span>Strength {it.armor?.strength ?? 0}</span>
                                        <span>Defense {it.armor?.defense ?? 0}</span>
                                        <span>Speed {it.armor?.speed ?? 0}</span>
                                    </div>
                                )}
                                {it.type === "equipment" && (
                                    <div className="mt-2 grid grid-cols-3 gap-1 text-[12px] text-zinc-500">
                                        <span>Durability {it.equipment?.durability ?? 0}</span>
                                        <span>Structure {it.equipment?.structure ?? 1}</span>
                                        <span>Size {it.equipment?.size ?? 1}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
