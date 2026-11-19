import { validateGeistCreation } from '../../utils/geistCreationAudit';
export const GeistCreationAuditPanel = ({ character }) => {
    const result = validateGeistCreation(character);
    return (
        <details className="mb-2 rounded border border-zinc-800 bg-zinc-900/25 p-2 text-xs" data-testid="geist-creation-audit">
            <summary className="cursor-pointer text-teal-300">Geist 2e Creation Audit {result.valid ? '(valid starting allocation)' : '(' + result.errors.length + ' items to check)'}</summary>
            <div className="mt-2 space-y-1">
                <p className="text-zinc-400">Starting rules only. This checklist is not applied to established characters.</p>
                {result.errors.map((message, index) => <p key={'error-' + index} className="text-amber-300">{message}</p>)}
                {result.warnings.map((message, index) => <p key={'warn-' + index} className="text-zinc-400">{message}</p>)}
                {result.valid && !result.warnings.length && <p className="text-teal-300">Starting allocation checks passed.</p>}
            </div>
        </details>
    );
};
