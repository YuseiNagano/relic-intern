import { Link } from "react-router-dom";

import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/20">
      <div className="container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            離れていても、観客の「熱量」を共有できるオンラインライブ体験。
            あなたの歓声が、どこかの誰かの鳥肌になる。
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">サービス</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/events" className="hover:text-foreground">ライブを探す</Link></li>
            <li><Link to="/#features" className="hover:text-foreground">できること</Link></li>
            <li><Link to="/#devices" className="hover:text-foreground">対応デバイス</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">サポート</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span>よくある質問</span></li>
            <li><span>利用規約</span></li>
            <li><span>プライバシーポリシー</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-muted-foreground">
        © 2026 ALLSTAND
      </div>
    </footer>
  );
}
