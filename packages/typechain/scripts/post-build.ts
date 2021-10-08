import { chmodSync, copyFileSync } from 'fs'
import { resolve } from 'path'

const packageDir = resolve(__dirname, '..')
const distDir = resolve(packageDir, 'dist')
const rootDir = resolve(packageDir, '..', '..')

chmodSync(resolve(distDir, 'cli/cli.js'), 0o755)
copyFileSync(resolve(rootDir, 'README.md'), resolve(packageDir, 'README.md'))
