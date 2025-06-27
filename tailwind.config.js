/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-in': 'bounceIn 0.8s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient-flow 8s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          'to': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      colors: {
        // BUCC Primary Colors (Blue)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1e40af', // BUCC Primary Blue
          600: '#1d4ed8',
          700: '#1e3a8a',
          800: '#1e293b',
          900: '#0f172a',
        },
        // BUCC Secondary Colors (Red)
        secondary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca', 
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626', // BUCC Secondary Red
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
        },
        // BUCC Accent Colors
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc', 
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Dark mode specific colors
        dark: {
          bg: {
            primary: '#0f172a',
            secondary: '#1e293b',
            tertiary: '#334155',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#e2e8f0',
            tertiary: '#cbd5e1',
          },
          border: {
            primary: '#334155',
            secondary: '#475569',
          }
        }
      },
    },
  },
  plugins: [],
}
