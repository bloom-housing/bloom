import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Message } from "../../src/text/Message"

afterEach(cleanup)

describe("<Message>", () => {
  it("renders default state", () => {
    const { getByText } = render(
      <Message>
        <div>Children go here</div>
      </Message>
    )
    expect(getByText("Children go here")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { container, getByText } = render(
      <Message warning={true}>
        <div>Children go here</div>
      </Message>
    )
    expect(getByText("Children go here")).toBeTruthy()
    expect(container.getElementsByClassName("is-warning").length).toBe(1)
  })
})
