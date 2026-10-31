import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/types";

export function EventStatusBadge({ status }: { status: EventStatus }) {
  if (status === "live") {
    return (
      <Badge variant="live">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        LIVE
      </Badge>
    );
  }
  if (status === "upcoming") return <Badge variant="secondary">開催予定</Badge>;
  return <Badge variant="muted">アーカイブ</Badge>;
}
