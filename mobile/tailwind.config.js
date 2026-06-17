/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
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
      },
      fontFamily: {
        display: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "system-ui", "sans-serif"],
        body: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "system-ui", "sans-serif"],
        mono: ["SF Mono", "ui-monospace", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
