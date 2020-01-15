import * as React from "react"
import { storiesOf } from "@storybook/react"
import AdditionalFees from "./AdditionalFees"
import Archer from "@bloom-housing/listings-service/listings/archer.json"

const listing = Object.assign({}, Archer) as any

storiesOf("Listing|Additional Fees", module).add("shows application fee and deposit", () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <AdditionalFees listing={listing} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
})
