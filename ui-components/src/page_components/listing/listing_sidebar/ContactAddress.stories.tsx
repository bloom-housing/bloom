import * as React from "react"
import ContactAddress from "./ContactAddress"

export default {
  title: "Listing Sidebar/Contact Address",
  component: ContactAddress,
}

export const Default = () => {
  return (
    <ContactAddress
      address={{
        street: "Street 1",
        street2: "Street 2",
        city: "City",
        state: "State",
        zipCode: "12345",
      }}
      mapString={"Get Directions"}
    />
  )
}
