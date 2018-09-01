import { Contract } from "../../parser/abiParser";
import { EvmType, IntegerType, UnsignedIntegerType, AddressType } from "../../parser/typeParser";

export function codegen(contracts: Contract[]) {
  const template = `
/// <reference types="truffle-typings" />

interface Artifacts {
  ${generateArtifactHeaders(contracts)}
}

{generateContracts()}
declare interface GreeterContract extends Truffle.Contract<GreeterContractInstance> {
  "new"(_greetingText: string, meta?: Truffle.TransactionDetails): GreeterContractInstance;
}
declare interface GreeterContractInstance {
  sayHello(txDetails?: Truffle.TransactionDetails): Promise<string>;
  setGreeting(greeting: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
}
declare interface MigrationContract extends Truffle.Contract<MigrationContractInstance> {
  "new"(meta?: Truffle.TransactionDetails): GreeterContractInstance;
}
declare interface MigrationContractInstance {}

declare var artifacts: Artifacts;
  `;

  return template;
}

function generateArtifactHeaders(contracts: Contract[]): string {
  return contracts.map(f => `require(name: "${f.name}"): ${f.name}Contract;`).join("\n");
}

// function generateContractInterface(contract: Contract): string {
//   contract.functions

//       return `
//   declare interface ${f.name}Contract extends Truffle.Contract<${f.name}ContractInstance> {
//     "new"(, meta?: Truffle.TransactionDetails): ${f.name}ContractInstance;
//   }
// `,
//     )
//     .join("\n");
// }

//tslint:disable-next-line
function generateInputType(evmType: EvmType) {
  switch (evmType.constructor) {
    case IntegerType:
      return "number";
    case UnsignedIntegerType:
      return "number";
    case AddressType:
      return "string";

    default:
      throw new Error(`Unrecognized type ${evmType}`);
  }
}
