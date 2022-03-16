import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import * as ganache from 'ganache'
import { loadContract } from 'test-utils'

export const GAS_LIMIT_STANDARD = 6000000

export async function createNewBlockchain() {
  const server = ganache.server({ logging: { quiet: true } })
  server.listen(8545, () => {})
  const provider = new JsonRpcProvider()
  const signer = provider.getSigner(0)
  return { ganache: server, signer }
}

export function deployContract<T>(signer: ethers.Signer, name: string): Promise<T> {
  const { abi, code } = loadContract(name)

  const factory = new ethers.ContractFactory(abi, code, signer)
  return factory.deploy() as any as Promise<T>
}
