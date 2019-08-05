import { expect } from "chai";

import { Contract } from "../../parser/abiParser";
import { EvmType } from "../../parser/typeParser";
import { codegenContractFactory, codegenContractTypings } from "./generation";

class FakeEvmType extends EvmType {}

describe("Ethers generation edge cases", () => {
  const emptyContract: Contract = {
    name: "TestContract",
    constantFunctions: [],
    constants: [],
    functions: [],
    events: [],
    constructor: { inputs: [], payable: false },
  };

  it("should throw on invalid function input type", () => {
    const contract: Contract = {
      ...emptyContract,
      constantFunctions: [
        {
          name: "testFunction",
          inputs: [
            {
              name: "testInput",
              type: new FakeEvmType(),
            },
          ],
          outputs: [],
        },
      ],
    };
    expect(() => codegenContractTypings(contract)).to.throw("Unrecognized type FakeEvmType");
  });

  it("should throw on invalid function output type", () => {
    const contract: Contract = {
      ...emptyContract,
      constantFunctions: [
        {
          name: "testFunction",
          inputs: [],
          outputs: [
            {
              name: "testOutput",
              type: new FakeEvmType(),
            },
          ],
        },
      ],
    };
    expect(() => codegenContractTypings(contract)).to.throw("Unrecognized type FakeEvmType");
  });

  it("should generate simple factory when no bytecode available", () => {
    expect(codegenContractFactory(emptyContract, "abi", "")).to.match(
      /export class TestContractFactory \{/,
    );
  });
});
