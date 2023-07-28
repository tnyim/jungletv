import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gray-950': '#0A0E16',
        'gray-850': '#18212F',
        // restore tailwind v2 color names
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
      }
    },
  },
  plugins: [],
  content: {
    relative: true,
    files: [
      "./src/**/*.{html,js,jsx,ts,tsx,svelte}",
      "./appbridge/**/*.{html,js,jsx,ts,tsx,svelte}",
    ],
  },
}
