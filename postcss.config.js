module.exports = {
  plugins: {
    // autoprefixer: {},
    "postcss-import": {},
    "postcss-url": {},
    "postcss-cssnext": {},
    "postcss-viewport-units": {},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {
      utf8: false
    },
    "cssnano": {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false
    },
    "postcss-px-to-viewport": {
      viewportWidth: 375,
      viewportHeight: 1334,
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      miniPixelValue: 1,
      mediaQuery: false
    }
  }
}
