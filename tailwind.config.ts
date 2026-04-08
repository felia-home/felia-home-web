import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5BAD52",
        "primary-dark": "#3d8a3a",
        "primary-light": "#f0f7ee",
        "text-main": "#333333",
        "text-sub": "#666666",
        "border-base": "#e0e0e0",
        "footer-bg": "#2d5a3d",
        // Legacy aliases (kept for pages not yet migrated)
        main:   "#2d5a3d",
        accent: "#5BAD52",
        bg:     "#ffffff",
        line:   "#e0e0e0",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans:  ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
