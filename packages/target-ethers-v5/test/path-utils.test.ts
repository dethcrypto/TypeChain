import { expect } from 'earljs'
import { FileDescription } from 'typechain'

import { generateBarrelFiles, lowestCommonPath } from '../src/path-utils'

describe('path utils', () => {
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
  })

  describe(generateBarrelFiles.name, () => {
    it('generates barrel files', () => {
      const paths = [
        'v0.6.4/PayableFactory.ts',
        'v0.8.9/ERC721.ts',
        'v0.8.9/nested/a/NestedLibrary.ts',
        'v0.8.9/nested/b/NestedLibrary.ts',
      ]

      const expected: FileDescription[] = [
        {
          path: 'index.ts',
          contents: [`export type * as v064 from './v0.6.4';`, `export type * as v089 from './v0.8.9';`].join('\n'),
        },
        { path: 'v0.6.4/index.ts', contents: "export type { PayableFactory } from './PayableFactory';" },
        {
          path: 'v0.8.9/index.ts',
          contents: [`export type * as nested from './nested';`, `export type { ERC721 } from './ERC721';`].join('\n'),
        },
        {
          path: 'v0.8.9/nested/index.ts',
          contents: [`export type * as a from './a';`, `export type * as b from './b';`].join('\n'),
        },
        {
          path: 'v0.8.9/nested/a/index.ts',
          contents: `export type { NestedLibrary } from './NestedLibrary';`,
        },
        {
          path: 'v0.8.9/nested/b/index.ts',
          contents: `export type { NestedLibrary } from './NestedLibrary';`,
        },
      ]

      const actual = generateBarrelFiles(paths, { typeOnly: true })

      const actualPaths = actual.map((file) => file.path)
      const expectedPaths = expected.map((x) => x.path)

      expect(actualPaths).toBeAnArrayWith(...expectedPaths)
      expect(expectedPaths).toBeAnArrayWith(...actualPaths)

      const actualDict = Object.fromEntries(actual.map((x) => [x.path, x.contents]))
      const expectedDict = Object.fromEntries(expected.map((x) => [x.path, x.contents]))

      for (const key of actualPaths) {
        expect(actualDict[key]).toEqual(expectedDict[key])
      }
    })
  })
})
