import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { Tabs, TabList, Tab, TabPanel } from "../../src/navigation/Tabs"

afterEach(cleanup)

describe("<Tabs>", () => {
  it("outputs the right class names", () => {
    const { container, getByText } = render(
      <Tabs defaultIndex={1}>
        <TabList>
          <Tab className="other-tab">Other</Tab>
          <Tab className="default-tab">Default</Tab>
        </TabList>
        <TabPanel className="other-panel">OtherPanel</TabPanel>
        <TabPanel className="default-panel">DefaultPanel</TabPanel>
      </Tabs>
    )

    expect(getByText("Other")).toBeTruthy()
    expect(container.getElementsByClassName("other-tab").length).toBe(1)
    expect(container.getElementsByClassName("other-panel").length).toBe(1)

    expect(getByText("Default")).toBeTruthy()
    expect(container.getElementsByClassName("default-tab").length).toBe(1)
    expect(container.getElementsByClassName("default-panel").length).toBe(1)

    expect(container.querySelectorAll(".tabs__tab.is-active").length).toBe(1)
    expect(container.querySelectorAll(".tabs__panel.is-active").length).toBe(1)
  })
})
