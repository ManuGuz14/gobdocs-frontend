/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gobdocs: {
          primary: '#1a2b5e',   // El azul oscuro del botón y títulos
          secondary: '#d94032', // El naranja/rojo de los puntos
          bg: '#f8f9fa'         // El fondo gris claro
        }
      }
    },
  },
  plugins: [],
}