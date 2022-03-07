/* eslint-disable no-console */

import { spawnSync } from 'child_process'
import { readdirSync } from 'fs'
import * as path from 'path'

import { bold, brightItalic, red } from './_common'

const VERBOSE = process.env.VERBOSE === 'true'

const examplesDir = path.resolve(__dirname, '../examples')

const failures: string[] = []

for (const dir of readdirSync(examplesDir)) {
  console.log(`Checking example: ${bold(dir)}`)

  const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn'
  runProcess(
    [
      yarn,
      '--non-interactive',
      // temporarily removed: this seems to cause issues on the CI
      // '--frozen-lockfile',
    ],
    dir,
  )
  runProcess([yarn, 'typecheck'], dir)
}

if (failures.length > 0) {
  console.error(
    '\n',
    bold(failures.length) + ` example${failures.length > 1 ? 's' : ''} failed:`,
    red(failures.join(', ')),
    '\n',
  )
  process.exit(1)
}

function runProcess(command: string[], dir: string) {
  console.log(brightItalic(command.join(' ')))

  const [program, ...args] = command
  const childProcess = spawnSync(program, args, {
    cwd: path.resolve(examplesDir, dir),
    encoding: 'utf-8',
    env: {
      ...process.env,
      FORCE_COLOR: 'true',
    },
  })

  if (childProcess.error) throw childProcess.error

  if (childProcess.status === 0) {
    console.log(bold('✅ Success'))
    if (VERBOSE) {
      console.log(formatOutput(childProcess.output))
    }
  } else {
    failures.push(dir)
    console.error(bold(`❌ Failed with status ${childProcess.status} and output:` + '\n'))
    console.error(formatOutput(childProcess.output))
  }
}

function formatOutput(output: string[]) {
  return output.filter(Boolean).join('\n')
}
