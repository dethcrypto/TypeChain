import { deployContract, accounts } from "./web3";
import { DumbContract } from "./types/web3-contracts/DumbContract";

import { expect } from "chai";

describe("DumbContract", () => {
  it("should work", async () => {
    const contract: DumbContract = await deployContract<DumbContract>("DumbContract");

    expect(await contract.methods.returnAll().call({ from: accounts[0] })).to.be.deep.eq({
      "0": "0",
      "1": "5",
    });
  });

  it("should have an address", async () => {
    const contract = await deployContract<DumbContract>("DumbContract");

    expect(await contract.options.address).to.be.string;
  });

  it("should allow to pass unsigned values in multiple ways", async () => {
    const contract = await deployContract<DumbContract>("DumbContract");

    await contract.methods.countup(2).send({ from: accounts[0] });
    expect(await contract.methods.counter().call()).to.be.eq("2");
    await contract.methods.countup("2").send({ from: accounts[0] });
    expect(await contract.methods.counter().call()).to.be.eq("4");
  });

  it("should allow to pass signed values in multiple ways", async () => {
    const contract = await deployContract<DumbContract>("DumbContract");

    expect(await contract.methods.returnSigned(2).call()).to.be.eq("2");
    expect(await contract.methods.returnSigned("2").call()).to.be.eq("2");
  });

  it("should allow to pass address values in multiple ways", async () => {
    const contract = await deployContract<DumbContract>("DumbContract");

    expect(
      await contract.methods.testAddress("0x0000000000000000000000000000000000000123").call(),
    ).to.be.eq("0x0000000000000000000000000000000000000123");
  });

  it("should allow to pass bytes values in multiple ways", async () => {
    const contract = await deployContract<DumbContract>("DumbContract");
    const byteString = "0xabcd123456000000000000000000000000000000000000000000000000000000";

    await contract.methods.callWithBytes(byteString).send({ from: accounts[0] });

    const result = await contract.methods.byteArray().call();
    expect(result).to.be.a("string");
    expect(result).to.eq(byteString);
  });

  it("should allow to pass boolean values", async () => {
    const contract = await deployContract<DumbContract>("DumbContract");

    const res = await contract.methods.callWithBoolean(true).call();
    expect(res).to.be.deep.eq(true);
  });

  it("should allow to pass numeric arrays values in multiple ways", async () => {
    const contract = await deployContract<DumbContract>("DumbContract");

    const res = await contract.methods.callWithArray2(["1", 2]).call();
    expect(res).to.be.deep.eq(["1", "2"]);
  });

  it("should allow to pass strings ", async () => {
    const contract = await deployContract<DumbContract>("DumbContract");

    expect(await contract.methods.testString("abc").call()).to.be.deep.eq("abc");
  });

  it("should allow to clone contracts ", async () => {
    const contract = await deployContract<DumbContract>("DumbContract");

    const contractClone = await contract.clone();

    expect(contractClone).not.to.be.eq(contract);
    expect(contractClone.options.address).to.be.eq(contract.options.address);
  });
});
