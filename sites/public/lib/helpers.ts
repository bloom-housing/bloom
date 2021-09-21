import moment from "moment"
import { Address, Listing } from "@bloom-housing/backend-core/types"

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const getGenericAddress = (bloomAddress: Address) => {
  return {
    city: bloomAddress.city,
    street: bloomAddress.street,
    street2: bloomAddress.street2,
    state: bloomAddress.state,
    zipCode: bloomAddress.zipCode,
    latitude: bloomAddress.latitude,
    longitude: bloomAddress.longitude,
    placeName: bloomAddress.placeName,
  }
}

export const openInFuture = (listing: Listing) => {
  const nowTime = moment()
  return listing.applicationOpenDate && nowTime < moment(listing.applicationOpenDate)
}
