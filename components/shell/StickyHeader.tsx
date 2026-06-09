"use client";

import { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface StickyHeaderProps {
  children: ReactNode;
  className?: string;
}

export function StickyHeader({ children, className = "" }: StickyHeaderProps) {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 40], [0, 1]);
  const blur = useTransform(scrollY, [0, 40], [0, 20]);

  return (
    <motion.header
      className={`sticky top-0 z-40 px-5 py-3 ${className}`}
      style={{
        backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
        backgroundColor: useTransform(
          bgOpacity,
          (v) => `rgba(6, 11, 20, ${v * 0.9})`
        ),
      }}
    >
      {children}
    </motion.header>
  );
}
