import { AbiType, RawAbiDefinition, parse, Contract, AbiParameter } from "./abiParser";

export function generateTypings(abi: Array<RawAbiDefinition>): string {
  const parsedContractAbi = parse(abi);

  return codeGenForContract(parsedContractAbi);
}

export function generateTypingsForContract(contract: Contract): string {
  return codeGenForContract(contract);
}

// @todo fix formatting of generate code
// @todo better typings for web3
function codeGenForContract(input: Contract) {
  return `
import { BigNumber } from "bignumber.js";

interface ITxParams {
  from?: string; 
  gas?: number | string | BigNumber;
  gasPrice?: number | string | BigNumber;
}

declare class Contract {
    public constructor(web3: any, address: string);
    static createAndValidate(web3: any, address: string): Promise<Contract>;
    
    ${input.constants
      .map(
        constant => `public readonly ${constant.name}: Promise<${codeGenForTypes(constant.output)}>`
      )
      .join(";\n")} 
      ${input.constantFunctions
        .map(
          constantFunction =>
            `public ${constantFunction.name}(${constantFunction.inputs
              .map(codeGenForParams)
              .join(", ")}): Promise<${codeGenForOutputTypelist(constantFunction.outputs)}>`
        )
        .join(";\n")} 

        ${input.functions
          .map(
            func =>
              `public ${func.name}Tx(${func.inputs.map(codeGenForParams).join(", ") +
                (func.inputs.length === 0
                  ? ""
                  : ", ")}params?: ITxParams): Promise<${codeGenForOutputTypelist(func.outputs)}>`
          )
          .join(";\n")} 
}

export default Contract;`;
}

function codeGenForParams(param: AbiParameter): string {
  return `${param.name}: ${codeGenForTypes(param.type)}`;
}

function codeGenForOutputTypelist(output: Array<AbiType>): string {
  if (output.length === 1) {
    return codeGenForTypes(output[0]);
  } else {
    return `[${output.map(codeGenForTypes).join(", ")}]`;
  }
}

function codeGenForTypes(abiType: AbiType): string {
  switch (abiType) {
    case AbiType.BOOL:
      return "boolean";
    case AbiType.UINT256:
      return "BigNumber";
    case AbiType.VOID:
      return "void";
    default:
      throw new Error("Unrecognized type!");
  }
}
