import React from "react"
import "@testing-library/jest-dom"
import { setupServer } from "msw/node"
import { screen } from "@testing-library/react"
import { ListingFormComponent, mockNextRouter, render } from "../../../../testUtils"
import ListingData from "../../../../../src/components/listings/PaperListingForm/sections/ListingData"

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
      <ListingFormComponent>
        <ListingData
          createdAt={new Date("2023-01-01T10:00:00Z")}
          jurisdictionName={"Bloomington"}
          listingId={"1234"}
        />
      </ListingFormComponent>
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
      <ListingFormComponent>
        <ListingData createdAt={null} jurisdictionName={null} listingId={null} />
      </ListingFormComponent>
    )
    expect(
      screen.queryByRole("heading", { level: 2, name: "Listing data" })
    ).not.toBeInTheDocument()
    expect(screen.queryByText("Date created")).not.toBeInTheDocument()
    expect(screen.queryByText("Jurisdiction")).not.toBeInTheDocument()
    expect(screen.queryByText("Listing ID")).not.toBeInTheDocument()
  })
})
