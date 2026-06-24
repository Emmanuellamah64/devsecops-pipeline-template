/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        critical: "#A32D2D",
        high: "#854F0B",
        medium: "#185FA5",
        low: "#0F6E56",
        passed: "#0F6E56",
        failed: "#A32D2D",
        pending: "#5F5E5A",
        running: "#185FA5",
      },
    },
  },
  plugins: [],
};
