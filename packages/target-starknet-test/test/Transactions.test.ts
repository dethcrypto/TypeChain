import { expect } from 'earljs'
import fs from 'fs'
import { Account, Contract, ec, json, Provider } from 'starknet'

import type { ERC20 } from '../types'

describe('Transactions', () => {
  let erc20: ERC20
  let account: Account
  let account2: Account
  let provider: Provider

  before(async () => {
    // @ts-ignore
    provider = new Provider({
      sequencer: { baseUrl: 'http://localhost:5050' },
    })

    account = new Account(
      provider,
      '0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a',
      ec.getKeyPair('0xe3e70682c2094cac629f6fbed82c07cd'),
    )

    account2 = new Account(
      provider,
      '0x69b49c2cc8b16e80e86bfc5b0614a59aa8c9b601569c7b80dde04d3f3151b79',
      ec.getKeyPair('0xf728b4fa42485e3a0a5d2f346baa9455'),
    )

    async function deployContract<C extends Contract>(
      account: Account,
      name: string,
      classHash: string,
      constructorCalldata: any[] = [],
    ): Promise<C> {
      const contract = json.parse(fs.readFileSync(`./example-abis/${name}.json`).toString('ascii'))
      const response = await account.declareDeploy({
        contract,
        constructorCalldata,
        classHash,
      })
      const address = response.deploy.contract_address
      return new Contract(contract.abi, address, provider) as C
    }

    // starkli class-hash example-abis/ERC20.json
    const erc20ClassHash = '0x02864c45bd4ba3e66d8f7855adcadf07205c88f43806ffca664f1f624765207e'
    erc20 = await deployContract(account, 'ERC20', erc20ClassHash)
  })

  describe('via execute', () => {
    it('mints', async () => {
      const { transaction_hash } = await account.execute(
        {
          contractAddress: erc20.address,
          entrypoint: 'mint',
          calldata: [account.address, 1],
        },
        [erc20.abi],
        { maxFee: '0' },
      )
      const { status } = await provider.waitForTransaction(transaction_hash)
      expect(status).toEqual('ACCEPTED_ON_L2')
    })

    it('transfers', async () => {
      const { transaction_hash } = await account.execute(
        {
          contractAddress: erc20.address,
          entrypoint: 'transfer',
          calldata: [account2.address, 1],
        },
        [erc20.abi],
        { maxFee: '0' },
      )
      const { status } = await provider.waitForTransaction(transaction_hash)
      expect(status).toEqual('ACCEPTED_ON_L2')
    })
  })
  describe('account bound', () => {
    it('mints', async () => {
      erc20.connect(account)
      const { transaction_hash } = await erc20.mint(account.address, 1, { maxFee: '0' })
      const { status } = await provider.waitForTransaction(transaction_hash)
      expect(status).toEqual('ACCEPTED_ON_L2')
    })

    it('transfers', async () => {
      erc20.connect(account)
      const { transaction_hash } = await erc20.transfer(account.address, 1, { maxFee: '0' })
      const { status } = await provider.waitForTransaction(transaction_hash)
      expect(status).toEqual('ACCEPTED_ON_L2')
    })
  })
})
