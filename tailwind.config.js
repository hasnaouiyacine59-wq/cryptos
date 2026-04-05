/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d0f14',
        surface: '#161b22',
        border: '#21262d',
        accent: '#f7931a',
        green: '#00c853',
        red: '#ff3d57',
      },
    },
  },
  plugins: [],
}
