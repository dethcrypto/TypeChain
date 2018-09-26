import { deployContract, accounts } from "./ether.ts";
import { DumbContract } from "./types/web3-contracts/DumbContract";

import { expect } from "chai";
import { ContractWithOverloads } from "./types/web3-contracts/ContractWithOverloads";

describe("ContractWithOverloads", () => {
  it("should work", async () => {
    const contract = (await deployContract("ContractWithOverloads")) as ContractWithOverloads;

    expect(await contract.counter()).to.be.deep.eq("0");
  });
});