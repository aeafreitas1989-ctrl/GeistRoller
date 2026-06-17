import { CalendarDays, Clock3, Cloud, Thermometer, Leaf, Wind, Gauge, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CLOUD_COVER_OPTIONS = [
    { value: "clear", label: "☀ Clear" },
    { value: "partial", label: "⛅ Partial" },
    { value: "overcast", label: "☁ Overcast" },
    { value: "stormfront", label: "⛈ Stormfront" },
    { value: "fog", label: "🌫 Fog" },
];

const PRECIPITATION_OPTIONS = [
    { value: "dry", label: "∅ Dry" },
    { value: "drizzle", label: "💧 Drizzle" },
    { value: "rain", label: "🌧 Rain" },
    { value: "snow", label: "❄ Snow" },
    { value: "hail", label: "🧊 Hail" },
];

const INTENSITY_OPTIONS = [
    { value: "none", label: "– None" },
    { value: "light", label: "• Light" },
    { value: "moderate", label: "•• Moderate" },
    { value: "heavy", label: "••• Heavy" },
    { value: "violent", label: "‼ Violent" },
];

const WIND_OPTIONS = [
    { value: "calm", label: "≋ Calm" },
    { value: "light", label: "➝ Light" },
    { value: "moderate", label: "➝➝ Moderate" },
    { value: "strong", label: "➝➝➝ Strong" },
    { value: "gale", label: "🌀 Gale" },
];

export const SceneTrackerCard = ({
    sceneTracker,
    updateSceneTracker,
    sceneTemperature,
    sceneSeason,
    getSeasonColorClass,
    getTemperatureIconClass,
    getTemperatureColorClass,
    getTemperatureCondition,
}) => (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-sm px-3 py-2.5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Date
                </label>
                <Input
                    type="date"
                    value={sceneTracker.date}
                    onChange={(e) => updateSceneTracker({ date: e.target.value })}
                    className="input-geist h-8"
                    data-testid="scene-date-input"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Clock3 className="w-3 h-3" /> Time
                </label>
                <Input
                    type="time"
                    value={sceneTracker.time}
                    onChange={(e) => updateSceneTracker({ time: e.target.value })}
                    className="input-geist h-8"
                    data-testid="scene-time-input"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    Season
                </label>
                <div
                    className={`h-8 rounded-sm border flex items-center justify-center text-xs font-medium ${getSeasonColorClass(sceneTracker.date)}`}
                    data-testid="scene-season-display"
                >
                    {sceneSeason}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Thermometer className={`w-3 h-3 ${getTemperatureIconClass(sceneTemperature)}`} />
                    Temp (°C)
                </label>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-5 text-zinc-400 text-sm"
                        onClick={() => updateSceneTracker({ temperature: String(Math.max(-20, sceneTemperature - 1)) })}
                        disabled={sceneTemperature <= -20}
                        data-testid="scene-temperature-decrease"
                    >
                        <span className="leading-none">−</span>
                    </Button>
                    <div className={`flex-1 h-8 rounded-sm border flex items-center justify-center text-xs font-medium ${getTemperatureColorClass(sceneTemperature)}`}>
                        {sceneTemperature} · {getTemperatureCondition(sceneTemperature)}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-5 text-zinc-400 text-sm"
                        onClick={() => updateSceneTracker({ temperature: String(Math.min(45, sceneTemperature + 1)) })}
                        disabled={sceneTemperature >= 45}
                        data-testid="scene-temperature-increase"
                    >
                        <span className="leading-none">+</span>
                    </Button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Cloud className="w-3 h-3" /> Cloud
                </label>
                <Select
                    value={sceneTracker.cloud_cover}
                    onValueChange={(value) => updateSceneTracker({ cloud_cover: value })}
                >
                    <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-800 text-xs" data-testid="scene-cloud-select">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                        {CLOUD_COVER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs text-zinc-200">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Precipitation
                </label>
                <Select
                    value={sceneTracker.precipitation}
                    onValueChange={(value) => updateSceneTracker({ precipitation: value })}
                >
                    <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-800 text-xs" data-testid="scene-precipitation-select">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                        {PRECIPITATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs text-zinc-200">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    Intensity
                </label>
                <Select
                    value={sceneTracker.precipitation === "dry" ? "none" : sceneTracker.intensity}
                    onValueChange={(value) => updateSceneTracker({ intensity: value })}
                    disabled={sceneTracker.precipitation === "dry"}
                >
                    <SelectTrigger
                        className={`h-8 bg-zinc-900/50 border-zinc-800 text-xs ${
                            sceneTracker.precipitation === "dry" ? "opacity-50" : ""
                        }`}
                        data-testid="scene-intensity-select"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                        {INTENSITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs text-zinc-200">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Wind className="w-3 h-3" /> Wind
                </label>
                <Select
                    value={sceneTracker.wind}
                    onValueChange={(value) => updateSceneTracker({ wind: value })}
                >
                    <SelectTrigger className="h-8 bg-zinc-900/50 border-zinc-800 text-xs" data-testid="scene-wind-select">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                        {WIND_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs text-zinc-200">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>
);
