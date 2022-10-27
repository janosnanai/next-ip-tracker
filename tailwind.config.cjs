/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "mobile-lg": "400px",
        "mobile-md": "360px",
        "mobile-sm": "280px",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
