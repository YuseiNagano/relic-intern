import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  color: string;
  src?: string | null;
  className?: string;
}

export function UserAvatar({ name, color, src, className }: Props) {
  return (
    <Avatar className={cn("ring-2 ring-white/10", className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className="text-white" style={{ background: `linear-gradient(135deg, ${color}, #1e1036)` }}>
        {name.slice(0, 1)}
      </AvatarFallback>
    </Avatar>
  );
}
