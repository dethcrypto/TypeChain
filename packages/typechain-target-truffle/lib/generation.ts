import {
  Contract,
  AbiParameter,
  FunctionDeclaration,
  isConstant,
  isConstantFn,
  AbiOutputParameter,
  EvmType,
  TupleType,
  EvmOutputType,
} from "typechain";
import { values } from "lodash";

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
    c.constructor && c.constructor[0]
      ? `"new"(${generateInputTypes(
          c.constructor[0].inputs,
        )} meta?: Truffle.TransactionDetails): Promise<${c.name}Instance>;`
      : `"new"(meta?: Truffle.TransactionDetails): Promise<${c.name}Instance>;`
  }
}
`;
}

function generateContractInstanceInterface(c: Contract): string {
  return `
export interface ${c.name}Instance extends Truffle.ContractInstance {
  ${values(c.functions)
    .map(v => v[0])
    .map(generateFunction)
    .join("\n")}
}
  `;
}

function generateFunction(fn: FunctionDeclaration): string {
  if (isConstant(fn) || isConstantFn(fn)) {
    return generateConstantFunction(fn);
  }

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

function generateConstantFunction(fn: FunctionDeclaration): string {
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

function generateOutputTypes(outputs: Array<AbiOutputParameter>): string {
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
  }
}

function generateOutputType(evmType: EvmOutputType): string {
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
