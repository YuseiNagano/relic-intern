import type { ReactionType } from "@/types";

export const REACTIONS: { type: ReactionType; emoji: string; label: string; heat: number }[] = [
  { type: "cheer", emoji: "📣", label: "歓声", heat: 3 },
  { type: "clap", emoji: "👏", label: "拍手", heat: 2 },
  { type: "heart", emoji: "💖", label: "好き", heat: 2 },
  { type: "fire", emoji: "🔥", label: "アツい", heat: 4 },
  { type: "wave", emoji: "🙌", label: "手を振る", heat: 2 },
  { type: "jump", emoji: "⚡", label: "ジャンプ", heat: 5 },
];

export const REACTION_MAP = Object.fromEntries(REACTIONS.map((r) => [r.type, r])) as Record<
  ReactionType,
  (typeof REACTIONS)[number]
>;

export const PENLIGHT_COLORS = [
  { name: "ピンク", value: "#ff3d9a" },
  { name: "バイオレット", value: "#7c5cff" },
  { name: "シアン", value: "#22d3ee" },
  { name: "ライム", value: "#a3e635" },
  { name: "アンバー", value: "#fbbf24" },
  { name: "レッド", value: "#f43f5e" },
  { name: "ホワイト", value: "#f8fafc" },
  { name: "ブルー", value: "#3b82f6" },
];

export const HEAT_LEVELS = [
  { min: 0, label: "しっとり", color: "text-neon-cyan" },
  { min: 30, label: "あたたまってきた", color: "text-neon-lime" },
  { min: 55, label: "盛り上がり中", color: "text-neon-amber" },
  { min: 75, label: "最高潮！", color: "text-neon-pink" },
  { min: 92, label: "会場が揺れてる！！", color: "text-red-400" },
];

export function getHeatLevel(heat: number) {
  return [...HEAT_LEVELS].reverse().find((l) => heat >= l.min) ?? HEAT_LEVELS[0];
}
