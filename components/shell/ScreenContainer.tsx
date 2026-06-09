"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function ScreenContainer({ children, className = "", title }: ScreenContainerProps) {
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
        paddingBottom: "80px",
      }}
    >
      {title && (
        <div className="px-5 pt-3 pb-2">
          <h1 className="text-2xl font-semibold tracking-tight font-display text-ivory">
            {title}
          </h1>
        </div>
      )}
      {children}
    </motion.div>
  );
}
