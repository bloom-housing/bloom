// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resolveObject = (path: string, obj: any, separator = ".") => {
  const properties = Array.isArray(path) ? path : path.split(separator)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return properties.reduce((prev, curr) => prev && prev[curr as any], obj)
}
