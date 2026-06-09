import { cn } from "@/lib/utils";

interface PillContainerProps {
  shape: "half" | "capsule" | "round" | "tablet";
  color: string;
  size?: "sm" | "md";
  className?: string;
}

export function PillContainer({
  shape,
  color,
  size = "md",
  className = "",
}: PillContainerProps) {
  const sizeMap = {
    sm: "w-8 h-4",
    md: "w-12 h-6",
  };

  const shapeMap = {
    half: "rounded-full rounded-r-none",
    capsule: "rounded-full",
    round: "rounded-full",
    tablet: "rounded-md",
  };

  return (
    <div
      className={cn(
        "relative shrink-0",
        sizeMap[size],
        shapeMap[shape],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {/* Highlight */}
      <div className="absolute top-[15%] left-[10%] right-[10%] h-[35%] bg-white/25 rounded-full" />
      {/* Capsule split line */}
      {shape === "capsule" && (
        <div className="absolute inset-y-0 left-1/2 w-px bg-black/10" />
      )}
    </div>
  );
}
