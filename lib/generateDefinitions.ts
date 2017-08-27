import { AbiType, RawAbiDefinition, parse, Contract, AbiParameter } from "./abiParser";

export default function generateDefinitions(
  contractName: string,
  abi: Array<RawAbiDefinition>
): string {
  const parsedContractAbi = parse(contractName, abi);

  return codeGenForContract(parsedContractAbi);
}

// @todo export proper newline
function codeGenForContract(input: Contract) {
  return `
    import { BigNumber } from "bignumber.js";
  
    declare class ${input.name} {
        public constructor(address: string | BigNumber);
        
        ${input.constants
          .map(
            constant =>
              `public readonly ${constant.name}: Promise<${codeGenForTypes(constant.output)}>`
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
                  `public ${func.name}Tx(${func.inputs
                    .map(codeGenForParams)
                    .join(", ")}): Promise<${codeGenForOutputTypelist(func.outputs)}>`
              )
              .join(";\n")} 
    }
    
    export default ${input.name};
    `;
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
    case AbiType.BOOL: return 'boolean';
    case AbiType.UINT256: return 'BigNumber';
    case AbiType.VOID: return 'void';
    default: throw new Error("Unrecognized type!");
  }
}
