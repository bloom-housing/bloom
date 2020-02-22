import * as React from "react"
import { storiesOf } from "@storybook/react"
import ListingMap from "./ListingMap"
import Archer from "@bloom-housing/listings-service/listings/archer.json"

const listing = Object.assign({}, Archer) as any

storiesOf("Listing|Map", module).add("show B&W map with pin", () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <ListingMap address={listing.buildingAddress} listing={listing} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
})
