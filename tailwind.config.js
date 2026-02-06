/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./app/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0b1220",
        sky: "#1f2a44",
        accent: "#f3b73f"
      }
    }
  },
  plugins: []
};
