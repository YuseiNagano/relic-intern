import type { Ticket } from "@/types";

/**
 * チケット（参加登録）サービス
 * TODO(supabase): tickets テーブルへの insert / select に置き換える
 *   await supabase.from("tickets").insert({ event_id, user_id })
 * 決済を入れる場合は Edge Functions + Stripe 等を想定。
 */
const KEY = "allstand:tickets";

function read(): Ticket[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Ticket[];
  } catch {
    return [];
  }
}

export async function listMyTickets(userId: string): Promise<Ticket[]> {
  return read().filter((t) => t.user_id === userId);
}

export async function hasTicket(userId: string, eventId: string): Promise<boolean> {
  return read().some((t) => t.user_id === userId && t.event_id === eventId);
}

export async function createTicket(userId: string, eventId: string): Promise<Ticket> {
  const ticket: Ticket = {
    id: crypto.randomUUID(),
    user_id: userId,
    event_id: eventId,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([...read(), ticket]));
  return ticket;
}
