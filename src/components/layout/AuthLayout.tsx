import type { ReactNode } from "react";

import { Logo } from "@/components/common/Logo";
import { Penlight } from "@/components/common/Penlight";
import { PENLIGHT_COLORS } from "@/data/reactions";

export function AuthLayout({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="stage-bg relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <Logo />
        <div className="relative z-10">
          <p className="text-4xl font-extrabold leading-tight">
            あなたの歓声が、
            <br />
            <span className="text-gradient">誰かの鳥肌</span>になる。
          </p>
          <p className="mt-4 text-muted-foreground">全国のファンと、同じ瞬間に、同じ熱量で。</p>
        </div>
        <div className="flex items-end gap-6" aria-hidden>
          {PENLIGHT_COLORS.slice(0, 6).map((c, i) => (
            <Penlight key={c.value} color={c.value} delay={i * 0.15} className="h-20 w-2.5" />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-extrabold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
