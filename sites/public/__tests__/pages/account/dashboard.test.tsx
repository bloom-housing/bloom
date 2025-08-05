import React from "react"
import { render, screen, within } from "@testing-library/react"
import { setupServer } from "msw/lib/node"
import Dashboard from "../../../src/pages/account/dashboard"
import { jurisdiction, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter } from "../../testUtils"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const server = setupServer()

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe("<Dashboard>", () => {
  mockNextRouter()
  it("should render dashboard card without favorites", () => {
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            listings: [],
            jurisdictions: [],
          },
        }}
      >
        <Dashboard jurisdiction={jurisdiction} />
      </AuthContext.Provider>
    )

    const dashboardCards = screen.getAllByRole("article")
    expect(dashboardCards).toHaveLength(2)

    const [myApplicationsCard, accountSettingsCard] = dashboardCards

    // My Applications Card
    expect(
      within(myApplicationsCard).getByRole("heading", { level: 2, name: /my applications/i })
    ).toBeInTheDocument()
    expect(
      within(myApplicationsCard).getByText(
        "See lottery dates and listings for properties for which you've applied"
      )
    ).toBeInTheDocument()

    const viewApplicationButton = within(myApplicationsCard).getByRole("link", {
      name: /view applications/i,
    })
    expect(viewApplicationButton).toBeInTheDocument()
    expect(viewApplicationButton).toHaveAttribute("href", "/account/applications")

    //Account settings card
    expect(
      within(accountSettingsCard).getByRole("heading", { level: 2, name: /account settings/i })
    ).toBeInTheDocument()
    expect(
      within(accountSettingsCard).getByText("Account Settings, email and password")
    ).toBeInTheDocument()

    const updateAccountSettingsButton = within(accountSettingsCard).getByRole("link", {
      name: /update account settings/i,
    })
    expect(updateAccountSettingsButton).toBeInTheDocument()
    expect(updateAccountSettingsButton).toHaveAttribute("href", "/account/edit")

    // My Favorites Card - should not ring-accent-cool-darker
    expect(
      screen.queryByRole("heading", { level: 2, name: /my favorites/i })
    ).not.toBeInTheDocument()
    expect(screen.queryByText("Save listings and check back for updates")).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /view favorites/i })).not.toBeInTheDocument()
  })

  it("should render the favorites dashboard card when flag enabled", () => {
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            listings: [],
            jurisdictions: [],
          },
        }}
      >
        <Dashboard
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              ...jurisdiction.featureFlags,
              {
                name: FeatureFlagEnum.enableListingFavoriting,
                createdAt: new Date(),
                updatedAt: new Date(),
                id: "2ac85a8b-c319-4257-bedb-2db95133fab3",
                description:
                  "When true, a Favorite button is shown for public listings and users can view their favorited listings ",
                active: true,
                jurisdictions: [],
              },
            ],
          }}
        />
      </AuthContext.Provider>
    )

    const dashboardCards = screen.getAllByRole("article")
    expect(dashboardCards).toHaveLength(3)

    const myFavoritesCard = dashboardCards.pop()

    //Favorites card
    expect(
      within(myFavoritesCard).getByRole("heading", { level: 2, name: /my favorites/i })
    ).toBeInTheDocument()
    expect(
      within(myFavoritesCard).getByText("Save listings and check back for updates")
    ).toBeInTheDocument()

    const viewFavoritesButton = within(myFavoritesCard).getByRole("link", {
      name: /view favorites/i,
    })
    expect(viewFavoritesButton).toBeInTheDocument()
    expect(viewFavoritesButton).toHaveAttribute("href", "/account/favorites")
  })

  it("should not render My applications dashboard card if flag enabled", () => {
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            listings: [],
            jurisdictions: [],
          },
        }}
      >
        <Dashboard
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              ...jurisdiction.featureFlags,
              {
                name: FeatureFlagEnum.disableCommonApplication,
                createdAt: new Date(),
                updatedAt: new Date(),
                id: "3ac85a8b-c319-4257-bedb-2db95133fab3",
                description:
                  "When true, the digital common application is not an option for listings",
                active: true,
                jurisdictions: [],
              },
            ],
          }}
        />
      </AuthContext.Provider>
    )

    const dashboardCards = screen.getAllByRole("article")
    expect(dashboardCards).toHaveLength(1)

    const [accountSettingsCard] = dashboardCards

    //Account settings card
    expect(
      within(accountSettingsCard).getByRole("heading", { level: 2, name: /account settings/i })
    ).toBeInTheDocument()
    expect(
      within(accountSettingsCard).getByText("Account Settings, email and password")
    ).toBeInTheDocument()

    // My applications card not present
    expect(
      screen.queryByRole("heading", { level: 2, name: /my applications/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText("See lottery dates and listings for properties for which you've applied")
    ).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /view applications/i })).not.toBeInTheDocument()
  })
})
