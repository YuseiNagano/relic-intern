import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import * as authService from "@/services/auth";
import type { Profile } from "@/types";

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * 認証状態のプロバイダー
 * TODO(supabase): supabase.auth.onAuthStateChange で購読し、セッション変化に追従させる
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setProfile(await authService.signIn(email, password));
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    setProfile(await authService.signUp(email, password, displayName));
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setProfile(null);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!profile) return;
      setProfile(await authService.updateProfile({ ...profile, ...patch }));
    },
    [profile],
  );

  const value = useMemo(
    () => ({ profile, loading, signIn, signUp, signOut, updateProfile }),
    [profile, loading, signIn, signUp, signOut, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth は AuthProvider の内側で使用してください");
  return ctx;
}
