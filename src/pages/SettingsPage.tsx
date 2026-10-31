import { Bell, LogOut, Mail, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ExperiencePanel } from "@/components/live/ExperiencePanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useExperienceSettings } from "@/hooks/useExperienceSettings";

export default function SettingsPage() {
  const { settings, update, reset } = useExperienceSettings();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [notify, setNotify] = useState({ start: true, favorite: true, news: false });

  return (
    <div className="container max-w-3xl py-8 sm:py-12">
      <h1 className="text-2xl font-extrabold sm:text-3xl">設定</h1>

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" /> ライブ体験
              </CardTitle>
              <CardDescription>歓声・演出・振動などのデフォルト設定。ライブ中にも変更できます。</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw /> 初期値
            </Button>
          </CardHeader>
          <CardContent>
            <ExperiencePanel settings={settings} update={update} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> 通知
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(
              [
                ["start", "参加予定ライブの開演前に通知"],
                ["favorite", "フォロー中アーティストの新着ライブ"],
                ["news", "ALLSTANDからのお知らせ"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <Label htmlFor={`n-${key}`}>{label}</Label>
                <Switch id={`n-${key}`} checked={notify[key]} onCheckedChange={(v) => setNotify({ ...notify, [key]: v })} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> アカウント
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline">メールアドレスを変更</Button>
            <Button variant="outline">パスワードを変更</Button>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive sm:ml-auto"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut /> ログアウト
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
