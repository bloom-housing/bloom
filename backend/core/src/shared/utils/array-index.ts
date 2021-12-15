export function arrayIndex<T>(array: Array<T>, key: string): Partial<T> {
  return array.reduce((object: Partial<T>, element: unknown) => {
    object[element[key]] = element
    return object
  }, {})
}
