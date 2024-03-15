import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { Button, Tag } from "@bloom-housing/ui-seeds"
import { StatusBar } from "../../../src/components/shared/StatusBar"

afterEach(cleanup)

describe("<StatusBar>", () => {
  it("can render without a back button", () => {
    const { getByText, queryByText } = render(
      <StatusBar>
        <Tag variant={"primary"}>Draft</Tag>
      </StatusBar>
    )
    expect(getByText("Draft")).not.toBeNull()
    expect(queryByText("Back")).toBeNull()
  })

  it("can render with a back button", () => {
    const onClickSpy = jest.fn()
    const { getByText } = render(
      <StatusBar backButton={<Button onClick={onClickSpy}>Back</Button>}>
        <Tag variant={"success"}>Submitted</Tag>
      </StatusBar>
    )
    expect(getByText("Submitted")).not.toBeNull()
    expect(getByText("Back")).not.toBeNull()
    fireEvent.click(getByText("Back"))
    expect(onClickSpy).toHaveBeenCalledTimes(1)
  })
})
