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
        listingName={"Listing name"}
      />
    )
    expect(getByText("How to Apply")).toBeTruthy()
    expect(getByText("Apply Online")).toBeTruthy()
    expect(getByText("Apply Online").closest("a")?.getAttribute("href")).toBe("online-app-url")
    expect(getAllByText("or").length).toBe(2)
    expect(getByText("Get a Paper Application")).toBeTruthy()
    expect(getByText("Download Application")).toBeTruthy()
    expect(getByText("Pick up an application")).toBeTruthy()
    expect(getByText("Pick Up Address Street", { exact: false })).toBeTruthy()
    expect(getByText("Office Hours")).toBeTruthy()
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
        listingName={"Listing name"}
      />
    )
    expect(queryByTestId("get-application-section")).toBeNull()
  })
  it("disables buttons in preview state", () => {
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
        listingName={"Listing name"}
      />
    )
    expect(getByText("Apply Online").closest("button")?.disabled).toBe(true)
    expect(getByText("Download Application").closest("button")?.disabled).toBe(true)
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
        listingName={"Listing name"}
      />
    )
    expect(queryByText("Apply Online")).toBe(null)
    expect(queryByText("Download Application")).toBe(null)
    expect(
      getByText("Application will be available for download and pick up on November 20th, 2021")
    ).toBeTruthy()
  })
})
