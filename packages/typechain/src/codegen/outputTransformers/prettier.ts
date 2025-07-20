import { format,Options as PrettierOptions } from 'prettier'

import { OutputTransformer } from '.'

export const prettierOutputTransformer: OutputTransformer = (output, config) => {
  const prettierCfg: PrettierOptions = { ...(config.prettier || {}), parser: 'typescript' }

  return format(output, prettierCfg)
}
