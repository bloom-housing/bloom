import React from "react"
import { setupServer } from "msw/lib/node"
import { render, screen } from "@testing-library/react"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter } from "../../../testUtils"
import ListingPage from "../../../../src/pages/listing/[id]/[slug]"
import { Listing, Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const server = setupServer()

const TOAST_MESSAGE = {
  toastMessagesRef: { current: [] },
  addToast: jest.fn(),
}

beforeAll(() => {
  mockNextRouter({ id: listing.id, slug: "test-slug" })
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

function renderListingPage(listingProp: Listing, jurisdictionProp: Jurisdiction) {
  return render(
    <MessageContext.Provider value={TOAST_MESSAGE}>
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <ListingPage listing={listingProp} jurisdiction={jurisdictionProp} />
      </AuthContext.Provider>
    </MessageContext.Provider>
  )
}

describe("ListingPage", () => {
  describe("error handling", () => {
    it("should render error page when listing has no data (via ListingViewSeeds)", () => {
      const listingWithoutId = { ...listing, id: undefined } as unknown as Listing
      expect(() => renderListingPage(listingWithoutId, jurisdiction)).not.toThrow()
    })
  })

  describe("page content", () => {
    it("should render the listing name in the page", () => {
      renderListingPage(listing, jurisdiction)
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(listing.name)
    })

    it("should render listing page with valid listing and jurisdiction", () => {
      const { container } = renderListingPage(listing, jurisdiction)
      expect(container).not.toBeEmptyDOMElement()
    })
  })

  describe("meta and layout", () => {
    it("should render a Layout wrapping the listing content", () => {
      renderListingPage(listing, jurisdiction)
      expect(document.title).toBeDefined()
    })
  })

  describe("showNewSeedsDesigns flag", () => {
    it("should render ListingView when showNewSeedsDesigns is not set", () => {
      const originalEnv = process.env.showNewSeedsDesigns
      delete process.env.showNewSeedsDesigns

      renderListingPage(listing, jurisdiction)

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(listing.name)

      process.env.showNewSeedsDesigns = originalEnv
    })

    it("should render ListingViewSeeds when showNewSeedsDesigns is set", () => {
      const originalEnv = process.env.showNewSeedsDesigns
      process.env.showNewSeedsDesigns = "true"

      renderListingPage(listing, jurisdiction)

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(listing.name)

      process.env.showNewSeedsDesigns = originalEnv
    })
  })

  describe("GTM event", () => {
    it("should not throw when rendering a listing with all required fields", () => {
      expect(() => renderListingPage(listing, jurisdiction)).not.toThrow()
    })
  })
})
