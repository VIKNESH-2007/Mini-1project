/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcf4',
          100: '#d6f7e4',
          200: '#b0eece',
          300: '#7be1b1',
          400: '#40cc8e',
          500: '#1db173', // Main vibrant learning green
          600: '#128e5b',
          700: '#11714b',
          800: '#12593d',
          900: '#114a33',
        },
        amber: {
          streak: '#ff7700',
          xp: '#f59e0b',
        },
        tutor: {
          light: '#f3e8ff',
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
        },
        highcontrast: {
          bg: '#000000',
          card: '#121212',
          text: '#ffffff',
          yellow: '#ffeb3b',
          cyan: '#00e5ff',
          border: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      },
      boxShadow: {
        'playful': '0 8px 0px 0px rgba(0,0,0,0.08)',
        'playful-colored': '0 6px 0px 0px rgba(18, 142, 91, 0.4)',
        'playful-amber': '0 6px 0px 0px rgba(217, 119, 6, 0.4)',
        'playful-purple': '0 6px 0px 0px rgba(124, 58, 237, 0.4)',
      },
      keyframes: {
        flame: {
          '0%, 100%': { transform: 'scale(1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.15) rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'flame-streak': 'flame 1.5s ease-in-out infinite',
        'float-slow': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
