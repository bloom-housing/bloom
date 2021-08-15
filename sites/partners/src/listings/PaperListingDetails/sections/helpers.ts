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
