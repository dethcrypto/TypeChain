import { BigNumber } from "bignumber.js";

const DumbContract = artifacts.require("DumbContract");

contract("DumbContract", ([deployer]) => {
  it("should work", async () => {
    const contract = await DumbContract.new({ from: deployer });

    expect((await contract.counterWithOffset(2)).toNumber()).to.be.eq(2);
    expect((await contract.returnAll()).map(x => x.toNumber())).to.be.deep.eq([0, 5]);
  });

  it("should allow to pass unsigned values in multiple ways", async () => {
    const contract = await DumbContract.new({ from: deployer });

    await contract.countup(2);
    expect((await contract.counter()).toNumber()).to.be.eq(2);
    await contract.countup(new BigNumber(2));
    expect((await contract.counter()).toNumber()).to.be.eq(4);
    await contract.countup("2");
    expect((await contract.counter()).toNumber()).to.be.eq(6);
  });

  it("should allow to pass signed values in multiple ways", async () => {
    const contract = await DumbContract.new({ from: deployer });

    expect((await contract.returnSigned(2)).toNumber()).to.be.eq(2);
    expect((await contract.returnSigned(new BigNumber(2))).toNumber()).to.be.eq(2);
    expect((await contract.returnSigned("2")).toNumber()).to.be.eq(2);
  });

  it("should allow to pass address values in multiple ways", async () => {
    const contract = await DumbContract.new({ from: deployer });

    expect(await contract.testAddress("0x123")).to.be.eq(
      "0x0000000000000000000000000000000000000123",
    );
    expect(await contract.testAddress(new BigNumber("0x123"))).to.be.eq(
      "0x0000000000000000000000000000000000000123",
    );
  });

  it("should allow to pass bytes values in multiple ways", async () => {
    const contract = await DumbContract.new({ from: deployer });

    expect(await contract.callWithBytes("0x123")).to.be.deep.eq(
      "0x1230000000000000000000000000000000000000000000000000000000000000",
    );
    expect(await contract.callWithBytes(new BigNumber("0x123"))).to.be.deep.eq(
      "0x1230000000000000000000000000000000000000000000000000000000000000",
    );
  });

  it("should allow to pass numeric arrays values in multiple ways", async () => {
    const contract = await DumbContract.new({ from: deployer });

    expect(
      (await contract.callWithArray(["1", 2, new BigNumber(3)])).map(x => x.toNumber()),
    ).to.be.deep.eq([1, 2, 3]);
  });
});
