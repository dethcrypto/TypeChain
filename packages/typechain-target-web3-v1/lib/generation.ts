import {
  Contract,
  AbiParameter,
  FunctionDeclaration,
  EventDeclaration,
  AbiOutputParameter,
  EvmType,
  TupleType,
  EvmOutputType,
} from "typechain";
import { Dictionary } from "ts-essentials";
import { values } from "lodash";

export function codegen(contract: Contract) {
  const template = `
  import BN from "bn.js";
  import { Contract, ContractOptions } from "web3-eth-contract";
  import { EventLog } from "web3-core";
  import { EventEmitter } from "events";
  import { ContractEvent, Callback, TransactionObject, BlockType } from "./types";

  interface EventOptions {
    filter?: object;
    fromBlock?: BlockType;
    topics?: string[];
  }

  export class ${contract.name} extends Contract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions);
    clone(): ${contract.name};
    methods: {
      ${codegenForFunctions(contract.functions)}
    };
    events: {
      ${codegenForEvents(contract.events)}
      allEvents: (
          options?: EventOptions,
          cb?: Callback<EventLog>
      ) => EventEmitter;
    };
  }
  `;

  return template;
}

function codegenForFunctions(fns: Dictionary<FunctionDeclaration[]>): string {
  return values(fns)
    .map(v => v[0])
    .map(generateFunction)
    .join("\n");
}

function generateFunction(fn: FunctionDeclaration): string {
  return `
  ${fn.name}(${generateInputTypes(fn.inputs)}): TransactionObject<${generateOutputTypes(
    fn.outputs,
  )}>;
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
    return `{
      ${outputs.map(t => t.name && `${t.name}: ${generateOutputType(t.type)}, `).join("")}
      ${outputs.map((t, i) => `${i}: ${generateOutputType(t.type)}`).join(", ")}
      }`;
  }
}

function codegenForEvents(events: Dictionary<EventDeclaration[]>): string {
  return values(events)
    .map(e => e[0])
    .map(generateEvent)
    .join("\n");
}

function generateEvent(event: EventDeclaration) {
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
  }
}

function generateOutputType(evmType: EvmOutputType): string {
  switch (evmType.type) {
    case "integer":
      return "string";
    case "uinteger":
      return "string";
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
