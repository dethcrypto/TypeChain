require('ts-node/register/transpile-only')

module.exports = {
  test_file_extension_regexp: /.*\.ts$/,
  migrations_file_extension_regexp: /.*\.ts$/,

  networks: {
    development: {
      network_id: 1337,
      host: 'localhost',
      port: 8545,
    },
  },
}
