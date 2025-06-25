/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        hokuto: {
          dark: '#1a1a2e',
          blue: '#16213e',
          gold: '#fbbf24',
          red: '#ef4444'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}