const Migrations = artifacts.require("Migrations");
const DumbContract = artifacts.require("DumbContract");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(DumbContract, 0);
} as Truffle.Migration;

export {};
