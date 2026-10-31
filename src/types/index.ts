/**
 * ドメイン型定義
 * Supabase 繋ぎ込み時は `supabase gen types typescript` で生成される
 * Database 型（types/database.ts）から Row 型を参照する形に置き換える想定。
 * カラム名は DB と揃えて snake_case にしています。
 */

export type EventStatus = "upcoming" | "live" | "ended";

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  /** アバターの基本カラー（HEX） */
  avatar_color: string;
  /** サイリウムの色（HEX） */
  penlight_color: string;
  bio: string | null;
  created_at: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  artist_name: string;
  description: string;
  genre: string;
  start_at: string;
  end_at: string;
  status: EventStatus;
  /** サムネイル（Supabase Storage の URL を想定。未設定時はグラデーションで表示） */
  thumbnail_url: string | null;
  /** サムネイル未設定時に使うグラデーション（Tailwind クラス） */
  theme_gradient: string;
  /** 推奨サイリウムカラー */
  theme_colors: string[];
  price: number;
  viewer_count: number;
  tags: string[];
  setlist: string[];
}

export interface Ticket {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
}

export type ReactionType = "cheer" | "clap" | "heart" | "fire" | "wave" | "jump";

export interface Reaction {
  id: string;
  event_id: string;
  user_id: string;
  type: ReactionType;
  created_at: string;
}

export interface LiveComment {
  id: string;
  event_id: string;
  user_id: string;
  display_name: string;
  avatar_color: string;
  body: string;
  created_at: string;
  is_self?: boolean;
}

/** ライブルーム内で表示する観客（Supabase Realtime Presence を想定） */
export interface AudienceMember {
  user_id: string;
  display_name: string;
  avatar_color: string;
  penlight_color: string;
  /** 0〜1 の盛り上がり度。アバターの動きの大きさに反映 */
  energy: number;
  is_self?: boolean;
}

export interface ExperienceSettings {
  cheer_volume: number;
  effect_intensity: number;
  haptics_enabled: boolean;
  spatial_audio_enabled: boolean;
  reduce_flashing: boolean;
  show_comments: boolean;
  captions_enabled: boolean;
}
