process.env.NODE_ENV = 'test'

module.exports = {
  require: ['ts-node/register/transpile-only'],
  extension: ['ts'],
  watchExtensions: ['ts'],
  spec: ['test/**/*.test.ts'],
}
