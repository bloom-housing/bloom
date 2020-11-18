/* eslint-disable @typescript-eslint/no-explicit-any */
export const setProperty = (
  obj: Record<string, any>,
  replacePath: string | string[],
  value: any
) => {
  if (Object(obj) !== obj) return obj

  let path: string[] = []

  if (!Array.isArray(replacePath)) path = replacePath.toString().match(/[^.[\]]+/g) || []

  path
    .slice(0, -1)
    .reduce(
      (a, c, i) =>
        Object(a[c]) === a[c]
          ? a[c]
          : (a[c] = Math.abs(+path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
      obj
    )[path[path.length - 1]] = value
  return obj
}
