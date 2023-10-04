import React from "react"
import { render, cleanup } from "@testing-library/react"
import { StatusMessage, StatusMessages } from "../../src/notifications/StatusMessage"
import { AppearanceStyleType } from "@bloom-housing/ui-components"

afterEach(cleanup)

describe("<StatusMessage>", () => {
  it("can render with no messages", () => {
    const { getByText } = render(<StatusMessages lastTimestamp="August 25, 2021"></StatusMessages>)
    expect(getByText("Last Updated", { exact: false })).toBeTruthy()
  })
  it("can render with messages", () => {
    const { getByText } = render(
      <StatusMessages>
        <StatusMessage
          status="Submitted"
          style={AppearanceStyleType.success}
          timestamp="3/2/21"
          body="Additional details here."
        />
        <StatusMessage status="Draft" timestamp="2/1/21" />
      </StatusMessages>
    )
    expect(getByText("Status History")).toBeTruthy()
    expect(getByText("Submitted")).toBeTruthy()
    expect(getByText("Draft")).toBeTruthy()
    expect(getByText("Additional details here.")).toBeTruthy()
    expect(getByText("3/2/21")).toBeTruthy()
    expect(getByText("2/1/21")).toBeTruthy()
  })
})
