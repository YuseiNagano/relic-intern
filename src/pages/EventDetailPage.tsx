import { ArrowLeft, CalendarDays, CheckCircle2, Clock, Music, Play, Ticket, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { EventArtwork } from "@/components/common/EventArtwork";
import { Penlight } from "@/components/common/Penlight";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { formatDateTime, formatNumber } from "@/lib/utils";
import { getEvent } from "@/services/events";
import { createTicket, hasTicket } from "@/services/tickets";
import type { LiveEvent } from "@/types";

import NotFoundPage from "./NotFoundPage";

export default function EventDetailPage() {
  const { eventId = "" } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [event, setEvent] = useState<LiveEvent | null | undefined>(undefined);
  const [joined, setJoined] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getEvent(eventId).then(setEvent);
  }, [eventId]);

  useEffect(() => {
    if (profile) hasTicket(profile.id, eventId).then(setJoined);
  }, [profile, eventId]);

  if (event === undefined) {
    return <div className="container py-20 text-center text-muted-foreground">読み込み中…</div>;
  }
  if (event === null) return <NotFoundPage />;

  const handleJoin = async () => {
    if (!profile) {
      navigate("/login", { state: { from: `/events/${event.id}` } });
      return;
    }
    setSubmitting(true);
    await createTicket(profile.id, event.id);
    setSubmitting(false);
    setJoined(true);
    setDialogOpen(false);
  };

  const primaryAction = (() => {
    if (event.status === "live") {
      return joined || event.price === 0 ? (
        <Button variant="neon" size="lg" className="w-full" asChild>
          <Link to={`/live/${event.id}`}>
            <Play /> ライブ会場に入る
          </Link>
        </Button>
      ) : (
        <Button variant="neon" size="lg" className="w-full" onClick={() => setDialogOpen(true)}>
          <Ticket /> 参加して会場に入る
        </Button>
      );
    }
    if (event.status === "upcoming") {
      return joined ? (
        <Button size="lg" variant="outline" className="w-full" disabled>
          <CheckCircle2 /> 参加登録済み
        </Button>
      ) : (
        <Button variant="neon" size="lg" className="w-full" onClick={() => setDialogOpen(true)}>
          <Ticket /> 参加登録する
        </Button>
      );
    }
    return (
      <Button variant="outline" size="lg" className="w-full" asChild>
        <Link to={`/live/${event.id}`}>
          <Play /> 熱量リプレイで観る
        </Link>
      </Button>
    );
  })();

  return (
    <div className="pb-28 lg:pb-16">
      <div className="relative">
        <div className="aspect-[16/9] max-h-[60vh] w-full sm:aspect-[21/9]">
          <EventArtwork event={event} size="lg" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <Button variant="ghost" size="sm" className="absolute left-4 top-4 bg-black/40 backdrop-blur" onClick={() => navigate(-1)}>
          <ArrowLeft /> 戻る
        </Button>
      </div>

      <div className="container -mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="relative space-y-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <EventStatusBadge status={event.status} />
              <Badge variant="outline">{event.genre}</Badge>
            </div>
            <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">{event.title}</h1>
            <p className="text-lg font-bold text-muted-foreground">{event.artist_name}</p>
          </div>

          <p className="leading-relaxed text-foreground/90">{event.description}</p>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">✨</span>このライブの楽しみ方
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4">
                <div className="flex gap-1.5">
                  {event.theme_colors.map((c) => (
                    <Penlight key={c} color={c} className="h-10" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold">推奨サイリウムカラー</p>
                  <p className="text-xs text-muted-foreground">みんなで同じ色に染めよう</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4">
                <span className="text-3xl">⚡</span>
                <div>
                  <p className="text-sm font-bold">サビではジャンプ！</p>
                  <p className="text-xs text-muted-foreground">リアクションが集まると特別演出が発動</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {event.setlist.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  {event.status === "ended" ? "セットリスト" : "セットリスト（予定）"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {event.setlist.map((song, i) => (
                    <li key={song} className="flex items-center gap-3 text-sm">
                      <span className="font-display w-6 text-right font-bold text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                      {song}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>

        {/* サイドバー（PC）*/}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="relative">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <dl className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <dt className="sr-only">開始</dt>
                  <dd className="font-bold">{formatDateTime(event.start_at)} 開演</dd>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <dt className="sr-only">終了</dt>
                  <dd>{formatDateTime(event.end_at)} 終演予定</dd>
                </div>
                {event.viewer_count > 0 && (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <dt className="sr-only">参加者</dt>
                    <dd>
                      {formatNumber(event.viewer_count)} 人{event.status === "live" ? "が参加中" : "が参加"}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="flex items-baseline justify-between border-t pt-4">
                <span className="text-sm text-muted-foreground">視聴チケット</span>
                <span className="font-display text-2xl font-black">¥{formatNumber(event.price)}</span>
              </div>
              <div className="hidden lg:block">{primaryAction}</div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* スマホ用固定アクションバー */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-background/90 px-4 pt-3 backdrop-blur-xl lg:hidden">
        {primaryAction}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>参加登録</DialogTitle>
            <DialogDescription>
              {profile ? "以下のライブに参加登録します。" : "参加登録にはログインが必要です。"}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-white/5 p-4">
            <p className="font-bold">{event.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(event.start_at)} 開演</p>
            <p className="font-display mt-3 text-xl font-black">¥{formatNumber(event.price)}</p>
          </div>
          <p className="text-xs text-muted-foreground">※ デモ版のため、実際の決済は発生しません。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="neon" onClick={handleJoin} disabled={submitting}>
              {profile ? (submitting ? "登録中…" : "参加を確定する") : "ログインして参加"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
