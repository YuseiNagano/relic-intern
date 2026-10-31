import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ displayName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUp(form.email, form.password, form.displayName);
    navigate("/mypage?tab=avatar", { replace: true });
  };

  return (
    <AuthLayout title="アカウント作成" description="無料で登録して、オンラインライブに参加しよう。">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">ニックネーム</Label>
          <Input id="name" required maxLength={20} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="会場で表示される名前" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" type="password" autoComplete="new-password" minLength={8} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="8文字以上" />
        </div>
        <Button type="submit" variant="neon" size="lg" className="w-full" disabled={loading}>
          {loading ? "作成中…" : "無料で登録する"}
        </Button>
        <p className="text-xs text-muted-foreground">登録することで、利用規約とプライバシーポリシーに同意したものとみなされます。</p>
      </form>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        すでにアカウントをお持ちの方は{" "}
        <Link to="/login" className="font-bold text-primary hover:underline">
          ログイン
        </Link>
      </p>
    </AuthLayout>
  );
}
