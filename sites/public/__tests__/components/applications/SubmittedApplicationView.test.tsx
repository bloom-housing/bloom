import React from "react"
import { setupServer } from "msw/lib/node"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { application, listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { SubmittedApplicationView } from "../../../src/components/applications/SubmittedApplicationView"
import { cleanup, mockNextRouter, render, screen } from "../../testUtils"

const server = setupServer()
window.scrollTo = jest.fn()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})

describe("<SubmittedApplicationView>", () => {
  it("falls back to the listing prop when application listing data is missing", () => {
    const applicationWithoutListing = {
      ...application,
      listings: undefined,
    }

    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: jest.fn().mockReturnValue(false),
        }}
      >
        <SubmittedApplicationView
          application={applicationWithoutListing}
          listing={listing}
          backHref="/account/applications"
        />
      </AuthContext.Provider>
    )

    expect(screen.getByRole("heading", { name: listing.name, level: 1 })).toBeInTheDocument()
    const listingLink = screen.getByRole("link", { name: "View the original listing" })
    expect(listingLink).toHaveAttribute("href", `/listing/${listing.id}`)
  })
})
