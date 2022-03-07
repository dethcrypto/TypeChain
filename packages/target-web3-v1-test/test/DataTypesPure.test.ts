import { q18, typedAssert } from 'test-utils'

import type { DataTypesPure } from '../types/DataTypesPure'
import { createNewBlockchain, deployContract } from './common'

describe('DataTypesPure', () => {
  let contract!: DataTypesPure
  beforeEach(async () => {
    const { web3, accounts } = await createNewBlockchain()
    contract = await deployContract<DataTypesPure>(web3, accounts, 'DataTypesPure')
  })

  it('works', async () => {
    typedAssert(await contract.methods.pure_uint8().call(), '42')
    typedAssert(await contract.methods.pure_uint256().call(), q18(1))

    typedAssert(await contract.methods.pure_int8().call(), '42')
    typedAssert(await contract.methods.pure_int256().call(), q18(1))

    typedAssert(await contract.methods.pure_bool().call(), true)

    typedAssert(await contract.methods.pure_address().call(), '0x70b144972C5Ef6CB941A5379240B74239c418CD4')

    typedAssert(await contract.methods.pure_bytes1().call(), '0xaa')
    typedAssert(await contract.methods.pure_bytes().call(), '0x54797065436861696e')

    typedAssert(await contract.methods.pure_string().call(), 'TypeChain')

    typedAssert(await contract.methods.pure_stat_array().call(), ['1', '2', '3'])

    typedAssert(await contract.methods.pure_tuple().call(), { 0: '1', 1: '2' })
    typedAssert(await contract.methods.pure_named().call(), { 0: '1', 1: '2', uint256_1: '1', uint256_2: '2' })

    typedAssert(await contract.methods.pure_struct().call(), ['1', '2'])

    typedAssert(await contract.methods.pure_enum().call(), '1')
  })
})
