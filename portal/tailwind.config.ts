import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          light: '#f9fafb',
          dark: '#171717',
        },
        base: {
          dark: '#0a0a0a',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
