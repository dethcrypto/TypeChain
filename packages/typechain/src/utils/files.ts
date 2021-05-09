import { isAbsolute, join, parse } from 'path'

export function getFilename(path: string) {
  return parse(path).name
}

export function getFileExtension(path: string) {
  return parse(path).ext
}

export function ensureAbsPath(path: string): string {
  if (isAbsolute(path)) {
    return path
  }
  return join(process.cwd(), path)
}
