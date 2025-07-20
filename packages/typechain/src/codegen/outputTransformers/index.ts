import { Config } from '../../typechain/types'
import { addPreambleOutputTransformer } from './preamble'
import { prettierOutputTransformer } from './prettier'

export type OutputTransformer = (output: string, cfg: Config) => string | Promise<string>

export const outputTransformers = [addPreambleOutputTransformer, prettierOutputTransformer]
