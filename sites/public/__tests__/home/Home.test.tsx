import React from "react"
import { setupServer } from "msw/lib/node"
import {
  FeatureFlag,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { Home } from "../../src/components/home/Home"
import { render, screen, mockNextRouter } from "../testUtils"

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

describe("<Home>", () => {
  it("does not show region if toggled off", () => {
    render(
      <Home
        underConstructionListings={[]}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [{ name: FeatureFlagEnum.enableRegions, active: false } as FeatureFlag],
        }}
      />
    )
    expect(screen.queryByText(/Regions/i)).not.toBeInTheDocument()
  })
  it("does not show under construction if toggled off", () => {
    render(
      <Home
        underConstructionListings={[]}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            { name: FeatureFlagEnum.enableUnderConstructionHome, active: false } as FeatureFlag,
          ],
        }}
      />
    )
    expect(screen.queryByText(/Under Construction/i)).not.toBeInTheDocument()
  })
  it("shows region if toggled on", () => {
    render(
      <Home
        underConstructionListings={[]}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [{ name: FeatureFlagEnum.enableRegions, active: true } as FeatureFlag],
        }}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: /Regions/i })).toBeInTheDocument()
  })
  it("shows under construction if toggled on", () => {
    render(
      <Home
        underConstructionListings={[listing, listing, listing]}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            { name: FeatureFlagEnum.enableUnderConstructionHome, active: true } as FeatureFlag,
          ],
        }}
      />
    )
    expect(
      screen.getByRole("heading", { level: 2, name: /Under Construction/i })
    ).toBeInTheDocument()
  })
  it("does not show under construction if toggled on but with no results for listings", () => {
    render(
      <Home
        underConstructionListings={[]}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            { name: FeatureFlagEnum.enableUnderConstructionHome, active: true } as FeatureFlag,
          ],
        }}
      />
    )
    expect(screen.queryByText(/Under Construction/i)).not.toBeInTheDocument()
  })
  describe("enableHomePageSearchHero", () => {
    it("shows the search hero and hides the default hero button when toggled on", () => {
      render(
        <Home
          underConstructionListings={[]}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableHomePageSearchHero, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(
        screen.getByRole("heading", { level: 1, name: /Apply for affordable housing in/i })
      ).toBeInTheDocument()
      expect(screen.getByRole("tabpanel", { name: "Search by filter" })).toBeInTheDocument()
      expect(screen.getByRole("tabpanel", { name: "Search by property" })).toBeInTheDocument()
      expect(screen.queryByRole("button", { name: "See rentals" })).not.toBeInTheDocument()
    })
    it("shows the default hero button and hides the search hero when toggled off", () => {
      render(
        <Home
          underConstructionListings={[]}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [],
          }}
        />
      )
      expect(screen.getByRole("link", { name: "See rentals" })).toBeInTheDocument()
      expect(screen.queryByText("Search by filter")).not.toBeInTheDocument()
      expect(screen.queryByText("Search by property")).not.toBeInTheDocument()
    })
    it("does not show a mobile hero image when no heroImage is provided", () => {
      const { container } = render(
        <Home
          underConstructionListings={[]}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableHomePageSearchHero, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(container.querySelector(".hero-image-mobile")).not.toBeInTheDocument()
      expect(container.querySelector(".hero-image")).not.toBeInTheDocument()
    })
    it("shows a mobile hero image when heroImage is provided", () => {
      const { container } = render(
        <Home
          underConstructionListings={[]}
          heroImage="test-hero.png"
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableHomePageSearchHero, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      const mobileImage = container.querySelector(".hero-image-mobile img")
      const heroImage = container.querySelector(".hero-image img")
      expect(mobileImage).toHaveAttribute("src", "/images/test-hero.png")
      expect(heroImage).toHaveAttribute("src", "/images/test-hero.png")
    })
  })
})
