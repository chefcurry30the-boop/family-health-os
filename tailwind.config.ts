import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: "oklch(12% 0.04 260)",
          DEFAULT: "oklch(18% 0.05 260)",
          light: "oklch(25% 0.06 260)",
        },
        leather: {
          DEFAULT: "oklch(32% 0.10 50)",
          light: "oklch(42% 0.12 55)",
          warm: "oklch(38% 0.11 52)",
        },
        ivory: {
          DEFAULT: "oklch(96% 0.008 90)",
          dark: "oklch(92% 0.010 85)",
        },
        paper: {
          DEFAULT: "oklch(94% 0.007 88)",
          aged: "oklch(90% 0.015 80)",
        },
        medical: {
          green: "oklch(55% 0.14 155)",
          "green-light": "oklch(72% 0.12 155)",
          "green-glow": "oklch(60% 0.18 155)",
          red: "oklch(52% 0.22 25)",
          "red-glow": "oklch(55% 0.24 25)",
          "red-light": "oklch(70% 0.18 25)",
          amber: "oklch(68% 0.16 75)",
          blue: "oklch(58% 0.16 255)",
          "blue-light": "oklch(72% 0.12 255)",
          purple: "oklch(55% 0.18 300)",
        },
        glass: {
          bg: "rgba(255, 255, 255, 0.06)",
          "bg-strong": "rgba(255, 255, 255, 0.10)",
          "bg-heavy": "rgba(255, 255, 255, 0.14)",
          border: "rgba(255, 255, 255, 0.18)",
          "border-strong": "rgba(255, 255, 255, 0.30)",
          highlight: "rgba(255, 255, 255, 0.40)",
          shadow: "rgba(0, 0, 0, 0.30)",
        },
      },
      fontFamily: {
        display: ["'New York'", "'Iowan Old Style'", "Charter", "Georgia", "serif"],
        body: ["-apple-system", "BlinkMacSystemFont", "'SF Pro Text'", "system-ui", "sans-serif"],
        mono: ["'SF Mono'", "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "20px",
        xl: "28px",
        "2xl": "36px",
      },
      spacing: {
        sp1: "4px",
        sp2: "8px",
        sp3: "12px",
        sp4: "16px",
        sp5: "20px",
        sp6: "24px",
        sp7: "32px",
        sp8: "40px",
        sp9: "48px",
        sp10: "64px",
        "safe-top": "59px",
        "safe-bottom": "34px",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        folderOpen: {
          from: { opacity: "0", transform: "scale(0.95) translateY(10px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        emergencyPulse: {
          "0%, 100%": { boxShadow: "0 0 30px rgba(255,40,40,0.5), 0 4px 16px rgba(200,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)" },
          "50%": { boxShadow: "0 0 50px rgba(255,40,40,0.7), 0 4px 20px rgba(200,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 0.4s ease both",
        "folder-open": "folderOpen 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "emergency-pulse": "emergencyPulse 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
