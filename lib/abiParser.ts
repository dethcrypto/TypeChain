import debug from "./debug";
import { EvmType, VoidType, parseEvmType } from "./typeParser";
import chalk from "chalk";
import { MalformedAbiError } from "./errors";

const { yellow } = chalk;

export interface AbiParameter {
  name: string;
  type: EvmType;
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
  name: string; // @todo missing inputs,
  inputs: Array<AbiParameter>;
  outputs: Array<EvmType>; //we dont care about named returns for now
  payable: boolean;
}

export interface Contract {
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

export function parse(abi: Array<RawAbiDefinition>): Contract {
  const constants: Array<ConstantDeclaration> = [];
  const constantFunctions: Array<ConstantFunctionDeclaration> = [];
  const functions: Array<FunctionDeclaration> = [];
  const events: Array<EventDeclaration> = [];

  abi.forEach(abiPiece => {
    // @todo implement missing abi pieces
    // skip constructors for now
    if (abiPiece.type === "constructor") {
      return;
    }
    // skip fallback functions
    if (abiPiece.type === "fallback") {
      return;
    }

    if (abiPiece.type === "function") {
      if (checkForOverloads(constants, constantFunctions, functions, abiPiece.name)) {
        // tslint:disable-next-line
        console.log(yellow(`Detected overloaded constant function ${abiPiece.name} skipping...`));
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
        // tslint:disable-next-line
        console.log(yellow("Skipping anonymous event..."));
        return;
      }

      events.push(parseEvent(eventAbi));
      return;
    }

    throw new Error(`Unrecognized abi element: ${abiPiece.type}`);
  });

  return {
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
