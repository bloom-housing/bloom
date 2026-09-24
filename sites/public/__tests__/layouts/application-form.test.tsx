import React from "react"
import { useRouter } from "next/router"
import userEvent from "@testing-library/user-event"
import { addTranslation } from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ApplicationFormLayout from "../../src/layouts/application-form"
import ApplicationConductor from "../../src/lib/applications/ApplicationConductor"
import { StopLightRule } from "../../src/lib/applications/stopLights/stopLightRules"
import { StopLightsProps } from "../../src/lib/applications/stopLights/useStopLightGate"
import { render, screen } from "../testUtils"

// the layout reads router.locale, which mockNextRouter (used elsewhere in this repo) doesn't set
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const redRuleFixture = (overrides: Partial<StopLightRule> = {}): StopLightRule => ({
  key: "ruleOne",
  step: "primaryApplicantName",
  light: "red",
  evaluate: () => true,
  modalTitle: "stopLights.ruleOne.modalTitle",
  alertTitle: "stopLights.ruleOne.alertTitle",
  body: "stopLights.ruleOne.body",
  ...overrides,
})

const stopLightsFixture = (overrides: Partial<StopLightsProps> = {}): StopLightsProps => ({
  rule: null,
  onEditRed: jest.fn(),
  onCancelYellow: jest.fn(),
  onAcknowledgeYellow: jest.fn(),
  ...overrides,
})

const renderLayout = (stopLights: StopLightsProps, listing?: Partial<Listing>) => {
  const conductor = new ApplicationConductor({}, (listing ?? {}) as Listing)

  return render(
    <ApplicationFormLayout
      listingName="Test Listing"
      heading="Your name"
      conductor={conductor}
      stopLights={stopLights}
      progressNavProps={{
        currentPageSection: 1,
        completedSections: 0,
        labels: ["You"],
        mounted: true,
      }}
    >
      <div>Form fields</div>
    </ApplicationFormLayout>
  )
}

describe("ApplicationFormLayout stop lights: return to listings", () => {
  const mockPush = jest.fn()

  beforeAll(() => {
    addTranslation({
      "stopLights.ruleOne.modalTitle": "Rule one modal title",
      "stopLights.ruleOne.alertTitle": "Rule one alert title",
      "stopLights.ruleOne.body": "Rule one body",
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush, locale: "en", query: {} })
  })

  it("routes to the specific listing when the conductor has one", async () => {
    renderLayout(stopLightsFixture({ rule: redRuleFixture() }), {
      id: "listing-id",
      urlSlug: "listing-slug",
    })

    await userEvent.click(screen.getByRole("button", { name: "Return to listings" }))

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith("/en/listing/listing-id/listing-slug")
  })

  // conductor.listing is `{} as Listing` early in the flow (ApplicationConductor.reset),
  // so id/urlSlug can be missing even though the type says they're required
  it("falls back to the listings browse page when the conductor's listing has no id or slug", async () => {
    renderLayout(stopLightsFixture({ rule: redRuleFixture() }))

    await userEvent.click(screen.getByRole("button", { name: "Return to listings" }))

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith("/en/listings")
  })

  it("does not edit when Return to listings is clicked", async () => {
    const onEditRed = jest.fn()
    renderLayout(stopLightsFixture({ rule: redRuleFixture(), onEditRed }), {
      id: "listing-id",
      urlSlug: "listing-slug",
    })

    await userEvent.click(screen.getByRole("button", { name: "Return to listings" }))

    expect(onEditRed).not.toHaveBeenCalled()
  })
})
