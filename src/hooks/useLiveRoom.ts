import { useCallback, useEffect, useRef, useState } from "react";

import { REACTION_MAP } from "@/data/reactions";
import { createMockConnection, type LiveRoomConnection } from "@/services/liveRoom";
import type { AudienceMember, LiveComment, Profile, ReactionType } from "@/types";

export interface FloatingReaction {
  id: string;
  emoji: string;
  x: number; // 0〜100 (%)
  drift: number;
  color: string;
  isSelf: boolean;
}

const MAX_COMMENTS = 80;
const MAX_FLOATING = 40;

/**
 * ライブルームの状態管理フック
 * 通信は services/liveRoom の LiveRoomConnection 経由のため、
 * Supabase Realtime への差し替え時もこのフックと UI は変更不要です。
 */
export function useLiveRoom(eventId: string, profile: Profile | null, baseViewers: number) {
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [audience, setAudience] = useState<AudienceMember[]>([]);
  const [viewerCount, setViewerCount] = useState(baseViewers);
  const [heat, setHeat] = useState(35);
  const [floating, setFloating] = useState<FloatingReaction[]>([]);
  const [counts, setCounts] = useState<Record<ReactionType, number>>({
    cheer: 0, clap: 0, heart: 0, fire: 0, wave: 0, jump: 0,
  });
  const [myReactionCount, setMyReactionCount] = useState(0);
  const connRef = useRef<LiveRoomConnection | null>(null);
  const heatRef = useRef(35);

  const userId = profile?.id ?? "guest";
  const displayName = profile?.display_name ?? "ゲスト";
  const avatarColor = profile?.avatar_color ?? "#7c5cff";
  const initialPenlight = profile?.penlight_color ?? "#ff3d9a";

  useEffect(() => {
    const conn = createMockConnection(
      eventId,
      { user_id: userId, display_name: displayName, avatar_color: avatarColor, penlight_color: initialPenlight, energy: 0.3 },
      baseViewers,
      {
        onReaction: ({ type, user_id, penlight_color }) => {
          const def = REACTION_MAP[type];
          heatRef.current = Math.min(100, heatRef.current + def.heat * 0.6);
          setCounts((c) => ({ ...c, [type]: c[type] + 1 }));
          const isSelf = user_id === userId;
          setFloating((f) => [
            ...f.slice(-MAX_FLOATING),
            {
              id: crypto.randomUUID(),
              emoji: def.emoji,
              x: isSelf ? 70 + Math.random() * 20 : 5 + Math.random() * 90,
              drift: (Math.random() - 0.5) * 80,
              color: penlight_color,
              isSelf,
            },
          ]);
        },
        onComment: (c) => setComments((prev) => [...prev.slice(-MAX_COMMENTS), c]),
        onAudience: setAudience,
        onViewerCount: setViewerCount,
      },
    );
    connRef.current = conn;

    // 熱量は時間とともに自然に下がる（減衰）
    const decay = window.setInterval(() => {
      heatRef.current = Math.max(8, heatRef.current * 0.94);
      setHeat(Math.round(heatRef.current));
    }, 300);

    return () => {
      conn.disconnect();
      window.clearInterval(decay);
    };
    // プロフィール変更でルームに再接続しないよう、色は updatePresence で反映する
  }, [eventId, userId]);

  // 古い浮遊リアクションを掃除
  useEffect(() => {
    if (floating.length === 0) return;
    const timer = window.setTimeout(() => setFloating((f) => f.slice(Math.ceil(f.length / 3))), 2400);
    return () => window.clearTimeout(timer);
  }, [floating]);

  const sendReaction = useCallback((type: ReactionType) => {
    connRef.current?.sendReaction(type);
    setMyReactionCount((n) => n + 1);
  }, []);

  const sendComment = useCallback((body: string) => {
    const trimmed = body.trim();
    if (trimmed) connRef.current?.sendComment(trimmed);
  }, []);

  const setPenlightColor = useCallback((color: string) => {
    connRef.current?.updatePresence({ penlight_color: color });
  }, []);

  return {
    comments,
    audience,
    viewerCount,
    heat,
    floating,
    counts,
    myReactionCount,
    sendReaction,
    sendComment,
    setPenlightColor,
  };
}
