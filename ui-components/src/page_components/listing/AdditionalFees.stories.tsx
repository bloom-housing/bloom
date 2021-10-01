import * as React from "react"

import { AdditionalFees } from "./AdditionalFees"

export default {
  title: "Listing/Additional Fees",
}

export const allFields = () => {
  return (
    <AdditionalFees
      depositMin={"1140"}
      depositMax={"1500"}
      applicationFee={"30"}
      costsNotIncluded={
        "Resident responsible for PG&E, internet and phone.  Owner pays for water, trash, and sewage.  Residents encouraged to obtain renter's insurance but this is not a requirement.  Rent is due by the 5th of each month. Late fee $35 and returned check fee is $35 additional."
      }
    />
  )
}

export const showsJustDepositRange = () => {
  return <AdditionalFees depositMin={"1140"} depositMax={"1500"} />
}

export const showsJustFee = () => {
  return <AdditionalFees applicationFee={"30"} />
}

export const showsJustCostsNotIncluded = () => {
  return (
    <AdditionalFees
      costsNotIncluded={
        "Resident responsible for PG&E, internet and phone.  Owner pays for water, trash, and sewage.  Residents encouraged to obtain renter's insurance but this is not a requirement.  Rent is due by the 5th of each month. Late fee $35 and returned check fee is $35 additional."
      }
    />
  )
}
