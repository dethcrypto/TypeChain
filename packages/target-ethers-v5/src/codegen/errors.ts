import { createPositionalIdentifier, CustomErrorDeclaration, getSignatureForFn } from 'typechain'

import { generateOutputComplexTypesAsObject } from './types'

export function generateErrorTypeExports(errors: CustomErrorDeclaration[]) {
  if (errors.length === 1) {
    return generateErrorTypeExport(errors[0], false)
  } else {
    return errors.map((e) => generateErrorTypeExport(e, true)).join('\n')
  }
}

function generateErrorTypeExport(error: CustomErrorDeclaration, includeArgTypes: boolean) {
  const components = error.inputs.map((input) => ({ name: input.name, type: input.type }))
  const objectOutput = generateOutputComplexTypesAsObject(components, { useStructs: true }) || '{}'

  const identifier = generateErrorIdentifier(error, { includeArgTypes })

  return `
      export interface ${identifier}Object ${objectOutput};
    `
}

export function generateInterfaceErrorDescription(error: CustomErrorDeclaration): string {
  return `'${generateErrorSignature(error)}': ErrorFragment;`
}

export function generateErrorSignature(error: CustomErrorDeclaration): string {
  return `${error.name}(${error.inputs.map((input: any) => input.type.originalType).join(',')})`
}

export function generateErrorInputs(errorArgs: CustomErrorDeclaration['inputs']) {
  if (errorArgs.length === 0) {
    return ''
  }
  return (
    errorArgs
      .map((arg) => {
        return createPositionalIdentifier(arg.name)
      })
      .join(', ') + ', '
  )
}

export function generateGetError(error: CustomErrorDeclaration, useSignature: boolean): string {
  return `getError(nameOrSignature: '${useSignature ? generateErrorSignature(error) : error.name}'): ErrorFragment;`
}

function generateErrorIdentifier(
  error: CustomErrorDeclaration,
  { includeArgTypes }: { includeArgTypes?: boolean } = {},
) {
  if (includeArgTypes) {
    return getSignatureForFn(error) + '_Error'
  } else {
    return error.name + 'Error'
  }
}
