import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import AdditionalFees from "./AdditionalFees"
import Archer from "@bloom-housing/listings-service/listings/archer.json"

export default {
  title: "Listing|Additional Fees",
  decorators: [withA11y],
}

const listing = Object.assign({}, Archer) as any

export const showsApplicationFeeAndDeposit = () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <AdditionalFees listing={listing} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}
