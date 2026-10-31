import { cn } from "@/lib/utils";
import type { AudienceMember } from "@/types";

/**
 * 観客席ビュー：周囲の観客アバターがサイリウムを振り、盛り上がりに応じて跳ねる
 * VR モード時は 3D 空間（React Three Fiber / WebXR など）に置き換える想定
 */
export function CrowdView({
  audience,
  heat,
  reduceMotion,
  className,
}: {
  audience: AudienceMember[];
  heat: number;
  reduceMotion: boolean;
  className?: string;
}) {
  const members = audience.slice(0, 16);
  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl border bg-gradient-to-b from-[#120a24] to-black px-2 pt-6", className)}
      aria-label={`周りの観客 ${audience.length}人`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full transition-opacity duration-500"
        style={{ background: "radial-gradient(80% 60% at 50% 0%, rgba(255,61,154,0.35), transparent 70%)", opacity: heat / 100 }}
        aria-hidden
      />
      <ul className="relative flex items-end justify-between gap-1">
        {members.map((m, i) => {
          const jumping = !reduceMotion && m.energy > 0.55;
          return (
            <li key={m.user_id} className={cn("flex min-w-0 flex-1 flex-col items-center", i >= 10 && "hidden sm:flex", i >= 13 && "sm:hidden lg:flex")}>
              <div
                className={cn("flex flex-col items-center", jumping && "animate-bounce2")}
                style={{ animationDelay: `${(i % 5) * 0.1}s`, animationDuration: `${0.9 - m.energy * 0.4}s` }}
              >
                {/* サイリウム */}
                <div
                  className={cn("h-7 w-1.5 rounded-full sm:h-9", !reduceMotion && "animate-sway")}
                  style={{
                    background: m.penlight_color,
                    boxShadow: `0 0 ${6 + m.energy * 14}px ${m.penlight_color}`,
                    transformOrigin: "50% 100%",
                    animationDelay: `${(i % 4) * 0.15}s`,
                    opacity: 0.5 + m.energy * 0.5,
                  }}
                />
                {/* アバター */}
                <div
                  className={cn("mt-1 h-6 w-6 rounded-full sm:h-7 sm:w-7", m.is_self && "ring-2 ring-white ring-offset-2 ring-offset-black")}
                  style={{ background: `linear-gradient(135deg, ${m.avatar_color}, #1e1036)` }}
                />
                <div className="-mt-0.5 h-5 w-9 rounded-t-full bg-white/10 sm:w-10" />
              </div>
              <span className={cn("mt-1 w-full truncate text-center text-[10px]", m.is_self ? "font-bold text-foreground" : "text-muted-foreground")}>
                {m.is_self ? "あなた" : m.display_name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
