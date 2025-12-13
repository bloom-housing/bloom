import React from "react"
import "@testing-library/jest-dom"
import { setupServer } from "msw/node"
import { screen } from "@testing-library/react"
import { FormProviderWrapper, mockNextRouter, render } from "../../../../testUtils"
import ListingIntro from "../../../../../src/components/listings/PaperListingForm/sections/ListingIntro"
import { EnumListingListingType } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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

    expect(screen.queryAllByText("What kind of listing is this?")).toHaveLength(0)
    expect(screen.getByRole("textbox", { name: /^housing developer$/i })).toBeInTheDocument()
    expect(
      screen.queryByRole("textbox", { name: /^property management account$/i })
    ).not.toBeInTheDocument()
  })

  it("should render the ListingIntro section with regulated fields when feature flag is on and listing is not non-regulated", () => {
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

    expect(screen.getByText("What kind of listing is this?")).toBeInTheDocument()
    expect(screen.getByText("Regulated")).toBeInTheDocument()

    expect(screen.getByRole("textbox", { name: /^housing developer$/i })).toBeInTheDocument()
    expect(
      screen.queryByRole("textbox", { name: /^property management account$/i })
    ).not.toBeInTheDocument()

    expect(
      screen.queryAllByRole("group", {
        name: "Has this property received HUD EBLL clearance?",
      })
    ).toHaveLength(0)
  })

  it("should render the ListingIntro section with non-regulated fields when feature flag is on and listing is non-regulated", () => {
    render(
      <FormProviderWrapper values={{ listingType: EnumListingListingType.nonRegulated }}>
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

    expect(screen.getByText("What kind of listing is this?")).toBeInTheDocument()
    expect(screen.getByText("Non-regulated")).toBeInTheDocument()

    expect(
      screen.getByRole("textbox", { name: /^property management account$/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("group", {
        name: "Has this property received HUD EBLL clearance?",
      })
    ).toBeInTheDocument()
  })
})
