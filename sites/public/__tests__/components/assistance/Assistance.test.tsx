import React from "react"
import { cleanup, screen } from "@testing-library/react"
import { mockNextRouter, render } from "../../testUtils"
import {
  FeatureFlag,
  FeatureFlagEnum,
  Jurisdiction,
  JurisdictionContentFields,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Assistance from "../../../src/components/assistance/Assistance"
import { JurisdictionContentContext } from "../../../src/lib/JurisdictionContentContext"
import { t } from "@bloom-housing/ui-components"
import { setupServer } from "msw/lib/node"

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

describe("Assistance", () => {
  const createMockJurisdiction = (enabledFlags: FeatureFlagEnum[] = []): Jurisdiction =>
    ({
      id: "id1",
      featureFlags: enabledFlags.map(
        (flag) =>
          ({
            name: flag,
            active: true,
          } as FeatureFlag)
      ),
    } as Jurisdiction)

  it("renders housing basics card when enableHousingBasics flag is enabled", () => {
    const jurisdiction = createMockJurisdiction([FeatureFlagEnum.enableHousingBasics])
    render(<Assistance jurisdiction={jurisdiction} />)

    expect(
      screen.getByRole("heading", { name: "How to apply to affordable housing", level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("heading", {
        name: "Additional housing opportunities and resources",
        level: 2,
      })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "Frequently asked questions", level: 2 })
    ).not.toBeInTheDocument()
  })

  it("renders FAQ card when enableFaq flag is enabled", () => {
    const jurisdiction = createMockJurisdiction([FeatureFlagEnum.enableFaq])
    render(<Assistance jurisdiction={jurisdiction} />)

    expect(
      screen.getByRole("heading", { name: "Frequently asked questions", level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("heading", {
        name: "Additional housing opportunities and resources",
        level: 2,
      })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "How to apply to affordable housing", level: 2 })
    ).not.toBeInTheDocument()
  })

  it("renders resources card when enableResources flag is enabled", () => {
    const jurisdiction = createMockJurisdiction([FeatureFlagEnum.enableResources])
    render(<Assistance jurisdiction={jurisdiction} />)

    expect(
      screen.getByRole("heading", {
        name: "Additional housing opportunities and resources",
        level: 2,
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "Frequently asked questions", level: 2 })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "How to apply to affordable housing", level: 2 })
    ).not.toBeInTheDocument()
  })

  it("renders all cards when all feature flags are enabled", () => {
    const jurisdiction = createMockJurisdiction([
      FeatureFlagEnum.enableHousingBasics,
      FeatureFlagEnum.enableFaq,
      FeatureFlagEnum.enableResources,
    ])
    render(<Assistance jurisdiction={jurisdiction} />)

    expect(
      screen.getByRole("heading", { name: "How to apply to affordable housing", level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Frequently asked questions", level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", {
        name: "Additional housing opportunities and resources",
        level: 2,
      })
    ).toBeInTheDocument()
  })
})

describe("Assistance stored contact details", () => {
  const renderWithContact = (contact?: Record<string, string>) =>
    render(
      <JurisdictionContentContext.Provider
        value={(contact ? { contact } : null) as JurisdictionContentFields | null}
      >
        <Assistance jurisdiction={{ id: "id1", featureFlags: [] } as Jurisdiction} />
      </JurisdictionContentContext.Provider>
    )

  it("keeps the bundled contact details when the jurisdiction stored none", () => {
    renderWithContact()

    expect(screen.getByRole("link", { name: t("resources.contactEmail") })).toBeInTheDocument()
  })

  it("uses the jurisdiction's email in place of the bundled one", () => {
    renderWithContact({ email: "housing@example.gov" })

    expect(screen.getByRole("link", { name: "housing@example.gov" })).toHaveAttribute(
      "href",
      "mailto:housing@example.gov"
    )
    expect(screen.queryByText(t("resources.contactEmail"))).not.toBeInTheDocument()
  })

  it("shows a phone, address and hours only once the jurisdiction stores them", () => {
    renderWithContact({
      phone: "555-0100",
      addressHtml: "<p>123 Main St</p>",
      hours: "Mon to Fri",
    })

    expect(screen.getByRole("link", { name: "555-0100" })).toHaveAttribute("href", "tel:555-0100")
    expect(screen.getByText("123 Main St")).toBeInTheDocument()
    expect(screen.getByText("Mon to Fri")).toBeInTheDocument()
  })

  it("hides the email when the jurisdiction emptied it", () => {
    renderWithContact({ email: "" })

    expect(screen.queryByText(t("resources.contactEmail"))).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /@/ })).not.toBeInTheDocument()
  })
})
