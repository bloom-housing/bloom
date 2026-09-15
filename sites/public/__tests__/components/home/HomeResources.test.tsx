import { setupServer } from "msw/lib/node"
import React from "react"
import {
  FeatureFlag,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render, screen } from "../../testUtils"
import { HomeResources } from "../../../src/components/home/HomeResources"

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
  describe("additionalResourcesCard", () => {
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
  })

  describe("getAssistanceCard", () => {
    it("shows the get assistance card when enableGetAssistanceCard is toggled on", () => {
      render(
        <HomeResources
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableGetAssistanceCard, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(screen.getByRole("link", { name: /read more/i })).toHaveAttribute(
        "href",
        "/get-assistance"
      )
    })

    it("does not show the get assistance card when enableGetAssistanceCard is toggled off", () => {
      render(
        <HomeResources
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableGetAssistanceCard, active: false } as FeatureFlag,
            ],
          }}
        />
      )
      expect(screen.queryByText(/read more/i)).not.toBeInTheDocument()
    })
  })

  describe("notificationsCard", () => {
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
  })

  describe("resourcesCard", () => {
    it("shows the resources card when enableResourcesCard is toggled on", () => {
      render(
        <HomeResources
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableResourcesCard, active: true } as FeatureFlag,
            ],
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

    it("does not show the resources card when enableResourcesCard is toggled off", () => {
      render(
        <HomeResources
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableResourcesCard, active: false } as FeatureFlag,
            ],
          }}
        />
      )
      expect(screen.queryByText(/view resources/i)).not.toBeInTheDocument()
    })
  })

  describe("seeOurDataCard", () => {
    it("shows the see our data card when enableSeeOurData is toggled on", () => {
      render(
        <HomeResources
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [{ name: FeatureFlagEnum.enableSeeOurData, active: true } as FeatureFlag],
          }}
        />
      )
      expect(screen.getByRole("link", { name: /see data/i })).toBeInTheDocument()
    })

    it("does not show the see our data card when enableSeeOurData is toggled off", () => {
      render(
        <HomeResources
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableSeeOurData, active: false } as FeatureFlag,
            ],
          }}
        />
      )
      expect(screen.queryByText(/see data/i)).not.toBeInTheDocument()
    })
  })

  it("shows all cards when all feature flags are toggled on", () => {
    const { container } = render(
      <HomeResources
        jurisdiction={{
          ...jurisdiction,
          notificationsSignUpUrl: "https://example.com/signup",
          featureFlags: [
            { name: FeatureFlagEnum.enableAdditionalResources, active: true } as FeatureFlag,
            { name: FeatureFlagEnum.enableGetAssistanceCard, active: true } as FeatureFlag,
            { name: FeatureFlagEnum.enableResourcesCard, active: true } as FeatureFlag,
            { name: FeatureFlagEnum.enableSeeOurData, active: true } as FeatureFlag,
          ],
        }}
      />
    )

    expect(screen.getByRole("link", { name: /read more/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /sign up today/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view resources/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /learn more/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /see data/i })).toBeInTheDocument()

    // odd number of cards greater than 1 should have 3 columns
    expect(container.querySelector("[data-columns='3']")).toBeInTheDocument()
  })

  it("should have two columns when there are four cards", () => {
    const { container } = render(
      <HomeResources
        jurisdiction={{
          ...jurisdiction,
          notificationsSignUpUrl: undefined,
          featureFlags: [
            { name: FeatureFlagEnum.enableAdditionalResources, active: true } as FeatureFlag,
            { name: FeatureFlagEnum.enableGetAssistanceCard, active: true } as FeatureFlag,
            { name: FeatureFlagEnum.enableResourcesCard, active: true } as FeatureFlag,
            { name: FeatureFlagEnum.enableSeeOurData, active: true } as FeatureFlag,
          ],
        }}
      />
    )

    expect(screen.getByRole("link", { name: /read more/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view resources/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /learn more/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /see data/i })).toBeInTheDocument()

    // even number of cards 2 columns
    expect(container.querySelector("[data-columns='2']")).toBeInTheDocument()
  })

  it("should have two columns when there is only one card", () => {
    const { container } = render(
      <HomeResources
        jurisdiction={{
          ...jurisdiction,
          notificationsSignUpUrl: undefined,
          featureFlags: [
            { name: FeatureFlagEnum.enableAdditionalResources, active: true } as FeatureFlag,
          ],
        }}
      />
    )

    expect(screen.getByRole("link", { name: /learn more/i })).toBeInTheDocument()

    // 1 column for 1 card
    expect(container.querySelector("[data-columns='2']")).toBeInTheDocument()
  })
})
