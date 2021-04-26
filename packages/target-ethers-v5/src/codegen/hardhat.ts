import { basename } from 'path'
import { FACTORY_POSTFIX } from '../common'

export function generateHardhatHelper(contracts: string[]): string {
  return `

import { ethers } from 'ethers'
import { FactoryOptions } from '@nomiclabs/hardhat-ethers/types'

import * as Contracts from "."

module 'hardhat/types/runtime' {
  ${contracts
    .map(
      (n) =>
        `function getContractFactory(name: '${n}', signerOrOptions?: ethers.Signer | FactoryOptions): Promise<Contracts.${
          n + FACTORY_POSTFIX
        }>`,
    )
    .join('\n')}
}
  `
}
