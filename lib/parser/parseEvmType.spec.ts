import { expect } from "chai";
import {
  parseEvmType,
  UnsignedIntegerType,
  IntegerType,
  BooleanType,
  ArrayType,
  BytesType,
} from "./typeParser";

describe("parseEvmType function", () => {
  it("should parse unsigned integer", () => {
    const parsedType = parseEvmType("uint8");

    expect(parsedType).to.be.instanceOf(UnsignedIntegerType);
    expect((parsedType as UnsignedIntegerType).bits).to.be.eq(8);
  });

  it("should parse signed integer", () => {
    const parsedType = parseEvmType("int");

    expect(parsedType).to.be.instanceOf(IntegerType);
    expect((parsedType as IntegerType).bits).to.be.eq(256);
  });

  it("should parse boolean", () => {
    const parsedType = parseEvmType("bool");

    expect(parsedType).to.be.instanceOf(BooleanType);
  });

  it("should parse bytes2", () => {
    const parsedType = parseEvmType("bytes2");

    expect(parsedType).to.be.instanceOf(BytesType);
    expect((parsedType as BytesType).size).to.be.eq(2);
  });

  it("should parse arrays", () => {
    const parsedType = parseEvmType("uint[]");

    expect(parsedType).to.be.instanceOf(ArrayType);
    expect((parsedType as ArrayType).itemType).to.be.instanceOf(UnsignedIntegerType);
  });

  it("should parse fixed size arrays", () => {
    const parsedType = parseEvmType("uint[8]");

    expect(parsedType).to.be.instanceOf(ArrayType);
    expect((parsedType as ArrayType).itemType).to.be.instanceOf(UnsignedIntegerType);
    expect((parsedType as ArrayType).size).to.be.eq(8);
  });

  it("should parse nested arrays", () => {
    const parsedType = parseEvmType("uint16[8][256]");

    expect(parsedType).to.be.instanceOf(ArrayType);
    expect((parsedType as ArrayType).itemType).to.be.instanceOf(ArrayType);
    expect((parsedType as ArrayType).size).to.be.eq(256);
    expect(((parsedType as ArrayType).itemType as ArrayType).itemType).to.be.instanceOf(
      UnsignedIntegerType,
    );
    expect(((parsedType as ArrayType).itemType as ArrayType).size).to.be.eq(8);
    expect(
      (((parsedType as ArrayType).itemType as ArrayType).itemType as UnsignedIntegerType).bits,
    ).to.be.eq(16);
  });
});
