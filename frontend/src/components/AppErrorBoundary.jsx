import { Component } from "react";

// A rendering exception must never silently remove the entire character sheet.
// This displays the real exception locally; it does not upload anything.
export class AppErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, componentStack: "" };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error("[CofDRoller] Uncaught React rendering error", error, info);
        this.setState({ componentStack: info?.componentStack || "" });
    }

    render() {
        if (!this.state.error) return this.props.children;
        const message = String(this.state.error?.message || this.state.error || "Unknown error");
        return (
            <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100" role="alert" data-testid="app-error-boundary">
                <div className="mx-auto max-w-3xl space-y-4 rounded-md border border-red-700/70 bg-zinc-900 p-6">
                    <h1 className="text-xl font-bold text-red-300">Application error</h1>
                    <p className="text-sm text-zinc-300">
                        The interface encountered an error. Your saved character data is not erased by this screen.
                        Copy the message below before reloading; unsaved edits may be lost on reload.
                    </p>
                    <pre className="overflow-auto whitespace-pre-wrap break-words rounded bg-zinc-950 p-3 font-mono text-sm text-red-200" data-testid="app-error-message">{message}</pre>
                    {this.state.componentStack && (
                        <details>
                            <summary className="cursor-pointer text-sm text-zinc-300">React component stack</summary>
                            <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded bg-zinc-950 p-3 font-mono text-xs text-zinc-300">{this.state.componentStack}</pre>
                        </details>
                    )}
                    <button type="button" className="rounded bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700" onClick={() => window.location.reload()}>
                        Reload application
                    </button>
                </div>
            </main>
        );
    }
}
