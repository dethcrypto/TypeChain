import { deployContract } from "./ethers";
import { DumbContract } from "./types/ethers-contracts/DumbContract";
import { BigNumber } from "ethers/utils";

import { expect } from "chai";

describe("DumbContract", () => {
  it("should work", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    const res = await contract.functions.returnAll();
    expect(res).to.be.deep.eq([new BigNumber("0"), new BigNumber("5")]);
  });

  it("should have an address", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(contract.address).to.be.string;
  });

  it("should allow to pass unsigned values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    await contract.functions.countup(2);
    expect(await contract.functions.counter()).to.be.deep.eq(new BigNumber("2"));
    await contract.functions.countup("2");
    expect(await contract.functions.counter()).to.be.deep.eq(new BigNumber("4"));
  });

  it("should allow to pass signed values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(await contract.functions.returnSigned(2)).to.be.deep.eq(new BigNumber("2"));
    expect(await contract.functions.returnSigned("2")).to.be.deep.eq(new BigNumber("2"));
  });

  it("should allow to pass address values", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(
      await contract.functions.testAddress("0x0000000000000000000000000000000000000123"),
    ).to.be.eq("0x0000000000000000000000000000000000000123");
  });

  it("should allow to pass bytes values", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    await contract.functions.callWithBytes(
      "0x0100010000000000000000000000000000000000000000000000000000000000",
    );
  });

  it("should allow to pass boolean values", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    const res = await contract.functions.callWithBoolean(true);
    expect(res).to.be.deep.eq(true);
  });

  it("should allow to pass numeric arrays values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    const res = await contract.functions.callWithArray2(["1", 2]);
    expect(res).to.be.deep.eq([new BigNumber("1"), new BigNumber("2")]);
  });

  it("should allow to pass strings ", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(await contract.functions.testString("abc")).to.be.deep.eq("abc");
  });

  it("should allow to pass overrides", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;
    const value = 1;
    const gasPrice = 33;

    const tx = await contract.functions.countupForEther({ value, gasPrice });

    expect(tx.value).to.be.deep.eq(new BigNumber(value));
    expect(tx.gasPrice).to.be.deep.eq(new BigNumber(gasPrice));
  });
});
