const baseConfig = require('../../.eslintrc.js')

module.exports = {
  ...baseConfig,
  rules: {
    'import/no-extraneous-dependencies': 'off',
  },
}
