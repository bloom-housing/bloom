import * as React from "react"
import Contact from "./Contact"

export default {
  title: "Listing Sidebar/Contact",
  component: Contact,
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
      strings={{ email: "Email", website: "Website", getDirections: "Get Directions" }}
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
      strings={{ email: "Email", website: "Website", getDirections: "Get Directions" }}
      contactAddress={{
        street: "Street 1",
        street2: "Street 2",
        city: "City",
        state: "State",
        zipCode: "12345",
      }}
    />
  )
}

export const AdditionalInformation = () => {
  return (
    <Contact
      sectionTitle={"Contact Leasing Agent"}
      contactTitle={"Contact Title"}
      contactName={"Contact Name"}
      contactEmail={"contact@email.com"}
      contactPhoneNumber={"Call (123) 456 - 7890"}
      contactPhoneNumberNote={"Phone number note"}
      contactCompany={{ name: "Company Name", website: "www.example.com" }}
      strings={{ email: "Email", website: "Website", getDirections: "Get Directions" }}
      contactAddress={{
        street: "Street 1",
        street2: "Street 2",
        city: "City",
        state: "State",
        zipCode: "12345",
      }}
      additionalInformation={[
        {
          title: "Office Hours",
          content: "Monday - Friday 11:00am - 12:00pm",
        },
      ]}
    />
  )
}

export const AdditionalInformationMissingFields = () => {
  return (
    <Contact
      sectionTitle={"Contact Leasing Agent"}
      contactTitle={"Contact Title"}
      contactName={"Contact Name"}
      contactPhoneNumber={"Call (123) 456 - 7890"}
      contactPhoneNumberNote={"Phone number note"}
      strings={{ email: "Email", website: "Website", getDirections: "Get Directions" }}
      additionalInformation={[
        {
          title: "Office Hours",
          content: "Monday - Friday 11:00am - 12:00pm",
        },
      ]}
    />
  )
}
