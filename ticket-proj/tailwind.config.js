/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {backgroundImage: {
      'custom-gradient':'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',

    },},
  },
  plugins: [],
}