import React from "react"
import { render, cleanup } from "@testing-library/react"
import { HeaderBadge } from "../../src/icons/HeaderBadge"

afterEach(cleanup)

describe("<HeaderBadge>", () => {
  it("renders without error", () => {
    render(<HeaderBadge />)
  })
})
