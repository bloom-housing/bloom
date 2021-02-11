import React from "react"

import { TabNav, Tab } from "./TabNav"

export default {
  title: "Navigation/Tab Nav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => {
  return (
    <TabNav>
      <Tab href={"#"}>Other</Tab>
      <Tab href={"#"} current tagContent="15">
        Default
      </Tab>
    </TabNav>
  )
}

export const Other = () => {
  return (
    <TabNav>
      <Tab href={"#"} current>
        Other
      </Tab>
      <Tab href={"#"} tagContent="15">
        Default
      </Tab>
    </TabNav>
  )
}
