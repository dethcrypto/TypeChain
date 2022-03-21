import * as fs from 'fs'
import { sync as mkdirp } from 'mkdirp'
import * as prettier from 'prettier'
import { MarkOptional } from 'ts-essentials'

export interface Config {
  cwd: string
  target: string
  outDir?: string | undefined
  prettier?: object | undefined
  filesToProcess: string[] // filesToProcess is a subset of allFiles, used during incremental generating
  allFiles: string[]
  /**
   * Optional path to directory with ABI files.
   * If not specified, inferred to be lowest common path of all input files.
   */
  inputDir: string
  flags: CodegenConfig
}

// @note: these options ale mostly supported only by ethers-v5 target
export interface CodegenConfig {
  alwaysGenerateOverloads: boolean
  discriminateTypes: boolean // ethers-v5 will add an artificial field `contractName` that helps discriminate between contracts
  tsNocheck?: boolean
  environment: 'hardhat' | undefined
}

export type PublicConfig = MarkOptional<Config, 'flags' | 'inputDir'>

export abstract class TypeChainTarget {
  public abstract readonly name: string

  constructor(public readonly cfg: Config) {}

  beforeRun(): Output | Promise<Output> {}
  afterRun(): Output | Promise<Output> {}

  abstract transformFile(file: FileDescription): Output | Promise<Output>
}

export type Output = void | FileDescription | FileDescription[]

export interface FileDescription {
  path: string
  contents: string
}

export interface Services {
  fs: typeof fs
  prettier: typeof prettier
  mkdirp: typeof mkdirp
}
