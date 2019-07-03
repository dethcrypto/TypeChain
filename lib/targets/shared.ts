import { parse } from "path";

export interface IContext {
  fileName: string;
  relativeRuntimePath: string;
}

export function getFilename(path: string) {
  return parse(path).name;
}

export function getFileExtension(path: string) {
  return parse(path).ext;
}
