import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { Form } from "../src/views/forms/Form"

afterEach(cleanup)

describe("<Form>", () => {
  it("defaults to method post", () => {
    const { container } = render(<Form>content</Form>)
    expect(container.querySelector("form")).toHaveAttribute("method", "post")
  })

  it("accepts method get", () => {
    const { container } = render(<Form method="get">content</Form>)
    expect(container.querySelector("form")).toHaveAttribute("method", "get")
  })

  it("calls onBlur when a field inside the form loses focus", () => {
    const onBlur = jest.fn()
    const { container } = render(
      <Form onBlur={onBlur}>
        <input aria-label="field" />
      </Form>
    )

    fireEvent.blur(container.querySelector("input"))

    expect(onBlur).toHaveBeenCalledTimes(1)
  })
})
