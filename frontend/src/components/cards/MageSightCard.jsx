import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ARCANA, PATH_ARCANA } from "../../data/character-data";

const MAGE_SIGHT_DESCRIPTIONS = {
    Death: "Death Sight reveals the Anchor Condition, manifested ghosts, and related deathly phenomena. At a glance, the mage can tell whether a person has a soul and whether a body is truly dead.",
    Fate: "Fate Sight reveals when someone experiences a dramatic failure or exceptional success. It also reveals the presence and use of a Destiny, but not the details of that Destiny.",
    Forces: "Forces Sight reveals motion, environmental Tilts, fire, electricity, and other physical hazards. It also allows the mage to tell at a glance whether a device is powered.",
    Life: "Life Sight reveals signs of life and allows the mage to tell at a glance whether a body is alive and how badly a living being is injured. Toxins, diseases, and Personal Tilts are also apparent.",
    Matter: "Matter Sight reveals the Structure and Durability of an object, along with its value and quality.",
    Mind: "Mind Sight reveals the presence of thinking beings and allows the mage to tell at a glance whether someone is asleep, comatose, awake, meditating, or projecting into the Astral. It also reveals when an observed being gains or spends Willpower.",
    Prime: "Prime Sight reveals anything the mage can use as a Yantra, as well as the presence of Awakened spells and Attainment effects. It also allows the mage to recognize tass and determine when they are within a Hallow or Node.",
    Space: "Space Sight reveals distances, range bands, and cover, allowing the mage to judge situational bonuses and penalties before acting. It also reveals spatial distortions, scrying windows, and Irises.",
    Spirit: "Spirit Sight reveals the strength of the local Gauntlet, the presence and nature of the Resonance Condition, other sources of Essence, and manifested spirits and related phenomena.",
    Time: "Time Sight reveals subtle temporal changes, allowing the mage to know the Initiative of all combatants. It also reveals when someone is about to act, even reflexively, and detects temporal distortions and signs of travel into the past.",
};

