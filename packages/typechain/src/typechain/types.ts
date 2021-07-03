import * as fs from 'fs'
import { sync as mkdirp } from 'mkdirp'
import * as prettier from 'prettier'
import { MarkOptional } from 'ts-essentials'

export interface Config {
  cwd: string
  target: string
  outDir?: string
  prettier?: object
  filesToProcess: string[] // filesToProcess is a subset of allFiles, used during incremental generating
  allFiles: string[]
  flags: CodegenConfig
}

export interface CodegenConfig {
  alwaysGenerateOverloads: boolean
  environment: 'hardhat' | undefined
}

export type PublicConfig = MarkOptional<Config, 'flags'>

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
