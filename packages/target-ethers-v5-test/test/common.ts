import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { loadContract } from 'test-utils/dist'

import { IERC20Metadata } from '../types'

const ganache = require('ganache-cli')

export const GAS_LIMIT_STANDARD = 6000000

export async function createNewBlockchain() {
  const server = ganache.server()
  server.listen(8545, () => {})
  const provider = new JsonRpcProvider()
  const signer = provider.getSigner(0)
  return { ganache: server, signer }
}

export async function deployContract<T>(signer: ethers.Signer, name: string, ...args: any[]): Promise<T> {
  const { abi, code } = loadContract(name)
  const factory = new ethers.ContractFactory(abi, code, signer)
  return <T>(<unknown>await factory.deploy(...args))
}

export async function getTokenName<T extends IERC20Metadata>(token: T) {
  return await token.name()
}
