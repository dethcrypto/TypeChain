import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { ethers } from 'ethers'
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

  before(async () => {
    ctx.ganache = createGanacheServer({ logging: { quiet: true } })

    await ctx.ganache.listen(8545)
  })

  beforeEach(async () => {
    const provider = new JsonRpcProvider()
    const signer = provider.getSigner(0)

    const contract = await deployContract<TContract>(signer, contractName)

    Object.assign(ctx, { provider, signer, contract })
  })

  after(() => ctx.ganache?.close())

  return ctx as Ctx
}

export function deployContract<T>(signer: ethers.Signer, name: string): Promise<T> {
  const { abi, code } = loadContract(name)

  const factory = new ethers.ContractFactory(abi, code, signer)
  return factory.deploy() as any as Promise<T>
}
