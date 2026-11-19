// Pure Scrutiny tracker: allocate successes to Opacity layers. Exceptional
// results can carry excess successes forward to later layers.
export const applyScrutinySuccesses = (rolled, layers, startingOpacity, carryRemainder = false) => {
    const updatedLayers = (layers || []).map(layer => ({
        successes: Math.max(0, Number(layer.successes) || 0),
        target: Math.max(0, Number(layer.target) || 0), complete: !!layer.complete,
    }));
    let remaining = Math.max(0, Number(rolled) || 0);
    while (remaining > 0) {
        let currentLayer = updatedLayers.find(layer => !layer.complete);
        if (!currentLayer) {
            const nextTarget = updatedLayers.length ? updatedLayers[updatedLayers.length - 1].target - 1 : startingOpacity;
            if (nextTarget <= 0) break;
            currentLayer = { successes:0, target:nextTarget, complete:false };
            updatedLayers.push(currentLayer);
        }
        const needed = Math.max(0, currentLayer.target - currentLayer.successes);
        if (needed <= 0) { currentLayer.complete = true; continue; }
        const used = Math.min(remaining,needed);
        currentLayer.successes += used;
        remaining -= used;
        if (currentLayer.successes >= currentLayer.target) {
            currentLayer.successes = currentLayer.target;
            currentLayer.complete = true;
            const nextTarget = currentLayer.target - 1;
            if (nextTarget > 0 && !updatedLayers.some(layer => !layer.complete))
                updatedLayers.push({ successes:0, target:nextTarget, complete:false });
            if (carryRemainder) continue;
        }
        break;
    }
    return updatedLayers;
};
