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
      border: "border-medical-green/40",
      bg: "bg-medical-green/10",
      icon: "text-medical-green",
    },
    current: {
      border: "border-medical-blue/40",
      bg: "bg-medical-blue/10",
      icon: "text-medical-blue",
    },
    due: {
      border: "border-medical-amber/40",
      bg: "bg-medical-amber/10",
      icon: "text-medical-amber",
    },
  };

  const s = statusStyles[status];

  return (
    <div
      className={cn(
        "relative p-3.5 rounded-2xl border-2 border-dashed backdrop-blur-sm",
        s.border,
        s.bg,
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5", s.border, s.icon)}>
          {status === "complete" && <Check size={12} strokeWidth={3} />}
          {status === "current" && <div className="w-2 h-2 rounded-full bg-current" />}
          {status === "due" && <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          {doses && (
            <p className="text-[11px] text-white/60">{doses}</p>
          )}
          {date && (
            <p className="text-[11px] text-white/60 mt-0.5">
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
