import React from "react"
import { render, cleanup } from "@testing-library/react"
import { SideNav } from "../../src/prototypes/SideNav"

afterEach(cleanup)

describe("<SideNav>", () => {
  it("renders default state", () => {
    const { getByText } = render(
      <SideNav>
        <div>Child1</div>
        <div>Child2</div>
        <div>Child3</div>
      </SideNav>
    )
    expect(getByText("Child1")).toBeTruthy()
    expect(getByText("Child2")).toBeTruthy()
    expect(getByText("Child3")).toBeTruthy()
  })
})
