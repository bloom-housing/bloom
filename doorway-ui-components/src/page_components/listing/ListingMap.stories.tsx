import * as React from "react"

import { ListingMap } from "./ListingMap"
import Archer from "../../../__tests__/fixtures/archer.json"

export default {
  title: "Listing/Map",
}

const listing = Object.assign({}, Archer) as any

export const showMapWithPin = () => {
  return <ListingMap address={listing.buildingAddress} listingName={listing.name} />
}
