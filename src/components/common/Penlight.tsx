import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface Props {
  color: string;
  className?: string;
  animated?: boolean;
  delay?: number;
  duration?: number;
}

/** サイリウム（ペンライト）の SVG 風コンポーネント */
export function Penlight({ color, className, animated = true, delay = 0, duration = 1.2 }: Props) {
  const style: CSSProperties = {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    transformOrigin: "50% 100%",
  };
  return (
    <div className={cn("relative h-14 w-2", animated && "animate-sway", className)} style={style} aria-hidden>
      <div
        className="absolute inset-x-0 top-0 h-[78%] rounded-full"
        style={{ background: color, boxShadow: `0 0 10px 2px ${color}, 0 0 28px 6px ${color}66` }}
      />
      <div className="absolute inset-x-[-1px] bottom-0 h-[24%] rounded-sm bg-zinc-700" />
    </div>
  );
}
