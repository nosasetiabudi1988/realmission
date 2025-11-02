/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'display': ['Orbitron', 'sans-serif'],
      },
      colors: {
        'agent-dark': '#0a0a1a',
        'agent-blue': '#00dffc',
        'agent-purple': '#a259ff',
        'agent-pink': '#ff00aa',
        'agent-green': '#00ffaa',
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(0, 223, 252, 0.5)',
        'glow-purple': '0 0 15px rgba(162, 89, 255, 0.5)',
      }
    }
  },
  plugins: [],
}
