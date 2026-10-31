import { Captions, Eye, Maximize2, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

import { EventArtwork } from "@/components/common/EventArtwork";
import { Badge } from "@/components/ui/badge";
import type { FloatingReaction } from "@/hooks/useLiveRoom";
import { cn, formatNumber } from "@/lib/utils";
import type { LiveEvent } from "@/types";

import { FloatingReactions } from "./FloatingReactions";

interface Props {
  event: LiveEvent;
  heat: number;
  viewerCount: number;
  floating: FloatingReaction[];
  effectIntensity: number;
  reduceFlashing: boolean;
  captionsEnabled: boolean;
  currentSong: string;
}

/**
 * 映像ステージ
 * TODO: 配信プレイヤー（HLS / WebRTC。例: Mux, Cloudflare Stream, IVS など）を埋め込む。
 * 現在はキービジュアル＋ライティング演出でプレースホルダー表示。
 */
export function LiveStage({ event, heat, viewerCount, floating, effectIntensity, reduceFlashing, captionsEnabled, currentSong }: Props) {
  const [muted, setMuted] = useState(false);
  const glow = (heat / 100) * (effectIntensity / 100);
  const shake = !reduceFlashing && heat > 92 && effectIntensity > 50;

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-black sm:rounded-2xl",
        shake && "animate-[bounce2_0.25s_ease-in-out_infinite]",
      )}
      style={{ boxShadow: `0 0 ${20 + glow * 80}px -10px ${event.theme_colors[0]}` }}
    >
      <EventArtwork event={event} size="lg" />

      {/* 熱量に応じたステージライティング */}
      {!reduceFlashing && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute -top-10 left-[15%] h-[130%] w-24 origin-top animate-beam-sweep blur-xl transition-opacity duration-500"
            style={{ background: `linear-gradient(to bottom, ${event.theme_colors[0]}, transparent)`, opacity: glow }}
          />
          <div
            className="absolute -top-10 right-[15%] h-[130%] w-24 origin-top animate-beam-sweep blur-xl transition-opacity duration-500"
            style={{
              background: `linear-gradient(to bottom, ${event.theme_colors[1] ?? event.theme_colors[0]}, transparent)`,
              opacity: glow,
              animationDelay: "-3s",
            }}
          />
        </div>
      )}

      <FloatingReactions items={floating} intensity={effectIntensity} />

      {/* 上部オーバーレイ */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/70 to-transparent p-3">
        <div className="flex items-center gap-2">
          <Badge variant="live">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            LIVE
          </Badge>
          <span className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs font-bold backdrop-blur">
            <Eye className="h-3 w-3" />
            {formatNumber(viewerCount)}
          </span>
        </div>
        <span className="truncate rounded-full bg-black/50 px-3 py-0.5 text-xs font-bold backdrop-blur">♪ {currentSong}</span>
      </div>

      {captionsEnabled && (
        <div className="absolute inset-x-0 bottom-12 flex justify-center px-4">
          <p className="rounded-lg bg-black/75 px-3 py-1 text-center text-sm">（歓声）みんなー！まだまだいけるー？！</p>
        </div>
      )}

      {/* 下部コントロール */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-gradient-to-t from-black/70 to-transparent p-2">
        <button
          className="rounded-full p-2 hover:bg-white/10"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "ミュート解除" : "ミュート"}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        <span className={cn("rounded-full p-2", captionsEnabled ? "text-primary" : "text-white/60")} aria-label="字幕">
          <Captions className="h-5 w-5" />
        </span>
        <button
          className="rounded-full p-2 hover:bg-white/10"
          aria-label="全画面表示"
          onClick={(e) => (e.currentTarget.closest(".aspect-video") as HTMLElement | null)?.requestFullscreen?.()}
        >
          <Maximize2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
