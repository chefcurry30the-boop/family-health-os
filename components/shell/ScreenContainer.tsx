"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function ScreenContainer({ children, className = "", title, subtitle }: ScreenContainerProps) {
  return (
    <motion.div
      className={`h-full w-full overflow-y-auto overflow-x-hidden ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        paddingBottom: "max(20px, env(safe-area-inset-bottom))",
      }}
    >
      {(title || subtitle) && (
        <div className="px-5 pt-3 pb-1">
          {title && (
            <h1 className="text-[28px] font-semibold tracking-tight font-display text-white leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-white/60 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}
