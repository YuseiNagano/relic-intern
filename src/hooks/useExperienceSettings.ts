import { useCallback, useEffect, useState } from "react";

import type { ExperienceSettings } from "@/types";

/**
 * 体験設定（歓声音量・演出の強さ・振動など）
 * TODO(supabase): user_settings テーブルに保存し、デバイス間で同期する
 */
const KEY = "allstand:experience";

export const DEFAULT_SETTINGS: ExperienceSettings = {
  cheer_volume: 70,
  effect_intensity: 80,
  haptics_enabled: true,
  spatial_audio_enabled: false,
  reduce_flashing: false,
  show_comments: true,
  captions_enabled: false,
};

export function useExperienceSettings() {
  const [settings, setSettings] = useState<ExperienceSettings>(() => {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }, [settings]);

  const update = useCallback(<K extends keyof ExperienceSettings>(key: K, value: ExperienceSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);

  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  return { settings, update, reset };
}
