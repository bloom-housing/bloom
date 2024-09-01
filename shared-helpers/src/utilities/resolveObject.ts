// eslint-disable @typescript-eslint/no-explicit-any
export const resolveObject = (path: string, obj: any, separator = ".") => {
  const properties = Array.isArray(path) ? path : path.split(separator)
  return properties.reduce((prev, curr) => prev && prev[curr as any], obj)
}
