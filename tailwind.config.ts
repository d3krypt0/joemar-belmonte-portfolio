import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // All colors reference CSS variables so they flip with theme
      colors: {
        bg:          'var(--color-bg)',
        surface:     'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        border:      'var(--color-border)',
        text:        'var(--color-text)',
        muted:       'var(--color-muted)',
        accent:      'var(--color-accent)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans:    ['var(--font-sans)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
    },
  },
  plugins: [typography],
}

export default config
