import BigNumber from 'bignumber.js'
import { expect } from 'earljs'
import { isString, mapValues, omitBy } from 'lodash'
import { Dictionary } from 'ts-essentials'

/**
 * Asserts values AND types equality.
 * It has some special handling for BigNumber :SHRUG: The reason for this is that I wanted to avoid creating specific functions for bignumbers which would force for me to export BigNumber in types (instead of just having it as generic type) WHICH is always PITA.
 */
export function typedAssert<T>(actual: T, expected: T): void {
  if (isBigNumber(actual) && isBigNumber(expected)) {
    expect((actual as any).toString()).toEqual((expected as any).toString())
    return
  }

  if (isBigNumberArray(actual) && isBigNumberArray(expected)) {
    expect(actual.map((a) => a.toString())).toEqual(expected.map((a) => a.toString()))
    return
  }

  if (isBigNumberObject(actual) && isBigNumberObject(expected)) {
    const actualFiltered = omitBy(actual as any, (v, k) => k.startsWith('__'))
    expect(mapValues(actualFiltered as any, (a) => a.toString())).toEqual(
      mapValues(expected as any, (a) => a.toString()),
    )
    return
  }

  expect(actual).toLooseEqual(expected)
}

export function isBigNumber(v: any): boolean {
  return v.constructor.name === 'BigNumber' || v.constructor.name === 'BN'
}

export function isBigNumberArray(v: any): v is Array<any> {
  return (
    v instanceof Array &&
    isBigNumber(v[0]) &&
    // ethers returns array with additional properties on them. We dont wat to treat those as arrays
    Object.keys(v).length === v.length
  )
}

export function isBigNumberObject(val: any): val is Dictionary<any> {
  if (!(val instanceof Object) || !val) {
    return false
  }

  for (const [k, v] of Object.entries(val)) {
    // filter out dummy properties Web3js (truffle v5) in it
    if (isString(k) && k.startsWith('__')) {
      continue
    }
    if (!isBigNumber(v)) {
      return false
    }
  }

  return true
}

export function q18(n: number): string {
  return new BigNumber(n).multipliedBy(new BigNumber(10).pow(new BigNumber(18))).toString()
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
