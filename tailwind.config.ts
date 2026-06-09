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
          deep: "#060b14",
          DEFAULT: "#0a1120",
          light: "#101a2e",
          surface: "#121d33",
          hover: "#1a2744",
        },
        status: {
          healthy: "#30d158",
          "healthy-glow": "rgba(48, 209, 88, 0.3)",
          attention: "#ff9f0a",
          "attention-glow": "rgba(255, 159, 10, 0.3)",
          critical: "#ff453a",
          "critical-glow": "rgba(255, 69, 58, 0.3)",
        },
        medical: {
          blue: "#0a84ff",
          "blue-light": "#64d2ff",
          teal: "#5fc9f8",
          purple: "#bf5af2",
          pink: "#ff375f",
          amber: "#ff9f0a",
          green: "#30d158",
          red: "#ff453a",
        },
        glass: {
          bg: "rgba(255, 255, 255, 0.06)",
          "bg-strong": "rgba(255, 255, 255, 0.10)",
          "bg-heavy": "rgba(255, 255, 255, 0.14)",
          "bg-ultra": "rgba(255, 255, 255, 0.20)",
          border: "rgba(255, 255, 255, 0.12)",
          "border-strong": "rgba(255, 255, 255, 0.20)",
          "border-ultra": "rgba(255, 255, 255, 0.30)",
          highlight: "rgba(255, 255, 255, 0.25)",
          "highlight-strong": "rgba(255, 255, 255, 0.40)",
          shadow: "rgba(0, 0, 0, 0.40)",
        },
      },
      fontFamily: {
        display: ["-apple-system", "BlinkMacSystemFont", "'SF Pro Display'", "system-ui", "sans-serif"],
        body: ["-apple-system", "BlinkMacSystemFont", "'SF Pro Text'", "system-ui", "sans-serif"],
        mono: ["'SF Mono'", "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "22px",
        xl: "30px",
        "2xl": "40px",
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
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        emergencyPulse: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(255,69,58,0.4), 0 0 60px rgba(255,69,58,0.2)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(255,69,58,0.6), 0 0 80px rgba(255,69,58,0.3)",
          },
        },
        emergencyGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 0.4s ease both",
        "scale-in": "scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "emergency-pulse": "emergencyPulse 2.5s ease-in-out infinite",
        "emergency-glow": "emergencyGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
