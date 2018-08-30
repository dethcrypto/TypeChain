import { RawAbiDefinition, parse } from "./abiParser";
import { codeGenForContract } from "./templates/typechain";

export interface IContext {
  fileName: string;
  relativeRuntimePath: string;
}

export function generateSource(abi: Array<RawAbiDefinition>, context: IContext): string {
  const parsedContractAbi = parse(abi);

  return codeGenForContract(abi, parsedContractAbi, context);
}
