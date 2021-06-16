import { OutputTransformer } from '.'

export const sourceFilesOutputTransformer: OutputTransformer = (output, services, config) => {
  return [
    `/*`,
    `  These types correspond to solidity contract code from source file:`,
    `  ${config.sourceFile}`,
    `*/`,
    output
  ].join('\n')
}
