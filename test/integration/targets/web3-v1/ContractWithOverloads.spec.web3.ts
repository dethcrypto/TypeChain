import { expect } from 'chai';

import { ContractWithOverloads } from './types/web3-contracts/ContractWithOverloads';
import { accounts, deployContract, isBigNumber } from './web3';

describe("ContractWithOverloads", () => {
  it("should work", async () => {
    const contract = await deployContract<ContractWithOverloads>("ContractWithOverloads");

    const res = await contract.methods.counter().call({ from: accounts[0] });
    expect(isBigNumber(res)).to.be.true;
    expect(res.toString()).to.be.eq("0");
  });
});
