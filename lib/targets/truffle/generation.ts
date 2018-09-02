import { Contract, AbiParameter, ConstantFunctionDeclaration } from "../../parser/abiParser";
import { EvmType, IntegerType, UnsignedIntegerType, AddressType } from "../../parser/typeParser";

export function codegen(contracts: Contract[]) {
  const template = `
/// <reference types="truffle-typings" />

interface Artifacts {
  ${generateArtifactHeaders(contracts)}
}

${contracts.map(generateContractInterface)}

${contracts.map(generateContractInstanceInterface)}

declare var artifacts: Artifacts;
  `;

  return template;
}

function generateArtifactHeaders(contracts: Contract[]): string {
  return contracts.map(f => `require(name: "${f.name}"): ${f.name}Contract;`).join("\n");
}

function generateContractInterface(c: Contract): string {
  return `
declare interface ${c.name}Contract extends Truffle.Contract<${c.name}ContractInstance> {
  "new"(${generateInputTypes(c.constructor.inputs)}, meta?: Truffle.TransactionDetails): ${
    c.name
  }ContractInstance;
}
`;
}

function generateContractInstanceInterface(c: Contract): string {
  return `
declare interface GreeterContractInstance {
  // constant functions
  ${c.constantFunctions.map(generateConstantFunction)}
}
  `;
}

function generateConstantFunction(fn: ConstantFunctionDeclaration): string {
  return `
  ${fn.name}(${generateInputTypes(
    fn.inputs,
  )}, txDetails?: Truffle.TransactionDetails): Promise<${generateOutputTypes(fn.outputs)}>;
`;
}

function generateInputTypes(input: Array<AbiParameter>): string {
  return input.map(i => generateInputType(i.type)).join(", ");
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
