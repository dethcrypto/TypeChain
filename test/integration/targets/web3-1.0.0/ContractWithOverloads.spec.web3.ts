import { deployContract, accounts } from "./web3";
import { DumbContract } from "./types/web3-contracts/DumbContract";

import { expect } from "chai";
import { ContractWithOverloads } from "./types/web3-contracts/ContractWithOverloads";

describe("ContractWithOverloads", () => {
  it("should work", async () => {
    const contract = (await deployContract("ContractWithOverloads")) as ContractWithOverloads;

    expect(await contract.methods.counter().call({ from: accounts[0] })).to.be.deep.eq("0");
  });
});
