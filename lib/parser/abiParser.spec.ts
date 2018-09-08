import { expect } from "chai";
import { extractAbi, RawEventAbiDefinition, parseEvent } from "./abiParser";
import { MalformedAbiError } from "../utils/errors";
import { AddressType, UnsignedIntegerType } from "./typeParser";

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
        { name: "_from", isIndexed: true, type: new AddressType() },
        { name: "_value", isIndexed: false, type: new UnsignedIntegerType(256) },
      ],
    });
  });
});
