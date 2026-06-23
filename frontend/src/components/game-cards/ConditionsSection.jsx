import { useState } from "react";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { ConditionCard } from "../cards/CardComponents";
import {
    CONDITION_DEFINITIONS,
    CardTypeColors,
} from "../../data/cards-data";

/**
 * Conditions section of the Game Cards panel.
 *
 * Handles:
 *   - Add Condition dialog (search predefined or create custom).
 *   - List of active conditions, with remove / resolve actions.
 */
export const ConditionsSection = ({
    open,
    onToggle,
    activeConditions,
    onAddCondition,
    onRemoveCondition,
    onResolveCondition,
}) => {
    const [showAddCondition, setShowAddCondition] = useState(false);
    const [customConditionName, setCustomConditionName] = useState("");
    const [customConditionDesc, setCustomConditionDesc] = useState("");
    const [conditionOrigin, setConditionOrigin] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConditions = Object.keys(CONDITION_DEFINITIONS).filter(
        (name) => name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddPredefinedCondition = (name) => {
        const condition = CONDITION_DEFINITIONS[name];
        const originOverride = conditionOrigin.trim();
        const fallbackOrigin = condition.origin || (condition.type === "tilt" ? "Tilt" : condition.type === "geist" ? "Geist" : "Condition");

        onAddCondition({
            name,
            type: condition.type,
            description: condition.description,
            resolution: condition.resolution,
            origin: originOverride || fallbackOrigin,
        });

        setShowAddCondition(false);
        setSearchTerm("");
        setConditionOrigin("");
    };

    const handleAddCustomCondition = () => {
        if (customConditionName.trim()) {
            onAddCondition({
                name: customConditionName.trim(),
                type: "custom",
                description: customConditionDesc.trim() || "Custom condition",
                resolution: "",
                origin: conditionOrigin.trim() || "Custom",
            });
            setCustomConditionName("");
            setCustomConditionDesc("");
            setShowAddCondition(false);
            setConditionOrigin("");
        }
    };

    return (
        <Collapsible
            open={open}
            onOpenChange={onToggle}
            className="bg-zinc-900/40 border border-zinc-800 rounded-sm"
            data-testid="cards-section-conditions"
        >
            <CollapsibleTrigger className="w-full flex items-center justify-between p-3" data-testid="cards-section-conditions-toggle">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Conditions</span>
                    <span className="text-[10px] text-zinc-500">{activeConditions.length}</span>
                </div>
                {open ? (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                )}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
                <div className="space-y-3">
                    <Dialog open={showAddCondition} onOpenChange={setShowAddCondition}>
                        <DialogTrigger asChild>
                            <Button className="w-full btn-secondary" data-testid="add-condition-btn">
                                <Plus className="w-4 h-4 mr-2" /> Add Condition
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="text-zinc-100 font-heading">Add Condition</DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    Select a predefined condition or create a custom one.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                <Input
                                    placeholder="Search conditions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input-geist"
                                    data-testid="search-conditions-input"
                                />
                                <Input
                                    placeholder="Origin/source (e.g., Liminal Aura, Boneyard, Beasts (Geist))"
                                    value={conditionOrigin}
                                    onChange={(e) => setConditionOrigin(e.target.value)}
                                    className="input-geist"
                                    data-testid="condition-origin-input"
                                />
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {filteredConditions.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => handleAddPredefinedCondition(name)}
                                            className="w-full text-left p-2 rounded-sm bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                            data-testid={`condition-option-${name.toLowerCase().replace(/\s+/g, '-')}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${CardTypeColors[CONDITION_DEFINITIONS[name]?.type || "custom"].badge} ${CardTypeColors[CONDITION_DEFINITIONS[name]?.type || "custom"].text}`}>
                                                    {(CONDITION_DEFINITIONS[name]?.type || "custom").toUpperCase()}
                                                </span>
                                                <span className="text-xs text-zinc-200">{name}</span>
                                            </div>
                                            <p className="text-[10px] text-zinc-500 line-clamp-2">
                                                {CONDITION_DEFINITIONS[name]?.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                                <div className="border-t border-zinc-800 pt-3">
                                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Or Create Custom</h4>
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Condition name"
                                            value={customConditionName}
                                            onChange={(e) => setCustomConditionName(e.target.value)}
                                            className="input-geist"
                                            data-testid="custom-condition-name"
                                        />
                                        <Textarea
                                            placeholder="Description (optional)"
                                            value={customConditionDesc}
                                            onChange={(e) => setCustomConditionDesc(e.target.value)}
                                            className="input-geist min-h-[60px]"
                                            data-testid="custom-condition-description"
                                        />
                                        <Button
                                            onClick={handleAddCustomCondition}
                                            className="w-full btn-primary"
                                            disabled={!customConditionName.trim()}
                                            data-testid="add-custom-condition-btn"
                                        >
                                            Add Custom Condition
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {activeConditions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-zinc-500 text-sm">No active conditions</p>
                            <p className="text-zinc-600 text-xs mt-1">Add conditions to track status effects</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {activeConditions.map((condition, idx) => (
                                <ConditionCard
                                    key={`${condition.name}-${idx}`}
                                    conditionIndex={idx}
                                    name={condition.name}
                                    type={condition.type || "custom"}
                                    description={condition.description}
                                    resolution={condition.resolution}
                                    origin={condition.origin}
                                    onRemove={onRemoveCondition}
                                    onResolve={onResolveCondition}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
