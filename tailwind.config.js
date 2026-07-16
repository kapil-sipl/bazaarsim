/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0F12',
          900: '#0F1417',
          800: '#171E24',
          700: '#212B32',
          600: '#2E3A42',
          500: '#4A5A63',
          400: '#6E7F88',
          300: '#94A3AB',
          200: '#C3CDD2',
          100: '#E8EDF0'
        },
        marigold: {
          500: '#F5A623',
          400: '#F7B94C',
          300: '#FACD7D'
        },
        gain: {
          600: '#1F8F76',
          500: '#2FA88E',
          400: '#4FC3A9'
        },
        loss: {
          600: '#C4443A',
          500: '#E2574C',
          400: '#EB7A70'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.5)'
      }
    }
  },
  plugins: []
}
