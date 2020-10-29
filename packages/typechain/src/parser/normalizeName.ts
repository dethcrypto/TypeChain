import { upperFirst } from 'lodash'

/**
 * Converts valid file names to valid javascript symbols and does best effort to make them readable. Example: ds-token.test becomes DsTokenTest
 */
export function normalizeName(rawName: string): string {
  const transformations: ((s: string) => string)[] = [
    (s) => s.split(' ').join('-'), // spaces to - so later we can automatically convert them
    (s) => s.replace(/^\d+/, ''), // removes leading digits
    (s) => deleteCharacterAndCaptializeNextCharacter(s, '-'),
    (s) => deleteCharacterAndCaptializeNextCharacter(s, '_'),
    (s) => deleteCharacterAndCaptializeNextCharacter(s, '.'),
    (s) => upperFirst(s),
  ]

  const finalName = transformations.reduce((s, t) => t(s), rawName)

  if (finalName === '') {
    throw new Error(`Can't guess class name, please rename file: ${rawName}`)
  }

  return finalName
}

function deleteCharacterAndCaptializeNextCharacter(string: string, toDeleteChar: string): string {
  let newStr = ''
  let toCapitalize = false

  for (let i = 0; i < string.length; i++) {
    const currentChar = string.charAt(i)
    if (currentChar !== toDeleteChar) {
      newStr += toCapitalize ? currentChar.toUpperCase() : currentChar
      toCapitalize = false
    } else {
      toCapitalize = true
    }
  }

  return newStr
}
