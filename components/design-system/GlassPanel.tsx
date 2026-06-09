import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: ReactNode;
  variant?: "default" | "strong" | "heavy";
  className?: string;
}

export function GlassPanel({
  children,
  variant = "default",
  className = "",
}: GlassPanelProps) {
  const variants = {
    default: "glass",
    strong: "glass-strong",
    heavy: "glass-heavy",
  };

  return (
    <div className={cn(variants[variant], "rounded-2xl", className)}>
      {children}
    </div>
  );
}
