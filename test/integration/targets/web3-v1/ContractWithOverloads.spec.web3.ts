import { expect } from "chai";

import { ContractWithOverloads } from "./types/web3-v1-contracts/ContractWithOverloads";
import { accounts, deployContract, isString } from "./web3";

describe("ContractWithOverloads", () => {
  it("should work", async () => {
    const contract = await deployContract<ContractWithOverloads>("ContractWithOverloads");

    const res = await contract.methods.counter().call({ from: accounts[0] });
    expect(isString(res)).to.be.true;
    expect(res.toString()).to.be.eq("0");
  });
});
