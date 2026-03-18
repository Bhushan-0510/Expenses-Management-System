/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb", // soft blue accent
          muted: "#e0edff"
        }
      }
    }
  },
  plugins: []
};

