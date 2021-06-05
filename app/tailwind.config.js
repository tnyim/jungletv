module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
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
