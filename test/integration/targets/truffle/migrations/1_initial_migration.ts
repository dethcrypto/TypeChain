const Migrations = artifacts.require("Migrations");
const DumbContract = artifacts.require("DumbContract");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(DumbContract);
} as Truffle.Migration;

export {};
