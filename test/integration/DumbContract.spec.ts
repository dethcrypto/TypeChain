import { expect } from "chai";
import { deployContract } from "./utils/web3Contracts";
import { join } from "path";
import { BigNumber } from "bignumber.js";

import DumbContract from "./abis/DumbContract";
import { web3, accounts, GAS_LIMIT_STANDARD } from "./web3";

describe("DumbContract", () => {
  let contractAddress: string;

  beforeEach(async () => {
    contractAddress = (await deployContract("DumbContract")).address;
  });

  it("should allow for calling all methods", async () => {
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    await dumbContract.countupTx({ from: accounts[0], gas: GAS_LIMIT_STANDARD });
    expect((await dumbContract.counter).toNumber()).to.be.eq(1);
    expect((await dumbContract.counterWithOffset(new BigNumber(2))).toNumber()).to.be.eq(3);
    expect(await dumbContract.SOME_VALUE).to.be.eq(true);

    await dumbContract.countupTx({ from: accounts[0], gas: GAS_LIMIT_STANDARD });
    expect((await dumbContract.counterArray(0)).toNumber()).to.be.eq(1);
    expect((await dumbContract.counterArray(1)).toNumber()).to.be.eq(2);
  });
});
