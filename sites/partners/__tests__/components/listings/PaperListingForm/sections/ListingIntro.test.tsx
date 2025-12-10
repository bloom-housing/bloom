import React from "react"
import "@testing-library/jest-dom"
import { setupServer } from "msw/node"
import userEvent from "@testing-library/user-event"
import { screen, within } from "@testing-library/react"
import { FormProviderWrapper, mockNextRouter, render } from "../../../../testUtils"
import ListingIntro from "../../../../../src/components/listings/PaperListingForm/sections/ListingIntro"

const server = setupServer()

// Enable API mocking before tests.
beforeAll(() => {
  server.listen()
  mockNextRouter()
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe("ListingIntro", () => {
  it("should render the ListingIntro section with one jurisdiction", () => {
    render(
      <FormProviderWrapper>
        <ListingIntro
          enableHousingDeveloperOwner={false}
          enableNonRegulatedListings={false}
          enableListingFileNumber={false}
          requiredFields={[]}
          jurisdictionName={"JurisdictionA"}
          listingId={"1234"}
        />
      </FormProviderWrapper>
    )

    expect(
      screen.getByText("Let's get started with some basic information about your listing.")
    ).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Listing name *" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Housing developer" })).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Listing file number" })).not.toBeInTheDocument()
  })

  it("should render the ListingIntro section with multiple jurisdictions and required developer", () => {
    render(
      <FormProviderWrapper>
        <ListingIntro
          enableHousingDeveloperOwner={false}
          enableNonRegulatedListings={false}
          enableListingFileNumber={false}
          requiredFields={["developer"]}
          jurisdictionName={"JurisdictionA"}
          listingId={"1234"}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("textbox", { name: "Listing name *" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Housing developer *" })).toBeInTheDocument()

    expect(screen.getByRole("textbox", { name: "Housing developer *" })).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Listing file number" })).not.toBeInTheDocument()
  })

  it("should render appropriate text when housing developer owner feature flag is on", () => {
    render(
      <FormProviderWrapper>
        <ListingIntro
          enableHousingDeveloperOwner={true}
          enableNonRegulatedListings={false}
          enableListingFileNumber={false}
          requiredFields={[]}
          jurisdictionName={"JurisdictionA"}
          listingId={"1234"}
        />
      </FormProviderWrapper>
    )
    expect(screen.getByRole("textbox", { name: "Housing developer / owner" })).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Housing developer" })).not.toBeInTheDocument()
  })

  it("should render listing file number field when feature flag is on", () => {
    render(
      <FormProviderWrapper>
        <ListingIntro
          enableHousingDeveloperOwner={false}
          enableNonRegulatedListings={false}
          enableListingFileNumber={true}
          requiredFields={[]}
          jurisdictionName={"JurisdictionA"}
          listingId={"1234"}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("textbox", { name: "Listing file number" })).toBeInTheDocument()
  })

  it("should render the ListingIntro section with regulated fields when feature flag is off", () => {
    render(
      <FormProviderWrapper>
        <ListingIntro
          requiredFields={[]}
          enableNonRegulatedListings={false}
          enableHousingDeveloperOwner={false}
          enableListingFileNumber={false}
          jurisdictionName={"JurisdictionA"}
          listingId={"1234"}
        />
      </FormProviderWrapper>
    )

    expect(
      screen.queryByRole("group", { name: "What kind of listing is this?" })
    ).not.toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: /^housing developer$/i })).toBeInTheDocument()
    expect(
      screen.queryByRole("textbox", { name: /^property management account$/i })
    ).not.toBeInTheDocument()
  })

  it("should not render the ListingIntro section with regulated fields when feature flag is on", async () => {
    render(
      <FormProviderWrapper>
        <ListingIntro
          requiredFields={[]}
          enableNonRegulatedListings={true}
          enableHousingDeveloperOwner={false}
          enableListingFileNumber={false}
          jurisdictionName={"JurisdictionA"}
          listingId={"1234"}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("heading", { level: 2, name: "Listing intro" })).toBeInTheDocument()

    expect(
      await screen.findByRole("group", { name: "What kind of listing is this?" })
    ).toBeInTheDocument()
    const requlatedListingOption = screen.getByRole("radio", { name: /^regulated$/i })
    const nonRequlatedListingOption = screen.getByRole("radio", { name: /^non-regulated$/i })
    expect(requlatedListingOption).toBeInTheDocument()
    expect(requlatedListingOption).toBeChecked()
    expect(nonRequlatedListingOption).toBeInTheDocument()
    expect(nonRequlatedListingOption).not.toBeChecked()

    let ebllQuestionLabel = screen.queryByRole("group", {
      name: "Has this property received HUD EBLL clearance?",
    })

    ebllQuestionLabel = screen.queryByRole("group", {
      name: "Has this property received HUD EBLL clearance?",
    })
    expect(ebllQuestionLabel).not.toBeInTheDocument()

    await userEvent.click(nonRequlatedListingOption)

    expect(
      screen.getByRole("textbox", { name: /^property management account$/i })
    ).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: /^housing developer$/i })).not.toBeInTheDocument()

    ebllQuestionLabel = screen.queryByRole("group", {
      name: "Has this property received HUD EBLL clearance?",
    })
    expect(ebllQuestionLabel).toBeInTheDocument()
    const ebllQuestionContainer = ebllQuestionLabel.parentElement
    const ebllYesOption = within(ebllQuestionContainer).getByRole("radio", { name: /^yes$/i })
    const ebllNoOption = within(ebllQuestionContainer).getByRole("radio", { name: /^no$/i })
    expect(ebllYesOption).toBeInTheDocument()
    expect(ebllYesOption).not.toBeChecked()
    expect(ebllNoOption).toBeInTheDocument()
    expect(ebllNoOption).toBeChecked()
  })
})
