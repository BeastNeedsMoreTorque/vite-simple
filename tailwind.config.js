/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["cupcake", "dark", "coffee"],
  }
  plugins: [require("@tailwindcss/typography"), require('@tailwindcss/forms'), require("daisyui")],
}

