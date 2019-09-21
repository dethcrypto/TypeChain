import { expect } from "chai";

import { Contract } from "../../parser/abiParser";
import { codegenContractFactory } from "./generation";

describe("Ethers generation edge cases", () => {
  const emptyContract: Contract = {
    name: "TestContract",
    constantFunctions: [],
    constants: [],
    functions: [],
    events: [],
    constructor: { inputs: [], payable: false },
  };

  it("should generate simple factory when no bytecode available", () => {
    expect(codegenContractFactory(emptyContract, "abi", "")).to.match(
      /export class TestContractFactory \{/,
    );
  });
});
