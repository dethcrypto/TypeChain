import * as ganache from 'ganache'
import { loadContract } from 'test-utils'
import Web3 from 'web3'

export const GAS_LIMIT_STANDARD = 6000000

export async function createNewBlockchain() {
  const web3 = new Web3(ganache.provider({ logging: { quiet: true } }) as any)
  const accounts = await web3.eth.getAccounts()
  return { web3, accounts }
}

export async function deployContract<T>(
  web3: Web3,
  accounts: string[],
  contractName: string,
  ...args: any[]
): Promise<T> {
  const { abi, code } = loadContract(contractName)

  const Contract = new web3.eth.Contract(abi)
  const t = Contract.deploy({ arguments: args, data: code })

  return (await (t.send({
    from: accounts[0],
    gas: GAS_LIMIT_STANDARD,
  }) as any)) as T
}
