import fs from 'fs'
import {
  Contract,
  Provider,
  defaultProvider,
  number,
  hash,
  ec,
  Account,
  AddTransactionResponse,
  TransactionStatus,
} from 'starknet'
const { toBN } = number
const { getSelectorFromName } = hash
import { expect } from 'earljs'
import { contract as _contract } from '../types/contract'
import { ERC20 as _ERC20 } from '../types/ERC20'
import { ArgentAccount as _account } from '../types/ERC20'

describe('DAI', () => {
  let contract: _contract;
  let ERC20: _ERC20;
  let account: _account;
  let account2: _account;

  before(async () => {
    const provider = new Provider({ baseUrl: 'http://localhost:5000' });

    async function deployContract(name: string, calldata: any[] = [], options: object = {}): Promise<any> {
      const compiledContract = JSON.parse(fs.readFileSync(`./example-abis/${name}.json`).toString('ascii'));
      console.log(`Deploying contract: ${name}`);
      const response = await provider.deployContract({
        contract: compiledContract,
        constructorCalldata: calldata,
        ...options,
      });
      await provider.waitForTransaction(response.transaction_hash);
      const address = response.address || '';
      return new Contract(compiledContract.abi, address, provider);
    }

    async function deployAccount(): Promise<Account> {
      const pair = ec.genKeyPair();
      const pub = ec.getStarkKey(pair);
      const _ = await deployContract("ArgentAccount", [], { addressSalt: pub });
      const { transaction_hash: initializeTxHash } = await _.initialize(pub, "0");
      await provider.waitForTransaction(initializeTxHash);
      return new Account(provider, _.address, pair);
    }

    account = await deployAccount();
    account2 = await deployAccount();

    contract = await deployContract('contract');
    ERC20 = await deployContract('ERC20');
  });

  describe('Request Type Transformation', () => {
    describe('Account', () => {
      it('Mint', async () => {
        const res = await account.execute(
          {
            contractAddress: ERC20.address,
            entryPoint: "mint",
            calldata: [account.address, 1],
          },
          [ERC20.abi],
          { maxFee: "0" }, 
        );
        const response: AddTransactionResponse = {
          address: account.address,
          code: "TRANSACTION_RECEIVED" as TransactionStatus,
          result: [], // not in AddTransactionResponse
          transaction_hash: res.transaction_hash,
        };
        expect(res).toEqual(response);
      });

      it('Transfer', async () => {
        const res = await account.execute(
          {
            contractAddress: ERC20.address,
            entryPoint: "transfer",
            calldata: [account2.address, 1],
          },
          [ERC20.abi],
          { maxFee: "0" }, 
        );
        const response: AddTransactionResponse = {
          address: account.address,
          code: "TRANSACTION_RECEIVED" as TransactionStatus,
          result: [], // not in AddTransactionResponse
          transaction_hash: res.transaction_hash,
        };
        expect(res).toEqual(response);
      });

      it('Mint bound', async () => {
        ERC20.connect(account);
        const res = await ERC20.mint(account.address, 1, { maxFee: "0" });
        const response: AddTransactionResponse = {
          address: account.address,
          code: "TRANSACTION_RECEIVED" as TransactionStatus,
          result: [], // not in AddTransactionResponse
          transaction_hash: res.transaction_hash,
        };
        expect(res).toEqual(response);
      });

      it('Transfer bound', async () => {
        ERC20.connect(account);
        const res = await ERC20.transfer(account.address, 1, { maxFee: "0" });
        const response: AddTransactionResponse = {
          address: account.address,
          code: "TRANSACTION_RECEIVED" as TransactionStatus,
          result: [], // not in AddTransactionResponse
          transaction_hash: res.transaction_hash,
        };
        expect(res).toEqual(response);
      });
    });

    it('Parsing the felt in request in invoke', async () => {
      await expect(ERC20.mint(3, 3)).not.toBeRejected()
    })

    it('Parsing the felt in request in invoke', async () => {
      await expect(ERC20.mint(3, 3)).not.toBeRejected()
    })

    it('Parsing the felt in request', async () => {
      await expect(contract.request_felt(3)).not.toBeRejected()
    })

    it('Parsing the array of felt in request', async () => {
      await expect(contract.request_array_of_felts([1, 2])).not.toBeRejected()
    })

    it('Parsing the struct in request', async () => {
      await expect(contract.request_struct({ x: 1, y: 2 })).not.toBeRejected()
    })

    it('Parsing the array of structs in request', async () => {
      await expect(contract.request_array_of_structs([{ x: 1, y: 2 }])).not.toBeRejected()
    })

    it('Parsing the nested structs in request', async () => {
      await expect(
        contract.request_nested_structs({
          p1: { x: 1, y: 2 },
          p2: { x: 3, y: 4 },
          extra: 5,
        }),
      ).not.toBeRejected()
    })

    it('Parsing the tuple in request', async () => {
      await expect(contract.request_tuple([1, 2])).not.toBeRejected()
    })

    it('Parsing the multiple types in request', async () => {
      await expect(contract.request_mixed_types(2, { x: 1, y: 2 }, [1])).not.toBeRejected()
    })
  })

  describe('Response Type Transformation', () => {
    it('Parsing the felt in response', async () => {
      const { res } = await contract.get_felt()
      expect(res).toEqual(toBN(4))
    })

    it('Parsing the array of felt in response', async () => {
      const result = await contract.get_array_of_felts()
      const [res] = result
      expect(res).toEqual([toBN(4), toBN(5)])
      expect(res).toEqual(result.res)
    })

    it('Parsing the array of structs in response', async () => {
      const result = await contract.get_struct()
      const [res] = result
      expect(res).toEqual({ x: toBN(1), y: toBN(2) })
      expect(res).toEqual(result.res)
    })

    it('Parsing the array of structs in response', async () => {
      const result = await contract.get_array_of_structs()
      const [res] = result
      expect(res).toEqual([{ x: toBN(1), y: toBN(2) }])
      expect(res).toEqual(result.res)
    })

    it('Parsing the nested structs in response', async () => {
      const result = await contract.get_nested_structs()
      const [res] = result
      expect(res).toEqual({
        p1: { x: toBN(1), y: toBN(2) },
        p2: { x: toBN(3), y: toBN(4) },
        extra: toBN(5),
      })
      expect(res).toEqual(result.res)
    })

    it('Parsing the tuple in response', async () => {
      const result = await contract.get_tuple()
      const [res] = result
      expect(res).toEqual([toBN(1), toBN(2), toBN(3)])
      expect(res).toEqual(result.res)
    })

    it('Parsing the multiple types in response', async () => {
      const result = await contract.get_mixed_types()
      const [tuple, number, array, point] = result
      expect(tuple).toEqual([toBN(1), toBN(2)])
      expect(number).toEqual(toBN(3))
      expect(array).toEqual([toBN(4)])
      expect(point).toEqual({ x: toBN(1), y: toBN(2) })
      expect(tuple).toEqual(result.tuple)
      expect(number).toEqual(result.number)
      expect(array).toEqual(result.array)
      expect(point).toEqual(result.point)
    })
  })
})
