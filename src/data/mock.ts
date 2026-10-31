import type { LiveEvent, Profile } from "@/types";

/**
 * モックデータ
 * Supabase 繋ぎ込み後は services/ 配下の関数が DB から取得するため、このファイルは削除可能です。
 */

const now = Date.now();
const h = 60 * 60 * 1000;
const iso = (offset: number) => new Date(now + offset).toISOString();

export const MOCK_EVENTS: LiveEvent[] = [
  {
    id: "neon-horizon-2026",
    title: "NEON HORIZON TOUR 2026 -FINAL-",
    artist_name: "LUMINA",
    description:
      "全国ツアーのファイナル公演を完全生配信。ステージを包むレーザー演出とともに、全国のファンの歓声をひとつに。ラストの大合唱パートでは、あなたの「歓声」がそのまま会場演出に反映されます。",
    genre: "J-POP",
    start_at: iso(-0.5 * h),
    end_at: iso(2 * h),
    status: "live",
    thumbnail_url: null,
    theme_gradient: "from-fuchsia-600 via-violet-700 to-indigo-900",
    theme_colors: ["#ff3d9a", "#7c5cff"],
    price: 3800,
    viewer_count: 12840,
    tags: ["ツアーファイナル", "サイリウム推奨"],
    setlist: ["Opening -Horizon-", "Starlight Runner", "ネオンの海", "君と鳴らす鼓動", "MC", "Afterglow", "HORIZON (アンコール)"],
  },
  {
    id: "midnight-groove",
    title: "Midnight Groove Session",
    artist_name: "The Velvet Owls",
    description:
      "夜更けのジャズ・ファンクセッション。しっとりしたバラードから踊れるグルーヴまで。拍手リアクションで演奏者に想いを届けよう。",
    genre: "Jazz / Funk",
    start_at: iso(-0.2 * h),
    end_at: iso(1.5 * h),
    status: "live",
    thumbnail_url: null,
    theme_gradient: "from-amber-500 via-orange-700 to-rose-900",
    theme_colors: ["#fbbf24", "#f43f5e"],
    price: 2500,
    viewer_count: 3210,
    tags: ["着席ライブ", "拍手推奨"],
    setlist: ["Owl's Theme", "Velvet Night", "Moonlit Walk", "Groove Machine"],
  },
  {
    id: "sakura-beat",
    title: "SAKURA BEAT FES 2026",
    artist_name: "Various Artists",
    description:
      "春を彩る大型フェスをオンラインで。複数ステージを切り替えながら、各ステージの「熱量マップ」で今いちばん盛り上がっている場所がひと目でわかります。",
    genre: "フェス",
    start_at: iso(26 * h),
    end_at: iso(34 * h),
    status: "upcoming",
    thumbnail_url: null,
    theme_gradient: "from-pink-400 via-rose-500 to-purple-700",
    theme_colors: ["#ff3d9a", "#f8fafc"],
    price: 5500,
    viewer_count: 0,
    tags: ["フェス", "マルチステージ"],
    setlist: [],
  },
  {
    id: "aurora-acoustic",
    title: "Aurora Acoustic Night",
    artist_name: "白瀬ミナト",
    description: "弾き語りで届ける、120分のアコースティックライブ。静かな曲ではリアクション演出を控えめにする「しっとりモード」で開催。",
    genre: "シンガーソングライター",
    start_at: iso(3 * 24 * h),
    end_at: iso(3 * 24 * h + 2 * h),
    status: "upcoming",
    thumbnail_url: null,
    theme_gradient: "from-cyan-400 via-sky-600 to-indigo-900",
    theme_colors: ["#22d3ee", "#3b82f6"],
    price: 3000,
    viewer_count: 0,
    tags: ["アコースティック", "しっとりモード"],
    setlist: [],
  },
  {
    id: "voltage-rock",
    title: "VOLTAGE ROCK ARENA",
    artist_name: "BLAZE CIRCUIT",
    description: "轟音ロックバンドのアリーナ公演。ジャンプリアクションが一定数集まると、画面全体が揺れる特別演出が発動。",
    genre: "ROCK",
    start_at: iso(7 * 24 * h),
    end_at: iso(7 * 24 * h + 3 * h),
    status: "upcoming",
    thumbnail_url: null,
    theme_gradient: "from-red-500 via-orange-600 to-zinc-900",
    theme_colors: ["#f43f5e", "#fbbf24"],
    price: 4800,
    viewer_count: 0,
    tags: ["ジャンプ推奨", "振動デバイス対応予定"],
    setlist: [],
  },
  {
    id: "pixel-idol",
    title: "PIXEL☆PARADE 3rd Anniversary",
    artist_name: "ぴくせる☆パレード",
    description: "3周年記念ライブのアーカイブ配信。当日のコメントと熱量の推移を再生しながら、もう一度あの一体感を。",
    genre: "アイドル",
    start_at: iso(-5 * 24 * h),
    end_at: iso(-5 * 24 * h + 2.5 * h),
    status: "ended",
    thumbnail_url: null,
    theme_gradient: "from-lime-400 via-emerald-500 to-teal-800",
    theme_colors: ["#a3e635", "#22d3ee"],
    price: 2000,
    viewer_count: 28450,
    tags: ["アーカイブ", "熱量リプレイ"],
    setlist: ["Pixel Parade!", "8bit Heart", "きらきらコンティニュー", "Game Over? No!"],
  },
];

export const MOCK_PROFILE: Profile = {
  id: "mock-user-1",
  display_name: "ゆうせい",
  avatar_url: null,
  avatar_color: "#7c5cff",
  penlight_color: "#ff3d9a",
  bio: "ライブが生きがい。遠方なのでオンライン参戦多めです！",
  created_at: iso(-90 * 24 * h),
};

export const MOCK_NAMES = [
  "あおい", "ハル", "みかん", "ソラ", "Ken", "りん", "たっくん", "Mika", "なぎ", "こはる",
  "ゆず", "レオ", "Saki", "つばさ", "まめ", "かえで", "Yuto", "ひなた", "もも", "シン",
];

export const MOCK_COMMENTS = [
  "きたーーー！！",
  "この曲待ってた😭",
  "北海道から参戦！",
  "サビで一緒に跳ぼう",
  "音響めっちゃいい",
  "会場の声が聞こえる気がする",
  "ペンライトピンクにした！",
  "最高すぎる🔥",
  "泣いてる",
  "家なのに汗かいてきたw",
  "アンコール！アンコール！",
  "みんなの歓声で鳥肌",
  "初めてのオンラインライブだけど楽しい",
  "MCかわいい",
  "沖縄から見てます🌺",
];
