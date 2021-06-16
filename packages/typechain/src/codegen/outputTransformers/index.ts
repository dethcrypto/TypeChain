import { Config, Services } from '../../typechain/types'
import { addPreambleOutputTransformer } from './preamble'
import { prettierOutputTransformer } from './prettier'
import { sourceFilesOutputTransformer } from './sourceFile'

export type OutputTransformer = (output: string, services: Services, cfg: Config) => string

export const outputTransformers = [
  sourceFilesOutputTransformer,
  addPreambleOutputTransformer,
  prettierOutputTransformer,
]
