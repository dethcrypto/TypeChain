import { FACTORY_POSTFIX } from '../common'

// @todo hardhat helper needs to import _all_ generated contract files except of duplicates
export function generateHardhatHelper(contracts: string[]): string {
  return `

import { ethers } from 'ethers'
import { DeployContractOptions, FactoryOptions, HardhatEthersHelpers as HardhatEthersHelpersBase} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from "."

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
  ${contracts
    .map(
      (n) =>
        `getContractFactory(name: '${n}', signerOrOptions?: ethers.Signer | FactoryOptions): Promise<Contracts.${
          n + FACTORY_POSTFIX
        }>`,
    )
    .join('\n')}

  ${contracts
    .map(
      (n) =>
        `getContractAt(name: '${n}', address: string | ethers.Addressable, signer?: ethers.Signer): Promise<Contracts.${n}>`,
    )
    .join('\n')}

  ${contracts
    .map(
      (n) =>
        `deployContract(name: '${n}', signerOrOptions?: ethers.Signer | DeployContractOptions): Promise<Contracts.${n}>`,
    )
    .join('\n')}

  ${contracts
    .map(
      (n) =>
        `deployContract(name: '${n}', args: any[], signerOrOptions?: ethers.Signer | DeployContractOptions): Promise<Contracts.${n}>`,
    )
    .join('\n')}

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
  `
}
