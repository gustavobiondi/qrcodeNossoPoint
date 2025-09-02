/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <- olha aqui! Ele vai escanear todos os seus arquivos React/TSX
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
