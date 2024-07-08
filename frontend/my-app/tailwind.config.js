module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Actualiza las rutas según tu estructura de proyecto
  ],
  theme: {
    extend: {
      colors: {
        fiestaRed: {
          light: '#E53E3E', // Ajusta según el color del logo
          medium: '#C53030', // Ajusta según el color del logo
          dark: '#742A2A', // Ajusta según el color del logo
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
