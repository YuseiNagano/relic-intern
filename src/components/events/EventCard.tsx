import { CalendarDays, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { EventArtwork } from "@/components/common/EventArtwork";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatNumber } from "@/lib/utils";
import type { LiveEvent } from "@/types";

import { EventStatusBadge } from "./EventStatusBadge";

export function EventCard({ event }: { event: LiveEvent }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="group block overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_12px_40px_-12px_rgba(255,61,154,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <EventArtwork event={event} className="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3">
          <EventStatusBadge status={event.status} />
        </div>
        {event.status === "live" && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-bold backdrop-blur">
            <Users className="h-3 w-3" />
            {formatNumber(event.viewer_count)}
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs font-bold text-muted-foreground">{event.genre}</p>
        <h3 className="line-clamp-2 font-bold leading-snug">{event.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {formatDateTime(event.start_at)}〜
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {event.tags.map((t) => (
            <Badge key={t} variant="outline" className="font-medium">
              #{t}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
