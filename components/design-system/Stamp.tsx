import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StampProps {
  children: ReactNode;
  color?: "green" | "red" | "blue" | "amber";
  className?: string;
}

export function Stamp({
  children,
  color = "green",
  className = "",
}: StampProps) {
  const colors = {
    green: "border-green-hospital/60 text-green-hospital",
    red: "border-red-emergency/60 text-red-emergency",
    blue: "border-blue-accent/60 text-blue-accent",
    amber: "border-amber-warn/60 text-amber-warn",
  };

  return (
    <div
      className={cn(
        "inline-block px-3 py-1 rounded border-2 border-dashed font-bold tracking-wider uppercase text-xs",
        "transform -rotate-6",
        colors[color],
        className
      )}
    >
      {children}
    </div>
  );
}
