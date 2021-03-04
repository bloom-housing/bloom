import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Form } from "../../src/forms/Form"
import { useForm } from "react-hook-form"

afterEach(cleanup)

describe("<Form>", () => {
  it("renders without error", () => {
    const { getByText } = render(<Form onSubmit={() => {}}>Children go here</Form>)
    expect(getByText("Children go here")).not.toBeNull()
  })
})
