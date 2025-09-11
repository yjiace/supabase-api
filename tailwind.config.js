/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk Dark Theme Colors
        'dark': {
          'bg': '#0A0A0B',
          'surface': '#1A1A1B',
          'border': '#2A2A2B',
        },
        'neon': {
          'green': '#00FF88',
          'blue': '#00D4FF',
          'purple': '#8B5CF6',
        },
        'cyber': {
          'gray': '#A0A0A0',
          'light': '#FFFFFF',
        }
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
        `,
        'cyber-gradient': 'linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%)',
        'neon-gradient': 'linear-gradient(135deg, #00FF88 0%, #00D4FF 100%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'grid-move': 'gridMove 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(0, 255, 136, 0.5), 0 0 10px rgba(0, 255, 136, 0.3)' 
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.8), 0 0 30px rgba(0, 255, 136, 0.5)' 
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

