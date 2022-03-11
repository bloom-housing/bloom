export function formatRange(
  min: string | number,
  max: string | number,
  prefix: string,
  postfix: string
): string {
  if (!isDefined(min) && !isDefined(max)) return ""
  if (min == max || !isDefined(max)) return `${prefix}${min}${postfix}`
  if (!isDefined(min)) return `${prefix}${max}${postfix}`
  return `${prefix}${min}${postfix} - ${prefix}${max}${postfix}`
}

export function isDefined(item: number | string): boolean {
  return item !== null && item !== undefined && item !== ""
}
