/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nasa-blue': '#0B3D91',
        'nasa-red': '#FC3D21',
        'space-dark': '#0A0E27',
        'space-purple': '#6B46C1',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'space-gradient': 'linear-gradient(135deg, #0A0E27 0%, #1a1f3a 50%, #2d3561 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
    },
  },
  plugins: [],
}