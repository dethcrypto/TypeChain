import { readFileSync } from 'fs'
import { sync as globSync } from 'glob'
import { join } from 'path'

const abiDirPath = join(__dirname, '../../../contracts/compiled')

export function loadContract(contractName: string): { code: string; abi: any } {
  const abiPaths = globSync(`${abiDirPath}/**/${contractName}.abi`)
  if (abiPaths.length === 0) {
    throw new Error(`ABI for ${contractName} not found in ${abiDirPath}`)
  } else if (abiPaths.length > 1) {
    throw new Error(`Multiple ABIs for ${contractName} found in ${abiDirPath}`)
  }

  const [abiPath] = abiPaths
  const abi = JSON.parse(readFileSync(abiPath, 'utf-8'))
  const bin = readFileSync(abiPath.replace(/\.abi$/, '.bin'), 'utf-8')
  const code = '0x' + bin

  return { code, abi }
}
