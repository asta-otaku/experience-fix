/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#191919",
        secondary: "#3076FF",
      },
      fontFamily: {
        mono: ["FS Mono", "sans-serif"],
      },
    },
  },
  plugins: [],
};
