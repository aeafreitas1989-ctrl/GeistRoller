import { lazy, Suspense, useEffect, useState } from 'react';

const LoadingPanel = ({ label }) => (
    <div role="status" aria-live="polite" className="px-3 py-2 text-xs text-zinc-400" data-testid="panel-loading">
        Loading {label}...
    </div>
);

// Declare wrappers once at module scope. The loaded component keeps its identity.
// Optional activation key delays the first mount but preserves existing local state
// and cleanup behavior after that first mount, including when a panel is closed.
export const lazyPanel = (loader, exportName, label, activationKey = null) => {
    const Component = lazy(() => loader().then(module => ({ default: module[exportName] })));
    const Panel = (props) => {
        const active = activationKey === null || !!props[activationKey];
        const [activated, setActivated] = useState(active);
        useEffect(() => {
            if (active) setActivated(true);
        }, [active]);
        if (!active && !activated) return null;
        return (
            <Suspense fallback={active ? <LoadingPanel label={label} /> : null}>
                <Component {...props} />
            </Suspense>
        );
    };
    Panel.displayName = 'Lazy' + exportName;
    return Panel;
};
