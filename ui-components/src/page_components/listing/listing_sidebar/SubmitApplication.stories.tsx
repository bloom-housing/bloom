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
      strings={{
        postmark: "Postmark details string",
        mailHeader: "Mail Header",
        dropOffHeader: "Drop Off Header",
        sectionHeader: "Paper App Header",
        officeHoursHeader: "Office Hours Header",
        mapString: "Get Directions",
      }}
    />
  )
}

export const DropOffOnly = () => {
  return (
    <SubmitApplication
      applicationDropOffAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Drop Off Address Street",
        zipCode: "90210",
      }}
      applicationDropOffAddressOfficeHours={"M-F 9am-5pm"}
      strings={{
        postmark: "Postmark details string",
        mailHeader: "Mail Header",
        dropOffHeader: "Drop Off Header",
        sectionHeader: "Paper App Header",
        officeHoursHeader: "Office Hours Header",
        mapString: "Get Directions",
      }}
    />
  )
}

export const MailingOnly = () => {
  return (
    <SubmitApplication
      applicationMailingAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Mailing Address Street",
        zipCode: "90210",
      }}
      strings={{
        postmark: "Postmark details string",
        mailHeader: "Mail Header",
        dropOffHeader: "Drop Off Header",
        sectionHeader: "Paper App Header",
        officeHoursHeader: "Office Hours Header",
        mapString: "Get Directions",
      }}
    />
  )
}

export const DropOffNoOfficeHours = () => {
  return (
    <SubmitApplication
      applicationDropOffAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Drop Off Address Street",
        zipCode: "90210",
      }}
      strings={{
        postmark: "Postmark details string",
        mailHeader: "Mail Header",
        dropOffHeader: "Drop Off Header",
        sectionHeader: "Paper App Header",
        officeHoursHeader: "Office Hours Header",
        mapString: "Get Directions",
      }}
    />
  )
}

export const MailingNoPostmarksYesDueDate = () => {
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
        postmarkedApplicationsReceivedByDate: null,
        developer: "Developer",
        applicationsDueDate: "November 29th, 2021",
      }}
    />
  )
}

export const MailingYesPostmarksNoDueDate = () => {
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
        developer: "Developer",
        applicationsDueDate: null,
      }}
    />
  )
}
