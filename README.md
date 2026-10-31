# ALLSTAND（オールスタンド）

> 離れていても、観客の「熱量」を共有できるオンラインライブ体験

オンラインライブの観客同士のリアクション（歓声・拍手・ジャンプ・コメント・サイリウム）をリアルタイムで集約し、
熱量メーター・観客アバター・ステージ演出として表現する参加型ライブ視聴サービスの UI です。

現在は **UI のみ（モックデータ）** で動作します。Supabase との繋ぎ込みを前提に、データアクセスは `src/services/` に集約しています。

## セットアップ

```bash
npm install
npm run dev
```

## 技術スタック

| 用途 | 採用技術 | 理由 |
| --- | --- | --- |
| ビルド | Vite 6 + TypeScript | Bolt の標準テンプレートと同じ構成。高速 HMR |
| UI | React 18 | shadcn/ui・Radix と最も相性の良い安定版 |
| ルーティング | React Router v6 | SPA の定番。Bolt 上でもそのまま動作 |
| スタイル | Tailwind CSS v3 | shadcn/ui 公式手順と互換。`tailwind.config.js` でネオン系テーマを定義 |
| UI コンポーネント | shadcn/ui（Radix UI） | `src/components/ui/` に配置。`components.json` 同梱で `npx shadcn add` も可 |
| アイコン | lucide-react | shadcn/ui 標準 |
| バックエンド（予定） | Supabase（Auth / Postgres / Realtime / Storage） | `@supabase/supabase-js` 導入済み。`.env.example` 参照 |

## サイトマップ

```
/                      トップ（LP：課題・できること・参加方法・対応デバイス・注目ライブ）
├── /events            ライブを探す（検索・ライブ中/開催予定/アーカイブ絞り込み）
│   └── /events/:id    イベント詳細（楽しみ方・セットリスト・参加登録ダイアログ）
├── /live/:id          ライブ会場 ★コア体験
│                        映像ステージ / 熱量メーター / 観客席（アバター＋サイリウム）
│                        リアクション送信 / コメント / サイリウム色 / 体験設定
├── /login             ログイン
├── /signup            新規登録
├── /mypage            マイページ（要ログイン）
│     ?tab=tickets       参加予定
│     ?tab=history       参加履歴
│     ?tab=avatar        アバター・サイリウム設定
├── /settings          設定（要ログイン：ライブ体験・通知・アカウント）
└── *                  404
```

## ディレクトリ構成

```
src/
├── components/
│   ├── ui/        shadcn/ui コンポーネント
│   ├── layout/    Header / Footer / AppLayout / AuthLayout / RequireAuth
│   ├── common/    Logo / Penlight / EventArtwork / UserAvatar
│   ├── events/    EventCard / EventStatusBadge
│   └── live/      LiveStage / HeatMeter / CrowdView / ReactionBar / CommentPanel など
├── pages/         各画面
├── hooks/         useAuth / useLiveRoom / useExperienceSettings
├── services/      データアクセス層（★Supabase 差し替えポイント）
├── data/          モックデータ・リアクション定義
├── lib/           Supabase クライアント・ユーティリティ
└── types/         ドメイン型（DB のカラム名と一致）
supabase/schema.sql  テーブル・RLS のスキーマ案
```

## Supabase 繋ぎ込みの手順（予定）

1. `.env.example` を `.env.local` にコピーし、`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` を設定
2. `supabase/schema.sql` を SQL Editor で実行
3. `src/services/*.ts` の `TODO(supabase)` 箇所を `supabase` クライアント呼び出しに置き換え
   - `auth.ts` → Supabase Auth（メール / Google OAuth）
   - `events.ts` / `tickets.ts` → `events` / `tickets` テーブル
   - `liveRoom.ts` → Realtime チャンネル（リアクション: Broadcast、観客: Presence、コメント: テーブル＋配信）
4. `hooks/useAuth.tsx` で `onAuthStateChange` を購読する

UI は `services/` のインターフェースだけに依存しているため、画面側の変更はほぼ不要です。
