import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ViewItem } from "../../src/blocks/ViewItem"

afterEach(cleanup)

describe("<ViewItem>", () => {
  it("can render all optional props", () => {
    const { getByText } = render(
      <ViewItem
        label="Address"
        flagged={true}
        helper={"Helper Text"}
        id="1234"
        className={"custom-class"}
        truncated={true}
      >
        1112 Springfield St.
      </ViewItem>
    )
    expect(getByText("1112 Springfield St.")).not.toBeNull()
    expect(getByText("Address")).not.toBeNull()
    expect(getByText("Helper Text")).not.toBeNull()
  })
})
