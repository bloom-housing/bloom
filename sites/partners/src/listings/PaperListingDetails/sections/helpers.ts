import { t } from "@bloom-housing/ui-components"
import dayjs from "dayjs"

export const getDetailFieldNumber = (listingNumber: number) => {
  return listingNumber ? listingNumber.toString() : t("t.none")
}

export const getDetailFieldString = (listingString: string) => {
  return listingString && listingString !== "" ? listingString : t("t.none")
}

export const getDetailFieldDate = (listingDate: Date) => {
  return listingDate ? dayjs(new Date(listingDate)).format("MM/DD/YYYY") : t("t.none")
}

export const getDetailFieldTime = (listingTime: Date) => {
  return listingTime ? dayjs(new Date(listingTime)).format("hh:mm A") : t("t.none")
}

export const getDetailBoolean = (listingBool: boolean) => {
  return listingBool === true ? t("t.yes") : listingBool === false ? t("t.no") : t("t.n/a")
}

export const getReadableErrorMessage = (errorMessage: string | undefined) => {
  const errorDetails = errorMessage.substr(errorMessage.indexOf(" ") + 1)
  let readableMessage = null
  switch (errorDetails) {
    case "must be an email":
      readableMessage = t("errors.emailAddressError")
      break
    case "must be a valid phone number":
      readableMessage = t("errors.phoneNumberError")
      break
    default:
      readableMessage = t("errors.requiredFieldError")
  }
  return readableMessage
}