const MageSightCard = ({
    activeCharacter,
    activeMageSight,
    onUpdateCharacter,
    onTriggerDiceRoll,
}) => {
    const currentPath = activeCharacter?.path;
    const rulingArcana = currentPath ? (PATH_ARCANA[currentPath]?.ruling || []) : [];
    const currentMana = activeCharacter?.mana || 0;
    const currentWillpower = activeCharacter?.willpower || 0;
    const activeSpells = activeCharacter?.active_spells || [];

    const activeArcana = activeMageSight
        ? (activeMageSight.arcanum || "")
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean)
        : rulingArcana;

    const availableExtraArcana = ARCANA.filter((arcanum) => {
        const dots = activeCharacter?.arcana?.[arcanum] || 0;
        return dots >= 1 && !activeArcana.includes(arcanum);
    });

    const [selectedArcanum, setSelectedArcanum] = useState(activeArcana[0] || "Death");
    const [opacity, setOpacity] = useState("0");
    const [target, setTarget] = useState("");
    const [obsessionApplies, setObsessionApplies] = useState(false);
    const [scrutinyActive, setScrutinyActive] = useState(false);
    const [scrutinyLayers, setScrutinyLayers] = useState([]);
    // Each layer: { successes: number, target: number, complete: boolean }

    // Hydrate Scrutiny session from the persisted character record.
    // We track the last-seen character id so we don't clobber in-memory changes
    // on subsequent character.scrutiny_state updates from our own saves.
    const hydratedCharacterId = useRef(null);
    useEffect(() => {
        const charId = activeCharacter?.id;
        if (!charId || hydratedCharacterId.current === charId) return;

        const persisted = activeCharacter?.scrutiny_state || null;
        if (persisted && typeof persisted === "object") {
            if (typeof persisted.selectedArcanum === "string" && activeArcana.includes(persisted.selectedArcanum)) {
                setSelectedArcanum(persisted.selectedArcanum);
            }
            if (persisted.opacity !== undefined) setOpacity(String(persisted.opacity));
            if (typeof persisted.target === "string") setTarget(persisted.target);
            if (typeof persisted.obsessionApplies === "boolean") setObsessionApplies(persisted.obsessionApplies);
            if (typeof persisted.active === "boolean") setScrutinyActive(persisted.active);
            if (Array.isArray(persisted.layers)) setScrutinyLayers(persisted.layers);
        } else {
            // Fresh character — reset
            setScrutinyActive(false);
            setScrutinyLayers([]);
            setOpacity("0");
            setTarget("");
            setObsessionApplies(false);
        }
        hydratedCharacterId.current = charId;
    }, [activeCharacter?.id, activeCharacter?.scrutiny_state, activeArcana]);

    // Debounced persistence of scrutiny state to the character record.
    const persistTimer = useRef(null);
    const persistScrutinyState = (override = {}) => {
        if (!activeCharacter?.id) return;
        if (persistTimer.current) clearTimeout(persistTimer.current);
        const snapshot = {
            active: scrutinyActive,
            layers: scrutinyLayers,
            opacity,
            target,
            selectedArcanum,
            obsessionApplies,
            ...override,
        };
        persistTimer.current = setTimeout(() => {
            onUpdateCharacter?.({ scrutiny_state: snapshot });
        }, 400);
    };

    useEffect(() => () => {
        if (persistTimer.current) clearTimeout(persistTimer.current);
    }, []);

    useEffect(() => {
        if (!activeArcana.includes(selectedArcanum) && activeArcana.length > 0) {
            setSelectedArcanum(activeArcana[0]);
        }
    }, [activeArcana, selectedArcanum]);

    const buildMageSightEffect = (nextArcana) => {
        const extraArcana = nextArcana.filter((name) => !rulingArcana.includes(name));
        const plusLabel = extraArcana.length > 0 ? ` + ${extraArcana.join(" + ")}` : "";

        return {
            id: activeMageSight?.id || Date.now(),
            kind: "effect",
            effect_key: "mage-sight",
            name: `Mage Sight: ${currentPath}${plusLabel}`,
            arcanum: nextArcana.join(", "),
            practice: "Mage Sight",
            subtitle: `${currentPath} • ${nextArcana.join(", ")}`,
            description: nextArcana
                .map((name) => `${name}: ${MAGE_SIGHT_DESCRIPTIONS[name]}`)
                .join("\n"),
            extra_arcana: extraArcana,
        };
    };

    const activateMageSight = async () => {
        if (!currentPath || rulingArcana.length === 0) return;

        await onUpdateCharacter?.({
            active_spells: [
                ...activeSpells.filter((spell) => spell.effect_key !== "mage-sight"),
                buildMageSightEffect(rulingArcana),
            ],
        });
    };

    const addArcanumToMageSight = async (arcanum) => {
        if (currentMana < 1) return;

        const nextArcana = [...new Set([...activeArcana, arcanum])];

        await onUpdateCharacter?.({
            mana: Math.max(0, currentMana - 1),
            active_spells: [
                ...activeSpells.filter((spell) => spell.effect_key !== "mage-sight"),
                buildMageSightEffect(nextArcana),
            ],
        });
    };

    const deactivateMageSight = async () => {
        await onUpdateCharacter?.({
            active_spells: activeSpells.filter((spell) => spell.effect_key !== "mage-sight"),
        });
        setScrutinyActive(false);
        setScrutinyLayers([]);
    };

    // Persist whenever any of these state pieces change.
    useEffect(() => {
        if (hydratedCharacterId.current !== activeCharacter?.id) return;
        persistScrutinyState();
    }, [scrutinyActive, scrutinyLayers, opacity, target, selectedArcanum, obsessionApplies]);

    const applyScrutinySuccesses = (rolled, layers, startingOpacity, carryRemainder = false) => {
        const updatedLayers = layers.map((layer) => ({
            successes: Math.max(0, Number(layer.successes) || 0),
            target: Math.max(0, Number(layer.target) || 0),
            complete: !!layer.complete,
        }));

        let remaining = Math.max(0, Number(rolled) || 0);

        while (remaining > 0) {
            let currentLayer = updatedLayers.find((layer) => !layer.complete);

            if (!currentLayer) {
                const nextTarget = updatedLayers.length === 0
                    ? startingOpacity
                    : updatedLayers[updatedLayers.length - 1].target - 1;

                if (nextTarget <= 0) break;

                currentLayer = {
                    successes: 0,
                    target: nextTarget,
                    complete: false,
                };

                updatedLayers.push(currentLayer);
            }

            const needed = Math.max(0, currentLayer.target - currentLayer.successes);

            if (needed <= 0) {
                currentLayer.complete = true;
                continue;
            }

            const used = Math.min(remaining, needed);
            currentLayer.successes += used;
            remaining -= used;

            if (currentLayer.successes >= currentLayer.target) {
                currentLayer.successes = currentLayer.target;
                currentLayer.complete = true;

                const nextTarget = currentLayer.target - 1;
                const hasOpenLayer = updatedLayers.some((layer) => !layer.complete);

                if (nextTarget > 0 && !hasOpenLayer) {
                    updatedLayers.push({
                        successes: 0,
                        target: nextTarget,
                        complete: false,
                    });
                }

                if (carryRemainder) {
                    continue;
                }
            }

            break;
        }

        return updatedLayers;
    };

    const countCompletedLayers = (layers) => layers.filter(l => l.complete).length;

    const rollMageSight = async (mode) => {
        const gnosis = activeCharacter?.gnosis || 1;
        const arcanumDots = activeCharacter?.arcana?.[selectedArcanum] || 0;
        const opacityValue = Number.parseInt(opacity || "0", 10) || 0;
        const obsessionBonus = mode === "Scrutiny" && obsessionApplies ? 1 : 0;

        if (mode === "Scrutiny" && !scrutinyActive && currentWillpower < 1) return;

        if (mode === "Scrutiny" && !scrutinyActive) {
            await onUpdateCharacter?.({
                willpower: Math.max(0, currentWillpower - 1),
            });
            setScrutinyActive(true);
            setScrutinyLayers([{ successes: 0, target: opacityValue, complete: false }]);
        }

        const rawPool =
            mode === "Revelation"
                ? gnosis + arcanumDots - opacityValue
                : gnosis + arcanumDots + obsessionBonus;

        const chance = rawPool < 1;
        const pool = chance ? 1 : rawPool;
        const targetLine = target.trim() ? `Target: ${target.trim()}` : "Target: unspecified";

        const scrutinyStartingOpacity = scrutinyLayers.length > 0
            ? scrutinyLayers[0].target
            : opacityValue;

        const scrutinyTrackerLayers = scrutinyActive
            ? scrutinyLayers
            : opacityValue > 0
            ? [{ successes: 0, target: opacityValue, complete: false }]
            : [];

        onTriggerDiceRoll?.({
            pool,
            chance,
            again: 10,
            rote: false,
            exceptional_target: 5,
            label: `Mage Sight — ${mode} (${selectedArcanum})`,
            dicePoolBreakdown:
                mode === "Revelation"
                    ? `Gnosis ${gnosis} + ${selectedArcanum} ${arcanumDots} - Opacity ${opacityValue}`
                    : `Gnosis ${gnosis} + ${selectedArcanum} ${arcanumDots}${obsessionBonus ? " + Obsession 1" : ""}`,
            spellSummary:
                mode === "Scrutiny"
                    ? `${targetLine}\nFocused Mage Sight${!scrutinyActive ? "; costs 1 Willpower to begin" : " (ongoing)"}. Opacity: ${opacityValue}.`
                    : `${targetLine}\nFocused Mage Sight Revelation. Opacity: ${opacityValue}.`,
            countOnly: mode === "Scrutiny",
            scrutinyTracker: mode === "Scrutiny"
                ? {
                    startingOpacity: scrutinyStartingOpacity,
                    currentOpacity: opacityValue,
                    layers: scrutinyTrackerLayers,
                }
                : null,
            onResult: mode === "Scrutiny" ? (result) => {
                const rolled = result?.successes || 0;
                if (rolled > 0) {
                    const prevCompleted = countCompletedLayers(scrutinyLayers);
                    const startingOpacity = scrutinyLayers.length > 0 ? scrutinyLayers[0].target : opacityValue;
                    const newLayers = applyScrutinySuccesses(
                        rolled,
                        scrutinyLayers,
                        startingOpacity,
                        !!result?.is_exceptional
                    );
                    const newCompleted = countCompletedLayers(newLayers);
                    if (newCompleted > prevCompleted) {
                        setOpacity((prev) => String(Math.max(0, (Number.parseInt(prev || "0", 10) || 0) - (newCompleted - prevCompleted))));
                    }
                    setScrutinyLayers(newLayers);
                }
            } : undefined,
        });
    };

    const addScrutinyManaSuccess = async () => {
        if (currentMana < 1) return;
        await onUpdateCharacter?.({ mana: Math.max(0, currentMana - 1) });
        const prevCompleted = countCompletedLayers(scrutinyLayers);
        const startingOpacity = scrutinyLayers.length > 0 ? scrutinyLayers[0].target : (Number.parseInt(opacity || "0", 10) || 0);
        const newLayers = applyScrutinySuccesses(1, scrutinyLayers, startingOpacity);
        const newCompleted = countCompletedLayers(newLayers);
        if (newCompleted > prevCompleted) {
            setOpacity((prev) => String(Math.max(0, (Number.parseInt(prev || "0", 10) || 0) - (newCompleted - prevCompleted))));
        }
        setScrutinyLayers(newLayers);
    };

    const endScrutiny = () => {
        setScrutinyActive(false);
        setScrutinyLayers([]);
    };

    const scrutinyFullyUnveiled = scrutinyLayers.length > 0 && scrutinyLayers.every(l => l.complete) && (scrutinyLayers[scrutinyLayers.length - 1].target <= 1);
    const currentIncompleteLayer = scrutinyLayers.find(l => !l.complete);
    const showManaButton = scrutinyActive && !scrutinyFullyUnveiled && currentIncompleteLayer && currentIncompleteLayer.successes > 0;

    return (
        <div className="bg-zinc-950 border border-blue-500/30 rounded-md p-3 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h4 className="text-sm font-medium text-blue-300">
                        Mage Sight{currentPath ? `: ${currentPath}` : ""}
                    </h4>
                    <p className="text-xs text-zinc-400">
                        {activeMageSight
                            ? activeArcana.join(", ")
                            : rulingArcana.length > 0
                                ? `${rulingArcana.join(", ")} available`
                                : "No Path selected"}
                    </p>
                </div>

                {activeMageSight ? (
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-[10px] border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30"
                        onClick={deactivateMageSight}
                        title="Deactivate Mage Sight"
                        data-testid="deactivate-mage-sight-btn"
                    >
                        Dismiss
                    </Button>
                ) : (
                    <Button
                        type="button"
                        size="sm"
                        className="h-7 px-2 text-[10px] btn-secondary"
                        onClick={activateMageSight}
                        disabled={!currentPath || rulingArcana.length === 0}
                    >
                        Activate
                    </Button>
                )}
            </div>

            {activeMageSight?.description && (
                <div className="rounded-sm bg-zinc-900/40 border border-zinc-800 p-2">
                    <p className="text-xs text-zinc-300 whitespace-pre-line">
                        {activeMageSight.description}
                    </p>
                </div>
            )}

            {activeMageSight && availableExtraArcana.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {availableExtraArcana.map((arcanum) => (
                        <Button
                            key={arcanum}
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-[10px] text-blue-300 border border-zinc-700 hover:bg-blue-950/30"
                            onClick={() => addArcanumToMageSight(arcanum)}
                            disabled={currentMana < 1}
                        >
                            + {arcanum}
                        </Button>
                    ))}
                </div>
            )}

            {activeMageSight && (
                <div className="space-y-2 border-t border-zinc-800 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                Arcanum
                            </label>
                            <Select value={selectedArcanum} onValueChange={setSelectedArcanum}>
                                <SelectTrigger className="h-7 bg-zinc-900/50 border-zinc-800 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    {activeArcana.map((arcanum) => (
                                        <SelectItem key={arcanum} value={arcanum} className="text-xs">
                                            {arcanum}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                Opacity
                            </label>
                            <Input
                                value={opacity}
                                onChange={(e) => setOpacity(e.target.value)}
                                className="input-geist h-7 text-xs"
                                type="number"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                Target
                            </label>
                            <Input
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="input-geist h-7 text-xs"
                                placeholder="Object, person, room"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-zinc-400">
                        <input
                            type="checkbox"
                            checked={obsessionApplies}
                            onChange={(e) => setObsessionApplies(e.target.checked)}
                        />
                        Obsession applies to Scrutiny
                    </label>

                    <div className="flex flex-wrap gap-1">
                        <Button
                            type="button"
                            size="sm"
                            className="h-7 px-2 text-xs btn-secondary"
                            onClick={() => rollMageSight("Revelation")}
                        >
                            Revelation
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            className={`h-7 px-2 text-xs ${scrutinyActive ? "bg-amber-600/40 border-amber-500 text-amber-200 hover:bg-amber-600/60" : "btn-secondary"}`}
                            onClick={() => rollMageSight("Scrutiny")}
                            disabled={!scrutinyActive && currentWillpower < 1}
                            data-testid="scrutiny-btn"
                        >
                            Scrutiny{scrutinyActive ? " (Active)" : ""}
                        </Button>

                        {scrutinyActive && (
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs text-zinc-400 hover:text-rose-400"
                                onClick={endScrutiny}
                                data-testid="end-scrutiny-btn"
                            >
                                End Scrutiny
                            </Button>
                        )}
                    </div>

                    {scrutinyActive && (
                        <div className="p-2 rounded-sm bg-amber-950/30 border border-amber-500/30 space-y-2" data-testid="scrutiny-tracker">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-amber-400 uppercase tracking-wider">Scrutiny Tracker</span>
                            </div>
                            <div className="space-y-1">
                                {scrutinyLayers.map((layer, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className={`text-xs font-mono ${layer.complete ? "text-emerald-400" : "text-amber-300"}`} data-testid={`scrutiny-layer-${i}`}>
                                            Successes: {layer.successes}/{layer.target}
                                        </span>
                                        {layer.complete && <span className="text-[10px] text-emerald-500">&#10003;</span>}
                                    </div>
                                ))}
                            </div>
                            {showManaButton && (
                                <Button
                                    type="button"
                                    size="sm"
                                    className="h-6 px-2 text-[10px] bg-violet-900/40 border border-violet-500/40 text-violet-300 hover:bg-violet-800/50"
                                    onClick={addScrutinyManaSuccess}
                                    disabled={currentMana < 1}
                                    data-testid="scrutiny-mana-btn"
                                >
                                    +1 Success (1 Mana)
                                </Button>
                            )}
                            {scrutinyFullyUnveiled && (
                                <p className="text-[10px] text-emerald-400">Mystery fully unveiled.</p>
                            )}
                        </div>
                    )}

                    {!scrutinyActive && currentWillpower < 1 && (
                        <p className="text-[10px] text-rose-400">
                            Scrutiny requires 1 Willpower.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export { MageSightCard };
