import { Glasses, Smartphone, Vibrate } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ExperienceSettings } from "@/types";

interface Props {
  settings: ExperienceSettings;
  update: <K extends keyof ExperienceSettings>(key: K, value: ExperienceSettings[K]) => void;
}

/** ライブ中に変更できる体験設定 */
export function ExperiencePanel({ settings, update }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="cheer">みんなの歓声の音量</Label>
          <span className="text-sm tabular-nums text-muted-foreground">{settings.cheer_volume}%</span>
        </div>
        <Slider id="cheer" value={[settings.cheer_volume]} max={100} step={5} onValueChange={([v]) => update("cheer_volume", v)} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="effect">演出の強さ</Label>
          <span className="text-sm tabular-nums text-muted-foreground">{settings.effect_intensity}%</span>
        </div>
        <Slider id="effect" value={[settings.effect_intensity]} max={100} step={5} onValueChange={([v]) => update("effect_intensity", v)} />
      </div>

      <div className="space-y-4">
        <ToggleRow id="haptics" label="振動で盛り上がりを感じる" hint="対応スマホのみ" checked={settings.haptics_enabled} onChange={(v) => update("haptics_enabled", v)} />
        <ToggleRow id="spatial" label="空間オーディオ" hint="ヘッドホン推奨" checked={settings.spatial_audio_enabled} onChange={(v) => update("spatial_audio_enabled", v)} />
        <ToggleRow id="flash" label="光の点滅・画面の揺れを抑える" checked={settings.reduce_flashing} onChange={(v) => update("reduce_flashing", v)} />
        <ToggleRow id="captions" label="字幕を表示" checked={settings.captions_enabled} onChange={(v) => update("captions_enabled", v)} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold">視聴モード</p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl border border-primary bg-primary/10 p-3">
            <Smartphone className="mx-auto mb-1 h-5 w-5" />
            通常
          </div>
          <div className="relative rounded-xl border p-3 text-muted-foreground">
            <Glasses className="mx-auto mb-1 h-5 w-5" />
            VR
            <Badge variant="muted" className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 text-[9px]">準備中</Badge>
          </div>
          <div className="relative rounded-xl border p-3 text-muted-foreground">
            <Vibrate className="mx-auto mb-1 h-5 w-5" />
            振動デバイス
            <Badge variant="muted" className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 text-[9px]">将来対応</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ id, label, hint, checked, onChange }: { id: string; label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id} className="flex flex-col gap-1">
        {label}
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
