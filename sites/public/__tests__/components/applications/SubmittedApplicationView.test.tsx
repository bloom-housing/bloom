import React from "react"
import { setupServer } from "msw/lib/node"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { application, listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { SubmittedApplicationView } from "../../../src/components/applications/SubmittedApplicationView"
import { cleanup, mockNextRouter, render, screen } from "../../testUtils"
import {
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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

const renderView = (applicationOverrides = {}, featureFlags: Record<string, boolean> = {}) =>
  render(
    <AuthContext.Provider
      value={{
        doJurisdictionsHaveFeatureFlagOn: jest
          .fn()
          .mockImplementation((flag: string) => featureFlags[flag] ?? false),
      }}
    >
      <SubmittedApplicationView
        application={{ ...application, ...applicationOverrides }}
        listing={listing}
        backHref="/account/applications"
      />
    </AuthContext.Provider>
  )

describe("<SubmittedApplicationView>", () => {
  it("falls back to the listing prop when application listing data is missing", () => {
    renderView({ listings: undefined })

    expect(screen.getByRole("heading", { name: listing.name, level: 1 })).toBeInTheDocument()
    const listingLink = screen.getByRole("link", { name: "View the original listing" })
    expect(listingLink).toHaveAttribute("href", `/listing/${listing.id}`)
  })

  describe("decline reason display", () => {
    it("does not show decline reason when status is not declined", () => {
      renderView({ status: ApplicationStatusEnum.submitted, applicationDeclineReason: undefined })

      expect(screen.queryByText(/decline reason/i)).not.toBeInTheDocument()
    })

    it("does not show decline reason when status is declined but no reason is set", () => {
      renderView({ status: ApplicationStatusEnum.declined, applicationDeclineReason: undefined })

      expect(screen.queryByText(/decline reason/i)).not.toBeInTheDocument()
    })

    it("shows decline reason label and value when status is declined and reason is set", () => {
      renderView({
        status: ApplicationStatusEnum.declined,
        applicationDeclineReason: ApplicationDeclineReasonEnum.ageRestriction,
      })

      expect(screen.getByText(/decline reason/i)).toBeInTheDocument()
      expect(screen.getByText(/age restriction/i)).toBeInTheDocument()
    })

    it("shows the correct label for other", () => {
      renderView({
        status: ApplicationStatusEnum.declined,
        applicationDeclineReason: ApplicationDeclineReasonEnum.other,
      })

      expect(screen.getByText(/^other$/i)).toBeInTheDocument()
    })
  })

  describe("status pill", () => {
    const withFlag = { [FeatureFlagEnum.enableApplicationStatus]: true }

    it("does not render the status pill when the feature flag is off", () => {
      renderView({ status: ApplicationStatusEnum.submitted })

      expect(screen.queryByText("Submitted")).not.toBeInTheDocument()
    })

    it("renders the status pill when the feature flag is on", () => {
      renderView({ status: ApplicationStatusEnum.submitted }, withFlag)

      expect(screen.getByText("Submitted")).toBeInTheDocument()
    })

    it("renders the correct label for each status", () => {
      const cases: [ApplicationStatusEnum, string][] = [
        [ApplicationStatusEnum.submitted, "Submitted"],
        [ApplicationStatusEnum.declined, "Declined"],
        [ApplicationStatusEnum.receivedUnit, "Received a unit"],
        [ApplicationStatusEnum.waitlist, "Wait list"],
        [ApplicationStatusEnum.waitlistDeclined, "Wait list - Declined"],
      ]

      cases.forEach(([status, label]) => {
        const { unmount } = renderView({ status, markedAsDuplicate: false }, withFlag)
        expect(screen.getByText(label)).toBeInTheDocument()
        unmount()
      })
    })

    it("renders 'Duplicate' label when markedAsDuplicate is true", () => {
      renderView({ markedAsDuplicate: true }, withFlag)

      expect(screen.getByText("Duplicate")).toBeInTheDocument()
    })
  })
})
