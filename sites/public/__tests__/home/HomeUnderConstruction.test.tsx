import React from "react"
import { setupServer } from "msw/lib/node"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { HomeUnderConstruction } from "../../src/components/home/HomeUnderConstruction"
import { mockNextRouter, render, screen } from "../testUtils"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
  window.scrollTo = jest.fn()
})

afterEach(() => {
  server.resetHandlers()
  window.localStorage.clear()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("<HomeUnderConstruction>", () => {
  it("displays under construction listings", () => {
    render(
      <HomeUnderConstruction
        listings={[
          { ...listing, name: "ListingA" },
          { ...listing, name: "ListingB" },
          { ...listing, name: "ListingC" },
        ]}
        jurisdiction={jurisdiction}
      />
    )
    expect(screen.getByRole("link", { name: "ListingA" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "ListingB" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "ListingC" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /See all under construction/i })).toBeInTheDocument()
  })
})
