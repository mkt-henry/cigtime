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
        ink: "#171717",
        paper: "#f5f5f2",
        line: "#d8d8d0",
        moss: "#2f6f5f",
        rust: "#a94722",
        ember: "#f2a65a",
      },
      boxShadow: {
        soft: "0 18px 70px rgba(23, 23, 23, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
