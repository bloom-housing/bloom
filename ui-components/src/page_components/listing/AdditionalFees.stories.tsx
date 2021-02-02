import * as React from "react"

import { AdditionalFees } from "./AdditionalFees"
import Archer from "../../../__tests__/fixtures/archer.json"

export default {
  title: "Listing/Additional Fees",
}

const listing = Object.assign({}, Archer) as any

export const showsApplicationFeeAndDeposit = () => {
  return <AdditionalFees listing={listing} />
}
