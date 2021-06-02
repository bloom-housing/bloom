import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Textarea } from "../../src/forms/Textarea"

afterEach(cleanup)

describe("<Textarea>", () => {
  it("renders default state", () => {
    const { getByText } = render(<Textarea name={"textarea-test"} label={"Textarea Label"} />)
    expect(getByText("Textarea Label")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { getByPlaceholderText, getByText } = render(
      <Textarea
        name={"textarea-test"}
        label={"Textarea Label"}
        cols={5}
        rows={10}
        wrap={"hard"}
        placeholder={"Custom placeholder"}
        resize={false}
        errorMessage={"Error message"}
      />
    )
    expect(getByText("Textarea Label")).toBeTruthy()
    expect(getByText("Error message")).toBeTruthy()
    expect(getByPlaceholderText("Custom placeholder")).toBeTruthy()
  })
})
