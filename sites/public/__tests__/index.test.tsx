import React from "react"
import { render, cleanup } from "@testing-library/react"
import Home from "../pages/index"
import { t } from "@bloom-housing/ui-components"

afterEach(cleanup)

describe("<page: index>", () => {
  it("can render all optional props", () => {
    const { getByText } = render(<Home listings={[]} />)
    expect(getByText(t("pageDescription.welcome", { regionName: t("region.name") }))).toBeTruthy()
  })
})
