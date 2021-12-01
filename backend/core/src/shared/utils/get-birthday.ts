export function getBirthday(day, month, year) {
  let birthday = ""
  if (day && month && year) {
    birthday = `${month}/${day}/${year}`
  }
  return birthday
}
