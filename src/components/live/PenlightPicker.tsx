import { Check } from "lucide-react";

import { PENLIGHT_COLORS } from "@/data/reactions";
import { cn } from "@/lib/utils";

export function PenlightPicker({ value, onChange, recommended = [] }: { value: string; onChange: (c: string) => void; recommended?: string[] }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-4" role="radiogroup" aria-label="サイリウムの色">
      {PENLIGHT_COLORS.map((c) => {
        const active = value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(c.value)}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-xl border border-transparent p-2 transition-colors hover:bg-white/5",
              active && "border-white/30 bg-white/10",
            )}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: c.value, boxShadow: active ? `0 0 16px ${c.value}` : undefined }}
            >
              {active && <Check className="h-4 w-4 text-black" />}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">{c.name}</span>
            {recommended.includes(c.value) && (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-primary px-1 text-[9px] font-bold">推奨</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
