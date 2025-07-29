import { SetStateAction } from "react"
import { t, TimeFieldPeriod } from "@bloom-housing/ui-components"
import { cloudinaryUrlFromId } from "@bloom-housing/shared-helpers"
import { CloudinaryUpload } from "./listings/CloudinaryUpload"
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
import { FieldError, UseFormMethods } from "react-hook-form"
import {
  Application,
  AssetsService,
  IncomePeriodEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import * as styles from "../components/listings/PaperListingForm/ListingForm.module.scss"

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

interface FileUploaderParams {
  file: File
  setCloudinaryData: (data: SetStateAction<{ id: string; url: string }>) => void
  setProgressValue: (value: SetStateAction<number>) => void
}

/**
 * Accept a file from the Dropzone component along with data and progress state
 * setters. It will then handle obtaining a signature from the backend and
 * uploading the file to Cloudinary, setting progress along the way and the
 * id/url of the file when the upload is complete.
 */
export const cloudinaryFileUploader = async ({
  file,
  setCloudinaryData,
  setProgressValue,
}: FileUploaderParams) => {
  const cloudName = process.env.cloudinaryCloudName
  const uploadPreset = process.env.cloudinarySignedPreset

  setProgressValue(1)

  const timestamp = Math.round(new Date().getTime() / 1000)
  const tag = "browser_upload"

  const assetsService = new AssetsService()
  const params = {
    timestamp,
    tags: tag,
    upload_preset: uploadPreset,
  }

  const resp = await assetsService.createPresignedUploadMetadata({
    body: { parametersToSign: params },
  })
  const signature = resp.signature

  setProgressValue(3)

  void CloudinaryUpload({
    signature,
    apiKey: process.env.cloudinaryKey,
    timestamp,
    file,
    onUploadProgress: (progress) => {
      setProgressValue(progress)
    },
    cloudName,
    uploadPreset,
    tag,
  }).then((response) => {
    setProgressValue(100)
    setCloudinaryData({
      id: response.data.public_id,
      url: cloudinaryUrlFromId(response.data.public_id),
    })
  })
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const fieldIsRequired = (fieldName: string, requiredFields: string[]) => {
  return requiredFields?.indexOf(fieldName) >= 0
}

export const getRequiredSubNote = (fieldName: string, requiredFields: string[]) => {
  return fieldIsRequired(fieldName, requiredFields) ? t("listings.requiredToPublish") : null
}

export const getLabel = (
  fieldName: string,
  requiredFields: string[],
  label: string,
  noStyling?: boolean
) => {
  return fieldIsRequired(fieldName, requiredFields) ? addAsterisk(label, noStyling) : label
}

export const addAsterisk = (label: string, noStyling?: boolean) => {
  if (noStyling) return `${label} *`
  return (
    <span>
      {label}
      <span className={styles["asterisk"]}>{` *`}</span>
    </span>
  )
}

export const defaultFieldProps = (
  fieldKey: string,
  label: string,
  requiredFields: string[],
  errors: UseFormMethods["errors"],
  clearErrors: (name?: string | string[]) => void,
  forceRequired?: boolean,
  noStyling?: boolean
) => {
  const hasError = fieldHasError(errors ? errors[fieldKey] : null)
  return {
    id: fieldKey,
    name: fieldKey,
    label: forceRequired
      ? addAsterisk(label, noStyling)
      : getLabel(fieldKey, requiredFields, label, noStyling),
    error: hasError,
    errorMessage: fieldMessage(errors ? errors[fieldKey] : null),
    inputProps: {
      onChange: () => hasError && clearErrors(fieldKey),
      "aria-required": forceRequired || fieldIsRequired(fieldKey, requiredFields),
    },
  }
}

export const getAddressErrorMessage = (
  fieldKey: string,
  rootKey: string,
  defaultMessage: string,
  errors: UseFormMethods["errors"],
  getValues: UseFormMethods["getValues"]
) => {
  const hasError = errors ? errors[rootKey] : null
  const message = hasError && !getValues(fieldKey) ? t("errors.partialAddress") : defaultMessage
  return message
}

export const fieldMessage = (errorObj: FieldError) => {
  return errorObj?.message
}

export const mergeApplicationNames = (applications: Application[]) => {
  if (!applications?.length) return ""

  const names = applications.reduce((acc, curr) => {
    acc.push(`${curr.applicant.firstName} ${curr.applicant.lastName}`)
    return acc
  }, [])

  return `${names.join(", ")}`
}
