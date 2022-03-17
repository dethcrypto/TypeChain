import * as ganache from 'ganache'
import { loadContract } from 'test-utils'
import Web3 from 'web3'

const IS_WINDOWS_CI = process.env.CI === 'true' && process.platform === 'win32'

export const GAS_LIMIT_STANDARD = 6000000

/**
 * ⚠ Beware: This function skips the test suite on Windows CI as a workaround
 *    for flaky timeouts.
 */
export function createNewBlockchain<TContract>(contractName: string) {
  const ganacheProvider = ganache.provider({ logging: { quiet: true } })
  const web3 = new Web3(ganacheProvider as any)

  const accounts: string[] = []
  let contract: TContract

  before(async function () {
    if (IS_WINDOWS_CI) this.skip()

    accounts.push(...(await web3.eth.getAccounts()))
  })

  beforeEach(async () => {
    contract = await deployContract(web3, accounts, contractName)
  })

  return {
    web3,
    accounts,
    get contract() {
      return contract
    },
  }
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
