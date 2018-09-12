import {
  Contract,
  AbiParameter,
  ConstantFunctionDeclaration,
  FunctionDeclaration,
  ConstantDeclaration,
} from "../../parser/abiParser";
import {
  EvmType,
  IntegerType,
  UnsignedIntegerType,
  AddressType,
  VoidType,
  BytesType,
  BooleanType,
  ArrayType,
  StringType,
} from "../../parser/typeParser";

export function codegen(contract: Contract) {
  const template = `
  import Contract, { CustomOptions, contractOptions } from "web3/eth/contract";
  import { TransactionObject, BlockType } from "web3/eth/types";
  import { Callback, EventLog } from "web3/types";
  import { EventEmitter } from "events";
  import { Provider } from "web3/providers";

  export class ${contract.name} {
    constructor(
        jsonInterface: any[],
        address?: string,
        options?: CustomOptions
    );
    options: contractOptions;
    methods: {
      ${contract.constantFunctions.map(generateFunction).join("\n")}
      ${contract.functions.map(generateFunction).join("\n")}
      ${contract.constants.map(generateConstants).join("\n")}
    };
    deploy(options: {
        data: string;
        arguments: any[];
    }): TransactionObject<Contract>;
    events: {
        [eventName: string]: (
            options?: {
                filter?: object;
                fromBlock?: BlockType;
                topics?: string[];
            },
            cb?: Callback<EventLog>
        ) => EventEmitter;
        allEvents: (
            options?: {
                filter?: object;
                fromBlock?: BlockType;
                topics?: string[];
            },
            cb?: Callback<EventLog>
        ) => EventEmitter;
    };
    getPastEvents(
        event: string,
        options?: {
            filter?: object;
            fromBlock?: BlockType;
            toBlock?: BlockType;
            topics?: string[];
        },
        cb?: Callback<EventLog[]>
    ): Promise<EventLog[]>;
    setProvider(provider: Provider): void;
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
  return `${fn.name}(): TransactionObject<${generateOutputTypes([fn.output])}>;`;
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
  if (outputs.length === 1) {
    return generateOutputType(outputs[0]);
  } else {
    return `{ ${outputs.map((t, i) => `${i}: ${generateOutputType(t)}`).join(", ")}}`;
  }
}

function generateInputType(evmType: EvmType): string {
  switch (evmType.constructor) {
    case IntegerType:
      return "number | string";
    case UnsignedIntegerType:
      return "number | string";
    case AddressType:
      return "string";
    case BytesType:
      return "string | number[]";
    case ArrayType:
      return `(${generateInputType((evmType as ArrayType).itemType)})[]`;
    case BooleanType:
      return "boolean";
    case StringType:
      return "string";

    default:
      throw new Error(`Unrecognized type ${evmType}`);
  }
}

function generateOutputType(evmType: EvmType): string {
  switch (evmType.constructor) {
    case IntegerType:
      return "string";
    case UnsignedIntegerType:
      return "string";
    case AddressType:
      return "string";
    case VoidType:
      return "void";
    case BytesType:
      return "string";
    case ArrayType:
      return `(${generateOutputType((evmType as ArrayType).itemType)})[]`;
    case BooleanType:
      return "boolean";
    case StringType:
      return "string";

    default:
      throw new Error(`Unrecognized type ${evmType}`);
  }
}
