export const capitalize = (str: string): string => {
  if (str.toString().length > 0) {
    return str[0].toUpperCase() + str.slice(1)
  } else {
    return ""
  }
}
