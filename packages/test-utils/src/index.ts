import { expect } from 'chai'

/**
 * Asserts values AND types equality.
 * It has some special handling for BigNumber :SHRUG: The reason for this is that I wanted to avoid creating specific functions for bignumbers which would force for me to export BigNumber in types (instead of just having it as generic type) WHICH is always PITA.
 */
export function typedAssert<T>(actual: T, expected: T): void {
  if (isBigNumber(actual) && isBigNumber(expected)) {
    expect((actual as any).toString()).to.be.deep.eq((expected as any).toString())
    return
  }

  if (isBigNumberArray(actual) && isBigNumberArray(expected)) {
    expect(actual.map((a) => a.toString())).to.be.deep.eq(expected.map((a) => a.toString()))
    return
  }

  expect(actual).to.be.deep.eq(expected)
}

export function isBigNumber(v: any): boolean {
  return v.constructor.name === 'BigNumber'
}

export function isBigNumberArray(v: any): v is Array<any> {
  return v instanceof Array && v[0].constructor.name === 'BigNumber'
}

export function q18(n: number): string {
  const BigNumber = require('bignumber.js')
  return new BigNumber(n).mul(new BigNumber(10).pow(new BigNumber(18))).toString()
}

// async mocha test case both with done and promise
export function asyncWithDoneCase(fn: (done: Function) => Promise<any>) {
  return (done: Function) => {
    fn(done).catch((e) => {
      done(e)
    })
  }
}

// ignore mocha test case as it should only test types
export function typeCase(_fn: Function) {
  return () => {}
}
