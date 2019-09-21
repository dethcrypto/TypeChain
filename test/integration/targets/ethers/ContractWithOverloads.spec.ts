import { ContractWithOverloadsFactory } from "./types/ethers-contracts/ContractWithOverloadsFactory";
import { BigNumber } from "ethers/utils";

import { expect } from "chai";
import { getTestSigner } from "./ethers";
import { snapshotSource } from "../../utils/snapshotSource";
import { join } from "path";

describe("ContractWithOverloads", () => {
  it("should snapshot generated code", () => {
    snapshotSource(join(__dirname, "./types/ethers-contracts/ContractWithOverloads.d.ts"));
    snapshotSource(join(__dirname, "./types/ethers-contracts/ContractWithOverloadsFactory.ts"));
  });

  it("should work", async () => {
    const contract = await new ContractWithOverloadsFactory(getTestSigner()).deploy();

    expect(await contract.functions.counter()).to.be.deep.eq(new BigNumber("0"));
  });
});
