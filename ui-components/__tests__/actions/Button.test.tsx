import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { Button } from "../../src/actions/Button"
import { AppearanceSizeType } from "../../src/global/AppearanceTypes"

afterEach(cleanup)

describe("<Button>", () => {
  it("calls onClick when clicked", () => {
    const onClickSpy = jest.fn()
    const { getByText } = render(
      <Button size={AppearanceSizeType.small} onClick={onClickSpy}>
        Button Content
      </Button>
    )

    expect(getByText("Button Content")).not.toBeNull()
    fireEvent.click(getByText("Button Content"))
    expect(onClickSpy).toHaveBeenCalledTimes(1)
  })

  it("adds correct classes for an inline left icon", () => {
    const onClickSpy = jest.fn()
    const { container, getByText } = render(
      <Button
        size={AppearanceSizeType.small}
        onClick={onClickSpy}
        inlineIcon={"left"}
        icon={`arrowDown`}
      >
        Button Content
      </Button>
    )

    expect(getByText("Button Content")).not.toBeNull()
    expect(container.getElementsByClassName("has-icon-left").length).toBe(1)
  })

  it("adds correct classes for an inline right icon", () => {
    const onClickSpy = jest.fn()
    const { container, getByText } = render(
      <Button
        size={AppearanceSizeType.small}
        onClick={onClickSpy}
        inlineIcon={"right"}
        icon={`arrowDown`}
      >
        Button Content
      </Button>
    )

    expect(getByText("Button Content")).not.toBeNull()
    expect(container.getElementsByClassName("has-icon-right").length).toBe(1)
  })

  it("adds correct classes for a standard left icon", () => {
    const onClickSpy = jest.fn()
    const { container, getByText } = render(
      <Button
        size={AppearanceSizeType.small}
        onClick={onClickSpy}
        iconPlacement={"left"}
        icon={`arrowDown`}
      >
        Button Content
      </Button>
    )

    expect(getByText("Button Content")).not.toBeNull()
    expect(container.getElementsByClassName("has-icon-left").length).toBe(1)
  })

  it("adds correct classes for a standard right icon", () => {
    const onClickSpy = jest.fn()
    const { container, getByText } = render(
      <Button
        size={AppearanceSizeType.small}
        onClick={onClickSpy}
        iconPlacement={"right"}
        icon={`arrowDown`}
      >
        Button Content
      </Button>
    )

    expect(getByText("Button Content")).not.toBeNull()
    expect(container.getElementsByClassName("has-icon-right").length).toBe(1)
  })

  it("adds correct classes for extra optional styles", () => {
    const onClickSpy = jest.fn()
    const { container, getByText } = render(
      <Button
        size={AppearanceSizeType.small}
        onClick={onClickSpy}
        unstyled={true}
        fullWidth={true}
        className={"extra-special-extra-class"}
      >
        Button Content
      </Button>
    )

    expect(getByText("Button Content")).not.toBeNull()
    expect(container.getElementsByClassName("is-unstyled").length).toBe(1)
    expect(container.getElementsByClassName("is-fullwidth").length).toBe(1)
    expect(container.getElementsByClassName("extra-special-extra-class").length).toBe(1)
  })
})
