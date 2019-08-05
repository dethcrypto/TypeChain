import { expect } from "chai";
import { deployContract } from "../../utils/web3Contracts";

import { web3 } from "../../web3";
import { ContractWithOverloads } from "./wrappers/ContractWithOverloads";
import { snapshotSource } from "../../utils/snapshotSource";
import { join } from "path";

describe("ContractWithOverloads", () => {
  let contractAddress: string;

  beforeEach(async () => {
    contractAddress = (await deployContract("ContractWithOverloads")).address;
  });

  it("should snapshot generated code", () =>
    snapshotSource(join(__dirname, "./wrappers/ContractWithOverloads.ts")));

  it("should be able to access counter", async () => {
    const contractWithOverloads = await ContractWithOverloads.createAndValidate(
      web3,
      contractAddress,
    );
    expect((await contractWithOverloads.counter).toNumber()).to.be.eq(0);
  });

  // @todo add support for function overloading,
  it.skip("should be able to access overloaded methods");
});
