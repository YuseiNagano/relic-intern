import { MOCK_PROFILE } from "@/data/mock";
import type { Profile } from "@/types";

/**
 * 認証サービス（モック）
 * TODO(supabase): supabase.auth.signInWithPassword / signUp / signOut / signInWithOAuth に置き換え、
 * プロフィールは profiles テーブル（id = auth.users.id）から取得する。
 */
const KEY = "allstand:session";

export async function getCurrentProfile(): Promise<Profile | null> {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Profile) : null;
}

export async function signIn(email: string, _password: string): Promise<Profile> {
  void _password;
  await new Promise((r) => setTimeout(r, 500));
  const profile = { ...MOCK_PROFILE, display_name: MOCK_PROFILE.display_name || email.split("@")[0] };
  localStorage.setItem(KEY, JSON.stringify(profile));
  return profile;
}

export async function signUp(email: string, _password: string, displayName: string): Promise<Profile> {
  void _password;
  await new Promise((r) => setTimeout(r, 500));
  const profile: Profile = { ...MOCK_PROFILE, display_name: displayName || email.split("@")[0] };
  localStorage.setItem(KEY, JSON.stringify(profile));
  return profile;
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(KEY);
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  localStorage.setItem(KEY, JSON.stringify(profile));
  return profile;
}
