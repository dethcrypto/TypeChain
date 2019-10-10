import { expect } from "chai";
import { merge } from "lodash";

import { MalformedAbiError } from "../utils/errors";
import {
  ensure0xPrefix,
  extractAbi,
  extractBytecode,
  FunctionDeclaration,
  isConstant,
  isConstantFn,
  parse,
  parseEvent,
  RawAbiDefinition,
  RawEventAbiDefinition,
} from "./abiParser";

describe("extractAbi", () => {
  it("should throw error on not JSON ABI", () => {
    const inputJson = `abc`;
    expect(() => extractAbi(inputJson)).to.throw(MalformedAbiError, "Not a json");
  });

  it("should throw error on malformed ABI", () => {
    const inputJson = `{ "someProps": "abc" }`;
    expect(() => extractAbi(inputJson)).to.throw(MalformedAbiError, "Not a valid ABI");
  });

  it("should work with simple abi", () => {
    const inputJson = `[{ "name": "piece" }]`;
    expect(extractAbi(inputJson)).to.be.deep.eq([{ name: "piece" }]);
  });

  it("should work with nested abi (truffle style)", () => {
    const inputJson = `{ "abi": [{ "name": "piece" }] }`;
    expect(extractAbi(inputJson)).to.be.deep.eq([{ name: "piece" }]);
  });
});

describe("extractBytecode", () => {
  const sampleBytecode = "1234abcd";
  const resultBytecode = { bytecode: ensure0xPrefix(sampleBytecode) };

  it("should return bytecode for bare bytecode string", () => {
    expect(extractBytecode(sampleBytecode)).to.deep.eq(resultBytecode);
  });

  it("should return bytecode for bare bytecode with 0x prefix", () => {
    expect(extractBytecode(resultBytecode.bytecode)).to.deep.eq(resultBytecode);
  });

  it("should return undefined for non-bytecode non-json input", () => {
    expect(extractBytecode("surely-not-bytecode")).to.be.undefined;
  });

  it("should return undefined for simple abi without bytecode", () => {
    expect(extractBytecode(`[{ "name": "piece" }]`)).to.be.undefined;
  });

  it("should return undefined for nested abi without bytecode", () => {
    expect(extractBytecode(`{ "abi": [{ "name": "piece" }] }`)).to.be.undefined;
  });

  it("should return bytecode from nested abi (truffle style)", () => {
    expect(extractBytecode(`{ "bytecode": "${sampleBytecode}" }`)).to.deep.eq(resultBytecode);
  });

  it("should return bytecode from nested abi (ethers style)", () => {
    const inputJson = `{ "evm": { "bytecode": { "object": "${sampleBytecode}" }}}`;
    expect(extractBytecode(inputJson)).to.deep.eq(resultBytecode);
  });

  it("should return undefined when nested abi bytecode is malformed", () => {
    expect(extractBytecode(`{ "bytecode": "surely-not-bytecode" }`)).to.be.undefined;
  });
});

describe("ensure0xPrefix", () => {
  it("should prepend 0x when it's missing", () => {
    expect(ensure0xPrefix("1234")).to.eq("0x1234");
  });

  it("should return string unchanged when it has 0x prefix", () => {
    expect(ensure0xPrefix("0x1234")).to.eq("0x1234");
  });
});

describe("parseEvent", () => {
  it("should work", () => {
    const expectedEvent: RawEventAbiDefinition = {
      anonymous: false,
      inputs: [
        { indexed: true, name: "_from", type: "address" },
        { indexed: false, name: "_value", type: "uint256" },
      ],
      name: "Deposit",
      type: "event",
    };
    const parsedEvent = parseEvent(expectedEvent);

    expect(parsedEvent).to.be.deep.eq({
      name: "Deposit",
      inputs: [
        { name: "_from", isIndexed: true, type: { type: "address" } },
        { name: "_value", isIndexed: false, type: { type: "uinteger", bits: 256 } },
      ],
    });
  });
});

describe("parse", () => {
  describe("fallback functions", () => {
    it("should work on output-less fallback functions", () => {
      const fallbackAbiFunc: RawAbiDefinition = {
        payable: true,
        stateMutability: "payable",
        type: "fallback",
      } as any;

      expect(() => parse([fallbackAbiFunc], "fallback")).to.not.throw();
    });
  });
});

export function fixtureFactory<T>(defaults: T): (params?: Partial<T>) => T {
  return (params = {}) => merge({}, defaults, params);
}

describe("helpers", () => {
  const fnFactory = fixtureFactory<FunctionDeclaration>({
    name: "constant",
    inputs: [],
    outputs: [{ type: { type: "string" }, name: "output" }],
    stateMutability: "view",
  });

  const viewFn = fnFactory();
  const pureFn = fnFactory({ stateMutability: "pure" });
  const payableFn = fnFactory(fnFactory({ stateMutability: "payable" }));
  const nonPayableFn = fnFactory(fnFactory({ stateMutability: "nonpayable" }));
  const viewWithInputs = fnFactory({
    stateMutability: "pure",
    inputs: [{ type: { type: "string" }, name: "output" }],
  });

  describe("isConstant", () => {
    it("works", () => {
      expect(isConstant(viewFn)).to.be.true;
      expect(isConstant(pureFn)).to.be.true;
      expect(isConstant(payableFn)).to.be.false;
      expect(isConstant(nonPayableFn)).to.be.false;
      expect(isConstant(viewWithInputs)).to.be.false;
    });
  });

  describe("isConstantFn", () => {
    it("works", () => {
      expect(isConstantFn(viewFn)).to.be.false;
      expect(isConstantFn(pureFn)).to.be.false;
      expect(isConstantFn(payableFn)).to.be.false;
      expect(isConstantFn(nonPayableFn)).to.be.false;
      expect(isConstantFn(viewWithInputs)).to.be.true;
    });
  });
});
