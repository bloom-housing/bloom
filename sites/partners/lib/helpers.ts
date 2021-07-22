import { t } from "@bloom-housing/ui-components"
import moment from "moment"
import {
  AmiChart,
  ApplicationSubmissionType,
  ListingEventType,
  ListingEvent,
} from "@bloom-housing/backend-core/types"
import { TempUnit } from "../src/listings/PaperListingForm"
import { FormListing } from "../src/listings/PaperListingForm/index"

type DateTimePST = {
  hour: string
  minute: string
  second: string
  dayPeriod: string
  year: string
  day: string
  month: string
}

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const convertDataToPst = (dateObj: Date, type: ApplicationSubmissionType) => {
  if (!dateObj) {
    return {
      date: t("t.n/a"),
      time: t("t.n/a"),
    }
  }

  if (type === ApplicationSubmissionType.electronical) {
    // convert date and time to PST (electronical applications)
    const ptFormat = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      year: "numeric",
      day: "numeric",
      month: "numeric",
    })

    const originalDate = new Date(dateObj)
    const ptDateParts = ptFormat.formatToParts(originalDate)
    const timeValues = ptDateParts.reduce((acc, curr) => {
      Object.assign(acc, {
        [curr.type]: curr.value,
      })
      return acc
    }, {} as DateTimePST)

    const { month, day, year, hour, minute, second, dayPeriod } = timeValues

    const date = `${month}/${day}/${year}`
    const time = `${hour}:${minute}:${second} ${dayPeriod} PT`

    return {
      date,
      time,
    }
  }

  if (type === ApplicationSubmissionType.paper) {
    const momentDate = moment(dateObj)

    const date = momentDate.utc().format("MM/DD/YYYY")
    const time = momentDate.utc().format("hh:mm:ss A")

    return {
      date,
      time,
    }
  }
}

export const stringToNumber = (str: string | number | undefined): number => {
  return str ? Number(str) : 1
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

export const getAmiChartId = (chart: AmiChart | string | undefined): string | null => {
  if (chart === undefined) {
    return null
  }
  return chart instanceof Object ? chart.id : chart
}

export const isNullOrUndefined = (value: unknown): boolean => {
  return value === null || value === undefined
}

export const getLotteryEvent = (listing: FormListing): ListingEvent | undefined => {
  const lotteryEvents = listing?.events.filter(
    (event) => event.type === ListingEventType.publicLottery
  )
  return lotteryEvents ? lotteryEvents[0] : null
}
