import * as React from "react"
import { QuantityRowSection } from "./QuantityRowSection"

export default {
  title: "Listing Sidebar/Quantity Row Section",
  component: QuantityRowSection,
}

const strings = {
  sectionTitle: "Available Units and Waitlist",
  description:
    "Once ranked applicants fill all available units, the remaining ranked applicants will be placed on a waitlist for those same units.",
}

export const OpenAndAllValuesSupplied = () => {
  return (
    <QuantityRowSection
      quantityRows={[
        { amount: 100, text: "Final Size" },
        { amount: 40, text: "Current Size" },
        { amount: 60, text: "Open Spots" },
      ]}
      strings={strings}
    />
  )
}

export const EmphasizedValue = () => {
  return (
    <QuantityRowSection
      quantityRows={[
        { amount: 100, text: "Final Size" },
        { amount: 40, text: "Current Size" },
        { amount: 60, text: "Open Spots", emphasized: true },
      ]}
      strings={strings}
    />
  )
}

export const OpenWithSomeZeroes = () => {
  return (
    <QuantityRowSection
      quantityRows={[
        { amount: 10, text: "Final Size" },
        { amount: 0, text: "Current Size" },
        { amount: 2, text: "Open Spots" },
      ]}
      strings={strings}
    />
  )
}

export const OpenWithOnlyMaxAndOpen = () => {
  return (
    <QuantityRowSection
      quantityRows={[
        { amount: 10, text: "Final Size" },
        { amount: 10, text: "Open Spots" },
      ]}
      strings={strings}
    />
  )
}

export const OpenWithOnlyMax = () => {
  return (
    <QuantityRowSection quantityRows={[{ amount: 100, text: "Final Size" }]} strings={strings} />
  )
}

export const CustomDescription = () => {
  const customDescription = () => {
    return (
      <div>
        <p className={"italic pb-2"}>Custom styled content.</p>
        <p className={"underline"}>More custom styled content.</p>
      </div>
    )
  }
  return (
    <QuantityRowSection
      quantityRows={[
        { amount: 100, text: "Final Size" },
        { amount: 40, text: "Current Size" },
        { amount: 60, text: "Open Spots" },
      ]}
      strings={{ ...strings, description: customDescription() }}
    />
  )
}
