import React from "react"
import { setupServer } from "msw/lib/node"
import {
  FeatureFlag,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { HomeResources } from "../../src/components/home/HomeResources"
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

describe("<HomeResources>", () => {
  it("shows the sign up card when the jurisdiction has a notifications sign up url", () => {
    render(
      <HomeResources
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [],
          notificationsSignUpUrl: "https://example.com/signup",
        }}
      />
    )
    const signUpLink = screen.getByRole("link", { name: /sign up today/i })
    expect(signUpLink).toBeInTheDocument()
    expect(signUpLink).toHaveAttribute("href", "https://example.com/signup")
  })

  it("does not show the sign up card when there is no notifications sign up url and the feature flag is off", () => {
    render(
      <HomeResources
        jurisdiction={{ ...jurisdiction, featureFlags: [], notificationsSignUpUrl: undefined }}
      />
    )
    expect(screen.queryByText(/sign up today/i)).not.toBeInTheDocument()
  })

  it("shows the sign up card linking to account notifications when enableCustomListingNotifications is on", () => {
    render(
      <HomeResources
        jurisdiction={{
          ...jurisdiction,
          notificationsSignUpUrl: undefined,
          featureFlags: [
            {
              name: FeatureFlagEnum.enableCustomListingNotifications,
              active: true,
            } as FeatureFlag,
          ],
        }}
      />
    )
    const signUpLink = screen.getByRole("link", { name: /sign up today/i })
    expect(signUpLink).toHaveAttribute("href", "/account/notifications")
  })

  it("shows the resources card when enableResources is toggled on", () => {
    render(
      <HomeResources
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [{ name: FeatureFlagEnum.enableResources, active: true } as FeatureFlag],
        }}
      />
    )
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /See more housing opportunities and resources/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view resources/i })).toHaveAttribute(
      "href",
      "/additional-resources"
    )
  })

  it("does not show the resources card when enableResources is toggled off", () => {
    render(
      <HomeResources
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [{ name: FeatureFlagEnum.enableResources, active: false } as FeatureFlag],
        }}
      />
    )
    expect(screen.queryByText(/view resources/i)).not.toBeInTheDocument()
  })

  it("shows the additional resources card when enableAdditionalResources is toggled on", () => {
    render(
      <HomeResources
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            { name: FeatureFlagEnum.enableAdditionalResources, active: true } as FeatureFlag,
          ],
        }}
      />
    )
    expect(screen.getByRole("link", { name: /learn more/i })).toBeInTheDocument()
  })

  it("does not show the additional resources card when enableAdditionalResources is toggled off", () => {
    render(
      <HomeResources
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            { name: FeatureFlagEnum.enableAdditionalResources, active: false } as FeatureFlag,
          ],
        }}
      />
    )
    expect(screen.queryByText(/learn more/i)).not.toBeInTheDocument()
  })

  it("shows all three cards when all feature flags are toggled on", () => {
    render(
      <HomeResources
        jurisdiction={{
          ...jurisdiction,
          notificationsSignUpUrl: "https://example.com/signup",
          featureFlags: [
            { name: FeatureFlagEnum.enableResources, active: true } as FeatureFlag,
            { name: FeatureFlagEnum.enableAdditionalResources, active: true } as FeatureFlag,
          ],
        }}
      />
    )
    expect(screen.getByRole("link", { name: /sign up today/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view resources/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /learn more/i })).toBeInTheDocument()
  })
})
