export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#f7f4f0', dark: '#f0ebe3' },
        brown: { DEFAULT: '#1a1410', light: '#2d2018', muted: '#6b5d52' },
        gold:  { DEFAULT: '#c9956e', light: '#e8b89a', pale: 'rgba(201,149,110,0.1)' },
        blush: '#d4a0b5',
        sage:  '#7aaa90',
        stone: '#a89880',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
