import { useEffect, useState, useRef } from "react";
import { CalendarDays, Clock3, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    parseSceneDate, parseSceneTime,
    toSceneISODate, toSceneTime, maskSceneTimeInput,
    splitSceneDateDraft, replaceSceneDateSegment, parseSceneDateDraft, parseSceneDatePaste, toSceneCalendarDate,
} from "@/utils/sceneDateTimeValues";

const monthStart = (date) => {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(12, 0, 0, 0);
    return result;
};

export const SceneDateField = ({ value = "", onChange }) => {
    const selected = parseSceneDate(value);
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(toSceneCalendarDate(selected));
    const dateSegments = useRef([]);
    const parts = splitSceneDateDraft(draft);
    const [displayMonth, setDisplayMonth] = useState(monthStart(selected || new Date()));
    const [yearDraft, setYearDraft] = useState(String(displayMonth.getFullYear()));

    useEffect(() => {
        setDraft(toSceneCalendarDate(parseSceneDate(value)));
    }, [value]);

    useEffect(() => {
        setYearDraft(String(displayMonth.getFullYear()));
    }, [displayMonth]);

    const commitDraft = () => {
        const parsed = parseSceneDateDraft(draft);
        if (!draft.trim()) {
            if (value) onChange?.("");
        } else if (parsed) {
            const nextDate = toSceneISODate(parsed);
            if (nextDate !== value && onChange?.(nextDate) === false) { setDraft(toSceneCalendarDate(parseSceneDate(value))); return; }
        }
        setDraft(toSceneCalendarDate(parsed || parseSceneDate(value)));
    };

    const jumpToYear = () => {
        const year = Number(yearDraft);
        if (Number.isInteger(year) && year >= 1 && year <= 9999) {
            const next = monthStart(displayMonth);
            next.setFullYear(year);
            setDisplayMonth(next);
        } else {
            setYearDraft(String(displayMonth.getFullYear()));
        }
    };

    return (
        <div className="relative min-w-0">
            <Popover
                open={open}
                onOpenChange={(nextOpen) => {
                    if (nextOpen) setDisplayMonth(monthStart(parseSceneDate(value) || new Date()));
                    setOpen(nextOpen);
                }}
            >
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="mb-1 inline-flex h-3.5 items-center gap-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
                        aria-label="Open in-game calendar"
                        title="Open in-game calendar"
                        data-testid="scene-open-calendar"
                    >
                        <CalendarDays className="h-3 w-3" />
                        Date
                    </button>
                </PopoverTrigger>
                <div role="group" aria-label="In-game date, year/month/day" data-testid="scene-date-input"
                    className="input-geist h-8 w-full min-w-0 px-2 sm:px-3 text-sm tabular-nums flex items-center focus-within:ring-1 focus-within:ring-violet-400"
                    onBlur={(event)=>{if(!event.currentTarget.contains(event.relatedTarget))commitDraft();}}>
                    {['Year','Month','Day'].map((label,index)=>{
                        const limit=index===0?4:2;
                        const focusNext=()=>dateSegments.current[index+1]?.focus();
                        return <div key={label} className="flex items-center min-w-0">
                            {index>0 && <span aria-hidden="true" className="shrink-0">/</span>}
                            <input ref={node=>{dateSegments.current[index]=node;}} type="text" inputMode="numeric" autoComplete="off"
                                value={parts[index]} maxLength={limit} placeholder={['YYYY','MM','DD'][index]}
                                aria-label={'In-game '+label.toLowerCase()} data-testid={'scene-date-'+label.toLowerCase()}
                                className={'min-w-0 bg-transparent border-0 p-0 outline-none text-center font-inherit tabular-nums selection:bg-violet-700 '+(index===0?'w-[4.2ch]':'w-[2.2ch]')}
                                onFocus={event=>event.currentTarget.select()} onDoubleClick={event=>event.currentTarget.select()}
                                onChange={event=>{
                                    const digits=event.target.value.replace(/\D/g,'').slice(0,limit);
                                    setDraft(previous=>replaceSceneDateSegment(previous,index,digits));
                                    if(digits.length===limit && index<2)focusNext();
                                }}
                                onPaste={event=>{
                                    const text=event.clipboardData.getData('text').trim();
                                    const full=parseSceneDatePaste(text);
                                    if(full){event.preventDefault();setDraft(full);return;}
                                    if(/^\d+$/.test(text) && text.length<=limit){
                                        event.preventDefault();setDraft(previous=>replaceSceneDateSegment(previous,index,text));
                                        if(text.length===limit && index<2)focusNext();
                                    }else{event.preventDefault();}
                                }}
                                onKeyDown={event=>{
                                    const input=event.currentTarget;
                                    if(event.key==='Enter'){event.preventDefault();input.blur();}
                                    else if(event.key==='/' && index<2){event.preventDefault();focusNext();}
                                    else if(event.key==='ArrowLeft' && input.selectionStart===0 && input.selectionEnd===0 && index>0){event.preventDefault();dateSegments.current[index-1]?.focus();}
                                    else if(event.key==='ArrowRight' && input.selectionStart===input.value.length && input.selectionEnd===input.value.length && index<2){event.preventDefault();focusNext();}
                                }}/>
                        </div>;
                    })}
                </div>
                <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={7}
                    avoidCollisions
                    collisionPadding={12}
                    className="z-[90] w-[306px] max-w-[calc(100vw-24px)] border-zinc-700 bg-zinc-950 p-2 text-zinc-100 shadow-xl"
                    data-testid="scene-date-calendar"
                >
                    <div className="mb-1 flex items-center gap-2 px-2 pt-1">
                        <label className="min-w-0 flex-1 text-[11px] text-zinc-400">
                            Month
                            <select
                                className="mt-1 h-8 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-2 text-xs text-zinc-100"
                                value={displayMonth.getMonth()}
                                aria-label="Calendar month"
                                onChange={(event) => {
                                    const next = monthStart(displayMonth);
                                    next.setMonth(Number(event.target.value));
                                    setDisplayMonth(next);
                                }}
                            >
                                {Array.from({ length: 12 }, (_, month) => (
                                    <option key={month} value={month}>
                                        {new Intl.DateTimeFormat("en-GB", { month: "long" }).format(new Date(2000, month, 1))}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="w-20 text-[11px] text-zinc-400">
                            Year
                            <Input
                                type="number"
                                min={1}
                                max={9999}
                                value={yearDraft}
                                onChange={(event) => setYearDraft(event.target.value)}
                                onBlur={jumpToYear}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        jumpToYear();
                                        event.currentTarget.blur();
                                    }
                                }}
                                className="mt-1 h-8 bg-zinc-900 px-2 text-xs text-zinc-100"
                                aria-label="Calendar year"
                                data-testid="scene-calendar-year"
                            />
                        </label>
                    </div>
                    <Calendar
                        mode="single"
                        month={displayMonth}
                        onMonthChange={(month) => setDisplayMonth(monthStart(month))}
                        selected={selected || undefined}
                        showOutsideDays={false}
                        weekStartsOn={1}
                        onSelect={(date) => {
                            if (!date) return;
                            const nextDate = toSceneISODate(date);
                            if (nextDate !== value && onChange?.(nextDate) === false) { setDraft(toSceneCalendarDate(parseSceneDate(value))); setOpen(false); return; }
                            setDraft(toSceneCalendarDate(date));
                            setOpen(false);
                        }}
                        className="p-1"
                        classNames={{
                            day_selected: "bg-violet-700 text-white hover:bg-violet-600 focus:bg-violet-600",
                            day_today: "border border-zinc-600 text-zinc-100",
                        }}
                    />
                    <div className="flex justify-between border-t border-zinc-800 px-2 pt-2">
                        <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-zinc-400" onClick={() => { onChange?.(""); setDraft(""); setOpen(false); }}>
                            Clear
                        </Button>
                        <span className="self-center text-[10px] text-zinc-500">In-game calendar</span>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

const position = (index, radius) => {
    const angle = (index * Math.PI) / 6;
    return {
        left: `${124 + Math.sin(angle) * radius}px`,
        top: `${124 - Math.cos(angle) * radius}px`,
        transform: "translate(-50%, -50%)",
    };
};

const CLOCK_HOURS = [
    ...Array.from({ length: 12 }, (_, index) => ({ value: index + 12, inner: false, index })),
    ...Array.from({ length: 12 }, (_, index) => ({ value: index, inner: true, index })),
];
const CLOCK_MINUTES = Array.from({ length: 12 }, (_, index) => ({ value: index * 5, inner: false, index }));

const ClockFace = ({ hour, minute, phase, chooseHour, chooseMinute }) => {
    const angle = phase === "hour" ? ((hour % 12) * Math.PI) / 6 : (minute * Math.PI) / 30;
    const radius = phase === "hour" ? (hour >= 12 ? 87 : 63) : 87;
    const marks = phase === "hour" ? CLOCK_HOURS : CLOCK_MINUTES;
    return (
        <div className="relative mx-auto h-[248px] w-[248px] rounded-full border border-zinc-700 bg-zinc-900" data-testid="scene-analog-clock">
            <svg className="pointer-events-none absolute inset-0" viewBox="0 0 248 248" aria-hidden="true">
                <circle cx="124" cy="124" r="112" fill="none" stroke="#3f3f46" strokeWidth="1" />
                <line x1="124" y1="124" x2={124 + Math.sin(angle) * radius} y2={124 - Math.cos(angle) * radius} stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
                <circle cx="124" cy="124" r="4" fill="#a78bfa" />
            </svg>
            {marks.map((mark) => {
                const chosen = phase === "hour" ? hour === mark.value : minute === mark.value;
                return (
                    <button
                        type="button"
                        key={`${phase}-${mark.value}`}
                        style={position(mark.index, mark.inner ? 65 : 100)}
                        className={`absolute flex items-center justify-center rounded-full font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                            mark.inner ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-[11px]"
                        } ${chosen ? "bg-violet-600 text-white" : "text-zinc-300 hover:bg-zinc-700 hover:text-white"}`}
                        aria-label={phase === "hour" ? `Select hour ${String(mark.value).padStart(2, "0")}` : `Select minute ${String(mark.value).padStart(2, "0")}`}
                        aria-pressed={chosen}
                        data-testid={phase === "hour" ? `scene-clock-hour-${mark.value}` : `scene-clock-minute-${mark.value}`}
                        onClick={() => phase === "hour" ? chooseHour(mark.value) : chooseMinute(mark.value)}
                    >
                        {String(mark.value).padStart(2, "0")}
                    </button>
                );
            })}
        </div>
    );
};

export const SceneTimeField = ({ value = "", onChange }) => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(value || "");
    const [phase, setPhase] = useState("hour");
    const [hour, setHour] = useState(12);
    const [minute, setMinute] = useState(0);

    useEffect(() => setDraft(value || ""), [value]);

    const commitDraft = () => {
        const parsed = parseSceneTime(draft);
        if (!draft.trim()) {
            if (value) onChange?.("");
        } else if (parsed) {
            const nextTime = toSceneTime(parsed.hours, parsed.minutes);
            if (nextTime !== value && onChange?.(nextTime) === false) { setDraft(value || ""); return; }
        }
        setDraft(parsed ? toSceneTime(parsed.hours, parsed.minutes) : (value || ""));
    };

    const applyClock = () => {
        const nextTime = toSceneTime(hour, minute);
        if (nextTime !== value && onChange?.(nextTime) === false) { setDraft(value || ""); setOpen(false); return; }
        setDraft(nextTime);
        setOpen(false);
    };

    return (
        <div className="relative min-w-0">
            <Input
                type="text"
                inputMode="numeric"
                placeholder="HH:MM"
                maxLength={5}
                value={draft}
                onChange={(event) => setDraft(maskSceneTimeInput(event.target.value))}
                onBlur={commitDraft}
                onKeyDown={(event) => {
                    if (event.key === "Backspace" && event.currentTarget.selectionStart === draft.length &&
                        event.currentTarget.selectionEnd === draft.length && draft.endsWith(":")) {
                        event.preventDefault();
                        setDraft(maskSceneTimeInput(draft.replace(/\D/g, "").slice(0, -1)));
                    }
                    if (event.key === "Enter") {
                        event.preventDefault();
                        event.currentTarget.blur();
                    }
                }}
                className="input-geist h-8 w-full min-w-0 pr-9 text-sm tabular-nums"
                aria-label="In-game time in 24-hour format"
                data-testid="scene-time-input"
            />
            <Popover
                open={open}
                onOpenChange={(nextOpen) => {
                    if (nextOpen) {
                        const current = parseSceneTime(value) || { hours: 12, minutes: 0 };
                        setHour(current.hours);
                        setMinute(current.minutes);
                        setPhase("hour");
                    }
                    setOpen(nextOpen);
                }}
            >
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-r-sm text-zinc-400 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
                        aria-label="Open analog clock picker"
                        data-testid="scene-open-clock"
                    >
                        <Clock3 className="h-4 w-4" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={7}
                    avoidCollisions
                    collisionPadding={12}
                    className="z-[90] w-[296px] max-w-[calc(100vw-24px)] border-zinc-700 bg-zinc-950 p-3 text-zinc-100 shadow-xl"
                    data-testid="scene-time-clock-picker"
                >
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 font-mono text-xl tabular-nums">
                            <button type="button" className={`rounded px-1 ${phase === "hour" ? "bg-violet-800 text-white" : "text-zinc-300"}`} onClick={() => setPhase("hour")} aria-label="Choose hours" data-testid="scene-clock-select-hours">
                                {String(hour).padStart(2, "0")}
                            </button>
                            <span className="text-zinc-600">:</span>
                            <button type="button" className={`rounded px-1 ${phase === "minute" ? "bg-violet-800 text-white" : "text-zinc-300"}`} onClick={() => setPhase("minute")} aria-label="Choose minutes" data-testid="scene-clock-select-minutes">
                                {String(minute).padStart(2, "0")}
                            </button>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">24-hour clock</span>
                    </div>
                    <ClockFace
                        hour={hour}
                        minute={minute}
                        phase={phase}
                        chooseHour={(picked) => { setHour(picked); setPhase("minute"); }}
                        chooseMinute={setMinute}
                    />
                    {phase === "minute" && (
                        <div className="mt-3 flex items-center justify-center gap-2">
                            <Button type="button" variant="outline" size="icon" className="h-7 w-7 border-zinc-700" aria-label="Decrease minute" onClick={() => setMinute((minute + 59) % 60)}><Minus className="h-3 w-3" /></Button>
                            <label className="text-[11px] text-zinc-400">
                                Exact minute
                                <Input type="number" min={0} max={59} value={minute} onChange={(event) => setMinute(Math.max(0, Math.min(59, Number(event.target.value) || 0)))} className="ml-2 inline-block h-7 w-14 bg-zinc-900 text-center font-mono text-xs" aria-label="Exact minute" data-testid="scene-clock-exact-minute" />
                            </label>
                            <Button type="button" variant="outline" size="icon" className="h-7 w-7 border-zinc-700" aria-label="Increase minute" onClick={() => setMinute((minute + 1) % 60)}><Plus className="h-3 w-3" /></Button>
                        </div>
                    )}
                    <div className="mt-3 flex justify-between border-t border-zinc-800 pt-3">
                        <Button type="button" variant="ghost" size="sm" className="h-8 text-xs text-zinc-400" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="button" size="sm" className="h-8 bg-violet-700 text-xs text-white hover:bg-violet-600" onClick={applyClock} data-testid="scene-clock-apply">Set Time</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
