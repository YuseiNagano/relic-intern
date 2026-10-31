import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

/** ログイン必須ページのガード（Supabase Auth 導入後もそのまま利用可能） */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">読み込み中…</div>;
  }
  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
