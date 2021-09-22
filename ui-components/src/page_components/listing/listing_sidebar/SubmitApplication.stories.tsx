import * as React from "react"
import { SubmitApplication } from "./SubmitApplication"

export default {
  component: SubmitApplication,
  title: "Listing Sidebar/Submit Application",
}

export const AllFields = () => {
  return (
    <SubmitApplication
      applicationMailingAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Mailing Address Street",
        zipCode: "90210",
      }}
      applicationDropOffAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Drop Off Address Street",
        zipCode: "90210",
      }}
      applicationDropOffAddressOfficeHours={"M-F 9am-5pm"}
      applicationOrganization={"Application Organization"}
      postmarkedApplicationData={{
        postmarkedApplicationsReceivedByDate: "November 30th, 2021",
        developer: "Listing Developer",
        applicationsDueDate: "November 29th, 2021",
      }}
    />
  )
}

export const DropOffNoOfficeHours = () => {
  return (
    <SubmitApplication
      applicationMailingAddress={undefined}
      applicationDropOffAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Drop Off Address Street",
        zipCode: "90210",
      }}
      applicationDropOffAddressOfficeHours={undefined}
      applicationOrganization={undefined}
    />
  )
}

export const MailingNoPostmarks = () => {
  return (
    <SubmitApplication
      applicationMailingAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Mailing Address Street",
        zipCode: "90210",
      }}
      applicationDropOffAddress={undefined}
      applicationDropOffAddressOfficeHours={undefined}
      applicationOrganization={undefined}
    />
  )
}

export const MailingWithPostmarks = () => {
  return (
    <SubmitApplication
      applicationMailingAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Mailing Address Street",
        zipCode: "90210",
      }}
      applicationDropOffAddress={undefined}
      applicationDropOffAddressOfficeHours={undefined}
      applicationOrganization={undefined}
      postmarkedApplicationData={{
        postmarkedApplicationsReceivedByDate: "November 30th, 2021",
        developer: "Listing Developer",
        applicationsDueDate: "November 29th, 2021",
      }}
    />
  )
}
