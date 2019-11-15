import * as React from "react"
import { storiesOf } from "@storybook/react"
import Apply from "./Apply"
import Archer from "@bloom-housing/listings-service/listings/archer.json"

const listing = Object.assign({}, Archer)

storiesOf("Listing|Sidebar Apply", module).add("hard application deadline", () => {
  listing.applicationDueDate = "2021-11-30T15:22:57.000-07:00"
  listing.acceptsPostmarkedApplications = false

  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <Apply listing={listing} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
})

storiesOf("Listing|Sidebar Apply", module).add("accepts postmarked applications", () => {
  listing.applicationDueDate = "2021-11-30T15:22:57.000-07:00"
  listing.acceptsPostmarkedApplications = true
  listing.postmarkedApplicationsReceivedByDate = "2021-12-05"

  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <Apply listing={listing} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
})
