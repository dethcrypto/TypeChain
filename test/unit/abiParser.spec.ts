import { expect } from "chai";
import { extractAbi } from "../../lib/abiParser";
import { MalformedAbiError } from "../../lib/errors";

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

  it ("should work with nested abi (truffle style", () => {
    const inputJson = `{ "abi": [{ "name": "piece" }] }`;
    expect(extractAbi(inputJson)).to.be.deep.eq([{ name: "piece" }]);
  })
});
