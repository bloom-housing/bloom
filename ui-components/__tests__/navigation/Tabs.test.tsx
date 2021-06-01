import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { Tabs, TabList, Tab, TabPanel } from "../../src/navigation/Tabs"

afterEach(cleanup)

describe("<Tabs>", () => {
  it("displays the right CSS", () => {
    const { container, getByText } = render(
      <Tabs defaultIndex={1}>
        <TabList>
          <Tab className="other-tab">Other</Tab>
          <Tab className="default-tab">Default</Tab>
        </TabList>
        <TabPanel>OtherPanel</TabPanel>
        <TabPanel>DefaultPanel</TabPanel>
      </Tabs>
    )
    expect(getByText("Other")).toBeTruthy()
    expect(getByText("Other").getAttribute("class")).toBe("tabs__tab other-tab")
    expect(getByText("Default")).toBeTruthy()
    expect(getByText("Default").getAttribute("class")).toBe(
      "tabs__tab default-tab react-tabs__tab--selected"
    )
  })
})
