/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif']
      },
      colors: {
        luxury: {
          bg: 'var(--bg-primary)',
          surface: 'var(--bg-secondary)',
          card: 'var(--surface-card)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          gold: 'var(--accent-primary)',
          goldLight: 'var(--accent-secondary)',
          border: 'var(--border-subtle)'
        }
      }
    }
  },
  plugins: []
};
