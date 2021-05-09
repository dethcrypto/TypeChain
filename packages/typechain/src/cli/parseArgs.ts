import commandLineArgs from 'command-line-args'

const DEFAULT_GLOB_PATTERN = '**/*.abi'

export interface IOptions {
  files: string[]
  target: string
  outDir?: string
  flags: {
    alwaysGenerateOverloads: boolean
  }
}

export function parseArgs(): IOptions {
  const optionDefinitions = [
    { name: 'glob', type: String, defaultOption: true, multiple: true },
    { name: 'target', type: String },
    { name: 'out-dir', type: String },
    { name: 'show-stack-traces', type: Boolean },
    { name: 'always-generate-overloads', type: Boolean },
  ]

  const rawOptions = commandLineArgs(optionDefinitions)

  return {
    files: rawOptions.glob || [DEFAULT_GLOB_PATTERN],
    outDir: rawOptions['out-dir'],
    target: rawOptions.target,
    flags: {
      alwaysGenerateOverloads: rawOptions['always-generate-overloads'] || false,
    },
  }
}
