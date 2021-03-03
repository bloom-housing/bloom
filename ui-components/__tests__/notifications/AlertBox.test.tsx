import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { AlertBox } from "../../src/notifications/AlertBox"

afterEach(cleanup)

describe("<AlertBox>", () => {
  it("warning default renders successfully", () => {
    const onCloseSpy = jest.fn()
    const { getByText, getByRole } = render(
      <AlertBox onClose={onCloseSpy} type="alert">
        Some warning
      </AlertBox>
    )
    expect(getByText("Some warning")).toBeTruthy()
    expect(getByRole("alert")).toBeTruthy()
    fireEvent.click(getByRole("button"))
    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
  it("warning inverted renders successfully", () => {
    const onCloseSpy = jest.fn()
    const { getByText, getByRole } = render(
      <AlertBox onClose={onCloseSpy} type="alert" inverted>
        Some warning
      </AlertBox>
    )
    expect(getByText("Some warning")).toBeTruthy()
    expect(getByRole("alert")).toBeTruthy()
    fireEvent.click(getByRole("button"))
    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
  it("notice default renders successfully", () => {
    const onCloseSpy = jest.fn()
    const { getByText, getByRole } = render(
      <AlertBox onClose={onCloseSpy} type="notice">
        Some notice
      </AlertBox>
    )
    expect(getByText("Some notice")).toBeTruthy()
    expect(getByRole("alert")).toBeTruthy()
    fireEvent.click(getByRole("button"))
    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
  it("notice inverted renders successfully", () => {
    const onCloseSpy = jest.fn()
    const { getByText, getByRole } = render(
      <AlertBox onClose={onCloseSpy} type="notice" inverted>
        Some notice
      </AlertBox>
    )
    expect(getByText("Some notice")).toBeTruthy()
    expect(getByRole("alert")).toBeTruthy()
    fireEvent.click(getByRole("button"))
    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
  it("success default renders successfully", () => {
    const onCloseSpy = jest.fn()
    const { getByText, getByRole } = render(
      <AlertBox onClose={onCloseSpy} type="success">
        Some success
      </AlertBox>
    )
    expect(getByText("Some success")).toBeTruthy()
    expect(getByRole("alert")).toBeTruthy()
    fireEvent.click(getByRole("button"))
    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
  it("success inverted renders successfully", () => {
    const onCloseSpy = jest.fn()
    const { getByText, getByRole } = render(
      <AlertBox onClose={onCloseSpy} type="success" inverted>
        Some success
      </AlertBox>
    )
    expect(getByText("Some success")).toBeTruthy()
    expect(getByRole("alert")).toBeTruthy()
    fireEvent.click(getByRole("button"))
    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
  it("can auto create onClose function", () => {
    const { queryByText, getByText, getByRole, container } = render(
      <AlertBox className={"custom-class"} closeable>
        <strong>Some success</strong>
      </AlertBox>
    )
    expect(getByText("Some success")).toBeTruthy()
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
    expect(getByRole("alert")).toBeTruthy()
    fireEvent.click(getByRole("button"))
    expect(queryByText("Some success")).toBeNull()
  })
})
