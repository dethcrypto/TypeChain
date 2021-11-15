import { expect } from 'earljs'

import { createImportsForUsedIdentifiers } from '../../src'

describe(createImportsForUsedIdentifiers.name, () => {
  it('works', () => {
    expect(
      createImportsForUsedIdentifiers(
        {
          'my-module': ['A', 'B', 'C'],
          'other-module': ['D', 'E', 'F'],
        },
        `
          const a = new A(B.property);
          class Eeek extends E {
            constructor(private readonly f: F) {
            }
          }
        `,
      ).trim(),
    ).toEqual(
      `
import { A, B } from "my-module"
import { E, F } from "other-module"
    `.trim(),
    )
  })
})
