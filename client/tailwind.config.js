/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.12)'
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          500: '#3b82f6',
          700: '#1d4ed8',
          900: '#172554'
        }
      }
    }
  },
  plugins: []
};
