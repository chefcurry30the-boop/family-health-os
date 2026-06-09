import { cn } from "@/lib/utils";

interface AmbientGlowProps {
  color?: string;
  size?: number;
  blur?: number;
  className?: string;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
}

export function AmbientGlow({
  color = "rgba(74, 126, 255, 0.15)",
  size = 200,
  blur = 80,
  className = "",
  top,
  left,
  right,
  bottom,
}: AmbientGlowProps) {
  return (
    <div
      className={cn("absolute pointer-events-none rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${blur}px)`,
        top,
        left,
        right,
        bottom,
      }}
    />
  );
}
