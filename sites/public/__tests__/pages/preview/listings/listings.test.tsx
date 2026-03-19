import React from "react"
import { render, screen } from "@testing-library/react"
import { setupServer } from "msw/lib/node"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter } from "../../../testUtils"
import ListingPage from "../../../../src/pages/preview/listings/[id]"

const server = setupServer()

beforeAll(() => {
  mockNextRouter()
  server.listen()
  process.env.showNewSeedsDesigns = "TRUE"
})

afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})

afterAll(() => {
  server.close()
})

describe("Listing Preview Page Tests", () => {
  it("renders the listing preview only alert, shows name as heading, address and leasing agent contact informacion", () => {
    render(<ListingPage listing={listing} jurisdiction={jurisdiction} />)
    expect(screen.getByText("This is a listing preview only.")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Archer Studios", level: 1 })).toBeInTheDocument()
    expect(screen.getByText("98 Archer Street, San Jose, CA 95112")).toBeInTheDocument()
    expect(screen.getAllByText("Marisela Baca").length).toBeGreaterThan(0)
  })
})
