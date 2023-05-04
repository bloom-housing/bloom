import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { StatusBar } from "../../src/blocks/StatusBar"
import { Button } from "../../src/actions/Button"
import { AppearanceStyleType } from "../../src/global/AppearanceTypes"

afterEach(cleanup)

describe("<StatusBar>", () => {
  it("can render without a back button", () => {
    const { getByText, queryByText } = render(
      <StatusBar tagStyle={AppearanceStyleType.primary} tagLabel={"Draft"} />
    )
    expect(getByText("Draft")).not.toBeNull()
    expect(queryByText("Back")).toBeNull()
  })

  it("can render with a back button", () => {
    const onClickSpy = jest.fn()
    const { getByText } = render(
      <StatusBar
        backButton={
          <Button inlineIcon="left" icon="arrowBack" onClick={onClickSpy}>
            Back
          </Button>
        }
        tagLabel="Submitted"
        tagStyle={AppearanceStyleType.success}
      />
    )
    expect(getByText("Submitted")).not.toBeNull()
    expect(getByText("Back")).not.toBeNull()
    fireEvent.click(getByText("Back"))
    expect(onClickSpy).toHaveBeenCalledTimes(1)
  })
})
