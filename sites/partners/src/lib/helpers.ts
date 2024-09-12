import { t, TimeFieldPeriod } from "@bloom-housing/ui-components"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import tz from "dayjs/plugin/timezone"
import advanced from "dayjs/plugin/advancedFormat"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(advanced)
dayjs.extend(customParseFormat)

import { TempUnit } from "./listings/formTypes"
import { FieldError } from "react-hook-form"
import {
  Application,
  IncomePeriodEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export enum YesNoAnswer {
  "Yes" = "yes",
  "No" = "no",
}

type DateTimeLocal = {
  hour: string
  minute: string
  second: string
  dayPeriod: string
  year: string
  day: string
  month: string
}

interface FormOption {
  label: string
  value: string
}

export interface FormOptions {
  [key: string]: FormOption[]
}

export const convertDataToLocal = (dateObj: Date) => {
  if (!dateObj) {
    return {
      date: t("t.n/a"),
      time: t("t.n/a"),
    }
  }

  // convert date and time to user's local timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    year: "numeric",
    day: "numeric",
    month: "numeric",
  })

  const originalDate = new Date(dateObj)
  const dateParts = localFormat.formatToParts(originalDate)
  const timeValues = dateParts.reduce((acc, curr) => {
    Object.assign(acc, {
      [curr.type]: curr.value,
    })
    return acc
  }, {} as DateTimeLocal)

  const { month, day, year, hour, minute, second, dayPeriod } = timeValues
  const timeZoneFormatted = dayjs().tz(timeZone).format("z")

  const date = `${month}/${day}/${year}`
  const time = `${hour}:${minute}:${second} ${dayPeriod} ${timeZoneFormatted}`

  return {
    date,
    time,
  }
}

export const stringToNumber = (str: string | number | undefined | null): number => {
  return str ? Number(str) : null
}

export const stringToBoolean = (str: string | boolean | undefined): boolean => {
  return str === true || str === "true" || str === "yes"
}

export const booleanToString = (bool: boolean): string => {
  return bool === true ? "true" : "false"
}

export const getRentType = (unit: TempUnit): string | null => {
  return unit?.monthlyIncomeMin && unit?.monthlyRent
    ? "fixed"
    : unit?.monthlyRentAsPercentOfIncome
    ? "percentage"
    : null
}

export const isNullOrUndefined = (value: unknown): boolean => {
  return value === null || value === undefined
}

export function arrayToFormOptions<T>(
  arr: T[],
  label: string,
  value: string,
  translateLabel?: string
): FormOption[] {
  return arr.map((val: T) => ({
    label: translateLabel ? t(`${translateLabel}.${val[label]}`) : val[label],
    value: val[value],
  }))
}

/**
 * Create Date object with date and time which comes from the TimeField component
 */
export const createTime = (
  date: Date,
  formTime: { hours: string; minutes: string; period: TimeFieldPeriod }
) => {
  if (!formTime?.hours || !formTime.minutes || !date) return null

  let formattedHours = parseInt(formTime.hours)
  if (formTime.period === "am" && formattedHours === 12) {
    formattedHours = 0
  }
  if (formTime.period === "pm" && formattedHours !== 12) {
    formattedHours = formattedHours + 12
  }

  return dayjs(date).hour(formattedHours).minute(parseInt(formTime.minutes)).toDate()
}

/**
 * Create Date object depending on DateField component
 */
export const createDate = (formDate: { year: string; month: string; day: string }) => {
  const year = formDate?.year
  let month = formDate?.month
  let day = formDate?.day
  if (!formDate || !year || !month || !day || year.length !== 4) return null

  if (day.length === 1) day = `0${day}`
  if (month.length === 1) month = `0${month}`

  const date = dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD", true)
  if (!date.isValid()) return null

  return date.toDate()
}

export function formatIncome(
  value: number,
  currentType: IncomePeriodEnum,
  returnType: IncomePeriodEnum
) {
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  if (returnType === "perMonth") {
    const monthIncomeNumber = currentType === "perYear" ? value / 12 : value
    return usd.format(monthIncomeNumber)
  } else {
    const yearIncomeNumber = currentType === "perMonth" ? value * 12 : value
    return usd.format(yearIncomeNumber)
  }
}

export const isObject = (obj: any, key: string) => {
  return (
    obj[key] &&
    typeof obj[key] === "object" &&
    !Array.isArray(obj[key]) &&
    !(Object.prototype.toString.call(obj[key]) === "[object Date]")
  )
}

/**
 *
 * @param obj - Any object
 *
 *  End result is an object with these rules for fields:
 *    No empty objects - removed
 *    No objects that only have fields with null / empty strings - removed
 *    No null/undefined fields - removed
 *    No empty strings - set to null but still included
 *    Arrays / non-empty strings / Date objects - no changes
 */
export const removeEmptyObjects = (obj: any, nested?: boolean) => {
  Object.keys(obj).forEach((key) => {
    if (isObject(obj, key)) {
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      } else {
        removeEmptyObjects(obj[key], true)
      }
    }
    if (isObject(obj, key) && Object.keys(obj[key]).length === 0) {
      delete obj[key]
    }
    if (obj[key] === null || obj[key] === undefined) {
      if (nested) {
        delete obj[key]
      }
    }

    if (obj[key] === "") {
      if (nested) {
        delete obj[key]
      } else {
        obj[key] = null
      }
    }
  })
}

export const fieldHasError = (errorObj: FieldError) => {
  return errorObj !== undefined
}

export const fieldMessage = (errorObj: FieldError) => {
  return errorObj?.message
}

export function pdfFileNameFromFileId(fileId: string) {
  // Pull out the part after the last "/"
  let name = fileId.split("/").slice(-1).join()

  // If it doesn't already end with ".pdf", add it
  if (!name.endsWith(".pdf")) {
    name += ".pdf"
  }

  return name
}

export const mergeApplicationNames = (applications: Application[]) => {
  if (!applications?.length) return ""

  const names = applications.reduce((acc, curr) => {
    acc.push(`${curr.applicant.firstName} ${curr.applicant.lastName}`)
    return acc
  }, [])

  return `${names.join(", ")}`
}
