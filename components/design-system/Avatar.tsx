import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  gradient?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({
  initials,
  gradient = "linear-gradient(135deg, #4a7eff, #6c5ce7)",
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-11 h-11 text-xs",
    lg: "w-14 h-14 text-base",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white shrink-0",
        sizeClasses[size],
        className
      )}
      style={{ background: gradient }}
    >
      {initials}
    </div>
  );
}
