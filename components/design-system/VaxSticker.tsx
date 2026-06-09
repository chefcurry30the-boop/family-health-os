import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface VaxStickerProps {
  status: "complete" | "current" | "due";
  name: string;
  doses?: string;
  date?: string;
  doctor?: string;
  className?: string;
}

export function VaxSticker({
  status,
  name,
  doses,
  date,
  doctor,
  className = "",
}: VaxStickerProps) {
  const statusStyles = {
    complete: {
      border: "border-green-hospital/40",
      bg: "bg-green-hospital/10",
      icon: "text-green-hospital",
    },
    current: {
      border: "border-blue-accent/40",
      bg: "bg-blue-accent/10",
      icon: "text-blue-accent",
    },
    due: {
      border: "border-amber-warn/40",
      bg: "bg-amber-warn/10",
      icon: "text-amber-warn",
    },
  };

  const s = statusStyles[status];

  return (
    <div
      className={cn(
        "relative p-3 rounded-2xl border-2 border-dashed backdrop-blur-sm",
        s.border,
        s.bg,
        className
      )}
      style={{
        transform: `rotate(${Math.random() * 4 - 2}deg)`,
      }}
    >
      <div className="flex items-start gap-2">
        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5", s.border, s.icon)}>
          {status === "complete" && <Check size={12} strokeWidth={3} />}
          {status === "current" && <div className="w-2 h-2 rounded-full bg-current" />}
          {status === "due" && <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ivory truncate">{name}</p>
          {doses && (
            <p className="text-[11px] text-ivory/80">{doses}</p>
          )}
          {date && (
            <p className="text-[11px] text-ivory/80 mt-0.5">
              {status === "due" ? "Due: " : ""}
              {date}
              {doctor ? ` · ${doctor}` : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
