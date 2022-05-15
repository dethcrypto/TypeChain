const ConvertLib = artifacts.require('ConvertLib')
const MetaCoin = artifacts.require('MetaCoin')

const migration: Truffle.Migration = function (deployer) {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(MetaCoin)
}

module.exports = migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}
