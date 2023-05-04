import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ProgressNav } from "../../src/navigation/ProgressNav"

afterEach(cleanup)

describe("<ProgressNav>", () => {
  it("renders without error", () => {
    const { getByText } = render(
      <ProgressNav
        currentPageSection={2}
        completedSections={1}
        labels={["You", "Household", "Income", "Preferences", "Review"]}
        mounted={true}
      />
    )
    expect(getByText("You")).toBeTruthy()
    expect(getByText("Household")).toBeTruthy()
    expect(getByText("Income")).toBeTruthy()
    expect(getByText("Preferences")).toBeTruthy()
    expect(getByText("Review")).toBeTruthy()
  })
})
