import { Contract, AbiParameter, ConstantFunctionDeclaration } from "../../parser/abiParser";
import { EvmType, IntegerType, UnsignedIntegerType, AddressType } from "../../parser/typeParser";

export function codegen(contracts: Contract[]) {
  const template = `
/// <reference types="truffle-typings" />

interface Artifacts {
  ${generateArtifactHeaders(contracts)}
  require<T = any>(name: string): T;
}

${contracts.map(generateContractInterface).join("\n")}

${contracts.map(generateContractInstanceInterface).join("\n")}

declare var artifacts: Artifacts;
  `;

  return template;
}

function generateArtifactHeaders(contracts: Contract[]): string {
  return contracts.map(f => `require(name: "${f.name}"): ${f.name}Contract;`).join("\n");
}

function generateContractInterface(c: Contract): string {
  return `
declare interface ${c.name}Contract extends Truffle.Contract<${c.name}Instance> {
  ${
    c.constructor
      ? `"new"(${generateInputTypes(
          c.constructor.inputs,
        )} meta?: Truffle.TransactionDetails): Promise<${c.name}Instance>;`
      : ""
  }
}
`;
}

function generateContractInstanceInterface(c: Contract): string {
  return `
declare interface ${c.name}Instance {
  // constant functions
  ${c.constantFunctions.map(generateConstantFunction).join("\n")}
}
  `;
}

function generateConstantFunction(fn: ConstantFunctionDeclaration): string {
  return `
  ${fn.name}(${generateInputTypes(
    fn.inputs,
  )} txDetails?: Truffle.TransactionDetails): Promise<${generateOutputTypes(fn.outputs)}>;
`;
}

function generateInputTypes(input: Array<AbiParameter>): string {
  if (input.length === 0) {
    return "";
  }
  return (
    input
      .map((input, index) => `${input.name || `arg${index}`}: ${generateInputType(input.type)}`)
      .join(", ") + ", "
  );
}

function generateOutputTypes(outputs: Array<EvmType>): string {
  return outputs.map(generateOutputType).join(" | ");
}

function generateInputType(evmType: EvmType): string {
  switch (evmType.constructor) {
    case IntegerType:
      return "number";
    case UnsignedIntegerType:
      return "number";
    case AddressType:
      return "string";

    default:
      throw new Error(`Unrecognized type ${evmType}`);
  }
}

function generateOutputType(evmType: EvmType): string {
  switch (evmType.constructor) {
    case IntegerType:
      return "number";
    case UnsignedIntegerType:
      return "number";
    case AddressType:
      return "string";

    default:
      throw new Error(`Unrecognized type ${evmType}`);
  }
}
