import { useState, forwardRef, useImperativeHandle, useRef, useEffect, useCallback, useMemo } from "react";
import { Dices, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SPELL_EXCEPTIONAL_CHOICES = [
    {
        id: "bonus_factor_step",
        label: "Bonus step in primary spell factor",
        transcript: "Chosen benefit: bonus step in the primary spell factor.",
    },
    {
        id: "reach_primary_factor",
        label: "Reach in primary spell factor",
        transcript: "Chosen benefit: Reach in the primary spell factor.",
    },
    {
        id: "arcane_beat_condition",
        label: "Condition for Arcane Beats",
        transcript: "Chosen benefit: Condition which grants Arcane Beats when resolved.",
    },
    {
        id: "refund_mana",
        label: "Refund Mana and gain +1 Mana",
        transcript: "Chosen benefit: all Mana spent on the spell is refunded, and the mage gains +1 Mana.",
    },
    {
        id: "ignore_withstand",
        label: "Ignore Withstand",
        transcript: "Chosen benefit: spell ignores Withstand and takes effect at full Potency.",
    },
];

export const DiceRoller = forwardRef(({ embedded = false, collapsed = false, onToggleCollapsed = null }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [pool, setPool] = useState(3);
    const [again, setAgain] = useState("10");
    const [rote, setRote] = useState(false);
    const [chance, setChance] = useState(false);
    const [countOnly, setCountOnly] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const [result, setResult] = useState(null);
    const [rollLabel, setRollLabel] = useState(null);
    const [pendingParadox, setPendingParadox] = useState(null);
    const [exceptionalTarget, setExceptionalTarget] = useState(5);
    const [lastRollConfig, setLastRollConfig] = useState(null);
    const [rollHistory, setRollHistory] = useState([]);
    const [rollSequence, setRollSequence] = useState([]);
    const [historyToken, setHistoryToken] = useState(0);
    const [pendingSpellExceptionalChoice, setPendingSpellExceptionalChoice] = useState(null);

    // External roll trigger
    const pendingRollRef = useRef(null);
    const completedRollRef = useRef(null);
    const [triggerExternal, setTriggerExternal] = useState(0);

    const performRoll = useCallback(async (
        rollPool,
        rollAgain,
        rollRote,
        rollChance,
        rollExceptionalTarget,
        options = {}
    ) => {
        setIsRolling(true);
        setResult(null);
        try {
            const response = await axios.post(`${API}/dice/roll`, {
                pool: rollChance ? 1 : rollPool,
                again: parseInt(rollAgain),
                rote: rollRote,
                chance: rollChance,
                exceptional_target: rollExceptionalTarget || 5,
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            setResult(response.data);

            const completedPayload = {
                result: response.data,
                config: options.summaryConfig || {
                    pool: rollChance ? 1 : rollPool,
                    again: parseInt(rollAgain),
                    rote: rollRote,
                    chance: rollChance,
                    exceptional_target: rollExceptionalTarget || 5,
                    label: null,
                    dicePoolBreakdown: rollChance ? "Chance Die" : `${rollPool} dice`,
                    spellSummary: "",
                },
                title:
                    options.summaryConfig?.label ||
                    options.summaryLabel ||
                    "Roll",
                onResult: options.onResult,
            };

            if (
                response.data?.is_exceptional &&
                completedPayload.config?.requiresSpellExceptionalChoice &&
                completedPayload.config?.summaryKey === "spell"
            ) {
                setPendingSpellExceptionalChoice(completedPayload);
            } else {
                completedRollRef.current = completedPayload;
                setHistoryToken((prev) => prev + 1);
            }

            const isPendingSpellExceptionalChoice =
                response.data?.is_exceptional &&
                completedPayload.config?.requiresSpellExceptionalChoice &&
                completedPayload.config?.summaryKey === "spell";

            if (options.summaryLabel && !isPendingSpellExceptionalChoice) {
                const entry = {
                    key: options.summaryKey || options.summaryLabel,
                    label: options.summaryLabel,
                    result: response.data,
                    config: options.summaryConfig || null,
                };

                setRollSequence((prev) => {
                    const existingIndex = prev.findIndex((item) => item.key === entry.key);

                    if (existingIndex >= 0) {
                        const next = [...prev];
                        next[existingIndex] = entry;
                        return next;
                    }

                    return [...prev, entry];
                });
            }

            if (response.data.is_dramatic_failure) {
                toast.error("Dramatic Failure!", {
                    description: "The spirits turn against you...",
                });
            } else if (response.data.is_exceptional) {
                toast.success("Exceptional Success!", {
                    description: `${response.data.successes} successes!`,
                });
            }

            if (
                typeof options.onResult === "function" &&
                !(response.data?.is_exceptional && options.summaryConfig?.requiresSpellExceptionalChoice && options.summaryConfig?.summaryKey === "spell")
            ) {
                options.onResult(response.data);
            }
        } catch (error) {
            toast.error("Failed to roll dice");
        } finally {
            setIsRolling(false);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        rollWithConfig: (config) => {
            pendingRollRef.current = config;
            setTriggerExternal(prev => prev + 1);
        },
        addHistoryEntry: (entry) => {
            addHistoryEntry(entry);
        },
    }));

    useEffect(() => {
        if (pendingRollRef.current) {
            const config = pendingRollRef.current;
            pendingRollRef.current = null;

            setPool(config.pool || 1);
            setChance(config.chance || false);
            setAgain(String(config.again || 10));
            setRote(config.rote || false);
            setRollLabel(config.label || null);
            setExceptionalTarget(config.exceptional_target || 5);
            setLastRollConfig(config);
            setIsOpen(true);
            setIsMinimized(false);
            setResult(null);

            if (config.resetSummary || !config.appendToSummary) {
                setRollSequence([]);
            }

            if (config.paradox) {
                setPendingParadox(config.paradox);
            } else {
                setPendingParadox(null);
            }

            performRoll(
                config.pool || 1,
                config.again || 10,
                config.rote || false,
                config.chance || false,
                config.exceptional_target || 5,
                {
                    onResult: config.onResult,
                    summaryKey: config.summaryKey,
                    summaryLabel: config.summaryLabel,
                    summaryConfig: config,
                }
            );
        }
    }, [triggerExternal, performRoll]);

    const rollParadox = () => {
        if (!pendingParadox) return;

        const pConfig = pendingParadox;

        setPool(pConfig.pool || 1);
        setChance(pConfig.chance || false);
        setAgain(String(pConfig.again || 10));
        setRote(pConfig.rote || false);
        setRollLabel(pConfig.label || "Paradox Roll");
        setLastRollConfig(pConfig);
        setResult(null);

        if (pConfig.resetSummary || !pConfig.appendToSummary) {
            setRollSequence([]);
        }

        setPendingParadox(null);

        performRoll(
            pConfig.pool || 1,
            pConfig.again || 10,
            pConfig.rote || false,
            pConfig.chance || false,
            pConfig.exceptional_target || 5,
            {
                onResult: pConfig.onResult,
                summaryKey: pConfig.summaryKey,
                summaryLabel: pConfig.summaryLabel,
                summaryConfig: pConfig,
            }
        );
    };

    const rollDice = () => {
        setRollLabel(null);
        setPendingParadox(null);
        setExceptionalTarget(5);
        setRollSequence([]);
        setIsOpen(false);
        setIsMinimized(false);

        const manualConfig = {
            pool,
            again: parseInt(again),
            rote,
            chance,
            countOnly,
            exceptional_target: 5,
            label: null,
            dicePoolBreakdown: chance ? "Chance Die" : `${pool} dice`,
            spellSummary: "",
        };

        setLastRollConfig(manualConfig);

        performRoll(pool, parseInt(again), rote, chance, 5, {
            summaryConfig: manualConfig,
        });
    };

    const formatOutcomeLine = (rollResult, countOnlyResult = false) => {
        const successes = rollResult?.successes || 0;
        const successText = `${successes} Success${successes === 1 ? "" : "es"}`;

        if (rollResult?.is_dramatic_failure) {
            return `${successText} = Dramatic Failure...`;
        }

        if (rollResult?.is_exceptional) {
            return `${successText} = Exceptional Success!`;
        }

        if (countOnlyResult) {
            return successText;
        }

        if (successes > 0) {
            return `${successText} = Success`;
        }

        return "0 Successes = Failure";
    };

    const buildAttackDamageLine = (rollResult, config = {}) => {
        if (!config.isAttack) return "";

        const successes = Math.max(0, Number(rollResult?.successes) || 0);
        const weaponDamage = Math.max(0, Number(config.weaponDamage) || 0);
        const successText = `${successes} Success${successes === 1 ? "" : "es"}`;

        if (successes <= 0) {
            return "Damage: 0";
        }

        return `Damage: ${successText} + Weapon Damage ${weaponDamage} = ${successes + weaponDamage}`;
    };

    const formatSuccessCount = (successes = 0) =>
        `${successes} Success${successes === 1 ? "" : "es"}`;

    const cloneScrutinyLayers = (layers = []) =>
        Array.isArray(layers)
            ? layers.map((layer) => ({
                successes: Math.max(0, Number(layer.successes) || 0),
                target: Math.max(0, Number(layer.target) || 0),
                complete: !!layer.complete,
            }))
            : [];

    const countCompletedScrutinyLayers = (layers = []) =>
        layers.filter((layer) => layer.complete).length;

    const applyScrutinyTrackerSuccesses = (rolled, layers, startingOpacity, carryRemainder = false) => {
        const updatedLayers = cloneScrutinyLayers(layers);
        let remaining = Math.max(0, Number(rolled) || 0);
        let applied = 0;

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
            applied += used;
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

        return {
            layers: updatedLayers,
            applied,
        };
    };

    const buildScrutinyTrackerSummary = (rollResult, config = {}) => {
        const tracker = config.scrutinyTracker;
        if (!tracker) return "";

        const rolled = Math.max(0, Number(rollResult?.successes) || 0);
        const startingOpacity = Math.max(0, Number(tracker.startingOpacity) || 0);
        const opacityBefore = Math.max(0, Number(tracker.currentOpacity) || startingOpacity);
        const beforeLayers = cloneScrutinyLayers(tracker.layers);

        const activeBeforeLayers = beforeLayers.length > 0
            ? beforeLayers
            : startingOpacity > 0
            ? [{ successes: 0, target: startingOpacity, complete: false }]
            : [];

        const completedBefore = countCompletedScrutinyLayers(activeBeforeLayers);
        const trackerUpdate = applyScrutinyTrackerSuccesses(
            rolled,
            activeBeforeLayers,
            startingOpacity,
            !!rollResult?.is_exceptional
        );
        const afterLayers = trackerUpdate.layers;
        const appliedSuccesses = trackerUpdate.applied;
        const completedAfter = countCompletedScrutinyLayers(afterLayers);
        const opacityReduction = Math.max(0, completedAfter - completedBefore);
        const opacityAfter = Math.max(0, opacityBefore - opacityReduction);

        const layerLines = afterLayers.map((layer, index) => {
            const status = layer.complete ? " complete" : "";
            return `Layer ${index + 1}: ${layer.successes}/${layer.target}${status}`;
        });

        return [
            "Scrutiny Tracker:",
            `Scrutiny successes applied: ${appliedSuccesses}`,
            ...layerLines,
            `Opacity: ${opacityBefore} → ${opacityAfter}`,
        ].join("\n");
    };

    const buildContainmentTranscript = (paradoxResult, wisdomResult, paradoxConfig = {}, wisdomConfig = {}) => {
        const paradoxSuccesses = paradoxResult?.successes || 0;
        const wisdomSuccesses = wisdomResult?.successes || 0;
        const negated = Math.min(paradoxSuccesses, wisdomSuccesses);
        const remaining = Math.max(0, paradoxSuccesses - wisdomSuccesses);

        const paradoxDice = paradoxConfig.chance ? "Chance Die" : `${paradoxConfig.pool || 1} dice`;
        const wisdomDice = wisdomConfig.chance ? "Chance Die" : wisdomConfig.pool || 1;

        return [
            "-Contained Paradox-",
            ...(paradoxConfig.paradoxSummary ? [paradoxConfig.paradoxSummary] : []),
            `Rolled Paradox (${paradoxDice}) vs. Wisdom ${wisdomDice}`,
            `Successes: ${paradoxSuccesses} Paradox - ${wisdomSuccesses} Wisdom`,
            `Result: ${negated} Paradox negated; ${negated} Bashing Damage`,
            `Remaining Paradox: ${remaining}; ${remaining > 0 ? "Paradox Condition" : "No Paradox Condition"}`,
        ].join("\n");
    };

    const buildReleaseTranscript = (paradoxResult, paradoxConfig = {}) => {
        const paradoxSuccesses = paradoxResult?.successes || 0;
        const paradoxDice = paradoxConfig.chance ? "Chance Die" : `${paradoxConfig.pool || 1} dice`;

        return [
            "-Released Paradox-",
            ...(paradoxConfig.paradoxSummary ? [paradoxConfig.paradoxSummary] : []),
            `Rolled Paradox (${paradoxDice})`,
            `${paradoxSuccesses} Success${paradoxSuccesses === 1 ? "" : "es"} = ${paradoxSuccesses} Paradox Reach`,
        ].join("\n");
    };

    const buildContainmentOutcomeLine = (paradoxResult, wisdomResult) => {
        const paradoxSuccesses = paradoxResult?.successes || 0;
        const wisdomSuccesses = wisdomResult?.successes || 0;
        const negated = Math.min(paradoxSuccesses, wisdomSuccesses);
        const remaining = Math.max(0, paradoxSuccesses - wisdomSuccesses);

        return `Result: ${negated} Paradox negated; ${negated} Bashing Damage; Remaining Paradox: ${remaining}; ${remaining > 0 ? "Paradox Condition" : "No Paradox Condition"}`;
    };

    const formatDiceRows = (rollResult) => {
        if (!rollResult) return "";

        const firstRow = Array.isArray(rollResult.dice) ? rollResult.dice.map(String) : [];
        if (!firstRow.length) return "";

        const extraRows = [];

        // Supports several possible backend shapes safely
        if (Array.isArray(rollResult.rerolls)) {
            if (rollResult.rerolls.every((row) => Array.isArray(row))) {
                rollResult.rerolls.forEach((row) => {
                    extraRows.push(row.map((value) => (value === null || value === undefined ? "" : String(value))));
                });
            } else {
                extraRows.push(rollResult.rerolls.map((value) => (value === null || value === undefined ? "" : String(value))));
            }
        } else if (Array.isArray(rollResult.exploded_dice)) {
            if (rollResult.exploded_dice.every((row) => Array.isArray(row))) {
                rollResult.exploded_dice.forEach((row) => {
                    extraRows.push(row.map((value) => (value === null || value === undefined ? "" : String(value))));
                });
            } else {
                extraRows.push(rollResult.exploded_dice.map((value) => (value === null || value === undefined ? "" : String(value))));
            }
        }

        const rows = [firstRow, ...extraRows];
        const width = Math.max(...rows.map((row) => row.length), 0);

        const normalizedRows = rows.map((row) => {
            const copy = [...row];
            while (copy.length < width) copy.push("");
            return copy;
        });

        return normalizedRows
            .map((row) =>
                row
                    .map((cell) => (cell ? cell.padStart(2, " ") : "  "))
                    .join(" ")
                    .replace(/\s+$/, "")
            )
            .join("\n");
    };

    const copyText = async (text, successMessage = "Copied") => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(successMessage);
        } catch {
            toast.error("Failed to copy");
        }
    };

    const addHistoryEntry = useCallback((entry) => {
        if (!entry?.transcript) return;

        const nextEntry = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: entry.title || "Roll",
            transcript: entry.transcript,
            outcome: entry.outcome || "",
        };

        setRollHistory((prev) => [nextEntry, ...prev].slice(0, 20));
    }, []);

    const getSpellPrimaryFactorLabel = (config = {}) => {
        if (config.spellPrimaryFactorLabel) return config.spellPrimaryFactorLabel;

        if (config.spellPrimaryFactor === "potency") return "Potency";
        if (config.spellPrimaryFactor === "duration") return "Duration";
        if (config.spellPrimaryFactor === "scale") return "Scale";

        return "Primary Factor";
    };

    const buildSpellExceptionalChoiceTranscript = (choice, config = {}) => {
        if (!choice) return "";

        const primaryFactorLabel = getSpellPrimaryFactorLabel(config);
        const manaSpent = Math.max(0, Number(config.spellExceptionalManaSpent) || 0);

        const resourceLines = ["Willpower regained: +1."];

        if (choice.id === "refund_mana") {
            resourceLines.push(`Mana regained: ${manaSpent} refunded + 1 = ${manaSpent + 1}.`);
        }

        if (choice.id === "bonus_factor_step") {
            return [
                ...resourceLines,
                `Chosen benefit: +1 ${primaryFactorLabel}.`,
            ].join("\n");
        }

        if (choice.id === "reach_primary_factor") {
            return [
                ...resourceLines,
                `Chosen benefit: Advanced ${primaryFactorLabel}.`,
            ].join("\n");
        }

        return [
            ...resourceLines,
            choice.transcript || "",
        ].join("\n");
    };
    
    const formatTranscriptFromConfig = (rollResult, config = {}) => {
        if (!rollResult) return "";

        const poolSize = config.chance ? 1 : (config.pool ?? pool);
        const againValue = config.chance
            ? "Chance"
            : (config.again ?? again) === 11
            ? "No Again"
            : `${config.again ?? again}!`;

        const poolBreakdown =
            config.dicePoolBreakdown ||
            config.label ||
            (config.chance ? "Chance Die" : `${poolSize} dice`);

        const spellSummary = config.spellSummary || "";
        const scrutinyTrackerSummary = buildScrutinyTrackerSummary(rollResult, config);
        const countOnlyResult = !!(config.countOnly || config.isAttack || config.scrutinyTracker);
        const outcomeLine = formatOutcomeLine(rollResult, countOnlyResult);
        const exceptionalChoiceTranscript = buildSpellExceptionalChoiceTranscript(
            config.exceptionalSuccessChoice,
            config
        );

        const exceptionalChoiceLine = rollResult?.is_exceptional && exceptionalChoiceTranscript
            ? [
                "Exceptional Spellcasting Success:",
                exceptionalChoiceTranscript,
            ].join("\n")
            : "";
        const attackDamageLine = buildAttackDamageLine(rollResult, config);
        const diceRows = formatDiceRows(rollResult);

        return [
            `Rolled ${poolBreakdown} = ${poolSize} dice [${againValue}]`,
            ...(spellSummary ? [spellSummary] : []),
            ...(scrutinyTrackerSummary ? [scrutinyTrackerSummary] : []),
            outcomeLine,
            ...(exceptionalChoiceLine ? [exceptionalChoiceLine] : []),
            ...(attackDamageLine ? [attackDamageLine] : []),
            ...(diceRows ? [diceRows] : []),
        ].join("\n");
    };

    const formattedRollTranscript = useMemo(() => {
        if (rollSequence.length > 0) {
            const paradoxEntry = rollSequence.find((entry) => entry.key === "paradox");
            const wisdomEntry = rollSequence.find((entry) => entry.key === "wisdom");
            const spellEntry = rollSequence.find((entry) => entry.key === "spell");

            const blocks = [];

            if (paradoxEntry && wisdomEntry) {
                blocks.push(
                    buildContainmentTranscript(
                        paradoxEntry.result,
                        wisdomEntry.result,
                        paradoxEntry.config || {},
                        wisdomEntry.config || {}
                    )
                );
            } else if (paradoxEntry && spellEntry) {
                blocks.push(buildReleaseTranscript(paradoxEntry.result, paradoxEntry.config || {}));
            } else if (paradoxEntry) {
                blocks.push(formatTranscriptFromConfig(paradoxEntry.result, paradoxEntry.config));
            }

            if (spellEntry) {
                blocks.push(formatTranscriptFromConfig(spellEntry.result, spellEntry.config));
            }

            return blocks.join("\n\n").trim();
        }

        if (!result) return "";

        return formatTranscriptFromConfig(
            result,
            lastRollConfig || {
                pool,
                again: parseInt(again),
                chance,
                countOnly,
                label: rollLabel,
            }
        );
    }, [rollSequence, result, lastRollConfig, pool, again, chance, countOnly, rollLabel]);

    const resolveSpellExceptionalChoice = (choice) => {
        if (!pendingSpellExceptionalChoice) return;

        const nextConfig = {
            ...(pendingSpellExceptionalChoice.config || {}),
            exceptionalSuccessChoice: choice,
        };

        completedRollRef.current = {
            ...pendingSpellExceptionalChoice,
            config: nextConfig,
        };

        setRollSequence((prev) => {
            const entry = {
                key: nextConfig.summaryKey || "spell",
                label: nextConfig.summaryLabel || nextConfig.label || "Spell",
                result: pendingSpellExceptionalChoice.result,
                config: nextConfig,
            };

            const existingIndex = prev.findIndex((item) => item.key === entry.key);

            if (existingIndex >= 0) {
                const next = [...prev];
                next[existingIndex] = entry;
                return next;
            }

            return [...prev, entry];
        });

        setPendingSpellExceptionalChoice(null);

        if (typeof pendingSpellExceptionalChoice.onResult === "function") {
            pendingSpellExceptionalChoice.onResult(pendingSpellExceptionalChoice.result, choice);
        }

        setHistoryToken((prev) => prev + 1);
    };

    const visible = embedded || isOpen;

    useEffect(() => {
        if (historyToken === 0 || !completedRollRef.current) return;

        const { result: completedResult, config: completedConfig, title } = completedRollRef.current;

        if (completedConfig?.summaryKey === "paradox" || completedConfig?.summaryKey === "wisdom") {
            return;
        }

        let transcript = formatTranscriptFromConfig(completedResult, completedConfig || {});

        if (completedConfig?.summaryKey === "spell") {
            const paradoxEntry = rollSequence.find((entry) => entry.key === "paradox");
            const wisdomEntry = rollSequence.find((entry) => entry.key === "wisdom");

            if (paradoxEntry && wisdomEntry) {
                transcript = [
                    buildContainmentTranscript(
                        paradoxEntry.result,
                        wisdomEntry.result,
                        paradoxEntry.config || {},
                        wisdomEntry.config || {}
                    ),
                    formatTranscriptFromConfig(completedResult, completedConfig || {}),
                ].join("\n\n");
            } else if (paradoxEntry) {
                transcript = [
                    buildReleaseTranscript(paradoxEntry.result, paradoxEntry.config || {}),
                    formatTranscriptFromConfig(completedResult, completedConfig || {}),
                ].join("\n\n");
            }
        }

        if (!transcript) return;

        const nextEntry = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: title || completedConfig?.label || "Roll",
            transcript,
            outcome: formatOutcomeLine(
                completedResult,
                !!(completedConfig?.countOnly || completedConfig?.isAttack || completedConfig?.scrutinyTracker)
            ),
        };

        setRollHistory((prev) => [nextEntry, ...prev].slice(0, 20));

        // Clear the ref so subsequent dep changes (e.g. rollSequence reset on
        // the next roll trigger) don't re-add the same entry.
        completedRollRef.current = null;
    }, [historyToken, rollSequence]);

    if (!visible) {
        return null;
    }

    if (embedded && collapsed) {
        return (
            <div
                className="h-full flex items-start justify-center bg-zinc-900/60 border-l border-zinc-800 pt-3"
                data-testid="dice-roller-panel"
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleCollapsed}
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-200"
                    data-testid="expand-last-rolls-btn"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <div
            className={
                embedded
                    ? "h-full flex flex-col bg-zinc-900/60 border-l border-zinc-800"
                    : `fixed bottom-6 right-6 w-80 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-md shadow-deep z-[60] transition-all ${
                        isMinimized ? "h-12" : ""
                    }`
            }
            data-testid="dice-roller-panel"
        >
            <Dialog open={!!pendingSpellExceptionalChoice}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                    <DialogHeader>
                        <DialogTitle>Exceptional Spellcasting Success</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Regain 1 Willpower, then choose one spellcasting benefit before the roll is added to Recent Rolls.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        {SPELL_EXCEPTIONAL_CHOICES.map((choice) => (
                            <Button
                                key={choice.id}
                                type="button"
                                variant="outline"
                                className="w-full justify-start text-left border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800"
                                onClick={() => resolveSpellExceptionalChoice(choice)}
                            >
                                {choice.label}
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>        
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                    <Dices className="w-5 h-5 text-teal-400" />
                    <span className="font-heading text-lg text-zinc-200">
                        {embedded ? "Last Rolls" : "Dice Roller"}
                    </span>
                </div>

                {embedded ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleCollapsed}
                        className="h-7 w-7 text-zinc-500 hover:text-zinc-300"
                        data-testid="collapse-last-rolls-btn"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                ) : (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="h-7 w-7 text-zinc-500 hover:text-zinc-300"
                            data-testid="minimize-dice-roller-btn"
                        >
                            {isMinimized ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setIsOpen(false);
                                setPendingParadox(null);
                                setRollLabel(null);
                                setLastRollConfig(null);
                                setRollSequence([]);
                            }}
                            className="h-7 w-7 text-zinc-500 hover:text-zinc-300"
                            data-testid="close-dice-roller-btn"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            {(!embedded ? !isMinimized : true) && (
                <div className="p-4 space-y-4 overflow-y-auto">
                    {embedded ? (
                        <div className="p-3 rounded-sm border bg-zinc-950/40 border-zinc-800 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-xs uppercase text-zinc-500">Recent Rolls</p>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                                    onClick={() => setRollHistory([])}
                                >
                                    Clear
                                </Button>
                            </div>

                            {rollHistory.length === 0 ? (
                                <p className="text-xs text-zinc-500">No rolls yet.</p>
                            ) : (
                                <div className="space-y-2 max-h-[72vh] overflow-y-auto pr-1">
                                    {rollHistory.map((entry) => (
                                        <div key={entry.id} className="rounded-sm border border-zinc-800 bg-zinc-900/50 p-2 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-[11px] uppercase text-teal-400">{entry.title}</p>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 px-2 text-[10px] text-zinc-400 hover:text-zinc-200"
                                                    onClick={() => copyText(entry.transcript, "Roll copied")}
                                                    data-testid={`recent-roll-copy-${entry.id}`}
                                                >
                                                    Copy
                                                </Button>
                                            </div>

                                            <pre className="whitespace-pre-wrap break-words text-[11px] text-zinc-300 font-mono leading-relaxed">
                                    {entry.transcript}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Roll Label */}
                            {rollLabel && (
                                <div className="px-2 py-1.5 bg-violet-900/30 border border-violet-500/30 rounded text-xs text-violet-300 text-center" data-testid="roll-label">
                                    {rollLabel}
                                </div>
                            )}

                            {/* Dice Pool */}
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-zinc-400">Dice Pool</label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setPool(Math.max(1, pool - 1))}
                                        className="h-8 w-8 text-zinc-400"
                                        disabled={chance}
                                        data-testid="decrease-pool-btn"
                                    >
                                        -
                                    </Button>
                                    <Input
                                        type="number"
                                        value={chance ? 1 : pool}
                                        onChange={(e) => setPool(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-16 text-center input-geist"
                                        disabled={chance}
                                        data-testid="dice-pool-input"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setPool(pool + 1)}
                                        className="h-8 w-8 text-zinc-400"
                                        disabled={chance}
                                        data-testid="increase-pool-btn"
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            {/* Again */}
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-zinc-400">Exploding Dice</label>
                                <Select value={again} onValueChange={setAgain} disabled={chance}>
                                    <SelectTrigger className="w-32 bg-zinc-900/50 border-zinc-800" data-testid="again-select">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="10" className="text-zinc-200">10-again</SelectItem>
                                        <SelectItem value="9" className="text-zinc-200">9-again</SelectItem>
                                        <SelectItem value="8" className="text-zinc-200">8-again</SelectItem>
                                        <SelectItem value="11" className="text-zinc-200">No again</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Rote */}
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-zinc-400">Rote Quality</label>
                                <Switch
                                    checked={rote}
                                    onCheckedChange={setRote}
                                    disabled={chance}
                                    data-testid="rote-switch"
                                />
                            </div>

                            {/* Chance Die */}
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-zinc-400">Chance Die</label>
                                <Switch
                                    checked={chance}
                                    onCheckedChange={(checked) => {
                                        setChance(checked);
                                        if (checked) {
                                            setRote(false);
                                        }
                                    }}
                                    data-testid="chance-switch"
                                />
                            </div>

                            {/* Contested / Count Only */}
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-zinc-400">Contested / Count Only</label>
                                <Switch
                                    checked={countOnly}
                                    onCheckedChange={setCountOnly}
                                    data-testid="count-only-switch"
                                />
                            </div>

                            {/* Roll Button */}
                            <Button
                                onClick={rollDice}
                                disabled={isRolling}
                                className="w-full btn-primary h-12 text-base"
                                data-testid="roll-dice-btn"
                            >
                                {isRolling ? (
                                    <span className="flex items-center gap-2">
                                        <Dices className="w-5 h-5 animate-dice-roll" />
                                        Rolling...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Dices className="w-5 h-5" />
                                        Roll {chance ? "Chance" : pool} {chance || pool === 1 ? "Die" : "Dice"}
                                    </span>
                                )}
                            </Button>

                            {/* Result */}
                            {result && (
                                <div
                                    className={`p-4 rounded-sm border animate-fade-in ${
                                        result.is_dramatic_failure
                                            ? "bg-rose-950/30 border-rose-500/30"
                                            : result.is_exceptional
                                            ? "bg-teal-950/30 border-teal-500/30"
                                            : result.successes > 0
                                            ? "bg-zinc-800/50 border-zinc-700"
                                            : "bg-zinc-900/50 border-zinc-800"
                                    }`}
                                    data-testid="dice-result"
                                >
                                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                                        {result.dice.map((die, index) => (
                                            <div
                                                key={index}
                                                className={`w-10 h-10 rounded-sm flex items-center justify-center font-mono text-lg font-bold transition-all ${
                                                    die >= 8
                                                        ? "bg-teal-900/50 border border-teal-500/50 text-teal-300"
                                                        : die === 1 && result.is_dramatic_failure
                                                        ? "bg-rose-900/50 border border-rose-500/50 text-rose-300"
                                                        : "bg-zinc-800 border border-zinc-700 text-zinc-400"
                                                }`}
                                                style={{ animationDelay: `${index * 50}ms` }}
                                                data-testid={`die-${index}`}
                                            >
                                                {die}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-center">
                                        <p
                                            className={`font-heading text-xl ${
                                                result.is_dramatic_failure
                                                    ? "text-rose-400"
                                                    : result.is_exceptional
                                                    ? "text-teal-400"
                                                    : result.successes > 0
                                                    ? "text-zinc-200"
                                                    : "text-zinc-500"
                                            }`}
                                        >
                                            {result.successes} {result.successes === 1 ? "Success" : "Successes"}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-1">{result.description}</p>
                                    </div>
                                </div>
                            )}

                            {/* Paradox Roll Button */}
                            {pendingParadox && result && !isRolling && (
                                <Button
                                    onClick={rollParadox}
                                    className="w-full h-10 bg-red-900/50 hover:bg-red-800/50 border border-red-500/50 text-red-300"
                                    data-testid="roll-paradox-btn"
                                >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Roll Paradox ({pendingParadox.chance ? "Chance Die" : `${pendingParadox.pool} dice`})
                                </Button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
});

DiceRoller.displayName = "DiceRoller";
