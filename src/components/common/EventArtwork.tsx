import { cn } from "@/lib/utils";
import type { LiveEvent } from "@/types";

/** イベントのキービジュアル。thumbnail_url が無い場合はテーマカラーで生成 */
export function EventArtwork({ event, className, size = "md" }: { event: LiveEvent; className?: string; size?: "md" | "lg" }) {
  if (event.thumbnail_url) {
    return <img src={event.thumbnail_url} alt={event.title} className={cn("h-full w-full object-cover", className)} />;
  }
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-gradient-to-br", event.theme_gradient, className)}>
      <div className="noise absolute inset-0 opacity-40" />
      {/* スポットライト */}
      <div
        className="absolute -top-1/4 left-1/4 h-[150%] w-1/3 origin-top rotate-12 bg-gradient-to-b from-white/30 to-transparent blur-xl"
        aria-hidden
      />
      <div
        className="absolute -top-1/4 right-1/4 h-[150%] w-1/4 origin-top -rotate-12 bg-gradient-to-b from-white/20 to-transparent blur-xl"
        aria-hidden
      />
      {/* 観客シルエット */}
      <svg className="absolute bottom-0 left-0 w-full text-black/60" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
        <path
          fill="currentColor"
          d="M0 60V40c10-8 20-8 26 0 6-14 18-14 24 0 6-10 18-10 22 0 8-16 20-16 26 0 6-8 16-8 22 0 8-12 18-12 24 0 6-14 20-14 26 0 6-8 16-8 22 0 8-12 20-12 26 0 4-10 16-10 22 0 8-14 18-14 24 0 6-8 16-8 22 0 8-16 20-16 26 0 6-10 18-10 22 0 6-12 18-12 24 0 6-8 16-8 22 0V60z"
        />
      </svg>
      <div className={cn("absolute inset-0 flex flex-col justify-end p-4", size === "lg" && "p-6 sm:p-10")}>
        <p className={cn("font-display font-black uppercase leading-none tracking-wide text-white drop-shadow-lg", size === "lg" ? "text-3xl sm:text-5xl" : "text-xl")}>
          {event.artist_name}
        </p>
      </div>
    </div>
  );
}
