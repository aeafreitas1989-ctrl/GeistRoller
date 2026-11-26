import { Dices, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatDots } from './StatComponents';

export const CeremonySheetEntry = ({ ceremony, index, onDelete, onRoll }) => {
  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-sm bg-fuchsia-950/20 border border-fuchsia-500/20 group">
      <button
        type="button"
        onClick={onRoll}
        className="flex items-center gap-2 min-w-0 flex-1 text-left"
        data-testid={`ceremony-${(ceremony.name || "").toLowerCase().replace(/\s+/g, "-")}-roll`}
      >
        <Dices className="w-3 h-3 text-fuchsia-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
        <span className="text-xs text-zinc-200 truncate">{ceremony.name}</span>
        <StatDots
          value={ceremony.dots || 1}
          max={5}
          color="zinc"
          size="small"
          clickable={false}
          testIdPrefix={`ceremony-${(ceremony.name || "").toLowerCase().replace(/\s+/g, "-")}`}
        />
      </button>

      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="h-5 w-5 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400"
        data-testid={`ceremony-${index}-delete`}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};
