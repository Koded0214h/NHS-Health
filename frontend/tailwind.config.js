// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1f89e5",
        "primary-dark": "#166cb8",
        "background-light": "#f8fafc",
        "background-dark": "#111a21",
        "slate-800": "#1e293b",
        "slate-600": "#475569",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}