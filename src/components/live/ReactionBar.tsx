import { useRef, useState } from "react";

import { REACTIONS } from "@/data/reactions";
import { cn } from "@/lib/utils";
import type { ReactionType } from "@/types";

interface Props {
  onReact: (type: ReactionType) => void;
  counts: Record<ReactionType, number>;
  hapticsEnabled: boolean;
  className?: string;
}

/** リアクション送信ボタン群（長押しで連打） */
export function ReactionBar({ onReact, counts, hapticsEnabled, className }: Props) {
  const [pressed, setPressed] = useState<ReactionType | null>(null);
  const holdTimer = useRef<number | null>(null);

  const fire = (type: ReactionType) => {
    onReact(type);
    if (hapticsEnabled && "vibrate" in navigator) navigator.vibrate?.(type === "jump" ? 40 : 15);
  };

  const start = (type: ReactionType) => {
    setPressed(type);
    fire(type);
    holdTimer.current = window.setInterval(() => fire(type), 180);
  };
  const stop = () => {
    setPressed(null);
    if (holdTimer.current) window.clearInterval(holdTimer.current);
    holdTimer.current = null;
  };

  return (
    <div className={cn("grid grid-cols-6 gap-1.5 sm:gap-2", className)} role="group" aria-label="リアクションを送る">
      {REACTIONS.map((r) => (
        <button
          key={r.type}
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            start(r.type);
          }}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fire(r.type)}
          className={cn(
            "group relative flex select-none flex-col items-center justify-center gap-0.5 rounded-2xl border border-white/10 bg-white/[0.04] py-2 transition-all hover:border-primary/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:py-3",
            pressed === r.type && "scale-95 border-primary bg-primary/20 shadow-[0_0_20px_-4px_rgba(255,61,154,0.8)]",
          )}
          aria-label={`${r.label}を送る`}
        >
          <span className="text-2xl transition-transform group-active:scale-125 sm:text-3xl">{r.emoji}</span>
          <span className="text-[10px] font-bold text-muted-foreground sm:text-xs">{r.label}</span>
          <span className="font-display absolute -right-1 -top-1.5 hidden rounded-full bg-black/80 px-1.5 text-[10px] font-bold tabular-nums text-muted-foreground sm:block">
            {counts[r.type] > 999 ? `${Math.floor(counts[r.type] / 1000)}k` : counts[r.type]}
          </span>
        </button>
      ))}
    </div>
  );
}
