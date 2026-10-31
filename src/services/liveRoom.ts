import { MOCK_COMMENTS, MOCK_NAMES } from "@/data/mock";
import { PENLIGHT_COLORS, REACTIONS } from "@/data/reactions";
import type { AudienceMember, LiveComment, ReactionType } from "@/types";

/**
 * ライブルームのリアルタイム通信レイヤー
 *
 * UI はこのインターフェース（LiveRoomConnection）だけに依存します。
 * Supabase 繋ぎ込み時は createMockConnection の代わりに、Supabase Realtime を使った
 * createSupabaseConnection を実装して差し替えてください。
 *
 *   const channel = supabase.channel(`live:${eventId}`, { config: { presence: { key: userId } } });
 *   channel
 *     .on("broadcast", { event: "reaction" }, ({ payload }) => handlers.onReaction(payload))
 *     .on("broadcast", { event: "comment" }, ({ payload }) => handlers.onComment(payload))
 *     .on("presence", { event: "sync" }, () => handlers.onAudience(Object.values(channel.presenceState()).flat()))
 *     .subscribe(async (status) => { if (status === "SUBSCRIBED") await channel.track(me); });
 *
 * - リアクション: 高頻度なので Broadcast で配信し、集計値のみ定期的に DB へ保存
 * - コメント: comments テーブルに insert → Postgres Changes もしくは Broadcast で配信
 * - 観客: Presence でオンライン状態・サイリウム色を共有
 */

export interface LiveRoomHandlers {
  onReaction: (r: { type: ReactionType; user_id: string; penlight_color: string }) => void;
  onComment: (c: LiveComment) => void;
  onAudience: (members: AudienceMember[]) => void;
  onViewerCount: (count: number) => void;
}

export interface LiveRoomConnection {
  sendReaction: (type: ReactionType) => void;
  sendComment: (body: string) => void;
  updatePresence: (patch: Partial<AudienceMember>) => void;
  disconnect: () => void;
}

const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function createMockConnection(
  eventId: string,
  me: AudienceMember,
  baseViewers: number,
  handlers: LiveRoomHandlers,
): LiveRoomConnection {
  let self = { ...me };
  let viewers = baseViewers || 1200;
  const audience: AudienceMember[] = MOCK_NAMES.map((name, i) => ({
    user_id: `mock-${i}`,
    display_name: name,
    avatar_color: rand(PENLIGHT_COLORS).value,
    penlight_color: rand(PENLIGHT_COLORS).value,
    energy: Math.random(),
  }));

  const emitAudience = () => handlers.onAudience([{ ...self, is_self: true }, ...audience]);
  emitAudience();
  handlers.onViewerCount(viewers);

  // 曲の展開（Aメロ→サビ）を模した盛り上がりの波
  let t = 0;
  const reactionTimer = window.setInterval(() => {
    t += 1;
    const wave = (Math.sin(t / 18) + 1) / 2; // 0〜1
    const count = Math.round(wave * 4 + Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const member = rand(audience);
      member.energy = Math.min(1, member.energy * 0.7 + wave * 0.5 + Math.random() * 0.2);
      handlers.onReaction({ type: rand(REACTIONS).type, user_id: member.user_id, penlight_color: member.penlight_color });
    }
  }, 350);

  const commentTimer = window.setInterval(() => {
    const member = rand(audience);
    handlers.onComment({
      id: crypto.randomUUID(),
      event_id: eventId,
      user_id: member.user_id,
      display_name: member.display_name,
      avatar_color: member.avatar_color,
      body: rand(MOCK_COMMENTS),
      created_at: new Date().toISOString(),
    });
  }, 1600);

  const presenceTimer = window.setInterval(() => {
    viewers = Math.max(1, viewers + Math.round((Math.random() - 0.4) * 40));
    handlers.onViewerCount(viewers);
    audience.forEach((m) => (m.energy = Math.max(0.05, m.energy * 0.85)));
    emitAudience();
  }, 1000);

  return {
    sendReaction(type) {
      self.energy = Math.min(1, self.energy + 0.25);
      handlers.onReaction({ type, user_id: self.user_id, penlight_color: self.penlight_color });
    },
    sendComment(body) {
      handlers.onComment({
        id: crypto.randomUUID(),
        event_id: eventId,
        user_id: self.user_id,
        display_name: self.display_name,
        avatar_color: self.avatar_color,
        body,
        created_at: new Date().toISOString(),
        is_self: true,
      });
    },
    updatePresence(patch) {
      self = { ...self, ...patch };
      emitAudience();
    },
    disconnect() {
      window.clearInterval(reactionTimer);
      window.clearInterval(commentTimer);
      window.clearInterval(presenceTimer);
    },
  };
}
