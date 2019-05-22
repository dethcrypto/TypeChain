import {
  Contract,
  AbiParameter,
  ConstantFunctionDeclaration,
  FunctionDeclaration,
  ConstantDeclaration,
  EventDeclaration,
  EventArgDeclaration,
} from "../../parser/abiParser";
import {
  EvmType,
  IntegerType,
  UnsignedIntegerType,
  AddressType,
  VoidType,
  BytesType,
  DynamicBytesType,
  BooleanType,
  ArrayType,
  StringType,
  TupleType,
} from "../../parser/typeParser";

export function codegen(contract: Contract) {
  const template = `
  import { Contract, ContractTransaction, EventFilter } from 'ethers';
  import { Provider } from 'ethers/providers';
  import { BigNumber } from "ethers/utils";
  import { TransactionOverrides } from ".";

  export class ${contract.name} extends Contract {
    functions: {
      ${contract.constantFunctions.map(generateConstantFunction).join("\n")}
      ${contract.functions.map(generateFunction).join("\n")}
      ${contract.constants.map(generateConstant).join("\n")}
    };
    filters: {
      ${contract.events.map(generateEvents).join("\n")}
    }
}
  `;

  return template;
}

function generateConstantFunction(fn: ConstantFunctionDeclaration): string {
  return `
  ${fn.name}(${generateInputTypes(fn.inputs)}): Promise<${generateOutputTypes(fn.outputs)}>;
`;
}

function generateFunction(fn: FunctionDeclaration): string {
  return `
  ${fn.name}(${generateInputTypes(
    fn.inputs,
  )}overrides?: TransactionOverrides): Promise<ContractTransaction>;
`;
}

function generateConstant(fn: ConstantDeclaration): string {
  return `${fn.name}(): Promise<${generateOutputType(fn.output)}>;`;
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
  return `
  ${event.name}(${generateEventTypes(event.inputs)}): EventFilter;
`;
}

function generateEventTypes(eventArg: EventArgDeclaration[]) {
  if (eventArg.length === 0) {
    return "";
  }
  return (
    eventArg
      .map(arg => {
        const eventType = arg.isIndexed ? `${generateInputType(arg.type)} | null` : "null";
        return `${arg.name}: ${eventType}`;
      })
      .join(", ") + ", "
  );
}

function generateInputType(evmType: EvmType): string {
  switch (evmType.constructor) {
    case IntegerType:
      return "number | string | BigNumber";
    case UnsignedIntegerType:
      return "number | string | BigNumber";
    case AddressType:
      return "string";
    case BytesType:
    case DynamicBytesType:
      return "string";
    case ArrayType:
      return `(${generateInputType((evmType as ArrayType).itemType)})[]`;
    case BooleanType:
      return "boolean";
    case StringType:
      return "string";
    case TupleType:
      return generateTupleType(evmType as TupleType, generateInputType);

    default:
      throw new Error(`Unrecognized type ${evmType}`);
  }
}

function generateOutputType(evmType: EvmType): string {
  switch (evmType.constructor) {
    case IntegerType:
      return (evmType as IntegerType).bits <= 48 ? "number" : "BigNumber";
    case UnsignedIntegerType:
      return (evmType as UnsignedIntegerType).bits <= 48 ? "number" : "BigNumber";
    case AddressType:
      return "string";
    case VoidType:
      return "void";
    case BytesType:
    case DynamicBytesType:
      return "string";
    case ArrayType:
      return `(${generateOutputType((evmType as ArrayType).itemType)})[]`;
    case BooleanType:
      return "boolean";
    case StringType:
      return "string";
    case TupleType:
      return "object[]";

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
