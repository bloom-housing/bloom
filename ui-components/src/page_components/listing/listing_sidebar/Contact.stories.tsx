import * as React from "react"
import Contact from "./Contact"

export default {
  title: "Listing Sidebar/Contact",
  component: Contact,
}

export const Default = () => {
  return <Contact sectionTitle={"Contact Leasing Agent"} />
}

export const NoAddress = () => {
  return (
    <Contact
      sectionTitle={"Contact Leasing Agent"}
      contactTitle={"Contact Title"}
      contactName={"Contact Name"}
      contactEmail={"contact@email.com"}
      contactPhoneNumber={"Call (123) 456 - 7890"}
      contactPhoneNumberNote={"Phone number note"}
      contactCompany={{ name: "Company Name", website: "www.example.com" }}
      emailString={"Email"}
      websiteString={"Website"}
      mapString={"Get Directions"}
    />
  )
}

export const WithAddress = () => {
  return (
    <Contact
      sectionTitle={"Contact Leasing Agent"}
      contactTitle={"Contact Title"}
      contactName={"Contact Name"}
      contactEmail={"contact@email.com"}
      contactPhoneNumber={"Call (123) 456 - 7890"}
      contactPhoneNumberNote={"Phone number note"}
      contactCompany={{ name: "Company Name", website: "www.example.com" }}
      emailString={"Email"}
      websiteString={"Website"}
      contactAddress={{
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
