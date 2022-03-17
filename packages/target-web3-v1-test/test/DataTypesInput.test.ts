import BN from 'bn.js'
import { q18, typedAssert } from 'test-utils'

import type { DataTypesInput } from '../types/v0.6.4/DataTypesInput'
import { createNewBlockchain } from './common'

describe('DataTypesInput', () => {
  const chain = createNewBlockchain<DataTypesInput>('DataTypesInput')

  const bn = (s: string) => new BN(s)

  it('works', async () => {
    const { contract, web3 } = chain

    typedAssert(await contract.methods.input_uint8('42').call(), '42')
    typedAssert(await contract.methods.input_uint8(42).call(), '42')
    typedAssert(await contract.methods.input_uint8(bn('42')).call(), '42')

    typedAssert(await contract.methods.input_uint256(q18(1)).call(), q18(1))
    typedAssert(await contract.methods.input_uint256(1).call(), '1')
    typedAssert(await contract.methods.input_uint256(bn(q18(1))).call(), q18(1))

    typedAssert(await contract.methods.input_int8('42').call(), '42')
    typedAssert(await contract.methods.input_int8(42).call(), '42')
    typedAssert(await contract.methods.input_int8(bn('42')).call(), '42')

    typedAssert(await contract.methods.input_int256(q18(1)).call(), q18(1))
    typedAssert(await contract.methods.input_int256(1).call(), '1')
    typedAssert(await contract.methods.input_int256(bn(q18(1))).call(), q18(1))

    typedAssert(await contract.methods.input_bool(true).call(), true)

    typedAssert(
      await contract.methods.input_address('0x70b144972C5Ef6CB941A5379240B74239c418CD4').call(),
      '0x70b144972C5Ef6CB941A5379240B74239c418CD4',
    )

    typedAssert(await contract.methods.input_bytes1('0xaa').call(), '0xaa')
    // TODO this fails due to an issue in web3: https://github.com/ChainSafe/web3.js/issues/3742
    // typedAssert(await contract.methods.input_bytes1([0]).call(), '0x00')

    typedAssert(await contract.methods.input_bytes(web3.utils.fromAscii('TypeChain')).call(), '0x54797065436861696e')

    typedAssert(await contract.methods.input_string('TypeChain').call(), 'TypeChain')

    typedAssert(await contract.methods.input_stat_array(['1', '2', '3']).call(), ['1', '2', '3'])
    typedAssert(await contract.methods.input_stat_array([1, 2, 3]).call(), ['1', '2', '3'])

    // TODO this fails due to an issue in web3 abi coder handling of inner BN (see https://github.com/ChainSafe/web3.js/issues/3920)
    // typedAssert(
    //   await contract.methods.input_stat_array([bn('1'), bn('2'), bn('3')]).call(),
    //   ['1', '2', '3'],
    // )

    typedAssert(await contract.methods.input_tuple('1', '2').call(), { 0: '1', 1: '2' })
    typedAssert(await contract.methods.input_tuple(1, 2).call(), { 0: '1', 1: '2' })
    typedAssert(await contract.methods.input_tuple(bn('1'), bn('2')).call(), { 0: '1', 1: '2' })

    typedAssert(await contract.methods.input_struct(['1', '2']).call(), ['1', '2'])
    typedAssert(await contract.methods.input_struct([1, 2]).call(), ['1', '2'])

    // TODO this fails due to an issue in web3 abi coder handling of inner BN (see https://github.com/ChainSafe/web3.js/issues/3920)
    // typedAssert(await contract.methods.input_struct([bn('1'), bn('2')]).call(), ['1', '2'])

    typedAssert(await contract.methods.input_enum('1').call(), '1')
    typedAssert(await contract.methods.input_enum(1).call(), '1')
    typedAssert(await contract.methods.input_enum(bn('1')).call(), '1')
  })
})
