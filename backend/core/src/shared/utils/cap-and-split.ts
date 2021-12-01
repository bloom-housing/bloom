import { capitalizeFirstLetter } from "./capitalize-first-letter"

export function capAndSplit(str: string): string {
  let newStr = capitalizeFirstLetter(str)
  newStr = newStr.split(/(?=[A-Z])/).join(" ")
  return newStr
}
