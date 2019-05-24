import {
  RawAbiDefinition,
  Contract,
  AbiParameter,
  EventArgDeclaration,
  ConstantDeclaration,
  ConstantFunctionDeclaration,
  FunctionDeclaration,
  EventDeclaration,
  parse,
} from "../../parser/abiParser";
import {
  EvmType,
  ArrayType,
  BooleanType,
  IntegerType,
  UnsignedIntegerType,
  VoidType,
  StringType,
  BytesType,
  DynamicBytesType,
  AddressType,
  TupleType,
} from "../../parser/typeParser";
import { IContext } from "../shared";
import { join } from "path";
import { readFileSync } from "fs";

export function getRuntime(): string {
  const runtimePath = join(__dirname, "./runtime/typechain-runtime.ts");
  return readFileSync(runtimePath, "utf8");
}

export function codegen(abi: Array<RawAbiDefinition>, context: IContext): string {
  const parsedContractAbi = parse(abi, context.fileName);

  return codeGenForContract(abi, parsedContractAbi, context);
}

function codeGenForContract(abi: Array<RawAbiDefinition>, input: Contract, context: IContext) {
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
      
      ${codeGenForConstants(runtimeNamespace, input.constants)}
      
      ${codeGenForConstantsFunctions(runtimeNamespace, input.constantFunctions)}
      
      ${codeGenForFunctions(runtimeNamespace, input.functions)}
      
      ${codeGenForEvents(runtimeNamespace, input.events)}
    }
`;
}

function codeGenForConstants(runtimeNamespace: string, constants: Array<ConstantDeclaration>) {
  return constants
    .map(
      ({ name, output }) => `
        public get ${name}(): Promise<${codeGenForOutput(output)}> { 
            return ${runtimeNamespace}.promisify(this.rawWeb3Contract.${name}, []); 
        }
    `,
    )
    .join("\n");
}

function codeGenForConstantsFunctions(
  runtimeNamespace: string,
  constantFunctions: Array<ConstantFunctionDeclaration>,
) {
  return constantFunctions
    .map(
      ({ inputs, name, outputs }) => `
        public ${name}(${inputs
        .map(codeGenForParams)
        .join(", ")}): Promise<${codeGenForOutputTypeList(outputs)}> { 
            return ${runtimeNamespace}.promisify(this.rawWeb3Contract.${name}, [${inputs
        .map(codeGenForArgs)
        .join(", ")}]); 
        }
   `,
    )
    .join("\n");
}

function codeGenForFunctions(runtimeNamespace: string, functions: Array<FunctionDeclaration>) {
  return functions
    .map(({ payable, name, inputs }) => {
      const txParamsType = payable
        ? `${runtimeNamespace}.IPayableTxParams`
        : `${runtimeNamespace}.ITxParams`;
      return `public ${name}Tx(${inputs
        .map(codeGenForParams)
        .join(
          ", ",
        )}): ${runtimeNamespace}.DeferredTransactionWrapper<${txParamsType}> { return new ${runtimeNamespace}.DeferredTransactionWrapper<${txParamsType}>(this, "${name}", [${inputs
        .map(codeGenForArgs)
        .join(", ")}]);
                }`;
    })
    .join("\n");
}

function codeGenForEvents(runtimeNamespace: string, events: Array<EventDeclaration>) {
  return events
    .map(event => {
      const filterableEventParams = codeGenForEventArgs(event.inputs, true);
      const eventParams = codeGenForEventArgs(event.inputs, false);

      return `public ${
        event.name
      }Event(eventFilter: ${filterableEventParams}): ${runtimeNamespace}.DeferredEventWrapper<${eventParams}, ${filterableEventParams}> {
                return new ${runtimeNamespace}.DeferredEventWrapper<${eventParams}, ${filterableEventParams}>(this, '${
        event.name
      }', eventFilter);
              }`;
    })
    .join("\n");
}

function codeGenForParams(param: AbiParameter, index: number): string {
  return `${param.name || `arg${index}`}: ${codeGenForInput(param.type)}`;
}

function codeGenForArgs(param: AbiParameter, index: number): string {
  const paramName = param.name || `arg${index}`;
  if (param.type instanceof ArrayType) {
    const elemParam = { name: `${paramName}Elem`, type: param.type.itemType };
    return `${paramName}.map(${elemParam.name} => ${codeGenForArgs(elemParam, 0)})`;
  }
  if (param.type instanceof BooleanType) return paramName;
  return `${paramName}.toString()`;
}

function codeGenForOutputTypeList(output: Array<AbiParameter>): string {
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
  switch (evmType.constructor) {
    case IntegerType:
      return "BigNumber | number";
    case UnsignedIntegerType:
      return "BigNumber | number";
    case AddressType:
      return "BigNumber | string";
    case TupleType:
      return generateTupleType(evmType as TupleType, codeGenForInput);

    default:
      return codeGenForOutput(evmType);
  }
}

function codeGenForOutput(evmType: EvmType): string {
  switch (evmType.constructor) {
    case BooleanType:
      return "boolean";
    case IntegerType:
      return "BigNumber";
    case UnsignedIntegerType:
      return "BigNumber";
    case VoidType:
      return "void";
    case StringType:
      return "string";
    case BytesType:
    case DynamicBytesType:
      return "string";
    case AddressType:
      return "string";
    case ArrayType:
      return codeGenForOutput((evmType as ArrayType).itemType) + "[]";
    case TupleType:
      return generateTupleType(evmType as TupleType, codeGenForOutput);

    default:
      throw new Error(`Unrecognized ABI piece: ${evmType.constructor}`);
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
