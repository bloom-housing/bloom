import * as React from "react"

import { AdditionalFees } from "./AdditionalFees"

export default {
  title: "Listing/Additional Fees",
  component: AdditionalFees,
}

const strings = {
  sectionHeader: "Additional Fees",
  deposit: "Deposit",
  applicationFee: "Application Fee",
}
export const allFieldsAndFourFooterItems = () => {
  return (
    <AdditionalFees
      depositMin={"1140"}
      depositMax={"1500"}
      applicationFee={"30"}
      footerContent={[
        <ul>
          <li key={0} className={"list-disc list-inside"}>
            Water
          </li>
          <li key={0} className={"list-disc list-inside"}>
            Trash
          </li>
          <li key={0} className={"list-disc list-inside"}>
            Sewer
          </li>
        </ul>,
        "Resident responsible for PG&E, internet and phone.",
        "Residents encouraged to obtain renter's insurance but this is not a requirement. Rent is due by the 5th of each month.",
        "Late fee $35 and returned check fee is $35 additional.",
      ]}
    />
  )
}
export const allFieldsAndThreeFooterItems = () => {
  return (
    <AdditionalFees
      depositMin={"1140"}
      depositMax={"1500"}
      applicationFee={"30"}
      footerContent={[
        <ul>
          <li key={0} className={"list-disc list-inside"}>
            Water
          </li>
          <li key={0} className={"list-disc list-inside"}>
            Trash
          </li>
          <li key={0} className={"list-disc list-inside"}>
            Sewer
          </li>
        </ul>,
        "Resident responsible for PG&E, internet and phone.",
        "Residents encouraged to obtain renter's insurance but this is not a requirement. Rent is due by the 5th of each month. Late fee $35 and returned check fee is $35 additional.",
      ]}
    />
  )
}

export const allFieldsAndTwoFooterItems = () => {
  return (
    <AdditionalFees
      depositMin={"1140"}
      depositMax={"1500"}
      applicationFee={"30"}
      footerContent={[
        <ul>
          <li key={0} className={"list-disc list-inside"}>
            Water
          </li>
          <li key={0} className={"list-disc list-inside"}>
            Trash
          </li>
          <li key={0} className={"list-disc list-inside"}>
            Sewer
          </li>
        </ul>,
        "Resident responsible for PG&E, internet and phone.",
      ]}
    />
  )
}

export const allFieldsAndFooterNotIncluded = () => {
  return <AdditionalFees applicationFee={"30"} depositMin={"1140"} depositMax={"1500"} />
}

export const justDepositRange = () => {
  return <AdditionalFees depositMin={"1140"} depositMax={"1500"} />
}

export const justApplicationFee = () => {
  return <AdditionalFees applicationFee={"30"} />
}

export const costsNotIncluded = () => {
  return (
    <AdditionalFees
      footerContent={[
        "Resident responsible for PG&E, internet and phone.  Owner pays for water, trash, and sewage.  Residents encouraged to obtain renter's insurance but this is not a requirement.  Rent is due by the 5th of each month. Late fee $35 and returned check fee is $35 additional.",
      ]}
    />
  )
}
