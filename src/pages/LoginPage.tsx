import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/events";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout title="おかえりなさい" description="ログインして、ライブ会場へ。">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">パスワード</Label>
            <span className="text-xs text-muted-foreground">パスワードをお忘れの方</span>
          </div>
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" variant="neon" size="lg" className="w-full" disabled={loading}>
          {loading ? "ログイン中…" : "ログイン"}
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" />
        または
        <Separator className="flex-1" />
      </div>
      {/* TODO(supabase): supabase.auth.signInWithOAuth({ provider: "google" }) */}
      <Button variant="outline" size="lg" className="w-full" type="button" onClick={() => signIn("google@example.com", "").then(() => navigate(from))}>
        Googleでログイン
      </Button>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        アカウントをお持ちでない方は{" "}
        <Link to="/signup" className="font-bold text-primary hover:underline">
          新規登録
        </Link>
      </p>
    </AuthLayout>
  );
}
