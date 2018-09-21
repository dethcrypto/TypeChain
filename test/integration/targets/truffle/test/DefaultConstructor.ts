import { BigNumber } from "bignumber.js";

const DefaultConstructorContract = artifacts.require("DefaultConstructor");

contract("DefaultConstructor", ([deployer]) => {
  it("should work", async () => {
    const contract = await DefaultConstructorContract.new({ from: deployer });

    expect((await contract.counter()).toNumber()).to.be.eq(0);
  });
});
