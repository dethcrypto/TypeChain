import { q18, typedAssert } from 'test-utils'

import type { DataTypesView } from '../types/v0.6.4/DataTypesView'
import { createNewBlockchain } from './common'

describe('DataTypesView', () => {
  const chain = createNewBlockchain<DataTypesView>('DataTypesView')

  it('works', async () => {
    const { contract } = chain

    typedAssert(await contract.methods.view_uint8().call(), '42')
    typedAssert(await contract.methods.view_uint256().call(), q18(1))

    typedAssert(await contract.methods.view_int8().call(), '42')
    typedAssert(await contract.methods.view_int256().call(), q18(1))

    typedAssert(await contract.methods.view_bool().call(), true)

    typedAssert(await contract.methods.view_address().call(), '0x70b144972C5Ef6CB941A5379240B74239c418CD4')

    typedAssert(await contract.methods.view_bytes1().call(), '0xaa')
    typedAssert(await contract.methods.view_bytes().call(), '0x54797065436861696e')

    typedAssert(await contract.methods.view_string().call(), 'TypeChain')

    typedAssert(await contract.methods.view_stat_array().call(), ['1', '2', '3'])

    typedAssert(await contract.methods.view_tuple().call(), { 0: '1', 1: '2' })
    typedAssert(await contract.methods.view_named().call(), { 0: '1', 1: '2', uint256_1: '1', uint256_2: '2' })

    typedAssert(await contract.methods.view_struct().call(), ['1', '2'])

    typedAssert(await contract.methods.view_enum().call(), '1')
  })
})
