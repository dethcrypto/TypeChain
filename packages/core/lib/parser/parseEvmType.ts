// represent all possible EvmTypes using TypeScript's discriminating union
export type EvmType =
  | BooleanType
  | IntegerType
  | UnsignedIntegerType
  | StringType
  | BytesType
  | DynamicBytesType
  | AddressType
  | ArrayType
  | TupleType;

/**
 * Like EvmType but with void
 */
export type EvmOutputType = EvmType | VoidType;

export type BooleanType = { type: "boolean" };
export type IntegerType = { type: "integer"; bits: number };
export type UnsignedIntegerType = { type: "uinteger"; bits: number };
export type StringType = { type: "string" };
export type BytesType = { type: "bytes"; size: number };
export type DynamicBytesType = { type: "dynamic-bytes" };
export type AddressType = { type: "address" };
export type ArrayType = { type: "array"; itemType: EvmType; size?: number };
export type TupleType = { type: "tuple"; components: EvmSymbol[] };

// used only for output types
export type VoidType = { type: "void" };

export type EvmSymbol = {
  type: EvmType;
  name: string;
};

const isUIntTypeRegex = /^uint([0-9]*)$/;
const isIntTypeRegex = /^int([0-9]*)$/;
const isBytesTypeRegex = /^bytes([0-9]+)$/;

export function parseEvmType(rawType: string, components?: EvmSymbol[]): EvmType {
  const lastChar = rawType[rawType.length - 1];

  // first we parse array type
  if (lastChar === "]") {
    let finishArrayTypeIndex = rawType.length - 2;
    while (rawType[finishArrayTypeIndex] !== "[") {
      finishArrayTypeIndex--;
    }

    const arraySizeRaw = rawType.slice(finishArrayTypeIndex + 1, rawType.length - 1);
    const arraySize = arraySizeRaw !== "" ? parseInt(arraySizeRaw) : undefined;

    const restOfTheType = rawType.slice(0, finishArrayTypeIndex);

    return { type: "array", itemType: parseEvmType(restOfTheType, components), size: arraySize };
  }

  // otherwise this has to be primitive type

  // deal with simple to parse types
  switch (rawType) {
    case "bool":
      return { type: "boolean" };
    case "address":
      return { type: "address" };
    case "string":
      return { type: "string" };
    case "byte":
      return { type: "bytes", size: 1 };
    case "bytes":
      return { type: "dynamic-bytes" };
    case "tuple":
      if (!components) throw new Error("Tuple specified without components!");
      return { type: "tuple", components };
  }

  if (isUIntTypeRegex.test(rawType)) {
    const match = isUIntTypeRegex.exec(rawType);
    return { type: "uinteger", bits: parseInt(match![1] || "256") };
  }

  if (isIntTypeRegex.test(rawType)) {
    const match = isIntTypeRegex.exec(rawType);
    return { type: "integer", bits: parseInt(match![1] || "256") };
  }

  if (isBytesTypeRegex.test(rawType)) {
    const match = isBytesTypeRegex.exec(rawType);
    return { type: "bytes", size: parseInt(match![1] || "1") };
  }

  throw new Error("Unknown type: " + rawType);
}
