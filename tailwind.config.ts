import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Night palette: the smoking spot outside the office, lit by a sodium lamp.
        asphalt: "#161c24",
        slate: "#222a35",
        fog: "#a9b2be",
        mist: "#e9ecf0",
        sodium: "#f2a23c",
        ember: "#e0612f",
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Impact", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(5, 8, 12, 0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
