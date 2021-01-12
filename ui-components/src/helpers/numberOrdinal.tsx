export const numberOrdinal = (num: number): string => {
  const standardSuffix = "th"
  const oneToThreeSuffixes = ["st", "nd", "rd"]

  const numStr = num.toString()
  const lastTwoDigits = parseInt(numStr.slice(-2), 10)
  const lastDigit = parseInt(numStr.slice(-1), 10)

  let suffix = ""
  if (lastDigit >= 1 && lastDigit <= 3 && !(lastTwoDigits >= 11 && lastTwoDigits <= 13)) {
    suffix = oneToThreeSuffixes[lastDigit - 1]
  } else {
    suffix = standardSuffix
  }

  return `${num}${suffix}`
}
