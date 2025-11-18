import React from "react"
import "@testing-library/jest-dom"
import { setupServer } from "msw/node"
import { screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { mockNextRouter, render } from "../../../../testUtils"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import ListingData from "../../../../../src/components/listings/PaperListingForm/sections/ListingData"

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

describe("ListingData", () => {
  it("should render all data", () => {
    render(
      <FormComponent>
        <ListingData
          createdAt={new Date("2023-01-01T10:00:00Z")}
          jurisdictionName={"Bloomington"}
          listingId={"1234"}
        />
      </FormComponent>
    )

    expect(screen.getByRole("heading", { level: 2, name: "Listing data" })).toBeInTheDocument()
    expect(screen.getByText("Date created")).toBeInTheDocument()
    expect(screen.getByText("01/01/2023 at 10:00 AM")).toBeInTheDocument()
    expect(screen.getByText("Jurisdiction")).toBeInTheDocument()
    expect(screen.getByText("Bloomington")).toBeInTheDocument()
    expect(screen.getByText("Listing ID")).toBeInTheDocument()
    expect(screen.getByText("1234")).toBeInTheDocument()
  })

  it("should render nothing if no data", () => {
    render(
      <FormComponent>
        <ListingData createdAt={null} jurisdictionName={null} listingId={null} />
      </FormComponent>
    )
    expect(
      screen.queryByRole("heading", { level: 2, name: "Listing data" })
    ).not.toBeInTheDocument()
    expect(screen.queryByText("Date created")).not.toBeInTheDocument()
    expect(screen.queryByText("Jurisdiction")).not.toBeInTheDocument()
    expect(screen.queryByText("Listing ID")).not.toBeInTheDocument()
  })
})
