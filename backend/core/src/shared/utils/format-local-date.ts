import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import tz from "dayjs/plugin/timezone"
import advanced from "dayjs/plugin/advancedFormat"
import { isEmpty } from "./is-empty"
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(advanced)

export const formatLocalDate = (
  rawDate: string | Date,
  format: string,
  timeZone?: string
): string => {
  if (!isEmpty(rawDate)) {
    const utcDate = dayjs.utc(rawDate)
    if (!isEmpty(timeZone)) return utcDate.tz(timeZone.replace("-", "/")).format(format)
    return utcDate.format(format)
  }
  return ""
}
