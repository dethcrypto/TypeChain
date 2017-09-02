export enum AbiType {
  BOOL = "bool",
  UINT256 = "uint256",
  VOID = "void",
}

export interface AbiParameter {
  name: string;
  type: AbiType;
}

export interface ConstantDeclaration {
  name: string;
  output: AbiType;
}

export interface ConstantFunctionDeclaration {
  name: string;
  inputs: Array<AbiParameter>;
  outputs: Array<AbiType>; //we dont care about named returns for now
}

export interface FunctionDeclaration {
  name: string; // @todo missing inputs,
  inputs: Array<AbiParameter>;
  outputs: Array<AbiType>; //we dont care about named returns for now
}

export interface Contract {
  constants: Array<ConstantDeclaration>;

  constantFunctions: Array<ConstantFunctionDeclaration>;

  functions: Array<FunctionDeclaration>;
}

export interface RawAbiDefinition {
  name: string;
  constant: boolean;
  payable: boolean;
  inputs: AbiParameter[];
  outputs: AbiParameter[];
  type: string;
}

export function parse(abi: Array<RawAbiDefinition>): Contract {
  const constants: Array<ConstantDeclaration> = [];
  const constantFunctions: Array<ConstantFunctionDeclaration> = [];
  const functions: Array<FunctionDeclaration> = [];

  abi.forEach(abiPiece => {
    // skip constructors for now
    if (abiPiece.type === "constructor") {
      return;
    }

    if (abiPiece.constant && abiPiece.inputs.length === 0 && abiPiece.outputs.length === 1) {
      constants.push(parseConstant(abiPiece));
    } else if (abiPiece.constant) {
      constantFunctions.push(parseConstantFunction(abiPiece));
    } else {
      functions.push(parseFunctionDeclaration(abiPiece));
    }
  });

  return {
    constants,
    constantFunctions,
    functions,
  };
}

function parseOutputs(outputs: Array<AbiParameter>) {
  if (outputs.length === 0) {
    return [AbiType.VOID];
  } else {
    return outputs.map(param => param.type);
  }
}

function parseConstant(abiPiece: RawAbiDefinition): ConstantDeclaration {
  return {
    name: abiPiece.name,
    output: abiPiece.outputs[0].type,
  };
}

function parseConstantFunction(abiPiece: RawAbiDefinition): ConstantFunctionDeclaration {
  return {
    name: abiPiece.name,
    inputs: abiPiece.inputs,
    outputs: parseOutputs(abiPiece.outputs),
  };
}

function parseFunctionDeclaration(abiPiece: RawAbiDefinition): FunctionDeclaration {
  return {
    name: abiPiece.name,
    inputs: abiPiece.inputs,
    outputs: parseOutputs(abiPiece.outputs),
  };
}
