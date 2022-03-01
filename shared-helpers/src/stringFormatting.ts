import dayjs from "dayjs"

export const getTimeRangeString = (start: Date, end: Date) => {
  const startTime = dayjs(start).format("hh:mma")
  const endTime = dayjs(end).format("hh:mma")
  return startTime === endTime ? startTime : `${startTime} - ${endTime}`
}
