import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-gradient text-7xl font-black">404</p>
      <h1 className="mt-4 text-xl font-bold">ページが見つかりませんでした</h1>
      <p className="mt-2 text-sm text-muted-foreground">お探しのライブ会場は、移動したか終了した可能性があります。</p>
      <Button variant="neon" className="mt-8" asChild>
        <Link to="/events">ライブを探す</Link>
      </Button>
    </div>
  );
}
