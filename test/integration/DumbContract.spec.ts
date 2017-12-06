import { expect } from "chai";
import * as chai from "chai";
import { deployContract } from "./utils/web3Contracts";
import { join } from "path";
import { BigNumber } from "bignumber.js";
import * as Web3 from "web3";
import * as ganache from "ganache-cli";
import * as chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import { DumbContract } from "./abis/DumbContract";
import { web3, accounts, GAS_LIMIT_STANDARD, createNewBlockchain } from "./web3";

describe("DumbContract", () => {
  let contractAddress: string;

  beforeEach(async () => {
    contractAddress = (await deployContract("DumbContract")).address;
  });

  it("should allow for calling all methods", async () => {
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    await dumbContract.countupTx(1).send({ from: accounts[0], gas: GAS_LIMIT_STANDARD });
    await dumbContract.countupTx(1).getData();

    expect((await dumbContract.counter).toNumber()).to.be.eq(1);
    expect((await dumbContract.counterWithOffset(new BigNumber(2))).toNumber()).to.be.eq(3);
    expect(await dumbContract.SOME_VALUE).to.be.eq(true);

    await dumbContract.countupTx(2).send({ from: accounts[0], gas: GAS_LIMIT_STANDARD });
    expect((await dumbContract.counterArray(0)).toNumber()).to.be.eq(1);
    expect((await dumbContract.counterArray(1)).toNumber()).to.be.eq(3);

    expect(await dumbContract.someAddress).to.be.eq(accounts[0]);
  });

  it("should allow for calling payable methods", async () => {
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    await dumbContract
      .countupForEtherTx()
      .send({ from: accounts[0], gas: GAS_LIMIT_STANDARD, value: 10 });

    expect((await dumbContract.counterArray(0)).toNumber()).to.be.eq(10);
  });

  it("should support sending tx via custom web3", async () => {
    const newBlockchain = await createNewBlockchain();
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    await dumbContract
      .countupForEtherTx()
      .send(
        { from: newBlockchain.accounts[0], gas: GAS_LIMIT_STANDARD, value: 10 },
        newBlockchain.web3
      );

      // this should reject because tx wasn't properly mined (contract doesn't exist on different chain)
      await expect(dumbContract.counterArray(0)).to.be.rejected;
  });

  it.skip("should fail for not deployed contracts");
});
