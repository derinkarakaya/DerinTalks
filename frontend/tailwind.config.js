/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sıcak bej / krem tonları (Warm Beige / Cream)
        cream: {
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#EFE7DA',
          300: '#E2D6C3',
          400: '#CBBBA4',
          500: '#B4A087',
          600: '#8E7B64',
          700: '#685947',
        },
        // Koyu lacivert tonları (Deep Navy) - Yan menü ve ana butonlar
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#627D98',
          500: '#334E68',
          600: '#243B53',
          700: '#1E3A5F',
          800: '#14233C',
          900: '#0F1A2E',
          950: '#0A1220',
        },
        // Derin bordo tonları (Deep Burgundy / Maroon) - Uyarılar, vurgular ve bildirimler
        burgundy: {
          50: '#FDF2F4',
          100: '#FCE7EC',
          200: '#F8D0DB',
          300: '#F2AABF',
          400: '#E36987',
          500: '#BF264E',
          600: '#9B1B36',
          700: '#80142B',
          800: '#671022',
          900: '#540D1C',
          950: '#3B0712',
        },
        // Geleneksel renk yardımcıları (uyumluluk için)
        sky: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          500: '#1E3A5F',
          600: '#14233C',
          700: '#0F1A2E',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 26, 46, 0.05), 0 2px 6px -1px rgba(15, 26, 46, 0.03)',
        'card': '0 10px 30px -5px rgba(15, 26, 46, 0.04), 0 4px 10px -2px rgba(15, 26, 46, 0.02)',
        'elevated': '0 20px 40px -15px rgba(15, 26, 46, 0.12)',
      }
    },
  },
  plugins: [],
}
