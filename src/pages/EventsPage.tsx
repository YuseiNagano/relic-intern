import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { EventCard } from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listEvents } from "@/services/events";
import type { EventStatus, LiveEvent } from "@/types";

type Filter = "all" | EventStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "live", label: "ライブ中" },
  { value: "upcoming", label: "開催予定" },
  { value: "ended", label: "アーカイブ" },
];

export default function EventsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [keyword, setKeyword] = useState("");
  const [events, setEvents] = useState<LiveEvent[] | null>(null);

  useEffect(() => {
    let active = true;
    setEvents(null);
    listEvents({ status: filter === "all" ? undefined : filter, keyword }).then((res) => active && setEvents(res));
    return () => {
      active = false;
    };
  }, [filter, keyword]);

  return (
    <div className="container py-8 sm:py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold sm:text-3xl">ライブを探す</h1>
        <p className="text-sm text-muted-foreground">いま開催中のライブや、これからのライブに参加しよう。</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="アーティスト・ジャンル・タグで検索"
            className="pl-10"
            aria-label="ライブを検索"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <TabsList>
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.value === "live" && <span className="h-2 w-2 rounded-full bg-red-500" />}
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events === null &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border bg-card">
              <div className="aspect-[16/9] animate-pulse bg-white/5" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-1/4 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))}
        {events?.map((e) => <EventCard key={e.id} event={e} />)}
      </div>

      {events?.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          条件に合うライブが見つかりませんでした。
        </div>
      )}
    </div>
  );
}
