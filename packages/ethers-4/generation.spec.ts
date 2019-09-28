import { expect } from "chai";

import { Contract } from "../core/parser/abiParser";
import { codegenContractFactory } from "./lib/generation";

describe("Ethers generation edge cases", () => {
  const emptyContract: Contract = {
    name: "TestContract",
    functions: {},
    events: {},
    constructor: [{ name: "constructor", inputs: [], outputs: [], stateMutability: "nonpayable" }],
  };

  it("should generate simple factory when no bytecode available", () => {
    expect(codegenContractFactory(emptyContract, "abi", "")).to.match(
      /export class TestContractFactory \{/,
    );
  });
});
