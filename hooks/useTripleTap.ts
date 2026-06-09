"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_TAGS = new Set([
  "BUTTON",
  "A",
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "LABEL",
  "VIDEO",
  "AUDIO",
]);

export function useTripleTap(callback: () => void, timeout = 500) {
  const taps = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closest = target.closest(
        "button, a, input, textarea, select, label, [role='button']"
      );

      // Ignore clicks on interactive elements to prevent accidental triggers
      if (
        INTERACTIVE_TAGS.has(target.tagName) ||
        closest ||
        target.isContentEditable
      ) {
        taps.current = 0;
        if (timer.current) clearTimeout(timer.current);
        return;
      }

      taps.current += 1;

      if (taps.current === 3) {
        taps.current = 0;
        if (timer.current) clearTimeout(timer.current);
        callbackRef.current();
        return;
      }

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        taps.current = 0;
      }, timeout);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [timeout]);
}
