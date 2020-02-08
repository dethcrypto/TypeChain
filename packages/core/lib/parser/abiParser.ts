import { keccak_256 } from "js-sha3";
import { groupBy } from "lodash";
import { Dictionary } from "ts-essentials";

import debug from "../utils/debug";
import { MalformedAbiError } from "../utils/errors";
import { EvmOutputType, EvmType, parseEvmType } from "./parseEvmType";

export interface AbiParameter {
  name: string;
  type: EvmType;
}

export interface AbiOutputParameter {
  name: string;
  type: EvmOutputType;
}

export type Named<T> = {
  name: string;
  values: T;
};

export type StateMutability = "pure" | "view" | "nonpayable" | "payable";

export interface FunctionDeclaration {
  name: string;
  stateMutability: StateMutability;
  inputs: AbiParameter[];
  outputs: AbiOutputParameter[];
}

export interface FunctionWithoutOutputDeclaration extends FunctionDeclaration {
  outputs: [];
}

export interface FunctionWithoutInputDeclaration extends FunctionDeclaration {
  inputs: [];
}

export interface Contract {
  name: string;

  fallback?: FunctionWithoutInputDeclaration;
  constructor: FunctionWithoutOutputDeclaration[];
  functions: Dictionary<FunctionDeclaration[]>;
  events: Dictionary<EventDeclaration[]>;
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
  stateMutability?: StateMutability; // for older ABIs this will be undefined
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

export interface BytecodeLinkReference {
  reference: string;
  name?: string;
}

export interface BytecodeWithLinkReferences {
  bytecode: string;
  linkReferences?: BytecodeLinkReference[];
}

export function parse(abi: Array<RawAbiDefinition>, name: string): Contract {
  const constructors: FunctionWithoutOutputDeclaration[] = [];
  let fallback: FunctionWithoutInputDeclaration | undefined;
  const functions: FunctionDeclaration[] = [];
  const events: EventDeclaration[] = [];

  abi.forEach(abiPiece => {
    if (abiPiece.type === "fallback") {
      if (fallback) {
        throw new Error(
          `Fallback function can't be defined more than once! ${JSON.stringify(
            abiPiece,
          )} Previously defined: ${JSON.stringify(fallback)}`,
        );
      }
      fallback = parseFallback(abiPiece);
      return;
    }

    if (abiPiece.type === "constructor") {
      constructors.push(parseConstructor(abiPiece));
      return;
    }

    if (abiPiece.type === "function") {
      functions.push(parseFunctionDeclaration(abiPiece));
      return;
    }

    if (abiPiece.type === "event") {
      const eventAbi = (abiPiece as any) as RawEventAbiDefinition;
      if (eventAbi.anonymous) {
        debug(`Skipping anonymous event... ${JSON.stringify(eventAbi)}`);
        return;
      }

      events.push(parseEvent(eventAbi));
      return;
    }

    debug(`Unrecognized abi element: ${abiPiece.type}`);
  });

  return {
    name,
    fallback,
    constructor: constructors,
    functions: groupBy(functions, f => f.name),
    events: groupBy(events, e => e.name),
  };
}

function parseOutputs(outputs: Array<RawAbiParameter>): AbiOutputParameter[] {
  if (!outputs || outputs.length === 0) {
    return [{ name: "", type: { type: "void" } }];
  } else {
    return outputs.map(parseRawAbiParameter);
  }
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

// if stateMutability is not available we will use old spec containing constant and payable
function findStateMutability(abiPiece: RawAbiDefinition): StateMutability {
  if (abiPiece.stateMutability) {
    return abiPiece.stateMutability;
  }

  if (abiPiece.constant) {
    return "view";
  }
  return abiPiece.payable ? "payable" : "nonpayable";
}

function parseConstructor(abiPiece: RawAbiDefinition): FunctionWithoutOutputDeclaration {
  debug(`Parsing constructor declaration`);
  return {
    name: "constructor",
    inputs: abiPiece.inputs.map(parseRawAbiParameter),
    outputs: [],
    stateMutability: findStateMutability(abiPiece),
  };
}

function parseFallback(abiPiece: RawAbiDefinition): FunctionWithoutInputDeclaration {
  debug(`Parsing fallback declaration`);

  return {
    name: "fallback",
    inputs: [],
    outputs: parseOutputs(abiPiece.outputs),
    stateMutability: findStateMutability(abiPiece),
  };
}

function parseFunctionDeclaration(abiPiece: RawAbiDefinition): FunctionDeclaration {
  debug(`Parsing function declaration "${abiPiece.name}"`);
  return {
    name: abiPiece.name,
    inputs: abiPiece.inputs.map(parseRawAbiParameter),
    outputs: parseOutputs(abiPiece.outputs),
    stateMutability: findStateMutability(abiPiece),
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
    rawAbiParameter.components.map(component => ({
      name: component.name,
      type: parseRawAbiParameterType(component),
    }));
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
  } else if (json.compilerOutput && Array.isArray(json.compilerOutput.abi)) {
    return json.compilerOutput.abi;
  }

  throw new MalformedAbiError("Not a valid ABI");
}

export function extractBytecode(rawContents: string): BytecodeWithLinkReferences | undefined {
  // When there are some unlinked libraries, the compiler replaces their addresses in calls with
  // "link references". There are many different kinds of those, depending on compiler version and usage.
  // Examples:
  // * `__TestLibrary___________________________`
  //   (truffle with solc 0.4.x?, just the contract name)
  // * `__./ContractWithLibrary.sol:TestLibrar__`
  //   (solc 0.4.x, `${fileName}:${contractName}` truncated at 36 chars)
  // * `__$8809803722eff063c8527a84f57d60014e$__`
  //   (solc 0.5.x, ``solidityKeccak256(['string'], [`${fileName}:${contractName}`])``, truncated )
  const bytecodeRegex = /^(0x)?(([0-9a-fA-F][0-9a-fA-F])|(__[a-zA-Z0-9\/\\:_$.-]{36}__))+$/;
  // First try to see if this is a .bin file with just the bytecode, otherwise a json
  if (rawContents.match(bytecodeRegex)) return extractLinkReferences(rawContents);

  let json;
  try {
    json = JSON.parse(rawContents);
  } catch {
    return undefined;
  }

  if (!json) return undefined;

  // `json.evm.bytecode` often has more information than `json.bytecode`, needs to be checked first
  if (
    json.evm &&
    json.evm.bytecode &&
    json.evm.bytecode.object &&
    json.evm.bytecode.object.match(bytecodeRegex)
  ) {
    return extractLinkReferences(json.evm.bytecode.object, json.evm.bytecode.linkReferences);
  }

  // handle json schema of @0x/sol-compiler
  if (
    json.compilerOutput &&
    json.compilerOutput.evm &&
    json.compilerOutput.evm.bytecode &&
    json.compilerOutput.evm.bytecode.object &&
    json.compilerOutput.evm.bytecode.object.match(bytecodeRegex)
  ) {
    return extractLinkReferences(
      json.compilerOutput.evm.bytecode.object,
      json.compilerOutput.evm.bytecode.linkReferences,
    );
  }

  if (json.bytecode && json.bytecode.match(bytecodeRegex)) {
    return extractLinkReferences(json.bytecode);
  }

  return undefined;
}

function extractLinkReferences(
  _bytecode: string,
  linkReferencesObj?: any,
): BytecodeWithLinkReferences {
  const bytecode = ensure0xPrefix(_bytecode);
  // See comment in `extractBytecode` for explanation.
  const allLinkReferencesRegex = /__[a-zA-Z0-9\/\\:_$.-]{36}__/g;
  const allReferences = bytecode.match(allLinkReferencesRegex);
  if (!allReferences) return { bytecode };

  const uniqueReferences = Array.from(new Set(allReferences));
  const refToNameMap = linkReferencesObj
    ? extractLinkReferenceContractNames(linkReferencesObj)
    : {};
  const linkReferences = uniqueReferences.map(reference =>
    refToNameMap[reference] ? { reference, name: refToNameMap[reference] } : { reference },
  );

  return { bytecode, linkReferences };
}

// Returns mapping from link reference (bytecode fake address) to readable contract name
function extractLinkReferenceContractNames(linkReferences: any): Dictionary<string> {
  // `evm.bytecode.linkReferences` example:
  // {
  //   "ContractWithLibrary.sol": {
  //     "TestLibrary": [
  //       { "length": 20, "start": 151 },
  //       { "length": 20, "start": 177 },
  //     ],
  //   },
  // },
  const nameMap: Dictionary<string> = {};
  Object.keys(linkReferences).forEach(contractFile =>
    Object.keys(linkReferences[contractFile]).forEach(contractName => {
      const contractPath = `${contractFile}:${contractName}`;
      const contractRef = `__$${keccak_256(contractPath).slice(0, 34)}$__`;
      nameMap[contractRef] = contractPath;
    }),
  );
  return nameMap;
}

export function ensure0xPrefix(hexString: string): string {
  if (hexString.startsWith("0x")) return hexString;
  return "0x" + hexString;
}

export function isConstant(fn: FunctionDeclaration): boolean {
  return (
    (fn.stateMutability === "pure" || fn.stateMutability === "view") &&
    fn.inputs.length === 0 &&
    fn.outputs.length === 1
  );
}

export function isConstantFn(fn: FunctionDeclaration): boolean {
  return (fn.stateMutability === "pure" || fn.stateMutability === "view") && !isConstant(fn);
}
