import React from "react"
import NewApplication from "../../../../../src/pages/listings/[id]/applications/add"
import { mockNextRouter, render, screen, waitFor } from "../../../../testUtils"
import { setupServer } from "msw/lib/node"
import { rest } from "msw"
import { application, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import userEvent from "@testing-library/user-event"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  ApplicationsService,
  ListingsService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
const server = setupServer()

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()

  // server.use(
  //   rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
  //     return res(ctx.json(listing))
  //   })
  // )
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

function mockJurisdictionsHaveFeatureFlagOn(_featureFlag: string) {
  return false
}

describe("listing applications add page", () => {
  it("should render all application form sections and control buttons", async () => {
    const { pushMock } = mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    jest
      .spyOn(require("../../../../../src/lib/hooks"), "useSingleListingData")
      .mockReturnValue({ listingDto: listing })

    render(
      <AuthContext.Provider
        value={{
          applicationsService: new ApplicationsService(),
          listingsService: new ListingsService(),
          profile: { ...user, listings: [{ id: listing.id }], jurisdictions: [] },
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag),
        }}
      >
        <NewApplication />
      </AuthContext.Provider>
    )

    expect(screen.getByRole("heading", { level: 1, name: /new application/i })).toBeInTheDocument()
    expect(screen.getByText(/draft/i)).toBeInTheDocument()

    //Application form buttons side section
    expect(screen.getByRole("button", { name: /^submit$/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /submit & new/i })).toBeInTheDocument()
    const cancelButton = screen.getByRole("link", { name: /cancel/i })
    expect(cancelButton).toBeInTheDocument()
    expect(cancelButton).toHaveAttribute("href", "/listings/Uvbk5qurpB2WI9V6WnNdH/applications")

    // Check only for sections titles as the components themselves have separate test files
    expect(screen.getByRole("heading", { level: 2, name: /application data/i })).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /primary applicant/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /alternate contact/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /Household members/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /household details/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /application programs/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /declared household income/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /application preferences/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /demographic information/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: /terms/i })).toBeInTheDocument()

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /^submit$/i })
      expect(submitButton).toBeInTheDocument()
      userEvent.click(submitButton)
      expect(pushMock).toHaveBeenCalledWith("/application/application_id")
    })
  })

  it.skip("should navigate to preview on submit click", (done) => {
    const { pushMock } = mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    render(
      <AuthContext.Provider
        value={{
          applicationsService: new ApplicationsService(),
          listingsService: new ListingsService(),
          profile: { ...user, listings: [{ id: listing.id }], jurisdictions: [] },
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag),
        }}
      >
        <NewApplication />
      </AuthContext.Provider>
    )

    expect(screen.getByText(/draft/i)).toBeInTheDocument()
    const submitButton = screen.getByRole("button", { name: /^submit$/i })
    expect(submitButton).toBeInTheDocument()

    new Promise(async () => {
      await act(async () => {
        await userEvent.click(submitButton)
      })

      await waitFor(() => {
        //expect(pushMock).toHaveBeenCalledWith("/application/application_id")
      })
    }).then(() => {
      done()
    })
  })

  it("should navigate to new form on submit & new click", async () => {
    const { pushMock } = mockNextRouter({ id: "test_id" })
    server.use(
      rest.get("http://localhost:3100/listings/test_id", (_req, res, ctx) => {
        return res(ctx.json({ ...listing, listingMultiselectQuestions: [] }))
      }),
      rest.post("http://localhost/api/adapter/applications", (_req, res, ctx) => {
        return res(
          ctx.json({ ...application, programs: [], preferences: [], id: "application_id" })
        )
      })
    )
    render(
      <AuthContext.Provider
        value={{
          applicationsService: new ApplicationsService(),
          listingsService: new ListingsService(),
          profile: { ...user, listings: [{ id: listing.id }], jurisdictions: [] },
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag),
        }}
      >
        <NewApplication />
      </AuthContext.Provider>
    )

    const submitButton = screen.getByRole("button", { name: /submit & new/i })
    expect(submitButton).toBeInTheDocument()
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/listings/test_id/applications/add")
    })
  })
})
