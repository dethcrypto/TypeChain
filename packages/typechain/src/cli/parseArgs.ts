import { parse as commandLineArgs } from 'ts-command-line-args'

const DEFAULT_GLOB_PATTERN = '**/*.abi'

export interface ParsedArgs {
  files: string[]
  target: string
  outDir?: string | undefined
  flags: {
    alwaysGenerateOverloads: boolean
    tsNocheck: boolean
  }
}

export function parseArgs(): ParsedArgs {
  const rawOptions = commandLineArgs<CommandLineArgs>(
    {
      glob: {
        type: String,
        defaultOption: true,
        multiple: true,
        defaultValue: [DEFAULT_GLOB_PATTERN],
        description:
          'Pattern that will be used to find ABIs. Remember about adding quotes: typechain "**/*.json", examples: ./abis/**/*.abi, ./abis/?(Oasis.abi|OasisHelper.abi).',
      },
      target: {
        type: String,
        description:
          'One of ethers-v4, ethers-v5, truffle-v4, truffle-v5, web3-v1 or path to your custom target. Typechain will try to load package named: @typechain/<target>, so make sure that desired package is installed.',
      },
      'out-dir': { type: String, optional: true, description: 'Output directory for generated files.' },
      'always-generate-overloads': {
        type: Boolean,
        defaultValue: false,
        description: `Some targets won't generate unnecessary types for overloaded functions by default, this option forces to always generate them.`,
      },
      /** This is read directly from process.argv in cli.ts */
      'show-stack-traces': { type: Boolean, defaultValue: false },
      'ts-nocheck': {
        type: Boolean,
        defaultValue: false,
        description:
          'Prepend "@ts-nocheck" comment to generated files to opt-out of typechecking them in your project.',
      },
      help: { type: Boolean, defaultValue: false, alias: 'h', description: 'Prints this message.' },
    },
    {
      helpArg: 'help',
      headerContentSections: [
        {
          content: `\
          TypeChain generates TypeScript types for Ethereum contract ABIs.
          Thank you for using it!`,
        },
      ],
      footerContentSections: [
        {
          header: 'Example Usage',
          content: `\
          typechain --target ethers-v5 --out-dir app/contracts './contracts/*.json'


          You can read more about TypeChain at {underline https://github.com/dethcrypto/TypeChain}.`,
        },
      ],
    },
  )

  return {
    files: rawOptions.glob,
    outDir: rawOptions['out-dir'],
    target: rawOptions.target,
    flags: {
      alwaysGenerateOverloads: rawOptions['always-generate-overloads'],
      tsNocheck: rawOptions['ts-nocheck'],
    },
  }
}

interface CommandLineArgs {
  glob: string[]
  target: string
  'out-dir'?: string
  'show-stack-traces': boolean
  'always-generate-overloads': boolean
  'ts-nocheck': boolean
  help: boolean
}
