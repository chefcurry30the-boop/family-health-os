import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface JournalPageProps {
  children: ReactNode;
  className?: string;
}

export function JournalPage({ children, className = "" }: JournalPageProps) {
  return (
    <div
      className={cn(
        "relative bg-paper rounded-lg overflow-hidden shadow-sm",
        className
      )}
    >
      {/* Red margin line */}
      <div className="absolute left-7 top-0 bottom-0 w-px bg-[#C0392B]/20" />
      {/* Ruled lines */}
      <div
        className="px-4 py-4 pl-10"
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
