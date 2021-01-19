import React from "react"

import { TabNav, Tab } from "./TabNav"

export default {
  title: "Navigation/Tab Nav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => {
  return (
    <TabNav>
      <Tab href="/?path=/story/navigation-tab-nav--other">Other</Tab>
      <Tab href="/?path=/story/navigation-tab-nav--default" current>
        Default
      </Tab>
    </TabNav>
  )
}

export const Other = () => {
  return (
    <TabNav>
      <Tab href="/?path=/story/navigation-tab-nav--other" current>
        Other
      </Tab>
      <Tab href="/?path=/story/navigation-tab-nav--default">Default</Tab>
    </TabNav>
  )
}
