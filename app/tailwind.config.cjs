module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'gray-950':'#0A0E16',
        'gray-850':'#18212F',
      }
    },
  },
  variants: {
    extend: {
      blur: ['hover', 'active'],
      ringWidth: ['focus-visible'],
      ringColor: ['focus-visible'],
    },
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    content: [
      "./**/*.html",
      "./*.html",
      "./**/*.js",
      "./*.js",
      "./**/*.svelte",
      "./*.svelte",
    ],
    options: {
      whitelist: [],
    },
  },
}
