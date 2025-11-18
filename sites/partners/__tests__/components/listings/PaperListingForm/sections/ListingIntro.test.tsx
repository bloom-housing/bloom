import React from "react"
import "@testing-library/jest-dom"
import { setupServer } from "msw/node"
import { screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { mockNextRouter, render } from "../../../../testUtils"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import ListingIntro from "../../../../../src/components/listings/PaperListingForm/sections/ListingIntro"

const FormComponent = ({ children, values }: { values?: FormListing; children }) => {
  const formMethods = useForm<FormListing>({
    defaultValues: { ...formDefaults, ...values },
    shouldUnregister: false,
  })
  return <FormProvider {...formMethods}>{children}</FormProvider>
}

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
      <FormComponent>
        <ListingIntro
          enableHousingDeveloperOwner={false}
          enableListingFileNumber={false}
          requiredFields={[]}
          jurisdictionName={"JurisdictionA"}
          listingId={"1234"}
        />
      </FormComponent>
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
      <FormComponent>
        <ListingIntro
          enableHousingDeveloperOwner={false}
          enableListingFileNumber={false}
          requiredFields={["developer"]}
          jurisdictionName={"JurisdictionA"}
          listingId={"1234"}
        />
      </FormComponent>
    )

    expect(screen.getByRole("textbox", { name: "Listing name *" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Housing developer *" })).toBeInTheDocument()

    expect(screen.getByRole("textbox", { name: "Housing developer *" })).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Listing file number" })).not.toBeInTheDocument()
  })

  it("should render appropriate text when housing developer owner feature flag is on", () => {
    render(
      <FormComponent>
        <ListingIntro
          enableHousingDeveloperOwner={true}
          enableListingFileNumber={false}
          requiredFields={[]}
          jurisdictionName={"JurisdictionA"}
          listingId={"1234"}
        />
      </FormComponent>
    )
    expect(screen.getByRole("textbox", { name: "Housing developer / owner" })).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Housing developer" })).not.toBeInTheDocument()
  })

  it("should render listing file number field when feature flag is on", () => {
    render(
      <FormComponent>
        <ListingIntro
          enableHousingDeveloperOwner={false}
          enableListingFileNumber={true}
          requiredFields={[]}
          jurisdictionName={"JurisdictionA"}
          listingId={"1234"}
        />
      </FormComponent>
    )

    expect(screen.getByRole("textbox", { name: "Listing file number" })).toBeInTheDocument()
  })
})
