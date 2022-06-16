import { assert } from 'ts-essentials'

// It's not possible to turn off compiler warnings for unused symbols (imports) so we need to do extra work and don't generate any types where they are not needed
export function importer() {
  const requestedImports: { [moduleName: string]: Set<string> | undefined } = {}
  const runtimeImports: { [moduleName: string]: true | undefined } = {}
  const defaultImports: { [moduleName: string]: true | undefined } = {}

  function impoort(
    module: string,
    name: string,
    isRuntimeImport: boolean = false,
    isDefaultImport: boolean = false,
  ): string {
    if (!requestedImports[module]) {
      requestedImports[module] = new Set()
    }
    requestedImports[module]!.add(name)

    if (isRuntimeImport) {
      runtimeImports[module] = true
    }

    if (isDefaultImport) {
      defaultImports[module] = true
    }

    return name
  }

  function imports(): string {
    return Object.entries(requestedImports)
      .map(([moduleName, _symbols]): string => {
        const symbols = Array.from(_symbols!)
        const isRuntimeImport = !!runtimeImports[moduleName]

        if (!defaultImports[moduleName]) {
          return `import ${!isRuntimeImport ? 'type ' : ''}{${symbols.join(', ')}} from "${moduleName}"`
        } else {
          assert(symbols.length === 1, "Default symbols can't be mixed")
          return `import ${!isRuntimeImport ? 'type ' : ''}${symbols.join(', ')} from "${moduleName}"`
        }
      })
      .join('\n')
  }

  return {
    impoort,
    imports,
  }
}

export type Impoort = ReturnType<typeof importer>['impoort']
