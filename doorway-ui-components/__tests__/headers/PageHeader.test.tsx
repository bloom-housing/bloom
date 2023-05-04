import React from "react"
import { render, cleanup } from "@testing-library/react"
import { PageHeader } from "../../src/headers/PageHeader"

afterEach(cleanup)

describe("<PageHeader>", () => {
  it("renders with just title", () => {
    const { getByText } = render(<PageHeader title={<>Title</>} />)
    expect(getByText("Title")).toBeTruthy()
  })
  it("renders with subtitle and children", () => {
    const { container, getByText } = render(
      <PageHeader
        title={<>Title</>}
        subtitle={"Subtitle"}
        inverse={true}
        className={"custom-class"}
      >
        Even More Content
      </PageHeader>
    )
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
    expect(getByText("Title")).toBeTruthy()
    expect(getByText("Subtitle")).toBeTruthy()
    expect(getByText("Even More Content")).toBeTruthy()
  })
})
