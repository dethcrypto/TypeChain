import { deployContract, accounts } from "./web3";
import { ContractWithOverloads } from "./types/web3-contracts/ContractWithOverloads";

import { expect } from "chai";

describe("ContractWithOverloads", () => {
  it("should work", async () => {
    const contract = await deployContract<ContractWithOverloads>("ContractWithOverloads");

    expect((await contract.methods.counter().call({ from: accounts[0] })).toString()).to.be.deep.eq(
      "0",
    );
  });
});
