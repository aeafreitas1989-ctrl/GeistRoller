import { useState } from "react";
import { ChevronDown, ChevronRight, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";

export const formatLabel = (value) => value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export const HEALTH_STATES = ["empty", "bashing", "lethal", "aggravated"];
export const HEALTH_SYMBOLS = { bashing: "/", lethal: "X", aggravated: "*" };

export const normalizeHealthBoxes = (boxes, max, fallback = 0) => {
    let normalized = Array.isArray(boxes) ? [...boxes] : [];
    if (normalized.length === 0 && fallback > 0) {
        normalized = Array.from({ length: Math.min(fallback, max) }, () => "bashing");
    }
    if (normalized.length > max) normalized = normalized.slice(0, max);
    while (normalized.length < max) normalized.push("empty");
    return normalized.map((state) => (HEALTH_STATES.includes(state) ? state : "empty"));
};

export const getHealthCounts = (boxes = []) =>
    boxes.reduce(
        (acc, state) => {
            if (state === "aggravated") acc.aggravated += 1;
            if (state === "lethal") acc.lethal += 1;
            if (state === "bashing") acc.bashing += 1;
            return acc;
        },
        { aggravated: 0, lethal: 0, bashing: 0 }
    );

export const buildHealthBoxes = (counts, max) => {
    const total = counts.aggravated + counts.lethal + counts.bashing;
    const emptyCount = Math.max(0, max - total);
    return [
        ...Array.from({ length: counts.aggravated }, () => "aggravated"),
        ...Array.from({ length: counts.lethal }, () => "lethal"),
        ...Array.from({ length: counts.bashing }, () => "bashing"),
        ...Array.from({ length: emptyCount }, () => "empty"),
    ];
};

export const StatDots = ({
    value,
    max = 5,
    onChange,
    color = "teal",
    size = "normal",
    clickable = true,
    testIdPrefix = "stat",
}) => {

    const colorClasses = {
        teal: "text-teal-500",
        crimson: "text-rose-500",
        zinc: "text-zinc-400",
        amber: "text-amber-500",
        violet: "text-violet-500",
        blue: "text-blue-500",
        red: "text-red-500"
    };
    
    const sizeClasses = size === "small" ? "w-2.5 h-2.5" : "w-3 h-3";

    return (
        <div className="flex gap-0.5">
            {Array.from({ length: max }, (_, i) => (
                <button
                    key={i}
                    onClick={() => clickable && onChange(i + 1 === value ? i : i + 1)}
                    className={`${sizeClasses} rounded-full border-2 transition-all ${clickable ? "hover:scale-110" : ""} ${
                        i < value ? `${colorClasses[color]} bg-current` : `border-current ${colorClasses[color]} opacity-40`
                    }`}
                    disabled={!clickable}
                    data-testid={`${testIdPrefix}-dot-${i + 1}`}
                />
            ))}
        </div>
    );
};

export const StatRow = ({ label, value, max, onChange, color, onLabelClick }) => (
    <div className="flex items-center justify-between py-0.5 group">
        <button 
            onClick={onLabelClick}
            className={`text-xs capitalize truncate hover:text-teal-300 transition-colors cursor-pointer flex items-center gap-1 ${color === "amber" ? "text-amber-400" : "text-zinc-400"}`}
            data-testid={`stat-${label.replace(/_/g, '-')}-label`}
        >
            <Dices className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-teal-500 transition-opacity" />
            {formatLabel(label)}
        </button>
        <StatDots value={value} max={max} onChange={onChange} color={color} size="small" testIdPrefix={`stat-${label.replace(/_/g, '-')}`} />
    </div>
);

export const HealthTrack = ({ boxes = [], max, onBoxClick, testIdPrefix = "health" }) => {
    return (
        <div className="flex gap-0.5 flex-wrap">
            {Array.from({ length: max }, (_, i) => {
                const state = boxes[i] || "empty";
                const symbol = HEALTH_SYMBOLS[state] || "";
                const stateClasses = {
                    empty: "bg-zinc-900 border-zinc-700 text-zinc-600 hover:border-zinc-600",
                    bashing: "bg-amber-900/50 border-amber-500/50 text-amber-300",
                    lethal: "bg-rose-900/50 border-rose-500/50 text-rose-300",
                    aggravated: "bg-purple-900/50 border-purple-500/50 text-purple-200",
                };

                return (
                    <button
                        key={i}
                        onClick={() => onBoxClick(i, state)}
                        className={`w-5 h-5 rounded-sm border text-[10px] font-mono flex items-center justify-center transition-all ${stateClasses[state] || stateClasses.empty}`}
                        data-testid={`${testIdPrefix}-track-${i + 1}`}
                    >
                        {symbol}
                    </button>
                );
            })}
        </div>
    );
};

export const ResourceTrack = ({ current, max, onChange, color = "teal", testIdPrefix = "resource" }) => {
    const colorClasses = {
        teal: { active: "bg-teal-500/50 border-teal-500", inactive: "bg-zinc-900 border-zinc-700" },
        amber: { active: "bg-amber-500/50 border-amber-500", inactive: "bg-zinc-900 border-zinc-700" },
        violet: { active: "bg-violet-500/50 border-violet-500", inactive: "bg-zinc-900 border-zinc-700" }
    };
    
    const colorStyle = colorClasses[color] || colorClasses.teal;
    
    return (
        <div className="flex gap-0.5 flex-wrap">
            {Array.from({ length: max }, (_, i) => (
                <button
                    key={i}
                    onClick={() => onChange(i + 1 === current ? i : i + 1)}
                    className={`w-5 h-5 rounded-sm border transition-all ${
                        i < current ? colorStyle.active : colorStyle.inactive
                    } hover:opacity-80`}
                    data-testid={`${testIdPrefix}-track-${i + 1}`}
                />
            ))}
        </div>
    );
};

export const SynergyTrack = ({ value, maxValue, onChangeValue, onChangeMax }) => {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
                <span className="text-teal-400">Current: {value}</span>
                <span className="text-zinc-500">Max: {maxValue}</span>
            </div>
            <div className="flex gap-0.5">
                {Array.from({ length: 10 }, (_, i) => {
                    const dotNum = 10 - i;
                    const isFilled = dotNum <= value;
                    const isAvailable = dotNum <= maxValue;
                    
                    return (
                        <button
                            key={i}
                            onClick={() => {
                                if (dotNum <= maxValue) {
                                    onChangeValue(dotNum === value ? dotNum - 1 : dotNum);
                                }
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                onChangeMax(dotNum === maxValue ? dotNum - 1 : dotNum);
                            }}
                            className={`w-6 h-6 rounded-sm border text-[10px] font-mono flex items-center justify-center transition-all ${
                                isFilled
                                    ? "bg-teal-500/50 border-teal-500 text-teal-300"
                                    : isAvailable
                                    ? "bg-zinc-800 border-zinc-600 text-zinc-500 hover:border-teal-500/50"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-700 opacity-50"
                            }`}
                            title={`${dotNum} - Right-click to set max`}
                            data-testid={`synergy-${dotNum}`}
                        >
                            {dotNum}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

