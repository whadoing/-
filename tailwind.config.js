/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        secondary: '#64748b',
      },
      spacing: {
        'section': '2rem',
        'container': '1rem',
      },
      borderRadius: {
        'container': '0.75rem',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
