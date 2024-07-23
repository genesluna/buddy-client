import { fontFamily } from 'tailwindcss/defaultTheme';
import colors from './app/_config/theme-colors';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      borderRadius: {
        '4xl': '2.25rem',
      },
      dropShadow: {
        glow: [
          '0 0px 20px rgba(255,255, 255, 0.35)',
          '0 0px 65px rgba(255, 255,255, 0.2)',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
