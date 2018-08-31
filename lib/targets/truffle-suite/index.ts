// import { RawAbiDefinition, Contract } from "../../abiParser";
// import { IContext } from "../../generateSource";

// export function codeGenForContract(
//   abi: Array<RawAbiDefinition>,
//   input: Contract,
//   context: IContext,
// ) {
//   return `
// /// <reference types="truffle-typings" />

// interface Artifacts {
//   require(name: "Greeter"): GreeterContract;
//   require(name: "Migrations"): MigrationContract;
// }

// declare interface GreeterContract extends Truffle.Contract<GreeterContractInstance> {
//   "new"(_greetingText: string, meta?: Truffle.TransactionDetails): GreeterContractInstance;
// }
// declare interface GreeterContractInstance {
//   sayHello(txDetails?: Truffle.TransactionDetails): Promise<string>;
//   setGreeting(greeting: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
// }
// declare interface MigrationContract extends Truffle.Contract<MigrationContractInstance> {
//   "new"(meta?: Truffle.TransactionDetails): GreeterContractInstance;
// }
// declare interface MigrationContractInstance {}

// declare var artifacts: Artifacts;
// `;
// }
