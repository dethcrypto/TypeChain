import fs from 'fs'
import { Contract, number, Provider } from 'starknet'
const { toBN } = number
import { expect } from 'earljs'

import type { contract as _contract } from '../types'

describe('Type Transformation', () => {
  let contract: _contract

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

    contract = await deployContract('contract')
  })

  describe('Input Types', () => {
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

  describe('Return Types', () => {
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
