import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import ListingMap from "./ListingMap"
import Archer from "@bloom-housing/listings-service/listings/archer.json"

export default {
  title: "Listing|Map",
  decorators: [withA11y],
}

const listing = Object.assign({}, Archer) as any

export const showBWMapWithPin = () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <ListingMap address={listing.buildingAddress} listing={listing} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}
