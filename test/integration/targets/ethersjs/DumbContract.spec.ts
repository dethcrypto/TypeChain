import { deployContract, accounts } from "./ether.ts";
import { DumbContract } from "./types/web3-contracts/DumbContract";

import { expect } from "chai";
describe("DumbContract", () => {
    it("should work", async () => {
      const contract = (await deployContract("DumbContract")) as DumbContract;
  
      expect(await contract.returnAll()).to.be.deep.eq({
        "0": "0",
        "1": "5",
      });
    });
  
    it("should allow to pass unsigned values in multiple ways", async () => {
      const contract = (await deployContract("DumbContract")) as DumbContract;
  
      await contract.countup(2);
      expect(await contract.counter()).to.be.eq("2");
      await contract.countup("2").send({ from: accounts[0] });
      expect(await contract.counter()).to.be.eq("4");
    });
  
    it("should allow to pass signed values in multiple ways", async () => {
      const contract = (await deployContract("DumbContract")) as DumbContract;
  
      expect(await contract.returnSigned(2)).to.be.eq("2");
      expect(await contract.returnSigned("2")).to.be.eq("2");
    });
  
    it("should allow to pass address values in multiple ways", async () => {
      const contract = (await deployContract("DumbContract")) as DumbContract;
  
      expect(
        await contract.testAddress("0x0000000000000000000000000000000000000123"),
      ).to.be.eq("0x0000000000000000000000000000000000000123");
    });
  
    it("should allow to pass bytes values in multiple ways", async () => {
      const contract = (await deployContract("DumbContract")) as DumbContract;
  
      const res = await contract.callWithBytes([1, 0, 1]);
      expect(res).to.be.deep.eq("0x0100010000000000000000000000000000000000000000000000000000000000");
    });
  
    it("should allow to pass boolean values", async () => {
      const contract = (await deployContract("DumbContract")) as DumbContract;
  
      const res = await contract.callWithBoolean(true);
      expect(res).to.be.deep.eq(true);
    });
  
    it("should allow to pass numeric arrays values in multiple ways", async () => {
      const contract = (await deployContract("DumbContract")) as DumbContract;
  
      const res = await contract.callWithArray2(["1", 2]);
      expect(res).to.be.deep.eq(["1", "2"]);
    });
  
    it("should allow to pass strings ", async () => {
      const contract = (await deployContract("DumbContract")) as DumbContract;
  
      expect(await contract.testString("abc")).to.be.deep.eq("abc");
    });
  });