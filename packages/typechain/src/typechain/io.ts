import { mkdir, readFile, writeFile } from 'fs/promises'
import { isArray } from 'lodash'
import { dirname, relative } from 'path'

import { outputTransformers } from '../codegen/outputTransformers'
import { extractAbi } from '../parser/abiParser'
import { debug } from '../utils/debug'
import { Config, FileDescription, Output } from './types'

export async function processOutput(cfg: Config, output: Output): Promise<number> {
  if (!output) {
    return 0
  }

  const outputFds = isArray(output) ? output : [output]

  await Promise.all(
    outputFds.map(async (fd) => {
      // ensure directory first
      await mkdir(dirname(fd.path), { recursive: true })

      let finalOutput = fd.contents

      for (const transformer of outputTransformers) {
        finalOutput = await transformer(finalOutput, cfg)
      }

      debug(`Writing file: ${relative(cfg.cwd, fd.path)}`)

      await writeFile(fd.path, finalOutput)
    }),
  )

  return outputFds.length
}

export async function loadFileDescriptions(files: string[]): Promise<FileDescription[]> {
  const fileDescriptions: FileDescription[] = await Promise.all(
    files.map(async (path) => ({
      path,
      contents: await readFile(path, 'utf8'),
    })),
  )

  return fileDescriptions
}

export async function skipEmptyAbis(paths: string[]): Promise<string[]> {
  const notEmptyAbis = (
    await Promise.all(
      paths.map(async (p) => {
        return {
          path: p,
          contents: await readFile(p, { encoding: 'utf8' }),
        }
      }),
    )
  ).filter((fd) => extractAbi(fd.contents).length !== 0)

  return notEmptyAbis.map((p) => p.path)
}
