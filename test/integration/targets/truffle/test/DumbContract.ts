import { BigNumber } from "bignumber.js";

const DumbContract = artifacts.require("DumbContract");

contract("DumbContract", ([deployer, user1]) => {
  it("should work", async () => {
    const contract = await DumbContract.new({ from: deployer });

    expect((await contract.counterWithOffset(2)).toNumber()).to.be.eq(2);
    expect((await contract.returnAll()).map(x => x.toNumber())).to.be.deep.eq([0, 5]);
  });

  it("should allow to pass numeric values in multiple ways", async () => {
    const contract = await DumbContract.new({ from: deployer });

    await contract.countup(2);
    await contract.countup(new BigNumber(2));
    await contract.countup("2");
  });
});
