const Migrations = artifacts.require('Migrations')

const migration: Truffle.Migration = function (deployer) {
  deployer.deploy(Migrations)
}

module.exports = migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}
