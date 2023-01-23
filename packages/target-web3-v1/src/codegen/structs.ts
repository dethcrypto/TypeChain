import { groupBy } from 'lodash'
import { StructName, StructType } from 'typechain'

import { STRUCT_INPUT_POSTFIX, STRUCT_OUTPUT_POSTFIX } from '../common'
import { codegenInputType, codegenOutputType } from './types'

export function generateStructTypes(structs: StructType[]) {
  const namedStructs = structs.filter((s): s is StructWithName => !!s.structName)
  const namespaces = groupBy(namedStructs, (s) => s.structName.namespace)

  const exports: string[] = []

  if ('undefined' in namespaces) {
    exports.push(namespaces['undefined'].map((s) => generateExports(s)).join('\n'))
    delete namespaces['undefined']
  }

  for (const namespace of Object.keys(namespaces)) {
    exports.push(`\nexport declare namespace ${namespace} {
      ${namespaces[namespace].map((s) => generateExports(s)).join('\n')}
    }`)
  }

  return exports.join('\n')
}

function generateExports(struct: StructWithName): string {
  const { identifier } = struct.structName

  const inputName = `${identifier}${STRUCT_INPUT_POSTFIX}`
  const outputName = `${identifier}${STRUCT_OUTPUT_POSTFIX}`
  const outputNameArray = `${outputName}Array`;
  const outputNameObject = `${outputName}Struct`;
  const inputType = codegenInputType({ useStructs: false }, struct)
  const outputType = codegenOutputType({ useStructs: false }, struct)

  const [outputTypeArray,outputTypeObject] = outputType.split('&');

  return `
    export type ${inputName} = ${inputType}

    export type ${outputNameArray} = ${outputTypeArray}
    export type ${outputNameObject} = ${outputTypeObject}
    export type ${outputName} = ${outputNameArray} & ${outputNameObject}
  `
}

type StructWithName = StructType & { structName: StructName }
