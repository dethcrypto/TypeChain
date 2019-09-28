import {
  RawAbiDefinition,
  Contract,
  AbiParameter,
  EventArgDeclaration,
  FunctionDeclaration,
  EventDeclaration,
  parse,
  isConstant,
  isConstantFn,
  AbiOutputParameter,
} from "typechain/parser/abiParser";
import { EvmType, TupleType, EvmOutputType } from "typechain/parser/parseEvmType";
import { IContext } from "typechain/shared";
import { join } from "path";
import { readFileSync } from "fs";
import { values } from "lodash";
import { Dictionary, UnreachableCaseError } from "ts-essentials";

export function getRuntime(): string {
  const runtimePath = join(__dirname, "./runtime/typechain-runtime.ts");
  return readFileSync(runtimePath, "utf8");
}

export function codegen(abi: Array<RawAbiDefinition>, context: IContext): string {
  const parsedContractAbi = parse(abi, context.fileName);

  return codegenForContract(abi, parsedContractAbi, context);
}

function codegenForContract(abi: Array<RawAbiDefinition>, contract: Contract, context: IContext) {
  const runtimeNamespace = "TC";
  const typeName = context.fileName;

  return `
    import { BigNumber } from "bignumber.js";
    import * as ${runtimeNamespace} from "${context.relativeRuntimePath}"

    export class ${typeName} extends ${runtimeNamespace}.TypeChainContract {
      public readonly rawWeb3Contract: any;

      public constructor(web3: any, address: string | BigNumber) {
        const abi = ${JSON.stringify(abi)};
        super(web3, address, abi);
      }

      static async createAndValidate(web3: any, address: string | BigNumber): Promise<${typeName}> {
        const contract = new ${typeName}(web3, address);
        const code = await ${runtimeNamespace}.promisify(web3.eth.getCode, [address]);

        // in case of missing smartcontract, code can be equal to "0x0" or "0x" depending on exact web3 implementation
        // to cover all these cases we just check against the source code length — there won't be any meaningful EVM program in less then 3 chars
        if (code.length < 4) {
          throw new Error(\`Contract at \${address} doesn't exist!\`);
        }
        return contract; 
      }
      
      ${codegenForFunctions(runtimeNamespace, contract.functions)};
      
      ${codegenForEvents(runtimeNamespace, contract.events)}
    }
`;
}

function codegenForFunctions(
  runtimeNamespace: string,
  functions: Dictionary<FunctionDeclaration[]>,
) {
  const code = values(functions)
    // we ignore overrides
    .map(fns => fns[0])
    .map(fnDecl => {
      if (isConstantFn(fnDecl)) {
        return codeGenForConstantsFunction(runtimeNamespace, fnDecl);
      }

      if (isConstant(fnDecl)) {
        return codeGenForConstant(runtimeNamespace, fnDecl);
      }

      return codeGenForFunction(runtimeNamespace, fnDecl);
    });

  return code.join("\n");
}
function codeGenForConstant(runtimeNamespace: string, constant: FunctionDeclaration) {
  return `
        public get ${constant.name}(): Promise<${codeGenForOutput(constant.outputs[0].type)}> { 
            return ${runtimeNamespace}.promisify(this.rawWeb3Contract.${constant.name}, []); 
        }
    `;
}

function codeGenForConstantsFunction(runtimeNamespace: string, fn: FunctionDeclaration) {
  return `
        public ${fn.name}(${fn.inputs
    .map(codeGenForParams)
    .join(", ")}): Promise<${codeGenForOutputTypeList(fn.outputs)}> { 
            return ${runtimeNamespace}.promisify(this.rawWeb3Contract.${fn.name}, [${fn.inputs
    .map(codeGenForArgs)
    .join(", ")}]); 
        }
   `;
}

function codeGenForFunction(runtimeNamespace: string, fn: FunctionDeclaration) {
  const txParamsType =
    fn.stateMutability === "payable"
      ? `${runtimeNamespace}.IPayableTxParams`
      : `${runtimeNamespace}.ITxParams`;

  return `public ${fn.name}Tx(${fn.inputs
    .map(codeGenForParams)
    .join(
      ", ",
    )}): ${runtimeNamespace}.DeferredTransactionWrapper<${txParamsType}> { return new ${runtimeNamespace}.DeferredTransactionWrapper<${txParamsType}>(this, "${
    fn.name
  }", [${fn.inputs.map(codeGenForArgs).join(", ")}]);
                }`;
}

function codegenForEvents(runtimeNamespace: string, events: Dictionary<EventDeclaration[]>) {
  return (
    values(events)
      // ignore overridden events
      .map(v => v[0])
      .map(event => {
        const filterableEventParams = codeGenForEventArgs(event.inputs, true);
        const eventParams = codeGenForEventArgs(event.inputs, false);

        return `public ${event.name}Event(eventFilter: ${filterableEventParams}): ${runtimeNamespace}.DeferredEventWrapper<${eventParams}, ${filterableEventParams}> {
                return new ${runtimeNamespace}.DeferredEventWrapper<${eventParams}, ${filterableEventParams}>(this, '${event.name}', eventFilter);
              }`;
      })
      .join("\n")
  );
}

function codeGenForParams(param: AbiParameter, index: number): string {
  return `${param.name || `arg${index}`}: ${codeGenForInput(param.type)}`;
}

function codeGenForArgs(param: AbiParameter, index: number): string {
  const paramName = param.name || `arg${index}`;
  if (param.type.type === "array") {
    const elemParam = { name: `${paramName}Elem`, type: param.type.itemType };
    return `${paramName}.map(${elemParam.name} => ${codeGenForArgs(elemParam, 0)})`;
  }
  if (param.type.type === "boolean") return paramName;
  return `${paramName}.toString()`;
}

function codeGenForOutputTypeList(output: Array<AbiOutputParameter>): string {
  if (output.length === 1) {
    return codeGenForOutput(output[0].type);
  } else {
    return `[${output.map(x => codeGenForOutput(x.type)).join(", ")}]`;
  }
}

function codeGenForEventArgs(args: EventArgDeclaration[], onlyIndexed: boolean) {
  return `{${args
    .filter(arg => arg.isIndexed || !onlyIndexed)
    .map(arg => {
      const inputCodegen = codeGenForInput(arg.type);

      // if we're specifying a filter, you can take a single value or an array of values to check for
      const argType = `${inputCodegen}${onlyIndexed ? ` | Array<${inputCodegen}>` : ""}`;
      return `${arg.name}${onlyIndexed ? "?" : ""}: ${argType}`;
    })
    .join(`, `)}}`;
}

function codeGenForInput(evmType: EvmType): string {
  switch (evmType.type) {
    case "integer":
      return "BigNumber | number";
    case "uinteger":
      return "BigNumber | number";
    case "address":
      return "BigNumber | string";
    case "tuple":
      return generateTupleType(evmType, codeGenForInput);

    default:
      return codeGenForOutput(evmType);
  }
}

function codeGenForOutput(evmType: EvmOutputType): string {
  switch (evmType.type) {
    case "boolean":
      return "boolean";
    case "integer":
      return "BigNumber";
    case "uinteger":
      return "BigNumber";
    case "void":
      return "void";
    case "string":
      return "string";
    case "bytes":
    case "dynamic-bytes":
      return "string";
    case "address":
      return "string";
    case "array":
      return codeGenForOutput(evmType.itemType) + "[]";
    case "tuple":
      return generateTupleType(evmType, codeGenForOutput);

    default:
      throw new UnreachableCaseError(evmType);
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
