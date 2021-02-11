import React from "react"

import { TabNav, Tab } from "./TabNav"

export default {
  title: "Navigation/Tab Nav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  parameters: { actions: { argTypesRegex: "^on[A-Z].*" } },
}

export const Default = () => {
  return (
    <TabNav>
      <Tab href={"/other"}>Other</Tab>
      <Tab href={"/default"} current tagContent="15">
        Default
      </Tab>
    </TabNav>
  )
}

export const Other = () => {
  return (
    <TabNav>
      <Tab href={"/other"} current>
        Other
      </Tab>
      <Tab href={"/default"} tagContent="15">
        Default
      </Tab>
    </TabNav>
  )
}
