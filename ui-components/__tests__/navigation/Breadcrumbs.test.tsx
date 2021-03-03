import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Breadcrumbs, BreadcrumbLink } from "../../src/navigation/Breadcrumbs"

afterEach(cleanup)

describe("<Breadcrumbs>", () => {
  it("renders without error", () => {
    const { getByText } = render(
      <Breadcrumbs>
        <BreadcrumbLink href="/One">One</BreadcrumbLink>
        <BreadcrumbLink href="/Two">Two</BreadcrumbLink>
        <BreadcrumbLink current={true} href="/Three">
          Three
        </BreadcrumbLink>
      </Breadcrumbs>
    )
    expect(getByText("One")).toBeTruthy()
    expect(getByText("One").closest("a")?.getAttribute("href")).toBe("/One")
    expect(getByText("Two")).toBeTruthy()
    expect(getByText("Two").closest("a")?.getAttribute("href")).toBe("/Two")
    expect(getByText("Three")).toBeTruthy()
    expect(getByText("Three").closest("a")?.getAttribute("href")).toBe("/Three")
  })
})
