import { expect } from "chai";
import { deployContract } from "./utils/web3Contracts";

import { web3 } from "./web3";
import { __ContractWithOverloads_sol_ContractWithOverloads as ContractWithOverloads } from "./abis/__ContractWithOverloads_sol_ContractWithOverloads";

describe("DumbContract", () => {
  let contractAddress: string;

  beforeEach(async () => {
    contractAddress = (await deployContract("ContractWithOverloads")).address;
  });

  it("should be able to access counter", async () => {
    const contractWithOverloads = await ContractWithOverloads.createAndValidate(
      web3,
      contractAddress
    );
    expect((await contractWithOverloads.counter).toNumber()).to.be.eq(0);
  });

  it.skip("should be able to access overloaded methods");
});
