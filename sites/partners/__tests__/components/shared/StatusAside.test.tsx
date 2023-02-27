import React from "react"
import { render, cleanup } from "@testing-library/react"
import { StatusAside } from "../../../src/components/shared/StatusAside"

afterEach(cleanup)

describe("<StatusAside>", () => {
  it("renders without error", () => {
    const { getByText } = render(
      <StatusAside
        actions={[
          <div key={0}>
            <strong>Action 1</strong>
          </div>,
          <div key={1}>
            <strong>Action 2</strong>
          </div>,
        ]}
      >
        Status Message Goes Here
      </StatusAside>
    )
    expect(getByText("Action 1")).toBeTruthy()
    expect(getByText("Action 2")).toBeTruthy()
    expect(getByText("Status Message Goes Here")).toBeTruthy()
  })
})
