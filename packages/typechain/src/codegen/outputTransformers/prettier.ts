import { Options as PrettierOptions } from 'prettier'

import { OutputTransformer } from '.'

export const prettierOutputTransformer: OutputTransformer = (output, { prettier }, config) => {
  const prettierCfg: PrettierOptions = { ...(config.prettier || {}), parser: 'typescript' }

  return prettier.format(output, prettierCfg)
}
