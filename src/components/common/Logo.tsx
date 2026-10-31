import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-8 w-8", className)} aria-hidden>
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff3d9a" />
          <stop offset="1" stopColor="#7c5cff" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#140a26" />
      <path
        d="M10 44c6-10 10-10 14 0s8 10 12-6 8-16 18 6"
        fill="none"
        stroke="url(#logo-g)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)} aria-label="ALLSTAND トップへ">
      <LogoMark />
      <span className="font-display text-xl font-black tracking-wider">
        ALL<span className="text-gradient">STAND</span>
      </span>
    </Link>
  );
}
