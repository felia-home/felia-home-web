import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // フェリアホーム カラーパレット
        felia: {
          green: "#5BAD52",
          "green-dark": "#4A9A41",
          "green-light": "#EBF7EA",
          text: "#333333",
          "text-sub": "#666666",
          border: "#E5E5E5",
          bg: "#FFFFFF",
          "bg-gray": "#F8F8F8",
        },
      },
      fontFamily: {
        sans: ["Noto Sans JP", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      screens: {
        sp: "375px",
        tb: "768px",
        pc: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
