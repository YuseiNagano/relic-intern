import { Flame } from "lucide-react";

import { getHeatLevel } from "@/data/reactions";
import { cn } from "@/lib/utils";

/** 会場全体の熱量メーター */
export function HeatMeter({ heat, className, compact = false }: { heat: number; className?: string; compact?: boolean }) {
  const level = getHeatLevel(heat);
  return (
    <div className={cn("glass rounded-2xl px-3 py-2", className)} role="meter" aria-valuenow={heat} aria-valuemin={0} aria-valuemax={100} aria-label="会場の熱量">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Flame className={cn("h-4 w-4", level.color)} />
          <span className="text-xs font-bold text-muted-foreground">会場の熱量</span>
        </div>
        <span className={cn("text-xs font-bold", level.color)}>{level.label}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-neon-cyan via-neon-amber to-neon-pink transition-[width] duration-300"
            style={{ width: `${heat}%` }}
          />
        </div>
        {!compact && <span className="font-display w-8 text-right text-sm font-black tabular-nums">{heat}</span>}
      </div>
    </div>
  );
}
