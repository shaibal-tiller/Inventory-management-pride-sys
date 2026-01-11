/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        // Neutral Colors
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        // Success Colors
        green: {
          50: "#DCFCE7",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
        },
        // Warning Colors
        yellow: {
          50: "#FEF9C3",
          100: "#FEF3C7",
          600: "#CA8A04",
          700: "#A16207",
          800: "#B45309",
        },
        // Error Colors
        red: {
          50: "#FEE2E2",
          100: "#FEF2F2",
          600: "#DC2626",
          700: "#B91C1C",
        },
        // Info Colors
        blue: {
          50: "#EFF6FF",
          700: "#1D4ED8",
        },
        // Purple Colors
        purple: {
          50: "#F3E8FF",
          700: "#7E22CE",
        },
        // Orange Colors
        orange: {
          50: "#FFEDD5",
          700: "#C2410C",
        },
        // Teal Colors
        teal: {
          50: "#CCFBF1",
          700: "#0F766E",
        },
        // Pink Colors
        pink: {
          50: "#FCE7F3",
          700: "#BE185D",
        },
        // Gray Colors
        gray: {
          400: "#9CA3AF",
          500: "#767676",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
      },
      borderRadius: {
        sm: "2.5px",
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        DEFAULT: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
