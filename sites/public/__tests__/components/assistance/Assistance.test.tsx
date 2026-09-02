import React from "react"
import { screen } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import {
  Jurisdiction,
  JurisdictionContentFields,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../../testUtils"
import Assistance from "../../../src/components/assistance/Assistance"
import { JurisdictionContentContext } from "../../../src/lib/JurisdictionContentContext"

beforeAll(() => mockNextRouter())

const renderAssistance = (contact?: Record<string, string>) =>
  render(
    <JurisdictionContentContext.Provider
      value={(contact ? { contact } : null) as JurisdictionContentFields | null}
    >
      <Assistance jurisdiction={{ featureFlags: [] } as Jurisdiction} />
    </JurisdictionContentContext.Provider>
  )

describe("<Assistance>", () => {
  it("keeps the bundled contact details when the jurisdiction stored none", () => {
    renderAssistance()

    expect(screen.getByRole("link", { name: t("resources.contactEmail") })).toBeInTheDocument()
  })

  it("uses the jurisdiction's email in place of the bundled one", () => {
    renderAssistance({ email: "housing@example.gov" })

    expect(screen.getByRole("link", { name: "housing@example.gov" })).toHaveAttribute(
      "href",
      "mailto:housing@example.gov"
    )
    expect(screen.queryByText(t("resources.contactEmail"))).not.toBeInTheDocument()
  })

  it("shows a phone, address and hours only once the jurisdiction stores them", () => {
    expect(screen.queryByText("Mon to Fri")).not.toBeInTheDocument()

    renderAssistance({
      phone: "555-0100",
      addressHtml: "<p>123 Main St</p>",
      hours: "Mon to Fri",
    })

    expect(screen.getByRole("link", { name: "555-0100" })).toHaveAttribute("href", "tel:555-0100")
    expect(screen.getByText("123 Main St")).toBeInTheDocument()
    expect(screen.getByText("Mon to Fri")).toBeInTheDocument()
  })

  it("hides the email when the jurisdiction emptied it", () => {
    renderAssistance({ email: "" })

    expect(screen.queryByText(t("resources.contactEmail"))).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /@/ })).not.toBeInTheDocument()
  })
})
