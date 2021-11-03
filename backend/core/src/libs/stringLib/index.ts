export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function capAndSplit(str: string): string {
  let newStr = capitalizeFirstLetter(str)
  newStr = newStr.split(/(?=[A-Z])/).join(" ")
  return newStr
}
