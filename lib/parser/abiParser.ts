import debug from "../utils/debug";
import { MalformedAbiError } from "../utils/errors";
import { logger } from "../utils/logger";
import { EvmType, EvmTypeComponent, parseEvmType, VoidType } from "./typeParser";

export interface AbiParameter {
  name: string;
  type: EvmType;
}

export interface Constructor {
  inputs: Array<AbiParameter>;
  payable: boolean;
}

export interface ConstantDeclaration {
  name: string;
  output: EvmType;
}

export interface ConstantFunctionDeclaration {
  name: string;
  inputs: Array<AbiParameter>;
  outputs: Array<AbiParameter>; //we dont care about named returns for now
}

export interface FunctionDeclaration {
  name: string;
  inputs: Array<AbiParameter>;
  outputs: Array<AbiParameter>; //we dont care about named returns for now
  payable: boolean;
}

export interface Contract {
  name: string;

  constructor: Constructor; // possible bug: this should be probably an array (overloaded constructors)

  constants: Array<ConstantDeclaration>;

  constantFunctions: Array<ConstantFunctionDeclaration>;

  functions: Array<FunctionDeclaration>;

  events: Array<EventDeclaration>;
}

export interface RawAbiParameter {
  name: string;
  type: string;
  components?: RawAbiParameter[];
}

export interface RawAbiDefinition {
  name: string;
  constant: boolean;
  payable: boolean;
  inputs: RawAbiParameter[];
  outputs: RawAbiParameter[];
  type: string;
}

export interface EventDeclaration {
  name: string;
  inputs: EventArgDeclaration[];
}

export interface EventArgDeclaration {
  isIndexed: boolean;
  name: string;
  type: EvmType;
}

export interface RawEventAbiDefinition {
  type: "event";
  anonymous: boolean;
  name: string;
  inputs: RawEventArgAbiDefinition[];
}

export interface RawEventArgAbiDefinition {
  indexed: boolean;
  name: string;
  type: string;
}

export function parse(abi: Array<RawAbiDefinition>, name: string): Contract {
  const constants: Array<ConstantDeclaration> = [];
  const constantFunctions: Array<ConstantFunctionDeclaration> = [];
  const functions: Array<FunctionDeclaration> = [];
  const events: Array<EventDeclaration> = [];
  let constructor: Constructor | undefined = undefined;

  abi.forEach(abiPiece => {
    // @todo implement missing abi pieces
    // skip fallback functions
    if (abiPiece.type === "fallback") {
      return;
    }

    if (abiPiece.type === "constructor") {
      constructor = parseConstructor(abiPiece);
      return;
    }

    if (abiPiece.type === "function") {
      if (checkForOverloads(constants, constantFunctions, functions, abiPiece.name)) {
        logger.log(`Detected overloaded constant function ${abiPiece.name} skipping...`);
        return;
      }

      if (abiPiece.constant && abiPiece.inputs.length === 0 && abiPiece.outputs.length === 1) {
        constants.push(parseConstant(abiPiece));
      } else if (abiPiece.constant) {
        constantFunctions.push(parseConstantFunction(abiPiece));
      } else {
        functions.push(parseFunctionDeclaration(abiPiece));
      }
      return;
    }

    if (abiPiece.type === "event") {
      const eventAbi = (abiPiece as any) as RawEventAbiDefinition;
      if (eventAbi.anonymous) {
        logger.log("Skipping anonymous event...");
        return;
      }

      events.push(parseEvent(eventAbi));
      return;
    }

    throw new Error(`Unrecognized abi element: ${abiPiece.type}`);
  });

  return {
    name,
    constructor: constructor!,
    constants,
    constantFunctions,
    functions,
    events,
  };
}

function checkForOverloads(
  constants: Array<ConstantDeclaration>,
  constantFunctions: Array<ConstantFunctionDeclaration>,
  functions: Array<FunctionDeclaration>,
  name: string,
) {
  return (
    constantFunctions.find(f => f.name === name) ||
    constants.find(f => f.name === name) ||
    functions.find(f => f.name === name)
  );
}

