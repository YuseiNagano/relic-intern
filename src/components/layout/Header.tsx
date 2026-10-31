import { LogIn, Menu, Settings, Ticket, User } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { Logo } from "@/components/common/Logo";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/events", label: "ライブを探す" },
  { to: "/#features", label: "できること" },
  { to: "/#how", label: "参加のしかた" },
];

export function Header() {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground",
                  isActive && n.to === "/events" && "text-foreground",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {profile ? (
            <>
              <Button variant="ghost" size="icon" asChild aria-label="設定">
                <Link to="/settings">
                  <Settings />
                </Link>
              </Button>
              <Link to="/mypage" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-white/5">
                <UserAvatar name={profile.display_name} color={profile.avatar_color} className="h-8 w-8" />
                <span className="text-sm font-bold">{profile.display_name}</span>
              </Link>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">ログイン</Link>
              </Button>
              <Button variant="neon" asChild>
                <Link to="/signup">無料で始める</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="メニューを開く">
              <Menu className="!size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col">
            <SheetHeader>
              <SheetTitle>メニュー</SheetTitle>
            </SheetHeader>
            {profile && (
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                <UserAvatar name={profile.display_name} color={profile.avatar_color} />
                <div>
                  <p className="font-bold">{profile.display_name}</p>
                  <p className="text-xs text-muted-foreground">ログイン中</p>
                </div>
              </div>
            )}
            <nav className="flex flex-col gap-1" onClick={() => setOpen(false)}>
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="rounded-xl px-3 py-3 font-bold hover:bg-white/5">
                  {n.label}
                </Link>
              ))}
              {profile && (
                <>
                  <Link to="/mypage" className="flex items-center gap-2 rounded-xl px-3 py-3 font-bold hover:bg-white/5">
                    <User className="h-4 w-4" /> マイページ
                  </Link>
                  <Link to="/mypage?tab=tickets" className="flex items-center gap-2 rounded-xl px-3 py-3 font-bold hover:bg-white/5">
                    <Ticket className="h-4 w-4" /> 参加予定のライブ
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 rounded-xl px-3 py-3 font-bold hover:bg-white/5">
                    <Settings className="h-4 w-4" /> 設定
                  </Link>
                </>
              )}
            </nav>
            <div className="mt-auto flex flex-col gap-2">
              {profile ? (
                <Button
                  variant="outline"
                  onClick={async () => {
                    await signOut();
                    setOpen(false);
                    navigate("/");
                  }}
                >
                  ログアウト
                </Button>
              ) : (
                <>
                  <Button variant="neon" asChild onClick={() => setOpen(false)}>
                    <Link to="/signup">無料で始める</Link>
                  </Button>
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link to="/login">
                      <LogIn /> ログイン
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
