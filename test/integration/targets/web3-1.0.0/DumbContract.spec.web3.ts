import { deployContract, accounts, isBigNumber } from "./web3";
import { DumbContract } from "./types/web3-contracts/DumbContract";

import { expect } from "chai";

describe("DumbContract", () => {
  function deployDumbContract(): Promise<DumbContract> {
    return deployContract<DumbContract>("DumbContract", 0);
  }

  it("should work", async () => {
    const contract: DumbContract = await deployDumbContract();

    const res = await contract.methods.returnAll().call({ from: accounts[0] });
    expect(isBigNumber(res[0])).to.be.true;
    expect(isBigNumber(res[1])).to.be.true;
    expect(res[0].toString()).to.be.eq("0");
    expect(res[1].toString()).to.be.eq("5");
  });

  it("should have an address", async () => {
    const contract = await deployDumbContract();

    expect(await contract.options.address).to.be.string;
  });

  it("should allow to pass unsigned values in multiple ways", async () => {
    const contract = await deployDumbContract();

    await contract.methods.countup(2).send({ from: accounts[0] });
    const withNumber = await contract.methods.counter().call();
    expect(isBigNumber(withNumber)).to.be.true;
    expect(withNumber.toString()).to.be.eq("2");

    await contract.methods.countup("2").send({ from: accounts[0] });
    const withString = await contract.methods.counter().call();
    expect(isBigNumber(withString)).to.be.true;
    expect(withString.toString()).to.be.eq("4");
  });

  it("should allow to pass signed values in multiple ways", async () => {
    const contract = await deployDumbContract();

    const withNumber = await contract.methods.returnSigned(2).call();
    expect(isBigNumber(withNumber)).to.be.true;
    expect(withNumber.toString()).to.be.eq("2");

    const withString = await contract.methods.returnSigned("2").call();
    expect(isBigNumber(withString)).to.be.true;
    expect(withString.toString()).to.be.eq("2");
  });

  it("should allow to pass address values in multiple ways", async () => {
    const contract = await deployDumbContract();

    expect(
      await contract.methods.testAddress("0x0000000000000000000000000000000000000123").call(),
    ).to.be.eq("0x0000000000000000000000000000000000000123");
  });

  it("should allow to pass bytes values in multiple ways", async () => {
    const contract = await deployDumbContract();
    const byteString = "0xabcd123456000000000000000000000000000000000000000000000000000000";

    await contract.methods.callWithBytes(byteString).send({ from: accounts[0] });

    const result = await contract.methods.byteArray().call();
    expect(result).to.be.a("string");
    expect(result).to.eq(byteString);
  });

  it("should allow to pass Buffer for dynamic bytes array", async () => {
    const contract = await deployDumbContract();
    const byteString = "0xabcd123456000000000000000000000000000000000000000000000000000000";

    await contract.methods.callWithDynamicByteArray(byteString).send({ from: accounts[0] });

    const result = await contract.methods.dynamicByteArray().call();
    expect(result).to.be.a("string");
    expect(result).to.eq(byteString);
  });

  it("should allow to pass boolean values", async () => {
    const contract = await deployDumbContract();

    const res = await contract.methods.callWithBoolean(true).call();
    expect(res).to.be.deep.eq(true);
  });

  it("should allow to pass numeric arrays values in multiple ways", async () => {
    const contract = await deployDumbContract();

    const res = await contract.methods.callWithArray2(["1", 2]).call();
    expect(res.length).to.be.eq(2);
    expect(isBigNumber(res[0])).to.be.true;
    expect(isBigNumber(res[1])).to.be.true;
    expect(res[0].toString()).to.be.eq("1");
    expect(res[1].toString()).to.be.eq("2");
  });

  it("should allow to pass strings ", async () => {
    const contract = await deployDumbContract();

    expect(await contract.methods.testString("abc").call()).to.be.deep.eq("abc");
  });

  it("should allow to clone contracts ", async () => {
    const contract = await deployDumbContract();

    const contractClone = await contract.clone();

    expect(contractClone).not.to.be.eq(contract);
    expect(contractClone.options.address).to.be.undefined;
  });
});
