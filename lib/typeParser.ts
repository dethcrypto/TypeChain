export abstract class EvmType {
  abstract generateCode(): string;
}

export class BooleanType extends EvmType {
  generateCode() {
    return "boolean";
  }
}

export class IntegerType extends EvmType {
  constructor(public readonly bits: number) {
    super();
  }

  generateCode(): string {
    return "BigNumber";
  }
}

export class UnsignedIntegerType extends EvmType {
  constructor(public readonly bits: number) {
    super();
  }

  generateCode(): string {
    return "BigNumber";
  }
}

export class VoidType extends EvmType {
  generateCode(): string {
    return "void";
  }
}

export class AddressType extends EvmType {
  generateCode(): string {
    return "BigNumber";
  }
}

export class ArrayType extends EvmType {
  constructor(public readonly itemType: EvmType, public readonly size?: number) {
    super();
  }

  generateCode(): string {
    return this.itemType.generateCode() + "[]";
  }
}

const isUIntTypeRegex = /^uint([0-9]*)$/;
const isIntTypeRegex = /^int([0-9]*)$/;

export function parseEvmType(rawType: string): EvmType {
  const lastChar = rawType[rawType.length - 1];

  if (lastChar === "]") {
    // we parse array type
    let finishArrayTypeIndex = rawType.length - 2;
    while (rawType[finishArrayTypeIndex] !== "[") {
      finishArrayTypeIndex--;
    }

    const arraySizeRaw = rawType.slice(finishArrayTypeIndex + 1, rawType.length - 1)
    const arraySize = arraySizeRaw !== "" ? parseInt(arraySizeRaw) : undefined;

    const restOfTheType = rawType.slice(0, finishArrayTypeIndex);

    return new ArrayType(parseEvmType(restOfTheType), arraySize);
  }

  // this has to be primitive type

  //first deal with simple types
  switch (rawType) {
    case "bool":
      return new BooleanType();
    case "address":
      return new AddressType();
  }

  if (isUIntTypeRegex.test(rawType)) {
    const match = isUIntTypeRegex.exec(rawType);
    return new UnsignedIntegerType(parseInt(match![1] || "256"));
  }

  if (isIntTypeRegex.test(rawType)) {
    const match = isIntTypeRegex.exec(rawType);
    return new IntegerType(parseInt(match![1] || "256"));
  }

  throw new Error("Unknown type: " + rawType);
}
