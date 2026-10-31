import { Flame, Pencil, Ticket, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { UserAvatar } from "@/components/common/UserAvatar";
import { EventCard } from "@/components/events/EventCard";
import { PenlightPicker } from "@/components/live/PenlightPicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PENLIGHT_COLORS } from "@/data/reactions";
import { useAuth } from "@/hooks/useAuth";
import { listEvents } from "@/services/events";
import { listMyTickets } from "@/services/tickets";
import type { LiveEvent } from "@/types";

const STATS = [
  { icon: Ticket, label: "参加したライブ", value: "12" },
  { icon: Flame, label: "送った熱量", value: "8,420" },
  { icon: Users, label: "一緒に盛り上がった人", value: "3.2万" },
];

export default function MyPage() {
  const { profile, updateProfile } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") ?? "tickets";
  const [upcoming, setUpcoming] = useState<LiveEvent[]>([]);
  const [history, setHistory] = useState<LiveEvent[]>([]);
  const [draft, setDraft] = useState({ display_name: "", bio: "", avatar_color: "", penlight_color: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setDraft({
      display_name: profile.display_name,
      bio: profile.bio ?? "",
      avatar_color: profile.avatar_color,
      penlight_color: profile.penlight_color,
    });
    Promise.all([listEvents(), listMyTickets(profile.id)]).then(([events, tickets]) => {
      const ids = new Set(tickets.map((t) => t.event_id));
      setUpcoming(events.filter((e) => e.status !== "ended" && ids.has(e.id)));
      setHistory(events.filter((e) => e.status === "ended"));
    });
    // プロフィール ID が変わったときのみ初期化
  }, [profile?.id]);

  if (!profile) return null;

  const save = async () => {
    await updateProfile({ ...draft, bio: draft.bio || null });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container py-8 sm:py-12">
      {/* プロフィールヘッダー */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-neon-pink via-neon-violet to-neon-cyan opacity-80 sm:h-32" />
        <CardContent className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <UserAvatar name={profile.display_name} color={profile.avatar_color} className="h-20 w-20 text-2xl ring-4 ring-card sm:h-24 sm:w-24" />
            <div className="pb-1">
              <h1 className="text-xl font-extrabold sm:text-2xl">{profile.display_name}</h1>
              {profile.bio && <p className="mt-1 text-sm text-muted-foreground">{profile.bio}</p>}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setParams({ tab: "avatar" })}>
            <Pencil /> プロフィール編集
          </Button>
        </CardContent>
      </Card>

      {/* 実績 */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {STATS.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-display text-2xl font-black">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-3">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-neon-amber" />
            <span className="font-bold">熱量ランク</span>
            <Badge variant="secondary">GOLD</Badge>
          </div>
          <div className="flex-1">
            <Progress value={68} />
          </div>
          <span className="text-xs text-muted-foreground">PLATINUM まであと 1,580</span>
        </CardContent>
      </Card>

      {/* タブ */}
      <Tabs value={tab} onValueChange={(v) => setParams({ tab: v })} className="mt-8">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="tickets" className="flex-1 sm:flex-none">参加予定</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 sm:flex-none">参加履歴</TabsTrigger>
          <TabsTrigger value="avatar" className="flex-1 sm:flex-none">アバター</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <p className="text-muted-foreground">参加予定のライブはまだありません。</p>
              <Button variant="neon" className="mt-4" asChild>
                <Link to="/events">ライブを探す</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </TabsContent>

        <TabsContent value="avatar">
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>プレビュー</CardTitle>
                <CardDescription>観客席でこう見えます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-56 items-end justify-center rounded-2xl bg-gradient-to-b from-[#120a24] to-black pb-6">
                  <div className="flex animate-bounce2 flex-col items-center">
                    <div
                      className="h-16 w-2.5 animate-sway rounded-full"
                      style={{ background: draft.penlight_color, boxShadow: `0 0 20px 4px ${draft.penlight_color}`, transformOrigin: "50% 100%" }}
                    />
                    <div className="mt-2 h-14 w-14 rounded-full" style={{ background: `linear-gradient(135deg, ${draft.avatar_color}, #1e1036)` }} />
                    <div className="-mt-1 h-10 w-20 rounded-t-full bg-white/10" />
                    <span className="mt-2 text-sm font-bold">{draft.display_name || "あなた"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>プロフィールとアバター</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dn">ニックネーム</Label>
                    <Input id="dn" maxLength={20} value={draft.display_name} onChange={(e) => setDraft({ ...draft, display_name: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio">ひとこと</Label>
                    <Textarea id="bio" maxLength={80} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} placeholder="推しや好きなジャンルなど" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>アバターカラー</Label>
                  <div className="flex flex-wrap gap-2">
                    {PENLIGHT_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setDraft({ ...draft, avatar_color: c.value })}
                        className="h-10 w-10 rounded-full ring-offset-2 ring-offset-card transition-transform hover:scale-110 data-[active=true]:ring-2 data-[active=true]:ring-white"
                        data-active={draft.avatar_color === c.value}
                        style={{ background: `linear-gradient(135deg, ${c.value}, #1e1036)` }}
                        aria-label={`アバターカラー ${c.name}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>いつものサイリウムカラー</Label>
                  <PenlightPicker value={draft.penlight_color} onChange={(c) => setDraft({ ...draft, penlight_color: c })} />
                </div>
                <div className="flex items-center justify-end gap-3">
                  {saved && <span className="text-sm text-neon-lime">保存しました</span>}
                  <Button variant="neon" onClick={save}>保存する</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
