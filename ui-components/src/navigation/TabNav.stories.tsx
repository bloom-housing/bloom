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
// TODO: Fix tab roles for this component in #1489
Default.parameters = {
  a11y: {
    config: {
      rules: [
        {
          id: "no-focusable-content",
          enabled: false,
        },
        {
          id: "nested-interactive",
          enabled: false,
        },
      ],
    },
  },
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

// TODO: Fix tab roles for this component in #1489
Other.parameters = {
  a11y: {
    config: {
      rules: [
        {
          id: "no-focusable-content",
          enabled: false,
        },
        {
          id: "nested-interactive",
          enabled: false,
        },
      ],
    },
  },
}
