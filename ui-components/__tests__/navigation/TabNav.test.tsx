import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { TabNav, Tab } from "../../src/navigation/TabNav"

afterEach(cleanup)

describe("<TabNav>", () => {
  it("can switch tabs with the keyboard", () => {
    const { getByText } = render(
      <TabNav>
        <Tab href={"/other"}>Other</Tab>
        <Tab href={"/default"} current tagContent="15">
          Default
        </Tab>
      </TabNav>
    )
    expect(getByText("Other")).toBeTruthy()
    expect(getByText("Other").closest("a")?.getAttribute("href")).toBe("/other")
    expect(getByText("Default")).toBeTruthy()
    expect(getByText("Default").closest("a")?.getAttribute("href")).toBe("/default")
    expect(getByText("15")).toBeTruthy()
    fireEvent.focus(getByText("Default"))
    expect(getByText("Default") === document.activeElement)
    fireEvent.keyUp(getByText("Default"), { key: "ArrowLeft", code: "ArrowLeft" })
    expect(getByText("Other") === document.activeElement)
    fireEvent.keyUp(getByText("Other"), { key: "ArrowRight", code: "ArrowRight" })
    expect(getByText("Default") === document.activeElement)
  })
})
