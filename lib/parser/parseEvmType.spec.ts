import { expect } from "chai";
import {
  parseEvmType,
  UnsignedIntegerType,
  IntegerType,
  ArrayType,
  BytesType,
} from "./parseEvmType";

describe("parseEvmType function", () => {
  it("should parse unsigned integer", () => {
    const parsedType = parseEvmType("uint8");

    expect(parsedType.type).to.be.eq("uinteger");
    expect((parsedType as UnsignedIntegerType).bits).to.be.eq(8);
  });

  it("should parse signed integer", () => {
    const parsedType = parseEvmType("int");

    expect(parsedType.type).to.be.eq("integer");
    expect((parsedType as IntegerType).bits).to.be.eq(256);
  });

  it("should parse boolean", () => {
    const parsedType = parseEvmType("bool");

    expect(parsedType.type).to.be.eq("boolean");
  });

  it("should parse bytes2", () => {
    const parsedType = parseEvmType("bytes2");

    expect(parsedType.type).to.be.eq("bytes");
    expect((parsedType as BytesType).size).to.be.eq(2);
  });

  it("should parse bytes", () => {
    const parsedType = parseEvmType("bytes");

    expect(parsedType.type).to.be.eq("dynamic-bytes");
  });

  it("should parse arrays", () => {
    const parsedType = parseEvmType("uint[]");

    expect(parsedType.type).to.be.eq("array");
    expect((parsedType as ArrayType).itemType.type).to.be.eq("uinteger");
  });

  it("should parse fixed size arrays", () => {
    const parsedType = parseEvmType("uint[8]");

    expect(parsedType.type).to.be.eq("array");
    expect((parsedType as ArrayType).itemType.type).to.be.eq("uinteger");
    expect((parsedType as ArrayType).size).to.be.eq(8);
  });

  it("should parse nested arrays", () => {
    const parsedType = parseEvmType("uint16[8][256]");

    expect(parsedType.type).to.be.eq("array");
    expect((parsedType as ArrayType).itemType.type).to.be.eq("array");
    expect((parsedType as ArrayType).size).to.be.eq(256);
    expect(((parsedType as ArrayType).itemType as ArrayType).itemType.type).to.be.eq("uinteger");
    expect(((parsedType as ArrayType).itemType as ArrayType).size).to.be.eq(8);
    expect(
      (((parsedType as ArrayType).itemType as ArrayType).itemType as UnsignedIntegerType).bits,
    ).to.be.eq(16);
  });
});
