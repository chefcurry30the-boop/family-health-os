import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LeatherFolderProps {
  children: ReactNode;
  color?: "brown" | "tan" | "burgundy";
  className?: string;
}

export function LeatherFolder({
  children,
  color = "brown",
  className = "",
}: LeatherFolderProps) {
  const colors = {
    brown: "bg-leather",
    tan: "bg-leather-light",
    burgundy: "bg-[#8B3A3A]",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        colors[color],
        className
      )}
    >
      {/* Leather texture overlay */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
      />
      {/* Stitching border */}
      <div
        className="absolute inset-2 rounded-xl border-2 border-dashed border-white/20 pointer-events-none"
      />
      <div className="relative z-10 p-4">{children}</div>
    </div>
  );
}
