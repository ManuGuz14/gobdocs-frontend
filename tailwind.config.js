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
          primary: '#111840',   // El azul oscuro del botón y títulos
          secondaryblue: '#013876', // El azul más claro del fondo del hero
          secondary: '#E7422F', // El naranja/rojo de los puntos
          bg: '#FFFFFF'         
        }
      }
    },
  },
  plugins: [],
}