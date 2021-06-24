const baseConfig = require('../../.eslintrc.js')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    'import/no-extraneous-dependencies': 'off',
  },
}
