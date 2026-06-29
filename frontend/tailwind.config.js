/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        critical: "#EF4444",
        high: "#F97316",
        medium: "#F59E0B",
        low: "#10B981",
        passed: "#10B981",
        failed: "#EF4444",
        pending: "#6B7280",
        running: "#3B82F6",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
