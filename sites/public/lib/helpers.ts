import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "./constants"
import { Address } from "@bloom-housing/backend-core/types"

export const eligibilityRoute = (page: number) =>
  `/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[page]}`

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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
