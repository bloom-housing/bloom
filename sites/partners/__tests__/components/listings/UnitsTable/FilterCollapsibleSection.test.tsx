import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { FilterCollapsibleSection } from "../../../../src/components/listings/UnitsTable/FilterCollapsibleSection"

describe("FilterCollapsibleSection", () => {
  it("starts expanded and toggles its content", () => {
    render(
      <FilterCollapsibleSection title={"Unit type"}>
        <p>Section content</p>
      </FilterCollapsibleSection>
    )

    const toggle = screen.getByRole("button", { name: "Unit type" })
    expect(screen.getByRole("heading", { level: 5, name: "Unit type" })).toBeInTheDocument()
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Section content")).toBeVisible()

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByText("Section content")).not.toBeVisible()

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Section content")).toBeVisible()
  })
})
