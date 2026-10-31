import { MOCK_EVENTS } from "@/data/mock";
import type { EventStatus, LiveEvent } from "@/types";

/**
 * イベント取得サービス
 * TODO(supabase): 以下のように差し替える
 *   const { data, error } = await supabase.from("events").select("*").order("start_at");
 */

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function listEvents(params?: { status?: EventStatus; keyword?: string }): Promise<LiveEvent[]> {
  await delay();
  let events = [...MOCK_EVENTS];
  if (params?.status) events = events.filter((e) => e.status === params.status);
  if (params?.keyword) {
    const k = params.keyword.toLowerCase();
    events = events.filter((e) => [e.title, e.artist_name, e.genre, ...e.tags].some((v) => v.toLowerCase().includes(k)));
  }
  return events;
}

export async function getEvent(id: string): Promise<LiveEvent | null> {
  await delay(150);
  return MOCK_EVENTS.find((e) => e.id === id) ?? null;
}
