import { getGameTimestamp, getRawGameTimestamp, isGameClockBehind, formatGameDateTime } from "../../utils/effectDuration";
import { Clock3, Cloud, Thermometer, Leaf, Wind, Gauge, Droplets, MapPin, Building2, ShieldCheck, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SceneDateField, SceneTimeField } from "./SceneDateTimePickers";

const CLOUD_COVER_OPTIONS = [
    { value: "clear", label: "☀ Clear" },
    { value: "partial", label: "⛅ Partial" },
    { value: "overcast", label: "☁ Overcast" },
    { value: "stormfront", label: "⛈ Stormfront" },
    { value: "fog", label: "🌫 Fog" },
];

const PRECIPITATION_OPTIONS = [
    { value: "dry", label: "∅ None" },
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

const LOCATION_TYPE_OPTIONS = [
    { value: "exterior", label: "Exterior" },
    { value: "interior", label: "Interior" },
    { value: "underground", label: "Underground" },
    { value: "vehicle", label: "Vehicle" },
    { value: "other", label: "Other" },
];

export const SceneTrackerCard = ({
    sceneTracker,
    updateSceneTracker,
    exposureStatus = "",
    turnHazards = [],
    placeOptions = [],
    sceneTemperature,
    sceneSeason,
    getSeasonColorClass,
    getTemperatureIconClass,
    getTemperatureColorClass,
    getTemperatureCondition,
}) => {
    const commitClock = updates => {
        const old=getGameTimestamp(sceneTracker), next=getRawGameTimestamp({...sceneTracker,...updates});
        if (old!==null && next!==null && next>old && !window.confirm('Advance game time from '+formatGameDateTime(old)+' to '+formatGameDateTime(next)+'? Healing, damage, and spell expiration will be processed and cannot be undone by changing the clock. Expired Conditions remain reviewable until End Scene.')) return false;
        void updateSceneTracker(updates);
        return true;
    };
    return (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-sm px-2.5 py-2 space-y-2">
            {isGameClockBehind(sceneTracker) && <div className="rounded border border-amber-700/60 bg-amber-950/30 px-2 py-1 text-[10px] text-amber-200" data-testid="clock-rewind-warning">Clock is earlier than the last processed game time ({formatGameDateTime(getGameTimestamp(sceneTracker))}). Healing and committed effects are frozen at that timestamp; retained clock-based Conditions follow the displayed date. Restore the clock before advancing time.</div>}

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(150px,1fr)_110px] items-end gap-2">

                {/* Location name */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Location
                        </label>
                    </div>

                    <Input
                        list="scene-place-options"
                        value={sceneTracker.location_name || ""}
                        onChange={(event) =>
                            updateSceneTracker({
                                location_name: event.target.value,
                            })
                        }
                        placeholder="Current Location"
                        className="input-geist h-8"
                        data-testid="scene-location-input"
                    />

                    <datalist id="scene-place-options">
                        {placeOptions.map((place) => (
                            <option
                                key={place.id || place.name}
                                value={place.name}
                            />
                        ))}
                    </datalist>
                </div>

                {/* Location type */}
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        Type
                    </label>

                    <Select
                        value={sceneTracker.location_type || "exterior"}
                        onValueChange={(value) =>
                            updateSceneTracker({
                                location_type: value,
                            })
                        }
                    >
                        <SelectTrigger
                            className="h-8 bg-zinc-900/50 border-zinc-800 text-xs"
                            data-testid="scene-location-type-select"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {LOCATION_TYPE_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-xs text-zinc-200"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Shelter */}
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Shelter
                    </label>

                    <div className="h-8 flex items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900/50">
                        <Checkbox
                            checked={Boolean(sceneTracker.sheltered)}
                            onCheckedChange={(checked) =>
                                updateSceneTracker({
                                    sheltered: checked === true,
                                })
                            }
                            data-testid="scene-shelter-checkbox"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-end gap-2">
            <div className="space-y-1">
                <SceneDateField
                    value={sceneTracker.date || ""}
                    onChange={(date) => commitClock({ date })}
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Clock3 className="w-3 h-3" /> Time
                </label>
                <SceneTimeField
                    value={sceneTracker.time || ""}
                    onChange={(time) => commitClock({ time })}
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
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-3 min-w-3 p-0 text-zinc-500 text-xs hover:text-zinc-200"
                        onClick={() =>
                            updateSceneTracker({
                                temperature: String(
                                    Math.max(
                                        -20,
                                        sceneTemperature - 1
                                    )
                                ),
                            })
                        }
                        disabled={sceneTemperature <= -20}
                        data-testid="scene-temperature-decrease"
                    >
                        <span className="leading-none text-[11px]">
                            −
                        </span>
                    </Button>

                    <div
                        className={`flex-1 min-w-0 h-8 rounded-sm border flex items-center justify-center text-xs font-medium ${getTemperatureColorClass(
                            sceneTemperature
                        )}`}
                    >
                        {sceneTemperature} ·{" "}
                        {getTemperatureCondition(
                            sceneTemperature
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-3 min-w-3 p-0 text-zinc-500 text-xs hover:text-zinc-200"
                        onClick={() =>
                            updateSceneTracker({
                                temperature: String(
                                    Math.min(
                                        45,
                                        sceneTemperature + 1
                                    )
                                ),
                            })
                        }
                        disabled={sceneTemperature >= 45}
                        data-testid="scene-temperature-increase"
                    >
                        <span className="leading-none text-[11px]">
                            +
                        </span>
                    </Button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-end gap-2">
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

        <details className="rounded-sm border border-zinc-800 bg-zinc-950/35 p-2" data-testid="scene-environment-checks">
          <summary className="cursor-pointer text-xs text-zinc-300">Environmental Tilt checks / Storyteller settings</summary>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              ['wind_grade','Wind grade (1-5)',5],
              ['flood_depth_feet','Flood depth (feet)',30],
              ['snow_depth_inches','Snow depth (inches)',240],
              ['earthquake_severity','Quake severity (1-5)',5],
              ['earthquake_damage','Quake Lethal / turn (1-3)',3],
            ].map(([field,label,max]) => (
              <label key={field} className="text-[10px] text-zinc-400">
                {label}
                <Input type="number" min={0} max={max} value={sceneTracker[field] ?? 0}
                  onChange={(event) => updateSceneTracker({ [field]: Math.max(0,Math.min(max,Number(event.target.value)||0)) })}
                  className="h-8 mt-1 bg-zinc-900 text-xs" data-testid={'scene-'+field} />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-zinc-300">
            {[
              ['icy_ground','Icy / slippery ground'],
              ['earthquake_active','Earthquake underway'],
              ['temperature_protected','Protected from extreme temperature'],
              ['shelter_temperature_adequate','Shelter protects from extreme temperature'],
              ['cold_gear_adequate','Equipped cold gear is adequate'],
            ].map(([field,label]) => (
              <label key={field} className="flex items-center gap-1.5">
                <Checkbox checked={['cold_gear_adequate','shelter_temperature_adequate'].includes(field)?sceneTracker[field]!==false:sceneTracker[field]===true}
                  onCheckedChange={(checked) => updateSceneTracker({[field]:checked===true})}
                  data-testid={'scene-'+field} />{label}
              </label>
            ))}
          </div>
          {sceneTracker.earthquake_active === true && !(Number(sceneTracker.earthquake_severity) > 0) &&
            <p className="text-xs text-amber-300 mt-2" data-testid="missing-earthquake-severity">Set earthquake severity (1–5); no penalty is inferred.</p>}
          {sceneTracker.earthquake_active === true && !(Number(sceneTracker.earthquake_damage) > 0) &&
            <p className="text-xs text-amber-300 mt-1" data-testid="missing-earthquake-damage">Set earthquake damage (1–3 Lethal per turn); no damage is inferred.</p>}
          {['strong','gale'].includes(sceneTracker.wind) && !(Number(sceneTracker.wind_grade) > 0) &&
            <p className="text-xs text-amber-300 mt-1" data-testid="missing-wind-grade">Set wind grade (1–5) to apply Physical penalties and debris damage.</p>}
          {exposureStatus && <p className="text-xs text-amber-300 mt-2" data-testid="environment-exposure-status">{exposureStatus}</p>}
          {turnHazards.map((hazard) => <p key={hazard.name} className="text-xs text-rose-300 mt-1">
            {hazard.name}: {hazard.damage} {hazard.type} / turn. {hazard.avoid}. End Turn prompts the relevant roll.
          </p>)}
          <p className="text-[10px] text-zinc-500 mt-2">Shelter mitigates rain, wind and blizzard exposure. It also mitigates extreme temperature when "Shelter protects from extreme temperature" is checked. Flooding, ice and earthquakes remain separate hazards; wind still affects driving.</p>
          <p className="text-[10px] text-zinc-500 mt-1">Flooding and ice require explicit scene conditions. Wind and earthquake severity are never inferred.</p>
        </details>
    </div>
);
};
