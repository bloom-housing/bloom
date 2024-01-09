import dayjs from "dayjs"
import { formatLocalDate } from "../shared/utils/format-local-date"
import { ApplicationSubmissionType, GeocodingValues } from "../../types"
import { isEmpty } from "class-validator"

export const formatApplicationDate = (
  submissionType: ApplicationSubmissionType,
  dateString: string,
  timeZone?: string
) => {
  if (isEmpty(dateString)) return ""
  if (submissionType === "electronical") {
    return formatLocalDate(dateString, "MM-DD-YYYY hh:mm:ssA z", timeZone)
  }
  return dayjs(dateString).format("MM-DD-YYYY hh:mm:ssA")
}

export const formatGeocodingValues = (key: GeocodingValues) => {
  switch (key) {
    case GeocodingValues.true:
      return "Yes"
    case GeocodingValues.false:
      return "No"
    case GeocodingValues.unknown:
    default:
      return "Needs Manual Verification"
  }
}
