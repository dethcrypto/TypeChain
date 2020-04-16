const Migrations = artifacts.require('Migrations')

module.exports = function(deployer) {
  deployer.deploy(Migrations)
} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}
