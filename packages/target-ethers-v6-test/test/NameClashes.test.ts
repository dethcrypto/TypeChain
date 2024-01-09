import type { BaseContract } from 'ethers'
import type { AssertTrue, Has } from 'test-utils'

import type { NameClashes } from '../types/v0.8.9/NameClashes'

type _testTarget = AssertTrue<Has<NameClashes['target'], BaseContract['target']>>
type _testRunner = AssertTrue<Has<NameClashes['runner'], BaseContract['runner']>>
type _testFilters = AssertTrue<Has<NameClashes['filters'], BaseContract['filters']>>
type _testGetAddress = AssertTrue<Has<NameClashes['getAddress'], BaseContract['getAddress']>>
type _testGetDeployedCode = AssertTrue<Has<NameClashes['getDeployedCode'], BaseContract['getDeployedCode']>>
type _testGetFunction = AssertTrue<Has<NameClashes['getFunction'], BaseContract['getFunction']>>
type _testOn = AssertTrue<Has<NameClashes['on'], BaseContract['on']>>
type _testOff = AssertTrue<Has<NameClashes['off'], BaseContract['off']>>
type _testOnce = AssertTrue<Has<NameClashes['once'], BaseContract['once']>>
type _testListeners = AssertTrue<Has<NameClashes['listeners'], BaseContract['listeners']>>

// "then" won't be passed through by ethers as it's listed in `passProperties` (see: https://github.com/ethers-io/ethers.js/blob/6ee1a5f8bb38ec31fa84c00aae7f091e1d3d6837/src.ts/contract/contract.ts#L779)
type _testThen = AssertTrue<'then' extends keyof NameClashes ? false : true>
