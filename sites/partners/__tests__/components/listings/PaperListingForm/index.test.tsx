import React from "react"
import { screen } from "@testing-library/react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../testUtils"
import { rest } from "msw"
import ListingForm from "../../../../src/components/listings/PaperListingForm"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("add listing", () => {
  it("should render the add listing page", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({ id: "user1", userRoles: { id: "user1", isAdmin: true, isPartner: false } })
        )
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([]))
      })
    )
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag: FeatureFlagEnum) => {
            switch (featureFlag) {
              case FeatureFlagEnum.swapCommunityTypeWithPrograms:
                return false
              default:
                return false
            }
          },
        }}
      >
        <ListingForm />
      </AuthContext.Provider>
    )

    // Listing Details Tab
    expect(screen.getByRole("button", { name: "Listing Details" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing Intro" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing Photo" }))
    expect(screen.getByRole("heading", { level: 2, name: "Building Details" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing Units" }))
    expect(screen.getByRole("heading", { level: 2, name: "Housing Preferences" }))
    expect(screen.getByRole("heading", { level: 2, name: "Housing Programs" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional Fees" }))
    expect(screen.getByRole("heading", { level: 2, name: "Building Features" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional Eligibility Rules" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional Details" }))

    // Application Process tab
    expect(screen.getByRole("button", { name: "Application Process" }))
    expect(screen.getByRole("heading", { level: 2, name: "Rankings & Results" }))
    expect(screen.getByRole("heading", { level: 2, name: "Leasing Agent" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application Types" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application Address" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application Dates" }))

    // Action buttons
    expect(screen.getByRole("button", { name: "Publish" }))
    expect(screen.getByRole("button", { name: "Save as Draft" }))
    expect(screen.getByRole("button", { name: "Exit" }))
  })

  it.todo("should successfully save and show correct toast")
  it.todo("should open the save before exit dialog when exiting")
  it.todo("should open the close listing dialog when closing listing")
  it.todo("should open the publish listing dialog when publishing listing")
  it.todo("should open the live confirmation dialog when listing is already active")
  it.todo("should open the listing approval dialog when submitting for approval")
  it.todo("should open the request changes dialog when requesting changes")
})
