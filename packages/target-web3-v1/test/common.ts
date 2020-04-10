import Web3 from 'web3'

const ganache = require('ganache-cli')

import { join } from 'path'
import { readFileSync } from 'fs'

export const GAS_LIMIT_STANDARD = 6000000

export async function createNewBlockchain() {
  const web3 = new Web3(ganache.provider())
  const accounts = await web3.eth.getAccounts()
  return { web3, accounts }
}

export async function deployContract<T>(
  web3: Web3,
  accounts: string[],
  contractName: string,
  ...args: any[]
): Promise<T> {
  const abiDirPath = join(__dirname, '../../../contracts/compiled')

  const abi = JSON.parse(readFileSync(join(abiDirPath, contractName + '.abi'), 'utf-8'))
  const bin = readFileSync(join(abiDirPath, contractName + '.bin'), 'utf-8')
  const code = '0x' + bin

  const Contract = new web3.eth.Contract(abi)
  const t = Contract.deploy({ arguments: args, data: code })

  return (await (t.send({
    from: accounts[0],
    gas: GAS_LIMIT_STANDARD,
  }) as any)) as T
}
