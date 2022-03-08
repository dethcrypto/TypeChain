import { expect } from 'earljs'

import { lowestCommonPath } from '../../../src/utils/files/lowestCommonPath'

describe(lowestCommonPath.name, () => {
  it('finds lowest common ancestor path', () => {
    const paths = [
      '/TypeChain/contracts/compiled/v0.6.4/Payable.abi',
      '/TypeChain/contracts/compiled/v0.6.4/PayableFactory.abi',
      '/TypeChain/contracts/compiled/v0.8.9/ERC721.abi',
      '/TypeChain/contracts/compiled/v0.8.9/nested/a/NestedLibrary.abi',
      '/TypeChain/contracts/compiled/v0.8.9/nested/b/NestedLibrary.abi',
      '/TypeChain/contracts/compiled/v0.8.9/Rarity.abi',
      '/TypeChain/contracts/compiled/v0.8.9/Withdrawable.abi',
    ]

    const actual = lowestCommonPath(paths)
    expect(actual).toEqual('/TypeChain/contracts/compiled')
  })

  it('works for Windows paths', () => {
    const paths = [
      'D:/workspace/TypeChain/packages/hardhat/test/fixture-projects/hardhat-project/artifacts/contracts/EdgeCases.sol/EdgeCases.json',
      'D:/workspace/TypeChain/packages/hardhat/test/fixture-projects/hardhat-project/artifacts/contracts/lib/SafeMath.sol/SafeMath.json',
      'D:/workspace/TypeChain/packages/hardhat/test/fixture-projects/hardhat-project/artifacts/contracts/TestContract.sol/TestContract.json',
      'D:/workspace/TypeChain/packages/hardhat/test/fixture-projects/hardhat-project/artifacts/contracts/TestContract1.sol/TestContract1.json',
    ]

    const actual = lowestCommonPath(paths)
    expect(actual).toEqual(
      'D:/workspace/TypeChain/packages/hardhat/test/fixture-projects/hardhat-project/artifacts/contracts',
    )
  })
})
