export function bold(text: string | number) {
  return '\u001b[1m' + String(text) + '\u001b[0m'
}

export function red(text: string | number) {
  return '\u001b[31;4m' + String(text) + '\u001b[0m'
}
