import React from "react"
import { render, screen } from "@testing-library/react"
import { setupServer } from "msw/lib/node"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter } from "../../../testUtils"
import ListingPage from "../../../../src/pages/preview/listings/[id]"

const server = setupServer()

const TOAST_MESSAGE = {
  toastMessagesRef: { current: [] },
  addToast: jest.fn(),
}

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

const renderListingPreviewPage = () =>
  render(
    <MessageContext.Provider value={TOAST_MESSAGE}>
      <AuthContext.Provider value={{ initialStateLoaded: true, profile: undefined }}>
        <ListingPage listing={listing} jurisdiction={jurisdiction} />
      </AuthContext.Provider>
    </MessageContext.Provider>
  )

describe("Listing Preview Page Tests", () => {
  it("renders the listing preview only alert", () => {
    renderListingPreviewPage()
    expect(screen.getByText("This is a listing preview only.")).toBeInTheDocument()
  })

  it("renders the listing name as a heading", () => {
    renderListingPreviewPage()
    expect(screen.getByRole("heading", { name: "Archer Studios", level: 1 })).toBeInTheDocument()
  })

  it("renders the listing address and leasing agent contact information", () => {
    renderListingPreviewPage()
    expect(screen.getByText("98 Archer Street, San Jose, CA 95112")).toBeInTheDocument()
    expect(screen.getAllByText("Marisela Baca").length).toBeGreaterThan(0)
  })
})
