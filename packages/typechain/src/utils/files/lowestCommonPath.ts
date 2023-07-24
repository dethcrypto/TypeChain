export function lowestCommonPath(paths: string[]) {
  const pathParts = paths.map((path) => path.split(/[\\/]/))
  const commonParts = [] as string[]
  const maxParts = Math.min.apply(
    null,
    pathParts.map((p) => p.length),
  )
  for (let i = 0; i < maxParts; i++) {
    const part = pathParts[0][i]
    if (pathParts.slice(1).every((otherPath) => otherPath[i] === part)) {
      commonParts.push(part)
    } else {
      break
    }
  }
  return commonParts.join('/')
}
