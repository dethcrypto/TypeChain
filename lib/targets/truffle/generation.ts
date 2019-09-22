import {
  Contract,
  AbiParameter,
  ConstantFunctionDeclaration,
  FunctionDeclaration,
  ConstantDeclaration,
} from "../../parser/abiParser";
import { EvmType, TupleType } from "../../parser/parseEvmType";

export function codegen(contracts: Contract[]) {
  const template = `
/// <reference types="truffle-typings" />
import { BigNumber } from "bignumber.js";

${contracts.map(generateContractInterface).join("\n")}

${contracts.map(generateContractInstanceInterface).join("\n")}
  `;

  return template;
}

export function generateArtifactHeaders(contracts: Contract[]): string {
  return `
  /// <reference types="truffle-typings" />

  import * as TruffleContracts from ".";
  
  declare global {
    namespace Truffle {
      interface Artifacts {
        ${contracts
          .map(f => `require(name: "${f.name}"): TruffleContracts.${f.name}Contract;`)
          .join("\n")}
      }
    }
  }  
  `;
}

function generateContractInterface(c: Contract): string {
  return `
export interface ${c.name}Contract extends Truffle.Contract<${c.name}Instance> {
  ${
    c.constructor
      ? `"new"(${generateInputTypes(
          c.constructor.inputs,
        )} meta?: Truffle.TransactionDetails): Promise<${c.name}Instance>;`
      : `"new"(meta?: Truffle.TransactionDetails): Promise<${c.name}Instance>;`
  }
}
`;
}

function generateContractInstanceInterface(c: Contract): string {
  return `
export interface ${c.name}Instance extends Truffle.ContractInstance {
  ${c.constantFunctions.map(generateConstantFunction).join("\n")}
  ${c.functions.map(generateFunction).join("\n")}
  ${c.constants.map(generateConstants).join("\n")}
}
  `;
}

function generateFunction(fn: ConstantFunctionDeclaration | FunctionDeclaration): string {
  return `
  ${fn.name}: {
    (${generateInputTypes(
      fn.inputs,
    )} txDetails?: Truffle.TransactionDetails): Promise<Truffle.TransactionResponse>;
  call(${generateInputTypes(
    fn.inputs,
  )} txDetails?: Truffle.TransactionDetails): Promise<${generateOutputTypes(fn.outputs)}>;
  sendTransaction(${generateInputTypes(
    fn.inputs,
  )} txDetails?: Truffle.TransactionDetails): Promise<string>;
  estimateGas(${generateInputTypes(
    fn.inputs,
  )} txDetails?: Truffle.TransactionDetails): Promise<number>;
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

function generateConstants(fn: ConstantDeclaration): string {
  return `${fn.name}(txDetails?: Truffle.TransactionDetails): Promise<${generateOutputType(
    fn.output,
  )}>;`;
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

function generateOutputTypes(outputs: Array<AbiParameter>): string {
  if (outputs.length === 1) {
    return generateOutputType(outputs[0].type);
  } else {
    return `[${outputs.map(param => generateOutputType(param.type)).join(", ")}]`;
  }
}

function generateInputType(evmType: EvmType): string {
  switch (evmType.type) {
    case "integer":
      return "number | BigNumber | string";
    case "uinteger":
      return "number | BigNumber | string";
    case "address":
      return "string | BigNumber";
    case "bytes":
      return "string | BigNumber";
    case "dynamic-bytes":
      return "string";
    case "array":
      return `(${generateInputType(evmType.itemType)})[]`;
    case "boolean":
      return "boolean";
    case "string":
      return "string";
    case "tuple":
      return generateTupleType(evmType, generateInputType);

    default:
      throw new Error(`Unrecognized type ${evmType}`);
  }
}

function generateOutputType(evmType: EvmType): string {
  switch (evmType.type) {
    case "integer":
      return "BigNumber";
    case "uinteger":
      return "BigNumber";
    case "address":
      return "string";
    case "void":
      return "void";
    case "bytes":
    case "dynamic-bytes":
      return "string";
    case "array":
      return `(${generateOutputType(evmType.itemType)})[]`;
    case "boolean":
      return "boolean";
    case "string":
      return "string";
    case "tuple":
      return generateTupleType(evmType, generateOutputType);

    default:
      throw new Error(`Unrecognized type ${evmType}`);
  }
}

function generateTupleType(tuple: TupleType, generator: (evmType: EvmType) => string) {
  return (
    "{" +
    tuple.components
      .map(component => `${component.name}: ${generator(component.type)}`)
      .join(", ") +
    "}"
  );
}
