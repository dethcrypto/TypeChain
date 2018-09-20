import debug from "../utils/debug";
import { EvmType, VoidType, parseEvmType } from "./typeParser";
import { MalformedAbiError } from "../utils/errors";
import { logger } from "../utils/logger";

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
  outputs: Array<EvmType>; //we dont care about named returns for now
}

export interface FunctionDeclaration {
  name: string;
  inputs: Array<AbiParameter>;
  outputs: Array<EvmType>; //we dont care about named returns for now
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

function parseOutputs(outputs: Array<RawAbiParameter>): EvmType[] {
  if (outputs.length === 0) {
    return [new VoidType()];
  } else {
    return outputs.map(param => parseEvmType(param.type));
  }
}

function parseConstant(abiPiece: RawAbiDefinition): ConstantDeclaration {
  debug(`Parsing constant "${abiPiece.name}"`);
  return {
    name: abiPiece.name,
    output: parseEvmType(abiPiece.outputs[0].type),
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
    type: parseEvmType(eventArg.type),
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
    type: parseEvmType(rawAbiParameter.type),
  };
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
