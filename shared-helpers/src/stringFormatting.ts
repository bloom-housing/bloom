import dayjs from "dayjs"

export const getTimeRangeString = (start: Date, end: Date) => {
  const startTime = dayjs(start).format("hh:mma")
  const endTime = dayjs(end).format("hh:mma")
  return startTime === endTime ? startTime : `${startTime} - ${endTime}`
}

export const getCurrencyRange = (min: number | null, max: number | null) => {
  if (min && max && min !== max) {
    return `$${min} – $${max}`
  }
  return min || max ? `$${min ?? max}` : ""
}
