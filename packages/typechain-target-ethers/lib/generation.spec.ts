import { expect } from "chai";
import { Contract } from "typechain";

import { codegenContractFactory } from "./generation";

describe("Ethers generation edge cases", () => {
  const emptyContract: Contract = {
    name: "TestContract",
    functions: {},
    events: {},
    constructor: [{ name: "constructor", inputs: [], outputs: [], stateMutability: "nonpayable" }],
  };

  it("should generate simple factory when no bytecode available", () => {
    expect(codegenContractFactory(emptyContract, "abi", undefined)).to.match(
      /export class TestContractFactory \{/,
    );
  });
});
