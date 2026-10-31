import { Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { LiveComment } from "@/types";

const QUICK = ["最高！", "アンコール！", "かわいい", "泣ける😭", "跳べ〜！"];

export function CommentPanel({ comments, onSend, className }: { comments: LiveComment[]; onSend: (body: string) => void; className?: string }) {
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);

  useEffect(() => {
    const el = listRef.current;
    if (el && stickToBottom) el.scrollTop = el.scrollHeight;
  }, [comments, stickToBottom]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSend(text);
    setText("");
    setStickToBottom(true);
  };

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div
        ref={listRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          setStickToBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 40);
        }}
        className="scrollbar-thin min-h-0 flex-1 space-y-2.5 overflow-y-auto px-1 py-2"
        aria-live="polite"
        aria-label="コメント"
      >
        {comments.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">最初のコメントを送ってみよう！</p>}
        {comments.map((c) => (
          <div key={c.id} className={cn("flex items-start gap-2 animate-in fade-in slide-in-from-bottom-1", c.is_self && "rounded-xl bg-primary/10 p-1.5")}>
            <UserAvatar name={c.display_name} color={c.avatar_color} className="h-6 w-6 text-[10px] ring-0" />
            <p className="min-w-0 text-sm leading-snug">
              <span className={cn("mr-2 text-xs font-bold", c.is_self ? "text-primary" : "text-muted-foreground")}>{c.display_name}</span>
              <span className="break-words">{c.body}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="scrollbar-thin -mx-1 flex gap-1.5 overflow-x-auto px-1 py-2">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSend(q)}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold hover:bg-white/10"
          >
            {q}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="コメントを送る" maxLength={60} aria-label="コメント入力" className="h-10" />
        <Button type="submit" size="icon" variant="neon" disabled={!text.trim()} aria-label="送信" className="shrink-0">
          <Send />
        </Button>
      </form>
    </div>
  );
}
