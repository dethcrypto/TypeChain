// export function codegen() {
//   const template = `
// /// <reference types="truffle-typings" />

// interface Artifacts {
//   ${generateArtifacts()}

//   require(name: "Greeter"): GreeterContract;
//   require(name: "Migrations"): MigrationContract;
// }

// ${generateContracts()}
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
//   `

//   return template;
// }

// function generateArtifacts() {

// }
