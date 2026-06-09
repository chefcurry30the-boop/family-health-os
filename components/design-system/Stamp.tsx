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
    green: "border-medical-green/60 text-medical-green",
    red: "border-medical-red/60 text-medical-red",
    blue: "border-medical-blue/60 text-medical-blue",
    amber: "border-medical-amber/60 text-medical-amber",
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
