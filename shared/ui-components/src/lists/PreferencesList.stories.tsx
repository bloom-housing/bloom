import * as React from "react"
import { storiesOf } from "@storybook/react"
import "../cards/InfoCard.scss"
import PreferencesList from "./PreferencesList"
import Gish from "@bloom-housing/listings-service/listings/gish.json"

const listing = Object.assign({}, Gish) as any

storiesOf("Listing|Preferences List", module).add("preferences", () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <PreferencesList preferences={listing.preferences} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
})
