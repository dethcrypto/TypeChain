import { deployContract } from "./ethers";
import { ContractWithOverloads } from "./types/ethers-contracts/ContractWithOverloads";
import { BigNumber } from "ethers/utils";

import { expect } from "chai";

describe("ContractWithOverloads", () => {
  it("should work", async () => {
    const contract = (await deployContract("ContractWithOverloads")) as ContractWithOverloads;

    expect(await contract.functions.counter()).to.be.deep.eq(new BigNumber("0"));
  });
});
