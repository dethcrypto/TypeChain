import { deployContract, accounts } from "./web3";
import { DumbContract } from "./types/web3-contracts/DumbContract";

import { expect } from "chai";

describe("DumbContract", () => {
  it("should work", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(await contract.methods.returnAll().call({ from: accounts[0] })).to.be.deep.eq({
      "0": "0",
      "1": "5",
    });
  });

  it("should have an address", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(await contract._address).to.be.string;
  });

  it("should allow to pass unsigned values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    await contract.methods.countup(2).send({ from: accounts[0] });
    expect(await contract.methods.counter().call()).to.be.eq("2");
    await contract.methods.countup("2").send({ from: accounts[0] });
    expect(await contract.methods.counter().call()).to.be.eq("4");
  });

  it("should allow to pass signed values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(await contract.methods.returnSigned(2).call()).to.be.eq("2");
    expect(await contract.methods.returnSigned("2").call()).to.be.eq("2");
  });

  it("should allow to pass address values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(
      await contract.methods.testAddress("0x0000000000000000000000000000000000000123").call(),
    ).to.be.eq("0x0000000000000000000000000000000000000123");
  });

  it("should allow to pass bytes values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    const res = await contract.methods.callWithBytes([1, 0, 1]).call();
    expect(res).to.be.deep.eq("0x0100010000000000000000000000000000000000000000000000000000000000");
  });

  it("should allow to pass boolean values", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    const res = await contract.methods.callWithBoolean(true).call();
    expect(res).to.be.deep.eq(true);
  });

  it("should allow to pass numeric arrays values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    const res = await contract.methods.callWithArray2(["1", 2]).call();
    expect(res).to.be.deep.eq(["1", "2"]);
  });

  it("should allow to pass strings ", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(await contract.methods.testString("abc").call()).to.be.deep.eq("abc");
  });
});
