import { spawnSync } from 'child_process'
import { readdirSync } from 'fs'
import * as path from 'path'

import { bold, red } from './_common'

const VERBOSE = process.env.VERBOSE === 'true'

const examplesDir = path.resolve(__dirname, '../examples')

const failures: string[] = []

for (const dir of readdirSync(examplesDir)) {
  console.log(`Checking example: ${dir}`)

  const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn'
  const childProcess = spawnSync(yarn, ['--non-interactive'], {
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

if (failures.length > 0) {
  console.error(
    '\n',
    bold(failures.length) + ` example${failures.length > 1 ? 's' : ''} failed:`,
    red(failures.join(', ')),
    '\n',
  )
  process.exit(1)
}

function formatOutput(output: string[]) {
  return output.filter(Boolean).join('\n')
}
