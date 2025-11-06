import React from "react"
import { setupServer } from "msw/lib/node"
import { render, waitFor } from "@testing-library/react"
import { mockNextRouter } from "../../../testUtils"
import ApplicationAda from "../../../../src/pages/applications/household/ada"
import ApplicationSummary from "../../../../src/pages/applications/review/summary"
import { AppSubmissionContext } from "../../../../src/lib/applications/AppSubmissionContext"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import { blankApplication } from "@bloom-housing/shared-helpers"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

window.scrollTo = jest.fn()

const server = setupServer()

beforeAll(() => {
  server.listen()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

// NOTE: we'll test a couple pages for this behavior but it's shared across
// most of the Common Application pages
describe("applications pages", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe("back button to ada step", () => {
    it("no listing available should redirect to listings page", async () => {
      const { pushMock } = mockNextRouter()
      const conductor = new ApplicationConductor({}, {})
      render(
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: null,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationAda />
        </AppSubmissionContext.Provider>
      )

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/listings")
      })
    })

    it("listing available should not redirect to listings page", async () => {
      const { pushMock } = mockNextRouter()
      const conductor = new ApplicationConductor({}, {})
      render(
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {} as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationAda />
        </AppSubmissionContext.Provider>
      )

      await waitFor(() => {
        expect(pushMock).not.toHaveBeenCalledWith("/listings")
      })
    })
  })

  describe("back button to summary step", () => {
    it("no listing available should redirect to listings page", async () => {
      const { pushMock } = mockNextRouter()
      const conductor = new ApplicationConductor({}, {})
      render(
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: null,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationSummary />
        </AppSubmissionContext.Provider>
      )

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/listings")
      })
    })

    it("listing available should not redirect to listings page", async () => {
      const { pushMock } = mockNextRouter()
      const conductor = new ApplicationConductor({}, {})
      render(
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {} as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationSummary />
        </AppSubmissionContext.Provider>
      )

      await waitFor(() => {
        expect(pushMock).not.toHaveBeenCalledWith("/listings")
      })
    })
  })
})
