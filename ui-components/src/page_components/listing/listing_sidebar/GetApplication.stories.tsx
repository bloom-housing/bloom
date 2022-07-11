import * as React from "react"
import { GetApplication } from "./GetApplication"

export default {
  title: "Listing Sidebar/Get Application",
  component: GetApplication,
}

export const AllFields = () => {
  return (
    <GetApplication
      onlineApplicationURL={"online-app-url"}
      applicationsOpen={true}
      applicationsOpenDate={"November 20th, 2021"}
      paperApplications={[
        { fileURL: "file-url-en", languageString: "English" },
        { fileURL: "file-url-es", languageString: "Spanish" },
      ]}
      paperMethod={true}
      postmarkedApplicationsReceivedByDate={"November 30th, 2021"}
      applicationPickUpAddressOfficeHours={"M-F 9am-5pm"}
      applicationPickUpAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Pick Up Address Street",
        zipCode: "90210",
      }}
      preview={false}
    />
  )
}

export const WithoutPaperAppFiles = () => {
  return (
    <GetApplication
      applicationsOpen={true}
      applicationsOpenDate={"November 20th, 2021"}
      paperApplications={[]}
      paperMethod={true}
      postmarkedApplicationsReceivedByDate={"November 30th, 2021"}
      applicationPickUpAddressOfficeHours={"M-F 9am-5pm"}
      applicationPickUpAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Pick Up Address Street",
        zipCode: "90210",
      }}
      preview={false}
    />
  )
}

export const Preview = () => {
  return (
    <GetApplication
      onlineApplicationURL={"online-app-url"}
      applicationsOpen={true}
      applicationsOpenDate={"November 20th, 2021"}
      paperApplications={[
        { fileURL: "file-url-en", languageString: "English" },
        { fileURL: "file-url-es", languageString: "Spanish" },
      ]}
      paperMethod={true}
      postmarkedApplicationsReceivedByDate={"November 30th, 2021"}
      applicationPickUpAddressOfficeHours={"M-F 9am-5pm"}
      applicationPickUpAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Pick Up Address Street",
        zipCode: "90210",
      }}
      preview={true}
    />
  )
}

export const OpenInFuture = () => {
  return (
    <GetApplication
      onlineApplicationURL={"online-app-url"}
      applicationsOpen={false}
      applicationsOpenDate={"November 20th, 2021"}
      paperApplications={[
        { fileURL: "file-url-en", languageString: "English" },
        { fileURL: "file-url-es", languageString: "Spanish" },
      ]}
      paperMethod={true}
      postmarkedApplicationsReceivedByDate={"November 30th, 2021"}
      applicationPickUpAddressOfficeHours={"M-F 9am-5pm"}
      applicationPickUpAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Pick Up Address Street",
        zipCode: "90210",
      }}
      preview={false}
    />
  )
}

export const Pickup = () => {
  return (
    <GetApplication
      applicationsOpen={true}
      applicationsOpenDate={"November 20th, 2021"}
      paperApplications={[]}
      paperMethod={false}
      postmarkedApplicationsReceivedByDate={"November 30th, 2021"}
      applicationPickUpAddressOfficeHours={"M-F 9am-5pm"}
      applicationPickUpAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Pick Up Address Street",
        zipCode: "90210",
      }}
      preview={false}
    />
  )
}

export const OnlineAndNoPickUp = () => {
  return (
    <GetApplication
      onlineApplicationURL={"online-app-url"}
      applicationsOpen={true}
      applicationsOpenDate={"November 20th, 2021"}
      paperApplications={[]}
      paperMethod={false}
      postmarkedApplicationsReceivedByDate={"November 30th, 2021"}
      preview={false}
    />
  )
}

export const PaperAndPickup = () => {
  return (
    <GetApplication
      applicationsOpen={true}
      applicationsOpenDate={"November 20th, 2021"}
      paperApplications={[
        { fileURL: "file-url-en", languageString: "English" },
        { fileURL: "file-url-es", languageString: "Spanish" },
      ]}
      paperMethod={true}
      postmarkedApplicationsReceivedByDate={"November 30th, 2021"}
      applicationPickUpAddressOfficeHours={"M-F 9am-5pm"}
      applicationPickUpAddress={{
        city: "City",
        state: "State",
        street2: "Street 2",
        street: "Pick Up Address Street",
        zipCode: "90210",
      }}
      preview={false}
    />
  )
}

export const PaperAndNoPickup = () => {
  return (
    <GetApplication
      applicationsOpen={true}
      applicationsOpenDate={"November 20th, 2021"}
      paperApplications={[
        { fileURL: "file-url-en", languageString: "English" },
        { fileURL: "file-url-es", languageString: "Spanish" },
      ]}
      paperMethod={true}
      postmarkedApplicationsReceivedByDate={"November 30th, 2021"}
      preview={false}
    />
  )
}
