# Changelog

## [0.3.9] - 2018-11-06
### Added
- [Web3] Allow null topics in typings

## [0.3.8] - 2018-10-21
### Added
- Support for ethers.js library
- [Truffle] update `truffle-typings` dependency, extend common ContractInstance type, other small fixes

## [0.3.7] - 2018-10-20
### Added
- Add support for tuples in ABI

## [0.3.6] - 2018-10-07
### Added
- [Truffle] Support for deploying contracts with default constructors (no args)
- [Web3] Add `_target` property existing on each smartcontract wrapper
- [CLI] Update `ts-generator` which greatly improve console output

## [0.3.5] - 2018-09-17
### Bugfix
- web3 target supports multiple files now

## [0.3.4] - 2018-09-13
### Changed
- fix regression in legacy target
- more tests against final package bundle

## [0.3.3] - 2018-09-13
### Added
- tests against final package bundle

### Changed
- fix package CLI option

## [0.3.2] - 2018-09-12
### Added
- `web3-1.0.0` target

## [0.3.1] - 2018-09-08
### Added
- support for multiple targets
- `truffle` target
- uses ts-generator under the hood

### Changed
- current output became `legacy` target
- remove `--force` options