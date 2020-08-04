import * as React from "react"

import "../cards/InfoCard.scss"
import PreferencesList from "./PreferencesList"
import Gish from "@bloom-housing/listings-service/listings/gish.json"

export default {
  title: "Listing/Preferences List",
}

const listing = Object.assign({}, Gish) as any

export const preferences = () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <PreferencesList preferences={listing.preferences} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}
