import { BigNumber } from "bignumber.js";

const DumbContract = artifacts.require("DumbContract");

contract("DumbContract", ([deployer]) => {
  it("should work", async () => {
    const contract = await DumbContract.new(0, { from: deployer });

    expect(DumbContract.contractName).to.be.a("string");

    expect(contract.address).to.be.a("string");
    expect((await contract.counterWithOffset(2)).toNumber()).to.be.eq(2);
    expect((await contract.returnAll()).map(x => x.toNumber())).to.be.deep.eq([0, 5]);
  });

  // it("should allow function to be simulated with call", async () => {
  //   const contract = await DumbContract.new(0, { from: deployer });

  //   expect(DumbContract.contractName).to.be.a("string");

  //   expect(contract.address).to.be.a("string");
  //   expect((await contract.counterWithOffset(2)).toNumber()).to.be.eq(2);
  //   expect((await contract.returnAll()).map(x => x.toNumber())).to.be.deep.eq([0, 5]);
  // });

  it("should estimate gas", async () => {
    const contract = await DumbContract.new(0, { from: deployer });
    expect(await contract.countup.estimateGas(2)).to.not.be.undefined;
    expect(await contract.countup.estimateGas(2)).to.be.gt(20000);
  });

  it("should simulate transaction with call", async () => {
    const contract = await DumbContract.new(0, { from: deployer });
    expect(await contract.countupWithReturn.call(2)).to.not.be.undefined;
    expect((await contract.countupWithReturn.call(2)).toNumber()).to.be.eq(2);
    expect((await contract.counter()).toNumber()).to.be.eq(0);
  });

  it("should allow transactions to be sent with sendTransaction", async () => {
    const contract = await DumbContract.new(0, { from: deployer });
    expect(await contract.countup.sendTransaction(2)).to.not.be.undefined;
    expect((await contract.countup.sendTransaction(2)).length).to.be.eq(66);
    expect((await contract.counter()).toNumber()).to.be.eq(4);
  });

  it("should allow to pass unsigned values in multiple ways", async () => {
    const contract = await DumbContract.new(0, { from: deployer });

    expect((await contract.countup(2)).tx).to.not.be.undefined;
    expect((await contract.counter()).toNumber()).to.be.eq(2);
    await contract.countup(new BigNumber(2));
    expect((await contract.counter()).toNumber()).to.be.eq(4);
    await contract.countup("2");
    expect((await contract.counter()).toNumber()).to.be.eq(6);
  });

  it("should allow to pass signed values in multiple ways", async () => {
    const contract = await DumbContract.new(0, { from: deployer });

    expect((await contract.returnSigned(2)).toNumber()).to.be.eq(2);
    expect((await contract.returnSigned(new BigNumber(2))).toNumber()).to.be.eq(2);
    expect((await contract.returnSigned("2")).toNumber()).to.be.eq(2);
  });

  it("should allow to pass address values in multiple ways", async () => {
    const contract = await DumbContract.new(0, { from: deployer });

    expect(await contract.testAddress("0x123")).to.be.eq(
      "0x0000000000000000000000000000000000000123",
    );
    expect(await contract.testAddress(new BigNumber("0x123"))).to.be.eq(
      "0x0000000000000000000000000000000000000123",
    );
  });

  it("should allow to pass bytes values in multiple ways", async () => {
    const contract = await DumbContract.new(0, { from: deployer });

    expect(await contract.callWithBytes("0x123")).to.be.deep.eq(
      "0x1230000000000000000000000000000000000000000000000000000000000000",
    );
    expect(await contract.callWithBytes(new BigNumber("0x123"))).to.be.deep.eq(
      "0x1230000000000000000000000000000000000000000000000000000000000000",
    );
  });

  it("should allow to pass numeric arrays values in multiple ways", async () => {
    const contract = await DumbContract.new(0, { from: deployer });

    expect(
      (await contract.callWithArray(["1", 2, new BigNumber(3)])).map(x => x.toNumber()),
    ).to.be.deep.eq([1, 2, 3]);
  });

  it("should allow to pass strings ", async () => {
    const contract = await DumbContract.new(0, { from: deployer });

    expect(await contract.testString("abc")).to.be.deep.eq("abc");
  });
});
