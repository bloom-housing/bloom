import { t } from "@bloom-housing/ui-components"
import moment from "moment"

export const getDetailFieldNumber = (listingNumber: number) => {
  return listingNumber ? listingNumber.toString() : t("t.none")
}

export const getDetailFieldString = (listingString: string) => {
  return listingString && listingString !== "" ? listingString : t("t.none")
}

export const getDetailFieldDate = (listingDate: Date) => {
  return listingDate ? moment(new Date(listingDate)).utc().format("MM/DD/YYYY") : t("t.none")
}

export const getDetailFieldTime = (listingTime: Date) => {
  return listingTime ? moment(new Date(listingTime)).format("hh:mm:ss A") : t("t.none")
}

export const getDetailBoolean = (listingBool: boolean) => {
  return listingBool === true ? t("t.yes") : listingBool === false ? t("t.no") : t("t.n/a")
}

export const getReadableErrorMessage = (errorMessage: string | undefined) => {
  const errorDetails = errorMessage.substr(errorMessage.indexOf(" ") + 1)
  let readableMessage = null
  switch (errorDetails) {
    case "should not be null or undefined":
    case "must be a string":
    case "must be an UUID":
    case "must contain at least 1 elements":
    case "must be a boolean value":
      readableMessage = t("errors.requiredFieldError")
      break
    case "must be an email":
      readableMessage = t("errors.emailAddressError")
      break
    case "must be a valid phone number":
      readableMessage = t("errors.phoneNumberError")
  }
  return readableMessage
}
