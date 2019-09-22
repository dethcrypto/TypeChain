import {
  Contract,
  AbiParameter,
  ConstantFunctionDeclaration,
  FunctionDeclaration,
  ConstantDeclaration,
  EventDeclaration,
} from "../../parser/abiParser";
import { EvmType, TupleType } from "../../parser/parseEvmType";

export function codegen(contract: Contract) {
  const template = `
  import BN from "bn.js";
  import Contract, { contractOptions } from "web3/eth/contract";
  import { EventLog, Callback, EventEmitter } from "web3/types";
  import { TransactionObject, BlockType } from "web3/eth/types";
  import { ContractEvent } from "./types";

  interface EventOptions {
    filter?: object;
    fromBlock?: BlockType;
    topics?: string[];
  }

  export class ${contract.name} extends Contract {
    constructor(jsonInterface: any[], address?: string, options?: contractOptions);
    clone(): ${contract.name};
    methods: {
      ${contract.constantFunctions.map(generateFunction).join("\n")}
      ${contract.functions.map(generateFunction).join("\n")}
      ${contract.constants.map(generateConstants).join("\n")}
    };
    events: {
      ${contract.events.map(generateEvents).join("\n")}
      allEvents: (
          options?: EventOptions,
          cb?: Callback<EventLog>
      ) => EventEmitter;
    };
  }
  `;

  return template;
}

function generateFunction(fn: ConstantFunctionDeclaration | FunctionDeclaration): string {
  return `
  ${fn.name}(${generateInputTypes(fn.inputs)}): TransactionObject<${generateOutputTypes(
    fn.outputs,
  )}>;
`;
}

function generateConstants(fn: ConstantDeclaration): string {
  return `${fn.name}(): TransactionObject<${generateOutputType(fn.output)}>;`;
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
    return `{
      ${outputs.map(t => t.name && `${t.name}: ${generateOutputType(t.type)}, `).join("")}
      ${outputs.map((t, i) => `${i}: ${generateOutputType(t.type)}`).join(", ")}
      }`;
  }
}

function generateEvents(event: EventDeclaration) {
  return `${event.name}: ContractEvent<${generateOutputTypes(event.inputs)}>`;
}

function generateInputType(evmType: EvmType): string {
  switch (evmType.type) {
    case "integer":
    case "uinteger":
      return "number | string";
    case "address":
      return "string";
    case "bytes":
    case "dynamic-bytes":
      return "string | number[]";
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
      return "BN";
    case "uinteger":
      return "BN";
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
