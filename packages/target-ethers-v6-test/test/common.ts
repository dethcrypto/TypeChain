import { ethers, JsonRpcProvider, JsonRpcSigner } from 'ethers'
import type { ContractRunner } from 'ethers/types/providers'
import { Server as GanacheServer, server as createGanacheServer } from 'ganache'
import { loadContract } from 'test-utils'

const IS_WINDOWS_CI = process.env.CI === 'true' && process.platform === 'win32'

export const GAS_LIMIT_STANDARD = 6000000

/**
 * ⚠ Beware: This function skips the test suite on Windows CI as a workaround
 *    for flaky timeouts.
 */
export function createNewBlockchain<TContract>(contractName: string) {
  before(function () {
    if (IS_WINDOWS_CI) this.skip()
  })

  type Ctx = {
    ganache: GanacheServer<'ethereum'>
    provider: JsonRpcProvider
    signer: JsonRpcSigner
    contract: TContract
  }

  const ctx: Partial<Ctx> = {}

  beforeEach(async () => {
    const ganache = createGanacheServer({ logging: { quiet: true } })

    await ganache.listen(8546)

    const provider = new JsonRpcProvider('http://localhost:8546')
    const signer = await provider.getSigner(0)

    const contract = await deployContract<TContract>(signer, contractName)

    Object.assign(ctx, { ganache, provider, signer, contract })
  })

  afterEach(() => ctx.ganache?.close())

  return ctx as Ctx
}

export function deployContract<T>(runner: ContractRunner, name: string): Promise<T> {
  const { abi, code } = loadContract(name)

  const factory = new ethers.ContractFactory(abi, code, runner)
  return factory.deploy() as any as Promise<T>
}
