import {
  ArrowRight,
  Glasses,
  HeartHandshake,
  Laptop,
  MapPin,
  MessageCircle,
  Smartphone,
  Sparkles,
  Ticket,
  Users,
  Vibrate,
  Volume2,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Penlight } from "@/components/common/Penlight";
import { EventCard } from "@/components/events/EventCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PENLIGHT_COLORS } from "@/data/reactions";
import { listEvents } from "@/services/events";
import type { LiveEvent } from "@/types";

const CROWD = Array.from({ length: 28 }, (_, i) => ({
  color: PENLIGHT_COLORS[i % 4].value,
  delay: (i % 7) * 0.13,
  duration: 1 + (i % 3) * 0.2,
  height: 40 + ((i * 37) % 30),
}));

const HERO_EMOJIS = ["🔥", "👏", "💖", "📣", "⚡", "🙌"];

function HeroFloating() {
  const [items, setItems] = useState<{ id: number; emoji: string; x: number; drift: number }[]>([]);
  useEffect(() => {
    let id = 0;
    const timer = window.setInterval(() => {
      id += 1;
      setItems((prev) => [
        ...prev.slice(-14),
        { id, emoji: HERO_EMOJIS[id % HERO_EMOJIS.length], x: 5 + Math.random() * 90, drift: (Math.random() - 0.5) * 60 },
      ]);
    }, 450);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 h-72 overflow-hidden" aria-hidden>
      {items.map((it) => (
        <span
          key={it.id}
          className="absolute bottom-0 animate-float-up text-2xl sm:text-3xl"
          style={{ left: `${it.x}%`, ["--drift" as string]: `${it.drift}px` }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}

const FEATURES = [
  {
    icon: Waves,
    title: "会場の熱量メーター",
    body: "全員のリアクションをリアルタイムに集計。いま会場がどれだけ盛り上がっているかが、メーターと光の演出でひと目でわかります。",
  },
  {
    icon: Volume2,
    title: "みんなの歓声が聞こえる",
    body: "リアクションが歓声・拍手・コールの音に変換され、配信音声に重なります。ひとりで観ていても「周りに観客がいる」感覚に。",
  },
  {
    icon: Sparkles,
    title: "サイリウムで一体感",
    body: "好きな色のサイリウムを振ると、観客席全体の光の海に反映。推し色で会場を染める体験を、自宅から。",
  },
  {
    icon: Users,
    title: "となりの観客を感じる",
    body: "アバターが盛り上がりに合わせて跳ねたり手を振ったり。同じ曲で同じ瞬間に跳ぶ、あの感覚をもう一度。",
  },
];

const STEPS = [
  { icon: Ticket, title: "ライブを選んで参加登録", body: "気になるライブを見つけて参加。スマホでもPCでもOK。" },
  { icon: Sparkles, title: "アバターとサイリウムを準備", body: "自分のアバターと推し色のサイリウムを設定しよう。" },
  { icon: HeartHandshake, title: "ワンタップで熱量を届ける", body: "歓声・拍手・ジャンプをタップ。あなたの熱が会場の演出に変わります。" },
];

const DEVICES = [
  { icon: Smartphone, title: "スマートフォン", body: "片手でリアクション。通知のように振動で盛り上がりを感じられます。", status: "対応" },
  { icon: Laptop, title: "PC / タブレット", body: "大画面で映像とコメント、観客席を同時に楽しめます。", status: "対応" },
  { icon: Glasses, title: "VRゴーグル", body: "周囲の観客の存在と空間音響で、まるで客席にいるような没入感。", status: "準備中" },
  { icon: Vibrate, title: "振動デバイス", body: "低音や会場のどよめきを、身体で感じる体験へ。", status: "将来対応" },
];

const TARGETS = [
  { icon: MapPin, text: "会場まで遠く、遠征が難しい" },
  { icon: HeartHandshake, text: "体調や身体的な事情で現地参加が難しい" },
  { icon: Users, text: "人混みが不安で、会場に行くのをためらってしまう" },
  { icon: Ticket, text: "チケットが取れなかった" },
];

export default function LandingPage() {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);

  useEffect(() => {
    listEvents().then((events) => setLiveEvents(events.filter((e) => e.status !== "ended").slice(0, 3)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="stage-bg relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-20 left-[10%] h-[140%] w-40 origin-top animate-beam-sweep bg-gradient-to-b from-neon-pink/40 to-transparent blur-2xl" />
          <div
            className="absolute -top-20 right-[10%] h-[140%] w-40 origin-top animate-beam-sweep bg-gradient-to-b from-neon-cyan/30 to-transparent blur-2xl"
            style={{ animationDelay: "-3s" }}
          />
        </div>

        <div className="container relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center pb-40 pt-16 text-center sm:pb-48">
          <Badge variant="outline" className="mb-6 gap-2 border-white/20 bg-white/5 px-4 py-1.5 text-sm backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            いま {liveEvents.filter((e) => e.status === "live").length || 2} 公演がライブ中
          </Badge>
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            離れていても、
            <br />
            <span className="text-gradient">同じ会場</span>にいる。
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            ALLSTANDは、オンラインライブの観客同士の歓声・リアクション・サイリウムをリアルタイムで共有。
            自宅にいながら、会場全体の「熱量」を感じられるライブ体験です。
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button variant="neon" size="lg" asChild>
              <Link to="/live/neon-horizon-2026">
                いま盛り上がっているライブへ <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/events">ライブを探す</Link>
            </Button>
          </div>
        </div>

        <HeroFloating />

        {/* 観客席（サイリウムの海） */}
        <div className="absolute inset-x-0 bottom-0 flex h-36 items-end justify-center gap-3 overflow-hidden px-2 sm:gap-5" aria-hidden>
          {CROWD.map((c, i) => (
            <div key={i} className="flex shrink-0 flex-col items-center">
              <Penlight color={c.color} delay={c.delay} duration={c.duration} />
              <div className="mt-1 h-7 w-7 rounded-full bg-black" />
              <div className="-mt-1 w-12 rounded-t-[2rem] bg-black" style={{ height: c.height }} />
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>
      </section>

      {/* 課題 */}
      <section className="container py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-sm font-bold tracking-[0.3em] text-primary">PROBLEM</p>
          <h2 className="mt-3 text-balance text-2xl font-extrabold sm:text-4xl">
            オンラインライブが、
            <br className="sm:hidden" />
            「ただ映像を見るだけ」になっていませんか？
          </h2>
          <p className="mt-5 text-muted-foreground">
            配信でライブを観ることはできるようになりました。けれど、周りの歓声、跳ねる観客、会場を染めるサイリウム——
            現地で感じる「みんなで盛り上がる感覚」までは届いていません。
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          {TARGETS.map(({ icon: Icon, text }) => (
            <div key={text} className="glass flex items-center gap-4 rounded-2xl p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-bold">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-lg font-bold">
          そんなあなたにも、<span className="text-gradient">会場の一体感</span>を。
        </p>
      </section>

      {/* できること */}
      <section id="features" className="scroll-mt-20 border-y border-white/5 bg-white/[0.02] py-20 sm:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-sm font-bold tracking-[0.3em] text-primary">FEATURES</p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-4xl">観客の熱量を、演出に変える</h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-pink to-neon-violet text-white shadow-[0_0_24px_-6px_rgba(255,61,154,0.8)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 参加のしかた */}
      <section id="how" className="container scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-bold tracking-[0.3em] text-primary">HOW IT WORKS</p>
          <h2 className="mt-3 text-2xl font-extrabold sm:text-4xl">参加は、たった3ステップ</h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="relative rounded-2xl border bg-card p-6 pt-8">
              <span className="font-display absolute -top-4 left-6 rounded-full bg-gradient-to-r from-neon-pink to-neon-violet px-3 py-1 text-sm font-black">
                STEP {i + 1}
              </span>
              <Icon className="h-8 w-8 text-neon-cyan" />
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* デバイス */}
      <section id="devices" className="scroll-mt-20 border-y border-white/5 bg-white/[0.02] py-20 sm:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-sm font-bold tracking-[0.3em] text-primary">DEVICES</p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-4xl">いつものスマホから、VRまで</h2>
            <p className="mt-4 text-muted-foreground">
              手軽に参加できるスマホ・PCに加え、より深い没入感を求める人のためのVR・振動デバイス連携も目指しています。
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEVICES.map(({ icon: Icon, title, body, status }) => (
              <div key={title} className="rounded-2xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-neon-violet" />
                  <Badge variant={status === "対応" ? "default" : "muted"}>{status}</Badge>
                </div>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 開催中・開催予定 */}
      <section className="container py-20 sm:py-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold tracking-[0.3em] text-primary">LIVE NOW & UPCOMING</p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">注目のライブ</h2>
          </div>
          <Button variant="ghost" asChild className="shrink-0">
            <Link to="/events">
              すべて見る <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {liveEvents.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neon-pink via-neon-violet to-indigo-700 p-8 text-center sm:p-14">
          <div className="noise absolute inset-0 opacity-30" aria-hidden />
          <MessageCircle className="mx-auto h-10 w-10" />
          <h2 className="relative mt-4 text-balance text-2xl font-extrabold sm:text-4xl">
            あなたの歓声を、待っている人がいる。
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/80">登録は無料。好きなライブに、好きな場所から参加しよう。</p>
          <Button size="lg" asChild className="relative mt-8 bg-white text-zinc-900 hover:bg-white/90">
            <Link to="/signup">
              無料でアカウント作成 <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
