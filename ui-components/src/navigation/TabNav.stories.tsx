import React from "react"

import { TabNav, TabNavItem } from "./TabNav"

export default {
  title: "Navigation/Tab-like Nav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  parameters: { actions: { argTypesRegex: "^on[A-Z].*" } },
}

export const Default = () => {
  return (
    <TabNav>
      <TabNavItem href={"/other"}>Other</TabNavItem>
      <TabNavItem href={"/default"} current tagContent="15">
        Default
      </TabNavItem>
    </TabNav>
  )
}

export const Other = () => {
  return (
    <TabNav>
      <TabNavItem href={"/other"} current>
        Other
      </TabNavItem>
      <TabNavItem href={"/default"} tagContent="15">
        Default
      </TabNavItem>
    </TabNav>
  )
}
