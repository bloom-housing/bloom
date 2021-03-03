import React from "react"
import { render, cleanup } from "@testing-library/react"
import { AlertNotice } from "../../src/notifications/AlertNotice"

afterEach(cleanup)

describe("<AlertNotice>", () => {
  it("warning default renders successfully", () => {
    const { getByText } = render(
      <AlertNotice title={"Your household income is too low."}>
        <p>Explanatory text</p>
      </AlertNotice>
    )
    expect(getByText("Your household income is too low.")).toBeTruthy()
    expect(getByText("Explanatory text")).toBeTruthy()
  })
  it("warning inverted renders successfully", () => {
    const { getByText } = render(
      <AlertNotice title={"Your household income is too low."} inverted>
        <p>Explanatory text</p>
      </AlertNotice>
    )
    expect(getByText("Your household income is too low.")).toBeTruthy()
    expect(getByText("Explanatory text")).toBeTruthy()
  })
  it("notice default renders successfully", () => {
    const { getByText } = render(
      <AlertNotice title={"Your household income is too low."} type={"notice"}>
        <p>Explanatory text</p>
      </AlertNotice>
    )
    expect(getByText("Your household income is too low.")).toBeTruthy()
    expect(getByText("Explanatory text")).toBeTruthy()
  })
  it("notice inverted renders successfully", () => {
    const { getByText } = render(
      <AlertNotice title={"Your household income is too low."} type={"notice"} inverted>
        <p>Explanatory text</p>
      </AlertNotice>
    )
    expect(getByText("Your household income is too low.")).toBeTruthy()
    expect(getByText("Explanatory text")).toBeTruthy()
  })
  it("success default renders successfully", () => {
    const { getByText } = render(
      <AlertNotice title={"Your household income is too low."} type={"success"}>
        <p>Explanatory text</p>
      </AlertNotice>
    )
    expect(getByText("Your household income is too low.")).toBeTruthy()
    expect(getByText("Explanatory text")).toBeTruthy()
  })
  it("success inverted renders successfully", () => {
    const { getByText } = render(
      <AlertNotice title={"Your household income is too low."} type={"success"} inverted>
        <p>Explanatory text</p>
      </AlertNotice>
    )
    expect(getByText("Your household income is too low.")).toBeTruthy()
    expect(getByText("Explanatory text")).toBeTruthy()
  })
  it("can auto create onClose function", () => {
    const { getByText, container } = render(
      <AlertNotice
        title={<strong>Your household income is too low.</strong>}
        className={"custom-class"}
      >
        Explanatory text
      </AlertNotice>
    )
    expect(getByText("Your household income is too low.")).toBeTruthy()
    expect(getByText("Explanatory text")).toBeTruthy()
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
  })
})
