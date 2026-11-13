import { useEffect, useRef, useState } from "react";
import { Compass, ImagePlus, LocateFixed, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const clamp01 = (number) => Math.min(1, Math.max(0, Number.isFinite(Number(number)) ? Number(number) : 0.5));
const clampZoom = (number) => Math.min(4, Math.max(1, number));
const initialPosition = (map) => ({
    x: clamp01(map?.token?.x ?? 0.5),
    y: clamp01(map?.token?.y ?? 0.5),
});

// One map per character. The image and normalized token coordinates are saved
// together in the character's exploration_map field.
export const ExplorationMap = ({ characterName = "PC", value, onChange }) => {
    const map = value || {};
    const fileInputRef = useRef(null);
    const viewportRef = useRef(null);
    const stageRef = useRef(null);
    const gestureRef = useRef(null);
    const [position, setPosition] = useState(() => initialPosition(map));
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [viewport, setViewport] = useState({ width: 1, height: 420 });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const image = typeof map.image_data === "string" ? map.image_data : "";
    const imageWidth = Math.max(1, Number(map.image_width) || 1);
    const imageHeight = Math.max(1, Number(map.image_height) || 1);
    const mapTitle = map.name || "Exploration Map";

    useEffect(() => {
        setPosition(initialPosition(map));
    }, [map.token?.x, map.token?.y]);

    useEffect(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, [image]);

    useEffect(() => {
        if (!image || !viewportRef.current) return undefined;
        const element = viewportRef.current;
        const measure = () => {
            const rect = element.getBoundingClientRect();
            setViewport({ width: Math.max(1, rect.width), height: Math.max(1, rect.height) });
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [image]);

    // The image is contained without distortion; the token uses its actual
    // fitted rectangle rather than the viewport's letterboxed margins.
    const imageAspect = imageWidth / imageHeight;
    const fittedWidth = Math.min(viewport.width, viewport.height * imageAspect);
    const fittedHeight = fittedWidth / imageAspect;
    const insetX = (viewport.width - fittedWidth) / 2;
    const insetY = (viewport.height - fittedHeight) / 2;
    const tokenLeft = insetX + position.x * fittedWidth;
    const tokenTop = insetY + position.y * fittedHeight;

    const savePosition = (next) => {
        const safe = { x: clamp01(next.x), y: clamp01(next.y) };
        setPosition(safe);
        void onChange({ ...map, token: safe });
    };

    const positionForPointer = (event) => {
        const rect = stageRef.current?.getBoundingClientRect();
        if (!rect || !rect.width || !rect.height) return position;
        const localX = ((event.clientX - rect.left) / rect.width) * viewport.width;
        const localY = ((event.clientY - rect.top) / rect.height) * viewport.height;
        return {
            x: clamp01((localX - insetX) / Math.max(1, fittedWidth)),
            y: clamp01((localY - insetY) / Math.max(1, fittedHeight)),
        };
    };

    const handlePointerDown = (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        const isToken = Boolean(event.target.closest("[data-map-token]"));
        gestureRef.current = isToken
            ? { type: "token", latest: position, original: position }
            : { type: "pan", startX: event.clientX, startY: event.clientY, pan };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        const gesture = gestureRef.current;
        if (!gesture) return;
        if (gesture.type === "token") {
            const next = positionForPointer(event);
            gesture.latest = next;
            setPosition(next);
        } else {
            // Panning changes only the local view, never the persisted token.
            const limitX = Math.max(0, (zoom - 1) * viewport.width / 2);
            const limitY = Math.max(0, (zoom - 1) * viewport.height / 2);
            setPan({
                x: Math.min(limitX, Math.max(-limitX, gesture.pan.x + event.clientX - gesture.startX)),
                y: Math.min(limitY, Math.max(-limitY, gesture.pan.y + event.clientY - gesture.startY)),
            });
        }
    };

    const handlePointerUp = (event) => {
        const gesture = gestureRef.current;
        gestureRef.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        if (gesture?.type === "token" &&
            (gesture.latest.x !== gesture.original.x || gesture.latest.y !== gesture.original.y)) {
            savePosition(gesture.latest);
        }
    };

    const handleTokenKeyDown = (event) => {
        const delta = event.shiftKey ? 0.05 : 0.01;
        const directions = {
            ArrowLeft: [-delta, 0], ArrowRight: [delta, 0],
            ArrowUp: [0, -delta], ArrowDown: [0, delta],
        };
        if (!directions[event.key]) return;
        event.preventDefault();
        const [dx, dy] = directions[event.key];
        savePosition({ x: position.x + dx, y: position.y + dy });
    };

    const handleUpload = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        setError("");
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 20 * 1024 * 1024) {
            setError("Choose a PNG, JPEG or WebP image smaller than 20 MB.");
            return;
        }
        setBusy(true);
        const temporaryUrl = URL.createObjectURL(file);
        try {
            const source = await new Promise((resolve, reject) => {
                const loaded = new Image();
                loaded.onload = () => resolve(loaded);
                loaded.onerror = () => reject(new Error("Unable to read this image."));
                loaded.src = temporaryUrl;
            });
            const ratio = Math.min(1, 1800 / Math.max(source.naturalWidth, source.naturalHeight));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(source.naturalWidth * ratio));
            canvas.height = Math.max(1, Math.round(source.naturalHeight * ratio));
            const context = canvas.getContext("2d");
            if (!context) throw new Error("Image conversion is unavailable in this browser.");
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(source, 0, 0, canvas.width, canvas.height);
            let data = canvas.toDataURL("image/jpeg", 0.82);
            if (data.length > 2200000) data = canvas.toDataURL("image/jpeg", 0.58);
            if (data.length > 2200000) throw new Error("Map is too detailed to save. Choose a smaller image.");
            const nextMap = {
                name: file.name.replace(/\.[^.]+$/, ""),
                image_data: data,
                image_width: canvas.width,
                image_height: canvas.height,
                token: { x: 0.5, y: 0.5 },
            };
            await onChange(nextMap);
            setPosition(nextMap.token);
        } catch (uploadError) {
            setError(uploadError.message || "Unable to load this map.");
        } finally {
            URL.revokeObjectURL(temporaryUrl);
            setBusy(false);
        }
    };

    const removeMap = async () => {
        if (!window.confirm("Remove this character's exploration map?")) return;
        setError("");
        await onChange({});
        setPosition({ x: 0.5, y: 0.5 });
    };

    const initials = String(characterName || "PC").trim().split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase() || "PC";

    return (
        <section className="rounded-md border border-zinc-700/80 bg-zinc-900/30 p-3 space-y-3" data-testid="exploration-map">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <Compass className="h-4 w-4 shrink-0 text-teal-300" />
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-zinc-200">{mapTitle}</div>
                        <p className="text-[10px] text-zinc-500">One exploration map per character</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleUpload} data-testid="exploration-map-file" />
                    <Button type="button" size="sm" variant="outline" disabled={busy} className="h-7 border-zinc-700 text-xs" onClick={() => fileInputRef.current?.click()} data-testid="exploration-map-upload">
                        <ImagePlus className="mr-1 h-3.5 w-3.5" />{busy ? "Loading..." : image ? "Replace" : "Upload map"}
                    </Button>
                    {image && <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-400" onClick={removeMap} data-testid="exploration-map-remove"><Trash2 className="h-3.5 w-3.5" /></Button>}
                </div>
            </div>
            {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
            {image ? (
                <>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
                        <span>Drag the {characterName || "PC"} token to mark the current location. Drag elsewhere to pan.</span>
                        <div className="flex items-center gap-1">
                            <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0 border-zinc-700" disabled={zoom <= 1} onClick={() => { setZoom((z) => clampZoom(z - 0.25)); setPan({ x: 0, y: 0 }); }} aria-label="Zoom out"><Minus className="h-3.5 w-3.5" /></Button>
                            <span className="w-9 text-center font-mono text-[11px]">{Math.round(zoom * 100)}%</span>
                            <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0 border-zinc-700" disabled={zoom >= 4} onClick={() => { setZoom((z) => clampZoom(z + 0.25)); setPan({ x: 0, y: 0 }); }} aria-label="Zoom in"><Plus className="h-3.5 w-3.5" /></Button>
                            <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" title="Reset view" aria-label="Reset view" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}><LocateFixed className="h-3.5 w-3.5" /></Button>
                        </div>
                    </div>
                    <div ref={viewportRef} className="relative h-[420px] w-full overflow-hidden rounded-md border border-zinc-700 bg-zinc-950 select-none" style={{ touchAction: "none" }}
                        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp} data-testid="exploration-map-viewport">
                        <div ref={stageRef} className="absolute inset-0" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center center" }}>
                            <img src={image} alt={mapTitle} className="block h-full w-full pointer-events-none" draggable={false} style={{ objectFit: "contain" }} />
                            <button type="button" data-map-token="true" onKeyDown={handleTokenKeyDown}
                                className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-teal-700 text-[10px] font-bold text-white shadow-[0_0_0_3px_rgba(0,0,0,0.6)] cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
                                style={{ left: `${tokenLeft}px`, top: `${tokenTop}px`, touchAction: "none" }}
                                title={`${characterName || "PC"} â€” drag to move; arrow keys to nudge`} aria-label={`Position of ${characterName || "PC"}`} data-testid="exploration-map-pc-token">{initials}</button>
                        </div>
                    </div>
                    <p className="text-[10px] text-zinc-500">Token position is saved on release. The map image is compressed and stored with this character.</p>
                </>
            ) : (
                <div className="flex min-h-[230px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-zinc-700 bg-zinc-950/50 p-4 text-center">
                    <ImagePlus className="h-8 w-8 text-zinc-600" />
                    <p className="text-sm text-zinc-300">No exploration map uploaded</p>
                    <p className="max-w-sm text-xs text-zinc-500">Upload a PNG, JPEG or WebP floor plan, city map or regional map. A movable token for this character will appear at its centre.</p>
                </div>
            )}
        </section>
    );
};

