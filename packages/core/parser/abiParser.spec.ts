import { expect } from "chai";

import { MalformedAbiError } from "../utils/errors";
import {
  ensure0xPrefix,
  extractAbi,
  extractBytecode,
  parseEvent,
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
  const resultBytecode = ensure0xPrefix(sampleBytecode);

  it("should return bytecode for bare bytecode string", () => {
    expect(extractBytecode(sampleBytecode)).to.eq(resultBytecode);
  });

  it("should return bytecode for bare bytecode with 0x prefix", () => {
    expect(extractBytecode(resultBytecode)).to.eq(resultBytecode);
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
    expect(extractBytecode(`{ "bytecode": "${sampleBytecode}" }`)).to.eq(resultBytecode);
  });

  it("should return bytecode from nested abi (ethers style)", () => {
    const inputJson = `{ "evm": { "bytecode": { "object": "${sampleBytecode}" }}}`;
    expect(extractBytecode(inputJson)).to.eq(resultBytecode);
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
