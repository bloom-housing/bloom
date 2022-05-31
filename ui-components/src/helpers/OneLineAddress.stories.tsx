import * as React from "react"
import OneLineAddress from "./OneLineAddress"

export default {
  title: "Listing Sidebar/OneLineAddress",
  component: OneLineAddress,
}

export const Default = () => {
  return (
    <OneLineAddress
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
    <OneLineAddress
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
    <OneLineAddress
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
    <OneLineAddress
      address={{
        street: "Street 1",
        street2: "Street 2",
        city: "City",
        zipCode: "12345",
      }}
    />
  )
}
