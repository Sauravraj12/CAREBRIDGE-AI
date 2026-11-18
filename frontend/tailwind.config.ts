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
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
        teal: {
          600: "#0f766e",
          700: "#115e59",
        },
        background: "#f8fafc",
        card: "#ffffff",
        text: "#1e293b",
        success: "#16a34a",
        warning: "#d97706",
        danger: "#dc2626",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans TC", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
