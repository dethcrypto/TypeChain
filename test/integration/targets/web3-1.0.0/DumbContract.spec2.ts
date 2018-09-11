import { deployContract, accounts } from "./web3";
import { DumbContract } from "./types/web3-contracts";

import { expect } from "chai";
import BN = require("bn.js");

describe("DumbContract", () => {
  it("should work", async () => {
    const dumbContract = (await deployContract("DumbContract")) as DumbContract;

    const res = await dumbContract.methods.returnAll().call({ from: accounts[0] });
    expect(res).to.be.deep.eq({ "0": "0", "1": "5" });
  });
});
