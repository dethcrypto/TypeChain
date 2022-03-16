import type { ISimpleToken, SimpleToken } from '../types'

// test if we can assign exact implementation to typing of an interface aka polymorphism
type ExactImplementation = SimpleToken
type Interface = ISimpleToken
// I am sure this can be written in a more civilized way...
const _test: Interface = undefined as any as ExactImplementation
