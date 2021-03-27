import * as fs from 'fs'
import * as prettier from 'prettier'
import { sync as mkdirp } from 'mkdirp'

export interface Config {
  cwd: string
  target: string
  outDir?: string
  prettier?: object
  filesToProcess: string[] // filesToProcess is a subset of allFiles, used during incremental generating
  allFiles: string[]
}

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
