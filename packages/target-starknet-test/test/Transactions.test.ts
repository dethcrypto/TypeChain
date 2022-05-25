import { expect } from 'earljs'
import fs from 'fs'
import { Account, AccountInterface, Contract, ec, Provider, TransactionStatus } from 'starknet'

import type { ERC20 } from '../types'

describe('Transactions', () => {
  let erc20: ERC20
  let account: AccountInterface
  let account2: AccountInterface

  before(async () => {
    const provider = new Provider({ baseUrl: 'http://localhost:5050' })

    async function deployContract<C extends Contract>(
      name: string,
      calldata: any[] = [],
      options: object = {},
    ): Promise<C> {
      const compiledContract = JSON.parse(fs.readFileSync(`./example-abis/${name}.json`).toString('ascii'))
      const response = await provider.deployContract({
        contract: compiledContract,
        constructorCalldata: calldata,
        ...options,
      })
      await provider.waitForTransaction(response.transaction_hash)
      const address = response.address || ''
      return new Contract(compiledContract.abi, address, provider) as C
    }

    async function deployAccount(): Promise<Account> {
      const pair = ec.genKeyPair()
      const pub = ec.getStarkKey(pair)
      const _ = await deployContract('ArgentAccount', [], { addressSalt: pub })
      const { transaction_hash: initializeTxHash } = await _.initialize(pub, '0')
      await provider.waitForTransaction(initializeTxHash)
      return new Account(provider, _.address, pair)
    }

    account = await deployAccount()
    account2 = await deployAccount()

    erc20 = await deployContract('ERC20')
  })

  describe('via execute', () => {
    it('mints', async () => {
      const res = await account.execute(
        {
          contractAddress: erc20.address,
          entrypoint: 'mint',
          calldata: [account.address, 1],
        },
        [erc20.abi],
        { maxFee: '0' },
      )
      const response = {
        address: account.address,
        code: 'TRANSACTION_RECEIVED' as TransactionStatus,
        result: [], // not in AddTransactionResponse
        transaction_hash: res.transaction_hash,
      }
      expect(res).toEqual(response)
    })

    it('transfers', async () => {
      const res = await account.execute(
        {
          contractAddress: erc20.address,
          entrypoint: 'transfer',
          calldata: [account2.address, 1],
        },
        [erc20.abi],
        { maxFee: '0' },
      )
      const response = {
        address: account.address,
        code: 'TRANSACTION_RECEIVED' as TransactionStatus,
        result: [], // not in AddTransactionResponse
        transaction_hash: res.transaction_hash,
      }
      expect(res).toEqual(response)
    })
  })
  describe('account bound', () => {
    it('mints', async () => {
      erc20.connect(account)
      const res = await erc20.mint(account.address, 1, { maxFee: '0' })
      const response = {
        address: account.address,
        code: 'TRANSACTION_RECEIVED' as TransactionStatus,
        result: [], // not in AddTransactionResponse
        transaction_hash: res.transaction_hash,
      }
      expect(res).toEqual(response)
    })

    it('transfers', async () => {
      erc20.connect(account)
      const res = await erc20.transfer(account.address, 1, { maxFee: '0' })
      const response = {
        address: account.address,
        code: 'TRANSACTION_RECEIVED' as TransactionStatus,
        result: [], // not in AddTransactionResponse
        transaction_hash: res.transaction_hash,
      }
      expect(res).toEqual(response)
    })
  })
})
