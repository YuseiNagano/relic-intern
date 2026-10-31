import type { FloatingReaction } from "@/hooks/useLiveRoom";

/** 画面下から湧き上がるリアクション演出 */
export function FloatingReactions({ items, intensity }: { items: FloatingReaction[]; intensity: number }) {
  // 演出の強さに応じて表示数を間引く（自分のリアクションは常に表示）
  const visible = items.filter((it, i) => it.isSelf || i % Math.max(1, Math.round(100 / Math.max(intensity, 10))) === 0);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {visible.map((it) => (
        <span
          key={it.id}
          className="absolute bottom-2 animate-float-up text-2xl sm:text-3xl"
          style={{
            left: `${it.x}%`,
            ["--drift" as string]: `${it.drift}px`,
            filter: it.isSelf ? `drop-shadow(0 0 10px ${it.color})` : undefined,
            fontSize: it.isSelf ? "2.25rem" : undefined,
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}
