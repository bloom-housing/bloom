import * as React from "react"

import { ListingMap } from "./ListingMap"
import Archer from "@bloom-housing/listings-service/listings/archer.json"

export default {
  title: "Listing/Map",
}

const listing = Object.assign({}, Archer) as any

export const showBWMapWithPin = () => {
  return <ListingMap address={listing.buildingAddress} listing={listing} />
}
