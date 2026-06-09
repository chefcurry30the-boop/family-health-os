import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StickyNoteProps {
  children: ReactNode;
  color?: "yellow" | "blue" | "green" | "pink";
  className?: string;
}

export function StickyNote({
  children,
  color = "yellow",
  className = "",
}: StickyNoteProps) {
  const colors = {
    yellow: "bg-[#FFF9C4] text-[#5D4E37]",
    blue: "bg-[#E3F2FD] text-[#37474F]",
    green: "bg-[#E8F5E9] text-[#2E4A32]",
    pink: "bg-[#FCE4EC] text-[#4A2C3A]",
  };

  return (
    <div
      className={cn(
        "relative rounded-sm p-3 shadow-md transform rotate-[-0.5deg]",
        colors[color],
        className
      )}
      style={{
        boxShadow: "2px 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)",
      }}
    >
      {children}
    </div>
  );
}
