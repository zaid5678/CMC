import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      colors: {
        'green-deep': '#1E5631',
        'green-mid': '#2D7A47',
        'gold-rich': '#C9A84C',
        'gold-light': '#E8C97A',
        'gold-dark': '#8B6914',
        ivory: '#F8F4EC',
        'ivory-dark': '#EDE6D6',
        ink: '#1A1208',
        'ink-soft': '#3D3020',
        surface: '#FFFFFF',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};

export default config;
