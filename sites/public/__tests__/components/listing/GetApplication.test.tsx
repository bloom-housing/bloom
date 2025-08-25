import React from "react"
import { render, cleanup } from "@testing-library/react"
import { GetApplication } from "../../../src/components/listing/GetApplication"

afterEach(cleanup)

describe("<Applications>", () => {
  it("renders with all optional fields", () => {
    const { getByText, getAllByText } = render(
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
        listingStatus="active"
        listingName={"Listing name"}
        listingId="123"
      />
    )
    expect(getByText("How to apply")).toBeTruthy()
    expect(getByText("Apply online")).toBeTruthy()
    expect(getByText("Apply online").closest("a")?.getAttribute("href")).toBe("online-app-url")
    expect(getAllByText("or").length).toBe(2)
    expect(getByText("Get a paper application")).toBeTruthy()
    expect(getByText("Download application")).toBeTruthy()
    expect(getByText("Pick up an application")).toBeTruthy()
    expect(getByText("Pick up address street", { exact: false })).toBeTruthy()
    expect(getByText("Office hours")).toBeTruthy()
  })
  it("do not render section when there is no paper application files and paper method is true", () => {
    const { queryByTestId } = render(
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
        listingStatus="active"
        listingName={"Listing name"}
        listingId="123"
      />
    )
    expect(queryByTestId("get-application-section")).toBeNull()
  })
  it("disables apply online button if draft listing and not in preview state", () => {
    const { getByText } = render(
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
        listingStatus="pending"
        listingName={"Listing name"}
        listingId="123"
      />
    )
    expect(getByText("Apply online").closest("button")?.disabled).toBe(true)
  })
  it("enables apply online button if draft listing and in preview state", () => {
    const { getByText } = render(
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
        listingStatus="pending"
        listingName={"Listing name"}
        listingId="123"
      />
    )
    expect(getByText("Apply online").closest("a")?.getAttribute("href")).toBe("online-app-url")
  })
  it("hides buttons if application is not open", () => {
    const { getByText, queryByText } = render(
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
        listingStatus="active"
        listingName={"Listing name"}
        listingId="123"
      />
    )
    expect(queryByText("Apply online")).toBe(null)
    expect(queryByText("Download application")).toBe(null)
    expect(
      getByText("Application will be available for download and pick up on November 20th, 2021")
    ).toBeTruthy()
  })
})
