const colored = (escapeCode: string) => (text: string | number) => `\x1b[${escapeCode}m${text}\x1b[0m`

export const red = colored('31;4')
export const bold = colored('1')
export const brightItalic = colored('3m;90')
