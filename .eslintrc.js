module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off',
    'no-unneeded-ternary': 'off',
    'camelcase': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'no-return-assign': 'off',
    'no-return-assign': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