function parseOutputs(outputs: Array<RawAbiParameter>): AbiParameter[] {
  if (outputs.length === 0) {
    return [{ name: "", type: new VoidType() }];
  } else {
    return outputs.map(parseRawAbiParameter);
  }
}

function parseConstant(abiPiece: RawAbiDefinition): ConstantDeclaration {
  debug(`Parsing constant "${abiPiece.name}"`);
  return {
    name: abiPiece.name,
    output: parseRawAbiParameterType(abiPiece.outputs[0]),
  };
}

export function parseEvent(abiPiece: RawEventAbiDefinition): EventDeclaration {
  debug(`Parsing event "${abiPiece.name}"`);

  return {
    name: abiPiece.name,
    inputs: abiPiece.inputs.map(parseRawEventArg),
  };
}

function parseRawEventArg(eventArg: RawEventArgAbiDefinition): EventArgDeclaration {
  return {
    name: eventArg.name,
    isIndexed: eventArg.indexed,
    type: parseRawAbiParameterType(eventArg),
  };
}

function parseConstantFunction(abiPiece: RawAbiDefinition): ConstantFunctionDeclaration {
  debug(`Parsing constant function "${abiPiece.name}"`);
  return {
    name: abiPiece.name,
    inputs: abiPiece.inputs.map(parseRawAbiParameter),
    outputs: parseOutputs(abiPiece.outputs),
  };
}

function parseConstructor(abiPiece: RawAbiDefinition): Constructor {
  debug(`Parsing constructor declaration`);
  return {
    inputs: abiPiece.inputs.map(parseRawAbiParameter),
    payable: abiPiece.payable,
  };
}

function parseFunctionDeclaration(abiPiece: RawAbiDefinition): FunctionDeclaration {
  debug(`Parsing function declaration "${abiPiece.name}"`);
  return {
    name: abiPiece.name,
    inputs: abiPiece.inputs.map(parseRawAbiParameter),
    outputs: parseOutputs(abiPiece.outputs),
    payable: abiPiece.payable,
  };
}

function parseRawAbiParameter(rawAbiParameter: RawAbiParameter): AbiParameter {
  return {
    name: rawAbiParameter.name,
    type: parseRawAbiParameterType(rawAbiParameter),
  };
}

function parseRawAbiParameterType(rawAbiParameter: RawAbiParameter): EvmType {
  const components =
    rawAbiParameter.components &&
    rawAbiParameter.components.map(
      component => new EvmTypeComponent(component.name, parseRawAbiParameterType(component)),
    );
  return parseEvmType(rawAbiParameter.type, components);
}

export function extractAbi(rawJson: string): RawAbiDefinition[] {
  let json;
  try {
    json = JSON.parse(rawJson);
  } catch {
    throw new MalformedAbiError("Not a json");
  }

  if (!json) {
    throw new MalformedAbiError("Not a json");
  }

  if (Array.isArray(json)) {
    return json;
  }

  if (Array.isArray(json.abi)) {
    return json.abi;
  }

  throw new MalformedAbiError("Not a valid ABI");
}

export function extractBytecode(rawContents: string): string | undefined {
  const bytecodeRegex = /^(0x)?([0-9a-fA-F][0-9a-fA-F])+$/;
  // First try to see if this is a .bin file with just the bytecode, otherwise a json
  if (rawContents.match(bytecodeRegex)) return ensure0xPrefix(rawContents);

  let json;
  try {
    json = JSON.parse(rawContents);
  } catch {
    return undefined;
  }

  if (!json) return undefined;

  if (json.bytecode && json.bytecode.match(bytecodeRegex)) {
    return ensure0xPrefix(json.bytecode);
  }

  if (
    json.evm &&
    json.evm.bytecode &&
    json.evm.bytecode.object &&
    json.evm.bytecode.object.match(bytecodeRegex)
  ) {
    return ensure0xPrefix(json.evm.bytecode.object);
  }

  return undefined;
}

export function ensure0xPrefix(hexString: string): string {
  if (hexString.startsWith("0x")) return hexString;
  return "0x" + hexString;
}
