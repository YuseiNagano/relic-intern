import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppLayout() {
  const { pathname, hash } = useLocation();

  // ページ遷移時のスクロール制御（アンカーリンク対応）
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
