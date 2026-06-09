import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PrescriptionPadProps {
  children: ReactNode;
  header?: string;
  className?: string;
}

export function PrescriptionPad({
  children,
  header,
  className = "",
}: PrescriptionPadProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden bg-[#FFFEF7] shadow-sm",
        className
      )}
    >
      {/* Red header line */}
      {header && (
        <div className="bg-[#C0392B] px-4 py-2">
          <span className="text-white text-xs font-bold tracking-wider uppercase">
            {header}
          </span>
        </div>
      )}
      {/* Ruled lines */}
      <div
        className="p-4"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 23px, #E8D5C4 23px, #E8D5C4 24px)",
          backgroundSize: "100% 24px",
          lineHeight: "24px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
