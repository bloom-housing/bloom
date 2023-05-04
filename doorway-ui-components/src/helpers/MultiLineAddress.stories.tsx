import * as React from "react"
import MultiLineAddress from "./MultiLineAddress"

export default {
  title: "Listing Sidebar/MultiLineAddress",
  component: MultiLineAddress,
}

export const Default = () => {
  return (
    <MultiLineAddress
      address={{
        street: "Street 1",
        street2: "Street 2",
        city: "City",
        state: "State",
        zipCode: "12345",
      }}
    />
  )
}

export const NoStreet = () => {
  return (
    <MultiLineAddress
      address={{
        city: "City",
        state: "State",
        zipCode: "12345",
      }}
    />
  )
}

export const NoCity = () => {
  return (
    <MultiLineAddress
      address={{
        street: "Street 1",
        street2: "Street 2",
        state: "State",
        zipCode: "12345",
      }}
    />
  )
}

export const NoState = () => {
  return (
    <MultiLineAddress
      address={{
        street: "Street 1",
        street2: "Street 2",
        city: "City",
        zipCode: "12345",
      }}
    />
  )
}
