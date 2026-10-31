import { ChevronLeft, MessageCircle, Settings2, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { CommentPanel } from "@/components/live/CommentPanel";
import { CrowdView } from "@/components/live/CrowdView";
import { ExperiencePanel } from "@/components/live/ExperiencePanel";
import { HeatMeter } from "@/components/live/HeatMeter";
import { LiveStage } from "@/components/live/LiveStage";
import { PenlightPicker } from "@/components/live/PenlightPicker";
import { ReactionBar } from "@/components/live/ReactionBar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useExperienceSettings } from "@/hooks/useExperienceSettings";
import { useLiveRoom } from "@/hooks/useLiveRoom";
import { formatNumber } from "@/lib/utils";
import { getEvent } from "@/services/events";
import type { LiveEvent } from "@/types";

import NotFoundPage from "./NotFoundPage";

export default function LiveRoomPage() {
  const { eventId = "" } = useParams();
  const [event, setEvent] = useState<LiveEvent | null | undefined>(undefined);

  useEffect(() => {
    getEvent(eventId).then(setEvent);
  }, [eventId]);

  if (event === undefined) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-black text-muted-foreground">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        会場に入場しています…
      </div>
    );
  }
  if (event === null) return <NotFoundPage />;
  return <LiveRoom event={event} />;
}

function LiveRoom({ event }: { event: LiveEvent }) {
  const { profile, updateProfile } = useAuth();
  const { settings, update } = useExperienceSettings();
  const room = useLiveRoom(event.id, profile, event.viewer_count);
  const [penlight, setPenlight] = useState(profile?.penlight_color ?? event.theme_colors[0]);
  const [songIndex, setSongIndex] = useState(0);

  // セットリストの進行（モック）。実運用では配信側から「現在の曲」を Broadcast する想定
  useEffect(() => {
    if (event.setlist.length === 0) return;
    const timer = window.setInterval(() => setSongIndex((i) => (i + 1) % event.setlist.length), 45000);
    return () => window.clearInterval(timer);
  }, [event.setlist.length]);
  const currentSong = event.setlist[songIndex] ?? event.title;

  const changePenlight = (color: string) => {
    setPenlight(color);
    room.setPenlightColor(color);
    if (profile) void updateProfile({ penlight_color: color });
  };

  const penlightPanel = (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
        <div
          className="h-14 w-3 animate-sway rounded-full"
          style={{ background: penlight, boxShadow: `0 0 18px 4px ${penlight}`, transformOrigin: "50% 100%" }}
          aria-hidden
        />
        <div>
          <p className="text-sm font-bold">あなたのサイリウム</p>
          <p className="text-xs text-muted-foreground">選んだ色が観客席に反映されます</p>
        </div>
      </div>
      <PenlightPicker value={penlight} onChange={changePenlight} recommended={event.theme_colors} />
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-2xl bg-white/5 p-3">
          <p className="text-xs text-muted-foreground">あなたが送った熱量</p>
          <p className="font-display text-2xl font-black text-gradient">{formatNumber(room.myReactionCount)}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3">
          <p className="text-xs text-muted-foreground">一緒に参加中</p>
          <p className="font-display text-2xl font-black">{formatNumber(room.viewerCount)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#07040f]">
      {/* ヘッダー */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/5 px-2 sm:px-4">
        <Button variant="ghost" size="icon" asChild aria-label="イベント詳細へ戻る">
          <Link to={`/events/${event.id}`}>
            <ChevronLeft className="!size-6" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold leading-tight sm:text-base">{event.title}</p>
          <p className="truncate text-xs text-muted-foreground">{event.artist_name}</p>
        </div>
        <span className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
          <Users className="h-4 w-4" />
          {formatNumber(room.viewerCount)}人が参加中
        </span>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="体験設定">
              <Settings2 className="!size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader className="mb-6">
              <SheetTitle>体験設定</SheetTitle>
              <SheetDescription>歓声の大きさや演出を、自分に合わせて調整できます。</SheetDescription>
            </SheetHeader>
            <ExperiencePanel settings={settings} update={update} />
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[1fr_380px] lg:gap-4 lg:p-4">
        {/* メイン */}
        <div className="flex shrink-0 flex-col gap-2 lg:min-h-0 lg:gap-4 lg:overflow-y-auto">
          <LiveStage
            event={event}
            heat={room.heat}
            viewerCount={room.viewerCount}
            floating={room.floating}
            effectIntensity={settings.effect_intensity}
            reduceFlashing={settings.reduce_flashing}
            captionsEnabled={settings.captions_enabled}
            currentSong={currentSong}
          />
          <div className="flex flex-col gap-2 px-2 lg:gap-4 lg:px-0">
            <HeatMeter heat={room.heat} />
            <CrowdView audience={room.audience} heat={room.heat} reduceMotion={settings.reduce_flashing} className="hidden sm:block" />
            <div className="hidden lg:block">
              <ReactionBar onReact={room.sendReaction} counts={room.counts} hapticsEnabled={settings.haptics_enabled} />
              <p className="mt-2 text-center text-xs text-muted-foreground">ボタン長押しで連続リアクション</p>
            </div>
          </div>
        </div>

        {/* サイドパネル（PC）/ 下部パネル（スマホ） */}
        <aside className="flex min-h-0 flex-1 flex-col px-2 pt-2 lg:rounded-2xl lg:border lg:bg-card lg:p-4">
          <Tabs defaultValue="comments" className="flex min-h-0 flex-1 flex-col">
            <TabsList className="grid w-full shrink-0 grid-cols-3 lg:grid-cols-3">
              <TabsTrigger value="comments">
                <MessageCircle /> コメント
              </TabsTrigger>
              <TabsTrigger value="crowd">
                <Sparkles /> サイリウム
              </TabsTrigger>
              <TabsTrigger value="settings" className="hidden lg:inline-flex">
                <Settings2 /> 設定
              </TabsTrigger>
              <TabsTrigger value="audience" className="lg:hidden">
                <Users /> 観客
              </TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="mt-2 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden">
              <CommentPanel comments={room.comments} onSend={room.sendComment} className="flex-1" />
            </TabsContent>
            <TabsContent value="crowd" className="scrollbar-thin mt-3 min-h-0 flex-1 overflow-y-auto">
              {penlightPanel}
            </TabsContent>
            <TabsContent value="audience" className="scrollbar-thin mt-3 min-h-0 flex-1 overflow-y-auto lg:hidden">
              <CrowdView audience={room.audience} heat={room.heat} reduceMotion={settings.reduce_flashing} />
              <p className="mt-3 text-center text-xs text-muted-foreground">リアクションが多い人ほど大きく跳ねています</p>
            </TabsContent>
            <TabsContent value="settings" className="scrollbar-thin mt-4 min-h-0 flex-1 overflow-y-auto">
              <ExperiencePanel settings={settings} update={update} />
            </TabsContent>
          </Tabs>
        </aside>

        {/* スマホ用リアクションバー */}
        <div className="pb-safe shrink-0 border-t border-white/5 bg-background/80 px-2 pt-2 backdrop-blur lg:hidden">
          <ReactionBar onReact={room.sendReaction} counts={room.counts} hapticsEnabled={settings.haptics_enabled} />
        </div>
      </div>
    </div>
  );
}
