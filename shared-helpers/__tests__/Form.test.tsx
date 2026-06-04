import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Form } from "../src/views/forms/Form"

afterEach(cleanup)

describe("<Form>", () => {
  it("renders with method post", () => {
    const { container } = render(<Form>content</Form>)
    expect(container.querySelector("form")).toHaveAttribute("method", "post")
  })
})
