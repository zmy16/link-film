import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#08080A",
        elevated: "#101013",
        surface: "#16161A",
        "surface-2": "#1E1E24",
        line: "#2A2A31",
        "line-strong": "#3A3A44",
        ink: "#F2F2F4",
        "ink-soft": "#B4B4BC",
        muted: "#8A8A95",
        gold: {
          DEFAULT: "#FFD700",
          soft: "#FFE566",
          deep: "#C9A900",
        },
        teal: {
          DEFAULT: "#2DD4BF",
          soft: "#5EEAD4",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Sora", "ui-sans-serif", "sans-serif"],
        sans: [
          "var(--font-body)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2.5xl": "1.25rem",
      },
      boxShadow: {
        lift: "0 32px 64px -32px rgba(0, 0, 0, 0.9)",
        "glow-gold":
          "0 0 0 1px rgba(255, 215, 0, 0.45), 0 22px 60px -24px rgba(255, 215, 0, 0.35)",
        "glow-teal":
          "0 0 0 1px rgba(45, 212, 191, 0.45), 0 22px 60px -24px rgba(45, 212, 191, 0.3)",
      },
      transitionTimingFunction: {
        cine: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        rise: "rise 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
        breathe: "breathe 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
