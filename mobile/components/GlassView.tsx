import { View, type ViewProps } from "react-native";
import { cn } from "../lib/cn";

interface GlassViewProps extends ViewProps {
  variant?: "default" | "strong" | "heavy";
}

export function GlassView({ variant = "default", className, style, ...props }: GlassViewProps) {
  const bg =
    variant === "strong"
      ? "bg-white/10 border-white/20"
      : variant === "heavy"
      ? "bg-white/[0.14] border-white/30"
      : "bg-white/[0.06] border-white/10";

  return (
    <View
      className={cn("rounded-[22px] border", bg, className)}
      style={style}
      {...props}
    />
  );
}
