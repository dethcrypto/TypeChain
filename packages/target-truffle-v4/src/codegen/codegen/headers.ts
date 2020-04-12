import { Contract } from 'typechain'

export function codegenArtifactHeaders(contracts: Contract[]): string {
  return `
  import * as TruffleContracts from ".";

  declare global {
    namespace Truffle {
      interface Artifacts {
        ${contracts.map((f) => `require(name: "${f.name}"): TruffleContracts.${f.name}Contract;`).join('\n')}
      }
    }
  }
  `
}
