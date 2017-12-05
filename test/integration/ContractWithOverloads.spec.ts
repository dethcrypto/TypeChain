import { expect } from "chai";
import * as chai from "chai";
import { deployContract } from "./utils/web3Contracts";
import { join } from "path";
import { BigNumber } from "bignumber.js";
import * as Web3 from "web3";
import * as ganache from "ganache-cli";
import * as chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import { web3, accounts, GAS_LIMIT_STANDARD, createNewBlockchain } from "./web3";
import { ContractWithOverloads } from "./abis/ContractWithOverloads";

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
